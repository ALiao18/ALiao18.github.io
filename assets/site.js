(function () {
  const $ = s => document.querySelector(s);
  const SECS = [['about', 'About'], ['news', 'News'], ['writings', 'Writings'], ['reading', 'Reading list'], ['photos', 'Photos'], ['cv', 'CV'], ['contact', 'Contact']];
  const KSEC = { posts: 2, books: 3, photos: 4 };
  const PAL = { light: { bg: '#ffffff', ink: '#111111', muted: '#767676' }, dark: { bg: '#0b0b0b', ink: '#ededed', muted: '#8a8a8a' } };
  const MQ = matchMedia('(max-width:860px), (max-width:1180px) and (max-aspect-ratio:4/5)');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const rgba = (h, a) => { const n = parseInt(h.slice(1), 16); return `rgba(${n >> 16},${(n >> 8) & 255},${n & 255},${a})`; };
  const pal = () => PAL[document.documentElement.dataset.theme] || PAL.light;
  const esc = t => String(t).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
  const cv = $('#m'), ctx = cv.getContext('2d'), home = $('#home'), coord = $('#coord'), main = $('#main'), stage = $('#stage');
  const secEls = SECS.map(s => document.getElementById(s[0]));

  // Closed curves t ∈ [0, 2π). 3D shapes are rescaled so their x–z extent is ±1.
  // nd: true → defined in up to 6 dimensions and shown through a slowly rotating 3D projection.
  const D = 6, R2 = Math.SQRT1_2;
  const SHAPES = {
    'clifford 4D': { nd: true, f: t => [R2 * Math.cos(2 * t), R2 * Math.sin(3 * t), R2 * Math.sin(2 * t), R2 * Math.cos(3 * t)] },
    'rotation 6D': { nd: true, f: t => [Math.cos(t), 0.6 * Math.cos(2 * t + 0.4), Math.sin(t), 0.6 * Math.sin(2 * t + 0.4), 0.45 * Math.cos(3 * t + 1.1), 0.45 * Math.sin(3 * t + 1.1)] },
    'twist 5D': { nd: true, f: t => [Math.cos(t), 0.5 * Math.sin(2 * t), Math.sin(t), 0.7 * Math.cos(3 * t), 0.7 * Math.sin(3 * t)] }
  };
  const SHAPE_KEYS = Object.keys(SHAPES);
  let shapeName = new URLSearchParams(location.search).get('shape') || localStorage.getItem('al-shape') || 'clifford 4D';
  if (!SHAPES[shapeName]) shapeName = 'clifford 4D';
  let curve, cloud, line, curA, curB, mix = 1, m0 = 0, ndA = 0, ndB = 0, ndW = 0, phi = 0, lastMeta = 0;
  const gauss = () => { let u = 0; while (!u) u = Math.random(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(6.283 * Math.random()); };
  const seeds = Array.from({ length: 1120 }, () => ({ t: Math.random() * 6.283, n: Array.from({ length: D }, () => gauss() * 0.07) }));
  const pad = v => { const o = v.slice(); while (o.length < D) o.push(0); return o; };
  const norm = sh => {
    const f = t => pad(sh.f(t)), S = Array.from({ length: 400 }, (_, i) => f(i / 400 * 6.283));
    const c = Array.from({ length: D }, (_, k) => S.reduce((a, p) => a + p[k], 0) / S.length);
    const k = sh.nd ? 1.15 / Math.max(...S.map(p => Math.hypot(...p.map((v, j) => v - c[j]))))
                    : 1 / Math.max(...S.map(p => Math.max(Math.abs(p[0] - c[0]), Math.abs(p[2] - c[2]))));
    return t => f(t).map((v, j) => (v - c[j]) * k);
  };
  const ease = x => x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
  const PLANES = [[0, 3, 1], [1, 4, 0.7], [2, 5, 1.3], [0, 4, 0.45]];
  function project(v) {
    if (ndW > 0) { v = v.slice(); for (const [i, j, r] of PLANES) { const a = phi * r * ndW, c = Math.cos(a), s = Math.sin(a), x = v[i], y = v[j]; v[i] = x * c - y * s; v[j] = x * s + y * c; } }
    return [v[0], v[1] * (1 - 0.5 * ndW), v[2]];
  }
  const curveND = t => { const b = curB(t); if (mix >= 1) return b; const a = curA(t), e = ease(mix); return a.map((v, j) => v + (b[j] - v) * e); };
  curve = t => project(curveND(t));
  function rebuild() {
    cloud = seeds.map(c => project(curveND(c.t).map((x, j) => x + c.n[j])));
    line = Array.from({ length: 500 }, (_, i) => curve(i / 499 * 6.283));
    const now = performance.now();
    if (window.__secReady && (mix < 1 || now - lastMeta > 400 || !lastMeta)) { lastMeta = now; secEls.forEach((el, i) => { const q = curve(T[i]); el.querySelector('.meta').textContent = 'PC1 ' + q[0].toFixed(2) + ' · PC2 ' + q[1].toFixed(2) + ' · PC3 ' + q[2].toFixed(2); }); }
  }
  function movePill() {
    const b = document.querySelector('#shapes button.on'), p = document.querySelector('#shapes .pill'); if (!b || !p) return;
    p.style.left = b.offsetLeft + 'px'; p.style.top = b.offsetTop + 'px'; p.style.width = b.offsetWidth + 'px'; p.style.height = b.offsetHeight + 'px';
  }
  function setShape(name, instant) {
    shapeName = name; const nf = norm(SHAPES[name]), nd = SHAPES[name].nd ? 1 : 0;
    if (!curB || instant || reduce) { curA = curB = nf; mix = 1; ndA = ndB = ndW = nd; }
    else { ndA = ndW; ndB = nd; const pA = curA, pB = curB, pm = mix; curA = pm >= 1 ? pB : (t => { const a = pA(t), b = pB(t), e = ease(pm); return a.map((v, j) => v + (b[j] - v) * e); }); curB = nf; mix = 0; m0 = performance.now(); }
    rebuild();
    document.querySelectorAll('#shapes button').forEach(b => b.classList.toggle('on', b.dataset.shape === name));
    movePill();
  }
  let pk = { x: null, y: null };
  function placePicker(cx, yMax) {
    const el = document.getElementById('coord'); if (!el) return;
    if (mobile) { if (pk.x !== null) { el.style.transform = ''; pk = { x: null, y: null }; } return; }
    const tx = Math.max(24, Math.min(W - el.offsetWidth - 24, cx - el.offsetWidth / 2)), ty = Math.min(H - 84, yMax + 34);
    pk.x = pk.x === null ? tx : pk.x + (tx - pk.x) * 0.2; pk.y = pk.y === null ? ty : pk.y + (ty - pk.y) * 0.2;
    el.style.transform = 'translate(' + pk.x.toFixed(1) + 'px,' + pk.y.toFixed(1) + 'px)';
  }
  function morphTick() {
    if (mix < 1) { mix = Math.min(1, (performance.now() - m0) / 900); ndW = ndA + (ndB - ndA) * ease(mix); }
    if (ndW > 0 && !reduce) phi += 0.0042;
    if (mix < 1 || ndW > 0) rebuild();
  }
  setShape(shapeName, true);
  const T = SECS.map((_, i) => i / SECS.length * 6.283 + 0.35);
  const ang = (a, b) => { let d = (a - b) % 6.283; if (d > Math.PI) d -= 6.283; if (d < -Math.PI) d += 6.283; return d; };
  const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
  window.__secReady = true;
  const shp = $('#shapes');
  if (shp) {
    shp.innerHTML = '<i class="pill"></i>' + SHAPE_KEYS.map(k => '<button data-shape="' + k + '">' + k + '</button>').join('');
    shp.addEventListener('click', e => { const b = e.target.closest('[data-shape]'); if (!b) return; localStorage.setItem('al-shape', b.dataset.shape); setShape(b.dataset.shape); });
    addEventListener('resize', movePill); document.fonts && document.fonts.ready.then(movePill);
  }
  setShape(shapeName, true);

  // ---------- layout ----------
  let W = 0, H = 0, L = {}, mobile = false;
  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    mobile = MQ.matches;
    W = cv.offsetWidth; H = cv.offsetHeight; cv.width = W * dpr; cv.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const mn = Math.min(W, H);
    if (mobile) { const S = Math.min(W * 0.4, H * 0.62); L = { S0: S, S1: S, C: [W / 2, H / 2 + 4], C1: [W / 2, H / 2 + 4] }; return; }
    const top = 100, bot = H - 84, hr = home.offsetLeft + home.offsetWidth + 24;
    let S0 = Math.min((bot - top) / 1.75, W * 0.28), cx0 = Math.max(W * 0.6, hr + S0 * 1.05);
    if (cx0 + S0 * 1.05 > W - 24) { S0 = Math.max(80, (W - 24 - hr) / 2.1); cx0 = hr + S0 * 1.05; }
    const fade = main.getBoundingClientRect().left, S1 = Math.max(70, Math.min((fade - 144) / 2.2, (H - 230) / 1.75));
    L = { S0, S1, C: [cx0, (top + bot) / 2], C1: [(fade - 64) / 2 + 12, (H + 16) / 2] };
  }
  addEventListener('resize', resize); MQ.addEventListener && MQ.addEventListener('change', resize); resize();

  // ---------- scroll ----------
  const offTop = () => mobile ? (getComputedStyle(stage).position === 'sticky' ? stage.offsetHeight : 0) + 18 : 104;
  const docTop = el => el.getBoundingClientRect().top + scrollY;
  function scrollToEl(el, smooth = true) { if (!el) return; scrollTo({ top: Math.max(0, docTop(el) - offTop()), behavior: smooth && !reduce ? 'smooth' : 'auto' }); }
  function flash(el) { if (!el) return; el.classList.remove('flash'); void el.offsetWidth; el.classList.add('flash'); }
  function goHash(hash, smooth) {
    const id = (hash || '').replace('#', '');
    if (!id) { scrollTo({ top: 0, behavior: smooth && !reduce ? 'smooth' : 'auto' }); return; }
    const el = document.getElementById(id); if (!el) return;
    scrollToEl(el, smooth); if (!SECS.some(s => s[0] === id)) setTimeout(() => flash(el), smooth ? 450 : 50);
  }
  document.addEventListener('click', e => {
    const a = e.target.closest('a[href^="#"]'); if (!a) return;
    e.preventDefault(); const hsh = a.getAttribute('href');
    history.replaceState(null, '', hsh === '#' ? location.pathname : hsh); goHash(hsh, true);
  });
  addEventListener('hashchange', () => goHash(location.hash, true));

  function scrollState() {
    const ref = scrollY + offTop() + 4, tops = secEls.map(docTop);
    const atEnd = scrollY + innerHeight >= document.documentElement.scrollHeight - 2;
    if (atEnd) return { i: SECS.length - 1, phase: T[SECS.length - 1] };
    if (ref < tops[0]) return { i: -1, phase: T[0] };
    let i = tops.length - 1; while (i > 0 && ref < tops[i]) i--;
    if (i === tops.length - 1) return { i, phase: T[i] };
    const f = clamp((ref - tops[i]) / (tops[i + 1] - tops[i])), g = clamp((f - 0.25) / 0.75), e = g * g * (3 - 2 * g);
    return { i, phase: T[i] + ang(T[i + 1], T[i]) * e };
  }

  // ---------- manifold ----------
  const m = { x: 0, y: 0, in: false };
  addEventListener('mousemove', e => { const r = cv.getBoundingClientRect(); m.x = e.clientX - r.left; m.y = e.clientY - r.top; m.in = m.x >= 0 && m.y >= 0 && m.x <= W && m.y <= H && document.elementFromPoint(e.clientX, e.clientY) === cv; });
  document.addEventListener('mouseleave', () => { m.in = false; });
  const nav = { phase: 0.35, w: 0, yaw: 0.4, pitch: 0.45, auto: 0.4, active: null, uy: 0, up: 0 };
  const rot = { on: false, x: 0, y: 0, moved: false };
  cv.addEventListener('pointerdown', e => { rot.on = true; rot.moved = false; rot.x = e.clientX; rot.y = e.clientY; cv.setPointerCapture(e.pointerId); });
  cv.addEventListener('pointermove', e => { if (!rot.on) return; const dx = e.clientX - rot.x, dy = e.clientY - rot.y; if (!rot.moved && Math.hypot(dx, dy) < 4) return; rot.moved = true; rot.x = e.clientX; rot.y = e.clientY; if (ndW > 0 && (e.shiftKey || e.altKey)) { phi += (dx + dy) * 0.01; return; } nav.uy += dx * 0.008; nav.up = clamp(nav.up + dy * 0.006, -1.1, 1.1); nav.yaw += dx * 0.008; nav.pitch += dy * 0.006; });
  const rotEnd = () => { rot.on = false; setTimeout(() => { rot.moved = false; }, 0); };
  cv.addEventListener('pointerup', rotEnd); cv.addEventListener('pointercancel', rotEnd);
  let labels = [], hover = -1, sats = [], shover = -1, SAT = [];
  const hash4 = s => { let a = 2166136261; const o = []; for (let k = 0; k < 4; k++) { for (let i = 0; i < s.length; i++) a = Math.imul(a ^ s.charCodeAt(i), 16777619); a = Math.imul(a ^ k, 2246822507); o.push(((a >>> 0) % 10000) / 10000); } return o; };

  function setActive(i) {
    const id = i >= 0 ? SECS[i][0] : null; if (id === nav.active) return; nav.active = id;
    document.querySelectorAll('#nav a').forEach(a => a.classList.toggle('on', a.getAttribute('href') === '#' + id));
    document.title = id ? SECS[i][1] + ' — Andrew Liao' : 'Andrew Liao';
    const cur = location.hash.replace('#', '');
    if (!cur || SECS.some(s => s[0] === cur)) history.replaceState(null, '', id ? '#' + id : location.pathname);
  }

  cv.addEventListener('click', e => {
    if (rot.moved) return;
    const r = cv.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top;
    let sb = -1, sd = mobile ? 12 : 9; sats.forEach((p, i) => { const d = Math.hypot(p[0] - x, p[1] - y); if (d < sd) { sd = d; sb = i; } });
    if (sb >= 0) { goNode(sb); return; }
    let best = -1, bd = mobile ? 30 : 22;
    labels.forEach((p, i) => { const d = Math.hypot(p[0] - x, p[1] - y); if (d < bd) { bd = d; best = i; } });
    if (best >= 0) { history.replaceState(null, '', '#' + SECS[best][0]); scrollToEl(secEls[best]); }
  });

  function toggleTheme() { const t = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark'; document.documentElement.dataset.theme = t; localStorage.setItem('al-theme', t); }
  document.querySelectorAll('.theme').forEach(b => b.addEventListener('click', toggleTheme));

  function frame() {
    if (cv.offsetWidth !== W || cv.offsetHeight !== H) resize();
    morphTick();
    const P = pal(), sp = scrollState();
    setActive(sp.i);
    const wT = mobile ? (sp.i >= 0 ? 1 : clamp(scrollY / 160)) : clamp(scrollY / (innerHeight * 0.55));
    nav.w += (wT - nav.w) * 0.08;
    if (!mobile) home.style.opacity = clamp(1 - scrollY / (innerHeight * 0.3));
    if (sp.i < 0 && wT < 0.03) { if (!reduce) nav.phase += 0.0035; }
    else nav.phase += ang(sp.phase, nav.phase) * (sp.i < 0 ? 0.04 + 0.1 * wT : 0.14);
    if (wT < 0.03 && !reduce) nav.auto += 0.002;
    const w = nav.w, q = curve(nav.phase);
    const yawTrack = Math.atan2(q[0], -q[2]) + 0.35;
    const mx = m.in && !mobile ? (m.x - W / 2) / W : 0, my = m.in && !mobile ? (m.y - H / 2) / H : 0;
    const mxr = rot.on ? 0 : mx, myr = rot.on ? 0 : my;
    nav.yaw += ang(nav.auto + ang(yawTrack, nav.auto) * w + mxr * (1.6 - 1.2 * w) + nav.uy, nav.yaw) * (rot.on ? 0.3 : 0.05);
    nav.pitch += (0.45 - 0.25 * w + myr * (0.9 - 0.6 * w) + nav.up - nav.pitch) * (rot.on ? 0.3 : 0.05);
    const S = L.S0 + (L.S1 - L.S0) * w;
    const cy = Math.cos(nav.yaw), sy = Math.sin(nav.yaw), cp = Math.cos(nav.pitch), spp = Math.sin(nav.pitch);
    const ox = L.C[0] * (1 - w) + L.C1[0] * w, oy = L.C[1] * (1 - w) + L.C1[1] * w;
    const proj = ([x, y, z]) => { const x1 = x * cy + z * sy, z1 = -x * sy + z * cy, y1 = y * cp - z1 * spp, z2 = y * spp + z1 * cp, f = 3.4 / (3.4 + z2); return [x1 * S * f + ox, y1 * S * f + oy, z2]; };

    ctx.fillStyle = P.bg; ctx.fillRect(0, 0, W, H);
    const ds = 1.4 + w * 0.6;
    for (const c of cloud) { const [x, y, z] = proj(c); if (x < -4 || x > W + 4 || y < -4 || y > H + 4) continue; ctx.fillStyle = rgba(P.muted, 0.14 + 0.3 * (1 - (z + 1.2) / 2.4)); ctx.fillRect(x, y, ds, ds); }
    let yMax = 0; ctx.beginPath(); line.forEach((p, i) => { const [x, y] = proj(p); if (y > yMax) yMax = y; i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); });
    placePicker(ox, yMax);
    ctx.strokeStyle = rgba(P.ink, 0.26); ctx.lineWidth = 1; ctx.stroke();
    const n = 90;
    for (let i = 1; i < n; i++) {
      const a = proj(curve(nav.phase - (n - i + 1) * 0.006)), b = proj(curve(nav.phase - (n - i) * 0.006));
      ctx.strokeStyle = rgba(P.ink, (i / n) * 0.9); ctx.lineWidth = 1.2 + w * 0.8; ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke();
    }
    sats = SAT.map(st => proj(curve(T[st.sec] + st.o[0]).map((v, j) => v + st.o[1 + j])));
    labels = T.map(t => proj(curve(t)));
    hover = -1; shover = -1;
    if (m.in) {
      let sd = 9; sats.forEach((p, i) => { const d = Math.hypot(p[0] - m.x, p[1] - m.y); if (d < sd) { sd = d; shover = i; } });
      if (shover < 0) labels.forEach((p, i) => { if (Math.hypot(p[0] - m.x, p[1] - m.y) < 22) hover = i; });
    }
    cv.style.cursor = rot.moved ? 'grabbing' : hover >= 0 || shover >= 0 ? 'pointer' : 'grab';
    if (G) {
      const nb = shover >= 0 ? new Set(G.adj[shover]) : null;
      G.edges.forEach(([a, b]) => {
        const on = shover >= 0 && (a === shover || b === shover);
        ctx.strokeStyle = rgba(P.ink, on ? 0.7 : 0.07 + 0.08 * w); ctx.lineWidth = on ? 1 : 0.8;
        ctx.beginPath(); ctx.moveTo(sats[a][0], sats[a][1]); ctx.lineTo(sats[b][0], sats[b][1]); ctx.stroke();
      });
      sats.forEach((p, i) => {
        const on = shover === i || (nb && nb.has(i));
        ctx.globalAlpha = on ? 1 : 0.35 + 0.35 * w; shape(ctx, G.nodes[i].kind, p[0], p[1], on ? 3 : 2, P.ink, true); ctx.globalAlpha = 1;
      });
      ctx.font = '400 13px Spectral, Georgia, serif';
      if (shover >= 0) { [shover, ...G.adj[shover]].forEach((j, k) => tag(ctx, G.nodes[j].t, sats[j][0], sats[j][1], W, H, P, k === 0 ? 1 : 0.7)); }
    }
    ctx.font = `300 italic ${mobile ? 13 : 14}px Spectral, Georgia, serif`;
    labels.forEach((p, i) => {
      const active = SECS[i][0] === nav.active, hot = hover === i || active;
      ctx.strokeStyle = hot ? P.ink : rgba(P.ink, 0.55); ctx.fillStyle = P.bg; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.arc(p[0], p[1], active ? 5 : 3.5, 0, 6.283); ctx.fill(); ctx.stroke();
      ctx.fillStyle = hot ? P.ink : P.muted; ctx.fillText(SECS[i][1], p[0] + 10, p[1] - 8);
    });
    const hd = proj(q); ctx.fillStyle = P.ink; ctx.beginPath(); ctx.arc(hd[0], hd[1], 3.4, 0, 6.283); ctx.fill();
    if (!mobile) coord.textContent = 'z = (' + q.map(v => (v >= 0 ? '+' : '−') + Math.abs(v).toFixed(2)).join(', ') + ')';
    drawGizmo(P, cy, sy, cp, spp);
    stepSim(); VIEWS.forEach(v => renderView(v, P));
    requestAnimationFrame(frame);
  }
  function shape(c, kind, x, y, r, col, fill) {
    c.beginPath();
    if (kind === 'books') c.rect(x - r, y - r, 2 * r, 2 * r);
    else if (kind === 'photos') { const k = r * 1.3; c.moveTo(x, y - k); c.lineTo(x + k, y); c.lineTo(x, y + k); c.lineTo(x - k, y); c.closePath(); }
    else c.arc(x, y, r, 0, 6.283);
    if (fill) { c.fillStyle = col; c.fill(); } else { c.strokeStyle = col; c.lineWidth = 1; c.stroke(); }
  }
  function tag(c, txt, x, y, W2, H2, P, a) {
    const tw = c.measureText(txt).width; let tx = x + 10; if (tx + tw > W2 - 6) tx = x - 10 - tw; tx = Math.max(4, tx);
    const ty = clamp(y + 4, 16, H2 - 6);
    c.fillStyle = rgba(P.bg, 0.86); c.fillRect(tx - 4, ty - 13, tw + 8, 18); c.fillStyle = rgba(P.ink, a); c.fillText(txt, tx, ty);
  }
  const gz = $('#gz'), gctx = gz.getContext('2d');
  (() => { const d = Math.min(devicePixelRatio || 1, 2); gz.width = 56 * d; gz.height = 44 * d; gctx.setTransform(d, 0, 0, d, 0, 0); })();
  function drawGizmo(P, cy, sy, cp, sp) {
    gctx.clearRect(0, 0, 56, 44);
    const o = [22, 24], Lx = 13;
    gctx.font = '8px "JetBrains Mono", monospace'; gctx.lineWidth = 1;
    [[1, 0, 0, '1'], [0, -1, 0, '2'], [0, 0, 1, '3']].forEach(([x, y, z, lb]) => {
      const x1 = x * cy + z * sy, z1 = -x * sy + z * cy, y1 = y * cp - z1 * sp;
      gctx.strokeStyle = rgba(P.muted, 0.8); gctx.beginPath(); gctx.moveTo(o[0], o[1]); gctx.lineTo(o[0] + x1 * Lx, o[1] + y1 * Lx); gctx.stroke();
      gctx.fillStyle = P.muted; gctx.fillText('PC' + lb, o[0] + x1 * (Lx + 5) - 5, o[1] + y1 * (Lx + 5) + 3);
    });
  }

  // ---------- data ----------
  const KIND = {
    posts: { items: window.POSTS || [], when: p => p.date, noun: ['post', 'posts'], label: 'writings' },
    books: { items: window.BOOKS || [], when: b => b.read, noun: ['book', 'books'], label: 'books' },
    photos: { items: window.PHOTOS || [], when: p => p.date, noun: ['photo', 'photos'], label: 'photos' }
  };
  const F = { posts: { tags: new Set(), year: null }, books: { tags: new Set(), year: null }, photos: { tags: new Set(), year: null } };
  const MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const fmt = ym => { const [y, mo] = (ym || '').split('-'); return mo ? MON[+mo - 1] + ' ' + y : (y || ''); };
  const match = (k, it) => { const f = F[k]; if (f.year && !(KIND[k].when(it) || '').startsWith(f.year)) return false; if (f.tags.size && !(it.tags || []).some(t => f.tags.has(t))) return false; return true; };
  Object.keys(KIND).forEach(k => { const it = KIND[k].items, has = it.length > 0, ph = has && it.every(x => x.placeholder); $('[data-soon="' + k + '"]').style.display = has && !ph ? 'none' : ''; $('[data-live="' + k + '"]').style.display = has ? '' : 'none'; if (ph) $('[data-live="' + k + '"]').style.opacity = 0.55; });

  // graph: nodes available now, edges after post pages are scanned for [[links]]
  const N0 = SiteGraph.nodes(), BY = {}; N0.forEach((n, j) => { BY[n.id] = j; });
  let G = { nodes: N0, edges: [], adj: N0.map(() => []), byId: BY };
  SAT = N0.map(n => { const h = hash4(n.id); return { sec: KSEC[n.kind], o: [(h[0] - 0.5) * 0.4, (h[1] - 0.5) * 0.16, (h[2] - 0.5) * 0.16, (h[3] - 0.5) * 0.16] }; });

  function goNode(j) {
    const n = G.nodes[j]; if (!n) return;
    if (n.kind === 'posts') { if (n.it.href) { location.href = n.it.href; return; } }
    else if (n.kind === 'photos' && n.it.src) { open(n.it.src, '_blank'); return; }
    const id = ({ posts: 'w-', books: 'b-', photos: 'p-' })[n.kind] + n.id; history.replaceState(null, '', '#' + id); goHash('#' + id, true);
  }

  // ---------- force simulation (shared by all section graphs) ----------
  const PS = N0.map((n, j) => { const a = { posts: 0, books: 2.1, photos: 4.2 }[n.kind] + (j % 5) * 0.35, r = 60 + (j % 3) * 20; return { x: Math.cos(a) * r, y: Math.sin(a) * r, vx: 0, vy: 0, fixed: false }; });
  let alpha = 1;
  function stepSim() {
    if (alpha < 0.004) return;
    const n = PS.length;
    for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) {
      const a = PS[i], b = PS[j]; let dx = b.x - a.x, dy = b.y - a.y, d2 = dx * dx + dy * dy + 0.01, d = Math.sqrt(d2), f = 1400 / d2 * alpha;
      dx /= d; dy /= d; a.vx -= dx * f; a.vy -= dy * f; b.vx += dx * f; b.vy += dy * f;
    }
    G.edges.forEach(([i, j]) => { const a = PS[i], b = PS[j]; let dx = b.x - a.x, dy = b.y - a.y, d = Math.sqrt(dx * dx + dy * dy) || 1, f = (d - 55) * 0.05 * alpha; dx /= d; dy /= d; a.vx += dx * f; a.vy += dy * f; b.vx -= dx * f; b.vy -= dy * f; });
    PS.forEach(p => { p.vx -= p.x * 0.012 * alpha; p.vy -= p.y * 0.018 * alpha; if (!p.fixed) { p.vx *= 0.62; p.vy *= 0.62; p.x += p.vx; p.y += p.vy; } else { p.vx = p.vy = 0; } });
    alpha *= 0.99; if (dragging) alpha = Math.max(alpha, 0.25);
  }
  let dragging = false;

  // ---------- section graph views ----------
  const CENT = { mind: [0.9, 0.2, 0.1], science: [0.2, -0.7, 0.5], scifi: [-0.3, 0.6, 0.8], fiction: [-0.9, 0, -0.3], philosophy: [0, 0.8, -0.8], neuro: [0.6, 0.3, 0.2], methods: [-0.5, -0.4, -0.3] };
  const XYZ = N0.map(n => { if (n.it.xyz) return n.it.xyz; const h = hash4(n.id + '#'); return (CENT[n.it.c] || [0, 0, 0]).map((v, k) => v + (h[k] - 0.5) * 0.55); });
  const VIEWS = [];
  function makeView(kind) {
    const cvs = $('#g' + kind); if (!cvs) return;
    const v = { cv: cvs, c: cvs.getContext('2d'), kind, hov: -1, hl: -1, mx: -1, my: -1, drag: -1, down: null, mode: 'graph', yaw: 0.5, W: 0, H: 0, scr: [], sc: 0, cx: 0, cy: 0 };
    const pos = e => { const r = cvs.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top]; };
    cvs.addEventListener('pointermove', e => {
      [v.mx, v.my] = pos(e);
      if (v.drag >= 0 && v.mode === 'graph') { const p = PS[v.drag]; p.x = v.cx + (v.mx - v.W / 2) / v.sc; p.y = v.cy + (v.my - v.H / 2) / v.sc; if (v.down && Math.hypot(v.mx - v.down[0], v.my - v.down[1]) > 4) v.down.moved = true; }
    });
    cvs.addEventListener('pointerleave', () => { if (v.drag < 0) { v.mx = -1; v.hov = -1; hlList(kind, -1); } });
    cvs.addEventListener('pointerdown', e => {
      [v.mx, v.my] = pos(e); const j = pick(v); if (j < 0) return;
      v.down = [v.mx, v.my]; v.down.j = j;
      if (e.pointerType === 'mouse' && v.mode === 'graph') { v.drag = j; PS[j].fixed = true; dragging = true; cvs.setPointerCapture(e.pointerId); }
    });
    const up = () => {
      if (v.down && !v.down.moved) goNode(v.down.j);
      if (v.drag >= 0) { PS[v.drag].fixed = false; v.drag = -1; dragging = false; }
      v.down = null;
    };
    cvs.addEventListener('pointerup', up); cvs.addEventListener('pointercancel', () => { v.down = null; if (v.drag >= 0) { PS[v.drag].fixed = false; v.drag = -1; dragging = false; } });
    VIEWS.push(v); return v;
  }
  function pick(v) { let hv = -1, bd = 11; v.scr.forEach((p, i) => { if (!viewMatch(v, i)) return; const d = Math.hypot(p[0] - v.mx, p[1] - v.my); if (d < bd) { bd = d; hv = i; } }); return hv; }
  const viewMatch = (v, j) => { const n = G.nodes[j]; return n.kind !== v.kind || match(n.kind, n.it); };
  function renderView(v, P) {
    const cvs = v.cv, r = cvs.getBoundingClientRect();
    if (!cvs.offsetParent || r.bottom < 0 || r.top > innerHeight) return;
    const d = Math.min(devicePixelRatio || 1, 2), c = v.c;
    if (v.W !== cvs.offsetWidth || v.H !== cvs.offsetHeight) { v.W = cvs.offsetWidth; v.H = cvs.offsetHeight; cvs.width = v.W * d; cvs.height = v.H * d; c.setTransform(d, 0, 0, d, 0, 0); }
    const W2 = v.W, H2 = v.H;
    if (v.mode === 'graph') {
      if (v.drag < 0) {
        let x0 = 1e9, x1 = -1e9, y0 = 1e9, y1 = -1e9; PS.forEach(p => { x0 = Math.min(x0, p.x); x1 = Math.max(x1, p.x); y0 = Math.min(y0, p.y); y1 = Math.max(y1, p.y); });
        const s = Math.min((W2 - 56) / Math.max(x1 - x0, 1), (H2 - 44) / Math.max(y1 - y0, 1), 2.4);
        if (!v.sc) { v.sc = s; v.cx = (x0 + x1) / 2; v.cy = (y0 + y1) / 2; }
        v.sc += (s - v.sc) * 0.08; v.cx += ((x0 + x1) / 2 - v.cx) * 0.08; v.cy += ((y0 + y1) / 2 - v.cy) * 0.08;
      }
      v.scr = PS.map(p => [W2 / 2 + (p.x - v.cx) * v.sc, H2 / 2 + (p.y - v.cy) * v.sc, 0]);
    } else {
      if (v.mx < 0 && !reduce) v.yaw += 0.003; else if (v.mx >= 0) v.yaw += (v.mx / W2 - 0.5) * 0.02;
      const co = Math.cos(v.yaw), si = Math.sin(v.yaw), cp2 = Math.cos(0.35), sp2 = Math.sin(0.35), S2 = Math.min(W2, H2) * 0.36;
      v.scr = XYZ.map(([x, y, z]) => { const x1 = x * co + z * si, z1 = -x * si + z * co, y1 = y * cp2 - z1 * sp2, z2 = y * sp2 + z1 * cp2, f = 3 / (3 + z2); return [W2 / 2 + x1 * S2 * f, H2 / 2 + y1 * S2 * f, z2]; });
    }
    if (v.drag < 0) { const hv = v.mx >= 0 ? pick(v) : -1; if (hv !== v.hov) { v.hov = hv; hlList(v.kind, hv >= 0 && G.nodes[hv].kind === v.kind ? hv : -1); } }
    cvs.style.cursor = v.drag >= 0 ? 'grabbing' : v.hov >= 0 ? 'pointer' : 'default';
    const act = v.drag >= 0 ? v.drag : v.hov >= 0 ? v.hov : v.hl, nb = act >= 0 ? new Set(G.adj[act]) : null;
    c.clearRect(0, 0, W2, H2);
    G.edges.forEach(([a, b]) => {
      const on = act >= 0 && (a === act || b === act), ok = viewMatch(v, a) && viewMatch(v, b);
      c.strokeStyle = rgba(P.ink, on ? 0.75 : act >= 0 ? 0.06 : ok ? 0.2 : 0.06); c.lineWidth = on ? 1.2 : 1;
      c.beginPath(); c.moveTo(v.scr[a][0], v.scr[a][1]); c.lineTo(v.scr[b][0], v.scr[b][1]); c.stroke();
    });
    const order = v.scr.map((_, i) => i); if (v.mode !== 'graph') order.sort((a, b) => v.scr[b][2] - v.scr[a][2]);
    order.forEach(j => {
      const n = G.nodes[j], p = v.scr[j], own = n.kind === v.kind, ok = viewMatch(v, j);
      const lit = act < 0 || j === act || nb.has(j);
      const rr = (own ? 3.2 : 2.6) + Math.sqrt(G.adj[j].length) * 0.9;
      c.globalAlpha = !ok ? 0.1 : lit ? 1 : 0.18;
      if (own) shape(c, n.kind, p[0], p[1], rr, P.ink, true);
      else { shape(c, n.kind, p[0], p[1], rr, P.bg, true); shape(c, n.kind, p[0], p[1], rr, P.muted, false); }
      c.globalAlpha = 1;
    });
    c.font = '400 13px Spectral, Georgia, serif';
    if (act >= 0) [act, ...G.adj[act]].forEach((j, k) => tag(c, G.nodes[j].t, v.scr[j][0], v.scr[j][1], W2, H2, P, k === 0 ? 1 : 0.65));
  }

  // ---------- lists ----------
  const linksHTML = j => { const a = G.adj[j]; return a.length ? '<span class="lk"><span>↔</span>' + a.map(x => '<button data-go="' + esc(G.nodes[x].id) + '">' + esc(G.nodes[x].t) + '</button>').join('') + '</span>' : ''; };
  const nodeOf = (k, i) => G.nodes.findIndex(n => n.kind === k && n.i === i);
  function chipsHTML(k) {
    const items = KIND[k].items, f = F[k];
    const tags = [...new Set(items.flatMap(i => i.tags || []))].sort((x, y) => items.filter(i => (i.tags || []).includes(y)).length - items.filter(i => (i.tags || []).includes(x)).length);
    const yrs = [...new Set(items.map(i => (KIND[k].when(i) || '').slice(0, 4)).filter(Boolean))].sort().reverse();
    const any = f.tags.size || f.year;
    return '<div class="chips">' + tags.map(t => '<button class="chip' + (f.tags.has(t) ? ' on' : '') + '" data-k="' + k + '" data-tag="' + esc(t) + '">#' + esc(t) + '</button>').join('') + '</div>' +
      '<div class="chips">' + yrs.map(y => '<button class="chip' + (f.year === y ? ' on' : '') + '" data-k="' + k + '" data-year="' + y + '">' + y + '</button>').join('') + (any ? '<button class="chip clear" data-k="' + k + '" data-clear="1">clear</button>' : '') + '</div>';
  }
  const LEG = '<span class="lg"><span>● writings</span><span>■ books</span><span>◆ photos</span></span>';
  function caption(k) {
    const v = VIEWS.find(x => x.kind === k), g = !v || v.mode === 'graph';
    $('[data-cap="' + k + '"]').innerHTML = LEG + '<span>' + (g ? 'Lines are links between items. Hover to see what connects; drag to rearrange.' : 'Placed by the first three principal components of each item’s embedding. Lines are links.') + '</span>';
  }
  function refresh(k) {
    const items = KIND[k].items; if (!items.length) return;
    const n = items.filter(it => match(k, it)).length, nn = KIND[k].noun;
    $('#' + k + 'Count').textContent = (n === items.length ? '' : n + ' of ') + items.length + ' ' + nn[items.length === 1 ? 0 : 1];
    $('#f' + k).innerHTML = chipsHTML(k);
    let rows = '';
    if (k === 'posts') rows = items.map((p, i) => { const j = nodeOf(k, i); return match(k, p) ? '<div class="entry" id="w-' + esc(p.id) + '" data-n="' + j + '"><span class="d">' + fmt(p.date) + '</span><span>' + (p.href ? '<a class="et" href="' + esc(p.href) + '">' + esc(p.t) + '</a>' : '<span class="et">' + esc(p.t) + '</span>') + '<span class="es">' + esc(p.tldr || '') + '</span><span class="meta2">' + (p.tags || []).map(t => '#' + esc(t)).join(' ') + '</span>' + linksHTML(j) + '</span></div>' : ''; }).join('');
    else if (k === 'books') rows = items.map((b, i) => { const j = nodeOf(k, i); return match(k, b) ? '<div class="entry" id="b-' + esc(b.id) + '" data-n="' + j + '" style="grid-template-columns:1fr"><span><span class="et">' + esc(b.t) + '</span><span class="ea">' + esc(b.a || '') + '</span>' + (b.note ? '<span class="es">' + esc(b.note) + '</span>' : '') + '<span class="meta2">read ' + fmt(b.read) + ' · ' + (b.tags || []).map(t => '#' + esc(t)).join(' ') + '</span>' + linksHTML(j) + '</span></div>' : ''; }).join('');
    else rows = items.map((p, i) => { const j = nodeOf(k, i); return match(k, p) ? '<figure class="ptile entry" style="display:flex;padding:0;border:0" id="p-' + esc(p.id) + '" data-n="' + j + '"><div class="pimg" data-open="' + j + '">' + (p.src ? '<img src="' + esc(p.src) + '" alt="' + esc(p.t || '') + '" loading="lazy">' : '<div class="ph0">photo</div>') + '</div><figcaption>' + esc(p.t || '') + '<span class="meta2">' + fmt(p.date) + '</span></figcaption>' + linksHTML(j) + '</figure>' : ''; }).join('');
    const list = $('#' + k + 'List');
    list.innerHTML = rows || '<div class="none">Nothing matches these filters.</div>';
    const v = VIEWS.find(x => x.kind === k);
    list.querySelectorAll('[data-n]').forEach(el => { el.addEventListener('mouseenter', () => { if (v) v.hl = +el.dataset.n; }); el.addEventListener('mouseleave', () => { if (v) v.hl = -1; }); });
    if (dkind === k) { $('#fdrawer').innerHTML = chipsHTML(k); renderDrawer(); }
  }
  function hlList(k, j) { const l = $('#' + k + 'List'); l && l.querySelectorAll('[data-n]').forEach(el => el.classList.toggle('hl', +el.dataset.n === j)); }
  document.addEventListener('click', e => {
    const g = e.target.closest('[data-go]'); if (g) { closeDrawer(); goNode(G.byId[g.dataset.go]); return; }
    const o = e.target.closest('[data-open]'); if (o) { goNode(+o.dataset.open); return; }
    const md = e.target.closest('[data-mode]'); if (md) { const v = VIEWS.find(x => x.kind === md.dataset.mode); v.mode = v.mode === 'graph' ? 'pca' : 'graph'; md.textContent = v.mode === 'graph' ? 'PCA view' : 'Graph view'; caption(v.kind); return; }
    const c = e.target.closest('.chip'); if (!c) return;
    const k = c.dataset.k, f = F[k];
    if (c.dataset.tag) { f.tags.has(c.dataset.tag) ? f.tags.delete(c.dataset.tag) : f.tags.add(c.dataset.tag); }
    else if (c.dataset.year) f.year = f.year === c.dataset.year ? null : c.dataset.year;
    else if (c.dataset.clear) { f.tags.clear(); f.year = null; }
    refresh(k);
  });

  // ---------- drawer ----------
  const drawer = $('#drawer'), dlist = $('#dlist'), dfilter = $('#dfilter');
  let dkind = null;
  function renderDrawer() {
    const q = dfilter.value.trim().toLowerCase(), k = dkind;
    const src = KIND[k].items.map((it, i) => ({ it, t: it.t, s: k === 'books' ? it.a : fmt(it.date) })).filter(x => match(k, x.it));
    const rows = src.filter(x => !q || (x.t + ' ' + x.s).toLowerCase().includes(q)).sort((a, b) => a.t.localeCompare(b.t));
    dlist.innerHTML = rows.map(x => '<a data-go="' + esc(x.it.id) + '">' + esc(x.t) + '<span class="au">' + esc(x.s || '') + '</span></a>').join('') || '<div class="au">No matches.</div>';
    $('#dtitle').textContent = ({ books: 'All books', posts: 'All writings', photos: 'All photos' })[k] + ' · ' + rows.length;
  }
  function openDrawer(kind) { dkind = kind; dfilter.value = ''; $('#fdrawer').innerHTML = chipsHTML(kind); renderDrawer(); drawer.classList.add('on'); drawer.setAttribute('aria-hidden', 'false'); }
  function closeDrawer() { drawer.classList.remove('on'); drawer.setAttribute('aria-hidden', 'true'); dkind = null; }
  document.querySelectorAll('[data-all]').forEach(b => b.addEventListener('click', () => openDrawer(b.dataset.all)));
  $('#dclose').addEventListener('click', closeDrawer);
  dfilter.addEventListener('input', renderDrawer);
  addEventListener('keydown', e => { if (e.key === 'Escape') closeDrawer(); });

  // ---------- contact ----------
  const MAIL = 'aliao3@andrew.cmu.edu';
  $('#copyMail').addEventListener('click', e => { navigator.clipboard && navigator.clipboard.writeText(MAIL).then(() => { e.target.textContent = 'copied'; setTimeout(() => { e.target.textContent = 'copy'; }, 1500); }); });
  $('#contactForm').addEventListener('submit', e => {
    e.preventDefault(); const f = new FormData(e.target);
    const subj = f.get('subject') || ('Hello from ' + (f.get('name') || 'your website'));
    const body = f.get('message') + (f.get('name') ? '\n\n— ' + f.get('name') : '');
    location.href = 'mailto:' + MAIL + '?subject=' + encodeURIComponent(subj) + '&body=' + encodeURIComponent(body);
  });

  // ---------- boot ----------
  ['posts', 'books', 'photos'].forEach(k => { if (KIND[k].items.length) makeView(k); caption(k); refresh(k); });
  const initial = location.hash;
  if (initial) { requestAnimationFrame(() => goHash(initial, false)); addEventListener('load', () => goHash(initial, false), { once: true }); }
  SiteGraph.build('').then(g => { G = g; alpha = 1; ['posts', 'books', 'photos'].forEach(refresh); });
  requestAnimationFrame(frame);
})();
