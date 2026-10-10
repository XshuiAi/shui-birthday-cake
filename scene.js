import * as THREE from 'three';
import {FontLoader} from 'three/addons/loaders/FontLoader.js';
import {TextGeometry} from 'three/addons/geometries/TextGeometry.js';
import fontData from 'three/examples/fonts/helvetiker_bold.typeface.json';
const font=new FontLoader().parse(fontData);
import {SPONGES,FILLINGS,cakeHeight,cakeTiers} from './model.mjs';

const mats=new Map(), geoms=new Map();
const geometry=(key,make)=>{if(!geoms.has(key))geoms.set(key,make());return geoms.get(key);};
const sphere=geometry('sphere',()=>new THREE.SphereGeometry(1,24,16));
const cylinder=(r,h)=>geometry(`c${r},${h}`,()=>new THREE.LatheGeometry([new THREE.Vector2(0,-h/2),new THREE.Vector2(r-.04,-h/2),new THREE.Vector2(r,-h/2+.035),new THREE.Vector2(r,h/2-.035),new THREE.Vector2(r-.04,h/2),new THREE.Vector2(0,h/2)],72));
function noiseTexture(color,type='sponge'){
 const c=document.createElement('canvas');c.width=c.height=256;const x=c.getContext('2d');
 x.fillStyle=color;x.fillRect(0,0,256,256);let seed=17;const rand=()=>{seed=(seed*16807)%2147483647;return seed/2147483647;};
 for(let i=0;i<(type==='felt'?2400:1500);i++){const px=rand()*256,py=rand()*256; x.globalAlpha=type==='sponge'?.09:.03;x.fillStyle=rand()>.5?'#573e26':'#ffffff';
  if(type==='felt'){x.lineWidth=.5;x.strokeStyle=x.fillStyle;x.beginPath();x.moveTo(px,py);x.lineTo(px+rand()*7-3,py+rand()*5-2);x.stroke();}
  else{x.beginPath();x.ellipse(px,py,rand()*1.5+.1,rand()*1+.1,rand()*3,0,6.3);x.fill();}}
 x.globalAlpha=1;const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;t.wrapS=t.wrapT=THREE.RepeatWrapping;return t;
}
function material(color,type='smooth'){
 const key=color+type;if(mats.has(key))return mats.get(key);
 const textured=type!=='smooth';const t=textured?noiseTexture(color,type):null;
 const m=new THREE.MeshStandardMaterial({color:textured?'#ffffff':color,map:t,bumpMap:t,bumpScale:type==='sponge'?.06:type==='felt'?.018:.009,roughness:type==='fruit'?.38:.92,metalness:0});mats.set(key,m);return m;
}
function mesh(g,m,parent,pos=[0,0,0],scale){const o=new THREE.Mesh(g,m);o.position.set(...pos);if(scale)o.scale.set(...scale);o.castShadow=true;o.receiveShadow=true;parent.add(o);return o;}
function ball(parent,color,pos,scale,type='smooth'){return mesh(sphere,material(color,type),parent,pos,scale);}
function curvedTube(points,r){return new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points.map(p=>new THREE.Vector3(...p))),24,r,6,false);}
const glowCanvas=document.createElement('canvas');glowCanvas.width=glowCanvas.height=64;const glowCtx=glowCanvas.getContext('2d'),glowGradient=glowCtx.createRadialGradient(32,32,0,32,32,32);glowGradient.addColorStop(0,'rgba(255,217,130,.65)');glowGradient.addColorStop(.2,'rgba(255,164,54,.25)');glowGradient.addColorStop(1,'rgba(255,130,35,0)');glowCtx.fillStyle=glowGradient;glowCtx.fillRect(0,0,64,64);const glowTexture=new THREE.CanvasTexture(glowCanvas);
const starShape=new THREE.Shape();for(let i=0;i<10;i++){const a=i*Math.PI/5-Math.PI/2,r=i%2?.115:.25;const p=[Math.cos(a)*r,Math.sin(a)*r];i?starShape.lineTo(...p):starShape.moveTo(...p);}starShape.closePath();
const starG=geometry('star',()=>new THREE.ExtrudeGeometry(starShape,{depth:.075,bevelEnabled:true,bevelSegments:2,steps:1,bevelSize:.025,bevelThickness:.02}));
const strawberryG=geometry('strawberry',()=>{
 const g=new THREE.SphereGeometry(1,26,22),p=g.attributes.position;
 for(let i=0;i<p.count;i++){const y=p.getY(i),f=.7+.27*y;p.setXYZ(i,p.getX(i)*f*.3,y*.36+.37,p.getZ(i)*f*.24);}g.computeVertexNormals();return g;
});
const seedG=geometry('seed',()=>new THREE.SphereGeometry(.009,5,4));
const leafG=geometry('leaf',()=>new THREE.SphereGeometry(1,12,8));
const rosetteG=geometry('rosette',()=>{
 const points=[];for(let j=0;j<=12;j++){const y=j/12;points.push(new THREE.Vector2(Math.pow(1-y,.65)*(.72+.2*Math.sin(y*Math.PI)),y*1.25));}
 const g=new THREE.LatheGeometry(points,32),p=g.attributes.position;
 for(let i=0;i<p.count;i++){const a=Math.atan2(p.getZ(i),p.getX(i)),y=p.getY(i),f=1+.17*Math.cos(a*8+y*3);p.setX(i,p.getX(i)*f);p.setZ(i,p.getZ(i)*f);}g.computeVertexNormals();return g;
});
const cherryStem=geometry('cherryStem',()=>curvedTube([[0,0,0],[.05,.24,.02],[-.13,.48,0]],.012));
const bowG=geometry('bow',()=>curvedTube([[0,.13,0],[-.18,.29,0],[-.36,.22,0],[-.27,.09,0],[0,.13,0],[.28,.28,0],[.36,.15,0],[.19,.09,0],[0,.13,0]],.032));
const bowTailG=geometry('bowtail',()=>curvedTube([[0,.13,0],[-.1,-.02,0],[-.18,-.13,.01]],.026));


