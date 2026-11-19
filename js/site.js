/* ULTIM8 Interactive Brand Guideline — behaviour (shared by every page) */
(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  /* run a feature only on pages that contain it */
  const when = (sel, fn) => { if ($(sel)) fn(); };
  const toast = msg => { const t = $('#toast'); t.textContent = msg; t.classList.add('is-on'); clearTimeout(toast.t); toast.t = setTimeout(() => t.classList.remove('is-on'), 1800); };

  /* ---------- decorate spreads: 8-spark columns + page folios (as in the book) ---------- */
  $$('.spread').forEach(s => {
    const sparks = Array(8).fill('<i data-u8="spark"></i>').join('');
    s.insertAdjacentHTML('beforeend', `<div class="sparks sparks--l" aria-hidden="true">${sparks}</div><div class="sparks sparks--r" aria-hidden="true">${sparks}</div>`);
    if (s.dataset.pages) { const [a, b] = s.dataset.pages.split('|'); s.insertAdjacentHTML('beforeend', `<div class="folio" aria-hidden="true"><b>${a}</b><span></span><span></span><b>${b}</b></div>`); }
  });
  u8.hydrate();
  /* no widows: keep the last two words of every text block together (fallback for browsers without text-wrap: pretty) */
  const noWidow = root => $$('p, li, h1, h2, h3, h4, figcaption, blockquote, .hint, .dd__name, .lv__name, .mood__intro', root).forEach(el => {
    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT); let last = null, n;
    while ((n = walker.nextNode())) if (n.nodeValue.trim()) last = n;
    if (!last || el.textContent.trim().split(/\s+/).length < 4) return;
    last.nodeValue = last.nodeValue.replace(/\s+(\S+)\s*$/, ' $1');
  });
  noWidow(document);
  /* land on the subtopic picked in a dropdown, after the page has been decorated */
  if (location.hash) {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    const jump = () => { const t = document.getElementById(decodeURIComponent(location.hash.slice(1))); if (t) t.scrollIntoView({ behavior: 'instant' }); };
    setTimeout(jump, 0); addEventListener('load', () => setTimeout(jump, 50), { once: true });
  }

  /* ---------- header: burger, dropdowns, progress ---------- */
  const menu = $('#navLinks'), burger = $('#burger');
  burger.addEventListener('click', () => { const o = menu.classList.toggle('is-open'); burger.setAttribute('aria-expanded', o); document.body.style.overflow = o ? 'hidden' : ''; });
  $$('.menu-item__toggle').forEach(t => t.addEventListener('click', () => {
    const li = t.closest('.menu-item'), open = !li.classList.contains('is-open');
    $$('.menu-item').forEach(x => { x.classList.remove('is-open'); $('.menu-item__toggle', x).setAttribute('aria-expanded', 'false'); });
    li.classList.toggle('is-open', open); t.setAttribute('aria-expanded', open);
  }));
  menu.addEventListener('click', e => { if (e.target.closest('a')) { menu.classList.remove('is-open'); document.body.style.overflow = ''; } });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') { $$('.menu-item').forEach(x => x.classList.remove('is-open')); document.activeElement?.blur(); } });
  const progress = $('#progress');
  const onScroll = () => { const h = document.documentElement; progress.style.width = (h.scrollTop / Math.max(1, h.scrollHeight - h.clientHeight) * 100) + '%'; };
  addEventListener('scroll', onScroll, { passive: true }); onScroll();

  /* ---------- reveal on scroll ---------- */
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } }), { threshold: .12 });
  $$('.reveal').forEach(el => io.observe(el));

  /* ---------- 8 transformation stage (shared) ---------- */
  function makeStage(el, keys) {
    el.innerHTML = keys.map(k => u8(k)).join('');
    const svgs = [...el.children]; let cur = -1;
    return idx => {
      if (idx === cur) return;
      svgs.forEach((s, i) => { s.classList.remove('is-on', 'is-out'); if (i === cur) s.classList.add('is-out'); });
      svgs[idx].classList.add('is-on'); cur = idx;
    };
  }
  const KEYS = u8.SERVICES.map(s => s.key), NAMES = u8.SERVICES.map(s => s.label);

  /* departments with an approved service 8 swap the big mark on hover / tap */
  function departments(stageSel, nameSel, listSel, scopeSel) {
    const set = makeStage($(stageSel), KEYS); set(0);
    const show = li => { const k = li.dataset.mark; const i = k ? KEYS.indexOf(k) : 0; set(i); $(nameSel).textContent = k ? NAMES[i] : 'Logo Mark'; $$(listSel).forEach(x => x.classList.toggle('is-on', x === li && !!k)); };
    $$(listSel).forEach(li => { li.addEventListener('mouseenter', () => show(li)); li.addEventListener('click', () => show(li)); });
    $(scopeSel).addEventListener('mouseleave', () => { set(0); $(nameSel).textContent = 'Logo Mark'; $$(listSel).forEach(x => x.classList.remove('is-on')); });
  }

  /* ================= HOMEPAGE ================= */
  when('#orbit', () => {
    const orbit = $('#orbit'), dims = $$('.orbit__dim', orbit); let i = 0, hold = false;
    const light = n => { dims.forEach((d, j) => d.classList.toggle('is-on', j === n)); orbit.classList.toggle('is-spin', n % 2 === 0); };
    dims.forEach((d, j) => { d.addEventListener('mouseenter', () => { hold = true; light(j); }); d.addEventListener('focus', () => { hold = true; light(j); }); d.addEventListener('click', () => { hold = true; light(j); }); });
    orbit.addEventListener('mouseleave', () => hold = false);
    setInterval(() => { if (!hold) light(i++ % 8); }, 1300);
  });
  when('#offerStage', () => departments('#offerStage', '#offerName', '.offer [data-tags] li', '.offer__grid'));

  /* ================= AISLE 01 ================= */
  when('#dims', () => {
    const dims = $$('#dims .dim'); let di = 0;
    setInterval(() => { if (!$('#dims').matches(':hover')) { dims.forEach(d => d.classList.remove('is-on')); dims[di++ % 8].classList.add('is-on'); } }, 1400);
  });
  when('#pantryStage', () => departments('#pantryStage', '#pantryName', '.pantry li', '.pantry'));
  when('#voiceChat', () => {
    const replies = {
      do: { cls: 'bubble--c', txt: '“We get it! Too many choices can be overwhelming. What matters most to you—price, quality, or convenience?”' },
      dont: { cls: 'bubble--c bubble--bad', txt: '“All the product details are already listed. Just compare them.”' }
    };
    $$('[data-voice]').forEach(b => b.addEventListener('click', () => {
      $$('[data-voice]').forEach(x => x.classList.toggle('is-on', x === b));
      const r = replies[b.dataset.voice], el = $('#voiceReply');
      el.className = 'bubble ' + r.cls; el.innerHTML = `<small>ULTIM8</small>${r.txt}`;
    }));
  });

  /* ================= AISLE 02 ================= */
  when('#monoStage', () => {
    const MONO = [
      { bg: 'var(--white)', logo: 'var(--orange)', name: 'Orange on white' },
      { bg: 'var(--orange)', logo: 'var(--white)', name: 'White on Ultim8 Orange' },
      { bg: 'var(--deep)', logo: 'var(--white)', name: 'White on Deep Orange' },
      { bg: 'var(--peach)', logo: 'var(--ink)', name: 'Black on Peach' },
      { bg: 'var(--butter)', logo: 'var(--ink)', name: 'Black on Buttercream' },
      { img: 'shopper-focused', logo: 'var(--white)', name: 'White on photography', cls: 'is-photo' },
      { img: 'shopper-cereal', logo: 'var(--white)', name: 'White on photography', cls: 'is-photo' },
      { img: 'pharmacy-interior', logo: 'var(--ink)', name: 'Black on light photography', cls: 'is-photo-light' }
    ];
    const monoStage = $('#monoStage'), monoGrid = $('#monoGrid');
    MONO.forEach((m, i) => {
      if (i > 5 && innerWidth < 640) return;
      const b = document.createElement('button');
      b.setAttribute('aria-label', m.name);
      b.style.background = m.img ? `url(assets/img/photos/${m.img}.jpg) center/cover` : m.bg;
      if (m.bg === 'var(--white)') b.style.boxShadow = 'inset 0 0 0 1px var(--grey)';
      b.innerHTML = u8('wordmark'); b.querySelector('svg').style.color = m.logo;
      b.addEventListener('click', () => setMono(i)); monoGrid.appendChild(b);
    });
    function setMono(i) {
      const m = MONO[i];
      monoStage.className = 'mono__stage ' + (m.cls || '');
      monoStage.style.background = m.img ? `url(assets/img/photos/${m.img}.jpg) center/cover` : m.bg;
      monoStage.style.boxShadow = m.bg === 'var(--white)' ? 'inset 0 0 0 1px var(--grey)' : 'none';
      monoStage.querySelector('svg').style.color = m.logo;
      $$('button', monoGrid).forEach((b, j) => b.classList.toggle('is-on', j === i));
    }
    setMono(1);
  });

  /* LOGO DO'S AND DON'TS: two containers, same navigation (big view + caption + thumbnails) */
  when('#logo-dos', () => {
    const P = 'assets/img/photos/';
    const DOS = [
      { bg: 'var(--white)', logo: 'var(--orange)', name: 'Ultim8 Orange on white' },
      { bg: 'var(--orange)', logo: 'var(--white)', name: 'White on Ultim8 Orange' },
      { bg: 'var(--deep)', logo: 'var(--white)', name: 'White on Deep Orange' },
      { bg: 'var(--peach)', logo: 'var(--ink)', name: 'Black on Peach' },
      { bg: 'var(--butter)', logo: 'var(--ink)', name: 'Black on Buttercream' },
      { bg: 'url(assets/brand/svg/pattern-diamond.svg) 0 100% / 70% auto repeat-x var(--orange)', logo: 'var(--white)', name: 'White on the diamond pattern' },
      { bg: 'var(--white)', logo: 'var(--orange)', name: 'Minimum size, with clear space', small: true },
      { bg: `url(${P}shopper-focused.jpg) center/cover`, logo: 'var(--white)', name: 'White on photography', cls: 'is-photo' },
      { bg: `url(${P}shopper-cereal.jpg) center/cover`, logo: 'var(--white)', name: 'White on photography', cls: 'is-photo' },
      { bg: `url(${P}pharmacy-interior.jpg) center/cover`, logo: 'var(--ink)', name: 'Black on light photography', cls: 'is-photo-light' }
    ];
    const DONTS = [
      'Don’t change the logo color', 'Don’t rearrange the logo elements', 'Don’t stack or repeat the 8',
      'Don’t resize parts of the logo', 'Don’t cut or crop the letters', 'Don’t add outlines or strokes',
      'Don’t use an outline-only logo', 'Don’t use low-contrast colors', 'Don’t place it on busy patterns'
    ];
    const doStage = $('#doStage'), doGrid = $('#doGrid'), dontImg = $('#dontImg'), dontGrid = $('#dontGrid');
    const cur = { do: 0, dont: 0 };
    const paint = (el, d) => {
      el.style.background = d.bg;
      el.style.boxShadow = d.bg === 'var(--white)' ? 'inset 0 0 0 1px var(--grey)' : 'none';
    };
    DOS.forEach((d, i) => {
      const b = document.createElement('button'); b.setAttribute('aria-label', d.name);
      b.className = (d.cls || '') + (d.small ? ' is-small' : '');
      paint(b, d); b.innerHTML = u8('wordmark'); b.querySelector('svg').style.color = d.logo;
      b.addEventListener('click', () => setDo(i)); doGrid.appendChild(b);
    });
    function setDo(i) {
      const d = DOS[i];
      doStage.className = 'dd__stage ' + (d.cls || '') + (d.small ? ' is-small' : '');
      paint(doStage, d); doStage.querySelector('svg').style.color = d.logo;
      cur.do = i;
      $('#doName').textContent = d.name;
      $$('button', doGrid).forEach((b, j) => b.classList.toggle('is-on', j === i));
    }
    DONTS.forEach((name, i) => {
      const b = document.createElement('button'); b.setAttribute('aria-label', name);
      b.style.backgroundImage = `url(assets/img/book/donts/dont-${i + 1}.png?v=2)`;
      b.addEventListener('click', () => setDont(i)); dontGrid.appendChild(b);
    });
    function setDont(i) {
      dontImg.src = `assets/img/book/donts/dont-${i + 1}.png?v=2`; dontImg.alt = DONTS[i];
      cur.dont = i;
      $('#dontName').textContent = DONTS[i];
      $$('button', dontGrid).forEach((b, j) => b.classList.toggle('is-on', j === i));
    }
    /* slider arrows: step left / right through each container */
    $$('.dd__arrow').forEach(a => a.addEventListener('click', () => {
      const k = a.dataset.dd, n = k === 'do' ? DOS.length : DONTS.length, i = (cur[k] + +a.dataset.step + n) % n;
      (k === 'do' ? setDo : setDont)(i);
    }));
    setDo(0); setDont(0);
  });

  when('#roomBox', () => {
    const room = $('#roomBox'), roomSvg = $('svg', room), roomRange = $('#roomSize');
    function drawRoom() {
      const h = +roomRange.value, vb = U8_MARKS.wordmark.vb, w = h * vb[2] / vb[3], x = h / 2;
      roomSvg.style.height = h + 'px'; roomSvg.style.width = w + 'px';
      room.style.padding = x + 'px';
      $$('.room__x, .room__guide', room).forEach(e => e.remove());
      [[0, 0], [1, 0], [0, 1], [1, 1]].forEach(([cx, cy]) => room.insertAdjacentHTML('beforeend', `<span class="room__x" style="width:${x}px;height:${x}px;${cx ? 'right' : 'left'}:0;${cy ? 'bottom' : 'top'}:0">X</span>`));
      room.insertAdjacentHTML('beforeend', `<span class="room__guide" style="top:${x + h / 2}px"></span>`);
      $('#roomOut').textContent = `X = ${Math.round(x)}px`;
      /* show when the logo is too big: its clear space no longer fits the box */
      const stage = $('#roomStage'), warn = $('#roomWarn');
      if (stage && warn) {
        const tight = room.offsetWidth > stage.clientWidth - 24 || room.offsetHeight > stage.clientHeight - 24;
        stage.classList.toggle('is-tight', tight); warn.classList.toggle('is-on', tight);
      }
    }
    roomRange.addEventListener('input', drawRoom); addEventListener('resize', drawRoom); drawRoom();
  });

  when('.expired__img', () => {
    const expImg = $('.expired__img'); let fresh = false;
    const freshGrid = document.createElement('div'); freshGrid.className = 'tiles'; freshGrid.style.display = 'none';
    freshGrid.innerHTML = Array(9).fill(0).map((_, i) => {
      const bg = i > 5 ? ['var(--orange)', 'var(--deep)', 'var(--butter)'][i - 6] : 'var(--white)';
      const c = i > 5 ? ['var(--white)', 'var(--ink)', 'var(--ink)'][i - 6] : 'var(--orange)';
      return `<div class="tile" style="background:${bg};color:${c};border-color:${i > 5 ? bg : 'var(--grey)'}"><span class="tick">✓</span>${u8('wordmark')}</div>`;
    }).join('');
    expImg.after(freshGrid);
    $('#expiredFix').addEventListener('click', e => {
      fresh = !fresh; expImg.style.display = fresh ? 'none' : ''; freshGrid.style.display = fresh ? 'grid' : 'none';
      e.target.textContent = fresh ? 'Show Expired' : 'Show Fresh';
    });
  });

  /* "MOOD-SHIFT" TETRADIC SWATCH BAR: four brand colors per mood, draggable shares, live on-brand check */
  when('#moodShift', () => {
    const C = {
      orange: ['Ultim8 Orange', '#F26522'], deep: ['Deep Orange', '#CB3727'], peach: ['Peach', '#FDD3BB'],
      butter: ['Buttercream', '#FFF2D5'], yellow: ['Sunshine Yellow', '#FFC83D'], grey: ['Neutral Gray', '#E6E7E8'], white: ['White', '#FFFFFF']
    };
    const ROLES = ['Dominant', 'Secondary', 'Support', 'Accent'];
    const MOODS = [
      { name: 'Energetic', cols: ['orange', 'white', 'deep', 'yellow'], pct: [60, 25, 10, 5], title: 'Fresh picks.<br>Less to decide.' },
      { name: 'Welcoming', cols: ['butter', 'orange', 'peach', 'deep'], pct: [60, 25, 10, 5], title: 'Welcome in.<br>We’ve got you.' },
      { name: 'Calm', cols: ['white', 'grey', 'peach', 'orange'], pct: [60, 25, 10, 5], title: 'Less noise.<br>More clarity.' },
      { name: 'Celebration', cols: ['deep', 'orange', 'yellow', 'white'], pct: [60, 25, 10, 5], title: 'Big savings.<br>More to enjoy.' }
    ];
    const lum = hex => { const c = [1, 3, 5].map(i => parseInt(hex.substr(i, 2), 16) / 255).map(v => v <= .03928 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4); return .2126 * c[0] + .7152 * c[1] + .0722 * c[2]; };
    const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + .05) / (y + .05); };
    const best = bg => ratio(bg, '#111111') >= ratio(bg, '#FFFFFF') ? '#111111' : '#FFFFFF';
    const bar = $('#moodBar'), legend = $('#moodLegend'), chips = $('#moodChips');
    let mood = 0, cols = [], pct = [];
    chips.innerHTML = MOODS.map((m, i) => `<button class="chip" role="tab" data-i="${i}">${m.name}</button>`).join('');
    function load(i) {
      mood = i; cols = [...MOODS[i].cols]; pct = [...MOODS[i].pct];
      $$('button', chips).forEach((b, j) => { b.classList.toggle('is-on', j === i); b.setAttribute('aria-selected', j === i); });
      $('#moodTitle').innerHTML = MOODS[i].title; draw();
    }
    function draw() {
      bar.innerHTML = cols.map((k, i) => `<button class="mood__seg" data-i="${i}" style="flex:${pct[i]};background:${C[k][1]};color:${best(C[k][1])}" aria-label="${C[k][0]} ${C[k][1]}, ${Math.round(pct[i])}%"><b>${Math.round(pct[i])}%</b><span>${C[k][0]}</span></button>` + (i < 3 ? `<span class="mood__handle" data-h="${i}" aria-hidden="true"></span>` : '')).join('');
      legend.innerHTML = cols.map((k, i) => `<span><i style="background:${C[k][1]}"></i>${ROLES[i]} · ${C[k][0]} <em>${C[k][1]}</em></span>`).join('');
      paint();
    }
    function paint() {
      const [d, s, sp, a] = cols.map(k => C[k][1]), card = $('#moodCard');
      card.style.background = d; card.style.color = best(d);
      $('#moodStrip').style.background = `linear-gradient(90deg, ${s} 0 ${pct[1] / (pct[1] + pct[2]) * 100}%, ${sp} 0)`;
      const tag = $('#moodTag'); tag.style.background = sp; tag.style.color = best(sp);
      const btn = $('#moodBtn'); btn.style.background = a; btn.style.color = best(a);
      $$('.mood__seg', bar).forEach((el, i) => { el.style.flex = pct[i]; el.querySelector('b').textContent = Math.round(pct[i]) + '%'; });
      /* on-brand check */
      const tips = [], txt = ratio(d, best(d)), acc = ratio(a, d);
      const yi = cols.indexOf('yellow');
      if (yi > -1 && pct[yi] > 10.5) tips.push(['warn', `Sunshine Yellow is an accent only: keep it at 10% or less (now ${Math.round(pct[yi])}%).`]);
      if (pct[0] < 50) tips.push(['warn', `Let one color lead: the dominant color should be about 60% (now ${Math.round(pct[0])}%).`]);
      if (pct[3] > 15) tips.push(['warn', `Accents work best small: keep the accent around 10% (now ${Math.round(pct[3])}%).`]);
      if (!cols.some(k => ['orange', 'deep'].includes(k))) tips.push(['warn', 'Add Ultim8 Orange or Deep Orange so the layout still reads as ULTIM8.']);
      if (acc < 1.5) tips.push(['warn', 'The accent blends into the background: rotate roles so the call to action stands out.']);
      tips.push([txt >= 4.5 ? 'ok' : 'warn', `Text contrast on the background: ${txt.toFixed(1)}:1 ${txt >= 4.5 ? '(passes AA)' : '(below 4.5:1, too light to read)'}`]);
      const bad = tips.filter(t => t[0] === 'warn').length;
      $('#moodScore').innerHTML = bad ? `<b>${bad} thing${bad > 1 ? 's' : ''} to fix</b>` : '<b>On brand</b> — balanced and easy to read';
      $('#moodScore').className = 'mood__score ' + (bad ? 'is-warn' : 'is-ok');
      $('#moodTips').innerHTML = tips.map(([t, m]) => `<li class="is-${t}">${m}</li>`).join('');
    }
    /* drag the dividers between colors */
    let drag = null;
    bar.addEventListener('pointerdown', e => {
      const h = e.target.closest('.mood__handle'); if (!h) return;
      drag = { i: +h.dataset.h }; h.setPointerCapture(e.pointerId); e.preventDefault();
    });
    bar.addEventListener('pointermove', e => {
      if (!drag) return;
      const r = bar.getBoundingClientRect(), i = drag.i;
      const before = pct.slice(0, i).reduce((x, y) => x + y, 0), pair = pct[i] + pct[i + 1];
      let p = (e.clientX - r.left) / r.width * 100 - before;
      p = Math.max(2, Math.min(pair - 2, p)); pct[i] = p; pct[i + 1] = pair - p; paint();
    });
    const end = () => { if (drag) { drag = null; draw(); } };
    bar.addEventListener('pointerup', end); bar.addEventListener('pointercancel', end);
    bar.addEventListener('click', e => {
      const seg = e.target.closest('.mood__seg'); if (!seg) return;
      const hex = C[cols[+seg.dataset.i]][1]; navigator.clipboard?.writeText(hex).catch(() => {}); toast(`${hex} copied`);
    });
    $$('button', chips).forEach(b => b.addEventListener('click', () => load(+b.dataset.i)));
    $('#moodRotate').addEventListener('click', () => { cols.push(cols.shift()); draw(); });
    $('#moodReset').addEventListener('click', () => load(mood));
    load(0);
  });

  /* ALL LOGO VARIATIONS: the original logo's own pieces move into each variation
     Primary Logo → Logo Type → Stacked Logo → Logo Mark → Tagline Logo */
  when('#logoMorph', () => {
    const box = $('#logoMorph'), parts = {}; $$('.lv__p', box).forEach(g => parts[g.dataset.p] = g);
    const ring = $('.lv__ring', box), name = $('#lvName'), steps = $('#lvSteps');
    const row2 = [-239.4, 121.7];
    /* each state: global fit (k, ox, oy) + per-piece local move [scale, tx, ty, opacity] */
    const STATES = [
      { name: 'Primary Logo', g: [1.15, -31.2, 3.0], p: { U: [1, 0, 0, 1], L: [1, 0, 0, 1], T: [1, 0, 0, 1], I: [1, 0, 0, 1], M: [1, 0, 0, 1], P8: [1, 0, 0, 0], D8: [1, 0, 0, 1] } },
      { name: 'Logo Type', g: [1.15, -31.2, 3.0], p: { U: [1, 0, 0, 1], L: [1, 0, 0, 1], T: [1, 0, 0, 1], I: [1, 0, 0, 1], M: [1, 0, 0, 1], P8: [1, 0, 0, 1], D8: [1, 0, 0, 0] } },
      { name: 'Stacked Logo', g: [0.68, 185.6, 103.8], p: { U: [1, 0, 0, 1], L: [1, 0, 0, 1], T: [1, 0, 0, 1], I: [1, ...row2, 1], M: [1, ...row2, 1], P8: [1, ...row2, 1], D8: [1.868, -736.9, -296.2, 1] } },
      { name: 'Logo Mark', g: [2.6, -958.1, -207.5], p: { U: [1, 0, 0, 0], L: [1, 0, 0, 0], T: [1, 0, 0, 0], I: [1, 0, 0, 0], M: [1, 0, 0, 0], P8: [1, 0, 0, 0], D8: [1, 0, 0, 1] } },
      { name: 'Tagline Logo', g: [1.418, -382.2, -35.9], ring: true, p: { U: [1, 0, 0, 0], L: [1, 0, 0, 0], T: [1, 0, 0, 0], I: [1, 0, 0, 0], M: [1, 0, 0, 0], P8: [1, 0, 0, 0], D8: [1, 0, 0, 1] } }
    ];
    steps.innerHTML = STATES.map((st, i) => `<button data-i="${i}">${st.name}</button>`).join('');
    let cur = 0, timer = null;
    function show(i) {
      cur = (i + STATES.length) % STATES.length; const st = STATES[cur], [k, ox, oy] = st.g;
      Object.entries(st.p).forEach(([key, [a, tx, ty, op]]) => {
        const el = parts[key]; if (!el) return;
        el.style.transform = `translate(${ox + k * tx}px, ${oy + k * ty}px) scale(${k * a})`;
        el.style.opacity = op;
      });
      ring.style.opacity = st.ring ? 1 : 0;
      name.textContent = st.name;
      $$('button', steps).forEach((b, j) => b.classList.toggle('is-on', j === cur));
    }
    const play = () => { clearInterval(timer); timer = setInterval(() => { if (!box.matches(':hover')) show(cur + 1); }, 2400); };
    $$('button', steps).forEach(b => b.addEventListener('click', () => { show(+b.dataset.i); play(); }));
    show(0); play();
  });

  /* LOGO MARK SLIDER: the 8 transforms through every approved service variation */
  when('#slider8', () => {
    const setStage = makeStage($('#stage8'), KEYS);
    const ticks = $('#s8Ticks'), range = $('#s8Range');
    ticks.innerHTML = u8.SERVICES.map((s, i) => `<button data-i="${i}" aria-label="${s.label}">${u8(s.key)}<span>${s.label}</span></button>`).join('');
    $('#applyApp').innerHTML = '<div class="stage8" style="width:60px;height:60px;color:var(--white)"></div>';
    const appSet = makeStage($('.stage8', $('#applyApp')), KEYS);
    $('#applySign').innerHTML = `<div class="stage8" style="width:44px;height:56px;color:var(--white)"></div><b id="signName">Logo Mark</b>`;
    const signSet = makeStage($('.stage8', $('#applySign')), KEYS);
    let s8 = 0, timer = null;
    function go8(i) {
      s8 = (i + 7) % 7; setStage(s8); appSet(s8); signSet(s8);
      range.value = s8; $('#s8Name').textContent = NAMES[s8]; $('#s8Count').textContent = `${s8 + 1} / 7`;
      $('#signName').textContent = s8 ? NAMES[s8] : 'ULTIM8';
      $$('button', ticks).forEach((b, j) => b.classList.toggle('is-on', j === s8));
    }
    const play = $('#s8Play');
    function stop8() { clearInterval(timer); timer = null; play.textContent = 'Play'; }
    ticks.addEventListener('click', e => { const b = e.target.closest('button'); if (b) { stop8(); go8(+b.dataset.i); } });
    range.addEventListener('input', () => { stop8(); go8(+range.value); });
    play.addEventListener('click', () => { if (timer) return stop8(); play.textContent = 'Pause'; go8(s8 + 1); timer = setInterval(() => go8(s8 + 1), 1600); });
    $('#slider8').addEventListener('keydown', e => { if (e.key === 'ArrowRight') { stop8(); go8(s8 + 1); } if (e.key === 'ArrowLeft') { stop8(); go8(s8 - 1); } });
    let sx = null; const st = $('#stage8');
    st.addEventListener('pointerdown', e => sx = e.clientX);
    st.addEventListener('pointerup', e => { if (sx !== null && Math.abs(e.clientX - sx) > 30) { stop8(); go8(s8 + (e.clientX < sx ? 1 : -1)); } sx = null; });
    go8(0);
    new IntersectionObserver((es, o) => es.forEach(e => { if (e.isIntersecting && !timer) { play.click(); setTimeout(() => timer && stop8(), 1600 * 7); o.disconnect(); } }), { threshold: .5 }).observe($('#slider8'));
  });

  when('#tagLangs', () => $$('#tagLangs .chip').forEach(b => b.addEventListener('click', () => {
    $$('#tagLangs .chip').forEach(x => x.classList.toggle('is-on', x === b));
    const img = $('#tagImg'); img.style.opacity = 0;
    setTimeout(() => { img.src = `assets/img/book/tagline-${b.dataset.lang}.png`; img.alt = 'Tagline logo, ' + b.textContent; img.style.opacity = 1; }, 200);
  })));

  when('#swatches', () => {
    const PAL = [
      ['Primary Colors - 60%', [['Ultim8 Orange', '#F26522'], ['Pure White', '#FFFFFF']]],
      ['Secondary Colors - 30%', [['Ultim8 Deep Orange', '#CB3727'], ['Buttercream', '#FFF2D5'], ['Peach', '#FDD3BB'], ['Neutral Gray', '#E6E7E8']]],
      ['Accent Color - 10%', [['Sunshine Yellow', '#FFC83D']]]
    ];
    $('#swatches').innerHTML = PAL.map(([h, cs]) => `<div><h4>${h}</h4><div class="swatch-row">${cs.map(([n, hex]) => `<button class="swatch" data-hex="${hex}"><i style="background:${hex}">${u8('spark')}</i>${n}<br>${hex}</button>`).join('')}</div></div>`).join('');
    $$('.swatch').forEach(b => b.addEventListener('click', () => { navigator.clipboard?.writeText(b.dataset.hex).catch(() => {}); toast(`Copied ${b.dataset.hex}`); }));
  });

  /* ================= AISLE 03 ================= */
  $$('.pattern-view').forEach(v => {
    const box = $('.pattern-box', v), r = $('input[type=range]', v), out = $('output', v), unit = box.dataset.unit;
    r.min = box.dataset.min; r.max = box.dataset.max; r.value = box.dataset.val;
    const set = () => { box.style.backgroundSize = r.value + unit + ' auto'; out.textContent = unit === '%' ? Math.round(r.value / box.dataset.val * 100) + '%' : r.value + 'px'; };
    r.addEventListener('input', set); set();
  });
  when('#diamondText', () => $('#diamondText').addEventListener('click', e => { const on = $('#diamondView').classList.toggle('is-text'); e.target.classList.toggle('is-on', on); }));

  /* FONT USAGE: a size bar under every line */
  when('#typeTester', () => $$('#typeTester .type-row').forEach(row => {
    const txt = row.querySelector('[contenteditable]'), r = row.querySelector('.type-size input'), out = row.querySelector('.type-size output');
    if (!r) return;
    r.addEventListener('input', () => { txt.style.fontSize = r.value + 'px'; out.textContent = r.value + ' px'; });
  }));


  /* PATTERNS MIX: one slider for all three patterns, with brand color options */
  when('#patternSlider', () => {
    const NAMES = { logo: 'Logo Pattern', diamond: 'Diamond Pattern', campaign: 'Campaign Pattern' };
    const SIZE = { logo: 'center / 220% auto no-repeat', diamond: '0 0 / 260px auto repeat', campaign: 'center / 120% auto no-repeat' };
    const COLORS = [
      ['Ultim8 Orange + White', '#F26522', '#FFFFFF'], ['White + Ultim8 Orange', '#FFFFFF', '#F26522'],
      ['Deep Orange + Peach', '#CB3727', '#FDD3BB'], ['Buttercream + Ultim8 Orange', '#FFF2D5', '#F26522'], ['Peach + Deep Orange', '#FDD3BB', '#CB3727']
    ];
    const slides = $$('.pm__slide'), dots = $$('#pmDots button'), svg = {};
    let cur = 0, col = 0;
    $('#pmColors').innerHTML = COLORS.map(([n, bg, fg], i) => `<button class="pm__swatch ${i ? '' : 'is-on'}" data-c="${i}" aria-label="${n}" title="${n}"><i style="background:${bg}"></i><i style="background:${fg}"></i><span>${n}</span></button>`).join('');
    async function paint() {
      const [, bg, fg] = COLORS[col];
      await Promise.all(slides.map(async el => {
        const p = el.dataset.p;
        if (!svg[p]) svg[p] = await fetch(`assets/brand/svg/pattern-${p}.svg`).then(r => r.text());
        /* diamond: orange ground with white shapes; logo + campaign: orange shapes on a clear ground */
        const s = p === 'diamond' ? svg[p].replace(/#F26522/gi, '__BG__').replace(/#FFFFFF/gi, fg).replace(/__BG__/g, bg) : svg[p].replace(/#F26522/gi, fg);
        el.style.background = `url("data:image/svg+xml;charset=utf-8,${encodeURIComponent(s)}") ${SIZE[p]} ${bg}`;
      }));
    }
    function go(i) {
      cur = (i + slides.length) % slides.length;
      $('#pmTrack').style.transform = `translateX(${-cur * 100}%)`;
      $('#pmName').textContent = NAMES[slides[cur].dataset.p];
      dots.forEach((d, j) => d.classList.toggle('is-on', j === cur));
    }
    $$('[data-pm]').forEach(b => b.addEventListener('click', () => go(cur + +b.dataset.pm)));
    dots.forEach((d, j) => d.addEventListener('click', () => go(j)));
    $$('.pm__swatch').forEach(b => b.addEventListener('click', () => { col = +b.dataset.c; $$('.pm__swatch').forEach(x => x.classList.toggle('is-on', x === b)); paint(); }));
    paint(); go(0);
  });

  /* ICONS: every icon gets the same height inside its (identical, square) box */
  when('#icons-bites .icon-grid', () => {
    const sec = $('#icons-bites'), grid = $('#icons-bites .icon-grid');
    const fit = () => { const tile = grid.querySelector('button')?.getBoundingClientRect().width || 0; if (tile) sec.style.setProperty('--ih', Math.round(tile * 0.5) + 'px'); };
    addEventListener('resize', fit); addEventListener('load', fit); fit();
  });

  when('#iconGrid', () => {
    const ICONS = [
      ['i10', 'Search', 'Find a product, search an aisle or a service.'],
      ['i11', 'Restrooms', 'Accessibility and facilities wayfinding. Built from the 8, C and I of Pacaembu.'],
      ['i12', 'Shopping List', 'Lists, orders and receipts.'],
      ['i13', 'Compare', 'Compare & Choose — weigh price, quality and features.'],
      ['i15', 'Cart', 'Add to cart, review your cart.'],
      ['i16', 'Print', 'Print your shopping list at the kiosk.'],
      ['i14', 'Recipe', 'Shop by Recipe and Taste & Try.'],
      ['spark', 'Spark', 'The diamond-shaped spark from inside the 8 — intelligent guidance, clarity and balance.']
    ];
    const grid = $('#iconGrid'), det = $('#iconDetail');
    grid.innerHTML = ICONS.map(([k, n], i) => `<button data-i="${i}" aria-label="${n}">${u8(k)}</button>`).join('');
    function showIcon(i) {
      const [k, n, d] = ICONS[i];
      if (det) det.innerHTML = `<div class="icon-detail__big">${u8(k)}</div><div><h4>${n}</h4><p>${d}</p><div class="icon-sizes">${[48, 32, 24, 16].map(s => `<span style="height:${s}px;display:block">${u8(k)}</span>`).join('')}</div></div>`;
      $$('button', grid).forEach((b, j) => b.classList.toggle('is-on', j === i));
    }
    grid.addEventListener('click', e => { const b = e.target.closest('button'); if (b) showIcon(+b.dataset.i); });
    grid.addEventListener('mouseover', e => { const b = e.target.closest('button'); if (b) showIcon(+b.dataset.i); });
    showIcon(0);
  });

  when('#gridCanvas', () => {
    let cols = 12;
    function drawGrid() {
      const W = Math.max(100, +$('#gW').value || 1920), H = Math.max(100, +$('#gH').value || 1080), gut = +$('#gGut').value / 100;
      const m = Math.max(W, H) / 20, g = m * gut, colW = (W - 2 * m - (cols - 1) * g) / cols;
      const maxW = $('#gridCanvas').parentElement.clientWidth - 56, maxH = 340, s = Math.min(maxW / W, maxH / H);
      const c = $('#gridCanvas'); c.style.width = W * s + 'px'; c.style.height = H * s + 'px';
      $('#gridMargin').style.borderWidth = m * s + 'px';
      const gc = $('#gridCols'); Object.assign(gc.style, { left: m * s + 'px', right: m * s + 'px', top: m * s + 'px', bottom: m * s + 'px', gridTemplateColumns: `repeat(${cols},1fr)`, columnGap: g * s + 'px' });
      gc.innerHTML = '<div></div>'.repeat(cols);
      $('#gGutLbl').textContent = Math.round(gut * 100) + '%';
      $('#gOut').innerHTML = `<span>Margin <b>${+m.toFixed(1)}px</b></span><span>Gutter <b>${+g.toFixed(1)}px</b></span><span>Column <b>${+colW.toFixed(1)}px</b></span><span>Columns <b>${cols}</b></span>`;
      $$('#gCols .chip').forEach(b => b.classList.toggle('is-on', +b.dataset.c === cols));
    }
    $$('#gCols .chip').forEach(b => b.addEventListener('click', () => { cols = +b.dataset.c; drawGrid(); }));
    ['#gW', '#gH', '#gGut'].forEach(s => $(s).addEventListener('input', drawGrid));
    $$('[data-preset]').forEach(b => b.addEventListener('click', () => { const [w, h] = b.dataset.preset.split('x'); $('#gW').value = w; $('#gH').value = h; cols = w / h < .9 ? 6 : 12; drawGrid(); }));
    addEventListener('resize', drawGrid); drawGrid();
  });

  when('#picksRow', () => {
    let round = 0, score = 0;
    function drawRound() {
      const row = $('#picksRow');
      if (round > 2) { $('#picksMsg').textContent = `You picked ${score} of 3 right. ${score === 3 ? 'Perfect picks!' : 'Bright, natural and clear is always the pick.'}`; row.innerHTML = `<button class="btn" style="grid-column:1/-1;aspect-ratio:auto;background:var(--orange);border:0" id="picksAgain">Try Again</button>`; $('#picksAgain').onclick = () => { round = score = 0; drawRound(); }; return; }
      $('#picksMsg').textContent = `Round ${round + 1} of 3 — tap the photo that follows our rules.`;
      const flip = Math.random() < .5, pos = col => `${col * 100}% ${round * 50}%`;
      const a = `<button data-ok="1" style="background-image:url(assets/img/photos/picture-picks.jpg);background-position:${pos(0)}" aria-label="Photo A"></button>`;
      const b = `<button data-ok="0" style="background-image:url(assets/img/photos/picture-picks.jpg);background-position:${pos(1)}" aria-label="Photo B"></button>`;
      row.innerHTML = flip ? b + a : a + b;
      $$('button', row).forEach(btn => btn.onclick = () => {
        const ok = btn.dataset.ok === '1'; if (ok) score++;
        $$('button', row).forEach(x => x.classList.add(x.dataset.ok === '1' ? 'right' : 'wrong'));
        $('#picksMsg').textContent = ok ? 'Right pick — bright, natural and clear.' : 'Not quite — the orange-framed photo follows our rules.';
        setTimeout(() => { round++; drawRound(); }, 1300);
      });
    }
    drawRound();
  });

  when('#beautyPoster', () => {
    const HOT = [[6, 4, 88, 50], [6, 4, 40, 10], [0, 0, 100, 100], [6, 14, 80, 36], [40, 4, 58, 60], [0, 58, 100, 42], [0, 0, 100, 100]];
    const poster = $('#beautyPoster'); const hot = document.createElement('div'); hot.className = 'beauty__hot'; poster.appendChild(hot);
    $$('#beautyList li').forEach(li => {
      const on = () => { const [x, y, w, h] = HOT[+li.dataset.hot]; Object.assign(hot.style, { left: x + '%', top: y + '%', width: w + '%', height: h + '%' }); hot.classList.add('is-on'); $$('#beautyList li').forEach(l => l.classList.toggle('is-on', l === li)); };
      li.addEventListener('mouseenter', on); li.addEventListener('click', on);
    });
    $('#beautyList').addEventListener('mouseleave', () => hot.classList.remove('is-on'));
  });

  /* ================= BRAND LOOK: scrolling over the box changes the image + caption; outside it, the page scrolls ================= */
  when('#brand-look', () => {
    const sec = $('#brand-look'), frame = $('.look__frame', sec), imgs = $$('.look__img', sec), caps = $$('.look__cap', sec), dots = $$('.look__dots i', sec), n = imgs.length;
    let cur = 0, acc = 0, lock = 0;
    const show = i => { cur = Math.max(0, Math.min(n - 1, i)); [imgs, caps, dots].forEach(list => list.forEach((el, k) => el.classList.toggle('is-on', k === cur))); };
    frame.addEventListener('wheel', e => {
      const d = e.deltaY;
      /* past the first / last image, let the page scroll on */
      if ((d > 0 && cur === n - 1) || (d < 0 && cur === 0)) { acc = 0; return; }
      e.preventDefault();
      if (Date.now() < lock) return;
      acc += d;
      if (Math.abs(acc) > 40) { show(cur + (acc > 0 ? 1 : -1)); acc = 0; lock = Date.now() + 450; }
    }, { passive: false });
    /* swipe on touch screens */
    let sx = null;
    frame.addEventListener('touchstart', e => { sx = e.touches[0].clientX; }, { passive: true });
    frame.addEventListener('touchend', e => { if (sx === null) return; const dx = e.changedTouches[0].clientX - sx; if (Math.abs(dx) > 40) show(cur + (dx < 0 ? 1 : -1)); sx = null; });
    dots.forEach((d, k) => { d.style.cursor = 'pointer'; d.addEventListener('click', () => show(k)); });
    show(0);
  });

  /* ================= AISLE 04 ================= */
  when('#kioskFrame', () => {
    const frame = $('#kioskFrame');
    const kioskGo = screen => frame.contentWindow?.postMessage({ u8kiosk: screen }, '*');
    $$('[data-kiosk]').forEach(b => b.addEventListener('click', () => { $('#kiosk').scrollIntoView({ behavior: 'smooth', block: 'center' }); setTimeout(() => kioskGo(b.dataset.kiosk), 500); }));
    $('#kioskRestart').addEventListener('click', () => kioskGo('restart'));
  });
  when('#notes', () => $$('#notes .note').forEach(n => n.addEventListener('click', () => $$('#notes .note').forEach(x => x.classList.toggle('is-on', x === n)))));
  when('#scentPhoto', () => {
    const dimL = $('#scentDimL'), dimR = $('#scentDimR');
    function scentAt(i) {
      const w = 100 / 3; dimL.style.left = 0; dimL.style.width = (i * w) + '%'; dimR.style.left = ((i + 1) * w) + '%'; dimR.style.right = 0; dimR.style.width = ((2 - i) * w) + '%';
      $$('#touchpoints button').forEach(b => b.classList.toggle('is-on', +b.dataset.i === i));
    }
    $$('#touchpoints button').forEach(b => b.addEventListener('click', () => scentAt(+b.dataset.i))); scentAt(0);
  });
  when('#bagSteps', () => {
    const steps = $$('#bagSteps span'); let bs = 0;
    setInterval(() => { steps.forEach((s, i) => { s.style.background = i === bs ? 'var(--orange)' : ''; s.style.color = i === bs ? 'var(--white)' : ''; }); bs = (bs + 1) % steps.length; }, 1100);
  });
  when('#apparelTabs', () => $$('#apparelTabs .chip').forEach(b => b.addEventListener('click', () => {
    $$('#apparelTabs .chip').forEach(x => x.classList.toggle('is-on', x === b));
    $('#apparelImg').src = `assets/img/photos/${b.dataset.img}.jpg`; $('#apparelImg').alt = b.textContent;
  })));

  /* ================= AISLE 05 ================= */
  when('#workflow', () => {
    const wf = $$('#workflow li'); let w = 0;
    setInterval(() => { wf.forEach((li, i) => { li.classList.toggle('is-on', i === w); li.classList.toggle('is-done', i < w); }); w = (w + 1) % (wf.length + 1); }, 1200);
  });
  $$('[data-copy]').forEach(b => b.addEventListener('click', e => {
    e.preventDefault(); e.stopPropagation();
    const det = b.closest('details'), body = det.querySelector('.acc__body').cloneNode(true);
    body.querySelectorAll('[data-copy]').forEach(x => x.remove());
    const txt = det.querySelector('summary').textContent.trim() + '\n' + (body.innerText || body.textContent).trim();
    navigator.clipboard?.writeText(txt).catch(() => {}); toast('Prompt copied');
  }));
  when('#checklist', () => {
    const boxes = $$('#checklist input');
    let saved = []; try { saved = JSON.parse(localStorage.getItem('u8-checklist') || '[]'); } catch (e) {}
    boxes.forEach((b, i) => { b.checked = !!saved[i]; b.addEventListener('change', upd); });
    function upd() {
      const n = boxes.filter(b => b.checked).length;
      $('#checkMeter').style.width = n / 7 * 100 + '%'; $('#checkCount').textContent = `${n} of 7 checked`;
      $('#approved').classList.toggle('is-on', n === 7);
      try { localStorage.setItem('u8-checklist', JSON.stringify(boxes.map(b => b.checked))); } catch (e) {}
    }
    upd();
  });
})();
