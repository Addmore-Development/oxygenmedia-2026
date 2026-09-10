const menuButton = document.querySelector('.menu-button');
const nav = document.querySelector('.site-nav');
const header = document.querySelector('.site-header');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

menuButton?.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(open));
});
nav?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  nav.classList.remove('open');
  menuButton?.setAttribute('aria-expanded', 'false');
}));
document.querySelectorAll('[data-year]').forEach(el => el.textContent = new Date().getFullYear());

const ticker = document.createElement('div');
ticker.className = 'oxygen-ticker';
ticker.setAttribute('aria-hidden', 'true');
const tickerItems = ['Media Strategy','Media Buying','Advertising','Brand','PR + Reputation','Content + Film','Digital','Events + Activations','Johannesburg'];
const setMarkup = tickerItems.map(item => `<span class="oxygen-ticker-item">${item}</span>`).join('');
ticker.innerHTML = `<div class="oxygen-ticker-track"><div class="oxygen-ticker-set">${setMarkup}</div><div class="oxygen-ticker-set">${setMarkup}</div></div>`;
header?.insertAdjacentElement('afterend', ticker);

const updateHeader = () => header?.classList.toggle('is-scrolled', window.scrollY > 12);
updateHeader();
window.addEventListener('scroll', updateHeader, { passive:true });

document.body.classList.add('motion-ready');
const targets = [
  '.section-index','.display-title','.intro-copy','.proof-item','.featured-head > *','.work-card',
  '.services-heading > *','.service-row','.image-triptych figure','.media-statement > *','.channel',
  '.manifesto p','.split-section > *','.capability','.stat-grid article','.service-feature .feature-copy',
  '.service-feature .feature-image','.steps article','.platform','.portfolio-card','.editorial-image',
  '.cta-inner > *','.contact-list > div'
];
const els = [...document.querySelectorAll(targets.join(','))];
els.forEach((el,i)=>{
  el.classList.add('reveal-motion');
  el.style.setProperty('--reveal-delay', `${(i%5)*50}ms`);
  if(el.matches('.feature-image,.editorial-image,.portfolio-card:nth-child(even),.work-card:nth-child(even)')) el.classList.add('from-right');
});
if(!reduceMotion && 'IntersectionObserver' in window){
  const observer = new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){entry.target.classList.add('is-visible');observer.unobserve(entry.target)}
    });
  },{threshold:.1,rootMargin:'0px 0px -5% 0px'});
  els.forEach(el=>observer.observe(el));
}else{els.forEach(el=>el.classList.add('is-visible'))}

if(!reduceMotion && window.matchMedia('(min-width: 901px)').matches){
  document.querySelectorAll('.hero-image,.page-hero-visual,.media-hero-image,.film-image').forEach(zone=>{
    const img=zone.querySelector('img'); if(!img) return;
    zone.addEventListener('pointermove',e=>{
      const r=zone.getBoundingClientRect();
      const x=((e.clientX-r.left)/r.width-.5)*8;
      const y=((e.clientY-r.top)/r.height-.5)*8;
      img.style.transform=`scale(1.035) translate(${-x*.2}px,${-y*.2}px)`;
    });
    zone.addEventListener('pointerleave',()=>img.style.transform='');
  });
  const glow=document.createElement('div');glow.className='pointer-glow';document.body.appendChild(glow);
  window.addEventListener('pointermove',e=>{glow.style.left=`${e.clientX}px`;glow.style.top=`${e.clientY}px`;glow.classList.add('visible')},{passive:true});
  document.documentElement.addEventListener('mouseleave',()=>glow.classList.remove('visible'));
}

// --- DarkMatter-inspired intensity pass: interface motion, not content imitation ---
(() => {
  // Scroll progress
  const progress = document.createElement('div');
  progress.className = 'oxy-scroll-progress';
  progress.innerHTML = '<span></span>';
  document.body.appendChild(progress);
  const bar = progress.firstElementChild;
  const updateProgress = () => {
    const max = document.documentElement.scrollHeight - innerHeight;
    const p = max > 0 ? scrollY / max : 0;
    bar.style.transform = `scaleX(${Math.max(0, Math.min(1, p))})`;
  };
  addEventListener('scroll', updateProgress, {passive:true});
  updateProgress();

  // Campaign-style moving statement band, added sparingly once per page.
  const main = document.querySelector('main');
  const cta = document.querySelector('.cta-section');
  if (main && cta && !document.querySelector('.oxy-statement-band')) {
    const band = document.createElement('section');
    band.className = 'oxy-statement-band';
    band.setAttribute('aria-label', 'Oxygen Media approach');
    const phrase = '<span>Think sharper</span><b>●</b><span><i>Make</i> braver</span><b>●</b><span>Move smarter</span><b>●</b>';
    band.innerHTML = `<div class="oxy-statement-track"><div class="oxy-statement-set">${phrase}</div><div class="oxy-statement-set" aria-hidden="true">${phrase}</div></div>`;
    main.insertBefore(band, cta);
  }

  // Custom editorial cursor for desktop/precise pointers.
  if (matchMedia('(hover:hover) and (pointer:fine)').matches) {
    const cursor = document.createElement('div');
    cursor.className = 'oxy-cursor';
    document.body.appendChild(cursor);
    let x = innerWidth/2, y = innerHeight/2, cx = x, cy = y;
    const loop = () => {
      cx += (x-cx)*.22; cy += (y-cy)*.22;
      cursor.style.transform = `translate(${cx}px,${cy}px) translate(-50%,-50%)`;
      requestAnimationFrame(loop);
    };
    addEventListener('mousemove', e => { x=e.clientX; y=e.clientY; }, {passive:true});
    document.querySelectorAll('a,button,.work-card,.portfolio-card,.service-row').forEach(el => {
      el.addEventListener('mouseenter',()=>cursor.classList.add('is-link'));
      el.addEventListener('mouseleave',()=>cursor.classList.remove('is-link'));
    });
    loop();
  }

  // Link transition curtain for local HTML navigation.
  const curtain = document.createElement('div');
  curtain.className = 'oxy-page-curtain';
  document.body.appendChild(curtain);
  document.querySelectorAll('a[href$=".html"]').forEach(link => {
    link.addEventListener('click', e => {
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || link.target === '_blank') return;
      const href = link.getAttribute('href');
      if (!href) return;
      e.preventDefault();
      curtain.classList.remove('out');
      curtain.classList.add('in');
      setTimeout(()=>{ location.href = href; }, 420);
    });
  });
  addEventListener('pageshow', () => {
    curtain.classList.remove('in');
    curtain.classList.add('out');
    setTimeout(()=>curtain.classList.remove('out'), 750);
  });

  // Gentle image parallax, only on larger screens.
  if (matchMedia('(min-width: 900px) and (prefers-reduced-motion: no-preference)').matches) {
    const imgs = [...document.querySelectorAll('.hero-image img,.page-hero-visual img,.media-hero-image img,.film-image img,.work-card img,.portfolio-card img')];
    const tick = () => {
      const vh = innerHeight;
      imgs.forEach(img => {
        const r = img.getBoundingClientRect();
        if (r.bottom < 0 || r.top > vh) return;
        const mid = r.top + r.height/2;
        const offset = (mid - vh/2) / vh;
        img.style.objectPosition = `50% ${50 + offset*5}%`;
      });
    };
    addEventListener('scroll', tick, {passive:true}); tick();
  }
})();