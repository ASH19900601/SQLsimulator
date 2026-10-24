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
      if (end < 0) fail('注释尚未结束：请补上 */。');
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
      if (!closed) fail('引号尚未闭合：文字值需要成对的引号。');
      tokens.push({type: c === '`' || c === '[' ? 'identifier' : 'string', value, start, end: i, delimiter: c});
      continue;
    }
    if (c === '#') {
      const end = sql.indexOf('#', i + 1);
      if (end < 0) fail('日期的 # 尚未闭合。');
      tokens.push({type:'date', value:sql.slice(i + 1, end), start, end:end + 1});
      i = end + 1; continue;
    }
    const word = /^[\p{L}_][\p{L}\p{N}_$]*/u.exec(sql.slice(i));
    if (word) { i += word[0].length; tokens.push({type:'word', value:word[0], start, end:i}); continue; }
    const number = /^(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?/.exec(sql.slice(i));
    if (number) { i += number[0].length; tokens.push({type:'number', value:number[0], start, end:i}); continue; }
    const op = /^(?:<>|<=|>=|!=|==|[=<>+*/%(),;.\-])/.exec(sql.slice(i));
    if (!op) fail(`无法识别字符 ${c}；请使用普通 SQL 标点、字段和引号。`);
    i += op[0].length; tokens.push({type:'symbol', value:op[0], start, end:i});
  }
  return tokens;
}

function split(tokens, separator = ',') {
  const result = []; let depth = 0, group = [];
  for (const token of tokens) {
    if (token.value === '(') depth++;
    if (token.value === ')') depth--;
    if (depth < 0) fail('右括号多于左括号，请检查括号配对。');
    if (token.value === separator && depth === 0) { if (!group.length) fail('分隔符前缺少内容。'); result.push(group); group = []; }
    else group.push(token);
  }
  if (depth !== 0) fail('括号未配对，请检查 ( 和 )。');
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
  if (!ident(tokens[0])) fail('字段定义需要字段名称。');
  const type = upper(tokens[1]);
  if (!allowedTypes.has(type)) fail(`字段 ${tokens[0].value} 的类型 ${tokens[1]?.value || '（缺失）'} 不在本学习范围。请用 INTEGER、REAL、BOOLEAN、DATE、TIME、CHARACTER 或 VARCHAR(n)。`);
  let end = 2, width = '';
  if (tokens[end]?.value === '(') {
    if (!['VARCHAR','CHARACTER','CHAR'].includes(type) || tokens[end + 1]?.type !== 'number' || !/^\d+$/.test(tokens[end + 1].value) || tokens[end + 2]?.value !== ')') fail('字符长度请写为 VARCHAR(20) 这样的正整数形式。');
    const n = Number(tokens[end + 1].value);
    if (n < 1 || n > 65535) fail('字符长度需要在 1 到 65535 之间。');
    width = `(${n})`; end += 3;
  }
  if (aliases[type] || type === 'TEXT' || (type === 'VARCHAR' && !width)) notes.push(`${type}${width} 是历年试题出现过的类型写法；当前考纲示例优先使用 ${aliases[type] || 'VARCHAR(n)'}${width && aliases[type] === 'CHARACTER' ? width : ''}。`);
  const tail = tokens.slice(end);
  for (const token of tail) if (token.type === 'word' && ['DEFAULT','UNIQUE','CHECK','AUTOINCREMENT','COLLATE','GENERATED'].includes(upper(token))) fail(`${token.value} 不属于本课程的字段定义范围。`);
  return {name:tokens[0].value, type:`${aliases[type] || type}${width}`, tail};
}

function validateProjection(tokens, level) {
  for (const group of split(tokens)) {
    let expression = group;
    const as = topIndex(group, 'AS');
    if (as >= 0) {
      if (as !== group.length - 2 || !(ident(group.at(-1)) || group.at(-1)?.type === 'string')) fail('别名请写为 AS Total 这样的形式。');
      expression = group.slice(0, as);
    } else if (group.length > 1 && ident(group.at(-1)) && group.at(-2)?.value !== '.') expression = group.slice(0,-1);
    if (expression.length === 1 && (ident(expression[0]) || expression[0].value === '*')) continue;
    if (expression.length === 3 && ident(expression[0]) && expression[1].value === '.' && (ident(expression[2]) || expression[2].value === '*')) continue;
    const fn = upper(expression[0]);
    if (expression[1]?.value === '(' && expression.at(-1)?.value === ')' && ['SUM','COUNT',...(level === 'ig' ? [] : ['AVG'])].includes(fn)) {
      const arg = expression.slice(2,-1);
      if ((arg.length === 1 && (ident(arg[0]) || (fn === 'COUNT' && arg[0].value === '*'))) || (arg.length === 3 && ident(arg[0]) && arg[1].value === '.' && ident(arg[2]))) continue;
    }
    fail('SELECT 项目请使用字段、* 或本级别的 SUM/COUNT/AVG(字段)，可加 AS 别名；本课程不包含子查询、计算表达式或其他函数。');
  }
}

