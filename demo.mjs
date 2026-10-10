import {initialState,cakeTiers,CREAMS,normalize} from './model.mjs';
export function makeDemo(){
 const s=initialState();Object.assign(s,{layout:'tiered',layers:['vanilla','strawberry','matcha'],fillings:['strawberry','lemon','blueberry'],tierColors:['#f3dce3','#fff1db','#dbe2c3'],coat:true,coatColor:'#fff1db',creamColor:CREAMS[1],rotation:-.18,background:'paper',banner:'ribbon',recipient:'亲爱的你',sender:'一直为你加油的人',title:'把这一年的美好，都送给你。',message:'生日快乐，亲爱的你：\n\n把草莓的甜、奶油的柔软和今晚的星光，都装进这只蛋糕里送给你。\n\n愿新的一岁，有喜欢的事可以忙，有想见的人可以见；有勇气试一试，也有安心慢下来的时候。\n\n希望你吹灭蜡烛时许下的心愿，在往后的日子里，一点一点变成真的。\n\n今天，所有的甜都属于你。♡'});
 const tiers=cakeTiers(s),rose='#dfa1b3',ivory='#fff1d9',sage='#aebf9a';
 const ring=(r,y,n,size,color,shape=0)=>{for(let j=0;j<n;j++){const a=j/n*Math.PI*2;s.pipes.push({x:Math.sin(a)*r,z:Math.cos(a)*r,y,size,color,normal:'top',shape});}};
 tiers.forEach((t,i)=>{
  ring(t.r-.075,t.bottom+t.height+.02,Math.round(t.r*40),.10,[rose,ivory,sage][i]);
  ring(t.r-.01,t.bottom+.025,Math.round(t.r*44),.083,[ivory,rose,ivory][i],2);
  const arcs=i===0?14:i===1?12:10;
  for(let j=0;j<arcs;j++)for(let k=0;k<=14;k++){const a=(j+k/14)/arcs*Math.PI*2;s.pipes.push({x:Math.sin(a)*(t.r+.022),z:Math.cos(a)*(t.r+.022),y:t.bottom+.50-Math.sin(k/14*Math.PI)*.19,size:k===0||k===14?.055:.030,color:ivory,normal:'side',shape:1});}
  ring(t.r+.018,t.bottom+.18,Math.round(t.r*55),.023,'#e6c78f',1);
 });
 let n=0;const add=(kind,x,z,y,scale=1,color=rose,text='')=>s.decor.push({id:'demo'+n++,kind,x,z,y:y+.025,scale,color,text,angle:.28,lit:kind==='candle'});
 const top=2.16;
 [[-.48,-.30],[.46,-.28],[-.48,.30]].forEach(([x,z])=>add('strawberry',x,z,top,.53));
 [[.57,.18],[.33,.48],[-.12,-.59],[-.57,-.06]].forEach(([x,z])=>add('blueberry',x,z,top,.6));
 add('bunny',0,.05,top,.55);add('bow',.42,1.00,1.44,.65);
 for(let j=0;j<5;j++){const a=j/5*6.28;add('candle',Math.sin(a)*.36,Math.cos(a)*.36-.12,top,j%2?.73:.95,[rose,'#d3dcba','#f3dba1','#c6dce7','#c8b6d4'][j]);}
 add('banana',-1.18,.82,.72,.68);add('kiwi',1.14,.85,.72,.68);add('mango',1.38,-.34,.72,.65);add('dragonfruit',-1.30,-.50,.72,.68);
 add('cherry',1.09,.15,1.44,.6);add('strawberry',-1.05,.22,1.44,.58);add('blueberry',-.42,.9,1.44,.55);
 ['H','B','D'].forEach((l,i)=>add('letter',-.43+i*.43,1.43,.72,.72,rose,l));
 let seed=71;const random=()=>{seed=seed*16807%2147483647;return seed/2147483647;};
 tiers.forEach((t,i)=>{for(let k=0;k<70;k++){const a=random()*6.28,inner=i===2?0:tiers[i+1].r+.10,r=inner+(t.r-.15-inner)*random();s.sprinkles.push({x:Math.sin(a)*r,z:Math.cos(a)*r,y:t.bottom+t.height+.025,size:.025+random()*.014,color:['#dfa1b3','#bbccac','#eed19b','#d0c0dc'][k%4],kind:k%3===0?0:5,angle:random()*6.28,normal:'top'});}});
 s.collage=[
  {id:'card1',kind:'photo',frame:6,x:18,y:48,size:220,angle:-8,text:'our little moments',src:''},
  {id:'card2',kind:'photo',frame:7,x:82,y:45,size:230,angle:7,text:'You are the most special',src:''},
  {id:'envelope',kind:'envelope',asset:'paper-0-0',x:81,y:73,size:143,angle:-7,text:''},
  {id:'bow1',kind:'asset',asset:'pretty-0-0',x:18,y:26,size:102,angle:-9,text:''},
  {id:'bow2',kind:'asset',asset:'pretty-0-1',x:85,y:22,size:74,angle:6,text:''},
  {id:'note1',kind:'note',asset:'paper-1-1',x:17,y:76,size:144,angle:6,text:'愿你的每一天\n都有一点甜 ♡'},
  {id:'caption',kind:'text',x:50,y:88,size:330,angle:0,text:'a little cake, a lot of love'},
  {id:'flower',kind:'asset',asset:'pretty-2-1',x:92,y:64,size:49,angle:8,text:''}
 ];
 s.stars=[{x:33,y:29,size:15},{x:68,y:31,size:21},{x:29,y:64,size:13},{x:72,y:67,size:14},{x:41,y:23,size:12},{x:62,y:21,size:12}];
 return normalize(s);
}
