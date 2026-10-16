import {profileId} from './identity.mjs';
import {readAccount,travelerImage,avatarImage} from '../site/account-state.mjs';
const sampleSpots=['/blog/tochigi-underground-quarry','/blog/osaka-s-candy-colored-garbage-palace','/blog/a-soviet-prison-doubles-as-a-swimming-hole','/blog/south-london-s-most-notable-street-art-location','/blog/the-place-in-malta-where-people-have-been-making-salt-for-centuries','/blog/700-year-old-church-devoured-by-sand'];
const sampleImages=['/spots/oya.jpg','/spots/maishima.jpg','/spots/rummu.jpg','/editorial-assets/spot-south-london-s-most-notable-street-art-location.jpg','/spots/xwejni.jpg','/spots/sandchurch.jpg'];
async function json(url){const response=await fetch(url);if(!response.ok)throw Error('Profile collection unavailable');return response.json();}
export async function loadProfile(id){
 if(id==='preview'){
  const draft=readAccount();
  return {id:'preview',name:draft.name||'Your name here',handle:draft.username||null,sample:false,localPreview:true,image:avatarImage(draft)||travelerImage(draft.style),imageKind:draft.avatarMode==='mole'&&draft.mole?'mole':'',signatureArt:draft.signatureArt||null,bio:draft.bio||null,signature:draft.signature||null,socials:{instagram:draft.instagram,twitter:draft.twitter,website:draft.website},awards:[],records:[],stats:[{value:'—',label:'spots contributed'},{value:'—',label:'stories shared'}],notice:'A profile draft stored on this browser. Contributions, badges and XP will appear when your live account is connected.'};
 }
 const [directory,catalog,stories]=await Promise.all([json('/profile/profiles.json'),json('/featured-spots.json'),json('/editorial-stories.json')]);
 const sample=directory.profiles.find(profile=>profile.id===id||(profile.aliases||[]).some(name=>profileId(name)===id));
 const spotRecord=spot=>({id:spot.id,name:spot.title,place:spot.place,image:spot.image,href:'/spot/?id='+encodeURIComponent(spot.id.split('/').pop()),kind:'spot'});
 if(sample?.sample){
  const index=directory.profiles.indexOf(sample);
  const contributions=Array.from({length:4},(_,i)=>{const n=(index+i)%sampleSpots.length,spot=catalog.find(s=>s.id===sampleSpots[n]);return spot?{...spotRecord(spot),image:sampleImages[n]}:null;}).filter(Boolean);
  return {...sample,awards:[0,1,2],stats:[{value:sample.contributions,label:'spots contributed'},{value:sample.countries,label:'countries explored'},{value:sample.stories,label:'stories shared'}],records:contributions,notice:'Sample profile and activity for this preview.'};
 }
 const names=[...new Set([...catalog.map(s=>s.publisher),...stories.map(s=>s.author)].filter(Boolean))];
 const name=sample?.name||names.find(name=>profileId(name)===id);if(!name)return null;
 const identities=new Set([name,...(sample?.aliases||[])].map(n=>n.toLowerCase()));
 const spots=catalog.filter(s=>identities.has(s.publisher?.toLowerCase())&&!s.title.startsWith('PART OF:'));
 const written=stories.filter(s=>identities.has(s.author?.toLowerCase()));
 const records=[...spots.map(spotRecord),...written.map(s=>({id:s.id,name:s.title,place:'story · '+s.time+' min read',image:s.cover||'/editorial-assets/'+s.image+'.jpg',href:'/story/?id='+encodeURIComponent(s.id),kind:'story'}))];
 // These are verified bylines in the saved collection, not the member’s lifetime totals.
 return {id:sample?.id||id,name,handle:sample?.handle||null,joined:sample?.joined||null,sample:false,image:sample?.image||null,bio:null,signature:null,awards:[],records,stats:sample?.verifiedSnapshot?[{value:sample.spots,label:'spots contributed'},{value:sample.stories,label:'stories shared'}]:[{value:spots.length,label:(spots.length===1?'spot':'spots')+' in this collection'},{value:written.length,label:(written.length===1?'story':'stories')+' in this collection'}],notice:sample?.verifiedSnapshot?'Profile totals captured from DeepSpot on October 8, 2026. Entries below are from this preview’s collection.':'Contributions from this site’s current collection. Full profile details are not connected yet.'};
}
