import test from 'node:test';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
import initSqlJs from 'sql.js';
import {sameResult, gradeSql} from '../src/grader.js';
import {createEngine} from '../src/engine.js';

const SQL = await initSqlJs({locateFile: file => fileURLToPath(new URL(`../node_modules/sql.js/dist/${file}`, import.meta.url))});
const result = (rows, columns = ['Value']) => ({rows, columns});
const dataset = {seed: `
  CREATE TABLE Learner(ID INTEGER PRIMARY KEY, Name VARCHAR(20), Score REAL);
  INSERT INTO Learner VALUES(1, 'Alice', 70), (2, 'Ben', 85), (3, 'Cia', 85);
`};
const exercise = (solution, extra = {}) => ({id:'regression', level:'as', solution, ...extra});
const grade = (solution, answer, extra = {}, data = dataset) => gradeSql(SQL, exercise(solution, extra), data, answer);

test('unordered query results preserve the multiset, not incidental row order', () => {
  assert.equal(sameResult(result([[1], [2], [2]]), result([[2], [1], [2]])), true);
  assert.equal(sameResult(result([[1], [2]]), result([[1], [2], [2]])), false);
  assert.equal(sameResult(result([[1], [1], [2]]), result([[1], [2], [2]])), false);
});

test('ordering is enforced only when the task requires it', () => {
  assert.equal(sameResult(result([[1], [2]]), result([[2], [1]]), true), false);
  assert.equal(sameResult(result([[1], [2]]), result([[2], [1]]), false), true);
});

test('column order, projection width and NULL are meaningful', () => {
  assert.equal(sameResult(result([[1, 'A']], ['ID', 'Name']), result([['A', 1]], ['Name', 'ID'])), false);
  assert.equal(sameResult(result([], ['ID']), result([], ['ID', 'Name'])), false);
  assert.equal(sameResult(result([[null]]), result([['null']])), false);
  assert.equal(sameResult(result([[1]]), result([['1']])), false);
});

test('small real numbers are not rounded into a false correct answer', () => {
  assert.equal(sameResult(result([[0]]), result([[0.000000004]])), false);
  assert.equal(sameResult(result([[0.000000001]]), result([[0.000000002]])), false);
  assert.equal(sameResult(result([[1000000000000000]]), result([[1000000000000001]])), false);
  assert.equal(sameResult(result([[0.1 + 0.2]]), result([[0.3]])), true);
  assert.equal(sameResult(result([[1 + Number.EPSILON, 'A'], [1, 'B']], ['Score', 'Name']), result([[1, 'B'], [1, 'A']], ['Score', 'Name'])), true);
});

test('an unnecessary order is accepted when the question does not request one', async () => {
  assert.equal((await grade('SELECT Name FROM Learner;', 'SELECT Name FROM Learner ORDER BY Name DESC;')).passed, true);
  assert.equal((await grade('SELECT Name FROM Learner ORDER BY Name;', 'SELECT Name FROM Learner ORDER BY Name DESC;', {ordered:true})).passed, false);
});

test('empty SQL results retain their projection width for grading', async () => {
  const checked = await grade('SELECT Name FROM Learner WHERE Score > 100;', 'SELECT ID, Name FROM Learner WHERE Score > 100;');
  assert.equal(checked.want.rows.length, 0);
  assert.deepEqual(checked.want.columns, ['Name']);
  assert.equal(checked.passed, false);
  assert.match(checked.detail, /字段数量/);
});

test('required aggregate titles accept another suitable alias but reject its omission', async () => {
  const solution = 'SELECT COUNT(ID) AS TotalLearners FROM Learner;';
  assert.equal((await grade(solution, 'SELECT COUNT(ID) AS LearnerCount FROM Learner;', {aliasColumns:[0]})).passed, true);
  const missing = await grade(solution, 'SELECT COUNT(ID) FROM Learner;', {aliasColumns:[0]});
  assert.equal(missing.passed, false);
  assert.match(missing.detail, /列标题/);
});

test('supplemental boundary records distinguish >= from > despite an identical example result', async () => {
  const solution = 'SELECT Name FROM Learner WHERE Score >= 80;';
  const answer = 'SELECT Name FROM Learner WHERE Score > 80;';
  assert.equal((await grade(solution, answer)).passed, true);
  const checked = await grade(solution, answer, {checks:[{seed:"INSERT INTO Learner VALUES(4, 'Dani', 80);"}]});
  assert.equal(checked.passed, false);
  assert.match(checked.detail, /新增数据/);
});

