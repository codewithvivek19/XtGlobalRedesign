/* GCC-as-a-Service interior template. Pure DOM, respects reduced motion. Needs build/xt.js and KB. */
(() => {
const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const store = { get: k => { try { return JSON.parse(localStorage.getItem(k)); } catch (e) { return null; } }, set: (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} } };

/* ---------- shared chrome ---------- */
$$('[data-pat]').forEach(el => { const fn = XT[el.dataset.pat]; if (!fn) return; let o = {}; try { o = JSON.parse(el.dataset.o || '{}'); } catch (e) {}
  const W = o.w || 800, H = o.h || 800; ['cx', 'cy'].forEach(k => { if (o[k] != null && o[k] <= 1.5) o[k] = o[k] * (k === 'cx' ? W : H); }); el.innerHTML = fn(o); });
$$('[data-vx]').forEach(el => el.innerHTML = XT.avatar('idle', +el.dataset.size || 44));
const setVx = s => $$('.vx').forEach(v => v.dataset.state = s);
const nav = $('.nav'), mn = $('#mnav'), bg = $('#burger');
if (bg) bg.onclick = () => { const o = mn.classList.toggle('open'); bg.setAttribute('aria-expanded', o); };
$$('#mnav a').forEach(a => a.onclick = () => { mn.classList.remove('open'); bg && bg.setAttribute('aria-expanded', false); });
let lastY = 0;
const onScroll = () => { const y = scrollY; nav.classList.toggle('solid', y > 60);
  if (y > lastY + 4 && y > 500 && !mn.classList.contains('open')) nav.classList.add('hide'); else if (y < lastY - 4 || y < 500) nav.classList.remove('hide'); lastY = y; };
addEventListener('scroll', onScroll, { passive: true }); onScroll();
const IO = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); IO.unobserve(e.target); } }), { threshold: .12 });
$$('.rv').forEach(el => IO.observe(el));

/* ---------- Vector assistant (same pattern as the homepage) ---------- */
const log = $('#log'), A = $('#asst'); let lf;
function openA(q) { lf = document.activeElement; A.classList.add('open'); A.setAttribute('aria-hidden', 'false'); $('#scrim').classList.add('open'); $('#dock').classList.remove('show');
  if (!log.children.length) say('Ask me anything about GCC-as-a-Service. I answer only from XTGlobal pages and show where each answer came from.', []);
  setTimeout(() => $('#aq').focus(), 80); if (q) ask(q); }
function closeA() { A.classList.remove('open'); A.setAttribute('aria-hidden', 'true'); $('#scrim').classList.remove('open'); setVx('idle'); lf && lf.focus(); }
function say(t, c) { const m = document.createElement('div'); m.className = 'msg a'; m.innerHTML = '<span class="tg">Vector · machine generated</span><span class="tx"></span>'; log.appendChild(m);
  const tx = $('.tx', m), w = t.split(' '); let i = 0;
  const done = () => { tx.textContent = t; if (c.length) { const d = document.createElement('div'); d.className = 'cites'; d.innerHTML = c.map((s, n) => `<a class="cite" href="#"><i>${n + 1}</i>${s}</a>`).join(''); m.appendChild(d); } setVx('idle'); $('#ast').textContent = 'Ready'; log.scrollTop = log.scrollHeight; };
  if (reduce) return done(); setVx('speaking'); $('#ast').textContent = 'Answering';
  const iv = setInterval(() => { tx.textContent = w.slice(0, ++i).join(' '); log.scrollTop = log.scrollHeight; if (i >= w.length) { clearInterval(iv); done(); } }, 26); }
