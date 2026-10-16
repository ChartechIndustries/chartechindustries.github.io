(()=>{
const watch='https://www.wmf.org/world-monuments-watch/2025';
const places=[
 {id:'maine',name:'Maine’s historic lighthouses',location:'Maine, United States',status:'under pressure from coastal storms',caption:'Portland Head Light during a storm, Cape Elizabeth, Maine.',credit:'Bob Trapani Jr., as credited by World Monuments Fund',detail:'Maine’s 66 lighthouses joined the 2025 World Monuments Watch after destructive coastal storms. Preservation groups are working on storm resilience and adaptation.',source:'https://lighthousefoundation.org/2025/04/building-a-stronger-future-for-lighthouses/',sourceName:'American Lighthouse Foundation'},
 {id:'namibe',name:'Cinema Studio Namibe',location:'Moçâmedes, Angola',status:'unfinished, and at risk of decay',caption:'Cinema Studio Namibe, photographed in 2016.',credit:'Walter Fernandes / World Monuments Fund',detail:'Construction stopped roughly fifty years before its 2025 Watch listing. The unfinished cinema is deteriorating; community-led renewal could give it a future.',source:watch,sourceName:'World Monuments Fund'},
 {id:'serifos',name:'Serifos mining landscape',location:'Serifos, Greece',status:'industrial heritage at risk',caption:'Mining loading bridge at Mega Livadi, Serifos.',credit:'Orestis Karamanlis / World Monuments Fund',detail:'World Monuments Fund calls for protection and conservation to prevent the imminent loss of this record of Greece’s industrial past.',source:watch,sourceName:'World Monuments Fund'},
 {id:'belchite',name:'Old Belchite',location:'Zaragoza, Spain',status:'a fragile place of remembrance',caption:'Snow-covered ruins of Old Belchite.',credit:'Photo via World Monuments Fund; photographer not specified',detail:'The Spanish Civil War devastated Old Belchite. After decades of neglect, conservation is needed to preserve its ruins as a place of remembrance.',source:watch,sourceName:'World Monuments Fund'},
 {id:'noto',name:'Noto Peninsula heritage',location:'Ishikawa, Japan',status:'historic buildings damaged by earthquake',caption:'Damaged historic building in Kuroshima Preservation District, Wajima.',credit:'Photo via World Monuments Fund; photographer not specified',detail:'The January 2024 earthquake damaged historic buildings across Noto. Restoring this heritage can help communities recover culturally, socially and economically.',source:watch,sourceName:'World Monuments Fund'}
];
const labels=['keep the light on','an opening night, still unwritten','more than rust','a place to remember','a way back home'];
window.DeepSpotBridgeRoundFour={labels,
 views(app,{esc,icon}){
  const photo=(i,cls='')=>`<img class="r4-photo ${cls}" src="/at-risk/${places[i].id}.jpg" alt="${esc(places[i].caption)}" width="1400" height="940" decoding="async">`;
  const link=(i,text='why it matters')=>`<button class="r4-link" type="button" data-risk="${i}">${text}${icon('arrow')}</button>`;
  const place=i=>`<span class="r4-place">${esc(places[i].name)} <span>· ${esc(places[i].location)}</span></span>`;
  return [
   ()=>`<div class="r4-feature r4-beacon"><div class="r4-beacon-image">${photo(0)}<div class="r4-screenprint" aria-hidden="true"></div></div><div class="r4-beacon-copy">${place(0)}<h2>they guided us home.<br><em>now they need us.</em></h2><p>Stronger coastal storms are putting Maine’s lighthouses at risk.<br>Some lights are too important to let go out.</p>${link(0,'keep their story alive')}</div></div>`,
   ()=>`<div class="r4-feature r4-cinema"><div class="r4-cinema-copy">${place(1)}<h2>an opening night.<br><em>still unwritten.</em></h2><p>An unfinished cinema, slowly decaying.<br>A whole world of stories it could still hold.</p>${link(1,'meet the unfinished dream')}</div><div class="r4-film"><div class="r4-film-perfs" aria-hidden="true"></div>${photo(1)}<span class="r4-film-caption">a future worth imagining.</span><div class="r4-film-perfs" aria-hidden="true"></div></div></div>`,
   ()=>`<div class="r4-feature r4-still"><div class="r4-still-title"><h2>still<br><em>here.</em></h2><span>let’s keep it that way.</span></div><div class="r4-still-image">${photo(2)}<div class="r4-screenprint" aria-hidden="true"></div></div><div class="r4-still-copy">${place(2)}<h3>more than rust.<br>the trace of a life’s work.</h3><p>This mining landscape needs protection before more of its history is lost.</p>${link(2,'see what’s at stake')}</div></div>`,
   ()=>`<div class="r4-feature r4-silence"><div class="r4-silence-image r4-silence-left">${photo(3)}</div><div class="r4-silence-copy">${place(3)}<h2>a town fell silent.<br><em>its story shouldn’t.</em></h2><p>These fragile ruins hold the memory of a town.<br>Remembering also means caring for what remains.</p>${link(3,'a place to remember')}</div><div class="r4-silence-image r4-silence-right">${photo(3)}</div></div>`,
   ()=>`<div class="r4-feature r4-home"><div class="r4-home-image">${photo(4)}</div><div class="r4-home-copy">${place(4)}<h2>home is more than<br><em>what’s left standing.</em></h2><p>After the earthquake, restoring heritage is also about restoring belonging.</p>${link(4,'a future, together')}</div><span class="r4-home-word" aria-hidden="true">home.</span></div>`
  ];
 },
 click(e,app,{esc}){
  const trigger=e.target.closest('[data-risk]');if(!trigger)return;
  const p=places[Number(trigger.dataset.risk)];if(!p)return;
  app.dialog.querySelector('.bl-dialog-body').innerHTML=`<div class="r4-source"><img class="r4-source-image" src="/at-risk/${p.id}.jpg" alt="${esc(p.caption)}"><span class="r4-source-status">${esc(p.status)}</span><h2>${esc(p.name)}</h2><p>${esc(p.detail)}</p><a class="r4-source-link" href="${p.source}" target="_blank" rel="noopener noreferrer">read the conservation story ↗</a><p class="bl-dialog-note">Source: ${esc(p.sourceName)}, 2025 Watch coverage. Reviewed September 14, 2026. At risk; no confirmed closing date.</p><p class="r4-photo-credit">${esc(p.caption)}<br>${esc(p.credit)}</p></div>`;
  if(!app.dialog.open)app.dialog.showModal();
 }
};
})();
