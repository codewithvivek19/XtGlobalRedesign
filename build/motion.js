/* XTGlobal motion engine: smooth scroll, reveals, 3D ring, parallax, depth.
   Pure DOM, no framework. Respects prefers-reduced-motion throughout. */
(() => {
  const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const root = document.documentElement;
  root.classList.add(reduce ? 'no-motion' : 'js-motion');
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const vh = () => innerHeight;

  /* ---------- lift nav out of the isolated hero so it stacks above every section ---------- */
  { const n = $('.nav'), mn = $('#mnav'), sh = $('.shell');
    if (sh && sh.classList.contains('day')) document.body.classList.add('day-nav');
    if (mn) document.body.prepend(mn); if (n) document.body.prepend(n); }

  /* ---------- smooth scroll (Lenis when available, native otherwise) ---------- */
  let lenis = null, vel = 0, sy = scrollY;
  if (!reduce && window.Lenis) {
    lenis = new Lenis({ lerp: .09, smoothWheel: true, wheelMultiplier: 1 });
    lenis.on('scroll', e => { vel = e.velocity || 0; });
  }
  const scrollTo = (t) => lenis ? lenis.scrollTo(t, { offset: -96, duration: 1.4 }) : t.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
  $$('a[href^="#"]').forEach(a => a.addEventListener('click', e => {
    const id = a.getAttribute('href'); if (id.length < 2) return;
    const t = document.querySelector(id); if (!t) return;
    e.preventDefault(); scrollTo(t); history.replaceState(null, '', id);
  }));

  /* ---------- progress bar + floating nav ---------- */
  const bar = document.createElement('div'); bar.className = 'progress'; document.body.appendChild(bar);
  const nav = $('.nav'); let lastY = 0;
  function navTick(y) {
    nav.classList.toggle('solid', y > 60);
    const down = y > lastY + 2, up = y < lastY - 2;
    if (down && y > 420 && !$('#mnav').classList.contains('open')) nav.classList.add('hide');
    if (up || y < 420) nav.classList.remove('hide');
    lastY = y;
    const max = document.documentElement.scrollHeight - vh();
    bar.style.transform = `scaleX(${max > 0 ? y / max : 0})`;
  }

  /* ---------- word splitting for blur-rise reveals ---------- */
  function split(el, base = 0) {
    let i = 0;
    const walk = (node) => {
      [...node.childNodes].forEach(n => {
        if (n.nodeType === 3) {
          const parts = n.textContent.split(/(\s+)/), frag = document.createDocumentFragment();
          parts.forEach(p => {
            if (!p) return;
            if (/^\s+$/.test(p)) { frag.appendChild(document.createTextNode(' ')); return; }
            const w = document.createElement('span'); w.className = 'w';
            const k = document.createElement('i'); k.textContent = p; k.style.setProperty('--i', i++);
            if (base) k.style.setProperty('--d', base + 'ms');
            w.appendChild(k); frag.appendChild(w);
          });
          n.replaceWith(frag);
        } else if (n.nodeType === 1) {
          if (n.classList.contains('ico')) { n.style.setProperty('--i', i++); return; }
          if (n.tagName === 'BR' || n.tagName === 'SVG') return;
          walk(n);
        }
      });
    };
    walk(el); return el;
  }

  /* ---------- counters ---------- */
  function wrapCount(el) {
    if (el.querySelector('[data-count]')) return;
    const tn = [...el.childNodes].find(n => n.nodeType === 3 && /\d/.test(n.textContent)); if (!tn) return;
    const m = tn.textContent.match(/^(\D*)(\d+(?:\.\d+)?)(.*)$/s); if (!m) return;
    const s = document.createElement('span'); s.dataset.count = m[2]; s.textContent = m[2];
    const f = document.createDocumentFragment();
    if (m[1]) f.appendChild(document.createTextNode(m[1])); f.appendChild(s); if (m[3]) f.appendChild(document.createTextNode(m[3]));
    tn.replaceWith(f);
  }
  function runCount(s, delay = 0) {
    if (s.dataset.done) return; s.dataset.done = 1;
    const end = parseFloat(s.dataset.count), dec = (s.dataset.count.split('.')[1] || '').length;
    if (reduce) { s.textContent = end.toLocaleString('en-US', { minimumFractionDigits: dec }); return; }
    s.textContent = (0).toFixed(dec);
    setTimeout(() => {
      const t0 = performance.now(), D = 1700;
      const f = t => { const p = clamp((t - t0) / D, 0, 1), e = 1 - Math.pow(2, -10 * p);
        s.textContent = (end * (p >= 1 ? 1 : e)).toLocaleString('en-US', { minimumFractionDigits: dec, maximumFractionDigits: dec });
        if (p < 1) requestAnimationFrame(f); };
      requestAnimationFrame(f);
    }, delay);
  }
  $$('.bc .n, .ui .big').forEach(wrapCount);

  /* ---------- assign reveal choreography ---------- */
  const IO = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.classList.add('in');
    $$('[data-count]', e.target).forEach((c, k) => runCount(c, 150 + k * 80));
    IO.unobserve(e.target);
  }), { threshold: .14, rootMargin: '0px 0px -8% 0px' });

  if (!reduce) {
    // headings: word by word
    $$('.shead h2, .bigline, .cta h2, .g-ask h3, .g-here h3').forEach(h => { split(h); IO.observe(h); });
    // section labels and ledes
    $$('.shead').forEach(sh => {
      const t = $('.tag', sh), l = $('.lede', sh);
      if (t) { t.dataset.a = 'up'; IO.observe(t); }
      if (l) { l.dataset.a = 'blur'; l.style.setProperty('--d', '260ms'); IO.observe(l); }
    });
    // staggered groups (Aeline: cards arrive from decreasing offsets)
    const groups = [['.bento', 'left'], ['.diffs', 'up'], ['.tray', 'up'], ['.ind', 'tilt'], ['.pods', 'up'], ['.cfg', 'up'],
      ['.prod', 'up'], ['.rs', 'up'], ['.logos', 'up'], ['.inv', 'tilt'], ['.certs', 'up'], ['.how', 'left'], ['.posts', 'tilt'],
      ['.guide', 'up'], ['.ctag', 'up'], ['.offs', 'up'], ['.fg', 'up']];
    groups.forEach(([sel, type]) => $$(sel).forEach(g => [...g.children].forEach((c, i) => {
      if (c.classList.contains('pat') || c.classList.contains('ph') || c.classList.contains('shade')) return;
      c.dataset.a = type; c.style.setProperty('--d', (i * 90) + 'ms');
      if (type === 'left') c.style.setProperty('--x', Math.max(10, 60 - i * 12) + 'px');
      IO.observe(c);
    })));
    $$('.nobj, .partners, .band, .bandh, .trust p, .marq').forEach(el => { el.dataset.a = 'up'; IO.observe(el); });
  }
  // counters outside groups
  $$('.bc, .ic2').forEach(el => IO.observe(el));

  /* ---------- hero entrance ---------- */
  const hero = $('.hero');
  const inner = document.createElement('div'); inner.className = 'hero-inner';
  inner.style.cssText = 'display:flex;flex-direction:column;align-items:center';
  [...hero.children].filter(c => !c.classList.contains('ring')).forEach(c => inner.appendChild(c));
  hero.prepend(inner);
  if (!reduce) {
    const chip = $('.chip', inner), h1 = $('h1', inner), lede = $('.lede', inner), ctas = $('.ctas', inner), ring = $('#ring');
    chip.dataset.a = 'up'; lede.dataset.a = 'blur'; ctas.dataset.a = 'up'; ring.dataset.a = 'up';
    lede.style.setProperty('--d', '520ms'); ctas.style.setProperty('--d', '680ms'); ring.style.setProperty('--d', '820ms');
    split(h1, 140);
    const go = () => requestAnimationFrame(() => [chip, h1, lede, ctas, ring].forEach(e => e.classList.add('in')));
    (document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve()).then(() => setTimeout(go, 80));
  }
  $$('#ring [data-count]').forEach((c, k) => runCount(c, reduce ? 0 : 1200 + k * 120));

  /* ---------- 3D ring ---------- */
  const ring = $('#ring'), rot = $('#ringRot'), cards = $$('.rc', rot), N = cards.length, step = 360 / N;
  let ang = 0, spd = 0, target = reduce ? 0 : 5.5, vA = 0, drag = null, moved = 0;
  setTimeout(() => { spd = 0; }, 0);
  const radius = () => innerWidth < 760 ? 300 : 440;
  function layoutRing() {
    const r = radius();
    cards.forEach((c, i) => {
      const a = ((i * step + ang) % 360 + 540) % 360 - 180, rad = a * Math.PI / 180, va = Math.abs(a);
      const x = Math.sin(rad) * r, z = (1 - Math.cos(rad)) * r * .85, y = (1 - Math.cos(rad)) * 26;
      const op = va < 70 ? 1 : va < 96 ? 1 - (va - 70) / 26 : 0;
      c.style.transform = `translate3d(${x.toFixed(1)}px,${y.toFixed(1)}px,${z.toFixed(1)}px) rotateY(${(-a * .92).toFixed(2)}deg)`;
      c.style.opacity = op.toFixed(3); c.style.visibility = op > 0 ? 'visible' : 'hidden';
      c.style.zIndex = String(200 - Math.round(va));
      if (c.matches('a,button')) c.tabIndex = va < 24 ? 0 : -1;
    });
  }
  rot.style.transform = 'rotateX(7deg)';
  ring.addEventListener('pointerdown', e => {
    if (e.button !== 0) return;
    if (e.pointerType === 'mouse') e.preventDefault();
    drag = { x: e.clientX, a: ang, t: performance.now(), lx: e.clientX }; moved = 0; vA = 0;
    ring.setPointerCapture(e.pointerId);
  });
  ring.addEventListener('pointermove', e => {
    if (!drag) return;
    const dx = e.clientX - drag.x; moved = Math.max(moved, Math.abs(dx));
    const now = performance.now(), dt = Math.max(1, now - drag.t);
    vA = (e.clientX - drag.lx) / dt * 1000 * .22; drag.lx = e.clientX; drag.t = now;
    ang = drag.a + dx * .22;
  });
  const endDrag = () => { drag = null; };
  ring.addEventListener('pointerup', endDrag); ring.addEventListener('pointercancel', endDrag);
  ring.addEventListener('click', e => { if (moved > 6) { e.preventDefault(); e.stopPropagation(); } }, true);
  if (fine) { ring.addEventListener('pointerenter', () => target = 0); ring.addEventListener('pointerleave', () => target = reduce ? 0 : 5.5); }
  ring.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft') { vA = -step * 4; e.preventDefault(); }
    if (e.key === 'ArrowRight') { vA = step * 4; e.preventDefault(); }
  });

  /* ---------- tilt, magnetic, label roll ---------- */
  if (fine && !reduce) {
    $$('.sv, .ic2, .iv, .bc, .df, .ct, .hw, .post .th').forEach(el => {
      el.classList.add('tilt');
      el.addEventListener('pointermove', e => {
        const r = el.getBoundingClientRect(), px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
        el.classList.add('hovering');
        el.style.transform = `perspective(1000px) rotateX(${((.5 - py) * 6).toFixed(2)}deg) rotateY(${((px - .5) * 7).toFixed(2)}deg) translateY(-4px)`;
        el.style.setProperty('--mx', (px * 100).toFixed(1) + '%'); el.style.setProperty('--my', (py * 100).toFixed(1) + '%');
      });
      el.addEventListener('pointerleave', () => { el.classList.remove('hovering'); el.style.transform = ''; });
    });
    $$('.hero .btn, .cta .btn, .navr .b-sky, #dl').forEach(b => {
      b.classList.add('mag');
      b.addEventListener('pointermove', e => { const r = b.getBoundingClientRect();
        b.style.transform = `translate(${((e.clientX - r.left - r.width / 2) * .18).toFixed(1)}px,${((e.clientY - r.top - r.height / 2) * .3).toFixed(1)}px)`; });
      b.addEventListener('pointerleave', () => b.style.transform = '');
    });
  }
  $$('.btn').forEach(b => {
    const tn = [...b.childNodes].find(n => n.nodeType === 3 && n.textContent.trim()); if (!tn) return;
    const t = tn.textContent.trim(), r = document.createElement('span'); r.className = 'roll';
    r.innerHTML = `<span></span><span aria-hidden="true"></span>`; r.children[0].textContent = t; r.children[1].textContent = t;
    tn.replaceWith(r, document.createTextNode(' '));
  });

  /* ---------- results autoplay with progress ---------- */
  const rs = $('.rs'), rl = $('#rlist');
  if (rs && rl) {
    const addBars = () => $$('.ri', rl).forEach(r => { if (!$('.bar', r)) { const b = document.createElement('span'); b.className = 'bar'; r.appendChild(b); } });
    addBars(); new MutationObserver(addBars).observe(rl, { childList: true });
    rl.addEventListener('animationend', e => { if (e.target.classList.contains('bar') && !rs.classList.contains('paused')) { const n = $('#nx'); n && n.click(); } });
    rs.addEventListener('pointerenter', () => rs.classList.add('paused'));
    rs.addEventListener('pointerleave', () => rs.classList.remove('paused'));
    if (reduce) rs.classList.add('paused');
    new IntersectionObserver(([e]) => { if (!reduce) rs.classList.toggle('paused', !e.isIntersecting); }, { threshold: .3 }).observe(rs);
  }

  /* ---------- grain on dark surfaces ---------- */
  $$('.gcc, .cta, .foot').forEach(el => el.classList.add('grain'));

  /* ---------- marquee driven by scroll velocity ---------- */
  const mt = $('.mtrack'); let mx = 0, mBase = 38, mSpd = 38;
  if (mt) { const m = mt.parentElement; m.addEventListener('pointerenter', () => mBase = 6); m.addEventListener('pointerleave', () => mBase = 38); }

  /* ---------- the frame loop ---------- */
  const heroImg = $('.shell>img.ph'), clipEls = $$('.gcc, .cta');
  clipEls.forEach(el => el.classList.add('clipx'));
  let last = performance.now();
  function frame(now) {
    const dt = Math.min(.05, (now - last) / 1000); last = now;
    if (lenis) lenis.raf(now);
    const y = lenis ? lenis.scroll : scrollY;
    if (!lenis) { vel = y - sy; } sy = y;
    navTick(y);

    // ring
    spd += (target - spd) * Math.min(1, dt * 3);
    if (!drag) { ang += (spd + vA) * dt + (reduce ? 0 : vel * .05); vA *= Math.pow(.05, dt); }
    layoutRing();

    if (!reduce) {
      const H = vh();
      // hero depth: image drifts slower than content, content lifts and fades
      if (y < H * 1.4) {
        if (heroImg) heroImg.style.transform = `translate3d(0,${(y * .32).toFixed(1)}px,0)`;
        inner.style.transform = `translate3d(0,${(y * -.12).toFixed(1)}px,0)`;
        inner.style.opacity = clamp(1 - y / (H * .9), 0, 1).toFixed(3);
      }
      // parallax layers
      $$('.stage>img.ph, .rbig>img.ph, .cta>img.ph, .bc.photo>img.ph, .gcc>img.ph').forEach(im => {
        const r = im.parentElement.getBoundingClientRect(); if (r.bottom < -100 || r.top > H + 100) return;
        const p = (r.top + r.height / 2 - H / 2) / H, k = im.parentElement.classList.contains('gcc') ? 90 : 46;
        im.style.transform = `translate3d(0,${(p * -k).toFixed(1)}px,0)`;
      });
      $$('.stage .ui, .stage .pipe, .stage .float').forEach(l => {
        const r = l.parentElement.getBoundingClientRect(); if (r.bottom < 0 || r.top > H) return;
        const p = (r.top + r.height / 2 - H / 2) / H, k = l.classList.contains('float') ? 38 : 20;
        l.style.transform = `translate3d(0,${(p * k).toFixed(1)}px,0)`;
      });
      // dark panels expand into place
      clipEls.forEach(el => {
        const r = el.getBoundingClientRect(); if (r.top > H || r.bottom < 0) return;
        const p = clamp((H - r.top) / (H * .7), 0, 1), e = 1 - Math.pow(1 - p, 3);
        el.style.clipPath = `inset(${((1 - e) * 2.5).toFixed(2)}% ${((1 - e) * 3.5).toFixed(2)}% 0% ${((1 - e) * 3.5).toFixed(2)}% round ${(28 + (1 - e) * 24).toFixed(1)}px)`;
      });
      // marquee
      if (mt) { mSpd += (mBase + Math.min(220, Math.abs(vel) * 14) - mSpd) * Math.min(1, dt * 4); mx -= mSpd * dt;
        const half = mt.scrollWidth / 2; if (-mx > half) mx += half; mt.style.transform = `translate3d(${mx.toFixed(1)}px,0,0)`; }
    }
    if (!lenis) vel *= .9;
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
})();
