// Synthesized locally: no remote audio, recordings or microphone permission needed.
export class CakeAudio{
 constructor(){this.enabled=true;this.playing=false;this.nodes=[];this.timer=null;}
 async unlock(){this.ctx||=new(window.AudioContext||window.webkitAudioContext)();if(this.ctx.state==='suspended')await this.ctx.resume();return this.ctx;}
 async texture(kind='spread'){
  if(!this.enabled)return;this.stopTexture();const request=this.textureRequest;try{await this.unlock();if(request!==this.textureRequest)return;const c=this.ctx,buffer=c.createBuffer(1,c.sampleRate*2,c.sampleRate),data=buffer.getChannelData(0);let last=0;for(let i=0;i<data.length;i++){last=(last+.025*(Math.random()*2-1))/1.025;data[i]=last*5;}
  const n=c.createBufferSource();n.buffer=buffer;n.loop=true;const filter=c.createBiquadFilter();filter.type='lowpass';filter.frequency.value=kind==='sprinkle'?2600:kind==='pipe'?650:1150;const gain=c.createGain();gain.gain.setValueAtTime(0,c.currentTime);gain.gain.linearRampToValueAtTime(kind==='sprinkle'?.065:.15,c.currentTime+.05);n.connect(filter).connect(gain).connect(c.destination);n.start();this.textureNode={n,gain};}catch{}
 }
 stopTexture(){this.textureRequest=(this.textureRequest||0)+1;if(!this.textureNode)return;const {n,gain}=this.textureNode;const t=this.ctx.currentTime;gain.gain.cancelScheduledValues(t);gain.gain.setTargetAtTime(0,t,.02);n.stop(t+.1);this.textureNode=null;}
 async tap(){if(!this.enabled)return;try{await this.unlock();const c=this.ctx,o=c.createOscillator(),g=c.createGain();o.frequency.setValueAtTime(500,c.currentTime);o.frequency.exponentialRampToValueAtTime(230,c.currentTime+.08);g.gain.setValueAtTime(.035,c.currentTime);g.gain.exponentialRampToValueAtTime(.001,c.currentTime+.1);o.connect(g).connect(c.destination);o.start();o.stop(c.currentTime+.12);}catch{}}
 stop(){if(this.player)this.player.pause();this.playing=false;this.onchange?.();}
 async song(){try{if(!this.player){this.player=new Audio();this.player.id='birthday-audio';this.player.hidden=true;this.player.preload='metadata';this.player.volume=.65;this.player.loop=true;document.body.append(this.player);this.player.onplay=()=>{this.playing=true;this.onchange?.();};this.player.onpause=()=>{this.playing=false;this.onchange?.();};this.player.onerror=()=>{this.playing=false;this.onerror?.();this.onchange?.();};}if(this.player.getAttribute('src')!==this.songURL)this.player.src=this.songURL;await this.player.play();this.playing=true;this.onchange?.();}catch{this.playing=false;this.onerror?.();this.onchange?.();}}
}
