import {awards,stampArt,signatureMark,moleCrop} from './passport-art.mjs?v=pad1';
import {createPassportImage} from './passport-export.mjs?v=pad1';
import {padHTML,initPad} from './sign-pad.mjs?v=pad1';
import {escapeHTML as esc,safeReturn} from './identity.mjs';
import {loadProfile} from './data.mjs?v=pad1';
const $=selector=>document.querySelector(selector);
let profile,contributions=[],toastTimer,exportPromise,exportImage;
const params=new URLSearchParams(location.search);
const returnPath=safeReturn(params.get('from'))||(params.get('user')==='preview'?'/account/':'/community/');
const returnURL=new URL(returnPath,location.origin);
const returnLabel=returnURL.pathname==='/account/'?'back to account':returnURL.pathname==='/story/'?'back to story':returnURL.pathname==='/spot/'?'back to spot':returnURL.pathname==='/stories/'?'back to stories':returnURL.pathname==='/leaderboard/'?'back to leaderboard':returnURL.pathname==='/browse/'?'back to browse':returnURL.hash==='#stories'?'back to stories':returnURL.hash==='#fs-heading'?'back to deep spots':returnURL.hash==='#wn-heading'?'back to what’s new':'community';
$('.pp-back').textContent='← '+returnLabel;
function notify(text){clearTimeout(toastTimer);$('.br-toast').textContent=text;$('.br-toast').dataset.open='true';toastTimer=setTimeout(()=>$('.br-toast').dataset.open='false',3000);}
function applyTheme(value){
 document.documentElement.dataset.theme=value;try{localStorage.setItem('deepspot-theme',value);}catch{}
 const light=value==='light';$('.br-theme').textContent=light?'☾ dark':'☼ light';$('.br-theme').setAttribute('aria-label',`Switch to ${light?'dark':'light'} mode`);
 const url=new URL(location.href);url.searchParams.set('theme',value);history.replaceState(null,'',url);
 document.querySelectorAll('a[href]').forEach(a=>{const dest=new URL(a.href);if(dest.origin===location.origin&&['/','/browse/'].includes(dest.pathname)){dest.searchParams.set('theme',value);a.href=dest.pathname+dest.search+dest.hash;}});
 returnURL.searchParams.set('theme',value);$('.pp-back').href=returnURL.pathname+returnURL.search+returnURL.hash;
}
applyTheme(document.documentElement.dataset.theme);
$('.br-theme').addEventListener('click',()=>applyTheme(document.documentElement.dataset.theme==='dark'?'light':'dark'));
$('.br-menu').addEventListener('click',()=>{const open=$('#mobile-nav').hidden;$('#mobile-nav').hidden=!open;$('.br-menu').setAttribute('aria-expanded',String(open));$('.br-menu').setAttribute('aria-label',open?'Close navigation':'Open navigation');$('.br-menu').textContent=open?'×':'☰';if(open)$('#mobile-nav a').focus();});
document.addEventListener('keydown',event=>{if(event.key==='Escape'&&!$('#mobile-nav').hidden){$('.br-menu').click();$('.br-menu').focus();}});
function profileURL(){const url=new URL('/profile/',location.origin);url.searchParams.set('user',profile.id);return url.href;}
function render(){
 document.title=`${profile.name} — DeepSpot Passport`;
 const initials=profile.name.split(/\s+/).slice(0,2).map(word=>word[0]).join('');
 const known=profile.sample?'':' pp-known-profile';
 $('#passport').innerHTML=`<article class="pp-book${known}" aria-label="${esc(profile.name)}’s explorer passport">
 <section class="pp-identity" aria-labelledby="pp-name"><div class="pp-page-label"><span>explorer passport</span>${signatureMark}</div>
 <div class="pp-portrait-field">${profile.image?profile.imageKind==='mole'?`<div class="pp-portrait pp-portrait-mole" style="--mx:${moleCrop.x};--my:${moleCrop.y};--mw:${moleCrop.w}"><img src="${esc(profile.image)}" alt="${esc(profile.name)}’s mole profile picture" width="512" height="512"></div>`:`<img class="pp-portrait" src="${esc(profile.image)}" alt="${esc(profile.name)}’s profile picture" width="177" height="190">`:`<div class="pp-portrait pp-initial-portrait" role="img" aria-label="${esc(profile.name)}’s initials">${esc(initials)}</div>`}<span class="pp-photo-caption" aria-hidden="true">DEEP SPOT</span></div>
 <div class="pp-name-row"><h1 id="pp-name">${esc(profile.name)}</h1><p class="pp-handle">${profile.handle?'@'+esc(profile.handle):'DeepSpot contributor'}</p></div>
 ${profile.bio?`<p class="pp-bio">${esc(profile.bio)}</p>`:''}${profile.localPreview||profile.signatureArt?padHTML(profile):''}${profile.socials?`<div class="pp-social-links">${profile.socials.instagram?`<a href="https://www.instagram.com/${encodeURIComponent(profile.socials.instagram.replace(/^@/,''))}/" target="_blank" rel="noopener" data-original>instagram ↗</a>`:''}${profile.socials.twitter?`<a href="https://x.com/${encodeURIComponent(profile.socials.twitter.replace(/^@/,''))}" target="_blank" rel="noopener" data-original>x ↗</a>`:''}${profile.socials.website?`<a href="${esc(profile.socials.website)}" target="_blank" rel="noopener" data-original>website ↗</a>`:''}</div>`:''}
 ${profile.basedIn||profile.joined?`<dl class="pp-details">${profile.basedIn?`<div><dt>based in</dt><dd>${esc(profile.basedIn)}</dd></div>`:''}${profile.joined?`<div><dt>member since</dt><dd>${esc(profile.joined)}</dd></div>`:''}</dl>`:''}
 ${profile.signature?`<div class="pp-signature-wrap"><p class="pp-signature-label">signature</p><div class="pp-signature-line"><span class="pp-signature">${esc(profile.signature)}</span></div></div>`:'<p class="pp-profile-pending">Bio and profile details haven’t been added to this preview.</p>'}
 <span class="pp-readable-code" aria-hidden="true">DEEP&lt;SPOT&lt;&lt;${esc(profile.name.toUpperCase().replaceAll(' ','<'))}&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;</span></section>
 <section class="pp-records" aria-label="Achievements and contributions">
 ${profile.awards.length?`<div class="pp-section-title"><h2>trophies</h2></div><div class="pp-stamps">${profile.awards.map(index=>`<button class="pp-stamp" type="button" data-award="${index}" aria-label="View ${esc(awards[index].name)} achievement">${stampArt(index)}<span>${esc(awards[index].name)}</span></button>`).join('')}</div>`:''}
 <div class="pp-numbers" style="--stat-count:${profile.stats.length}" aria-label="Profile activity">${profile.stats.map(stat=>`<div><strong>${esc(stat.value)}</strong><span>${esc(stat.label)}</span></div>`).join('')}</div>
 <section class="pp-contributions" aria-labelledby="pp-contributions-title"><div class="pp-section-title"><h2 id="pp-contributions-title">contributions</h2><span>${contributions.length?contributions.length+' featured':''}</span></div>${!contributions.length?'<p class="pp-profile-pending">Your discoveries will fill these pages. Published contributions will appear when your account is connected.</p>':''}<div class="pp-contribution-grid" data-count="${contributions.length}">${contributions.map(spot=>`<a class="pp-spot" href="${esc(spot.href)}" ${spot.href.startsWith('https:')?'target="_blank" rel="noopener"':''} aria-label="Read ${esc(spot.name)}">${spot.image?`<img src="${esc(spot.image)}" alt="${esc(spot.name)}" width="360" height="250">`:'<span class="pp-no-photo" aria-hidden="true">deep<br>spot.</span>'}<span class="pp-spot-copy"><span>${esc(spot.place)}</span><strong>${esc(spot.name)}</strong></span></a>`).join('')}</div></section>
 <p class="pp-records-note">${esc(profile.notice)}</p>${profile.localPreview?'<a class="pp-back" href="/account/">edit your passport ↗</a>':`<a class="pp-back" href="/browse/?q=${encodeURIComponent(profile.name)}">all spots by ${esc(profile.name)} ↗</a>`}</section></article>`;
 $('#passport').setAttribute('aria-busy','false');$('.pp-share').disabled=false;
 if(profile.localPreview)initPad($('#pp-pad'),{art:profile.signatureArt,onSave:url=>{profile.signatureArt=url||null;exportPromise=null;if(exportImage){URL.revokeObjectURL(exportImage.url);exportImage=null;}}});
 if(location.hash==='#pp-pad')$('#pp-pad')?.scrollIntoView({block:'center'});
 applyTheme(document.documentElement.dataset.theme);
}
$('.pp-share').addEventListener('click',async()=>{
 $('#pp-share-url').value=profileURL();const local=['localhost','127.0.0.1'].includes(location.hostname);
 $('.pp-share-note').textContent=profile.localPreview?'This edited passport is stored on this browser. Download the image to share it; the preview link will not contain your draft.':local?'The link is local to this preview. Download the image to share it anywhere.':'Copy the profile link or download an image of this passport.';
 $('.pp-native-share').hidden=profile.localPreview||!navigator.share;$('.pp-share-dialog').showModal();
 const link=$('.pp-download');link.textContent=exportImage?'↓ download passport image':'preparing image…';
 try{exportPromise??=createPassportImage(profile,contributions,profileURL());exportImage=await exportPromise;link.href=exportImage.url;link.download=exportImage.filename;link.setAttribute('aria-disabled','false');link.textContent='↓ download passport image';}
 catch{exportPromise=null;link.textContent='Image unavailable. Reopen Share to retry.';}
});
$('#pp-copy').addEventListener('click',async()=>{try{await navigator.clipboard.writeText(profileURL());$('#pp-copy').textContent='copied ✓';setTimeout(()=>$('#pp-copy').textContent='copy link',2200);}catch{$('#pp-share-url').focus();$('#pp-share-url').select();notify('Select and copy the profile link.');}});
$('.pp-native-share').addEventListener('click',async()=>{try{await navigator.share({title:`${profile.name} — DeepSpot Passport`,text:'A passport for the curious.',url:profileURL()});}catch(error){if(error.name!=='AbortError')notify('Use copy link to share this passport.');}});
$('.pp-download').addEventListener('click',event=>{if(!exportImage)event.preventDefault();});
window.addEventListener('pagehide',event=>{if(!event.persisted&&exportImage)URL.revokeObjectURL(exportImage.url);});
document.addEventListener('click',event=>{
 const button=event.target.closest('[data-award]');
 if(button){const index=Number(button.dataset.award),award=awards[index];$('.pp-award-body').innerHTML=`${stampArt(index)}<h2 id="pp-award-title">${esc(award.name)}</h2><p>${esc(award.description)}</p>${profile.sample?'<p>Sample achievement for this profile preview.</p>':''}`;$('.pp-award-dialog').showModal();}
 if(event.target.closest('.pp-dialog-close'))event.target.closest('dialog').close();
});
document.querySelectorAll('dialog').forEach(dialog=>dialog.addEventListener('click',event=>{if(event.target!==dialog)return;const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close();}));
try{
 profile=await loadProfile(params.get('user')||'wayfarer');
 if(!profile){$('#passport').innerHTML='<div class="pp-loading"><h1>Profile not found</h1><p>This passport isn’t in the current collection.</p><a href="/community/">back to the community ↗</a></div>';$('#passport').setAttribute('aria-busy','false');}
 else{contributions=profile.records.slice(0,4);render();}
}catch{$('#passport').innerHTML='<div class="pp-loading"><h1>Unable to load this passport</h1><p>Please refresh to try again.</p><a href="/community/">back to the community ↗</a></div>';$('#passport').setAttribute('aria-busy','false');}
const footer=$('deepspot-cta');footer?.querySelectorAll('.ds-footer-logo,.ds-footer-nav a').forEach(a=>{if(a.classList.contains('ds-footer-logo')||a.textContent.trim()==='home')a.href='/?theme='+document.documentElement.dataset.theme;});
