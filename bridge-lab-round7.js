(()=>{
// Each study is one oversized headline and one path into the complete spot grid.
const designs=[
 {name:'the world is weirder',cls:'r7-weirder',title:'the world is weirder than you think.',lines:[['the world is',19.59],['weirder than',18.16,'accent'],['you think.',20.58]],mobile:[['the world',23.97],['is weirder',23,'accent'],['than you',25.39],['think.',40.14]]},
 {name:'somewhere unexpected',cls:'r7-somewhere',title:'go somewhere unexpected.',lines:[['go',27.43,'small-intro'],['somewhere',19.36,'outline'],['unexpected.',17.98,'accent']],mobile:[['go',65,'small-intro'],['somewhere',18.96,'outline'],['unexpected.',18.16,'accent']]},
 {name:'nothing ordinary down here',cls:'r7-nothing',title:'nothing ordinary down here.',lines:[['nothing',23.39,'left'],['ordinary',24.61,'right outline'],['down here.',19.23,'left accent']],mobile:[['nothing',28.79,'left'],['ordinary',26.55,'right outline'],['down',40,'left accent'],['here.',44,'right accent']]},
 {name:'small places, big stories',cls:'r7-stories',title:'small places. big stories.',lines:[['small places.',17.25],['big stories.',18.52,'serif accent']],mobile:[['small',37],['places.',31.36],['big',55,'serif accent'],['stories.',27.53,'serif accent']]},
 {name:'look closer',cls:'r7-closer',title:'look closer.',lines:[['look',32.79,'left'],['closer.',34.17,'dotted']],mobile:[['look',50.78,'left'],['closer.',33.82,'dotted']],arrow:true},
 {name:'your next detour',cls:'r7-detour',title:'your next detour starts here.',lines:[['your next',17.24,'left'],['detour',34.56,'accent'],['starts here.',16.5,'right']],mobile:[['your next',23.64,'left'],['detour',33.85,'accent'],['starts',35,'right'],['here.',44,'right']]},
 {name:'there’s more out there',cls:'r7-more',title:'there’s more out there.',lines:[['there’s more',18.28,'outline'],['out there.',23.89,'accent']],mobile:[['there’s',32.96,'outline'],['more',42.1,'outline'],['out',60,'accent'],['there.',37,'accent']]},
 {name:'the incurably curious',cls:'r7-curious',title:'for the incurably curious.',lines:[['for the',22.3,'left'],['incurably',24.46],['curious.',25.11,'accent']],mobile:[['for the',29,'left'],['incurably',23.97],['curious.',27.39,'accent']],star:true},
 {name:'less obvious, more extraordinary',cls:'r7-extraordinary',title:'less obvious. more extraordinary.',lines:[['less obvious.',17.27,'outline'],['more',23.68,'left'],['extraordinary.',16.67,'accent']],mobile:[['less',48,'left outline'],['obvious.',25.76,'outline'],['more',38,'left'],['extraordinary.',16.33,'accent']]},
 {name:'this way to the un-ordinary',cls:'r7-thisway',title:'this way to the un-ordinary.',lines:[['this way',23.03,'right'],['to the',25.34,'right'],['un-ordinary.',19.01,'accent']],mobile:[['this way',26.96,'right'],['to the',35,'right'],['un-',58,'left accent'],['ordinary.',23.8,'right accent']],arrow:true}
];
const esc=s=>s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const typeset=lines=>lines.map(([text,size,cls=''])=>`<span class="r7-line ${cls.split(' ').filter(Boolean).map(c=>'r7-'+c).join(' ')}" style="--r7-size:${size}">${esc(text)}</span>`).join('');
window.DeepSpotBridgeRoundSeven={
 labels:designs.map(d=>d.name),
 views(app,{icon}){return designs.map(d=>()=>`<div class="r7 ${d.cls}"><div class="r7-type"><h2 aria-label="${esc(d.title)}"><span class="r7-desktop" aria-hidden="true">${typeset(d.lines)}</span><span class="r7-mobile" aria-hidden="true">${typeset(d.mobile)}</span></h2>${d.arrow?`<span class="r7-giant-arrow" aria-hidden="true">${icon('arrow')}</span>`:''}${d.star?`<span class="r7-asterisk" aria-hidden="true">${icon('star')}</span>`:''}</div><button type="button" class="r7-cta" data-category="0"><span>explore all deep spots</span>${icon('arrow')}</button></div>`)}
};
})();
