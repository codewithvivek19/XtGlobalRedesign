/* XTGlobal hero globe: a real-time WebGL point-cloud Earth with light arcs
   between the three campuses and the regions XTGlobal serves.
   Three.js r160 + world-atlas land outlines. Falls back to the CSS light
   field if WebGL or the network is unavailable. */
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';

const canvas = document.getElementById('globe');
const hero = document.querySelector('.shell');
if (canvas && hero) init().catch(err => { console.warn('[globe]', err); hero.classList.add('globe-off'); });

async function init() {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const small = () => innerWidth < 860;

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
  } catch (e) { hero.classList.add('globe-off'); return; }
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100);
  camera.position.set(0, 0, 6.2);

  const world = new THREE.Group();   // positioned on screen
  const tilt = new THREE.Group();    // pointer + axial tilt
  const spin = new THREE.Group();    // daily rotation
  world.add(tilt); tilt.add(spin); scene.add(world);

  /* ---------- land mask: rasterise world-atlas land into an equirectangular bitmap ---------- */
  const W = 1024, H = 512;
  const mask = await landMask(W, H);
  const isLand = (lat, lon) => {
    if (!mask) return true;
    const x = Math.min(W - 1, Math.max(0, Math.floor((lon + 180) / 360 * W)));
    const y = Math.min(H - 1, Math.max(0, Math.floor((90 - lat) / 180 * H)));
    return mask[(y * W + x) * 4 + 3] > 120;
  };

  /* ---------- dots: fibonacci sphere, land kept bright, ocean kept as faint dust ---------- */
  const N = small() ? 42000 : 90000;
  const pos = [], seed = [], kind = [];
  const ga = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < N; i++) {
    const y = 1 - (i / (N - 1)) * 2, r = Math.sqrt(1 - y * y), th = ga * i;
    const x = Math.cos(th) * r, z = Math.sin(th) * r;
    const lat = Math.asin(y) * 180 / Math.PI;
    let lon = Math.atan2(z, -x) * 180 / Math.PI - 180; if (lon < -180) lon += 360;
    const land = isLand(lat, lon);
    if (!land && i % 7) continue;               // sparse ocean grid
    pos.push(x, y, z); seed.push(Math.random()); kind.push(land ? 1 : 0);
  }
  const dg = new THREE.BufferGeometry();
  dg.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  dg.setAttribute('seed', new THREE.Float32BufferAttribute(seed, 1));
  dg.setAttribute('land', new THREE.Float32BufferAttribute(kind, 1));
  const dotMat = new THREE.ShaderMaterial({
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    uniforms: { uTime: { value: 0 }, uReveal: { value: reduce ? 1 : 0 }, uSize: { value: 1 }, uLight: { value: new THREE.Vector3(.7, .55, .6).normalize() } },
    vertexShader: /* glsl */`
      attribute float seed; attribute float land;
      uniform float uTime, uReveal, uSize; uniform vec3 uLight;
      varying float vA; varying vec3 vC;
      void main(){
        vec3 n = normalize(position);
        vec4 mv = modelViewMatrix * vec4(position * 1.001, 1.0);
        vec3 wn = normalize(mat3(modelMatrix) * n);
        float facing = dot(normalize(mat3(viewMatrix) * wn), vec3(0.,0.,1.));
        float lit = clamp(dot(wn, uLight) * .5 + .62, 0., 1.);
        // reveal sweeps from the north pole down, with per-dot jitter
        float band = 1. - (n.y * .5 + .5);
        float rv = smoothstep(band * .85 + seed * .15, band * .85 + seed * .15 + .08, uReveal);
        float tw = .78 + .22 * sin(uTime * 1.6 + seed * 40.);
        vA = rv * smoothstep(-.05, .3, facing) * mix(.16, 1., land) * mix(1., tw, land) * mix(1., 1.35, land);
        vec3 cyan = vec3(.36,.85,1.), indigo = vec3(.42,.42,1.), ice = vec3(.86,.96,1.);
        vC = mix(indigo, cyan, smoothstep(-.2, .9, wn.x * .6 + wn.y * .5));
        vC = mix(vC, ice, pow(lit, 4.) * .6 * land) * mix(.5, 1.15, lit);
        gl_PointSize = uSize * mix(1.7, 3.0, land) * (6.2 / -mv.z);
        gl_Position = projectionMatrix * mv;
      }`,
    fragmentShader: /* glsl */`
      varying float vA; varying vec3 vC;
      void main(){
        vec2 c = gl_PointCoord - .5; float d = length(c);
        float a = smoothstep(.5, .18, d) * vA;
        if (a < .01) discard;
        gl_FragColor = vec4(vC * a, a);
      }`,
  });
  spin.add(new THREE.Points(dg, dotMat));

  /* ---------- core: occludes the far side, carries a soft fresnel rim ---------- */
  const core = new THREE.Mesh(new THREE.SphereGeometry(.992, 96, 96), new THREE.ShaderMaterial({
    uniforms: { uReveal: dotMat.uniforms.uReveal },
    vertexShader: `varying vec3 vN; varying vec3 vW; void main(){ vN = normalize(normalMatrix * normal); vW = normalize(mat3(modelMatrix)*normal); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.); }`,
    fragmentShader: `uniform float uReveal; varying vec3 vN; varying vec3 vW;
      void main(){ float f = pow(1. - max(dot(vN, vec3(0.,0.,1.)), 0.), 2.4);
        vec3 base = mix(vec3(.012,.018,.05), vec3(.035,.05,.14), clamp(vW.y*.5+.5,0.,1.));
        vec3 col = base + vec3(.18,.22,.75) * f * .55;
        gl_FragColor = vec4(col, smoothstep(0., .4, uReveal)); }`,
    transparent: true,
  }));
  spin.add(core);

  /* ---------- atmosphere: additive back-face halo ---------- */
  const atmo = new THREE.Mesh(new THREE.SphereGeometry(1.14, 64, 64), new THREE.ShaderMaterial({
    side: THREE.BackSide, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    uniforms: { uReveal: dotMat.uniforms.uReveal },
    vertexShader: `varying vec3 vN; void main(){ vN = normalize(normalMatrix * normal); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.); }`,
    fragmentShader: `uniform float uReveal; varying vec3 vN;
      void main(){ float i = pow(clamp(.62 - dot(vN, vec3(0.,0.,1.)), 0., 1.), 4.2);
        vec3 c = mix(vec3(.38,.36,1.), vec3(.3,.85,1.), clamp(vN.y*.5+.6,0.,1.));
        gl_FragColor = vec4(c * i * 1.1 * uReveal, i * uReveal); }`,
  }));
  tilt.add(atmo);

  /* ---------- places + arcs ---------- */
  const P = {
    plano: [33.0198, -96.6989], hyd: [17.385, 78.4867], viz: [17.6868, 83.2185],
    london: [51.5072, -0.1276], sydney: [-33.8688, 151.2093], ny: [40.7128, -74.006], frankfurt: [50.1109, 8.6821],
  };
  const v3 = ([lat, lon], r = 1) => {
    const phi = (90 - lat) * Math.PI / 180, th = (lon + 180) * Math.PI / 180;
    return new THREE.Vector3(-Math.sin(phi) * Math.cos(th), Math.cos(phi), Math.sin(phi) * Math.sin(th)).multiplyScalar(r);
  };
  const ROUTES = [
    ['plano', 'hyd', 0xff8a4c, 1.0, 0],      // the spine of the company: copper
    ['plano', 'viz', 0x4fd2ff, .9, .35],
    ['hyd', 'viz', 0x4fd2ff, .7, .1],
    ['viz', 'sydney', 0x7b7bff, .8, .55],
    ['hyd', 'london', 0x7b7bff, .8, .75],
    ['plano', 'ny', 0x4fd2ff, .6, .2],
    ['london', 'frankfurt', 0x4fd2ff, .5, .9],
    ['ny', 'london', 0x7b7bff, .7, .45],
  ];
  const arcMats = [];
  ROUTES.forEach(([a, b, color, speed, off]) => {
    const A = v3(P[a]), B = v3(P[b]), ang = A.angleTo(B);
    const lift = .04 + ang * .11, pts = [];
    for (let i = 0; i <= 96; i++) {
      const t = i / 96, p = slerp(A, B, t);
      pts.push(p.multiplyScalar(1 + Math.sin(Math.PI * t) * lift));
    }
    const curve = new THREE.CatmullRomCurve3(pts);
    const mat = new THREE.ShaderMaterial({
      transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
      uniforms: { uTime: { value: 0 }, uColor: { value: new THREE.Color(color) }, uSpeed: { value: speed }, uOff: { value: off }, uGrow: { value: reduce ? 1 : 0 } },
      vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.); }`,
      fragmentShader: `uniform float uTime, uSpeed, uOff, uGrow; uniform vec3 uColor; varying vec2 vUv;
        void main(){
          float x = vUv.x; if (x > uGrow) discard;
          float head = fract(uTime * .16 * uSpeed + uOff);
          float d = head - x; if (d < 0.) d += 1.;
          float pulse = exp(-d * 7.) * step(0., d);
          float base = .26 + .18 * sin(x * 3.14159);
          float a = base + pulse * 1.8;
          gl_FragColor = vec4(uColor * a, a);
        }`,
    });
    arcMats.push(mat);
    spin.add(new THREE.Mesh(new THREE.TubeGeometry(curve, 160, .0055, 6, false), mat));
  });

  /* markers: bright core + expanding ring, oriented to the surface */
  const ringMats = [];
  Object.entries(P).forEach(([k, ll]) => {
    const campus = k === 'plano' || k === 'hyd' || k === 'viz';
    const n = v3(ll), g = new THREE.Group();
    g.position.copy(n.clone().multiplyScalar(1.003));
    g.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), n);
    const col = new THREE.Color(k === 'plano' ? 0xff8a4c : campus ? 0x6fe0ff : 0x9a9aff);
    g.add(new THREE.Mesh(new THREE.CircleGeometry(campus ? .014 : .009, 24), new THREE.MeshBasicMaterial({ color: col, transparent: true, blending: THREE.AdditiveBlending })));
    if (campus) {
      const m = new THREE.ShaderMaterial({
        transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide,
        uniforms: { uTime: { value: 0 }, uColor: { value: col }, uOff: { value: Math.random() } },
        vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.); }`,
        fragmentShader: `uniform float uTime, uOff; uniform vec3 uColor; varying vec2 vUv;
          void main(){ float r = length(vUv - .5) * 2.; float t = fract(uTime * .45 + uOff);
            float ring = smoothstep(.06, 0., abs(r - t)) * (1. - t);
            float a = ring * .9; if (a < .01) discard; gl_FragColor = vec4(uColor * a, a); }`,
      });
      ringMats.push(m);
      g.add(new THREE.Mesh(new THREE.PlaneGeometry(.16, .16), m));
    }
    spin.add(g);
  });

  /* ---------- HTML labels that ride the globe ---------- */
  const labels = [...document.querySelectorAll('#glabels .gl')].map(el => ({ el, v: v3(P[el.dataset.city], 1.02) }));

  /* ---------- layout ---------- */
  let gx = 0, gy = 0, gs = 1;
  function resize() {
    const r = hero.getBoundingClientRect(), w = r.width, h = r.height;
    renderer.setSize(w, h, false);
    camera.aspect = w / h; camera.updateProjectionMatrix();
    // place the globe in world units: right half on desktop, lower centre on phones
    const vH = 2 * Math.tan(camera.fov * Math.PI / 360) * camera.position.z, vW = vH * camera.aspect;
    if (small()) { gs = Math.min(vW * .5, vH * .3); gx = vW * .08; gy = -vH * .3; }
    else { gs = Math.min(vH * .33, vW * .21); gx = vW * .235; gy = -vH * .02; }
    world.position.set(gx, gy, 0); world.scale.setScalar(gs);
    dotMat.uniforms.uSize.value = renderer.getPixelRatio() * (small() ? .95 : 1.05) * Math.max(.75, Math.min(1.25, gs / 1.3));
  }
  new ResizeObserver(resize).observe(hero); resize();

  /* ---------- interaction: drag with inertia, pointer parallax, scroll drift ---------- */
  const AXIAL = .42;                                     // look a little from the north so trans-polar arcs read
  spin.rotation.y = -1.9; tilt.rotation.x = AXIAL;
  let vel = reduce ? 0 : .055, drag = null, px = 0, py = 0, tx = 0, ty = 0;
  const auto = reduce ? 0 : .055;
  canvas.style.touchAction = 'pan-y';
  hero.addEventListener('pointerdown', e => {
    if (e.target.closest('a,button,input,nav')) return;
    if (!hitGlobe(e)) return;
    drag = { x: e.clientX, r: spin.rotation.y, t: performance.now() }; hero.classList.add('dragging');
  });
  addEventListener('pointermove', e => {
    if (fine) { px = (e.clientX / innerWidth - .5); py = (e.clientY / innerHeight - .5); }
    if (!drag) { hero.classList.toggle('over-globe', fine && hitGlobe(e)); return; }
    const now = performance.now(), dx = e.clientX - drag.x;
    const nr = drag.r + dx * .006; vel = (nr - spin.rotation.y) / Math.max(.008, (now - drag.t) / 1000); drag.t = now;
    spin.rotation.y = nr; drag.x = e.clientX; drag.r = nr;
  });
  addEventListener('pointerup', () => { if (drag) { drag = null; hero.classList.remove('dragging'); vel = Math.max(-2, Math.min(2, vel)); } });
  const ndc = new THREE.Vector2(), ray = new THREE.Raycaster();
  function hitGlobe(e) {
    const r = canvas.getBoundingClientRect();
    ndc.set((e.clientX - r.left) / r.width * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
    ray.setFromCamera(ndc, camera);
    return ray.intersectObject(core, false).length > 0;
  }

  /* ---------- loop (paused off-screen and in background tabs) ---------- */
  let visible = true, t0 = performance.now(), last = t0, reveal = reduce ? 1 : 0;
  new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible) requestAnimationFrame(loop); }, { threshold: 0 }).observe(hero);
  document.addEventListener('visibilitychange', () => { if (!document.hidden) { last = performance.now(); requestAnimationFrame(loop); } });
  hero.classList.add('globe-on');

  const tmp = new THREE.Vector3(), camDir = new THREE.Vector3();
  function loop(now) {
    if (!visible || document.hidden) return;
    const dt = Math.min(.05, (now - last) / 1000); last = now;
    const t = (now - t0) / 1000;
    if (!reduce) {
      reveal = Math.min(1, reveal + dt / 2.6);
      const e = 1 - Math.pow(1 - reveal, 3);
      dotMat.uniforms.uReveal.value = e;
      arcMats.forEach((m, i) => m.uniforms.uGrow.value = Math.min(1, Math.max(0, (e - .45 - i * .04) / .4)));
      if (!drag) { vel += (auto - vel) * Math.min(1, dt * 1.2); spin.rotation.y += vel * dt; }
      tx += (px - tx) * Math.min(1, dt * 3); ty += (py - ty) * Math.min(1, dt * 3);
      tilt.rotation.x = AXIAL + ty * .18; tilt.rotation.z = -tx * .08;
      const sy = scrollY, H = innerHeight;
      world.position.y = gy + Math.min(sy, H) / H * gs * .55;
      world.rotation.y = Math.min(sy, H) / H * .35;
    }
    dotMat.uniforms.uTime.value = t;
    arcMats.forEach(m => m.uniforms.uTime.value = t);
    ringMats.forEach(m => m.uniforms.uTime.value = t);
    renderer.render(scene, camera);

    // labels
    const r = canvas.getBoundingClientRect();
    camera.getWorldDirection(camDir);
    labels.forEach(L => {
      tmp.copy(L.v); spin.localToWorld(tmp);
      const n = tmp.clone().sub(world.getWorldPosition(new THREE.Vector3())).normalize();
      const face = -n.dot(camDir);
      tmp.project(camera);
      const x = (tmp.x * .5 + .5) * r.width, y = (-tmp.y * .5 + .5) * r.height;
      const o = Math.max(0, Math.min(1, (face - .18) / .22)) * Math.max(0, Math.min(1, (reveal - .7) / .3));
      L.el.style.transform = `translate3d(${x.toFixed(1)}px,${y.toFixed(1)}px,0)`;
      L.el.style.opacity = o.toFixed(3);
    });
    if (!reduce) requestAnimationFrame(loop);
  }
  if (reduce) { renderer.render(scene, camera); loop(performance.now()); }
  else requestAnimationFrame(loop);
}

