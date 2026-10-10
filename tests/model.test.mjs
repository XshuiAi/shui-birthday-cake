import test from 'node:test';
import assert from 'node:assert/strict';
import {initialState,normalize,History,cakeHeight} from '../model.mjs';
import {makeGiftHTML} from '../export.mjs';
test('recipe roundtrip preserves paint, toppings and card',()=>{
 const s=initialState();s.coat=true;s.coatColor='#fff2dd';s.creamColor='#e9a7b5';s.pipes=[{x:1,y:1.1,z:0,size:.15,color:s.creamColor,normal:'top'}];s.decor=[{id:'a',kind:'bunny',x:0,y:1.1,z:0,scale:1,angle:0}];s.collage=[{id:'b',kind:'note',x:20,y:30,size:130,angle:-8,text:'生日快乐',src:''}];
 const n=normalize(JSON.parse(JSON.stringify(s)));assert.equal(n.coatColor,'#fff2dd');assert.equal(n.creamColor,'#e9a7b5');assert.equal(n.pipes.length,1);assert.equal(n.decor[0].kind,'bunny');assert.equal(n.collage[0].text,'生日快乐');assert.equal(cakeHeight(n),1.0699999999999998);
});
test('invalid imported fields cannot create external photos or unbounded objects',()=>{
 const n=normalize({layers:['bad','cocoa','matcha','vanilla'],decor:[{kind:'evil',x:0,y:0,z:0},{kind:'bunny',x:999,y:1,z:0,scale:Infinity}],pipes:[{x:NaN,y:1,z:0,color:'#ffffff'}],collage:[{kind:'photo',src:'https://example.com/private.png',x:-50,y:400,size:9999}],background:'url(https://example.com)'});
 assert.deepEqual(n.layers,['vanilla','cocoa','matcha']);assert.equal(n.decor.length,1);assert.equal(n.decor[0].x,1.6);assert.equal(n.decor[0].scale,1);assert.equal(n.pipes.length,0);assert.equal(n.collage[0].src,'');assert.equal(n.collage[0].size,360);assert.equal(n.background,'paper');
});
test('undo/redo deeply restores hand-applied cream and resets redo branch',()=>{
 const h=new History(),s=initialState();h.checkpoint(s);s.strokes.push({color:'#e9a7b5',surface:'top',size:.05,points:[[.2,.3]]});const previous=h.undo(s);assert.equal(previous.strokes.length,0);const next=h.redo(previous);assert.deepEqual(next.strokes[0].points,[[.2,.3]]);h.undo(next);h.checkpoint(previous);assert.equal(h.redo(previous),null);
});
test('gift export embeds data and prevents greeting text from closing script',()=>{
 const s=initialState();s.message='</script><img src=x onerror=alert(1)>';
 const html=makeGiftHTML(s,{real:'data:image/png;base64,AA',felt:'data:image/png;base64,AA'},'console.log("</script>")','body{color:red}');
 assert.equal((html.match(/<script/g)||[]).length,2);assert.equal((html.match(/<\/script>/g)||[]).length,2);assert.ok(!html.includes('<img src=x'));assert.ok(html.includes('Copyright © 2010-2025 three.js authors'));assert.ok(!html.includes('src="./'));assert.ok(html.includes('data:image/png;base64,AA'));
});

test('full birthday gift survives normalization with photo, music, dark room and letters',()=>{
 const s=initialState();s.song='classic';s.dark=true;s.banner='ribbon';s.message='生日快乐\n'+ '祝福'.repeat(350);s.stars=[{x:22,y:36,size:20}];s.decor=[{id:'letter',kind:'letter',text:'H',color:'#f2adc5',x:0,y:1.1,z:0,angle:1,scale:1.4},{id:'candle',kind:'candle',lit:true,color:'#a9d6ef',x:1,y:1.1,z:0,scale:1,angle:0}];s.collage=[{id:'photo',kind:'photo',src:'data:image/png;base64,AAA',frame:3,x:18,y:40,size:150,angle:6},{id:'env',kind:'envelope',asset:'paper-0-4',x:80,y:50,size:150}];s.sprinkles=[{x:0,y:1.1,z:0,color:'#f2adc5',kind:0,size:.04,angle:1}];
 const n=normalize(JSON.parse(JSON.stringify(s)));assert.equal(n.song,'classic');assert.equal(n.dark,true);assert.equal(n.banner,'ribbon');assert.equal(n.message,s.message);assert.equal(n.decor[0].text,'H');assert.equal(n.decor[1].lit,true);assert.equal(n.collage[0].frame,3);assert.equal(n.collage[0].src,s.collage[0].src);assert.equal(n.collage[1].asset,'paper-0-4');assert.equal(n.sprinkles.length,1);assert.equal(n.stars.length,1);
});
test('retired white daisy is removed from saved works and camera cannot flip the tray',()=>{
 const n=normalize({tilt:3.14,roll:2,collage:[{kind:'asset',asset:'pretty-2-0',x:20,y:20},{kind:'asset',asset:'pretty-2-1',x:20,y:20}]});assert.equal(n.collage.length,1);assert.equal(n.collage[0].asset,'pretty-2-1');assert.equal(n.tilt,.72);assert.equal(n.roll,0);
});

test('tiered demo roundtrip keeps tier placement and reusable photo templates',async()=>{
 const {makeDemo}=await import('../demo.mjs');const {cakeTiers,surfaceHeight}=await import('../model.mjs');const s=makeDemo(),n=normalize(JSON.parse(JSON.stringify(s)));assert.equal(n.layout,'tiered');assert.equal(cakeHeight(n),2.16);assert.equal(cakeTiers(n).length,3);assert.equal(surfaceHeight(n,1.5,0),.72);assert.equal(n.pipes.length,s.pipes.length);assert.equal(n.decor.filter(d=>d.kind==='candle').length,5);assert.deepEqual(n.collage.filter(c=>c.kind==='photo').map(c=>c.frame),[6,7]);
 const five=normalize({...s,layers:['vanilla','cocoa','matcha','taro','strawberry'],strokes:[{tier:4,surface:'side',color:'#ffffff',points:[[.5,.5]]}],collage:[{kind:'photo',frame:8,src:'data:image/jpeg;base64,AA',photos:['','data:image/png;base64,BB','https://untrusted.example/x'],templateSrc:'file:///private/photo'}]});assert.equal(five.layers.length,5);assert.equal(five.strokes[0].tier,4);assert.equal(five.collage[0].photos[1],'data:image/png;base64,BB');assert.equal(five.collage[0].photos[2],'');assert.equal(five.collage[0].templateSrc,'');
});

test('demo decorations sit on the visible tier ledges',async()=>{const {makeDemo}=await import('../demo.mjs');const {surfaceHeight}=await import('../model.mjs');const s=makeDemo();for(const d of s.decor)assert.ok(Math.abs(surfaceHeight(s,d.x,d.z)-(d.y-.025))<.001,d.kind+' is inside another tier');});
