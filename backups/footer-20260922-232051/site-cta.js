(()=>{
 class DeepSpotCTA extends HTMLElement{
  connectedCallback(){
   if(this.dataset.ready)return;
   this.dataset.ready='true';
   this.innerHTML=`<section class="ds-cta" aria-label="Join the DeepSpot community">
    <div class="ds-cta-contribute">
     <h2>know a<br><span>hidden gem?</span></h2>
     <p>Help us map the unmapped. Share your favorite obscure spots and become part of our community of explorers worldwide.</p>
     <a class="ds-cta-button" href="https://www.deepspot.io/early-access" target="_blank" rel="noopener">contribute a spot <span aria-hidden="true">↗</span></a>
    </div>
    <div class="ds-cta-newsletter">
     <h3>new stories<br>every week.</h3>
     <p>Get the latest deep spots delivered to your inbox.</p>
     <div class="ds-cta-signup" role="group" aria-label="Newsletter signup preview" aria-describedby="ds-newsletter-status">
      <label class="ds-sr-only" for="ds-newsletter-email">Email address</label>
      <input id="ds-newsletter-email" type="email" placeholder="enter your email" disabled>
      <button type="button" disabled>subscribe <span aria-hidden="true">↗</span></button>
     </div>
     <small id="ds-newsletter-status">newsletter signup coming soon.</small>
    </div>
   </section>`;
  }
 }
 customElements.define('deepspot-cta',DeepSpotCTA);
})();
