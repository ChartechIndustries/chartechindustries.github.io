(()=>{
const labels=['three reasons to go deeper','one mission, two invitations','four ways into deep spot','the shared atlas','windows into the extraordinary','a mission with room for you','the quiet manifesto','a community-built world','notes from the curious','the curiosity chain'];
window.DeepSpotBridgeRoundSix={labels,views(app,{icon}){
 const actions={browse:'data-category="0"',odd:'data-category="2"',history:'data-category="3"',add:'data-action="contribute"',stories:'data-r5="stories"',write:'data-r2="draft" data-kind="story"',care:'data-r5="care"',people:'data-profile="0"',premium:'data-r3="premium"'};
 const cta=(text,action)=>`<button type="button" class="r6-cta" ${actions[action]}><span>${text}</span>${icon('arrow')}</button>`;
 const art=(kind)=>{
  const paths={
   orbit:'<circle cx="120" cy="72" r="52"/><ellipse cx="120" cy="72" rx="26" ry="52"/><path d="M68 72h104M76 44q44 23 88 0M76 100q44-23 88 0"/><circle class="r6-art-point" cx="157" cy="38" r="5"/>',
   eye:'<path d="M33 73Q120-14 207 73Q120 158 33 73Z"/><circle cx="120" cy="73" r="30"/><circle class="r6-art-point" cx="120" cy="73" r="10"/><path d="M120 11v-9M76 22l-5-9M164 22l5-9"/>',
   people:'<circle cx="87" cy="49" r="17"/><circle cx="153" cy="49" r="17"/><path d="M44 121V99c0-35 86-35 86 0v22M110 121V99c0-35 86-35 86 0v22"/><path d="M87 92h66" stroke-dasharray="2 5"/><circle class="r6-art-point" cx="120" cy="92" r="5"/>',
   trail:'<path d="M15 120H47Q66 120 66 100V93Q66 72 90 72H128Q150 72 150 50V42Q150 24 175 24H221"/><circle cx="37" cy="120" r="5"/><circle cx="104" cy="72" r="5"/><circle class="r6-art-point" cx="184" cy="24" r="6"/>',
   story:'<path d="M48 30h56q16 0 16 16v78q0-15-16-15H48ZM192 30h-56q-16 0-16 16v78q0-15 16-15h56Z"/><path d="M63 52h36M63 66h36M63 80h23M141 52h36M141 66h36M141 80h23"/>',
   spark:'<path d="M120 7v128M56 71h128M75 26l90 90M75 116l90-90"/><circle cx="120" cy="71" r="31" stroke-dasharray="1 5"/>'
  };
  return `<div class="r6-illustration" aria-hidden="true"><svg viewBox="0 0 240 145" fill="none" stroke="currentColor" stroke-width="1.3">${paths[kind]||paths.spark}</svg></div>`;
 };
 const panel=({title,copy,link,action,cls='',graphic='',pre=''})=>`<article class="r6-box ${cls}">${graphic?art(graphic):''}${pre?`<span class="r6-word" aria-hidden="true">${pre}</span>`:''}<div class="r6-copy"><h2>${title}</h2><p>${copy}</p></div>${cta(link,action)}</article>`;
 const layout=(cls,items)=>()=>`<div class="r6 ${cls}">${items.map(panel).join('')}</div>`;
 return [
  layout('r6-triptych',[
   {title:'the world is still <em>wonderfully weird.</em>',copy:'DeepSpot is a home for places that make you look twice. Follow your curiosity beyond the familiar.',link:'find your next detour',action:'browse',cls:'r6-sage r6-dot-corner'},
   {title:'there’s more <em>behind the pin.</em>',copy:'Meet the people, history and unexpected stories that give a place its meaning.',link:'go deeper into the stories',action:'stories',cls:'r6-blue-line'},
   {title:'your discovery <em>belongs here.</em>',copy:'That strange little place you can’t stop talking about? Help someone else find it.',link:'add a deep spot',action:'add',cls:'r6-open-corner'}
  ]),
  layout('r6-feature-stack',[
   {title:'a bigger world. <em>a closer look.</em>',copy:'We’re here to make room for the overlooked. The quiet corners, curious people and places that stay with you.',link:'start exploring',action:'browse',cls:'r6-mission r6-dot-corner',graphic:'orbit'},
   {title:'look beyond <em>the location.</em>',copy:'Find the human story hiding behind an unusual place.',link:'read our stories',action:'stories'},
   {title:'put your curiosity <em>on the map.</em>',copy:'A world this interesting needs more than one point of view.',link:'share a spot',action:'add',cls:'r6-wash'}
  ]),
  layout('r6-four-columns',[
   {title:'look <em>closer.</em>',copy:'Discover the places that don’t always make the guidebook.',link:'explore deep spots',action:'browse',graphic:'eye'},
   {title:'go <em>deeper.</em>',copy:'Get to know the lives and histories behind the places.',link:'read a story',action:'stories',graphic:'story'},
   {title:'pass <em>it on.</em>',copy:'Turn your own unexpected find into someone else’s next stop.',link:'share your find',action:'add',graphic:'people'},
   {title:'leave <em>it well.</em>',copy:'Stay curious. Respect the place and the people who call it home.',link:'explore with care',action:'care',graphic:'trail'}
  ]),
  layout('r6-atlas-grid',[
   {title:'a world worth <em>looking at twice.</em>',copy:'We collect the unusual, overlooked and hard to explain.',link:'discover somewhere different',action:'browse',cls:'r6-atlas-lead',graphic:'eye'},
   {title:'people make <em>the map.</em>',copy:'DeepSpot grows through discoveries shared by curious people.',link:'meet a contributor',action:'people',graphic:'people'},
   {title:'every place has <em>another layer.</em>',copy:'Follow a story into the history, culture and lives behind it.',link:'read the stories',action:'stories',graphic:'story'},
   {title:'there’s space for <em>your perspective.</em>',copy:'Know a place we should know about? Start with what caught your eye.',link:'add your discovery',action:'add',cls:'r6-wash',graphic:'spark'}
  ]),
  layout('r6-windows',[
   {title:'less obvious. <em>more interesting.</em>',copy:'A different way to find your next stop, built around curiosity.',link:'take a look around',action:'browse',graphic:'orbit'},
   {title:'more than <em>a set of coordinates.</em>',copy:'The stories that make a place matter are part of the journey.',link:'get to know the story',action:'stories',graphic:'story'},
   {title:'a world seen <em>through many eyes.</em>',copy:'Your local knowledge could be someone else’s big discovery.',link:'share what you know',action:'add',graphic:'people'}
  ]),
  layout('r6-mission-band',[
   {title:'keep the world <em>interesting.</em>',copy:'DeepSpot brings unusual places and the people behind them into view. There’s always another way to see the world.',link:'follow your curiosity',action:'browse',cls:'r6-band-lead'},
   {title:'take the <em>side street.</em>',copy:'Find a place that gives you a reason to stop.',link:'find a deep spot',action:'browse'},
   {title:'ask a <em>better question.</em>',copy:'Who built it? Why is it here? What happened next?',link:'dig into the stories',action:'stories'},
   {title:'leave a <em>good lead.</em>',copy:'Make your unexpected discovery part of the map.',link:'add your find',action:'add',cls:'r6-wash'}
  ]),
  layout('r6-manifesto-strips',[
   {title:'curiosity is <em>the point.</em>',copy:'We help you find the places that make the world feel a little less familiar.',link:'see what’s out there',action:'browse'},
   {title:'context makes <em>it count.</em>',copy:'A place becomes more interesting when you know the people and stories behind it.',link:'read beyond the pin',action:'stories'},
   {title:'discovery is <em>better shared.</em>',copy:'The map gets richer when you bring your own point of view.',link:'make a contribution',action:'add'}
  ]),
  layout('r6-patchwork',[
   {title:'for the curious. <em>by the curious.</em>',copy:'DeepSpot is built around a simple idea: the world is more interesting when we help each other see it.',link:'explore the shared map',action:'browse',cls:'r6-patch-lead r6-dot-corner',graphic:'spark'},
   {title:'your local <em>is our unusual.</em>',copy:'What’s ordinary to you might surprise someone else.',link:'add a spot',action:'add'},
   {title:'there’s a story <em>in that.</em>',copy:'Follow the people and histories behind the places.',link:'read something unexpected',action:'stories',cls:'r6-wash'},
   {title:'a little curiosity. <em>a lot of care.</em>',copy:'The best discoveries leave the place as interesting as they found it.',link:'our way of exploring',action:'care',cls:'r6-patch-foot'}
  ]),
  layout('r6-field-notes',[
   {title:'places <em>worth a detour.</em>',copy:'For the corners of the world that don’t fit neatly into a travel guide.',link:'find your own way',action:'browse',pre:'places.'},
   {title:'people <em>worth listening to.</em>',copy:'For the voices and stories that give a place its character.',link:'spend time with a story',action:'stories',pre:'people.'},
   {title:'ideas <em>worth passing on.</em>',copy:'For the little discoveries that feel too good to keep to yourself.',link:'share your perspective',action:'write',pre:'perspective.'}
  ]),
  layout('r6-chain',[
   {title:'notice <em>something.</em>',copy:'We’re here for the strange detail that catches your eye.',link:'find the unexpected',action:'odd',pre:'↗'},
   {title:'wonder <em>about it.</em>',copy:'Look into the past. There’s usually more beneath the surface.',link:'follow its history',action:'history',pre:'?'},
   {title:'get to <em>know it.</em>',copy:'A place opens up through its people and their stories.',link:'read a little deeper',action:'stories',pre:'↳'},
   {title:'pass <em>it along.</em>',copy:'Your curiosity can be the start of someone else’s journey.',link:'add to the map',action:'add',pre:'+'}
  ])
 ];
}};
})();
