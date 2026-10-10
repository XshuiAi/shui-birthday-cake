import {fileURLToPath} from 'node:url';
import {escapeJSON} from '../model.mjs';
import {threeLicense} from '../license.mjs';
import {readSource,writeRelease,marker} from './release-io.mjs';
if(process.argv.length>2)throw Error('This build accepts no path, force, overwrite or clean arguments');
const root=fileURLToPath(new URL('../',import.meta.url));
const [js,css,notices,license]=await Promise.all(['dist/app.js','style.css','THIRD_PARTY_NOTICES.txt','LICENSE'].map(name=>readSource(root,name,'utf8')));
const assets={};
for(const category of ['recipe','food','pretty','paper'])for(let row=0;row<3;row++)for(let col=0;col<6;col++){
 const key=`${category}-${row}-${col}`;assets[key]='data:image/png;base64,'+(await readSource(root,`assets/c-style/${key}.png`)).toString('base64');
}
for(const [key,name]of [['songParty','its-your-birthday.mp3'],['songClassic','happy-birthday-alexander.mp3']])assets[key]='data:audio/mpeg;base64,'+(await readSource(root,'assets/audio/'+name)).toString('base64');
const note=(license+'\n\n'+notices).replaceAll('--','—');
const html='<!doctype html>'+marker+'<html lang="zh-CN"><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>一点甜 · 生日蛋糕工坊</title><!-- Sherry小水 · https://github.com/XshuiAi/shui-birthday-cake\n'+note+'\nThree.js https://threejs.org/\n'+threeLicense+' --><style id="app-style">'+css+'</style><div id="app"></div><script>window.__CAKE_ASSETS__='+escapeJSON(assets)+';</script><script id="app-bundle" type="module">'+js.replace(/<\/script/gi,'<\\/script')+'</script></html>';
await writeRelease(root,html);
await writeRelease(root,html.replace('<title>一点甜 · 生日蛋糕工坊</title>','<title>手作生日蛋糕</title>'),'手作生日蛋糕.html');
console.log('Built standalone workshop',Math.round(Buffer.byteLength(html)/1024/1024*10)/10,'MB');
