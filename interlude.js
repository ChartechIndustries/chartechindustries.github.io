(()=>{
const glimpses=[
 {image:'rummu',name:'the flooded prison',place:'estonia',slug:'a-soviet-prison-doubles-as-a-swimming-hole',position:'center 55%',width:'wide'},
 {image:'srt',name:'the singing sculpture',place:'england',slug:'a-melodic-sculpture-in-the-lancashire-countryside',position:'center 32%',width:'narrow'},
 {image:'xwejni',name:'350 years of salt',place:'malta',slug:'the-place-in-malta-where-people-have-been-making-salt-for-centuries',position:'center 63%',width:'wide'},
 {image:'chiatura',name:'a city on cables',place:'georgia',slug:'the-city-of-cable-cars-frozen-in-time',position:'center',width:''},
 {image:'maishima',name:'the garbage palace',place:'japan',slug:'osaka-s-candy-colored-garbage-palace',position:'center 45%',width:'narrow'},
 {image:'sandchurch',name:'swallowed by sand',place:'denmark',slug:'700-year-old-church-devoured-by-sand',position:'center 40%',width:''},
 {image:'teufelsberg',name:'cold war, new canvas',place:'germany',slug:'berlin-s-hill-of-nazi-rubble-cold-war-spies-and-graffiti',position:'center 40%',width:'wide'}
];
class CuriosityInterlude extends HTMLElement {
 connectedCallback(){
  if(this.ready)return;
  this.ready=true;
  this.innerHTML=`<section class="glimpse-section" aria-label="A glimpse of places on DeepSpot">
   <div class="glimpse-window"><div class="glimpse-track">${[0,1].map(copy=>`<div class="glimpse-group" ${copy?'aria-hidden="true"':''}>${glimpses.map(spot=>`<a class="glimpse ${spot.width}" href="https://www.deepspot.io/blog/${spot.slug}" target="_blank" rel="noopener" aria-label="Explore ${spot.name}, ${spot.place}" ${copy?'tabindex="-1"':''}>
    <img src="/spots/${spot.image}.jpg" alt="" width="800" height="600" decoding="async" style="object-position:${spot.position}">
    <span class="glimpse-caption"><span><small>${spot.place}</small><strong>${spot.name}</strong></span><span aria-hidden="true">↗</span></span>
   </a>`).join('')}</div>`).join('')}</div></div>
   <button class="glimpse-pause" type="button" aria-label="Pause photo strip" aria-pressed="false"><svg viewBox="0 0 20 20" aria-hidden="true"><path class="glimpse-pause-icon" d="M7 5v10M13 5v10"/><path class="glimpse-play-icon" d="m7 5 8 5-8 5Z"/></svg></button>
  </section>`;
  this.querySelector('.glimpse-pause').addEventListener('click',event=>{
   const paused=this.classList.toggle('glimpse-paused');
   event.currentTarget.setAttribute('aria-pressed',String(paused));
   event.currentTarget.setAttribute('aria-label',paused?'Play photo strip':'Pause photo strip');
  });
  if('IntersectionObserver' in window){
   this.classList.add('glimpse-offscreen');
   this.observer=new IntersectionObserver(entries=>this.classList.toggle('glimpse-offscreen',!entries[0].isIntersecting),{rootMargin:'40px'});
   this.observer.observe(this);
  }
 }
 disconnectedCallback(){this.observer?.disconnect()}
}
customElements.define('deepspot-interlude',CuriosityInterlude);
})();