function ask(q) { const u = document.createElement('div'); u.className = 'msg u'; u.textContent = q; log.appendChild(u);
  const sk = document.createElement('div'); sk.className = 'msg a'; sk.innerHTML = '<div class="skel"><i></i><i></i><i></i></div>'; log.appendChild(sk); log.scrollTop = log.scrollHeight; setVx('thinking'); $('#ast').textContent = 'Reading XTGlobal pages';
  const l = q.toLowerCase(), h = KB.find(e => e.k.some(k => l.includes(k)));
  setTimeout(() => { sk.remove(); h ? say(h.a, h.c) : say('I do not have a sourced answer for that on XTGlobal pages, and I will not guess. A solution lead can answer it directly.', []); }, reduce ? 0 : 750); }
$$('[data-ask]').forEach(b => b.onclick = () => openA());
$('#aform').onsubmit = e => { e.preventDefault(); const v = $('#aq').value.trim(); if (v) { ask(v); $('#aq').value = ''; } };
$('#ax').onclick = closeA; $('#scrim').onclick = closeA;
addEventListener('keydown', e => { if (e.key === 'Escape' && A.classList.contains('open')) closeA(); });
$('#human').onclick = () => { closeA(); location.href = 'index.html#contact'; };
let dismissed = false; $('#dockx').onclick = () => { dismissed = true; $('#dock').classList.remove('show'); };
new IntersectionObserver(([e]) => { if (!dismissed && !A.classList.contains('open')) $('#dock').classList.toggle('show', !e.isIntersecting); }).observe($('.gx-hero'));

/* hero bar */
(() => { const Q = ['How does the 6 to 8 week launch work?', 'How do the three pod models differ?', 'Where are your delivery centers?', 'What security certifications do you hold?'], el = $('#vq'); if (!el) return;
  $$('[data-askq]').forEach(b => b.onclick = () => openA(el.textContent)); if (reduce) return; let qi = 0;
  const type = (t, cb) => { let i = 0; const iv = setInterval(() => { el.textContent = t.slice(0, ++i); if (i >= t.length) { clearInterval(iv); cb && cb(); } }, 38); };
  const erase = cb => { let t = el.textContent; const iv = setInterval(() => { t = t.slice(0, -1); el.textContent = t; if (!t.length) { clearInterval(iv); cb && cb(); } }, 18); };
  const loop = () => setTimeout(() => erase(() => { qi = (qi + 1) % Q.length; type(Q[qi], loop); }), 2600); loop(); })();

/* ---------- team mix, shared by the story, the models and the configurator ---------- */
const MIX = {
  innovation: [['Product Engineers', .5, '#6E4BFF'], ['Data & AI', .25, '#120F33'], ['Quality Engineering', .15, '#A7A3C4'], ['Pod Lead & Architect', .1, '#FF7A3D']],
  operational: [['Application Support', .45, '#6E4BFF'], ['Infrastructure & SRE', .25, '#120F33'], ['Service Desk', .2, '#A7A3C4'], ['Delivery Lead', .1, '#FF7A3D']],
  hybrid: [['Product Engineers', .35, '#6E4BFF'], ['Run & Support', .3, '#120F33'], ['Data & Quality', .25, '#A7A3C4'], ['Pod Lead & Architect', .1, '#FF7A3D']] };
$$('.mix').forEach(el => { const m = MIX[el.dataset.mix];
  el.innerHTML = m.map(r => `<i style="flex:${r[1]};background:${r[2]}"></i>`).join('');
  const leg = document.createElement('div'); leg.className = 'mix-leg'; leg.innerHTML = m.map(r => `<span>${r[0]}<b>${Math.round(r[1] * 100)}%</b></span>`).join(''); el.after(leg); });

