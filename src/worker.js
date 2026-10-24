// Instantiate as a classic worker: new Worker('/src/worker.js').
let engine, SQL, createEngine;
async function loadSql() {
  if (SQL) return SQL;
  importScripts('/vendor/sql-wasm.js');
  ({createEngine} = await import('./engine.js'));
  SQL = await globalThis.initSqlJs({locateFile:() => '/vendor/sql-wasm.wasm'});
  return SQL;
}
self.onmessage = async ({data}) => {
  const {id,type,...options} = data;
  try {
    let result;
    if (type === 'init') {
      engine?.close();
      const runtime = await loadSql();
      engine = await createEngine({...options,SQL:runtime});
      result = {tables:engine.tables(),databaseName:engine.databaseName};
    } else {
      if (!engine) throw new Error('请先初始化 SQL 沙盒。');
      if (type === 'run') result = engine.run(options.sql,{level:options.level});
      else if (type === 'tables') result = engine.tables();
      else if (type === 'export') result = engine.export();
      else if (type === 'restore') { engine.restore(options.snapshot); result = engine.tables(); }
      else if (type === 'reset') result = engine.reset();
      else throw new Error('未知的沙盒操作。');
    }
    self.postMessage({id,result});
  } catch (error) { self.postMessage({id,error:error.message}); }
};