function validateStatement(tokens, level) {
  const first = upper(tokens[0]);
  const allowed = level === 'ig' ? ['SELECT'] : ['SELECT','INSERT','UPDATE','DELETE','CREATE','ALTER'];
  if (!allowed.includes(first)) fail(level === 'ig' ? 'IG 模式只练习单表 SELECT 查询。请切换到 AS / A Level 学习写入或建表。' : `${first || '空语句'} 不属于本课程支持的语句范围。`);
  const blocked = new Set(['WITH','UNION','INTERSECT','EXCEPT','HAVING','LIMIT','OFFSET','DISTINCT','CASE','WHEN','EXISTS','BETWEEN','IN','IS','LEFT','RIGHT','OUTER','CROSS','NATURAL','USING','RETURNING','REPLACE','PRAGMA','ATTACH','DETACH','DROP','TRIGGER','VIEW','INDEX','REFERENCES_SYSTEM']);
  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    if (token.type === 'word' && blocked.has(upper(token))) fail(`${token.value} 不在此 CAIE 学习模式的范围内；这不表示其他 SQL 系统不支持它。`);
    if (token.type === 'word' && /^sqlite_/i.test(token.value)) fail('系统内部表不在学习数据范围内。');
    if (i > 0 && isWord(token,'SELECT')) fail('本课程不包含嵌套 SELECT 或子查询。');
  }
  if (first === 'SELECT') {
    const from = topIndex(tokens,'FROM');
    if (from < 0) fail('查询缺少 FROM 表名。');
    validateProjection(tokens.slice(1,from),level);
    // A real past-paper table is called ORDER. A clause starts at ORDER BY,
    // never at an identifier named ORDER (nor at ORDER inside a qualified field).
    const boundary = tokens.map((token,index) => index > from + 1 &&
      (isWord(token,'WHERE') || ((isWord(token,'GROUP') || isWord(token,'ORDER')) && isWord(tokens[index + 1],'BY'))) ? index : -1).filter(index => index >= 0);
    const end = Math.min(tokens.length,...boundary);
    const tablePart = tokens.slice(from + 1,end);
    let count = 1;
    for (let i = 0; i < tablePart.length; i++) if (tablePart[i].value === ',' || isWord(tablePart[i],'JOIN')) count++;
    if (tablePart.some(token => token.value === '(')) fail('FROM 仅支持直接表名，不支持子查询或表函数。');
    if (count > (level === 'ig' ? 1 : 2)) fail(level === 'ig' ? 'IG 核心范围只查询一张表；联表查询请切换 AS / A Level。' : 'AS / A Level 考纲查询最多涉及两张表。');
    if (level === 'ig' && tokens.some(token => isWord(token,'GROUP'))) fail('GROUP BY 属于 AS / A Level 范围。');
    if (level === 'ig' && tokens.some(token => isWord(token,'LIKE'))) {
      for (let like = 0; like < tokens.length; like++) if (isWord(tokens[like],'LIKE')) {
        if (tokens[like + 1]?.type !== 'string' || /[%_*?]/.test(tokens[like + 1].value)) fail('IG 核心范围不包含 LIKE 通配匹配；请使用 =，或切换 AS / A Level。');
      }
    }
  }
  if (first === 'CREATE') {
    if (!['DATABASE','TABLE'].includes(upper(tokens[1]))) fail('本课程的 CREATE 仅包含 DATABASE 与 TABLE。');
    if (!ident(tokens[2])) fail('CREATE 后需要数据库名或表名。');
    if (isWord(tokens[1],'DATABASE')) { if (tokens.length !== 3) fail('请写 CREATE DATABASE DatabaseName。'); }
    else {
      if (tokens[3]?.value !== '(' || tokens.at(-1)?.value !== ')') fail('CREATE TABLE 需要括号内的字段和键定义。');
      for (const group of split(tokens.slice(4,-1))) if (!['PRIMARY','FOREIGN','CONSTRAINT'].includes(upper(group[0]))) columnDefinition(group);
    }
  }
  if (first === 'ALTER' && (!isWord(tokens[1],'TABLE') || !ident(tokens[2]) || !isWord(tokens[3],'ADD'))) fail('本课程 ALTER 使用 ALTER TABLE TableName ADD 字段或键约束。');
  if (first === 'INSERT' && (!isWord(tokens[1],'INTO') || topIndex(tokens,'VALUES') < 0)) fail('INSERT 请使用 INSERT INTO 表名 (字段) VALUES (值)。');
  if (first === 'DELETE' && !isWord(tokens[1],'FROM')) fail('DELETE 后需要 FROM 表名。');
  // Functions in predicates and maintenance are not a backdoor to unbounded SQLite.
  if (['SELECT','INSERT','UPDATE','DELETE'].includes(first)) for (let i = 0; i < tokens.length - 1; i++) {
    if (tokens[i + 1].value === '(' && ident(tokens[i])) {
      const name = upper(tokens[i]);
      if (['SUM','COUNT',...(level === 'ig' ? [] : ['AVG']),'WHERE','AND','OR','NOT','VALUES'].includes(name)) continue;
      if (first === 'INSERT' && i === 2) continue;
      fail(`${tokens[i].value}(...) 不在本课程的函数范围内。`);
    }
  }
  return first;
}

