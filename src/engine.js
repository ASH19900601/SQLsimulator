/** Local sql.js sandbox. Original SQL stays in the caller; compatibility rewrites are
 * reported in notes. This teaches the documented Cambridge subset, not all SQLite.
 * No subqueries, arbitrary functions, extensions, parameters or system tables.
 * A batch is atomic via an in-memory database snapshot (including database switches).
 * SQLite remains the execution model: collation is binary and division/rounding
 * follow SQLite; CHARACTER does not pad with spaces. Bare aggregate fields are
 * checked separately to prevent SQLite's arbitrary-row GROUP BY behavior.
 */
const upper = token => String(token?.value ?? '').toUpperCase();
const isWord = (token, value) => token?.type === 'word' && upper(token) === value;
const quote = name => `"${String(name).replaceAll('"', '""')}"`;
const literal = value => `'${String(value).replaceAll("'", "''")}'`;
const fail = message => { throw new Error(message); };
const ident = token => token && ['word', 'identifier'].includes(token.type);
const LIMIT = 2000;

export function tokenize(sql) {
  const tokens = [];
  let i = 0;
  while (i < sql.length) {
    const start = i, c = sql[i];
    if (/\s/.test(c)) { i++; continue; }
    if (sql.startsWith('--', i)) { while (i < sql.length && sql[i] !== '\n') i++; continue; }
    if (sql.startsWith('/*', i)) {
      const end = sql.indexOf('*/', i + 2);
      if (end < 0) fail("Unclosed comment: add */ to finish it.");
      i = end + 2; continue;
    }
    if (c === "'" || c === '"' || c === '`' || c === '[') {
      const endChar = c === '[' ? ']' : c;
      let value = ''; i++;
      let closed = false;
      while (i < sql.length) {
        if (sql[i] === endChar) {
          if (sql[i + 1] === endChar) { value += endChar; i += 2; }
          else { i++; closed = true; break; }
        } else value += sql[i++];
      }
      if (!closed) fail("Unclosed quote: text values need matching quotation marks.");
      tokens.push({type: c === '`' || c === '[' ? 'identifier' : 'string', value, start, end: i, delimiter: c});
      continue;
    }
    if (c === '#') {
      const end = sql.indexOf('#', i + 1);
      if (end < 0) fail("The date's closing # is missing.");
      tokens.push({type:'date', value:sql.slice(i + 1, end), start, end:end + 1});
      i = end + 1; continue;
    }
    const word = /^[\p{L}_][\p{L}\p{N}_$]*/u.exec(sql.slice(i));
    if (word) { i += word[0].length; tokens.push({type:'word', value:word[0], start, end:i}); continue; }
    const number = /^(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?/.exec(sql.slice(i));
    if (number) { i += number[0].length; tokens.push({type:'number', value:number[0], start, end:i}); continue; }
    const op = /^(?:<>|<=|>=|!=|==|[=<>+*/%(),;.\-])/.exec(sql.slice(i));
    if (!op) fail(`Unrecognised character ${c}; use standard SQL punctuation, field names and quotes.`);
    i += op[0].length; tokens.push({type:'symbol', value:op[0], start, end:i});
  }
  return tokens;
}

function split(tokens, separator = ',') {
  const result = []; let depth = 0, group = [];
  for (const token of tokens) {
    if (token.value === '(') depth++;
    if (token.value === ')') depth--;
    if (depth < 0) fail("There are more closing than opening parentheses. Check the pairs.");
    if (token.value === separator && depth === 0) { if (!group.length) fail("Content is missing before the separator."); result.push(group); group = []; }
    else group.push(token);
  }
  if (depth !== 0) fail("Unmatched parentheses. Check each ( and ).");
  if (group.length) result.push(group);
  return result;
}

function topIndex(tokens, keyword, from = 0) {
  let depth = 0;
  for (let i = from; i < tokens.length; i++) {
    if (tokens[i].value === '(') depth++;
    if (tokens[i].value === ')') depth--;
    if (depth === 0 && isWord(tokens[i], keyword)) return i;
  }
  return -1;
}

const allowedTypes = new Set(['INTEGER','REAL','BOOLEAN','DATE','TIME','CHARACTER','VARCHAR','CHAR','INT','FLOAT','CURRENCY','TEXT']);
const aliases = {CHAR:'CHARACTER', INT:'INTEGER', FLOAT:'REAL', CURRENCY:'REAL'};
function columnDefinition(tokens, notes = []) {
  if (!ident(tokens[0])) fail("A field definition needs a field name.");
  const type = upper(tokens[1]);
  if (!allowedTypes.has(type)) fail(`Field ${tokens[0].value} has type ${tokens[1]?.value || "(missing)"} which is outside this practice scope. Use INTEGER, REAL, BOOLEAN, DATE, TIME, CHARACTER or VARCHAR(n).`);
  let end = 2, width = '';
  if (tokens[end]?.value === '(') {
    if (!['VARCHAR','CHARACTER','CHAR'].includes(type) || tokens[end + 1]?.type !== 'number' || !/^\d+$/.test(tokens[end + 1].value) || tokens[end + 2]?.value !== ')') fail("Write a positive character length, such as VARCHAR(20).");
    const n = Number(tokens[end + 1].value);
    if (n < 1 || n > 65535) fail("Character length must be between 1 and 65535.");
    width = `(${n})`; end += 3;
  }
  if (aliases[type] || type === 'TEXT' || (type === 'VARCHAR' && !width)) notes.push(`${type}${width} is a type spelling found in historical papers. Current syllabus examples prefer ${aliases[type] || 'VARCHAR(n)'}${width && aliases[type] === 'CHARACTER' ? width : ''}.`);
  const tail = tokens.slice(end);
  for (const token of tail) if (token.type === 'word' && ['DEFAULT','UNIQUE','CHECK','AUTOINCREMENT','COLLATE','GENERATED'].includes(upper(token))) fail(`${token.value} is outside the supported field-definition scope.`);
  return {name:tokens[0].value, type:`${aliases[type] || type}${width}`, tail};
}

function validateProjection(tokens, level) {
  for (const group of split(tokens)) {
    let expression = group;
    const as = topIndex(group, 'AS');
    if (as >= 0) {
      if (as !== group.length - 2 || !(ident(group.at(-1)) || group.at(-1)?.type === 'string')) fail("Write an alias in the form AS Total.");
      expression = group.slice(0, as);
    } else if (group.length > 1 && ident(group.at(-1)) && group.at(-2)?.value !== '.') expression = group.slice(0,-1);
    if (expression.length === 1 && (ident(expression[0]) || expression[0].value === '*')) continue;
    if (expression.length === 3 && ident(expression[0]) && expression[1].value === '.' && (ident(expression[2]) || expression[2].value === '*')) continue;
    const fn = upper(expression[0]);
    if (expression[1]?.value === '(' && expression.at(-1)?.value === ')' && ['SUM','COUNT',...(level === 'ig' ? [] : ['AVG'])].includes(fn)) {
      const arg = expression.slice(2,-1);
      if ((arg.length === 1 && (ident(arg[0]) || (fn === 'COUNT' && arg[0].value === '*'))) || (arg.length === 3 && ident(arg[0]) && arg[1].value === '.' && ident(arg[2]))) continue;
    }
    fail("Select fields, * or the SUM/COUNT/AVG functions available in this scope. You may add an AS alias. Subqueries, calculated expressions and other functions are outside this practice scope.");
  }
}

function validateStatement(tokens, level) {
  const first = upper(tokens[0]);
  const allowed = level === 'ig' ? ['SELECT'] : ['SELECT','INSERT','UPDATE','DELETE','CREATE','ALTER'];
  if (!allowed.includes(first)) fail(level === 'ig' ? "IG mode covers single-table SELECT queries. Switch to AS / A Level to modify data or create tables." : `${first || "Empty statement"} is outside the supported statement scope.`);
  const blocked = new Set(['WITH','UNION','INTERSECT','EXCEPT','HAVING','LIMIT','OFFSET','DISTINCT','CASE','WHEN','EXISTS','BETWEEN','IN','IS','LEFT','RIGHT','OUTER','CROSS','NATURAL','USING','RETURNING','REPLACE','PRAGMA','ATTACH','DETACH','DROP','TRIGGER','VIEW','INDEX','REFERENCES_SYSTEM']);
  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    if (token.type === 'word' && blocked.has(upper(token))) fail(`${token.value} is outside the selected CAIE practice scope.`);
    if (token.type === 'word' && /^sqlite_/i.test(token.value)) fail("Internal system tables are outside the practice dataset.");
    if (i > 0 && isWord(token,'SELECT')) fail("Nested SELECT statements and subqueries are outside this practice scope.");
  }
  if (first === 'SELECT') {
    const from = topIndex(tokens,'FROM');
    if (from < 0) fail("Add FROM followed by the table name.");
    validateProjection(tokens.slice(1,from),level);
    // A real past-paper table is called ORDER. A clause starts at ORDER BY,
    // never at an identifier named ORDER (nor at ORDER inside a qualified field).
    const boundary = tokens.map((token,index) => index > from + 1 &&
      (isWord(token,'WHERE') || ((isWord(token,'GROUP') || isWord(token,'ORDER')) && isWord(tokens[index + 1],'BY'))) ? index : -1).filter(index => index >= 0);
    const end = Math.min(tokens.length,...boundary);
    const tablePart = tokens.slice(from + 1,end);
    let count = 1;
    for (let i = 0; i < tablePart.length; i++) if (tablePart[i].value === ',' || isWord(tablePart[i],'JOIN')) count++;
    if (tablePart.some(token => token.value === '(')) fail("Use table names directly in FROM. Subqueries and table functions are outside this practice scope.");
    if (count > (level === 'ig' ? 1 : 2)) fail(level === 'ig' ? "IG mode uses one table. Switch to AS / A Level for joins." : "AS / A Level queries involve at most two tables.");
    if (level === 'ig' && tokens.some(token => isWord(token,'GROUP'))) fail("GROUP BY is available in AS / A Level mode.");
    if (level === 'ig' && tokens.some(token => isWord(token,'LIKE'))) {
      for (let like = 0; like < tokens.length; like++) if (isWord(tokens[like],'LIKE')) {
        if (tokens[like + 1]?.type !== 'string' || /[%_*?]/.test(tokens[like + 1].value)) fail("IG core queries use = for exact matches. Switch to AS / A Level for LIKE wildcard patterns.");
      }
    }
  }
  if (first === 'CREATE') {
    if (!['DATABASE','TABLE'].includes(upper(tokens[1]))) fail("Use CREATE DATABASE or CREATE TABLE in this practice scope.");
    if (!ident(tokens[2])) fail("CREATE needs a database name or table name.");
    if (isWord(tokens[1],'DATABASE')) { if (tokens.length !== 3) fail("Write CREATE DATABASE DatabaseName."); }
    else {
      if (tokens[3]?.value !== '(' || tokens.at(-1)?.value !== ')') fail("CREATE TABLE needs field and key definitions inside parentheses.");
      for (const group of split(tokens.slice(4,-1))) if (!['PRIMARY','FOREIGN','CONSTRAINT'].includes(upper(group[0]))) columnDefinition(group);
    }
  }
  if (first === 'ALTER' && (!isWord(tokens[1],'TABLE') || !ident(tokens[2]) || !isWord(tokens[3],'ADD'))) fail("Use ALTER TABLE TableName ADD followed by a field or key constraint.");
  if (first === 'INSERT' && (!isWord(tokens[1],'INTO') || topIndex(tokens,'VALUES') < 0)) fail("Use INSERT INTO TableName (fields) VALUES (values).");
  if (first === 'DELETE' && !isWord(tokens[1],'FROM')) fail("Write FROM TableName after DELETE.");
  // Functions in predicates and maintenance are not a backdoor to unbounded SQLite.
  if (['SELECT','INSERT','UPDATE','DELETE'].includes(first)) for (let i = 0; i < tokens.length - 1; i++) {
    if (tokens[i + 1].value === '(' && ident(tokens[i])) {
      const name = upper(tokens[i]);
      if (['SUM','COUNT',...(level === 'ig' ? [] : ['AVG']),'WHERE','AND','OR','NOT','VALUES'].includes(name)) continue;
      if (first === 'INSERT' && i === 2) continue;
      fail(`${tokens[i].value}(...) is outside the supported function scope.`);
    }
  }
  return first;
}