/* ---------- scroll story: the diagram builds as each step reaches the middle of the screen ---------- */
(() => { const fig = $('#fig'), seats = $('#seats'), bar = $('#figbar'), wk = $('#figw'); if (!fig) return;
  const cols = ['#6E4BFF', '#120F33', '#A7A3C4', '#FF7A3D'], mix = MIX.hybrid; let k = 0, out = '';
  mix.forEach((m, mi) => { const n = Math.round(24 * m[1]); for (let j = 0; j < n && k < 24; j++, k++) { const x = 96 + (k % 8) * 32, y = 168 + Math.floor(k / 8) * 34; out += `<circle cx="${x}" cy="${y}" r="9" fill="${cols[mi]}" style="transition-delay:${k * 25}ms"/>`; } });
  seats.innerHTML = out;
  const W = { 1: ['Weeks 1–2', 25], 2: ['Weeks 2–6', 75], 3: ['Weeks 6–8', 100], 4: ['Running', 100] };
  const go = n => { fig.dataset.step = n; wk.textContent = W[n][0]; bar.style.width = W[n][1] + '%'; $$('.step').forEach(s => s.classList.toggle('on', +s.dataset.step === n)); };
  const steps = $$('.step'); go(1);
  const so = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) go(+e.target.dataset.step); }), { rootMargin: '-45% 0px -45% 0px' });
  steps.forEach(s => so.observe(s));
})();

/* ---------- campus hotspots ---------- */
(() => { const plan = $('.plan'); if (!plan) return;
  const H = [
    ['Separate Room', 'Your pod works in its own badge-controlled room. Only your team and named XTGlobal support staff have access.'],
    ['Separate Network', 'Your room runs on its own network segment with its own controls, kept apart from every other client on the campus.'],
    ['Dedicated Support Layer', 'Named IT, facilities and HR contacts look after your pod, so issues route to people who already know your team.'],
    ['Security Operations', 'The campus is monitored under ISO 27001 and SSAE 18 controls, with evidence available for your audits.'] ];
  // a few seats per room so the plan reads as occupied
  let d = ''; [[60, 'a'], [280, 'b'], [500, 'c']].forEach(([x0, c]) => { for (let i = 0; i < 15; i++) d += `<circle cx="${x0 + 22 + (i % 5) * 34}" cy="${110 + Math.floor(i / 5) * 32}" r="8" class="${c === 'c' ? 'mine' : ''}"/>`; });
  $('#planSeats').innerHTML = d;
  const pick = i => { plan.dataset.h = i; $('#hk').textContent = `0${i + 1} / 04`; $('#ht').textContent = H[i][0]; $('#hp').textContent = H[i][1];
    $$('.hot, .hlist button').forEach(b => b.setAttribute('aria-pressed', +b.dataset.h === i)); };
  $$('.hot, .hlist button').forEach(b => { b.onclick = () => pick(+b.dataset.h); b.onmouseenter = () => matchMedia('(hover:hover)').matches && pick(+b.dataset.h); });
  pick(0); })();

/* ---------- configurator ---------- */
const st = { pod: 'hybrid', size: 24, loc: 'Visakhapatnam' };
const fill = r => r.style.setProperty('--p', ((r.value - r.min) / (r.max - r.min) * 100) + '%');
function cfg() { const wk = st.size <= 16 ? 6 : st.size <= 36 ? 7 : 8; $('#wk').textContent = wk; $('#size-o').textContent = st.size + ' people'; $('#podname').textContent = st.pod + ' pod';
  const P = [[0, 2], [1.5, wk - 1.5], [wk - 2, wk]]; $$('#lanes .bar').forEach((b, i) => { b.style.left = P[i][0] / 8 * 100 + '%'; b.style.width = (P[i][1] - P[i][0]) / 8 * 100 + '%'; });
  let left = st.size; const rows = MIX[st.pod].map((m, i, a) => { const n = i === a.length - 1 ? left : Math.max(1, Math.round(st.size * m[1])); if (i < a.length - 1) left -= n; return [m[0], n, m[2]]; });
  $('#dots').innerHTML = rows.map(r => Array.from({ length: r[1] }, (_, j) => `<i style="--c:${r[2]};animation-delay:${j * 8}ms"></i>`).join('')).join('');
  $('#leg').innerHTML = rows.map(r => `<div><span><i style="--c:${r[2]}"></i>${r[0]}</span><b style="font-weight:500">${r[1]}</b></div>`).join('') + `<div style="border:0"><span class="dim">Campus</span><b style="font-weight:500">${st.loc}</b></div>`;
  st.wk = wk; st.rows = rows; fill($('#size')); }