function slerp(a, b, t) {
  const ang = a.angleTo(b), s = Math.sin(ang);
  if (s < 1e-6) return a.clone();
  return a.clone().multiplyScalar(Math.sin((1 - t) * ang) / s).add(b.clone().multiplyScalar(Math.sin(t * ang) / s));
}

async function landMask(W, H) {
  try {
    const [{ feature }, { geoEquirectangular, geoPath }, topo] = await Promise.all([
      import('https://cdn.jsdelivr.net/npm/topojson-client@3.1.0/+esm'),
      import('https://cdn.jsdelivr.net/npm/d3-geo@3.1.1/+esm'),
      fetch('https://cdn.jsdelivr.net/npm/world-atlas@2.0.2/land-110m.json').then(r => r.json()),
    ]);
    const land = feature(topo, topo.objects.land);
    const c = document.createElement('canvas'); c.width = W; c.height = H;
    const ctx = c.getContext('2d', { willReadFrequently: true });
    const proj = geoEquirectangular().scale(W / (2 * Math.PI)).translate([W / 2, H / 2]).precision(.1);
    ctx.fillStyle = '#fff'; ctx.beginPath(); geoPath(proj, ctx)(land); ctx.fill();
    return ctx.getImageData(0, 0, W, H).data;
  } catch (e) {
    console.warn('[globe] land data unavailable, drawing a full sphere', e);
    return null;
  }
}
