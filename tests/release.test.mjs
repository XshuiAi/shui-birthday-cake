import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import {validateSource,readSource,writeRelease,marker,outputName} from '../scripts/release-io.mjs';
const fixture=async()=>fs.mkdtemp(path.join(await fs.realpath(os.tmpdir()),'cake-release-test-'));
const good='<!doctype html>'+marker+'<script id="app-bundle"></script>';
test('release rejects arbitrary paths before access',()=>{
 for(const name of ['.','..','/','~',process.cwd(),path.dirname(process.cwd()),'/tmp/a','../style.css','assets/../style.css','assets/c-style/../../secret','templates','--force','--clean'])assert.throws(()=>validateSource(name));
 assert.equal(validateSource('assets/c-style/recipe-0-0.png'),'assets/c-style/recipe-0-0.png');
});
test('release refuses symlink sources and outputs',async()=>{
 const root=await fixture(),outside=await fixture();await fs.writeFile(path.join(outside,'keep'),'original');await fs.symlink(path.join(outside,'keep'),path.join(root,'style.css'));await assert.rejects(readSource(root,'style.css'));
 await fs.symlink(path.join(outside,'keep'),path.join(root,outputName));await assert.rejects(writeRelease(root,good));assert.equal(await fs.readFile(path.join(outside,'keep'),'utf8'),'original');
});
test('unowned output and invalid build remain untouched',async()=>{
 const root=await fixture(),file=path.join(root,outputName);await fs.writeFile(file,'user file');await assert.rejects(writeRelease(root,good));await assert.rejects(writeRelease(root,'bad'));assert.equal(await fs.readFile(file,'utf8'),'user file');
});
test('release preserves previous generated output before atomic replacement',async()=>{
 const root=await fixture();await writeRelease(root,good);await writeRelease(root,good+'new');assert.equal(await fs.readFile(path.join(root,outputName),'utf8'),good+'new');const backup=(await fs.readdir(root)).find(n=>n.includes('.previous-'));assert.equal(await fs.readFile(path.join(root,backup),'utf8'),good);
});
