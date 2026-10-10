import http from 'node:http';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root=path.dirname(fileURLToPath(import.meta.url));
const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.png':'image/png','.json':'application/json','.mp3':'audio/mpeg'};
http.createServer(async(req,res)=>{
  try {
    const url=new URL(req.url,'http://localhost');
    const name=decodeURIComponent(url.pathname)==='/'?'index.html':decodeURIComponent(url.pathname).slice(1);
    if(!['index.html','style.css','dist/app.js','assets/real.png','assets/felt.png','一点甜-成品工坊.html','手作生日蛋糕.html','生日礼物验收.html','assets/audio/its-your-birthday.mp3','assets/audio/happy-birthday-alexander.mp3'].includes(name)&&!/^assets\/c-style\/(recipe|food|pretty|paper)-[0-2]-[0-5]\.png$/.test(name)){res.writeHead(404);res.end('Not found');return;}
    const data=await readFile(path.join(root,name));res.writeHead(200,{'Content-Type':mime[path.extname(name)]||'application/octet-stream','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'});res.end(data);
  } catch {res.writeHead(404);res.end('Not found');}
}).listen(5188,'127.0.0.1',()=>console.log('一点甜：http://127.0.0.1:5188'));
