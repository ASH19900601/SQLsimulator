import http from 'node:http';
import {cp,mkdir,mkdtemp,readFile} from 'node:fs/promises';
import path from 'node:path';

// Serve the same static layout as the Pages artifact under the repository prefix.
let server;
if (!process.env.BASE_URL) {
  const root=path.resolve(import.meta.dirname,'..');
  const temporary=path.join(root,'tmp');
  await mkdir(temporary,{recursive:true});
  const directory=await mkdtemp(path.join(temporary,'pages-'));
  await cp(path.join(root,'public'),directory,{recursive:true});
  await cp(path.join(root,'src'),path.join(directory,'src'),{recursive:true});
  await cp(path.join(root,'docs/research'),path.join(directory,'docs/research'),{recursive:true});
  const prefix='/SQLsimulator/';
  const mime={'.html':'text/html','.js':'text/javascript','.css':'text/css','.wasm':'application/wasm','.json':'application/json','.webmanifest':'application/manifest+json','.svg':'image/svg+xml','.png':'image/png','.md':'text/plain'};
  server=http.createServer(async(req,res)=>{
    try {
      const pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
      if(!pathname.startsWith(prefix))throw new Error('Outside site');
      const file=path.resolve(directory,pathname.slice(prefix.length)||'index.html');
      if(!file.startsWith(directory+path.sep))throw new Error('Outside artifact');
      const bytes=await readFile(file);
      res.writeHead(200,{'Content-Type':mime[path.extname(file)]||'application/octet-stream'});
      res.end(bytes);
    }catch{res.writeHead(404);res.end('Not found');}
  });
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
  process.env.BASE_URL=`http://127.0.0.1:${server.address().port}${prefix}`;
}
try { await import('./browser-check.mjs'); }
finally { if(server)await new Promise(resolve=>server.close(resolve)); }
