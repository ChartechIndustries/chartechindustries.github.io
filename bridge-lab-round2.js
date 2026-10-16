(()=>{
const challenges=[
 ['take the street you always pass.','Give the familiar route one unfamiliar turn. Notice what changes.'],
 ['look above eye level.','Find a sign, a window, or a detail you have never noticed.'],
 ['ask what used to be here.','A building’s previous life can be stranger than its present one.'],
 ['read the plaque you usually skip.','There might be a very good story hiding in plain sight.'],
 ['find one thing you cannot explain.','Then see how much of its story you can uncover.']
];
const labels=['what makes a deep spot','the knowledge network','your private collection','a note from deep spot','the small detour challenge','how a pin begins','the curiosity search','look again','three ways to contribute','beneath the surface'];
const open=(app,html)=>{app.dialog.querySelector('.bl-dialog-body').innerHTML=html;if(!app.dialog.open)app.dialog.showModal()};
const clean=value=>String(value||'').normalize('NFKD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
function savedIds(){try{const ids=JSON.parse(localStorage.getItem('deepspot-saved-spots')||'[]');return Array.isArray(ids)?[...new Set(ids.filter(x=>typeof x==='string'&&x.startsWith('/blog/')))]:[]}catch{return []}}
function results(app,query,{esc}){
 const terms=clean(query).trim().split(/\s+/).filter(Boolean);if(!terms.length)return;
 const matches=(app.fullCatalog||app.catalog).filter(s=>terms.every(term=>clean([s.title,s.place,s.description,s.tags].join(' ')).includes(term)));
 open(app,`<p class="bl-overline">follow your curiosity</p><h2>${esc(query)}</h2><p>${matches.length?`${matches.length} matching ${matches.length===1?'discovery':'discoveries'}.`:'No matches in this collection yet. Try a different word.'}</p><div class="r2-result-list">${matches.slice(0,6).map(s=>`<a href="https://www.deepspot.io${esc(s.id)}" target="_blank" rel="noopener"><strong>${esc(s.title)}</strong>${s.place?`<span>${esc(s.place)}</span>`:''}<i aria-hidden="true">↗</i></a>`).join('')}</div>`);
}
function showKind(app,kind,{esc,icon}){
 const types={place:['add a place.','name of the place','what makes it worth finding?'],story:['tell a story.','a title or a working idea','what is the story?'],correction:['make it better.','which spot or story?','what needs updating?']};
 const type=types[kind];if(!type)return;
 let draft={};try{draft=JSON.parse(localStorage.getItem('deepspot-community-draft-'+kind)||'{}')}catch{}
 open(app,`<h2>${type[0]}</h2><form class="r2-note-form" data-kind="${kind}"><label>${type[1]}<input name="title" required maxlength="160" value="${esc(draft.title||'')}" autocomplete="off"></label><label>${type[2]}<textarea name="detail" rows="4" required maxlength="3000">${esc(draft.detail||'')}</textarea></label><button class="bl-pill" type="submit">save your draft ${icon('arrow')}</button><p class="bl-dialog-note" role="status">Drafts stay on this device. This preview does not publish to DeepSpot.</p></form>`);
}
const roundTwo={labels,
 views(app,{people,avatar,icon,esc}){
  const count=savedIds().length;
  return [
   ()=>`<div class="r2-definition"><div class="r2-definition-word"><span aria-hidden="true">deep</span><h2 aria-label="deep spot">spot<span>.</span></h2>${icon('spark')}</div><div class="r2-definition-copy"><p>A place you’d never think to look for.<br>A story you’ll want to tell.</p><div class="r2-definition-terms"><span>overlooked</span><span>unexpected</span><span>worth the detour</span></div></div></div>`,
   ()=>`<div class="r2-network"><div><h2>one person notices.<br><em>everyone discovers.</em></h2><p>Local knowledge travels further <br>when someone shares it.</p></div><div class="r2-network-art"><svg class="r2-network-lines" viewBox="0 0 600 240" preserveAspectRatio="none" aria-hidden="true"><path d="M78 38 300 109 511 33M80 176 300 109 502 185M300 109 297 201"/><circle cx="300" cy="109" r="40"/><circle cx="300" cy="109" r="54"/></svg><span class="r2-network-center" aria-hidden="true">${icon('star')}</span>${people.map((p,i)=>`<button class="r2-network-person r2-node-${i}" data-profile="${i}" aria-label="View ${p.name}'s contributions">${avatar(p)}<span>${p.name}</span></button>`).join('')}</div></div>`,
   ()=>`<div class="r2-collection"><div><h2>keep a little<br><em>strange for later.</em></h2><p>Your next detour deserves more than a forgotten screenshot.</p><button class="bl-text-link" data-r2="saved">open your collection ↗</button></div><div class="r2-ticket-stack" aria-hidden="true"><i></i><i></i><div class="r2-saved-ticket"><svg viewBox="0 0 30 40"><path d="M5 3h20v33L15 29 5 36Z"/></svg><strong>${String(count).padStart(2,'0')}</strong><span>saved discoveries</span><b>DEEP SPOT</b></div></div></div>`,
   ()=>`<div class="r2-letter"><div class="r2-letter-title"><h2>Take the<br><em>wrong turn.</em></h2><span class="r2-letter-sign">deep spot ${icon('star')}</span></div><div class="r2-letter-body"><p>We’re collecting the places that make you look twice.</p><p>The overlooked, the peculiar, the wonderfully hard to explain. Found by people who kept going.</p><span>There’s a whole world between the landmarks.</span></div></div>`,
   ()=>`<div class="r2-challenge"><div class="r2-challenge-label"><span>your next walk</span><h2>a small<br><em>detour.</em></h2>${icon('path')}</div><div class="r2-challenge-copy"><h3 class="r2-challenge-prompt">${challenges[app.r2Challenge||0][0]}</h3><p class="r2-challenge-description">${challenges[app.r2Challenge||0][1]}</p><button class="bl-text-link" data-r2="challenge">give me another ${icon('shuffle')}</button></div></div>`,
   ()=>`<div class="r2-process"><div><h2>every pin starts<br>with <em>a person.</em></h2><button class="bl-text-link" data-action="contribute">start with what you know ↗</button></div><div class="r2-process-route"><div>${icon('eye')}<strong>notice it.</strong></div><span class="r2-process-line" aria-hidden="true"></span><div>${icon('path')}<strong>find the story.</strong></div><span class="r2-process-line" aria-hidden="true"></span><div>${icon('pin')}<strong>put it on the map.</strong></div></div></div>`,
   ()=>`<div class="r2-search"><form class="r2-search-form"><label for="r2-search-input">there’s a rabbit hole for that.</label><div class="r2-search-line"><svg viewBox="0 0 56 56" aria-hidden="true"><circle cx="23" cy="23" r="17"/><path d="m36 36 14 14"/><circle cx="23" cy="23" r="10" stroke-dasharray="1 4"/></svg><input id="r2-search-input" name="query" placeholder="what are you curious about?" required maxlength="120" autocomplete="off"><button type="submit" aria-label="Search DeepSpot collection">${icon('arrow')}</button></div></form><div class="r2-search-suggestions"><span>follow a thread</span>${['underground','folklore','hidden','temple'].map(q=>`<button data-r2="search" data-query="${q}">${q} ↗</button>`).join('')}</div></div>`,
   ()=>`<div class="r2-look"><div class="r2-eye" aria-hidden="true"><svg viewBox="0 0 400 200"><defs><pattern id="r2-eye-dots" x="0" y="0" width="6" height="6" patternUnits="userSpaceOnUse"><circle cx="3" cy="3" r="1.4" fill="currentColor"/></pattern><clipPath id="r2-eye-lid"><path d="M14 100Q200-67 386 100Q200 267 14 100Z"/></clipPath></defs><path d="M14 100Q200-67 386 100Q200 267 14 100Z" fill="url(#r2-eye-dots)" opacity=".6"/><path d="M14 100Q200-67 386 100Q200 267 14 100Z" fill="none" stroke="currentColor" stroke-width="1.4"/><g clip-path="url(#r2-eye-lid)"><g class="r2-eye-pupil"><circle cx="200" cy="100" r="73" fill="var(--r2-surface)" stroke="currentColor" stroke-width="1.2"/><circle cx="200" cy="100" r="61" fill="url(#r2-eye-dots)"/><circle cx="200" cy="100" r="42" fill="var(--r2-surface)" stroke="currentColor"/><circle cx="200" cy="100" r="25" fill="var(--bl-green)"/><circle cx="210" cy="89" r="7" fill="var(--r2-surface)"/></g></g></svg></div><div><h2>look <em>again.</em></h2><p>There’s usually more to a place <br>than meets the eye.</p><button class="bl-text-link" data-category="0">start looking ↘</button></div></div>`,
   ()=>`<div class="r2-contribution-doors"><h2>there’s more than one way<br>to <em>make a mark.</em></h2><div class="r2-doors">${[['place','add','a place.','pin'],['story','tell','a story.','path'],['correction','share','a correction.','plus']].map(([kind,a,b,glyph])=>`<button data-r2="draft" data-kind="${kind}">${icon(glyph)}<span>${a} <strong>${b}</strong></span><i aria-hidden="true">↗</i></button>`).join('')}</div></div>`,
   ()=>`<div class="r2-threshold"><div class="r2-depth-lines" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i></div><button class="r2-deeper" data-category="0" aria-label="Go deeper: explore DeepSpot discoveries"><span class="r2-deeper-note">there’s more beneath the surface.</span><strong>deeper<span>.</span></strong><span class="r2-deeper-arrow">${icon('arrow')}</span></button></div>`
  ];
 },
 click(e,app,helpers){
  const button=e.target.closest('[data-r2]');if(!button)return;
  const {esc,icon}=helpers;
  if(button.dataset.r2==='challenge'){
   app.r2Challenge=((app.r2Challenge||0)+1)%challenges.length;
   app.stage.querySelector('.r2-challenge-prompt').textContent=challenges[app.r2Challenge][0];app.stage.querySelector('.r2-challenge-description').textContent=challenges[app.r2Challenge][1];
  }
  if(button.dataset.r2==='search')results(app,button.dataset.query,helpers);
  if(button.dataset.r2==='draft')showKind(app,button.dataset.kind,helpers);
  if(button.dataset.r2==='saved'){
   const ids=savedIds(),spots=(app.fullCatalog||app.catalog).filter(s=>ids.includes(s.id));
   open(app,`${icon('pin')}<h2>your collection.</h2>${spots.length?`<p>${spots.length} ${spots.length===1?'discovery':'discoveries'} to come back to.</p><div class="r2-result-list">${spots.map(s=>`<a href="https://www.deepspot.io${esc(s.id)}" target="_blank" rel="noopener"><strong>${esc(s.title)}</strong><i aria-hidden="true">↗</i></a>`).join('')}</div>`:'<p>A good detour is worth keeping. Tap the bookmark on any spot below to start your collection.</p><button class="bl-pill" data-r2="browse-saved">find your first discovery ↗</button>'}`);
  }
  if(button.dataset.r2==='browse-saved'){app.dialog.close();app.goToCategory(0)}
 },
 submit(e,app,helpers){
  if(e.target.matches('.r2-search-form')){e.preventDefault();results(app,new FormData(e.target).get('query'),helpers);return true}
  if(e.target.matches('.r2-note-form')){
   e.preventDefault();const kind=e.target.dataset.kind;if(!['place','story','correction'].includes(kind))return true;
   const data=new FormData(e.target),draft={title:data.get('title'),detail:data.get('detail')};
   try{localStorage.setItem('deepspot-community-draft-'+kind,JSON.stringify(draft));open(app,`<h2>hold that thought.</h2><p>Your draft is saved in this browser.</p><div class="bl-credit-card">${helpers.esc(draft.title)}</div><button class="bl-text-link" data-r2="draft" data-kind="${kind}">keep writing ↗</button>`)}catch{e.target.querySelector('[role=status]').textContent='This browser could not save the draft. Please keep a copy of your text.'}return true;
  }
  return false;
 },
 pointer(e,app){
  const eye=app.stage.querySelector('.r2-eye');if(!eye||matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  if(e.type==='pointerleave'){eye.style.setProperty('--eye-x','0px');eye.style.setProperty('--eye-y','0px');return}
  const box=app.stage.getBoundingClientRect();eye.style.setProperty('--eye-x',`${Math.max(-14,Math.min(14,(e.clientX-box.left-box.width/2)*.035))}px`);eye.style.setProperty('--eye-y',`${Math.max(-9,Math.min(9,(e.clientY-box.top-box.height/2)*.045))}px`);
 }
};
window.DeepSpotBridgeRoundTwo=roundTwo;
})();
