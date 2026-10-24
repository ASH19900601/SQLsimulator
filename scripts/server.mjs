import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
const root = path.resolve(import.meta.dirname, '..');
const port = Number(process.env.PORT || 4173);
const mime = {'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.mjs':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json; charset=utf-8','.webmanifest':'application/manifest+json','.svg':'image/svg+xml','.png':'image/png','.wasm':'application/wasm','.md':'text/plain; charset=utf-8'};
const server = http.createServer(async (req,res) => {
  try {
    const url = new URL(req.url, 'http://localhost');
    let relative = decodeURIComponent(url.pathname).replace(/^\/+/, '') || 'index.html';
    if (relative.startsWith('public/')) relative = relative.slice(7);
    const base = /^(src|docs)\//.test(relative) ? root : path.join(root,'public');
    const file = path.resolve(base,relative);
    if (!file.startsWith(base + path.sep) || relative.includes('..')) {res.writeHead(403);res.end('Forbidden');return;}
    const info = await stat(file);
    if (!info.isFile()) throw new Error('Not a file');
    res.writeHead(200, {'Content-Type':mime[path.extname(file)] || 'application/octet-stream','Cache-Control':'no-cache','X-Content-Type-Options':'nosniff'});
    res.end(await readFile(file));
  } catch {res.writeHead(404,{'Content-Type':'text/plain; charset=utf-8'});res.end('Not found');}
});
server.listen(port,'0.0.0.0',()=>{
  console.log(`QueryPath ready: http://localhost:${port}`);
  for(const list of Object.values(os.networkInterfaces())) for(const info of list || []) if(info.family==='IPv4' && !info.internal) console.log(`Network address (check your Wi-Fi interface): http://${info.address}:${port}`);
});
