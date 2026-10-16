import {accountKey,readAccount,normalizeAccount,artMaxPng} from '../site/account-state.mjs?v=pad1';
import {escapeHTML as esc} from './identity.mjs';
// PictoChat-style signature pad. Strokes live on a 512x256 canvas shown at the column width.
export const padSize={w:512,h:256};
const colors=[['black','#111111'],['white','#ffffff'],['gray','#8a8f98'],['red','#e5302d'],['orange','#f28a1a'],['yellow','#f7d21b'],['green','#3fb44a'],['teal','#19b3b0'],['blue','#2a5bd7'],['indigo','#4b3fa8'],['pink','#f07db5'],['brown','#7b4a26']];
const bits={
 free:['.......###','......####','.....####.','....####..','...####...','..####....','.####.....','####......','###.......','#.........'],
 pixel:['##.##.##','##.##.##','........','##.##.##','##.##.##','........','##.##.##','##.##.##'],
 small:['........','........','........','...##...','...##...','........','........','........'],
 big:['........','..####..','.######.','.######.','.######.','.######.','..####..','........'],
 erase:['.########.','.#.#....#.','.#.#....#.','.#.#....#.','.#.#....#.','.########.'],
 undo:['..#.....','.##.....','#######.','.##...##','..#....#','.......#','......##','.#####..'],
 clear:['#......#','##....##','.##..##.','..####..','..####..','.##..##.','##....##','#......#'],
 save:['#######.','#.###.##','#.###..#','#......#','#.####.#','#.####.#','#.####.#','########']
};
const icon=name=>{const rows=bits[name];let d='';rows.forEach((row,y)=>{for(const m of row.matchAll(/#+/g))d+=`M${m.index} ${y}h${m[0].length}v1h-${m[0].length}z`;});return `<svg viewBox="0 0 ${rows[0].length} ${rows.length}" shape-rendering="crispEdges" aria-hidden="true"><path d="${d}"/></svg>`;};
const tool=(id,label,pressed)=>`<button type="button" class="sp-btn" data-tool="${id}" aria-label="${label}" title="${label}"${pressed===undefined?'':` aria-pressed="${pressed}"`}>${icon(id)}</button>`;
export function padHTML(profile){
 const edit=!!profile.localPreview,name=esc(profile.name);
 const paper=`<div class="sp-paper"><span class="sp-tab">${name}</span>${edit?`<canvas width="${padSize.w}" height="${padSize.h}" role="img" aria-label="Drawing canvas for your passport signature. Draw with a mouse, finger or pen."></canvas>`:`<img src="${esc(profile.signatureArt)}" alt="${name}’s passport drawing" width="${padSize.w}" height="${padSize.h}">`}</div>`;
 return `<section class="pp-pad" id="pp-pad" tabindex="-1" data-mode="${edit?'edit':'view'}" aria-label="${edit?'Signature pad':name+'’s passport drawing'}"><div class="sp-device"><div class="sp-top"><span>${edit?'signature pad':'signed in pixels'}</span><i aria-hidden="true"></i></div><div class="sp-body">${edit?`<div class="sp-tools" role="toolbar" aria-label="Drawing tools">${tool('free','Smooth brush',true)}${tool('pixel','Pixel brush',false)}${tool('small','Small size',true)}${tool('big','Big size',false)}${tool('erase','Eraser',false)}${tool('undo','Undo')}${tool('clear','Clear drawing')}${tool('save','Save drawing to passport')}</div>`:''}<div class="sp-main">${paper}${edit?`<div class="sp-palette" role="group" aria-label="Colors">${colors.map(([n,c],i)=>`<button type="button" class="sp-swatch" style="--c:${c}" data-color="${c}" aria-label="${n}" title="${n}" aria-pressed="${i===0}"></button>`).join('')}</div><p class="sp-status" role="status" aria-live="polite">Draw, then press the disk to save.</p>`:''}</div></div></div></section>`;
}
export function initPad(root,{art,onSave}={}){
 const cv=root.querySelector('canvas');if(!cv)return;
 const ctx=cv.getContext('2d',{willReadFrequently:true}),{w:W,h:H}=padSize,$=s=>root.querySelector(s),$$=s=>[...root.querySelectorAll(s)];
 const st={mode:'free',big:false,erase:false,color:colors[0][1]},undo=[];let drag=null,dirty=false,clearTimer;
 const status=text=>$('.sp-status').textContent=text;
 const press=(sel,on)=>$$(sel).forEach(b=>b.setAttribute('aria-pressed',String(on(b))));
 const sync=()=>{$('[data-tool=undo]').disabled=!undo.length;};
 const arm=on=>{const b=$('[data-tool=clear]');clearTimeout(clearTimer);b.dataset.confirm=on?'true':'';b.setAttribute('aria-label',on?'Confirm clear drawing':'Clear drawing');if(on){status('Press the X again to clear everything.');clearTimer=setTimeout(()=>{arm(false);status('Clear cancelled.');},3500);}};
 const push=()=>{undo.push(ctx.getImageData(0,0,W,H));if(undo.length>20)undo.shift();sync();};
 const pos=e=>{const r=cv.getBoundingClientRect();return {x:(e.clientX-r.left)*W/r.width,y:(e.clientY-r.top)*H/r.height,p:e.pointerType==='pen'&&e.pressure>0?.35+e.pressure*.9:1};};
 const width=p=>(st.erase?(st.big?24:10):(st.big?11:4))*p;
 const cells=(cx,cy)=>{const n=st.erase?(st.big?4:2):(st.big?2:1),o=n>1?n/2:0;if(st.erase)ctx.clearRect((cx-o)*4,(cy-o)*4,n*4,n*4);else ctx.fillRect((cx-o)*4,(cy-o)*4,n*4,n*4);};
 const cellAt=p=>[Math.floor(p.x/4),Math.floor(p.y/4)];
 function line(a,b){let [x0,y0]=a;const [x1,y1]=b,dx=Math.abs(x1-x0),dy=-Math.abs(y1-y0),sx=x0<x1?1:-1,sy=y0<y1?1:-1;let err=dx+dy;for(;;){cells(x0,y0);if(x0===x1&&y0===y1)break;const e2=2*err;if(e2>=dy){err+=dy;x0+=sx;}if(e2<=dx){err+=dx;y0+=sy;}}}
 const style=()=>{ctx.globalCompositeOperation=st.erase&&st.mode==='free'?'destination-out':'source-over';ctx.strokeStyle=ctx.fillStyle=st.erase?'#000':st.color;ctx.lineCap=ctx.lineJoin='round';};
 function down(e){
  if(e.button>0||drag)return;e.preventDefault();cv.setPointerCapture(e.pointerId);arm(false);push();style();
  const p=pos(e);drag={id:e.pointerId,last:p,mid:p,cell:cellAt(p)};
  if(st.mode==='pixel')cells(...drag.cell);else{ctx.lineWidth=width(p.p);ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(p.x+.01,p.y);ctx.stroke();}
  dirty=true;
 }
 function move(e){
  if(!drag||e.pointerId!==drag.id)return;
  const list=e.getCoalescedEvents?.();
  for(const ev of (list&&list.length?list:[e])){
   const p=pos(ev);
   if(st.mode==='pixel'){const c=cellAt(p);if(c[0]!==drag.cell[0]||c[1]!==drag.cell[1]){line(drag.cell,c);drag.cell=c;}}
   else{const mid={x:(drag.last.x+p.x)/2,y:(drag.last.y+p.y)/2};ctx.lineWidth=width(p.p);ctx.beginPath();ctx.moveTo(drag.mid.x,drag.mid.y);ctx.quadraticCurveTo(drag.last.x,drag.last.y,mid.x,mid.y);ctx.stroke();drag.mid=mid;}
   drag.last=p;
  }
 }
 function up(e){
  if(!drag||e.pointerId!==drag.id)return;
  if(st.mode==='free'){ctx.lineWidth=width(drag.last.p);ctx.beginPath();ctx.moveTo(drag.mid.x,drag.mid.y);ctx.lineTo(drag.last.x,drag.last.y);ctx.stroke();}
  ctx.globalCompositeOperation='source-over';drag=null;status('Unsaved. Press the disk to save.');
 }
 cv.addEventListener('pointerdown',down);cv.addEventListener('pointermove',move);cv.addEventListener('pointerup',up);cv.addEventListener('pointercancel',up);cv.addEventListener('contextmenu',e=>e.preventDefault());
 const blank=()=>{const d=ctx.getImageData(0,0,W,H).data;for(let i=3;i<d.length;i+=4)if(d[i])return false;return true;};
 function encode(){let url=cv.toDataURL('image/png');if(url.length<artMaxPng)return url;const t=document.createElement('canvas');t.width=W/2;t.height=H/2;t.getContext('2d').drawImage(cv,0,0,W/2,H/2);url=t.toDataURL('image/png');return url.length<artMaxPng?url:'';}
 function save(){
  const empty=blank(),url=empty?'':encode();
  if(!empty&&!url){status('Too detailed to save. Clear a little and try again.');return;}
  try{const draft=readAccount();localStorage.setItem(accountKey,JSON.stringify(normalizeAccount({...draft,signatureArt:url})));}catch{status('Could not save. Browser storage is full or blocked.');return;}
  dirty=false;onSave?.(url);status(empty?'Drawing removed from your passport.':'Saved to your passport.');
 }
 root.addEventListener('click',e=>{
  const b=e.target.closest('[data-tool],[data-color]');if(!b)return;const t=b.dataset.tool;
  if(b.dataset.color){st.color=b.dataset.color;st.erase=false;press('[data-color]',x=>x===b);press('[data-tool=erase]',()=>false);return;}
  if(t!=='clear')arm(false);
  if(t==='free'||t==='pixel'){st.mode=t;press('[data-tool=free],[data-tool=pixel]',x=>x===b);}
  else if(t==='small'||t==='big'){st.big=t==='big';press('[data-tool=small],[data-tool=big]',x=>x===b);}
  else if(t==='erase'){st.erase=!st.erase;b.setAttribute('aria-pressed',String(st.erase));}
  else if(t==='undo'){const s=undo.pop();if(s){ctx.putImageData(s,0,0);dirty=true;status('Undone.');}sync();}
  else if(t==='clear'){if(b.dataset.confirm==='true'){arm(false);push();ctx.clearRect(0,0,W,H);dirty=true;status('Cleared. Press the disk to save.');}else if(blank())status('The pad is already empty.');else arm(true);}
  else if(t==='save')save();
 });
 root.addEventListener('keydown',e=>{if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='z'&&!e.shiftKey){e.preventDefault();$('[data-tool=undo]').click();}});
 window.addEventListener('beforeunload',e=>{if(dirty){e.preventDefault();e.returnValue='';}});
 if(art){const img=new Image();img.onload=()=>ctx.drawImage(img,0,0,W,H);img.src=art;}
 sync();
}
