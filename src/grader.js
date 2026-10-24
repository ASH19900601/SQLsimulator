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
          ? `题目要求使用 ${command} 操作。即使当前数据没有变化，也需要完成相应的数据库操作。`
          : !queryUnchanged
            ? '查询题需要从原始数据得到结果，请移除修改数据或表结构的语句。'
          : aliasesMissing
          ? '题目要求给聚合结果设置合适的列标题。请使用 AS 添加标题；不必与参考答案名称完全一致。'
          : i > 0
            ? '示例数据的结果相同，但新增数据检查未通过。请检查筛选边界、连接条件或聚合范围。'
            : read
              ? got.columns.length !== want.columns.length
                ? '输出字段数量不符，请检查 SELECT 字段列表。'
                : got.rows.length !== want.rows.length
                  ? `结果应有 ${want.rows.length} 行，你的结果有 ${got.rows.length} 行。请检查 WHERE 条件和聚合方式。`
                  : exercise.ordered
                    ? '输出值或排序不符。请检查排序字段、方向和筛选条件。'
                    : '结果值不符。请检查字段顺序、条件和聚合函数。'
              : !dbEqual
                ? '数据库名称与题目要求不符。请检查 CREATE DATABASE 后的名称。'
                : '执行成功，但数据库的内容或结构尚未达到题目要求。请检查目标表、字段类型、非空限制、主外键和受影响的记录。';
        return {passed: false, ...shown, detail};
      }
    } finally {
      actual?.close();
      expected?.close();
    }
  }
  return {passed: true, ...shown, detail: runs.length > 1
    ? `结果正确，已通过示例及 ${runs.length - 1} 组补充数据检查。`
    : '查询结果或数据库状态与题目要求相符。'};
}