export function validateSql(sql, level = 'ig') {
  if (typeof sql !== 'string' || !sql.trim()) fail("Write a SQL statement before running it.");
  if (sql.length > 20000) fail("Each run supports up to 20,000 characters. Split a longer script into smaller parts.");
  const statements = split(tokenize(sql),';');
  if (!statements.length) fail("This input contains comments only. Add a SQL statement to run.");
  if (statements.length > 20) fail("Run up to 20 statements at a time.");
  for (const statement of statements) validateStatement(statement,level === 'ig' ? 'ig' : 'as');
  return {valid:true, statements};
}

function normalizeDate(value) {
  let match = /^(\d{4})-(\d{1,2})-(\d{1,2})$/.exec(value), year, month, day;
  if (match) [,year,month,day] = match.map(Number);
  else {
    match = /^(\d{1,2})\/(\d{1,2})\/(\d{2}|\d{4})$/.exec(value);
    if (!match) fail(`Date ${value} has an invalid format. Use 'YYYY-MM-DD'.`);
    day = +match[1]; month = +match[2]; year = +match[3];
    if (year < 100) year += year <= 69 ? 2000 : 1900;
  }
  const date = new Date(Date.UTC(year,month - 1,day));
  if (year < 1000 || date.getUTCFullYear() !== year || date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day) fail(`Date ${value} is not a valid date. Check the year, month and day.`);
  return `${year}-${String(month).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
}

function errorMessage(error) {
  const message = String(error?.message || error);
  if (/UNIQUE constraint failed/i.test(message)) return `Duplicate primary key or unique value: ${message.split(':').slice(1).join(':').trim()}. Use a different key value.`;
  if (/FOREIGN KEY constraint failed/i.test(message)) return "Foreign-key constraint failed. Referenced records must exist; records still referenced by another table cannot be deleted.";
  if (/foreign key mismatch/i.test(message)) return "Foreign-key definition mismatch. Check that the referenced table and field exist and that the referenced field is a primary key.";
  if (/NOT NULL constraint failed/i.test(message)) return `A required field or primary key cannot be NULL: ${message.split(':').slice(1).join(':').trim()}.`;
  if (/no such table:/i.test(message)) return `Table not found: ${message.split(':').slice(1).join(':').trim()}. Check the table name against the data structure.`;
  if (/no such column:/i.test(message)) return `Field not found: ${message.split(':').slice(1).join(':').trim()}. Check the spelling and quote text values.`;
  if (/ambiguous column name:/i.test(message)) return `Field ${message.split(':').slice(1).join(':').trim()} appears in both tables. Use TableName.FieldName.`;
  if (/syntax error|incomplete input/i.test(message)) return `Incomplete SQL syntax: ${message}. Check keyword order, commas, parentheses and quotes.`;
  if (/has no column named/i.test(message)) return `The INSERT field does not exist: ${message}. Check the table structure.`;
  if (/already exists/i.test(message)) return `The name already exists: ${message}. Use a new name or reset the sample data.`;
  return message;
}

export async function createEngine({SQL, level = 'ig', seed = '', snapshot} = {}) {
  if (!SQL?.Database) fail("The SQL engine is still loading. Refresh to try again.");
  let db, databaseName = 'Learning', closed = false;
  function open(bytes) { const next = new SQL.Database(bytes ? new Uint8Array(bytes) : undefined); next.run('PRAGMA foreign_keys = ON'); return next; }
  db = open();
  if (seed) { try { db.run(seed); } catch (error) { db.close(); throw new Error(errorMessage(error)); } }
  const initial = exportState();
  function exportState() {
    // sql.js export closes/reopens the connection and resets connection pragmas.
    const bytes = Array.from(db.export());
    db.run('PRAGMA foreign_keys = ON');
    return {bytes,databaseName};
  }
  function restore(state) {
    const bytes = Array.isArray(state) ? state : state?.bytes;
    if (!Array.isArray(bytes) && !(bytes instanceof Uint8Array)) fail("Invalid database snapshot.");
    const next = open(bytes);
    next.exec('SELECT name FROM sqlite_master LIMIT 1');
    db.close(); db = next; databaseName = state.databaseName || 'Learning'; closed = false;
  }
  if (snapshot) restore(snapshot);
  function tables() {
    const names = db.exec("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' ORDER BY name")[0]?.values || [];
    return names.map(([name]) => {
      const info = db.exec(`PRAGMA table_info(${quote(name)})`)[0];
      const columns = (info?.values || []).map(row => ({name:row[1],type:row[2],notnull:row[3],defaultValue:row[4],pk:row[5]}));
      const keys = db.exec(`PRAGMA foreign_key_list(${quote(name)})`)[0];
      return {name,columns,rows:db.exec(`SELECT * FROM ${quote(name)} LIMIT ${LIMIT + 1}`)[0]?.values || [],foreignKeys:(keys?.values || []).map(row => Object.fromEntries(keys.columns.map((key,index) => [key,row[index]])))};
    });
  }
  function normalize(tokens, notes) {
    const schema = tables();
    const allColumns = schema.flatMap(table => table.columns);
    const typeFor = token => ident(token) ? allColumns.find(col => col.name.toUpperCase() === upper(token))?.type?.toUpperCase() : '';
    const output = tokens.map(token => ({...token}));
    const boolValues = {TRUE:1,FALSE:0,YES:1,NO:0,Y:1,N:0,T:1,F:0};
    function valueType(index) {
      if (['=','<>','!=','<','>','<=','>='].includes(tokens[index - 1]?.value)) return typeFor(tokens[index - 2]);
      if (['=','<>','!=','<','>','<=','>='].includes(tokens[index + 1]?.value)) return typeFor(tokens[index + 2]?.value && tokens[index + 3]?.value === '.' ? tokens[index + 4] : tokens[index + 2]);
      return '';
    }
    const insertTypes = new Map();
    if (isWord(tokens[0],'INSERT')) {
      const table = schema.find(table => table.name.toUpperCase() === upper(tokens[2]));
      let cols = table?.columns || [];
      const values = topIndex(tokens,'VALUES');
      if (tokens[3]?.value === '(') {
        const close = tokens.findIndex((token,index) => index > 3 && token.value === ')');
        cols = split(tokens.slice(4,close)).map(group => table?.columns.find(col => col.name.toUpperCase() === upper(group[0])));
      }
      const missingKey = table?.columns.find(column => column.pk && !cols.includes(column));
      if (missingKey) fail(`Primary key ${table.name}.${missingKey.name} cannot be NULL. Supply a value in INSERT.`);
      let column = 0, depth = 0;
      for (let i = values + 1; i < tokens.length; i++) {
        if (tokens[i].value === '(') { depth++; column = 0; }
        else if (tokens[i].value === ')') depth--;
        else if (tokens[i].value === ',' && depth === 1) column++;
        else if (depth === 1) {
          insertTypes.set(i,cols[column]?.type?.toUpperCase());
          if (isWord(tokens[i],'NULL') && cols[column]?.pk) fail(`Primary key ${table.name}.${cols[column].name} cannot be NULL.`);
        }
      }
    }
    for (let i = 0; i < output.length; i++) {
      const token = output[i];
      const original = tokens[i];
      const type = insertTypes.get(i) || valueType(i);
      if (original.type === 'date' || (type === 'DATE' && original.type === 'string')) {
        token.raw = literal(normalizeDate(original.value));
        if (original.type === 'date' || original.value.includes('/')) notes.push("The exam-style date was converted to ISO format for comparison. Two-digit years map 00–69 to 2000–2069 and 70–99 to 1970–1999.");
      } else if (type === 'BOOLEAN' && Object.hasOwn(boolValues,upper(original)) && ['word','string'].includes(original.type)) {
        token.raw = String(boolValues[upper(original)]);
        notes.push("Boolean TRUE/YES/Y/T and FALSE/NO/N/F are interpreted as 1 and 0 according to the field type. Your SQL text is preserved.");
      } else if (original.type === 'string') {
        token.raw = literal(original.value);
        if (original.delimiter === '"') notes.push("Double-quoted exam text is interpreted as a string and converted to single quotes for execution.");
        if (isWord(tokens[i - 1],'LIKE') && original.value.includes('*')) { token.raw = literal(original.value.replaceAll('*','%')); notes.push("The historical LIKE wildcard * is converted to %. Use % in new answers."); }
      } else if (original.type === 'identifier') token.raw = quote(original.value);
      else if (isWord(original,'ASCENDING') || isWord(original,'DESCENDING')) { token.raw = isWord(original,'ASCENDING') ? 'ASC' : 'DESC'; notes.push("ASCENDING / DESCENDING map to ASC / DESC with the same sorting behaviour."); }
      else if (ident(original) && /^ORDER$/i.test(original.value) && (['FROM','JOIN','INTO','UPDATE','TABLE','REFERENCES'].some(word => isWord(tokens[i - 1],word)) || tokens[i + 1]?.value === '.')) { token.raw = quote(original.value); notes.push("ORDER is treated as the table name given in the question and quoted internally as an identifier."); }
      else token.raw = original.value;
    }
    return output.map(token => token.raw).join(' ');
  }
  function renderDefinition(group, notes) {
    const column = columnDefinition(group,notes);
    return `${quote(column.name)} ${column.type} ${normalize(column.tail,notes)}`;
  }
  function createTable(tokens,notes) {
    const groups = split(tokens.slice(4,-1));
    const definitions = groups.map(group => ['PRIMARY','FOREIGN','CONSTRAINT'].includes(upper(group[0])) ? normalize(group,notes) : renderDefinition(group,notes));
    db.run(`CREATE TABLE ${quote(tokens[2].value)} (${definitions.join(', ')})`);
    notes.push("SQLite executes the query locally with additional checks for non-NULL primary keys and syllabus types. Character values are stored without space padding.");
  }
  function addKey(tableName, tokens, notes) {
    const table = tables().find(table => table.name.toLowerCase() === tableName.toLowerCase());
    if (!table) fail(`Table not found: ${tableName}.`);
    const primary = isWord(tokens[0],'PRIMARY');
    if (primary && table.columns.some(column => column.pk)) fail("This table already has a primary key. A table has one primary key, which may contain several fields.");
    const definitions = table.columns.map(column => `${quote(column.name)} ${column.type}${column.notnull || column.pk ? ' NOT NULL' : ''}${column.defaultValue !== null ? ` DEFAULT ${column.defaultValue}` : ''}`);
    const pk = table.columns.filter(column => column.pk).sort((a,b) => a.pk - b.pk);
    if (pk.length) definitions.push(`PRIMARY KEY (${pk.map(column => quote(column.name)).join(',')})`);
    const groups = new Map();
    for (const fk of table.foreignKeys) { if (!groups.has(fk.id)) groups.set(fk.id,[]); groups.get(fk.id).push(fk); }
    for (const rows of groups.values()) {
      rows.sort((a,b) => a.seq - b.seq);
      definitions.push(`FOREIGN KEY (${rows.map(row => quote(row.from)).join(',')}) REFERENCES ${quote(rows[0].table)} (${rows.map(row => quote(row.to)).join(',')})`);
    }
    definitions.push(normalize(tokens,notes));
    const temp = '__caie_rebuild';
    db.run('PRAGMA foreign_keys = OFF');
    try {
      db.run(`CREATE TABLE ${quote(temp)} (${definitions.join(',')})`);
      db.run(`INSERT INTO ${quote(temp)} SELECT * FROM ${quote(tableName)}`);
      db.run(`DROP TABLE ${quote(tableName)}`);
      db.run(`ALTER TABLE ${quote(temp)} RENAME TO ${quote(tableName)}`);
    } finally { db.run('PRAGMA foreign_keys = ON'); }
    if (db.exec('PRAGMA foreign_key_check')[0]?.values.length) fail("Existing data violates the foreign-key relationship. Correct the referenced values first.");
    notes.push("The table was rebuilt with the same name to add and enforce its key constraints in SQLite.");
  }
  function checkData() {
    const all = tables();
    if (all.length > 20) fail("The sandbox supports up to 20 tables. Reset the data to continue.");
    for (const table of all) {
      if (table.rows.length > LIMIT) fail(`Each practice table supports up to ${LIMIT} rows. This write was rolled back.`);
      for (const row of table.rows) for (let i = 0; i < table.columns.length; i++) {
        const column = table.columns[i], value = row[i], type = column.type.toUpperCase();
        if (value === null) { if (column.pk) fail(`Primary key ${table.name}.${column.name} cannot be NULL.`); continue; }
        if (type === 'BOOLEAN' && value !== 0 && value !== 1) fail(`BOOLEAN field ${column.name} accepts TRUE/FALSE, 1/0 or exam-style YES/NO values.`);
        if (type === 'INTEGER' && !Number.isInteger(value)) fail(`INTEGER field ${column.name} requires a whole number.`);
        if (type === 'REAL' && typeof value !== 'number') fail(`REAL field ${column.name} requires a number.`);
        const width = /^(?:VARCHAR|CHARACTER)\((\d+)\)$/.exec(type);
        if (width && String(value).length > +width[1]) fail(`${column.name} contains text longer than its declared length of ${width[1]} characters.`);
        if (type === 'DATE') normalizeDate(String(value));
        if (type === 'TIME' && !/^([01]\d|2[0-3]):[0-5]\d(?::[0-5]\d)?$/.test(String(value))) fail(`TIME field ${column.name} requires HH:MM or HH:MM:SS.`);
      }
    }
  }
  function checkGrouping(tokens) {
    const from = topIndex(tokens,'FROM');
    const projections = split(tokens.slice(1,from)).map(group => {
      const as = topIndex(group,'AS');
      if (as >= 0) return {expression:group.slice(0,as),alias:upper(group.at(-1))};
      if (group.length > 1 && ident(group.at(-1)) && group.at(-2)?.value !== '.') return {expression:group.slice(0,-1),alias:upper(group.at(-1))};
      return {expression:group};
    });
    const grouped = tokens.findIndex((token,index) => index > from && isWord(token,'GROUP') && isWord(tokens[index + 1],'BY'));
    const aggregate = item => ['SUM','COUNT','AVG'].includes(upper(item.expression[0])) && item.expression[1]?.value === '(';
    if (grouped < 0 && !projections.some(aggregate)) return;
    const normal = projections.filter(item => !aggregate(item));
    if (!normal.length) return;
    if (grouped < 0) fail("An overall aggregate cannot include an arbitrary record's field. Select only aggregates, or add ordinary fields to GROUP BY in AS / A Level mode.");

    const endFrom = tokens.findIndex((token,index) => index > from + 1 && (isWord(token,'WHERE') || ((isWord(token,'GROUP') || isWord(token,'ORDER')) && isWord(tokens[index + 1],'BY'))));
    const source = tokens.slice(from + 1,endFrom < 0 ? tokens.length : endFrom);
    const schema = tables(), bindings = [];
    const boundary = new Set(['INNER','JOIN','ON','WHERE','GROUP','ORDER']);
    for (let index = 0; index < source.length; index++) {
      if (index !== 0 && source[index - 1].value !== ',' && !isWord(source[index - 1],'JOIN')) continue;
      const table = schema.find(table => table.name.toUpperCase() === upper(source[index]));
      if (!table) continue; // The prepared statement gives the precise missing-table error.
      let alias = upper(source[index]);
      if (isWord(source[index + 1],'AS')) alias = upper(source[index + 2]);
      else if (ident(source[index + 1]) && !boundary.has(upper(source[index + 1]))) alias = upper(source[index + 1]);
      bindings.push({table,alias});
    }
    function resolve(expression,allowAliases = false) {
      if (allowAliases && expression.length === 1) {
        // A source column takes precedence over a same-name output alias in
        // SQLite GROUP BY; an alias must not conceal a bare selected field.
        const sourceField = resolve(expression);
        if (sourceField.length) return sourceField;
        const aliased = normal.find(item => item.alias === upper(expression[0]));
        if (aliased) return resolve(aliased.expression);
      }
      const qualified = expression.length === 3 && expression[1].value === '.';
      const name = upper(qualified ? expression[2] : expression[0]);
      if (!qualified && expression.length !== 1) return [];
      const candidates = bindings.map((binding,index) => ({...binding,index})).filter(binding => !qualified || binding.alias === upper(expression[0]));
      const found = candidates.flatMap(binding => binding.table.columns.filter(column => name === '*' || column.name.toUpperCase() === name).map(column => ({binding:binding.index,column,key:`${binding.index}:${column.name.toUpperCase()}`})));
      return name !== '*' && found.length !== 1 ? [] : found;
    }
    let groupEnd = tokens.findIndex((token,index) => index > grouped + 1 && isWord(token,'ORDER') && isWord(tokens[index + 1],'BY'));
    if (groupEnd < 0) groupEnd = tokens.length;
    const groupedKeys = new Set(split(tokens.slice(grouped + 2,groupEnd)).flatMap(group => resolve(group,true)).map(field => field.key));
    for (const item of normal) for (const field of resolve(item.expression)) {
      if (groupedKeys.has(field.key)) continue;
      const primary = bindings[field.binding].table.columns.filter(column => column.pk);
      if (primary.length && primary.every(column => groupedKeys.has(`${field.binding}:${column.name.toUpperCase()}`))) continue;
      fail(`Field ${field.column.name} may have several values within a group. Add it to GROUP BY or use an aggregate. Grouping by a complete primary key also allows fields uniquely determined by that key.`);
    }
  }
  function run(sql,options = {}) {
    if (closed) fail("The database is closed. Reopen the learner.");
    const {statements} = validateSql(sql,options.level || level);
    const before = exportState(), notes = [];
    let result = {columns:[],rows:[],affected:0,message:'',notes,kind:'statement'};
    try {
      for (const tokens of statements) {
        const kind = upper(tokens[0]);
        const translated = normalize(tokens,notes);
        if (kind === 'CREATE' && isWord(tokens[1],'DATABASE')) {
          const next = open(); db.close(); db = next; databaseName = tokens[2].value;
          notes.push("CREATE DATABASE opened a new empty local sandbox. Reset to return to the exercise's initial data.");
          result = {columns:[],rows:[],affected:0,message:`Created and switched to ${databaseName}.`,notes,kind:'schema'};
        } else if (kind === 'SELECT') {
          const statement = db.prepare(`${translated} LIMIT ${LIMIT + 1}`);
          let columns, values = [];
          try {
            checkGrouping(tokens);
            // exec() omits zero-row result sets, which would lose headers and let
            // two different empty projections appear equivalent to a grader.
            columns = statement.getColumnNames();
            while (statement.step()) values.push(statement.get());
          } finally { statement.free(); }
          const truncated = values.length > LIMIT;
          if (truncated) notes.push(`The result exceeds ${LIMIT} rows. Showing the first ${LIMIT} rows; add a filter to narrow the result.`);
          result = {columns,rows:values.slice(0,LIMIT),affected:0,message:`Returned ${Math.min(values.length,LIMIT)} rows${truncated ? " (truncated)" : ''}.`,notes,kind:'select',truncated};
        } else {
          if (kind === 'CREATE') createTable(tokens,notes);
          else if (kind === 'ALTER') {
            const addition = tokens.slice(isWord(tokens[4],'COLUMN') ? 5 : 4);
            if (isWord(addition[0],'PRIMARY') || isWord(addition[0],'FOREIGN') || isWord(addition[0],'CONSTRAINT')) addKey(tokens[2].value,addition,notes);
            else for (const group of split(addition)) db.run(`ALTER TABLE ${quote(tokens[2].value)} ADD COLUMN ${renderDefinition(group,notes)}`);
          } else db.run(translated);
          checkData();
          const affected = ['INSERT','UPDATE','DELETE'].includes(kind) ? db.getRowsModified() : 0;
          result = {columns:[],rows:[],affected,message:affected ? `Affected ${affected} rows.` : (['INSERT','UPDATE','DELETE'].includes(kind) ? "Statement completed. Affected 0 rows." : "Database structure updated."),notes,kind:['CREATE','ALTER'].includes(kind) ? 'schema' : 'write'};
        }
      }
      result.notes = [...new Set(notes)];
      if (statements.length > 1) result.message = `Executed ${statements.length} statements. ${result.message}`;
      return result;
    } catch (error) { restore(before); throw new Error(errorMessage(error)); }
  }
  return {run,tables,export:exportState,restore,reset() { restore(initial); return tables(); },close() { if (!closed) db.close(); closed = true; },get databaseName() { return databaseName; }};
}
