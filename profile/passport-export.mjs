import {awards,stampArt,moleCrop} from './passport-art.mjs?v=pad1';

// The share image is drawn from the same profile and contribution records as the page.
// It stays self-contained: all photographs are served with the site.
function loadImage(src){if(!src)return Promise.resolve(null);return new Promise(resolve=>{const image=new Image();let settled=false;const finish=value=>{if(settled)return;settled=true;clearTimeout(timer);image.onload=image.onerror=null;resolve(value);};const timer=setTimeout(()=>finish(null),8000);image.onload=()=>finish(image);image.onerror=()=>finish(null);if(/^https?:/.test(src))image.crossOrigin='anonymous';image.src=src;});}
function cover(ctx,image,x,y,w,h){
 if(!image){ctx.fillStyle='#203249';ctx.fillRect(x,y,w,h);return;}
 const scale=Math.max(w/image.width,h/image.height),sw=w/scale,sh=h/scale;
 ctx.drawImage(image,(image.width-sw)/2,(image.height-sh)/2,sw,sh,x,y,w,h);
}
function wrap(ctx,value,x,y,width,lineHeight,maxLines=20){
 const words=String(value).split(/\s+/),lines=[];let line='';
 for(const word of words){const candidate=line?`${line} ${word}`:word;if(line&&ctx.measureText(candidate).width>width){lines.push(line);line=word;}else line=candidate;}
 if(line)lines.push(line);
 lines.slice(0,maxLines).forEach((text,i)=>{if(i===maxLines-1&&lines.length>maxLines){while(ctx.measureText(text+'…').width>width)text=text.slice(0,-1);text+='…';}ctx.fillText(text,x,y+i*lineHeight);});
 return y+Math.min(lines.length,maxLines)*lineHeight;
}
export async function createPassportImage(profile,spots,url){
 await document.fonts.ready;
 const selectedAwards=(profile.awards||[]).map(index=>({index,...awards[index]}));
 const stampImages=selectedAwards.map(({index,...award})=>{
  const svg=stampArt(index).replaceAll('currentColor',award.color).replace('<svg ','<svg width="120" height="120" ').replace('</svg>','<style>.pp-stamp-word{font:8px Arial,sans-serif;letter-spacing:1px;fill:'+award.color+';stroke:none}</style></svg>');
  return loadImage('data:image/svg+xml;charset=utf-8,'+encodeURIComponent(svg));
 });
 const artImage=await loadImage(profile.signatureArt);
 const images=await Promise.all([loadImage(profile.image),...spots.map(spot=>loadImage(spot.image)),...stampImages]);
 const canvas=document.createElement('canvas');canvas.width=1600;canvas.height=1100;
 const ctx=canvas.getContext('2d');
 const ink='#0b1b27',muted='#45636b',blue='#3c60ff',aqua='#83cdce',paper='#f5f4ee';
 const text=(value,x,y,size=18,color=ink,weight=400)=>{ctx.fillStyle=color;ctx.font=`${weight} ${size}px Arial, sans-serif`;ctx.fillText(value,x,y);};
 const rule=(x1,y1,x2,y2,color='#0b1b2735')=>{ctx.strokeStyle=color;ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.stroke();};
 ctx.fillStyle='#0c101b';ctx.fillRect(0,0,1600,1100);
 ctx.save();ctx.beginPath();ctx.roundRect(50,48,1500,1004,18);ctx.clip();
 ctx.fillStyle=paper;ctx.fillRect(50,48,1500,1004);ctx.fillStyle=aqua;ctx.fillRect(50,48,700,1004);
 text('DEEP SPOT / EXPLORER PASSPORT',90,99,17,ink,700);text(profile.localPreview?'LOCAL DRAFT':profile.sample?'SAMPLE PROFILE':'CONTRIBUTOR',1290,99,14,muted,600);
 // A quiet portrait frame echoes the halftone of the globe without rasterizing the person.
 ctx.fillStyle='#152339';ctx.fillRect(90,131,620,268);
 ctx.fillStyle='#83cdce40';for(let y=139;y<395;y+=9)for(let x=98;x<345;x+=9){ctx.beginPath();ctx.arc(x,y,.8,0,Math.PI*2);ctx.fill();}
 ctx.save();ctx.translate(400,265);ctx.rotate(-.035);ctx.fillStyle=paper;ctx.fillRect(-110,-115,220,230);if(images[0]&&profile.imageKind==='mole'){const m=images[0],sw=moleCrop.w*m.width;ctx.drawImage(m,moleCrop.x*m.width,moleCrop.y*m.height,sw,sw*212/202,-101,-106,202,212);}else if(images[0]){ctx.filter='grayscale(1)';cover(ctx,images[0],-101,-106,202,212);}else{ctx.textAlign='center';text(profile.name.split(/\s+/).slice(0,2).map(n=>n[0]).join(''),0,25,72,ink,700);}ctx.restore();
 text('FOR THE CURIOUS.',112,376,12,aqua,600);
 ctx.font='800 67px Arial, sans-serif';ctx.fillStyle=ink;const nameBottom=wrap(ctx,profile.name,88,485,625,70,2);
 text(profile.handle?'@'+profile.handle:'DeepSpot contributor',92,nameBottom+4,19,muted);
 ctx.font='400 23px Arial, sans-serif';ctx.fillStyle=ink;
 const bioBottom=wrap(ctx,profile.bio||'Discoveries and stories contributed to DeepSpot.',92,nameBottom+54,598,33,artImage?3:4);
 if(artImage){
  // The pad drawing sits on ruled paper under the bio; details move beside it.
  const ay=Math.max(bioBottom-8,708),ah=Math.max(90,Math.min(150,872-ay)),aw=ah*2;
  ctx.save();ctx.beginPath();ctx.roundRect(92,ay,aw,ah,8);ctx.fillStyle='#fbfcff';ctx.fill();ctx.clip();
  for(let i=1;i<5;i++)rule(92,ay+i*ah/5,92+aw,ay+i*ah/5,'#cfe0f5');
  ctx.drawImage(artImage,92,ay,aw,ah);ctx.restore();
  ctx.strokeStyle='#7482a0';ctx.lineWidth=2;ctx.beginPath();ctx.roundRect(92,ay,aw,ah,8);ctx.stroke();
  ctx.fillStyle='#3c60ff';ctx.fillRect(102,ay-17,Math.min(aw-20,ctx.measureText(profile.name).width*.5+26),17);text(profile.name.toUpperCase().slice(0,22),108,ay-4,11,'#fff',700);
  const dx=92+aw+28;
  if(profile.basedIn){text('BASED IN',dx,ay+22,13,muted,600);text(profile.basedIn,dx,ay+50,21);}
  if(profile.joined){text('MEMBER SINCE',dx,ay+90,13,muted,600);text(profile.joined,dx,ay+118,21);}
  if(profile.signature){rule(92,ay+ah+18,708,ay+ah+18);text('SIGNATURE',92,ay+ah+44,13,muted,600);ctx.save();ctx.translate(100,Math.min(ay+ah+88,950));ctx.rotate(-.04);ctx.fillStyle=ink;ctx.font='italic 38px "Segoe Script", cursive';ctx.fillText(profile.signature,0,0);ctx.restore();}
 }else{
 rule(92,751,708,751);
 if(profile.basedIn){text('BASED IN',92,783,13,muted,600);text(profile.basedIn,92,814,21);}
 if(profile.joined){text('MEMBER SINCE',474,783,13,muted,600);text(profile.joined,474,814,21);}
 if(profile.signature){rule(92,846,708,846);text('SIGNATURE',92,878,13,muted,600);ctx.save();ctx.translate(100,936);ctx.rotate(-.04);ctx.fillStyle=ink;ctx.font='italic 45px "Segoe Script", cursive';ctx.fillText(profile.signature,0,0);ctx.restore();}
 else{ctx.font='400 20px Arial, sans-serif';ctx.fillStyle=muted;wrap(ctx,'Bio and profile details have not been added to this preview.',92,801,560,30);}
 }
 rule(92,966,708,966);ctx.font='15px monospace';ctx.fillStyle=muted;ctx.fillText(`DEEP<SPOT<<${profile.name.toUpperCase().replaceAll(' ','<')}<<<<`,92,1006);
 const seam=ctx.createLinearGradient(738,0,766,0);seam.addColorStop(0,'#0000');seam.addColorStop(.5,'#0002');seam.addColorStop(1,'#0000');ctx.fillStyle=seam;ctx.fillRect(738,48,28,1004);
 text(selectedAwards.length?'trophies':'contribution record',792,158,33,ink,700);
 selectedAwards.forEach((award,i)=>{const x=812+i*232;ctx.save();ctx.translate(x+66,254);ctx.rotate([-.12,.08,-.06][i]);const stamp=images[1+spots.length+i];if(stamp)ctx.drawImage(stamp,-63,-63,126,126);ctx.restore();ctx.textAlign='center';text(award.name,x+66,338,17,ink);ctx.textAlign='left';});
 if(!selectedAwards.length){ctx.fillStyle=muted;ctx.font='400 25px Arial, sans-serif';wrap(ctx,'The discoveries and stories behind the name.',792,225,650,35);}
 rule(792,367,1506,367);
 const stats=profile.stats.map(stat=>[stat.value,stat.label]);
 stats.forEach(([value,label],i)=>{const step=714/stats.length,x=792+i*step;text(String(value),x,443,58,i===0?'#14713d':ink,700);text(label,x,474,16,muted);if(i<stats.length-1)rule(x+step-24,391,x+step-24,481);});
 rule(792,505,1506,505);text('contributions',792,556,33,ink,700);
 const cardW=spots.length===1?714:345,cardH=spots.length===1?369:175;
 spots.slice(0,4).forEach((spot,i)=>{const x=792+(i%2)*369,y=582+Math.floor(i/2)*194;ctx.save();ctx.beginPath();ctx.rect(x,y,cardW,cardH);ctx.clip();cover(ctx,images[i+1],x,y,cardW,cardH);const fade=ctx.createLinearGradient(0,y+35,0,y+cardH);fade.addColorStop(0,'#07131b00');fade.addColorStop(1,'#07131be8');ctx.fillStyle=fade;ctx.fillRect(x,y,cardW,cardH);text(spot.place,x+17,y+cardH-62,12,'#e4e8e8');ctx.fillStyle=paper;ctx.font='600 23px Arial, sans-serif';wrap(ctx,spot.name,x+17,y+cardH-34,cardW-34,25,2);ctx.restore();});
 text(profile.localPreview?'Local profile draft. Account activity is not connected.':profile.sample?'Sample profile, achievements, and activity.':'Contributor statistics from the source snapshot.',792,989,13,muted);
 const host=new URL(url).hostname;text(['localhost','127.0.0.1'].includes(host)?'DEEP SPOT / PROFILE PREVIEW':host,792,1013,12,muted,600);
 ctx.restore();
 const blob=await new Promise((resolve,reject)=>canvas.toBlob(value=>value?resolve(value):reject(Error('Unable to export passport')),'image/png'));
 return {url:URL.createObjectURL(blob),filename:`deepspot-passport-${profile.id}.png`};
}