const nozzleGeometries=[rosetteG,...[1,2,3,4,5].map(type=>{
 const pts=[];const steps=type===1?6:12;for(let j=0;j<=steps;j++){const y=j/steps;let r=type===1?Math.sqrt(Math.max(0,1-y*y))*.78:Math.pow(1-y,type===3?.4:.75)*(.72+.18*Math.sin(y*Math.PI));pts.push(new THREE.Vector2(r,y*(type===1?.8:type===5?1.7:1.15)));}
 const g=new THREE.LatheGeometry(pts,type===1?12:28),p=g.attributes.position;for(let i=0;i<p.count;i++){const y=p.getY(i),a=Math.atan2(p.getZ(i),p.getX(i));const f=type===1?1:1+(type===3?.28:.20)*Math.cos(a*(type===3?5:8)+y*(type===3?7:2));p.setX(i,p.getX(i)*f*(type===2?1.5:type===4?.5:1));p.setZ(i,p.getZ(i)*f*(type===4?1.7:1));if(type===4)p.setY(i,y*.32);}g.computeVertexNormals();return g;
})];

export class CakeScene{
 constructor(container,callbacks={}){
  this.container=container;this.cb=callbacks;this.mode='rotate';this.size=.12;this.lit=false;this.auto=false;this.running=false;this.lastTime=0;
  this.scene=new THREE.Scene();this.camera=new THREE.OrthographicCamera(-4,4,3,-3,.1,40);this.camera.position.set(4.2,5.8,8.5);this.camera.lookAt(0,.85,0);
  this.renderer=new THREE.WebGLRenderer({alpha:true,antialias:true,preserveDrawingBuffer:true,powerPreference:'low-power'});
  this.renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));this.renderer.setClearColor(0,0);this.renderer.shadowMap.enabled=true;this.renderer.shadowMap.type=THREE.PCFSoftShadowMap;this.renderer.outputColorSpace=THREE.SRGBColorSpace;this.renderer.toneMapping=THREE.ACESFilmicToneMapping;this.renderer.toneMappingExposure=1.18;
  container.appendChild(this.renderer.domElement);this.renderer.domElement.setAttribute('aria-label','可旋转和装饰的生日蛋糕');
  this.ambient=new THREE.HemisphereLight('#fff9f4','#b1b5db',2.6);this.scene.add(this.ambient);
  const sun=this.sun=new THREE.DirectionalLight('#fff4f0',2.4);sun.position.set(-3,11,4);sun.castShadow=true;sun.shadow.mapSize.set(1024,1024);sun.shadow.camera.left=-4;sun.shadow.camera.right=4;sun.shadow.camera.top=4;sun.shadow.camera.bottom=-4;sun.shadow.normalBias=.035;sun.shadow.bias=-.0005;this.scene.add(sun);
  const fill=this.fill=new THREE.DirectionalLight('#f2e4ee',.7);fill.position.set(4,2,-3);this.scene.add(fill);
  const floor=new THREE.Mesh(new THREE.PlaneGeometry(40,40),new THREE.ShadowMaterial({opacity:.075}));floor.rotation.x=-Math.PI/2;floor.position.y=-.09;floor.receiveShadow=true;this.scene.add(floor);
  this.root=new THREE.Group();this.scene.add(this.root);this.cake=new THREE.Group();this.ornaments=new THREE.Group();this.root.add(this.cake,this.ornaments);
  mesh(cylinder(2,.085),material('#dce6f5'),this.scene,[0,-.005,0]);mesh(cylinder(1.94,.055),material('#fff9ed'),this.scene,[0,.061,0]);
  const rim=new THREE.Mesh(new THREE.TorusGeometry(1.91,.022,8,96),material('#b3c9e8'));rim.rotation.x=Math.PI/2;rim.position.y=.095;this.scene.add(rim);
  mesh(cylinder(.72,.15),material('#e2e8f5'),this.scene,[0,-.11,0]);
  this.warmLight=new THREE.PointLight('#ffb965',0,8,1.5);this.warmLight.position.set(0,2.5,0);this.scene.add(this.warmLight);this.baseY=.105;this.paint={};this.paintTiers=[];this.coat=new THREE.Group();this.root.add(this.coat);
  this.ensurePaint(0);
  this.pipeMeshes=nozzleGeometries.map(geo=>{const m=new THREE.InstancedMesh(geo,new THREE.MeshStandardMaterial({color:'#ffffff',roughness:.82}),1600);m.instanceMatrix.setUsage(THREE.DynamicDrawUsage);m.count=0;m.castShadow=true;m.receiveShadow=true;m.frustumCulled=false;this.root.add(m);return m;});
  this.sprinkleGroup=new THREE.Group();this.root.add(this.sprinkleGroup);this.squish=0;this.dummy=new THREE.Object3D();this.ray=new THREE.Raycaster();this.pointer=new THREE.Vector2();this.flames=[];
  this.resizeObserver=new ResizeObserver(()=>this.resize());this.resizeObserver.observe(container);this.bind();document.addEventListener('visibilitychange',()=>{if(!document.hidden)this.request();});
 }
 ensurePaint(tier){if(this.paintTiers[tier])return this.paintTiers[tier];const pair={};for(const surface of ['top','side']){const c=document.createElement('canvas');c.width=c.height=512;const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;const m=new THREE.MeshStandardMaterial({map:t,transparent:true,alphaTest:.02,depthWrite:false,bumpMap:noiseTexture('#ddd4bf','cream'),bumpScale:.008,roughness:.88,side:THREE.DoubleSide});pair[surface]={canvas:c,ctx:c.getContext('2d'),tex:t,mat:m};}this.paintTiers[tier]=pair;if(tier===0)this.paint=pair;return pair;}
 resize(){const {width,height}=this.container.getBoundingClientRect();if(width<1||height<1)return;this.renderer.setSize(width,height);const aspect=width/height,h=Math.max(4.9,(this.state?cakeHeight(this.state):1)+2.4);this.camera.left=-h*aspect/2;this.camera.right=h*aspect/2;this.camera.top=h/2;this.camera.bottom=-h/2;this.camera.updateProjectionMatrix();this.request();}
 request(){if(this.running)return;this.running=true;requestAnimationFrame(t=>this.frame(t));}
 frame(t){this.running=false;if(document.hidden)return;if(!this.down&&t-this.lastTime<32){this.request();return;}const dt=Math.min((t-this.lastTime)/1000,.05);this.lastTime=t;
  if(this.auto&&this.state){this.state.rotation+=dt*.24;this.root.rotation.y=this.state.rotation;}
  if(!this.down)this.squish*=.78;
  this.root.scale.set(1+this.squish*.4,1-this.squish,1+this.squish*.4);
  let burning=0;for(let i=0;i<this.flames.length;i++){const f=this.flames[i];const d=this.state.decor.find(d=>d.id===f.userData.candleId);f.visible=!!d?.lit;if(f.visible)burning++;f.scale.y=.1*(1+Math.sin(t*.008+i)*.12);f.position.x=Math.sin(t*.006+i)*.009;f.rotation.z=Math.sin(t*.007+i)*.08;}
  this.burning=burning;this.warmLight.intensity=burning?Math.min(9,1.6+burning*.8)*(this.dark?1:.06)*(1+.035*Math.sin(t*.009)):0;this.warmLight.position.y=this.topY+1.15;if(this.dark){const strength=Math.sqrt(burning);this.ambient.intensity=.07+Math.min(1.4,strength*.48)+Math.min((this.state.stars?.length||0)*.008,.22);this.fill.intensity=burning?Math.min(.65,.16+strength*.16):0;this.sun.intensity=burning?Math.min(.75,strength*.24):0;}
  this.renderer.render(this.scene,this.camera);this.cb.frame?.();if(this.auto||burning||this.squish>.0005)this.request();
 }
 setCameraTilt(tilt=0){const elevation=.32+Math.max(-.24,Math.min(.72,tilt)),target=this.state?.layout==='tiered'?cakeHeight(this.state)/2+.38:.85;this.camera.position.set(Math.sin(.46)*Math.cos(elevation)*10,target+Math.sin(elevation)*10,Math.cos(.46)*Math.cos(elevation)*10);this.camera.lookAt(0,target,0);this.request();}
 setDark(dark,stars=0){this.dark=dark;this.ambient.intensity=dark?.018+Math.min(stars*.003,.13):2.6;this.ambient.color.set(dark?'#ffe3bc':'#fff9f4');this.ambient.groundColor.set(dark?'#b78c6f':'#b1b5db');this.fill.color.set(dark?'#ffdcad':'#f2e4ee');this.sun.color.set(dark?'#ffdda8':'#fff4f0');this.sun.intensity=dark?0:2.4;this.fill.intensity=dark?0:.7;this.request();}
 bounds(id){const g=this.ornaments.children.find(o=>o.userData.decorId===id);if(!g)return null;this.root.updateMatrixWorld(true);const box=new THREE.Box3().setFromObject(g),r=this.container.getBoundingClientRect(),pts=[];for(const x of [box.min.x,box.max.x])for(const y of [box.min.y,box.max.y])for(const z of [box.min.z,box.max.z]){const p=new THREE.Vector3(x,y,z).project(this.camera);pts.push({x:(p.x+1)*r.width/2,y:(1-p.y)*r.height/2});}return {x:Math.min(...pts.map(p=>p.x)),y:Math.min(...pts.map(p=>p.y)),w:Math.max(...pts.map(p=>p.x))-Math.min(...pts.map(p=>p.x)),h:Math.max(...pts.map(p=>p.y))-Math.min(...pts.map(p=>p.y))};}
 project(id){const g=this.ornaments.children.find(o=>o.userData.decorId===id);if(!g)return null;const p=g.localToWorld(new THREE.Vector3(0,.65,0)).project(this.camera),r=this.container.getBoundingClientRect();return {x:(p.x+1)*r.width/2,y:(1-p.y)*r.height/2};}
 sync(s){this.state=s;this.root.rotation.set(0,s.rotation,0);this.setCameraTilt(s.tilt||0);this.cake.clear();this.ornaments.traverse(o=>{if(o.userData.ownMaterial){o.material.dispose();if(o.userData.ownGeometry)o.geometry.dispose();}if(o.isInstancedMesh)o.dispose();});this.ornaments.clear();this.coat.clear();this.flames=[];
  const tiers=cakeTiers(s);this.topY=this.baseY+cakeHeight(s)+.014;this.surfaceMeshes=[];
  if(s.layout==='tiered'){tiers.forEach((t,i)=>{const col=SPONGES.find(x=>x.id===t.id).color,fill=FILLINGS.find(x=>x.id===t.filling).color,b=this.baseY+t.bottom;mesh(cylinder(t.r,.30),material(col,'sponge'),this.cake,[0,b+.15,0]);mesh(cylinder(t.r+.004,.12),material(fill,'cream'),this.cake,[0,b+.36,0]);mesh(cylinder(t.r,.30),material(col,'sponge'),this.cake,[0,b+.57,0]);});}
  else{let y=this.baseY;s.layers.forEach((id,i)=>{mesh(cylinder(1.6,.47),material(SPONGES.find(x=>x.id===id).color,'sponge'),this.cake,[0,y+.235,0]);y+=.47;if(i<s.layers.length-1){mesh(cylinder(1.61,.13),material(FILLINGS.find(x=>x.id===s.fillings[i]).color,'cream'),this.cake,[0,y+.065,0]);y+=.13;}});}
  tiers.forEach((t,i)=>{const pair=this.ensurePaint(i),radius=t.r+.013,top=mesh(geometry('paint-top'+radius,()=>new THREE.CircleGeometry(radius,80)),pair.top.mat,this.coat,[0,this.baseY+t.bottom+t.height+.014,0]);top.rotation.x=-Math.PI/2;top.userData={surface:'top',tier:i};const side=mesh(geometry('coat'+radius+','+t.height,()=>new THREE.CylinderGeometry(radius,radius,t.height,80,1,true)),pair.side.mat,this.coat,[0,this.baseY+t.bottom+t.height/2,0]);side.userData={surface:'side',tier:i};this.surfaceMeshes.push(top,side);});
  this.repaint();this.updatePipes();this.updateSprinkles();for(const d of s.decor)this.addDecor(d);this.root.updateMatrixWorld(true);this.resize();this.request();
 }
 repaint(){const tiers=cakeTiers(this.state);tiers.forEach((t,i)=>{const pair=this.ensurePaint(i);for(const [surface,p]of Object.entries(pair)){p.ctx.clearRect(0,0,512,512);if(this.state.coat){p.ctx.fillStyle=t.color;p.ctx.fillRect(0,0,512,512);if(surface==='side'&&this.state.layout==='tiered'){p.ctx.globalAlpha=.3;p.ctx.fillStyle=FILLINGS.find(f=>f.id===t.filling).color;p.ctx.fillRect(0,215,512,65);p.ctx.globalAlpha=1;}}for(const stroke of this.state.strokes)if(stroke.surface===surface&&(stroke.tier||0)===i)this.drawStroke(stroke,p);p.tex.needsUpdate=true;}});}
 drawStroke(s,p=this.ensurePaint(s.tier||0)[s.surface]){const x=p.ctx;x.fillStyle=s.color;const radius=s.size*512;for(const [u,v]of s.points){for(const wrap of s.surface==='side'?[-512,0,512]:[0]){x.beginPath();x.arc(u*512+wrap,(1-v)*512,radius,0,Math.PI*2);x.fill();}}p.tex.needsUpdate=true;}
 updatePipes(){const col=new THREE.Color(),counts=[0,0,0,0,0,0];for(const p of this.state.pipes.slice(0,1600)){const type=Math.max(0,Math.min(5,Math.round(p.shape||0))),m=this.pipeMeshes[type],i=counts[type]++;this.dummy.position.set(p.x,p.y+this.baseY,p.z);this.dummy.quaternion.identity();if(p.normal==='side')this.dummy.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),new THREE.Vector3(p.x,0,p.z).normalize());this.dummy.scale.setScalar(p.size);this.dummy.updateMatrix();m.setMatrixAt(i,this.dummy.matrix);m.setColorAt(i,col.set(p.color));}this.pipeMeshes.forEach((m,i)=>{m.count=counts[i];m.instanceMatrix.needsUpdate=true;if(m.instanceColor)m.instanceColor.needsUpdate=true;});this.request();}
 addDecor(d){const g=new THREE.Group();g.userData.decorId=d.id;g.position.set(d.x,this.baseY+d.y,d.z);g.scale.setScalar(d.scale||1);g.rotation.y=d.angle||0;
  if(d.kind==='strawberry'){
   mesh(strawberryG,material('#c73544','fruit'),g);
   const seeds=new THREE.InstancedMesh(seedG,material('#f2d49c'),80);const ob=new THREE.Object3D();let n=0;
   for(let j=1;j<9;j++){const yy=-1+j/5,a0=j*.17;for(let k=0;k<9;k++){const a=k/9*Math.PI*2+a0,rr=Math.sqrt(1-yy*yy),f=.7+.27*yy;ob.position.set(Math.cos(a)*rr*f*.302,yy*.36+.37,Math.sin(a)*rr*f*.242);ob.scale.set(1,1.7,.8);ob.updateMatrix();seeds.setMatrixAt(n++,ob.matrix);}}seeds.count=n;g.add(seeds);
   for(let i=0;i<5;i++){const a=i/5*6.283;const leaf=mesh(leafG,material('#69824e','felt'),g,[Math.cos(a)*.08,.72,Math.sin(a)*.08],[.045,.018,.16]);leaf.rotation.y=-a+Math.PI/2;}
  }else if(d.kind==='cherry'){for(const sign of [-1,1]){ball(g,'#9f2a41',[sign*.15,.19,0],[.2,.2,.2],'fruit');const stem=mesh(cherryStem,material('#71874b'),g,[sign*.15,.34,0]);stem.rotation.y=sign>0?0:Math.PI;}ball(g,'#85955c',[.03,.72,.025],[.13,.024,.07],'felt');
  }else if(d.kind==='blueberry'){ball(g,'#535977',[0,.17,0],[.2,.18,.2],'fruit');const star=mesh(starG,material('#3f415b'),g,[0,.344,0],[.22,.22,.22]);star.rotation.x=-Math.PI/2;
  }else if(['banana','kiwi','dragonfruit','mango'].includes(d.kind)){
   if(d.kind==='mango')mesh(geometry('mango',()=>new THREE.BoxGeometry(.34,.25,.34)),material('#ffcf67'),g,[0,.15,0]);
   else if(d.kind==='dragonfruit'){const v=mesh(geometry('dragon',()=>new THREE.CylinderGeometry(.25,.25,.16,3)),material('#fff0e6'),g,[0,.10,0]);v.rotation.y=.3;for(let j=0;j<18;j++){const a=j*2.4,r=.16*Math.sqrt(j/18);ball(g,'#5c455d',[Math.sin(a)*r,.185,Math.cos(a)*r],[.01,.005,.017]);}}
   else{const kiwi=d.kind==='kiwi';mesh(cylinder(.24,.12),material(kiwi?'#aed46c':'#fff0b3'),g,[0,.07,0]);for(let j=0;j<18;j++){const a=j/18*6.283,r=kiwi?.14:.06;ball(g,kiwi?'#5f5039':'#cb9b68',[Math.sin(a)*r,.134,Math.cos(a)*r],[.008,.003,.016]);}ball(g,kiwi?'#e9eeaa':'#f1d898',[0,.133,0],[.065,.003,.065]);}
  }else if(d.kind==='letter'){
   const text=(d.text||'A').slice(0,2);const geo=geometry('glyph'+text,()=>{const t=new TextGeometry(text,{font,size:.42,depth:.085,curveSegments:5,bevelEnabled:true,bevelSize:.01,bevelThickness:.01,bevelSegments:2});t.computeBoundingBox();t.translate(-(t.boundingBox.max.x+t.boundingBox.min.x)/2,0,0);return t;});mesh(geo,material(d.color||'#f2adc5'),g,[0,.04,0]);
  }else if(d.kind==='bunny'){
   ball(g,'#f9f0df',[0,.26,0],[.23,.29,.2],'felt');ball(g,'#fff5e4',[0,.61,0],[.27,.255,.22],'felt');
   for(const sign of [-1,1]){const e=ball(g,'#fff4e4',[sign*.13,.96,0],[.095,.28,.075],'felt');e.rotation.z=-sign*.16;const inner=ball(g,'#e4adbb',[sign*.13,.985,.061],[.045,.2,.016],'felt');inner.rotation.z=-sign*.16;ball(g,'#4b352c',[sign*.095,.65,.205],[.025,.027,.018]);ball(g,'#f6ead8',[sign*.13,.06,.12],[.105,.075,.14],'felt');ball(g,'#efc1c4',[sign*.16,.56,.17],[.047,.019,.021],'felt');}
   ball(g,'#dba4a5',[0,.58,.224],[.024,.018,.014]);const b=new THREE.Group();mesh(bowG,material('#dea0b1','felt'),b);mesh(bowTailG,material('#dea0b1','felt'),b);b.scale.setScalar(.35);b.position.set(0,.39,.19);g.add(b);
  }else if(d.kind==='bow'){mesh(bowG,material('#e4a8b9','felt'),g,[0,.18,0]);mesh(bowTailG,material('#e4a8b9','felt'),g,[0,.18,0]);const t=mesh(bowTailG,material('#e4a8b9','felt'),g,[0,.18,0]);t.scale.x=-1;ball(g,'#eab3c1',[0,.31,0],[.058,.062,.046],'felt');
  }else if(d.kind==='star'){const star=mesh(starG,material('#efd485','felt'),g,[0,.26,0]);star.rotation.z=.12;
  }else if(d.kind==='candle'){mesh(cylinder(.047,.65),material(d.color||'#f2adc5'),g,[0,.325,0]);for(let j=0;j<7;j++){const r=mesh(geometry('candle-ring',()=>new THREE.TorusGeometry(.048,.007,5,14)),material('#fff4ed'),g,[0,.04+j*.09,0]);r.rotation.x=Math.PI/2;}mesh(cylinder(.008,.045),material('#483a30'),g,[0,.67,0]);const flame=ball(g,'#ffb756',[0,.79,0],[.04,.10,.04]);flame.material=material('#ffba54').clone();flame.material.emissive.set('#ff9d33');flame.material.emissiveIntensity=1.6;flame.userData.ownMaterial=true;flame.visible=!!d.lit;flame.userData.candleId=d.id;const glow=new THREE.Sprite(new THREE.SpriteMaterial({map:glowTexture,transparent:true,depthWrite:false,blending:THREE.AdditiveBlending}));glow.scale.set(8,3.2,1);glow.userData.ownMaterial=true;flame.add(glow);this.flames.push(flame);
  }else if(d.kind==='plaque'){
   const shape=new THREE.Shape();shape.moveTo(-.52,0);shape.lineTo(.52,0);shape.lineTo(.52,.5);shape.quadraticCurveTo(0,.65,-.52,.5);shape.closePath();
   const geom=geometry('plaque',()=>new THREE.ExtrudeGeometry(shape,{depth:.035,bevelEnabled:true,bevelSize:.018,bevelThickness:.014,bevelSegments:2,steps:1}));mesh(geom,material('#f3e7d0'),g);
   const tex=this.nameTexture();const sign=new THREE.Mesh(new THREE.PlaneGeometry(.9,.42),new THREE.MeshBasicMaterial({map:tex,transparent:true,depthWrite:false}));sign.position.set(0,.29,.07);sign.userData.ownMaterial=true;sign.userData.ownGeometry=true;g.add(sign);mesh(cylinder(.018,.45),material('#b49770'),g,[0,-.05,.025]);
  }
  this.ornaments.add(g);return g;
 }
 nameTexture(){if(!this.nameCanvas){this.nameCanvas=document.createElement('canvas');this.nameCanvas.width=512;this.nameCanvas.height=256;this.nameTex=new THREE.CanvasTexture(this.nameCanvas);this.nameTex.colorSpace=THREE.SRGBColorSpace;}const c=this.nameCanvas.getContext('2d');c.clearRect(0,0,512,256);c.fillStyle='#826c58';c.textAlign='center';c.font='italic 34px Georgia';c.fillText('Happy Birthday',256,89);c.font='40px serif';c.fillText(this.state.recipient.slice(0,10),256,159,470);this.nameTex.needsUpdate=true;return this.nameTex;}
 updateName(){this.nameTexture();this.request();}
 setSelected(id){this.selected=id;}
 setAngle(v){this.state.rotation=v;this.root.rotation.y=v;this.root.updateMatrixWorld(true);this.request();}
 setView(top){this.camera.position.set(top?0:4.2,top?10:5.8,top?.001:8.5);this.camera.lookAt(0,.85,0);this.request();}
 hit(event,decor=false){const r=this.renderer.domElement.getBoundingClientRect();this.pointer.set((event.clientX-r.left)/r.width*2-1,-(event.clientY-r.top)/r.height*2+1);this.root.updateMatrixWorld(true);this.ray.setFromCamera(this.pointer,this.camera);
  if(decor){const list=this.ray.intersectObjects(this.ornaments.children,true);if(!list.length)return null;let o=list[0].object;while(o&&!o.userData.decorId)o=o.parent;return o?.userData.decorId||null;}
  const hits=this.ray.intersectObjects(this.surfaceMeshes,false);if(!hits.length)return null;const hit=hits[0];const p=this.root.worldToLocal(hit.point.clone());return {x:p.x,y:p.y-this.baseY,z:p.z,surface:hit.object.userData.surface,tier:hit.object.userData.tier||0,radius:cakeTiers(this.state)[hit.object.userData.tier||0].r,uv:hit.uv};
 }
 applyPoint(e){if(!e)return;const hit=this.hit(e);if(hit)this.cb.point?.(hit);}
 bind(){const c=this.renderer.domElement;
  c.addEventListener('pointerdown',e=>{if(e.button!==0)return;this.down=true;this.moved=false;this.lastX=this.startX=e.clientX;this.lastY=this.startY=e.clientY;this.lastEvent=e;c.setPointerCapture(e.pointerId);
   const hit=this.hit(e);this.dragId=this.mode==='rotate'?this.hit(e,true):null;
   this.action=this.dragId?'decor':(this.mode!=='rotate'&&hit?this.mode:'rotate');
   if(this.dragId)this.cb.select?.(this.dragId);else if(this.action==='rotate')this.cb.select?.(null);
   this.cb.start?.(this.action);if(!['rotate','decor'].includes(this.action))this.applyPoint(e);
  });
  c.addEventListener('pointermove',e=>{this.lastEvent=e;if(!this.down)return;const dx=e.clientX-this.lastX,dy=e.clientY-this.lastY;this.moved ||=Math.hypot(e.clientX-this.startX,e.clientY-this.startY)>4;
   if(this.action==='decor'){if(this.moved){const p=this.hit(e);if(p)this.cb.moveDecor?.(this.dragId,p);}}
   else if(this.action==='rotate'){this.state.rotation+=dx*.008;this.state.tilt=Math.max(-.42,Math.min(.72,(this.state.tilt||0)+dy*.004));this.root.rotation.set(0,this.state.rotation,0);this.setCameraTilt(this.state.tilt);this.squish=Math.min(.035,(Math.abs(dx)+Math.abs(dy))*.001);this.request();}
   else this.applyPoint(e);this.lastX=e.clientX;this.lastY=e.clientY;
  });
  const end=e=>{if(!this.down)return;const clicked=this.dragId&&!this.moved;this.down=false;if(clicked)this.cb.clickDecor?.(this.dragId);this.dragId=null;this.cb.end?.();this.request();};c.addEventListener('pointerup',end);c.addEventListener('pointercancel',end);c.addEventListener('lostpointercapture',end);
 }
 updateSprinkles(){for(const o of this.sprinkleGroup.children)o.dispose?.();this.sprinkleGroup.clear();const list=this.state.sprinkles||[];if(!list.length)return;const mat=material('#ffffff'),geo=geometry('sprinkle',()=>new THREE.SphereGeometry(1,8,6)),inst=new THREE.InstancedMesh(geo,mat,list.length),ob=new THREE.Object3D(),col=new THREE.Color();
 list.forEach((p,i)=>{ob.position.set(p.x,p.y+this.baseY+.015,p.z);ob.rotation.set(0,p.angle||0,0);ob.scale.set(p.size*(p.kind===0?2:1),p.size*.45,p.size*(p.kind===3?.3:1));ob.updateMatrix();inst.setMatrixAt(i,ob.matrix);inst.setColorAt(i,col.set(p.color));});inst.castShadow=true;inst.frustumCulled=false;this.sprinkleGroup.add(inst);this.request();
 }
 dispose(){this.resizeObserver.disconnect();this.renderer.dispose();}
}