test('supplemental records reject names hardcoded to the visible answer', async () => {
  const answer = "SELECT Name FROM Learner WHERE Name = 'Ben' OR Name = 'Cia';";
  const checked = await grade('SELECT Name FROM Learner WHERE Score >= 80;', answer, {
    checks:[{seed:"INSERT INTO Learner VALUES(4, 'Dani', 92);"}]
  });
  assert.equal(checked.passed, false);
});

test('a successful UPDATE is insufficient when it changes unintended records', async () => {
  const checked = await grade('UPDATE Learner SET Score = 90 WHERE ID = 2;', 'UPDATE Learner SET Score = 90;');
  assert.equal(checked.passed, false);
});

test('a query cannot satisfy an UPDATE task merely because the target currently has no rows', async () => {
  const checked = await grade('UPDATE Learner SET Score = 90 WHERE ID = 999;', 'SELECT Name FROM Learner;');
  assert.equal(checked.passed, false);
  assert.match(checked.detail, /UPDATE/);
});

test('a read task cannot be solved by changing the source data before returning matching rows', async () => {
  const solution = 'SELECT Name FROM Learner WHERE Score >= 80;';
  const answer = "SELECT Name FROM Learner; UPDATE Learner SET Score = 0; SELECT Name FROM Learner WHERE ID >= 2;";
  const checked = await grade(solution, answer);
  assert.equal(checked.passed, false);
  assert.match(checked.detail, /原始数据/);
});

test('mutation checks also exercise the exact filtering boundary', async () => {
  const checked = await grade('UPDATE Learner SET Score = 100 WHERE Score >= 80;', 'UPDATE Learner SET Score = 100 WHERE Score > 80;', {
    checks:[{seed:"INSERT INTO Learner VALUES(4, 'Dani', 80);"}]
  });
  assert.equal(checked.passed, false);
  assert.match(checked.detail, /新增数据/);
});

test('INSERT grading compares the actual stored values, including identifier text', async () => {
  const solution = "INSERT INTO Learner VALUES(4, 'Dani', 90);";
  assert.equal((await grade(solution, "INSERT INTO Learner(Name, Score, ID) VALUES('Dani', 90, 4);")).passed, true);
  assert.equal((await grade(solution, "INSERT INTO Learner VALUES(4, 'Dani', 9);")).passed, false);
});

test('CREATE DATABASE must use the requested name', async () => {
  assert.equal((await grade('CREATE DATABASE Revision;', 'CREATE DATABASE revision;')).passed, true);
  const wrong = await grade('CREATE DATABASE Revision;', 'CREATE DATABASE SomethingElse;');
  assert.equal(wrong.passed, false);
  assert.match(wrong.detail, /数据库名称/);
});

const create = 'CREATE TABLE Assessment(ID INTEGER NOT NULL, Label VARCHAR(20) NOT NULL, Score REAL, PRIMARY KEY(ID));';

test('DDL recognizes the equivalent numeric type spellings used by mark schemes', async () => {
  const answer = 'CREATE TABLE Assessment(ID INT NOT NULL, Label VARCHAR(20) NOT NULL, Score FLOAT, PRIMARY KEY(ID));';
  assert.equal((await grade(create, answer)).passed, true);
});

test('CHAR is equivalent to CHARACTER without removing its declared width', async () => {
  const solution = 'CREATE TABLE CodeList(Code CHARACTER(4), PRIMARY KEY(Code));';
  assert.equal((await grade(solution, 'CREATE TABLE CodeList(Code CHAR(4), PRIMARY KEY(Code));')).passed, true);
  assert.equal((await grade(solution, 'CREATE TABLE CodeList(Code VARCHAR(4), PRIMARY KEY(Code));')).passed, true);
  assert.equal((await grade(solution, 'CREATE TABLE CodeList(Code CHAR(1), PRIMARY KEY(Code));')).passed, false);
});

test('an empty table cannot conceal missing NOT NULL, incorrect types or an incorrect primary key', async () => {
  const missingRequired = 'CREATE TABLE Assessment(ID INTEGER NOT NULL, Label VARCHAR(20), Score REAL, PRIMARY KEY(ID));';
  const wrongType = 'CREATE TABLE Assessment(ID INTEGER NOT NULL, Label VARCHAR(20) NOT NULL, Score INTEGER, PRIMARY KEY(ID));';
  const wrongKey = 'CREATE TABLE Assessment(ID INTEGER NOT NULL, Label VARCHAR(20) NOT NULL, Score REAL, PRIMARY KEY(Label));';
  assert.equal((await grade(create, missingRequired)).passed, false);
  assert.equal((await grade(create, wrongType)).passed, false);
  assert.equal((await grade(create, wrongKey)).passed, false);
});

test('a logically equivalent CREATE TABLE may declare columns in another order', async () => {
  const reordered = 'CREATE TABLE Assessment(Score REAL, Label VARCHAR(20) NOT NULL, ID INTEGER NOT NULL, PRIMARY KEY(ID));';
  assert.equal((await grade(create, reordered)).passed, true);
});

