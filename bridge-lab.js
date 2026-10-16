(()=>{
const people=[
 {name:'Bodhi Schulz',initials:'BS',role:'spot contributor',color:'#9dbac7',credit:'Aquarium Where Every Fish Is Dead',href:'/blog/frozen-aquarium-in-miyagi'},
 {name:'Cameron Danesh',initials:'CD',role:'spot contributor',color:'#c6c89e',credit:"Moscow’s VIP Express Lanes",href:'/blog/moscow-s-vip-express-lanes'},
 {name:'Wayfarer',initials:'W',role:'spot contributor',color:'#acbfae',credit:'South London’s Most Notable Street Art Location',href:'/blog/south-london-s-most-notable-street-art-location'},
 {name:'Krista Watson',initials:'KW',role:'story contributor',color:'#b8b1c7',credit:"Fermented Shark: It’s What’s for Dinner in Greenland"},
 {name:'SAZ',initials:'S',role:'story contributor',color:'#c7ae9c',credit:'Witches Galore! Learn more about the witches that lived in Lancashire.'}
];
const labels=['the contributors','a contributor in focus','community leaderboard','community dispatch','add your discovery','follow your curiosity','leave it to chance','the field code','a question for you','made by the curious'];
labels.push(...(window.DeepSpotBridgeRoundTwo?.labels||[]),...(window.DeepSpotBridgeRoundThree?.labels||[]),...(window.DeepSpotBridgeRoundFour?.labels||[]),...(window.DeepSpotBridgeRoundFive?.labels||[]),...(window.DeepSpotBridgeRoundSix?.labels||[]),...(window.DeepSpotBridgeRoundSeven?.labels||[]));
const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const icon=(name,cls='')=>`<svg class="bl-icon ${cls}" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${{
 arrow:'<path d="M9 24h30M28 13l11 11-11 11"/>',
 pin:'<path d="M24 43S10 29 10 18a14 14 0 0 1 28 0c0 11-14 25-14 25Z"/><circle cx="24" cy="18" r="5"/>',
 eye:'<path d="M3 24s8-13 21-13 21 13 21 13-8 13-21 13S3 24 3 24Z"/><circle cx="24" cy="24" r="7"/>',
 star:'<path d="M24 3v42M3 24h42M9 9l30 30M9 39 30 9"/>',
 path:'<path d="M5 39h11V28h11V16h11V5M29 5h9v9"/>',
 spark:'<path d="m24 3 5 15 16 6-16 5-5 16-6-16-15-5 15-6Z"/>',
 fork:'<path d="M11 5v12a6 6 0 0 0 12 0V5M17 5v37M35 42V5c-7 5-7 17 0 19"/>',
 shuffle:'<path d="M5 12h5c11 0 12 24 23 24h10M35 28l8 8-8 8M5 36h5c11 0 12-24 23-24h10M35 4l8 8-8 8"/>',
 plus:'<path d="M24 8v32M8 24h32"/>',
 hand:'<path d="M15 25V10a3 3 0 0 1 6 0v12-16a3 3 0 0 1 6 0v16-12a3 3 0 0 1 6 0v14-7a3 3 0 0 1 6 0v14c0 9-5 14-13 14-7 0-9-4-12-8L8 27c-3-5 1-7 4-4l6 7"/>'
 }[name]||''}</svg>`;
const avatar=(p,cls='')=>`<span class="bl-avatar ${cls}" style="--avatar-paper:${p.color}" aria-hidden="true"><span>${p.initials}</span><svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="43"/><path d="M7 50h9m68 0h9M50 7v9m0 68v9"/></svg></span>`;
const profile=(p,i)=>`<button type="button" class="bl-person" data-profile="${i}" aria-label="View ${p.name}'s contributions">${avatar(p)}<strong>${p.name}</strong><span>${p.role.startsWith('story')?'stories':'spots'}</span></button>`;
class BridgeLab extends HTMLElement{
 connectedCallback(){
  if(this.ready)return;this.ready=true;this.current=0;
  try{const saved=Number(sessionStorage.getItem('deepspot-bridge-option'));if(Number.isInteger(saved)&&saved>=0&&saved<labels.length)this.current=saved}catch{}
  if(window.DeepSpotBridgeRoundTwo){try{if(sessionStorage.getItem('deepspot-bridge-round2')!=='seen'){this.current=10;sessionStorage.setItem('deepspot-bridge-round2','seen');sessionStorage.setItem('deepspot-bridge-option','10')}}catch{this.current=10}}
  if(window.DeepSpotBridgeRoundThree){try{if(sessionStorage.getItem('deepspot-bridge-round3')!=='seen'){this.current=20;sessionStorage.setItem('deepspot-bridge-round3','seen');sessionStorage.setItem('deepspot-bridge-option','20')}}catch{this.current=20}}
  if(window.DeepSpotBridgeRoundFour){try{if(sessionStorage.getItem('deepspot-bridge-round4')!=='seen'){this.current=40;sessionStorage.setItem('deepspot-bridge-round4','seen');sessionStorage.setItem('deepspot-bridge-option','40')}}catch{this.current=40}}
  if(window.DeepSpotBridgeRoundFive){try{if(sessionStorage.getItem('deepspot-bridge-round5')!=='seen'){this.current=45;sessionStorage.setItem('deepspot-bridge-round5','seen');sessionStorage.setItem('deepspot-bridge-option','45')}}catch{this.current=45}}
  if(window.DeepSpotBridgeRoundSix){try{if(sessionStorage.getItem('deepspot-bridge-round6')!=='seen'){this.current=65;sessionStorage.setItem('deepspot-bridge-round6','seen');sessionStorage.setItem('deepspot-bridge-option','65')}}catch{this.current=65}}
  if(window.DeepSpotBridgeRoundSeven){try{if(sessionStorage.getItem('deepspot-bridge-round7')!=='seen'){this.current=75;sessionStorage.setItem('deepspot-bridge-round7','seen');sessionStorage.setItem('deepspot-bridge-option','75')}}catch{this.current=75}}
  this.catalog=people.filter(p=>p.href).map(p=>({id:p.href,title:p.credit}));
  fetch('/featured-spots.json').then(r=>r.ok?r.json():[]).then(rows=>{if(rows.length){this.fullCatalog=rows.filter(s=>!s.title.startsWith('PART OF:'));this.catalog=this.fullCatalog.filter(s=>s.image)}}).catch(()=>{});
  this.innerHTML=`<section class="bl-lab" aria-label="Landing transition design preview"><div class="bl-stage"></div><nav class="bl-switcher" aria-label="Transition variations"><button type="button" data-step="-1" aria-label="Previous transition design">${icon('arrow')}</button><span class="bl-variant-label" aria-live="polite" aria-atomic="true"></span><button type="button" data-step="1" aria-label="Next transition design">${icon('arrow')}</button></nav></section><dialog class="bl-dialog"><button class="bl-dialog-close" type="button" aria-label="Close preview">×</button><div class="bl-dialog-body"></div></dialog>`;
  this.stage=this.querySelector('.bl-stage');this.dialog=this.querySelector('dialog');this.render();
  this.addEventListener('click',e=>{
   const step=e.target.closest('[data-step]'),person=e.target.closest('[data-profile]'),category=e.target.closest('[data-category]'),action=e.target.closest('[data-action]'),vote=e.target.closest('[data-vote]');
   if(step)this.change(Number(step.dataset.step));
   if(person)this.showProfile(Number(person.dataset.profile));
   if(category)this.goToCategory(Number(category.dataset.category));
   if(vote){this.stage.querySelectorAll('[data-vote]').forEach(b=>b.setAttribute('aria-pressed',String(b===vote)));this.stage.querySelector('.bl-vote-result').innerHTML=`your pick: <strong>${esc(vote.dataset.vote)}</strong> <button data-category="${vote.dataset.filter}">follow it ${icon('arrow')}</button>`}
   if(action?.dataset.action==='contribute')this.showContribution();
   if(action?.dataset.action==='random')this.randomPick();
   window.DeepSpotBridgeRoundTwo?.click(e,this,{people,avatar,icon,esc});
   window.DeepSpotBridgeRoundThree?.click(e,this,{people,avatar,icon,esc});
   window.DeepSpotBridgeRoundFour?.click(e,this,{people,avatar,icon,esc});
   window.DeepSpotBridgeRoundFive?.click(e,this,{people,avatar,icon,esc});
   if(e.target.closest('.bl-dialog-close')||e.target===this.dialog)this.dialog.close();
  });
  this.querySelector('.bl-switcher').addEventListener('keydown',e=>{if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();this.change(e.key==='ArrowRight'?1:-1)}});
  this.addEventListener('input',e=>window.DeepSpotBridgeRoundFive?.input(e,this));
  this.stage.addEventListener('pointermove',e=>window.DeepSpotBridgeRoundTwo?.pointer(e,this));
  this.stage.addEventListener('pointerleave',e=>window.DeepSpotBridgeRoundTwo?.pointer(e,this));
  this.addEventListener('submit',e=>{
   if(window.DeepSpotBridgeRoundTwo?.submit(e,this,{people,avatar,icon,esc}))return;
   if(window.DeepSpotBridgeRoundThree?.submit(e,this,{people,avatar,icon,esc}))return;
   if(!e.target.matches('.bl-draft-form'))return;e.preventDefault();
   const data=new FormData(e.target),draft={name:data.get('name'),detail:data.get('detail')};
   try{localStorage.setItem('deepspot-contribution-draft',JSON.stringify(draft));this.dialog.querySelector('.bl-dialog-body').innerHTML=`${icon('pin')}<h2>keep that thought.</h2><p>Your draft for <strong>${esc(draft.name)}</strong> is saved in this browser.</p><button class="bl-text-link" data-action="contribute">edit your draft ↗</button>`}catch{e.target.querySelector('[role=status]').textContent='This browser could not save the draft. Please keep a copy of your text.'}
  });
 }
 change(direction){this.current=(this.current+direction+labels.length)%labels.length;try{sessionStorage.setItem('deepspot-bridge-option',String(this.current))}catch{}this.render()}
 render(){
  const p=people[0];
  const views=[
   ()=>`<div class="bl-people-layout"><div class="bl-intro"><h2>the people <br>behind the <em>pins.</em></h2><p>A few of the curious minds <br>putting DeepSpot on the map.</p></div><div class="bl-people">${people.map(profile).join('')}</div></div>`,
   ()=>`<div class="bl-profile-feature">${avatar(p,'bl-portrait')}<div class="bl-profile-name"><p class="bl-overline">meet a contributor</p><h2>Bodhi <br><em>Schulz.</em></h2><button class="bl-text-link" data-profile="0">view contribution ↗</button></div><div class="bl-profile-story"><span class="bl-quote-mark" aria-hidden="true">↳</span><p>A different <br>way of <em>seeing.</em></p><span>Published “Aquarium Where Every Fish Is Dead”.</span></div></div>`,
   ()=>`<div class="bl-ranking"><div><h2>the curious <br><em>few.</em></h2><p class="bl-rank-disclaimer">leaderboard concept <br>preview order · totals not connected</p></div><ol class="bl-rank-list">${people.map((p,i)=>`<li><button data-profile="${i}"><span class="bl-rank-number">${String(i+1).padStart(2,'0')}</span>${avatar(p)}<strong>${p.name}</strong><span class="bl-rank-role">${p.role}</span><span aria-hidden="true">↗</span></button></li>`).join('')}</ol></div>`,
   ()=>`<div class="bl-dispatch"><h2>word gets <em>around.</em></h2><div class="bl-dispatch-grid">${[people[0],people[2],people[3]].map(p=>{const i=people.indexOf(p);return `<article><div class="bl-dispatch-by">${avatar(p)}<button class="bl-text-link" data-profile="${i}">${p.name} ↗</button></div><p>${i===3?'tells the story behind':'put this on the map'}</p><button class="bl-dispatch-title" data-profile="${i}">${esc(p.credit)}</button></article>`}).join('')}</div></div>`,
   ()=>`<div class="bl-contribute"><div class="bl-plus-block" aria-hidden="true">${icon('plus')}<span class="bl-plus-ring"></span></div><div><h2>your weird little find <br><em>belongs here.</em></h2><p>The unmarked door. The local legend. That place nobody talks about.</p></div><button class="bl-pill" data-action="contribute">add a spot ${icon('arrow')}</button></div>`,
   ()=>`<div class="bl-interests"><h2>follow your <br><em>curiosity.</em></h2><div class="bl-interest-grid">${[['weird / funny',2,'eye'],['hidden history',3,'path'],['art / sculpture',5,'star'],['roadside stops',4,'pin']].map(([name,index,shape])=>`<button data-category="${index}">${icon(shape)}<span>${name}</span><span class="bl-interest-arrow">↗</span></button>`).join('')}</div></div>`,
   ()=>`<div class="bl-chance"><div class="bl-chance-art" aria-hidden="true"><span>?</span>${icon('shuffle')}<i></i></div><div class="bl-chance-copy"><h2>leave it to <em>chance.</em></h2><p>You don’t always need a destination.</p><button class="bl-pill" data-action="random">surprise me ${icon('shuffle')}</button><div class="bl-random-result" aria-live="polite"></div></div></div>`,
   ()=>`<div class="bl-code">${[['eye','stay','curious.','Look twice. Take the side street.'],['hand','tread','lightly.','Respect the place and its people.'],['star','pass','it on.','Good discoveries deserve company.']].map(([shape,a,b,caption])=>`<div>${icon(shape)}<h2>${a} <br><em>${b}</em></h2><p>${caption}</p></div>`).join('')}</div>`,
   ()=>`<div class="bl-question"><div><h2>what would <br>make you <em>stop?</em></h2><div class="bl-vote-result" aria-live="polite">pick what catches your eye.</div></div><div class="bl-votes">${[['a strange doorway','path',3],['something delicious','fork',2],['something inexplicable','eye',2]].map(([name,shape,filter])=>`<button data-vote="${name}" data-filter="${filter}" aria-pressed="false">${icon(shape)}<span>${name}</span><i aria-hidden="true">↗</i></button>`).join('')}</div></div>`,
   ()=>`<div class="bl-manifesto"><div class="bl-word-wall" aria-hidden="true"><span>FOR THE CURIOUS.</span><span>BY THE CURIOUS.</span></div><div class="bl-manifesto-front"><div class="bl-avatar-stack">${people.slice(0,4).map(p=>avatar(p)).join('')}</div><h2>a map made <br>by <em>people like you.</em></h2><button class="bl-text-link" data-action="contribute">make your mark ↗</button></div></div>`
  ];
  if(window.DeepSpotBridgeRoundTwo)views.push(...window.DeepSpotBridgeRoundTwo.views(this,{people,avatar,icon,esc}));
  if(window.DeepSpotBridgeRoundThree)views.push(...window.DeepSpotBridgeRoundThree.views(this,{people,avatar,icon,esc}));
  if(window.DeepSpotBridgeRoundFour)views.push(...window.DeepSpotBridgeRoundFour.views(this,{people,avatar,icon,esc}));
  if(window.DeepSpotBridgeRoundFive)views.push(...window.DeepSpotBridgeRoundFive.views(this,{people,avatar,icon,esc}));
  if(window.DeepSpotBridgeRoundSix)views.push(...window.DeepSpotBridgeRoundSix.views(this,{people,avatar,icon,esc}));
  if(window.DeepSpotBridgeRoundSeven)views.push(...window.DeepSpotBridgeRoundSeven.views(this,{people,avatar,icon,esc}));
  this.stage.dataset.variant=this.current+1;this.stage.innerHTML=views[this.current]();
  this.querySelector('.bl-variant-label').innerHTML=`<b>${String(this.current+1).padStart(2,'0')} / ${labels.length}</b><span>${labels[this.current]}</span>`;
 }
 showProfile(index){
  const p=people[index];
  this.dialog.querySelector('.bl-dialog-body').innerHTML=`${avatar(p,'bl-dialog-avatar')}<p class="bl-overline">${p.role}</p><h2>${p.name}</h2><p>Published on DeepSpot</p><div class="bl-credit-card">${p.href?`<a href="https://www.deepspot.io${p.href}" target="_blank" rel="noopener">${esc(p.credit)} ↗</a>`:esc(p.credit)}</div><p class="bl-dialog-note">Showing the verified credit available in this preview. Profile photos and total contribution counts are not connected.</p>`;
  if(!this.dialog.open)this.dialog.showModal();
 }
 showContribution(){
  let draft={};try{draft=JSON.parse(localStorage.getItem('deepspot-contribution-draft')||'{}')}catch{}
  this.dialog.querySelector('.bl-dialog-body').innerHTML=`<h2>what did you find?</h2><p>Keep a contribution draft while you explore.</p><form class="bl-draft-form"><label>name of the place<input name="name" maxlength="160" required value="${esc(draft.name||'')}" autocomplete="off"></label><label>what makes it unusual?<textarea name="detail" rows="4" maxlength="2000">${esc(draft.detail||'')}</textarea></label><button class="bl-pill" type="submit">save draft ${icon('arrow')}</button><p class="bl-dialog-note" role="status">Drafts stay on this device. This preview does not publish to DeepSpot.</p></form>`;
  if(!this.dialog.open)this.dialog.showModal();
 }
 goToCategory(index){
  const tab=document.querySelector(`[data-fs-tab="${index}"]`);
  if(!tab)return;tab.click();
  document.querySelector('.fs-section').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'start'});
 }
 randomPick(){
  const picks=this.catalog.filter(s=>s.id!==this.lastPick);const pick=picks[Math.floor(Math.random()*picks.length)];if(!pick)return;this.lastPick=pick.id;
  this.stage.querySelector('.bl-random-result').innerHTML=`<a href="https://www.deepspot.io${esc(pick.id)}" target="_blank" rel="noopener">${esc(pick.title)} ↗</a>`;
 }
}
customElements.define('deepspot-interlude',BridgeLab);
})();