$$('.pod').forEach(b => b.onclick = () => { st.pod = b.dataset.pod; $$('.pod').forEach(x => x.setAttribute('aria-pressed', x === b)); cfg(); });
$('#size').oninput = e => { st.size = +e.target.value; cfg(); };
$$('#loc button').forEach(b => b.onclick = () => { st.loc = b.dataset.loc; $$('#loc button').forEach(x => x.setAttribute('aria-pressed', x === b)); cfg(); });
cfg();

/* ---------- engagement builder with progressive profiling ----------
   First visit: name and email. Returning visitor: greeted by name and asked for one new field. */
const pp = $('#pp'), ppf = $('#ppf');
const prof = () => store.get('xtg-profile') || {};
function openPP() { const p = prof(); pp.hidden = false;
  const known = p.name && p.email;
  $('[data-f="name"]', ppf).hidden = !!known; $('[data-f="email"]', ppf).hidden = !!known; $('[data-f="company"]', ppf).hidden = !known || !!p.company;
  $('#pph').textContent = known ? `Welcome Back, ${p.name.split(' ')[0]}` : 'Where Should We Send It?';
  $('#pps').textContent = known ? (p.company ? 'Everything we need is saved. Download again any time.' : 'One new detail this time, then your summary downloads.') : 'Two fields. Next time we will only ask for one new detail.';
  pp.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'center' }); }
$('#dl').onclick = openPP;
ppf.onsubmit = e => { e.preventDefault(); const p = prof(), err = $('#pperr');
  if (!(p.name && p.email)) { const n = $('#pn').value.trim(), m = $('#pe').value.trim();
    if (n.length < 2 || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(m)) { err.hidden = false; return; } p.name = n; p.email = m; }
  else if (!p.company && $('#pc').value.trim()) p.company = $('#pc').value.trim();
  err.hidden = true; store.set('xtg-profile', p); download(p); openPP(); };
function download(p) { const nm = st.pod[0].toUpperCase() + st.pod.slice(1);
  const html = `<!doctype html><meta charset="utf-8"><title>XTGlobal GCC Pod Summary</title><style>body{font:16px/1.5 system-ui,sans-serif;color:#120F33;max-width:720px;margin:48px auto;padding:0 24px}h1{font-size:36px;letter-spacing:-.04em;margin:8px 0}small{font-size:14px;font-weight:500;color:#5B5A7A}table{width:100%;border-collapse:collapse;margin:24px 0}td{padding:12px 0;border-bottom:1px solid #E2DFEE}td:last-child{text-align:right;font-weight:600}.k{font-size:72px;letter-spacing:-.06em;font-weight:500;margin:0;color:#6E4BFF}</style><small>XTGlobal, GCC-as-a-Service, indicative summary prepared for ${p.name}${p.company ? ', ' + p.company : ''}</small><h1>${nm} Pod, ${st.size} People</h1><p>Campus: ${st.loc}</p><p class="k">${st.wk} weeks</p><p>Indicative launch</p><table>${st.rows.map(r => `<tr><td>${r[0]}</td><td>${r[1]}</td></tr>`).join('')}</table><p>Blueprint weeks 1 to 2, Hire and Build weeks 2 to ${st.wk - 1}, Go Live weeks ${st.wk - 1} to ${st.wk}.</p><p>We build the team, run the infrastructure, and hand you the controls. Indicative only, not a quote.</p><p>+1 972.755.1800 | info@xtglobal.com</p>`;
  const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([html], { type: 'text/html' })); a.download = 'XTGlobal-GCC-Pod-Summary.html'; a.click(); }
})();