const parents = {seed: 'CREATE TABLE ParentA(ID INTEGER PRIMARY KEY); CREATE TABLE ParentB(ID INTEGER PRIMARY KEY);'};
const child = 'CREATE TABLE Child(ID INTEGER, AID INTEGER, BID INTEGER, PRIMARY KEY(ID), FOREIGN KEY(AID) REFERENCES ParentA(ID), FOREIGN KEY(BID) REFERENCES ParentB(ID));';

test('foreign-key declaration order is immaterial but the referenced table is not', async () => {
  const reordered = 'CREATE TABLE Child(ID INTEGER, AID INTEGER, BID INTEGER, PRIMARY KEY(ID), FOREIGN KEY(BID) REFERENCES ParentB(ID), FOREIGN KEY(AID) REFERENCES ParentA(ID));';
  const wrongReference = 'CREATE TABLE Child(ID INTEGER, AID INTEGER, BID INTEGER, PRIMARY KEY(ID), FOREIGN KEY(AID) REFERENCES ParentB(ID), FOREIGN KEY(BID) REFERENCES ParentB(ID));';
  assert.equal((await grade(child, reordered, {}, parents)).passed, true);
  assert.equal((await grade(child, wrongReference, {}, parents)).passed, false);
});

test('omitting a foreign key is detected even when the new table has no rows', async () => {
  const missing = 'CREATE TABLE Child(ID INTEGER, AID INTEGER, BID INTEGER, PRIMARY KEY(ID), FOREIGN KEY(AID) REFERENCES ParentA(ID));';
  assert.equal((await grade(child, missing, {}, parents)).passed, false);
});

test('a single primary-key field does not satisfy a composite-key question', async () => {
  const solution = 'CREATE TABLE Entry(PersonID INTEGER, EventID INTEGER, PRIMARY KEY(PersonID, EventID));';
  const answer = 'CREATE TABLE Entry(PersonID INTEGER, EventID INTEGER, PRIMARY KEY(PersonID));';
  assert.equal((await grade(solution, answer)).passed, false);
});

test('all published exercises have working SQL solutions, predictions or concept answer keys', async t => {
  const curriculum = await import('../src/curriculum.js');
  const exercises = curriculum.exercises;
  const datasets = curriculum.datasets;
  assert.ok(Array.isArray(exercises) && exercises.length >= 49, 'expected the complete course, not a reduced fixture');
  for (const item of exercises) {
    await t.test(item.id, async () => {
      if (item.kind === 'concept') {
        assert.ok(Array.isArray(item.options) && item.options.length >= 2);
        assert.ok(Number.isInteger(item.answer) && item.answer >= 0 && item.answer < item.options.length);
        return;
      }
      const data = Array.isArray(datasets) ? datasets.find(d => d.id === item.dataset) : datasets[item.dataset];
      assert.ok(data, `dataset missing for ${item.id}: ${item.dataset}`);
      if (item.kind === 'predict') {
        const db = await createEngine({SQL, level:item.level, seed:data.seed + (item.setup ? '\n' + item.setup : '')});
        try {
          const got = db.run(item.starter || item.solution);
          const expectedRows = String(item.expected).trim().split('\n').map(line => line.split(',').map(cell => cell.trim()));
          const actualRows = got.rows.map(row => row.map(cell => String(cell ?? 'NULL')));
          assert.equal(sameResult({columns:got.columns, rows:actualRows}, {columns:got.columns, rows:expectedRows}, !!item.ordered), true);
        } finally {db.close();}
        return;
      }
      assert.equal(item.kind, 'sql', `unknown exercise kind for ${item.id}`);
      const outcome = await gradeSql(SQL, item, data, item.solution);
      assert.equal(outcome.passed, true, outcome.detail);
    });
  }
});

test('every lesson example runs directly against its advertised dataset', async t => {
  const {lessons, datasets} = await import('../src/curriculum.js');
  assert.ok(Array.isArray(lessons) && lessons.length >= 16, 'expected the complete learning guide');
  for (const lesson of lessons) {
    await t.test(lesson.id, async () => {
      const data = datasets.find(item => item.id === lesson.dataset);
      assert.ok(data, `dataset missing for lesson ${lesson.id}`);
      assert.ok(lesson.example?.trim(), `example missing for lesson ${lesson.id}`);
      const db = await createEngine({SQL, level:lesson.level, seed:data.seed});
      try {
        const output = db.run(lesson.example, {level:lesson.level});
        assert.ok(['select', 'schema', 'write'].includes(output.kind));
      } finally {db.close();}
    });
  }
});
