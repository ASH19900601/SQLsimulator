import {createEngine} from './engine.js';

const key = value => String(value ?? '').toLowerCase();
const sortRows = rows => [...rows].sort((a, b) => JSON.stringify(a).localeCompare(JSON.stringify(b)));

function sameCell(a, b) {
  if (a === b) return true;
  if (typeof a !== 'number' || typeof b !== 'number' || !Number.isFinite(a) || !Number.isFinite(b)) return false;
  if (Number.isInteger(a) && Number.isInteger(b)) return false;
  // Allow evaluation noise, without rounding small real values to zero.
  return Math.abs(a - b) <= Number.EPSILON * 8 * Math.max(Math.abs(a), Math.abs(b), Number.MIN_VALUE);
}

function sameRows(a, b, ordered = false) {
  if (a.length !== b.length) return false;
  const equalRow = (left, right) => left.length === right.length && left.every((value, index) => sameCell(value, right[index]));
  if (ordered) return a.every((row, index) => equalRow(row, b[index]));
  // Consume matches so duplicate rows remain significant. Matching rather than string sorting
  // also handles harmless floating-point differences beside another projected field.
  const remaining = [...b];
  for (const row of a) {
    const index = remaining.findIndex(other => equalRow(row, other));
    if (index < 0) return false;
    remaining.splice(index, 1);
  }
  return true;
}

export function sameResult(a, b, ordered = false) {
  return a.columns.length === b.columns.length && sameRows(a.rows, b.rows, ordered);
}

function typeKey(type) {
  const value = String(type).toUpperCase().replace(/\s/g, '');
  const [, base = '', width = ''] = /^([A-Z]+)(.*)$/.exec(value) || [];
  if (width && ['CHAR', 'CHARACTER', 'VARCHAR'].includes(base)) return `VARCHAR${width}`;
  const aliases = {INT:'INTEGER', CHAR:'CHARACTER', FLOAT:'REAL', CURRENCY:'REAL'};
  return `${aliases[base] || base}${width}`;
}

function foreignKeyState(keys) {
  const groups = new Map();
  keys.forEach((fk, index) => {
    const id = fk.id ?? index;
    if (!groups.has(id)) groups.set(id, []);
    groups.get(id).push({seq: Number(fk.seq) || 0,
      table: key(fk.table), from: key(fk.from), to: key(fk.to),
      onUpdate: String(fk.on_update || 'NO ACTION').toUpperCase(),
      onDelete: String(fk.on_delete || 'NO ACTION').toUpperCase(),
      match: String(fk.match || 'NONE').toUpperCase()});
  });
  return [...groups.values()]
    .map(group => group.sort((a, b) => a.seq - b.seq).map(({seq, ...rest}) => rest))
    .sort((a, b) => JSON.stringify(a).localeCompare(JSON.stringify(b)));
}

function tableState(tables) {
  return tables.map(table => {
    const fields = table.columns.map((column, index) => ({column, index}))
      .sort((a, b) => key(a.column.name).localeCompare(key(b.column.name)));
    return {name: key(table.name),
      columns: fields.map(({column}) => ({name: key(column.name), type: typeKey(column.type),
        pk: !!column.pk, notnull: !!column.notnull || !!column.pk})),
      rows: sortRows(table.rows.map(row => fields.map(({index}) => row[index]))),
      foreignKeys: foreignKeyState(table.foreignKeys || [])};
  }).sort((a, b) => a.name.localeCompare(b.name));
}

function sameTables(actual, expected) {
  const left = tableState(actual), right = tableState(expected);
  if (left.length !== right.length) return false;
  return left.every((table, i) => {
    const {rows, ...schema} = table, {rows: wantedRows, ...wantedSchema} = right[i];
    return JSON.stringify(schema) === JSON.stringify(wantedSchema) && sameRows(rows, wantedRows);
  });
}

function aliasProblem(exercise, got) {
  // Indices allow a suitable title without demanding the example's exact spelling.
  return (exercise.aliasColumns || []).some(index => !got.columns[index] || /\b(?:COUNT|SUM|AVG|MIN|MAX)\s*\(/i.test(got.columns[index]));
}

function leadingCommand(sql) {
  const source = String(sql).replace(/^(?:\s|--[^\r\n]*(?:\r?\n|$)|\/\*[\s\S]*?\*\/)+/, '');
  return source.match(/^[A-Za-z]+/)?.[0].toUpperCase() || '';
}

export async function gradeSql(SQL, exercise, dataset, sql) {
  const runs = [{}, ...(exercise.checks || [])];
  let shown;
  for (let i = 0; i < runs.length; i++) {
    const seed = dataset.seed + (exercise.setup ? '\n' + exercise.setup : '') + (runs[i].seed ? '\n' + runs[i].seed : '');
    let actual, expected;
    try {
      actual = await createEngine({SQL, level: exercise.level, seed});
      expected = await createEngine({SQL, level: exercise.level, seed});
      const want = expected.run(exercise.solution, {level: exercise.level});
      const got = actual.run(sql, {level: exercise.level});
      if (i === 0) shown = {got, want};
      const command = leadingCommand(exercise.solution);
      const read = command === 'SELECT';
      const actionEqual = leadingCommand(sql) === command;
      const aliasesMissing = read && aliasProblem(exercise, got);
      const equal = read ? sameResult(got, want, !!exercise.ordered) : sameTables(actual.tables(), expected.tables());
      const queryUnchanged = !read || (sameTables(actual.tables(), expected.tables()) && key(actual.export().databaseName) === key(expected.export().databaseName));
      const dbEqual = !/^\s*CREATE\s+DATABASE\b/i.test(exercise.solution) || key(actual.export().databaseName) === key(expected.export().databaseName);
      if (!equal || !dbEqual || aliasesMissing || !actionEqual || !queryUnchanged) {
        const detail = !actionEqual
          ? `This task requires a ${command} operation. Complete the requested operation even if the current data happens to be unchanged.`
          : !queryUnchanged
            ? "Read the original data for this query task. Remove statements that modify data or table structure."
          : aliasesMissing
          ? "Give the aggregate result a suitable column heading using AS. Any meaningful alias is accepted."
          : i > 0
            ? "The sample result matches, but an additional dataset failed. Check filter boundaries, join conditions and aggregate scope."
            : read
              ? got.columns.length !== want.columns.length
                ? "The number of output columns differs. Check the SELECT field list."
                : got.rows.length !== want.rows.length
                  ? `Expected ${want.rows.length} rows; your result has ${got.rows.length} rows. Check WHERE conditions and aggregation.`
                  : exercise.ordered
                    ? "The values or row order differ. Check the sort fields, direction and filter conditions."
                    : "The result values differ. Check field order, conditions and aggregate functions."
              : !dbEqual
                ? "The database name differs from the requested name. Check the name after CREATE DATABASE."
                : "The statement ran, but the database does not yet match the task. Check the target table, field types, NOT NULL constraints, primary and foreign keys, and affected records.";
        return {passed: false, ...shown, detail};
      }
    } finally {
      actual?.close();
      expected?.close();
    }
  }
  return {passed: true, ...shown, detail: runs.length > 1
    ? `Correct. Passed the sample and ${runs.length - 1} additional datasets.`
    : "The query result or database state matches the task."};
}