export function validateSql(sql, level = 'ig') {
  if (typeof sql !== 'string' || !sql.trim()) fail('先写一条 SQL，再运行。');
  if (sql.length > 20000) fail('本地练习每次最多 20,000 个字符，请拆分长脚本。');
  const statements = split(tokenize(sql),';');
  if (!statements.length) fail('当前只有注释，没有可以运行的 SQL。');
  if (statements.length > 20) fail('一次最多运行 20 条语句。');
  for (const statement of statements) validateStatement(statement,level === 'ig' ? 'ig' : 'as');
  return {valid:true, statements};
}

function normalizeDate(value) {
  let match = /^(\d{4})-(\d{1,2})-(\d{1,2})$/.exec(value), year, month, day;
  if (match) [,year,month,day] = match.map(Number);
  else {
    match = /^(\d{1,2})\/(\d{1,2})\/(\d{2}|\d{4})$/.exec(value);
    if (!match) fail(`日期 ${value} 格式不正确；建议使用 'YYYY-MM-DD'。`);
    day = +match[1]; month = +match[2]; year = +match[3];
    if (year < 100) year += year <= 69 ? 2000 : 1900;
  }
  const date = new Date(Date.UTC(year,month - 1,day));
  if (year < 1000 || date.getUTCFullYear() !== year || date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day) fail(`日期 ${value} 不存在，请检查年月日。`);
  return `${year}-${String(month).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
}

function errorMessage(error) {
  const message = String(error?.message || error);
  if (/UNIQUE constraint failed/i.test(message)) return `主键或唯一值重复：${message.split(':').slice(1).join(':').trim()}。请使用不同的键值。`;
  if (/FOREIGN KEY constraint failed/i.test(message)) return '外键约束失败：引用的记录必须存在，也不能删除仍被其他表引用的记录。';
  if (/foreign key mismatch/i.test(message)) return '外键定义不匹配：请确认引用的表和字段存在，并且引用字段是主键。';
  if (/NOT NULL constraint failed/i.test(message)) return `必填字段或主键不能为空：${message.split(':').slice(1).join(':').trim()}。`;
  if (/no such table:/i.test(message)) return `找不到表 ${message.split(':').slice(1).join(':').trim()}。请对照右侧数据结构检查表名。`;
  if (/no such column:/i.test(message)) return `找不到字段 ${message.split(':').slice(1).join(':').trim()}。请检查拼写；文字值需要引号。`;
  if (/ambiguous column name:/i.test(message)) return `字段 ${message.split(':').slice(1).join(':').trim()} 在两张表中都存在，请写 表名.字段名。`;
  if (/syntax error|incomplete input/i.test(message)) return `SQL 语法尚未完整：${message}。请检查关键字顺序、逗号、括号和引号。`;
  if (/has no column named/i.test(message)) return `插入字段不存在：${message}。请对照数据结构。`;
  if (/already exists/i.test(message)) return `名称已存在：${message}。请使用新名称，或重置练习数据。`;
  return message;
}

export async function createEngine({SQL, level = 'ig', seed = '', snapshot} = {}) {
  if (!SQL?.Database) fail('SQL 引擎尚未加载，请刷新后重试。');
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
    if (!Array.isArray(bytes) && !(bytes instanceof Uint8Array)) fail('数据库快照无效。');
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
      if (missingKey) fail(`主键 ${table.name}.${missingKey.name} 不能为空，请在 INSERT 中提供值。`);
      let column = 0, depth = 0;
      for (let i = values + 1; i < tokens.length; i++) {
        if (tokens[i].value === '(') { depth++; column = 0; }
        else if (tokens[i].value === ')') depth--;
        else if (tokens[i].value === ',' && depth === 1) column++;
        else if (depth === 1) {
          insertTypes.set(i,cols[column]?.type?.toUpperCase());
          if (isWord(tokens[i],'NULL') && cols[column]?.pk) fail(`主键 ${table.name}.${cols[column].name} 不能为空。`);
        }
      }
    }
    for (let i = 0; i < output.length; i++) {
      const token = output[i];
      const original = tokens[i];
      const type = insertTypes.get(i) || valueType(i);
      if (original.type === 'date' || (type === 'DATE' && original.type === 'string')) {
        token.raw = literal(normalizeDate(original.value));
        if (original.type === 'date' || original.value.includes('/')) notes.push('已将试题日期写法转换为 ISO 日期进行本地比较；两位年份采用 00–69 → 2000–2069，70–99 → 1970–1999。');
      } else if (type === 'BOOLEAN' && Object.hasOwn(boolValues,upper(original)) && ['word','string'].includes(original.type)) {
        token.raw = String(boolValues[upper(original)]);
        notes.push('BOOLEAN 的 TRUE/YES/Y/T 与 FALSE/NO/N/F 按字段类型转换为 1 与 0；你的原始 SQL 保持不变。');
      } else if (original.type === 'string') {
        token.raw = literal(original.value);
        if (original.delimiter === '"') notes.push('双引号文字按试题写法解释为字符串；执行时转换为单引号。');
        if (isWord(tokens[i - 1],'LIKE') && original.value.includes('*')) { token.raw = literal(original.value.replaceAll('*','%')); notes.push('LIKE 的历史 * 通配写法转换为 %；新作答建议使用 %。'); }
      } else if (original.type === 'identifier') token.raw = quote(original.value);
      else if (isWord(original,'ASCENDING') || isWord(original,'DESCENDING')) { token.raw = isWord(original,'ASCENDING') ? 'ASC' : 'DESC'; notes.push('ASCENDING / DESCENDING 已映射到执行器的 ASC / DESC，排序含义相同。'); }
      else if (ident(original) && /^ORDER$/i.test(original.value) && (['FROM','JOIN','INTO','UPDATE','TABLE','REFERENCES'].some(word => isWord(tokens[i - 1],word)) || tokens[i + 1]?.value === '.')) { token.raw = quote(original.value); notes.push('ORDER 按试题中的真实表名处理，内部添加标识符引号。'); }
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
    notes.push('本地使用 SQLite 执行，额外检查主键非空及考纲类型；字符类型不进行空格补齐。');
  }
  function addKey(tableName, tokens, notes) {
    const table = tables().find(table => table.name.toLowerCase() === tableName.toLowerCase());
    if (!table) fail(`找不到表 ${tableName}。`);
    const primary = isWord(tokens[0],'PRIMARY');
    if (primary && table.columns.some(column => column.pk)) fail('该表已经有主键；一张表只有一个主键，可由多个字段组合。');
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
    if (db.exec('PRAGMA foreign_key_check')[0]?.values.length) fail('现有数据不满足外键关系；请先修正引用值。');
    notes.push('SQLite 原生不支持 ADD 键约束；本地已重建同名表，并真实启用键约束。');
  }
  function checkData() {
    const all = tables();
    if (all.length > 20) fail('学习沙盒最多保留 20 张表，请重置数据后继续。');
    for (const table of all) {
      if (table.rows.length > LIMIT) fail(`每张学习表最多 ${LIMIT} 行，避免设备卡顿。此次写入已撤销。`);
      for (const row of table.rows) for (let i = 0; i < table.columns.length; i++) {
        const column = table.columns[i], value = row[i], type = column.type.toUpperCase();
        if (value === null) { if (column.pk) fail(`主键 ${table.name}.${column.name} 不能为空。`); continue; }
        if (type === 'BOOLEAN' && value !== 0 && value !== 1) fail(`BOOLEAN 字段 ${column.name} 只接受 TRUE/FALSE（或 1/0 及试题中的 YES/NO）。`);
        if (type === 'INTEGER' && !Number.isInteger(value)) fail(`INTEGER 字段 ${column.name} 需要整数。`);
        if (type === 'REAL' && typeof value !== 'number') fail(`REAL 字段 ${column.name} 需要数值。`);
        const width = /^(?:VARCHAR|CHARACTER)\((\d+)\)$/.exec(type);
        if (width && String(value).length > +width[1]) fail(`${column.name} 的文字超过声明的 ${width[1]} 个字符。`);
        if (type === 'DATE') normalizeDate(String(value));
        if (type === 'TIME' && !/^([01]\d|2[0-3]):[0-5]\d(?::[0-5]\d)?$/.test(String(value))) fail(`TIME 字段 ${column.name} 请使用 HH:MM 或 HH:MM:SS。`);
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
    if (grouped < 0) fail('聚合结果不能任意附上一条普通记录的字段：请只选择聚合结果，或在 AS / A Level 中把普通字段加入 GROUP BY。');

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
      fail(`字段 ${field.column.name} 在一个分组内可能有多个值，不能任意取其中一条。请将它加入 GROUP BY 或使用聚合函数；按该表完整主键分组时，可选择由主键唯一确定的字段。`);
    }
  }
  function run(sql,options = {}) {
    if (closed) fail('数据库已关闭，请重新打开学习器。');
    const {statements} = validateSql(sql,options.level || level);
    const before = exportState(), notes = [];
    let result = {columns:[],rows:[],affected:0,message:'',notes,kind:'statement'};
    try {
      for (const tokens of statements) {
        const kind = upper(tokens[0]);
        const translated = normalize(tokens,notes);
        if (kind === 'CREATE' && isWord(tokens[1],'DATABASE')) {
          const next = open(); db.close(); db = next; databaseName = tokens[2].value;
          notes.push('CREATE DATABASE 已切换到新的空白本地沙盒；重置可以回到本题初始数据。');
          result = {columns:[],rows:[],affected:0,message:`已创建并切换到 ${databaseName}。`,notes,kind:'schema'};
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
          if (truncated) notes.push(`结果超过 ${LIMIT} 行，仅显示前 ${LIMIT} 行；请增加筛选条件。`);
          result = {columns,rows:values.slice(0,LIMIT),affected:0,message:`返回 ${Math.min(values.length,LIMIT)} 行${truncated ? '（已截断）' : ''}。`,notes,kind:'select',truncated};
        } else {
          if (kind === 'CREATE') createTable(tokens,notes);
          else if (kind === 'ALTER') {
            const addition = tokens.slice(isWord(tokens[4],'COLUMN') ? 5 : 4);
            if (isWord(addition[0],'PRIMARY') || isWord(addition[0],'FOREIGN') || isWord(addition[0],'CONSTRAINT')) addKey(tokens[2].value,addition,notes);
            else for (const group of split(addition)) db.run(`ALTER TABLE ${quote(tokens[2].value)} ADD COLUMN ${renderDefinition(group,notes)}`);
          } else db.run(translated);
          checkData();
          const affected = ['INSERT','UPDATE','DELETE'].includes(kind) ? db.getRowsModified() : 0;
          result = {columns:[],rows:[],affected,message:affected ? `已影响 ${affected} 行。` : (['INSERT','UPDATE','DELETE'].includes(kind) ? '执行成功，影响 0 行。' : '数据结构已更新。'),notes,kind:['CREATE','ALTER'].includes(kind) ? 'schema' : 'write'};
        }
      }
      result.notes = [...new Set(notes)];
      if (statements.length > 1) result.message = `已执行 ${statements.length} 条语句。${result.message}`;
      return result;
    } catch (error) { restore(before); throw new Error(errorMessage(error)); }
  }
  return {run,tables,export:exportState,restore,reset() { restore(initial); return tables(); },close() { if (!closed) db.close(); closed = true; },get databaseName() { return databaseName; }};
}
