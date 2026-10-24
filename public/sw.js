const SCOPE=self.registration.scope;
const PREFIX=`querypath-${SCOPE}-`;
const CACHE=`${PREFIX}20261024-pages-1`;
const ASSETS=['./','index.html','styles.css','icon.svg','icon-192.png','icon-512.png','manifest.webmanifest','vendor/sql-wasm.js','vendor/sql-wasm.wasm','src/app.js','src/state.js','src/grader.js','src/engine.js','src/worker.js','src/curriculum.js','docs/research/ig-papers.json','docs/research/as-papers.json','docs/research/ig-paper-audit.md','docs/research/as-paper-audit.md','docs/research/syllabus-scope.md'].map(path=>new URL(path,SCOPE).href);
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS)).then(()=>self.skipWaiting())));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith(PREFIX)&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',event=>{
  const url=new URL(event.request.url);
  if(event.request.method!=='GET'||url.origin!==self.location.origin||!url.href.startsWith(SCOPE))return;
  event.respondWith(fetch(event.request).then(response=>{
    if(response.ok&&ASSETS.includes(url.href)){const clone=response.clone();event.waitUntil(caches.open(CACHE).then(cache=>cache.put(event.request,clone)));}
    return response;
  }).catch(async()=>await caches.match(event.request)||(event.request.mode==='navigate'?await caches.match(new URL('index.html',SCOPE).href):new Response('Offline resource unavailable',{status:503}))));
});
