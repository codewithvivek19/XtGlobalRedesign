/* XTGlobal "Vector" brand system: generative pattern engine.
   Every pattern is derived from the chevron in the XTGlobal logo and the
   existing site motif (xtg-motif.svg). Deterministic: same input, same output. */
const XT = (() => {
  const C = {
    midnight:'#0B0922', navy:'#120F33', n800:'#1E1A5C', n700:'#2A2470', n600:'#3B34A0', n500:'#4C44B8',
    sky:'#6E4BFF', sky3:'#B7A6FF', sky1:'#ECE8FF', sky7:'#5B3DF5',
    cloud:'#F4F2FA', mist:'#E2DFEE', slate:'#5B5A7A', slate3:'#A7A3C4', white:'#FFFFFF', copper:'#FF7A3D'
  };
  /* the brand chevron, exactly as published on xtglobal.com (xtg-motif.svg, 229.2 x 382) */
  const CHEV = 'M.344 0s112.343 168.172 112.343 190.56S0 382 0 382s77.833-52.415 135.352-100.275S229.2 190.56 229.2 190.56s-36.423-41.942-93.85-89.582S.344 0 .344 0z';
  const f = n => +n.toFixed(2);
  const wrap = (w, h, body, bg, par = 'xMidYMid slice') =>
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" preserveAspectRatio="${par}" aria-hidden="true">${bg ? `<rect width="${w}" height="${h}" fill="${bg}"/>` : ''}${body}</svg>`;
  /* chevron as a path, centred at x,y, height s */
  const chev = (x, y, s, fill, op = 1, rot = 0) => {
    const k = s / 382;
    return `<path d="${CHEV}" fill="${fill}"${op < 1 ? ` opacity="${f(op)}"` : ''} transform="translate(${f(x)} ${f(y)}) rotate(${rot}) scale(${f(k * 1000) / 1000}) translate(-114.6 -191)"/>`;
  };
  /* point inside a simple chevron polygon (for halftone masks) */
  const inChev = (px, py, cx, cy, s) => {
    const u = (cx - px) / s + .3, v = Math.abs(py - cy) / s;   // u: along arrow, v: off axis
    if (v > .5) return 0;
    const back = -.3 + v * 1.2, front = .05 + v * 1.2;          // chevron arm band
    return u > back && u < front + .38 ? 1 - Math.abs((u - (back + front + .38) / 2) / ((front + .38 - back) / 2)) * .35 : 0;
  };

  /* 01 SIGNAL BURST: radial dashes, dense and bright at the core (like a signal source) */
  function burst(o = {}) {
    const w = o.w || 800, h = o.h || 800, cx = o.cx ?? w / 2, cy = o.cy ?? h / 2;
    const rings = o.rings || 11, spokes = o.spokes || 24, gap = o.gap || 34, r0 = o.r0 || 34, col = o.c || C.sky;
    let s = '';
    for (let r = 0; r < rings; r++) {
      const t = r / (rings - 1), rad = r0 + r * gap;
      const len = (o.len || 22) * Math.max(.06, 1 - t * .95), sw = (o.sw || 7) * (1 - t * .55), op = (o.op || 1) * (1 - t * .75);
      for (let i = 0; i < spokes; i++) {
        const a = (i / spokes) * Math.PI * 2 + (o.rot || 0);
        const x1 = cx + Math.cos(a) * rad, y1 = cy + Math.sin(a) * rad;
        const x2 = cx + Math.cos(a) * (rad + len), y2 = cy + Math.sin(a) * (rad + len);
        if (x2 < -20 || x2 > w + 20 || y2 < -20 || y2 > h + 20) continue;
        s += `<line x1="${f(x1)}" y1="${f(y1)}" x2="${f(x2)}" y2="${f(y2)}" stroke="${col}" stroke-width="${f(sw)}" stroke-linecap="round" opacity="${f(op)}"/>`;
      }
    }
    if (o.core !== false) s += chev(cx + 3, cy, (o.coreSize || 30), o.coreC || col);
    return wrap(w, h, s, o.bg);
  }

  /* 02 FORWARD FIELD: a grid of chevrons that grows toward the direction of travel */
  function field(o = {}) {
    const w = o.w || 800, h = o.h || 800, cols = o.cols || 14, rows = o.rows || 14, col = o.c || C.sky;
    const dx = w / cols, dy = h / rows; let s = '';
    for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) {
      const t = i / (cols - 1), wave = .5 + .5 * Math.sin((j / rows) * Math.PI);
      const sz = dy * (.12 + .62 * Math.pow(t, 1.4) * (.55 + .45 * wave));
      s += chev(dx * (i + .5), dy * (j + .5), sz, col, .18 + .82 * t);
    }
    return wrap(w, h, s, o.bg);
  }

  /* 03 THROUGHPUT: rows of vertical bars whose weight swells across the frame */
  function bars(o = {}) {
    const w = o.w || 800, h = o.h || 800, rows = o.rows || 10, n = o.n || 26, col = o.c || C.sky;
    const rh = h / rows, gx = w / n; let s = '';
    for (let j = 0; j < rows; j++) {
      const thick = j % 2 === 0;
      for (let i = 0; i < n; i++) {
        const t = i / (n - 1);
        const bw = thick ? 1.5 + t * gx * .72 : 1 + (1 - t) * gx * .22;
        s += `<rect x="${f(i * gx + (gx - bw) / 2)}" y="${f(j * rh + rh * .1)}" width="${f(bw)}" height="${f(rh * .8)}" rx="${f(Math.min(bw / 2, 2))}" fill="${col}" opacity="${thick ? 1 : .55}"/>`;
      }
    }
    return wrap(w, h, s, o.bg);
  }

  /* 04 RAMP: stepped horizontal rules, long to short, like a launch countdown */
  function ramp(o = {}) {
    const w = o.w || 800, h = o.h || 800, n = o.n || 34, col = o.c || C.sky;
    const g = h / n; let s = '';
    for (let i = 0; i < n; i++) {
      const t = i / (n - 1), thick = i % 2 === 0;
      const len = w * (1 - t * .68) * (thick ? 1 : .86);
      s += `<rect x="0" y="${f(i * g)}" width="${f(len)}" height="${f(thick ? g * .52 : g * .14)}" rx="1" fill="${col}" opacity="${thick ? 1 : .6}"/>`;
    }
    return wrap(w, h, s, o.bg);
  }

  /* 05 HALFTONE CHEVRON: a dot screen that resolves into the brand chevron */
  function halftone(o = {}) {
    const w = o.w || 800, h = o.h || 800, step = o.step || 22, col = o.c || C.sky;
    const cx = o.cx ?? w * .5, cy = o.cy ?? h * .5, sz = o.size || Math.min(w, h) * .9;
    let s = '';
    for (let y = step / 2; y < h; y += step) for (let x = step / 2; x < w; x += step) {
      const m = inChev(x, y, cx, cy, sz);
      const d = Math.hypot(x - cx, y - cy) / Math.hypot(w, h);
      const r = m ? step * (.24 + .24 * m) : step * Math.max(.05, .16 - d * .22);
      s += `<circle cx="${f(x)}" cy="${f(y)}" r="${f(r)}" fill="${col}" opacity="${m ? 1 : .42}"/>`;
    }
    return wrap(w, h, s, o.bg);
  }

  /* 06 SUPERGRAPHIC: the chevron at architectural scale, cropped by the frame */
  function supergraphic(o = {}) {
    const w = o.w || 800, h = o.h || 800, col = o.c || C.sky, col2 = o.c2 || C.n700;
    const sz = o.size || h * 1.15, n = o.n || 3; let sp = o.spacing ?? w * .42; if (sp <= 1.5) sp *= w;
    let s = '';
    for (let i = 0; i < n; i++) {
      const last = i === n - 1;
      s += chev(w * (o.x0 ?? -.12) + i * sp, h * (o.y ?? .5), sz, last ? col : col2, last ? 1 : .5 + i * .22);
    }
    return wrap(w, h, s, o.bg);
  }

  /* 07 SLIPSTREAM: parallelogram slats taken from one chevron arm, thinning as they fall */
  function slip(o = {}) {
    const w = o.w || 800, h = o.h || 800, rows = o.rows || 9, cols = o.cols || 5, col = o.c || C.sky;
    const cw = w / cols, rh = h / rows; let s = '';
    for (let j = 0; j < rows; j++) {
      const t = j / (rows - 1), bw = Math.max(3, cw * .44 * (1 - t * .86));
      for (let i = -1; i < cols; i++) {
        const x = i * cw + cw * .3, y = j * rh;
        s += `<path d="M${f(x)} ${f(y)}h${f(bw)}l${f(cw * .56)} ${f(rh * .92)}h${f(-bw)}z" fill="${col}"/>`;
      }
    }
    return wrap(w, h, s, o.bg);
  }

  /* 08 ORBIT LINES: concentric arcs for diagrams (delivery arc, campus, timelines) */
  function arcs(o = {}) {
    const w = o.w || 800, h = o.h || 800, n = o.n || 9, col = o.c || C.sky; let s = '';
    for (let i = 0; i < n; i++) {
      const r = (i + 1) * (o.gap || 60);
      s += `<circle cx="${o.cx ?? w / 2}" cy="${o.cy ?? h}" r="${r}" fill="none" stroke="${col}" stroke-width="${i % 3 === 2 ? 1 : 1.6}" opacity="${f(.85 - i * .06)}"${i % 3 === 2 ? ' stroke-dasharray="2 6"' : ''}/>`;
    }
    return wrap(w, h, s, o.bg);
  }

  /* "Vector": the brand guide avatar. Two chevrons from the brand motif inside a ring. */
  function avatar(state = 'idle', size = 44) {
    /* "Vector" v2: two brand chevrons inside an orbit. The violet outline is what
       XTGlobal knows, the copper chevron is the answer moving toward you, and the
       copper signal arc on the orbit shows what the guide is doing right now. */
    const back = chev(27, 32, 30, 'none').replace('<path ', `<path stroke="${C.sky}" stroke-width="1.8" vector-effect="non-scaling-stroke" stroke-linejoin="round" `);
    return `<svg class="vx" data-state="${state}" viewBox="0 0 64 64" width="${size}" height="${size}" aria-hidden="true">`
      + `<circle class="vx-track" cx="32" cy="32" r="29" fill="none" stroke="currentColor" stroke-width="1.2" opacity=".18"/>`
      + `<circle class="vx-arc" cx="32" cy="32" r="29" fill="none" stroke="${C.copper}" stroke-width="2.4" stroke-linecap="round" pathLength="100" stroke-dasharray="20 80"/>`
      + `<circle class="vx-dot" cx="32" cy="3" r="2.2" fill="${C.copper}"/>`
      + `<g class="vx-back">${back}</g><g class="vx-front">${chev(37, 32, 30, C.copper)}</g></svg>`;
  }

  return { C, CHEV, chev, wrap, burst, field, bars, ramp, halftone, supergraphic, slip, arcs, avatar };
})();
if (typeof module !== 'undefined') module.exports = XT;
