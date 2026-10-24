import test from 'node:test';
import assert from 'node:assert/strict';
import initSqlJs from 'sql.js';
import {createEngine,validateSql} from '../src/engine.js';

const SQL = await initSqlJs();
const seed = `CREATE TABLE CLUB (ClubID INTEGER PRIMARY KEY, ClubName VARCHAR(30));
INSERT INTO CLUB VALUES (1,'Music'),(2,'Sport');
CREATE TABLE STUDENT (StudentID INTEGER PRIMARY KEY, Name VARCHAR(30), Score INTEGER, Active BOOLEAN, Joined DATE, ClubID INTEGER);
INSERT INTO STUDENT VALUES (1,'Amy',80,1,'2026-01-10',1),(2,'Ben',50,0,'2025-03-12',1),(3,'Chen',90,1,'2026-02-20',2);`;
async function sandbox(level = 'as',data = seed) { return createEngine({SQL,level,seed:data}); }

test('IG query, sort field outside projection, double quotes, original string content',async () => {
  const db = await sandbox('ig');
  assert.deepEqual(db.run('SELECT Name FROM STUDENT WHERE Score >= 70 ORDER BY Score DESCENDING;').rows,[['Chen'],['Amy']]);
  assert.deepEqual(db.run('SELECT Name FROM STUDENT WHERE Name = "Amy"').rows,[['Amy']]);
  assert.equal(db.run("SELECT Name FROM STUDENT WHERE Name = 'DROP TABLE; SELECT AVG(foo)' -- harmless").rows.length,0);
  db.close();
});
test('scope distinguishes IG and AS and rejects executable extras',async () => {
  const db = await sandbox('ig');
  for (const query of ['DELETE FROM STUDENT','SELECT AVG(Score) FROM STUDENT','SELECT * FROM STUDENT, CLUB','SELECT ClubID, COUNT(*) FROM STUDENT GROUP BY ClubID',"SELECT * FROM STUDENT WHERE Name LIKE 'A%'",'SELECT * FROM STUDENT WHERE Score IN (1,2)','SELECT randomblob(1000000) FROM STUDENT','SELECT * FROM (SELECT * FROM STUDENT)']) assert.throws(() => db.run(query));
  assert.doesNotThrow(() => validateSql("SELECT Name FROM STUDENT WHERE Name LIKE 'Amy'",'ig'));
  assert.throws(() => validateSql("SELECT Name FROM STUDENT WHERE Name LIKE 'Amy' OR Name LIKE '%'",'ig'),/通配/);
  assert.throws(() => validateSql('SELECT * FROM STUDENT, CLUB, STUDENT S','as'),/两张表/);
  db.close();
});
test('contextual Boolean, ordinary string No, bare and NOT Boolean conditions',async () => {
  const db = await sandbox();
  for (const value of ['TRUE','YES','Y','T','"Yes"']) assert.equal(db.run(`SELECT Name FROM STUDENT WHERE Active = ${value}`).rows.length,2);
  assert.deepEqual(db.run('SELECT Name FROM STUDENT WHERE NOT Active').rows,[['Ben']]);
  assert.equal(db.run('SELECT Name FROM STUDENT WHERE Active').rows.length,2);
  db.run("UPDATE STUDENT SET Name='No' WHERE StudentID=2");
  assert.deepEqual(db.run("SELECT Name FROM STUDENT WHERE Name='No'").rows,[['No']]);
  db.close();
});
test('AS joins, aggregates, aliases, group by, historical LIKE wildcard',async () => {
  const db = await sandbox();
  assert.deepEqual(db.run('SELECT CLUB.ClubName, AVG(STUDENT.Score) AS Average FROM CLUB INNER JOIN STUDENT ON CLUB.ClubID=STUDENT.ClubID GROUP BY CLUB.ClubID ORDER BY Average DESC').rows,[['Sport',90],['Music',65]]);
  assert.equal(db.run('SELECT Name FROM STUDENT,CLUB WHERE STUDENT.ClubID=CLUB.ClubID AND CLUB.ClubName="Music"').rows.length,2);
  assert.deepEqual(db.run("SELECT Name FROM STUDENT WHERE Name LIKE 'A*'").rows,[['Amy']]);
  db.close();
});
test('dates normalize hash literals and contextual quoted dates',async () => {
  const db = await sandbox();
  assert.equal(db.run('SELECT Name FROM STUDENT WHERE Joined > #01/01/2026#').rows.length,2);
  assert.equal(db.run("SELECT Name FROM STUDENT WHERE Joined > '01/01/26'").rows.length,2);
  assert.throws(() => db.run('SELECT Name FROM STUDENT WHERE Joined > #31/02/2026#'),/不存在/);
  db.close();
});
test('writes persist, snapshots restore, reset seeds, failed batches roll back',async () => {
  const db = await sandbox(), saved = db.export();
  assert.equal(db.run('UPDATE STUDENT SET Score=75, Active=YES WHERE StudentID=2').affected,1);
  db.restore(saved); assert.equal(db.run('SELECT Score FROM STUDENT WHERE StudentID=2').rows[0][0],50);
  assert.throws(() => db.run('DELETE FROM STUDENT; INSERT INTO Missing VALUES (1)'));
  assert.equal(db.run('SELECT COUNT(*) FROM STUDENT').rows[0][0],3);
  db.run('CREATE DATABASE Practice'); assert.equal(db.databaseName,'Practice'); assert.deepEqual(db.tables(),[]);
  assert.throws(() => db.run('CREATE DATABASE Failure; INSERT INTO Missing VALUES (1)'));
  assert.equal(db.databaseName,'Practice');
  db.reset(); assert.equal(db.tables().length,2); db.close();
});
test('DDL types aliases, multiple ADD columns, primary key enforces uniqueness and non-null',async () => {
  const db = await sandbox();
  db.run('CREATE TABLE ITEM (ID INT, Title VARCHAR(20)); ALTER TABLE ITEM ADD Cost REAL, Active BOOLEAN; ALTER TABLE ITEM ADD PRIMARY KEY (ID)');
  assert.equal(db.tables().find(table => table.name === 'ITEM').columns[0].type,'INTEGER');
  db.run('INSERT INTO ITEM VALUES (1,"Pen",2.5,YES)');
  assert.throws(() => db.run('INSERT INTO ITEM VALUES (1,"Pen",2.5,YES)'),/重复/);
  assert.throws(() => db.run('INSERT INTO ITEM VALUES (NULL,"Pen",2.5,YES)'),/不能为空/);
  assert.throws(() => db.run('CREATE TABLE BAD (ID BANANA)'),/类型/);
  db.run('CREATE TABLE TEXTKEY (ID VARCHAR(10) PRIMARY KEY, Label TEXT)');
  assert.throws(() => db.run("INSERT INTO TEXTKEY VALUES (NULL,'x')"),/不能为空/);
  db.close();
});
test('ALTER foreign keys enforce actual references and protect atomic state',async () => {
  const db = await sandbox();
  db.run('ALTER TABLE STUDENT ADD FOREIGN KEY (ClubID) REFERENCES CLUB(ClubID)');
  assert.equal(db.tables().find(table => table.name === 'STUDENT').foreignKeys.length,1);
  assert.throws(() => db.run('UPDATE STUDENT SET ClubID=99 WHERE StudentID=1'),/外键/);
  assert.throws(() => db.run('DELETE FROM CLUB WHERE ClubID=1'),/外键/);
  assert.equal(db.run('SELECT ClubID FROM STUDENT WHERE StudentID=1').rows[0][0],1);
  db.close();
});
test('ORDER table name from real papers stays intact',async () => {
  const db = await sandbox();
  db.run('CREATE TABLE ORDER (OrderID INTEGER PRIMARY KEY, Cost REAL); INSERT INTO ORDER VALUES (1,12),(2,4)');
  assert.deepEqual(db.run('SELECT ORDER.OrderID FROM ORDER ORDER BY Cost DESCENDING').rows,[[1],[2]]);
  assert.deepEqual(db.run('SELECT OrderID FROM ORDER ORDER BY Cost DESCENDING, OrderID',{level:'ig'}).rows,[[1],[2]]);
  assert.equal(db.tables().find(table => table.name === 'ORDER').name,'ORDER'); db.close();
});
test('an empty query preserves projection columns for result headers and accurate grading',async () => {
  const db = await sandbox();
  const result = db.run('SELECT Name, Score FROM STUDENT WHERE Score > 1000');
  assert.deepEqual(result.columns,['Name','Score']);
  assert.deepEqual(result.rows,[]);
  db.close();
});
test('aggregate queries reject arbitrary bare fields and accept grouped fields or PK-dependent fields',async () => {
  const db = await sandbox();
  assert.throws(() => db.run('SELECT Name, SUM(Score) FROM STUDENT'),/聚合结果不能/);
  assert.throws(() => db.run('SELECT ClubID, Name, AVG(Score) FROM STUDENT GROUP BY ClubID'),/Name.*多个值/);
  assert.throws(() => db.run('SELECT Name AS ClubID, AVG(Score) FROM STUDENT GROUP BY ClubID'),/Name.*多个值/);
  assert.throws(() => db.run('SELECT STUDENT.*, COUNT(*) FROM STUDENT GROUP BY ClubID'),/多个值/);
  assert.deepEqual(db.run('SELECT ClubID, AVG(Score) FROM STUDENT GROUP BY ClubID ORDER BY ClubID').rows,[[1,65],[2,90]]);
  assert.deepEqual(db.run('SELECT CLUB.ClubName, SUM(STUDENT.Score) FROM CLUB INNER JOIN STUDENT ON CLUB.ClubID=STUDENT.ClubID GROUP BY CLUB.ClubID ORDER BY CLUB.ClubID').rows,[['Music',130],['Sport',90]]);
  assert.deepEqual(db.run('SELECT C.ClubName, SUM(S.Score) AS Total FROM CLUB AS C, STUDENT S WHERE C.ClubID=S.ClubID GROUP BY C.ClubID ORDER BY C.ClubID').rows,[['Music',130],['Sport',90]]);
  assert.deepEqual(db.run('SELECT ClubID AS Club, AVG(Score) FROM STUDENT GROUP BY Club ORDER BY Club').rows,[[1,65],[2,90]]);
  db.close();
});
