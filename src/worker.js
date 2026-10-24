// Instantiate as a classic worker using a URL relative to the application directory.
let engine, SQL, createEngine;
async function loadSql() {
  if (SQL) return SQL;
  importScripts(new URL('../vendor/sql-wasm.js',self.location.href).href);
  ({createEngine} = await import('./engine.js'));
  SQL = await globalThis.initSqlJs({locateFile:() => new URL('../vendor/sql-wasm.wasm',self.location.href).href});
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
      if (!engine) throw new Error("Initialise the SQL sandbox first.");
      if (type === 'run') result = engine.run(options.sql,{level:options.level});
      else if (type === 'tables') result = engine.tables();
      else if (type === 'export') result = engine.export();
      else if (type === 'restore') { engine.restore(options.snapshot); result = engine.tables(); }
      else if (type === 'reset') result = engine.reset();
      else throw new Error("Unknown sandbox operation.");
    }
    self.postMessage({id,result});
  } catch (error) { self.postMessage({id,error:error.message}); }
};
