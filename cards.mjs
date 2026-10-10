export const FRAME_NAMES=['拍立得','粉色圆角','蓝色椭圆','紫色爱心','奶黄相框','绿色胶带','撕纸纪念卡','复古爱心卡','三连照片卡','自定义相框'];
export function photoCard(s,url,esc,readonly=false){
 const slot=(i=0)=>{const src=i===0?s.src:s.photos?.[i];return `<button class="photo-slot ${src?'filled':''}" data-photo-slot="${i}" aria-label="${src?'更换':'上传'}第 ${i+1} 张照片" ${readonly?'disabled':''}>${src?`<img src="${esc(src)}" alt="你的生日照片" draggable="false">`:'<span>♡<small>点击放入照片</small></span>'}</button>`;};
 const frame=s.frame||0;
 if(frame===6)return `<div class="scrap-card torn-card"><div class="card-tape"></div><div class="torn-photo">${slot()}</div><span class="card-caption">${esc(s.text||'our little moments')}</span><span class="ink-doodle">✧ ♡ ✧</span></div>`;
 if(frame===7)return `<div class="scrap-card heart-card"><div class="heart-photo">${slot()}</div><div class="card-bunting">♡ · ♡ · ♡</div><div class="card-caption">${esc(s.text||'You are the most special')}</div><span class="card-foot">made of love</span></div>`;
 if(frame===8)return `<div class="scrap-card triple-card"><div class="card-tape"></div>${[0,1,2].map(i=>`<div class="triple-photo">${slot(i)}</div>`).join('')}<span class="card-caption">${esc(s.text||'three moments, one wish')}</span><span class="ink-doodle">happy birthday ♡</span></div>`;
 if(frame===9)return `<div class="custom-card"><div class="custom-photo">${slot()}</div>${s.templateSrc?`<img class="custom-frame" src="${esc(s.templateSrc)}" alt="你上传的相框">`:'<span class="card-caption">your own frame ♡</span>'}</div>`;
 return `<div class="photo-inset frame-${frame}">${slot()}</div>${frame===4?'<div class="plain-yellow-frame"></div>':`<img class="photo-frame" src="${url('paper-2-'+frame)}" alt="" draggable="false">`}`;
}
