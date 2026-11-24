/* =========================================================
   040.uz — "radio" sayt
   Sahifa — bu radio. Chastota (freq) qaysi stansiyaga yaqin
   bo‘lsa, o‘sha "efirda": matn tiniqlashadi, shovqin pasayadi.
   ========================================================= */
(() => {
  'use strict';

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const root = document.documentElement;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  const AUTHOR = 'Sodiqov';
  const MIN = 0, MAX = 110;   // shkala chegaralari
  const BAND = 4;             // stansiya eshitiladigan masofa
  const LOCK = 0.12;          // shu masofada to‘liq qabul
  const SNAP = 4.5;           // juda yaqin kelganda o‘zi stansiyaga "yopishadi"
  const clamp = (v, a = MIN, b = MAX) => Math.min(b, Math.max(a, v));
  const fmtF = (f) => (Math.round(f * 10) / 10).toFixed(1).padStart(5, '0');

  const stageEl = $('#stage');
  const dial = $('#dial');
  const scale = $('#scale');
  const freqEl = $('#freq');
  const nameEl = $('#stname');
  const bars = $$('#meter i');
  const lamp = $('#lamp');
  const airText = $('#airText');
  const live = $('#live');
  const soundBtn = $('#sound');

  /* ---------------------------------------------------------
     STANSIYALAR
  --------------------------------------------------------- */
  const stations = $$('.station').map((el) => ({
    el,
    wrap: $('.wrap', el),
    id: el.id,
    f: parseFloat(el.dataset.f),
    name: el.dataset.name,
    mark: el.dataset.mark || el.dataset.name,
    hidden: el.hasAttribute('data-hidden'),
    sig: -1,
    texts: [],
    mixed: false,
  })).sort((a, b) => a.f - b.f);
  const byId = Object.fromEntries(stations.map((s) => [s.id, s]));

  /* ---------- matnni "buzish" ---------- */
  const GLYPHS = '░▒▓▚▞▖▗▘▝#%&*+=<>/\\|01';
  stations.forEach((s) => $$('[data-scramble]', s.el).forEach((host) => {
    const w = document.createTreeWalker(host, NodeFilter.SHOW_TEXT);
    for (let n = w.nextNode(); n; n = w.nextNode()) {
      if (n.nodeValue.trim()) s.texts.push({ n, o: n.nodeValue });
    }
  }));
  const isSpace = (c) => c === ' ' || c === '\n' || c === '\t' || c === '\r';
  function scramble(s, amt) {
    for (const t of s.texts) {
      let out = '';
      for (const c of t.o) {
        out += (isSpace(c) || Math.random() > amt) ? c : GLYPHS[(Math.random() * GLYPHS.length) | 0];
      }
      t.n.nodeValue = out;
    }
    s.mixed = true;
  }
  function restore(s) {
    if (!s.mixed) return;
    for (const t of s.texts) t.n.nodeValue = t.o;
    s.mixed = false;
  }

  /* ---------------------------------------------------------
     BIR EKRANGA SIG‘DIRISH
     Kontent sahnadan katta bo‘lsa, `zoom` bilan kichraytiramiz —
     sahifa hech qachon skroll bo‘lmaydi.
  --------------------------------------------------------- */
  function fitAll() {
    stations.forEach(restore);
    for (const s of stations) {
      const w = s.wrap;
      w.style.zoom = '';
      const cs = getComputedStyle(s.el);
      const availH = s.el.clientHeight - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom);
      let z = 1;
      for (let i = 0; i < 8; i++) {
        const h = w.getBoundingClientRect().height;
        const tooWide = w.scrollWidth > w.clientWidth + 1;
        if (h <= availH && !tooWide) break;
        z *= h > availH ? Math.min(.97, availH / h) : .94;
        z = Math.max(.4, z);
        w.style.zoom = z;
        if (z === .4) break;
      }
    }
  }

  /* ---------------------------------------------------------
     SHKALA
  --------------------------------------------------------- */
  let ppu = 14, dialW = 0;
  (function buildScale() {
    const frag = document.createDocumentFragment();
    for (let i = MIN; i <= MAX; i++) {
      const t = document.createElement('i');
      t.className = 't' + (i % 10 === 0 ? ' t--major' : i % 5 === 0 ? ' t--mid' : '');
      t.style.setProperty('--i', i);
      if (i % 10 === 0) {
        const l = document.createElement('span');
        l.textContent = String(i).padStart(3, '0');
        t.appendChild(l);
      }
      frag.appendChild(t);
    }
    stations.forEach((s) => {
      const b = document.createElement('span');
      b.className = 'mk' + (s.hidden ? ' mk--hidden' : '');
      b.style.setProperty('--f', s.f);
      b.textContent = s.hidden ? '?' : s.mark;
      frag.appendChild(b);
    });
    scale.appendChild(frag);
  })();

  /* ---------------------------------------------------------
     HARAKAT: chastota, tezlik, animatsiya
  --------------------------------------------------------- */
  let freq = 40, vel = 0, dragging = false, tween = null, snapT = 0;
  const easeIO = (t) => (t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
  const easeOut = (t) => 1 - Math.pow(1 - t, 3);

  function tweenTo(f, dur, ease = easeIO) {
    clearTimeout(snapT);
    vel = 0;
    f = clamp(f);
    if (reduce || dur <= 0) { freq = f; tween = null; return; }
    tween = { a: freq, b: f, t0: performance.now(), dur, ease };
  }
  function nearest(f = freq) {
    let best = stations[0];
    for (const s of stations) if (Math.abs(s.f - f) < Math.abs(best.f - f)) best = s;
    return best;
  }
  function snap() {
    if (dragging || tween || vel) return;
    const s = nearest();
    const d = Math.abs(s.f - freq);
    if (d > .001 && d < SNAP) tweenTo(s.f, 260 + d * 70, easeOut);
  }
  function settle(ms) { clearTimeout(snapT); snapT = setTimeout(snap, ms); }

  /* ---------------------------------------------------------
     CHIZISH (har kadr)
  --------------------------------------------------------- */
  let locked, lastF = '', lastBars = -1, lastName = '', lastScr = 0, noise = 1, best = stations[0], bestSig = 0;

  function render(now) {
    best = stations[0]; bestSig = 0;

    for (const s of stations) {
      const d = Math.abs(freq - s.f);
      let sig = d <= LOCK ? 1 : d >= BAND ? 0 : 1 - (d - LOCK) / (BAND - LOCK);
      sig = sig * sig * (3 - 2 * sig);
      if (sig > bestSig) { bestSig = sig; best = s; }

      if (Math.abs(sig - s.sig) > .002 || (sig === 1 && s.sig !== 1) || (sig === 0 && s.sig !== 0)) {
        s.sig = sig;
        const st = s.el.style;
        st.visibility = sig > 0 ? 'visible' : 'hidden';
        st.opacity = Math.pow(sig, 1.4).toFixed(3);
        st.filter = sig >= 1 ? 'none' : 'blur(' + ((1 - sig) * 10).toFixed(1) + 'px)';
        if (sig >= 1) restore(s);
      }
    }

    noise = 1 - bestSig;
    root.style.setProperty('--n', noise.toFixed(3));
    root.style.setProperty('--jit', !reduce && noise > .02 ? ((Math.random() - .5) * noise * 14).toFixed(1) : '0');

    if (!reduce && now - lastScr > 50) {
      lastScr = now;
      for (const s of stations) if (s.sig > 0 && s.sig < 1) scramble(s, Math.min(1, (1 - s.sig) * 1.15));
    }

    scale.style.transform = 'translate3d(' + (dialW / 2 - freq * ppu).toFixed(1) + 'px,0,0)';

    const fs = fmtF(freq);
    if (fs !== lastF) {
      lastF = fs;
      freqEl.textContent = fs;
    }
    const nb = Math.round(bestSig * 5);
    if (nb !== lastBars) {
      lastBars = nb;
      bars.forEach((b, i) => b.classList.toggle('on', i < nb));
    }

    const lock = bestSig >= 1 ? best : null;
    const nm = lock ? lock.name : bestSig > .4 ? (best.hidden ? '???' : best.name) : 'shovqin';
    if (nm !== lastName) { lastName = nm; nameEl.textContent = nm; }
    if (lock !== locked) onLock(lock);

    drawScope(now);
    if (sound) audioTick();
  }

  function onLock(s) {
    locked = s;
    root.classList.toggle('is-locked', !!s);
    stations.forEach((t) => { t.el.inert = t !== s; });
    airText.textContent = s ? 'Efirda' : 'Izlanmoqda';
    morse(s ? s.name : '');
    if (!s) return;

    live.textContent = fmtF(s.f) + ' — ' + s.name;
    document.title = fmtF(s.f) + ' · ' + s.name + ' — ' + AUTHOR;
    try {
      history.replaceState(null, '', s.id === 'salom' ? location.pathname + location.search : '#' + s.id);
    } catch (_) { /* file:// va h.k. */ }
    if (sound) blip();
  }

  /* ---------------------------------------------------------
     MORZE: chiroq stansiya nomini uzatadi
  --------------------------------------------------------- */
  const MORSE = {
    a: '.-', b: '-...', c: '-.-.', d: '-..', e: '.', f: '..-.', g: '--.', h: '....', i: '..', j: '.---',
    k: '-.-', l: '.-..', m: '--', n: '-.', o: '---', p: '.--.', q: '--.-', r: '.-.', s: '...', t: '-',
    u: '..-', v: '...-', w: '.--', x: '-..-', y: '-.--', z: '--..',
    0: '-----', 1: '.----', 2: '..---', 3: '...--', 4: '....-', 5: '.....', 6: '-....', 7: '--...', 8: '---..', 9: '----.',
  };
  let morseT = 0;
  function morse(text) {
    clearTimeout(morseT);
    lamp.classList.remove('dark');
    if (!text || reduce) return;
    const U = 120, seq = [];                       // [yoniqmi, birliklar]
    text.toLowerCase().split(/\s+/).forEach((word, wi) => {
      if (wi) seq.push([0, 7]);
      [...word].forEach((ch, ci) => {
        const code = MORSE[ch];
        if (!code) return;
        if (ci) seq.push([0, 3]);
        [...code].forEach((sym, si) => {
          if (si) seq.push([0, 1]);
          seq.push([1, sym === '.' ? 1 : 3]);
        });
      });
    });
    seq.push([1, 20]);                             // takrorlashdan oldin uzun yonish
    let i = 0;
    const step = () => {
      const [on, u] = seq[i];
      lamp.classList.toggle('dark', !on);
      i = (i + 1) % seq.length;
      morseT = setTimeout(step, u * U);
    };
    morseT = setTimeout(step, 1400);
  }

  /* ---------------------------------------------------------
     OSILLOSKOP
  --------------------------------------------------------- */
  const scope = $('#scope');
  const sctx = scope.getContext('2d');
  let sw = 0, sh = 0;
  function sizeScope() {
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    sw = scope.clientWidth; sh = scope.clientHeight;
    scope.width = Math.max(1, sw * dpr); scope.height = Math.max(1, sh * dpr);
    sctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  function drawScope(now) {
    if (!sw) return;
    sctx.clearRect(0, 0, sw, sh);
    const mid = sh / 2, amp = sh * .4, t = reduce ? 0 : now / 1000;
    // har stansiyaning o‘z "ovozi": to‘lqin soni va garmonikasi chastotadan
    const cyc = 3 + (best.f % 9);
    const harm = .15 + (best.f % 5) / 12;
    sctx.beginPath();
    for (let x = 0; x <= sw; x += 2) {
      const u = x / sw;
      const env = Math.sin(Math.PI * u);
      const ph = u * cyc * Math.PI * 2;
      let y = (Math.sin(ph - t * 4) + Math.sin(ph * 2.5 + t * 2.6) * harm) * amp * .75 * bestSig * env;
      const r = reduce ? Math.sin(x * 12.9898) * .5 : Math.random() - .5;
      y += r * amp * 1.8 * noise * env;
      if (x === 0) sctx.moveTo(x, mid + y); else sctx.lineTo(x, mid + y);
    }
    sctx.lineWidth = 1.2;
    sctx.strokeStyle = locked ? 'rgba(255, 91, 31, .95)' : 'rgba(240, 233, 218, .5)';
    sctx.stroke();
  }

  /* ---------------------------------------------------------
     SHOVQIN (canvas)
  --------------------------------------------------------- */
  const cv = $('#static');
  const ctx = cv.getContext('2d');
  let img, buf, cw = 0, ch = 0, seed = 0x9e3779b9 | 0, nf = 0, roll = 0;

  function sizeCanvas() {
    const k = innerWidth < 720 ? 2 : 3;
    cw = Math.max(1, Math.ceil(innerWidth / k));
    ch = Math.max(1, Math.ceil(innerHeight / k));
    cv.width = cw; cv.height = ch;
    img = ctx.createImageData(cw, ch);
    buf = new Uint32Array(img.data.buffer);
    drawNoise(true);
  }
  function drawNoise(force) {
    if (!force && (reduce || (nf++ & 1))) return;   // 30 kadr/s yetarli
    let s = seed;
    roll = (roll + 2 + noise * 6) % ch;
    const bandH = ch * .14, lift = 60 * noise;
    for (let y = 0, i = 0; y < ch; y++) {
      const inBand = (y - roll + ch) % ch < bandH;
      for (let x = 0; x < cw; x++, i++) {
        s ^= s << 13; s ^= s >>> 17; s ^= s << 5;
        let v = s & 255;
        if (inBand) { v += lift; if (v > 255) v = 255; }
        buf[i] = 0xff000000 | (v << 16) | (v << 8) | v;
      }
    }
    seed = s;
    ctx.putImageData(img, 0, 0);
  }

  /* ---------------------------------------------------------
     O‘LCHAMLAR
  --------------------------------------------------------- */
  let resizeT = 0;
  function measure() {
    ppu = innerWidth < 720 ? 10 : 14;
    scale.style.setProperty('--ppu', ppu + 'px');
    dialW = dial.clientWidth;
    sizeCanvas();
    sizeScope();
    fitAll();
  }
  addEventListener('resize', () => { clearTimeout(resizeT); resizeT = setTimeout(measure, 80); });

  /* ---------------------------------------------------------
     KIRITISH: g‘ildirak
  --------------------------------------------------------- */
  addEventListener('wheel', (e) => {
    if (e.ctrlKey) return;
    e.preventDefault();
    const vertical = Math.abs(e.deltaY) >= Math.abs(e.deltaX);
    let d = vertical ? e.deltaY : e.deltaX;
    if (e.deltaMode === 1) d *= 16; else if (e.deltaMode === 2) d *= innerHeight;
    tween = null; vel = 0;
    freq = clamp(freq + d * .02);
    settle(200);
  }, { passive: false });

  /* ---------------------------------------------------------
     KIRITISH: sudrash (shkala — har qanday; sahna — faqat barmoq)
  --------------------------------------------------------- */
  function dragger(el, unitsPerPx) {
    let p = null;
    el.addEventListener('pointerdown', (e) => {
      if (e.button !== 0) return;
      if (el === stageEl && e.target.closest('a, button, input, textarea, select')) return;
      p = { id: e.pointerId, x0: e.clientX, x: e.clientX, y: e.clientY, f: freq, hist: [], on: false, moved: 0 };
      if (el === dial) start(e);
    });
    function start(e) {
      p.on = true; p.x = e.clientX; p.f = freq;
      p.hist = [[performance.now(), freq]];
      dragging = true; tween = null; vel = 0; clearTimeout(snapT);
      try { el.setPointerCapture(e.pointerId); } catch (_) {}
      root.classList.add('is-dragging');
    }
    el.addEventListener('pointermove', (e) => {
      if (!p || e.pointerId !== p.id) return;
      p.moved = Math.max(p.moved, Math.abs(e.clientX - p.x0));
      if (!p.on) {
        const dx = e.clientX - p.x0, dy = e.clientY - p.y;
        if (Math.abs(dx) > 8 && Math.abs(dx) > Math.abs(dy) * 1.2) start(e);
        else if (Math.abs(dy) > 10) p = null;
        return;
      }
      freq = clamp(p.f - (e.clientX - p.x) * unitsPerPx());
      const now = performance.now();
      p.hist.push([now, freq]);
      while (p.hist.length > 2 && now - p.hist[0][0] > 100) p.hist.shift();
    });
    const end = (e) => {
      if (!p || e.pointerId !== p.id) return;
      if (p.on) {
        dragging = false;
        root.classList.remove('is-dragging');
        if (p.moved < 5) { settle(0); p = null; return; }
        const h0 = p.hist[0], h1 = p.hist[p.hist.length - 1];
        const dt = h1[0] - h0[0];
        vel = dt > 0 && performance.now() - h1[0] < 80 ? clamp((h1[1] - h0[1]) / dt * 16.7, -3, 3) : 0;
        if (Math.abs(vel) < .02) { vel = 0; settle(0); }
      }
      p = null;
    };
    el.addEventListener('pointerup', end);
    el.addEventListener('pointercancel', end);
  }

  // Shkalani sudrash va ekranni (barmoq yoki sichqoncha bilan) surish.
  // Tugma bosib sakrash yo‘q — to‘lqinni faqat burab topish mumkin.
  dragger(dial, () => 1 / ppu);
  // ekran kengligi bo‘ylab bitta to‘liq surish ≈ qo‘shni stansiyagacha masofa
  dragger(stageEl, () => 18 / Math.max(320, stageEl.clientWidth));

  /* ---------------------------------------------------------
     KIRITISH: klaviatura — faqat ovoz (M). Stansiyalar orasida
     klaviatura bilan sakrash ataylab yo‘q.
  --------------------------------------------------------- */
  addEventListener('keydown', (e) => {
    if (e.altKey || e.ctrlKey || e.metaKey) return;
    if (e.key === 'm' || e.key === 'M') toggleSound();
  });
  soundBtn.addEventListener('click', toggleSound);

  /* ---------------------------------------------------------
     OVOZ (ixtiyoriy, standart holatda o‘chiq)
  --------------------------------------------------------- */
  let sound = false, actx = null, nGain = null, lastAud = -1, offT = 0;

  function initAudio() {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return false;
    actx = new AC();
    const len = actx.sampleRate * 2;
    const b = actx.createBuffer(1, len, actx.sampleRate);
    const d = b.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    const src = actx.createBufferSource();
    src.buffer = b; src.loop = true;
    const bp = actx.createBiquadFilter();
    bp.type = 'bandpass'; bp.frequency.value = 2200; bp.Q.value = .5;
    nGain = actx.createGain(); nGain.gain.value = 0;
    src.connect(bp); bp.connect(nGain); nGain.connect(actx.destination);
    src.start();
    return true;
  }
  function audioTick() {
    const g = noise * .09;
    if (Math.abs(g - lastAud) < .002) return;
    lastAud = g;
    nGain.gain.setTargetAtTime(g, actx.currentTime, .04);
  }
  function blip() {
    const t = actx.currentTime;
    const o = actx.createOscillator(), g = actx.createGain();
    o.type = 'sine'; o.frequency.setValueAtTime(660, t); o.frequency.exponentialRampToValueAtTime(990, t + .08);
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(.05, t + .01);
    g.gain.exponentialRampToValueAtTime(.0001, t + .22);
    o.connect(g); g.connect(actx.destination);
    o.start(t); o.stop(t + .25);
  }
  function toggleSound() {
    if (!actx && !initAudio()) return;
    sound = !sound;
    clearTimeout(offT);
    if (sound) { actx.resume(); lastAud = -1; }
    else {
      nGain.gain.setTargetAtTime(0, actx.currentTime, .05);
      offT = setTimeout(() => { if (!sound) actx.suspend(); }, 400);
    }
    soundBtn.setAttribute('aria-pressed', String(sound));
  }

  /* ---------------------------------------------------------
     SOAT (O‘zbekiston vaqti)
  --------------------------------------------------------- */
  const clockEl = $('#clock');
  let tf;
  try {
    tf = new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Tashkent', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
  } catch (_) {
    tf = new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
  }
  const tickClock = () => { clockEl.textContent = tf.format(new Date()); };
  tickClock();
  setInterval(tickClock, 1000);

  /* ---------------------------------------------------------
     ASOSIY SIKL
  --------------------------------------------------------- */
  function frame(now) {
    if (tween) {
      const t = Math.min(1, (now - tween.t0) / tween.dur);
      freq = tween.a + (tween.b - tween.a) * tween.ease(t);
      if (t >= 1) { freq = tween.b; tween = null; }
    } else if (!dragging && vel) {
      freq += vel;
      vel *= .9;
      if (freq <= MIN || freq >= MAX) { freq = clamp(freq); vel = 0; }
      if (Math.abs(vel) < .004) { vel = 0; settle(60); }
    }
    render(now);
    drawNoise(false);
    requestAnimationFrame(frame);
  }

  /* ---------- start: shovqindan stansiyaga "sozlanib" kiramiz ---------- */
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  measure();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(fitAll);
  stations.forEach((s) => { s.el.inert = true; });
  const first = byId[location.hash.slice(1)] || byId.salom;
  freq = clamp(first.f - 16);
  tweenTo(first.f, 1900, easeOut);
  requestAnimationFrame(frame);
})();
