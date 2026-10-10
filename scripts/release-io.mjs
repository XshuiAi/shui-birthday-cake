import fs from 'node:fs/promises';
import path from 'node:path';
import {randomUUID} from 'node:crypto';
export const marker='<!-- little-cake-generated-release:v1 -->';
export const outputName='一点甜-成品工坊.html';
const staticSources=new Set(['dist/app.js','style.css','THIRD_PARTY_NOTICES.txt','LICENSE','assets/audio/its-your-birthday.mp3','assets/audio/happy-birthday-alexander.mp3']);
export function validateSource(name){
 if(typeof name!=='string'||(!staticSources.has(name)&&!/^assets\/c-style\/(recipe|food|pretty|paper)-[0-2]-[0-5]\.png$/.test(name)))throw Error('Source is not on the release allowlist');
 return name;
}
async function plainPath(root,name){
 const resolved=path.resolve(root),real=await fs.realpath(resolved);
 if(real!==resolved)throw Error('Release root cannot be a symlink');
 let target=resolved;
 for(const part of name.split('/')){target=path.join(target,part);const stat=await fs.lstat(target);if(stat.isSymbolicLink())throw Error('Symlink rejected');}
 return target;
}
export async function readSource(root,name,encoding){return fs.readFile(await plainPath(root,validateSource(name)),encoding);}
export async function writeRelease(root,html,name=outputName){
 if(![outputName,'手作生日蛋糕.html'].includes(name))throw Error('Output is not on the release allowlist');
 if(!html.startsWith('<!doctype html>')||!html.includes(marker)||!html.includes('id="app-bundle"'))throw Error('Invalid generated release');
 const base=path.resolve(root);if(await fs.realpath(base)!==base)throw Error('Release root cannot be a symlink');
 const output=path.join(base,name);let previous=null;
 try{const stat=await fs.lstat(output);if(!stat.isFile()||stat.isSymbolicLink())throw Error('Output must be a regular generated file');previous=await fs.readFile(output);if(!previous.toString().includes(marker))throw Error('Refusing to replace unowned output');}catch(e){if(e.code!=='ENOENT')throw e;}
 const suffix=randomUUID(),temporary=output+'.tmp-'+suffix;
 // Write and validate before touching the existing output. A failed build leaves it intact.
 await fs.writeFile(temporary,html,{flag:'wx'});
 const written=await fs.readFile(temporary,'utf8');if(written!==html)throw Error('Release verification failed');
 if(previous){const current=await fs.readFile(await plainPath(base,name));if(!current.equals(previous))throw Error('Output changed during build');await fs.writeFile(output+'.previous-'+suffix,previous,{flag:'wx'});}
 await fs.rename(temporary,output);
}
