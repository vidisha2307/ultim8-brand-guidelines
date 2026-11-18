/* ULTIM8 AI Kiosk — interactive prototype
   Four Key Functions: Find a Product · Shop by Recipe · Compare & Choose · Your Past Orders
   + Review Your Cart · Print Shopping List (final cart only) · Proceed to Purchase */
(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const IMG = n => `../assets/img/products/${n}.png`;
  const money = n => '$' + n.toFixed(2);
  const TAX = 0.07;

  /* ---------------- store data ---------------- */
  const AISLES = ['Fresh Produce', 'Bakery', 'Dairy & Eggs', 'Frozen Foods', 'Pantry Staples', 'Meat & Seafood', 'Snacks & Beverages', 'Household Essentials', 'Personal Care'];
  const CATS = [
    { id: 'produce', name: 'Fresh Produce', aisle: 1, subs: ['All', 'Fruits', 'Vegetables', 'Herbs', 'Salads', 'Organic', 'Seasonal'] },
    { id: 'dairy', name: 'Dairy & Eggs', aisle: 3, subs: ['All', 'Milk', 'Eggs', 'Plant-based'] },
    { id: 'meat', name: 'Meat & Seafood', aisle: 6, note: 'Fresh cuts and seafood are prepared to order at our service counter.' },
    { id: 'pantry', name: 'Pantry Staples', aisle: 5, subs: ['All', 'Pasta & Sauces', 'International'] },
    { id: 'snacks', name: 'Snacks & Beverages', aisle: 7, note: 'Chips, cookies, juices and sparkling water — all in one aisle.' },
    { id: 'frozen', name: 'Frozen Foods', aisle: 4, note: 'Frozen meals, vegetables and desserts, kept cold along the back wall.' },
    { id: 'household', name: 'Household Essentials', aisle: 8, note: 'Cleaning supplies, paper goods and laundry care.' },
    { id: 'personal', name: 'Personal Care', aisle: 9, note: 'Skin, hair and oral care — right next to the Pharmacy.' }
  ];
  const P = {};
  [
    ['banana', 'Banana', 'produce', ['Fruits'], '1 lb (approx. 3–4 pcs)', .59, 'A', 'Naturally sweet and ready to grab for breakfast or a snack.', { Type: 'Fruit', 'Key Benefits': 'Source of potassium', 'Dietary Notes': 'Vegan' }],
    ['apple', 'Gala Apple', 'produce', ['Fruits', 'Organic'], '1 lb (approx. 3–4 pcs)', 1.29, 'A', 'Crisp, mildly sweet apples that are great for lunchboxes.', { Type: 'Fruit', 'Key Benefits': 'Source of fiber', 'Dietary Notes': 'Vegan' }],
    ['broccoli', 'Broccoli', 'produce', ['Vegetables'], '1 lb', 1.49, 'C', 'Fresh crowns for steaming, roasting or stir fry.', { Type: 'Vegetable', 'Key Benefits': 'Source of vitamin C', 'Dietary Notes': 'Vegan' }],
    ['tomato', 'Tomato', 'produce', ['Vegetables'], '1 lb (approx. 4–5 pcs)', 1.99, 'C', 'Vine-ripened tomatoes for salads, sauces and tacos.', { Type: 'Vegetable', 'Key Benefits': 'Source of vitamin C', 'Dietary Notes': 'Vegan' }],
    ['carrots', 'Carrots', 'produce', ['Vegetables', 'Organic'], '1 lb (approx. 4–6 pcs)', 1.29, 'D', 'Sweet, crunchy carrots for snacking and cooking.', { Type: 'Vegetable', 'Key Benefits': 'Source of vitamin A', 'Dietary Notes': 'Vegan' }],
    ['pepper', 'Red Bell Pepper', 'produce', ['Vegetables'], '1 lb (approx. 2–3 pcs)', 1.99, 'D', 'Bright, sweet peppers that add color to any meal.', { Type: 'Vegetable', 'Key Benefits': 'Source of vitamin C', 'Dietary Notes': 'Vegan' }],
    ['spinach', 'Spinach', 'produce', ['Vegetables', 'Salads', 'Organic'], '1 bunch (approx. 7 oz)', 1.79, 'E', 'Tender leaves for salads, smoothies and sautés.', { Type: 'Leafy green', 'Key Benefits': 'Source of iron', 'Dietary Notes': 'Vegan' }],
    ['strawberries', 'Strawberries', 'produce', ['Fruits', 'Seasonal'], '1 lb (approx. 16 pcs)', 3.49, 'B', 'Juicy berries, perfect for smoothies and desserts.', { Type: 'Fruit', 'Key Benefits': 'Source of vitamin C', 'Dietary Notes': 'Vegan' }],
    ['orange', 'Navel Orange', 'produce', ['Fruits', 'Seasonal'], '1 lb (approx. 2–3 pcs)', 1.49, 'B', 'Easy-to-peel, seedless and full of juice.', { Type: 'Fruit', 'Key Benefits': 'Source of vitamin C', 'Dietary Notes': 'Vegan' }],
    ['milk-2', '2% Milk', 'dairy', ['Milk'], '1 gallon', 3.49, 'A', 'Reduced-fat milk for everyday cereal, coffee and cooking.', { Type: 'Dairy', 'Fat Content': '2%', 'Calories (per cup)': '120', 'Key Benefits': 'Good source of calcium', 'Dietary Notes': 'Gluten-free' }],
    ['milk-whole', 'Whole Milk', 'dairy', ['Milk'], '1 gallon', 3.69, 'A', 'Rich and creamy whole milk.', { Type: 'Dairy', 'Fat Content': 'Whole (3.25%)', 'Calories (per cup)': '150', 'Key Benefits': 'Rich in nutrients and calcium', 'Dietary Notes': 'Gluten-free' }],
    ['milk-oat', 'Oat Milk', 'dairy', ['Milk', 'Plant-based'], '1 gallon', 3.99, 'B', 'Smooth, plant-based milk made from oats.', { Type: 'Plant-based', 'Fat Content': 'N/A', 'Calories (per cup)': '120', 'Key Benefits': 'Dairy-free, good source of calcium', 'Dietary Notes': 'Gluten-free, Vegan' }],
    ['milk-carton', '2% Milk', 'dairy', ['Milk'], '½ gallon', 2.29, 'A', 'The same 2% milk in a smaller carton.', { Type: 'Dairy', 'Fat Content': '2%', 'Calories (per cup)': '120', 'Key Benefits': 'Good source of calcium', 'Dietary Notes': 'Gluten-free' }],
    ['eggs', 'Large Eggs', 'dairy', ['Eggs'], '12 count', 3.29, 'C', 'Grade A large eggs.', { Type: 'Eggs', 'Key Benefits': 'Source of protein', 'Dietary Notes': 'Gluten-free' }],
    ['pasta', 'Penne Pasta', 'pantry', ['Pasta & Sauces'], '16 oz', 1.89, 'B', 'Classic penne that holds sauce beautifully.', { Type: 'Pasta', 'Key Benefits': 'Ready in 11 minutes', 'Dietary Notes': 'Vegan' }],
    ['tomato-sauce', 'Tomato Sauce', 'pantry', ['Pasta & Sauces'], '24 oz jar', 2.49, 'B', 'Slow-simmered tomato sauce with herbs.', { Type: 'Sauce', 'Key Benefits': 'Ready to heat', 'Dietary Notes': 'Vegan, Gluten-free' }],
    ['taco-shells', 'Taco Shells', 'pantry', ['International'], '12 count', 2.99, 'D', 'Crunchy corn taco shells.', { Type: 'Tortilla', 'Key Benefits': 'Ready to fill', 'Dietary Notes': 'Gluten-free' }]
  ].forEach(([id, name, cat, subs, unit, price, shelf, desc, spec]) => {
    const c = CATS.find(c => c.id === cat);
    P[id] = { id, name, cat, subs, unit, price, shelf, desc, spec, img: IMG(id), aisle: c.aisle };
  });
  const L = (name, qty, aisle) => ({ list: true, name, qty, aisle });
  const RECIPES = [
    { id: 'pasta', name: 'Pasta Primavera', mins: 20, tags: ['Lunch', 'Dinner', 'Vegetarian'], img: IMG('r-pasta'),
      items: [['pasta', 1], ['tomato', 1], ['broccoli', 1], ['pepper', 1], ['spinach', 1], ['tomato-sauce', 1]] },
    { id: 'stirfry', name: 'Chicken Stir Fry', mins: 25, tags: ['Dinner'], img: IMG('r-stirfry'),
      items: [['broccoli', 1], ['pepper', 1], ['carrots', 1], ['spinach', 1], L('Chicken breast', '1.5 lb', 6), L('Soy sauce', '1 bottle', 5), L('Garlic', '1 bulb', 1), L('Jasmine rice', '1 bag', 5)] },
    { id: 'tacos', name: 'Veggie Tacos', mins: 20, tags: ['Lunch', 'Dinner', 'Vegetarian'], img: IMG('r-tacos'),
      items: [['taco-shells', 1], ['tomato', 1], ['pepper', 1], ['spinach', 1], L('Black beans', '1 can', 5), L('Shredded cheese', '8 oz', 3), L('Limes', '2 pcs', 1)] },
    { id: 'smoothie', name: 'Fruit Smoothie', mins: 10, tags: ['Breakfast', 'Snacks', 'Vegetarian'], img: IMG('r-smoothie'),
      items: [['strawberries', 1], ['banana', 1], ['orange', 1], ['milk-oat', 1], L('Greek yogurt', '32 oz', 3)] }
  ];
  const ORDERS = [
    { no: '10245', date: 'Oct 12, 2026', paid: 34.28, items: [['banana', 3], ['apple', 3], ['broccoli', 2], ['milk-carton', 2], ['eggs', 2]] },
    { no: '10198', date: 'Sep 28, 2026', paid: 22.15, items: [['banana', 2], ['apple', 2], ['broccoli', 1], ['milk-carton', 2], ['orange', 1]] },
    { no: '10132', date: 'Sep 10, 2026', paid: 27.90, items: [['carrots', 2], ['tomato', 2], ['taco-shells', 2], ['tomato-sauce', 2], ['pasta', 2]] }
  ];
  const LISTS = [
    { name: 'Weekly Basics', items: ['banana', 'milk-2', 'eggs', 'apple', 'spinach'] },
    { name: 'Taco Night', items: ['taco-shells', 'tomato', 'pepper', 'spinach'] },
    { name: 'Smoothie Mornings', items: ['strawberries', 'banana', 'milk-oat', 'orange'] }
  ];

  /* ---------------- state ---------------- */
  const S = { cart: {}, list: [], compare: ['milk-2', 'milk-whole', 'milk-oat'], cmpStart: 0, cmpPick: null, history: [], screen: 'welcome',
    find: { cat: 'produce', sub: 'All', q: '' }, recTab: 'All', ordTab: 'All Orders', ordQ: '', serves: 4, recipeOff: {}, method: null };
  const view = $('#view'), screenEl = $('#screen');

  /* ---------------- helpers ---------------- */
  const qty = id => S.cart[id] || 0;
  const cartCount = () => Object.values(S.cart).reduce((a, b) => a + b, 0) + S.list.length;
  const subtotal = () => Object.entries(S.cart).reduce((t, [id, q]) => t + P[id].price * q, 0);
  function setQty(id, q, silent) {
    const before = qty(id);
    if (q <= 0) delete S.cart[id]; else S.cart[id] = q;
    updateBadge();
    if (!silent && q > before) toast(`${P[id].name} added to your cart`, "View Cart", () => go("cart"));
    rerenderBits();
  }
  function addList(item) {
    if (S.list.some(l => l.name === item.name)) return;
    S.list.push({ name: item.name, qty: item.qty, aisle: item.aisle }); updateBadge();
  }
  function updateBadge() {
    $('#cartCount').textContent = cartCount();
    const c = $('.kh__cart'); c.classList.remove('bump'); void c.offsetWidth; c.classList.add('bump');
  }
  function addBtn(id) {
    const q = qty(id);
    return q ? `<div class="stepper stepper--o" data-step="${id}"><button data-d="-1" aria-label="Remove one">−</button><span>${q}</span><button data-d="1" aria-label="Add one">+</button></div>`
      : `<button class="kb" data-add="${id}">${u8("i15")}Add Item</button>`;
  }
  function rerenderBits() {
    $$('[data-slot]').forEach(el => { el.innerHTML = addBtn(el.dataset.slot); el.closest('.pc')?.classList.toggle('in', !!qty(el.dataset.slot)); });
    if (S.screen === 'cart') render(true);
    if (S.screen === 'recipe') render(true);
  }
  const loc = p => `Aisle ${p.aisle} · Shelf ${p.shelf}`;
  function productCard(p, opts = {}) {
    return `<article class="pc ${qty(p.id) ? 'in' : ''}">
      <button class="pc__img" data-detail="${p.id}" aria-label="More about ${p.name}"><img src="${p.img}" alt=""></button>
      <h3>${p.name}</h3><div class="unit">${p.unit}</div>
      ${opts.loc ? `<div class="loc">${loc(p)}</div>` : ''}
      <div class="price">${money(p.price)}</div>
      <div class="act" data-slot="${p.id}">${addBtn(p.id)}</div></article>`;
  }
  function pageHead(title, sub, right = '') {
    return `<div class="ph"><button class="ph__back" data-back>Back</button><div><h1>${title}</h1>${sub ? `<p>${sub}</p>` : ''}</div><div>${right}</div></div>`;
  }
  function searchBox(id, ph, val = '') {
    return `<label class="search">${u8('i10')}<input id="${id}" type="search" placeholder="${ph}" value="${val.replace(/"/g, '&quot;')}" autocomplete="off">${val ? `<button data-clear="${id}" aria-label="Clear search">Clear</button>` : ''}</label>`;
  }
  function sidebar(active) {
    return `<nav class="side" aria-label="Categories">${CATS.map(c => {
      const n = Object.values(P).filter(p => p.cat === c.id).length;
      return `<button class="${c.id === active ? 'on' : ''}" data-cat="${c.id}"><span>${c.name}</span><small>${n || 'Aisle ' + c.aisle}</small></button>`;
    }).join('')}</nav>`;
  }
  function findResults(cols) {
    const f = S.find, q = f.q.trim().toLowerCase();
    if (q) {
      const hits = Object.values(P).filter(p => (p.name + ' ' + p.subs.join(' ') + ' ' + CATS.find(c => c.id === p.cat).name).toLowerCase().includes(q));
      const catHit = CATS.filter(c => c.name.toLowerCase().includes(q) && !hits.some(h => h.cat === c.id));
      if (!hits.length && !catHit.length) return `<div class="empty"><div><h3>Hmm, we couldn’t find “${f.q}”.</h3><p>Let’s narrow this down — try a simpler word like “milk” or “apple”, or ask a ULTIM8 Helper nearby.</p><div class="acts"><button class="kb" data-help>Call Helper</button><button class="kb kb--ghost" data-clear="${cols === 6 ? 'homeSearch' : 'findSearch'}">Clear Search</button></div></div></div>`;
      return `<p class="note-line">${hits.length} result${hits.length === 1 ? '' : 's'} for “${f.q}”</p><div class="grid ${cols === 6 ? 'grid--6' : ''}">${hits.map(p => productCard(p, { loc: true })).join('')}</div>` +
        catHit.map(c => aisleCard(c)).join('');
    }
    const cat = CATS.find(c => c.id === f.cat);
    const items = Object.values(P).filter(p => p.cat === cat.id && (f.sub === 'All' || p.subs.includes(f.sub)));
    if (!cat.subs) return aisleCard(cat);
    if (!items.length) return `<div class="empty"><div><h3>${f.sub} are restocking today.</h3><p>Fresh ${f.sub.toLowerCase()} are on their way to Aisle ${cat.aisle}. A ULTIM8 Helper can tell you when they arrive.</p></div></div>`;
    return `<div class="grid ${cols === 6 ? 'grid--6' : ''}">${items.map(p => productCard(p, { loc: cols !== 6 })).join('')}</div>`;
  }
  function aisleCard(c) {
    const added = S.list.some(l => l.name === c.name);
    return `<div class="empty" style="margin-top:20px"><div><h3>${c.name} is in Aisle ${c.aisle}.</h3><p>${c.note || ''} We’ll add it to your shopping list so you don’t forget.</p>
      <div class="acts"><button class="kb" data-listadd="${c.id}" ${added ? 'disabled' : ''}>${added ? "On List" : "Add Reminder"}</button><button class="kb kb--ghost" data-map="${c.aisle}">Show Map</button></div></div>
      <div style="width:520px">${mapHtml(c.aisle)}</div></div>`;
  }
  function mapHtml(aisle) {
    return `<div class="map">${AISLES.map((a, i) => `<div class="${i + 1 === aisle ? 'on' : ''}"><b>${i + 1}</b>${a.replace(' & ', ' &amp; ')}</div>`).join('')}</div><div class="map-you"><i></i>You are here — Kiosk 2, by Aisle 1</div>`;
  }
  function browse(prefix, cols) {
    const f = S.find, cat = CATS.find(c => c.id === f.cat);
    return `<div class="with-side">${sidebar(f.cat)}<div>
      ${cols === 6 ? `<div class="section-h"><h2>${f.q ? 'Search results' : cat.name}</h2>${searchBox('homeSearch', 'Search produce...', f.q)}</div>` : `<div class="section-h"><h2 style="font-size:52px">${f.q ? 'Search results' : cat.name}</h2></div>`}
      ${!f.q && cat.subs ? `<div class="tabs">${cat.subs.map(s => `<button class="${s === f.sub ? 'on' : ''}" data-sub="${s}">${s}</button>`).join('')}</div>` : '<div style="height:20px"></div>'}
      <div id="${prefix}Results">${findResults(cols)}</div></div></div>`;
  }

  /* ---------------- screens ---------------- */
  const SCREENS = {
    welcome: () => `<section class="welcome" data-start>
      <div><i data-u8="wordmark" class="welcome__logo"></i>
        <h1>Find the right products for your next meal.</h1>
        <p>Search, get recipe ideas, compare options and print your shopping list — all in one place.</p>
        <button class="kb" data-start>Start Shopping</button>
        <div class="welcome__tap">Touch anywhere to begin</div>
      </div>
      <div class="welcome__lock"><img src="../assets/brand/tagline.png" alt="Less to Decide. More to Enjoy."></div></section>`,

    home: () => `<div class="page">
      <div class="hello"><small>WELCOME TO ULTIM8</small><h1>How would you<br>like to shop today?</h1>
        <p>Find products, get inspired, compare options and create your shopping list — all in one place.</p></div>
      <div class="cards">
        <button class="card card--1" data-go="find"><i data-u8="i10"></i><h2>Find a Product</h2><p>Search for your favorite items</p><span class="circle-go"></span><img src="${IMG('hero-apple')}" alt=""></button>
        <button class="card card--2" data-go="recipes"><i data-u8="i14"></i><h2>Shop by Recipe</h2><p>Get ingredients for your favorite meals</p><span class="circle-go"></span><img src="${IMG('hero-pasta')}" alt=""></button>
        <button class="card card--3" data-go="compare"><i data-u8="i13"></i><h2>Compare &amp; Choose</h2><p>See options and find what’s right for you</p><span class="circle-go"></span><img src="${IMG('hero-milk')}" alt=""></button>
        <button class="card card--4" data-go="orders"><i data-u8="i12"></i><h2>Your Past Orders</h2><p>Quickly reorder your favorites</p><span class="circle-go"></span><img src="${IMG('hero-bag')}" alt=""></button>
      </div>
      ${browse('home', 6)}</div>`,

    find: () => `<div class="page">${pageHead('Find a Product', 'Search for your favorite items.', searchBox('findSearch', 'Search products, brands, or categories...', S.find.q))}${browse('find', 4)}</div>`,

    recipes: () => {
      const tabs = ['All', 'Breakfast', 'Lunch', 'Dinner', 'Snacks', 'Vegetarian'];
      const list = RECIPES.filter(r => S.recTab === 'All' || r.tags.includes(S.recTab));
      return `<div class="page">${pageHead('Quick &amp; Easy Recipes', 'Shop ingredients for your favorite meals.')}
        <div class="tabs">${tabs.map(t => `<button class="${t === S.recTab ? 'on' : ''}" data-rtab="${t}">${t}</button>`).join('')}</div>
        <div class="grid">${list.map(r => `<article class="rc"><img src="${r.img}" alt=""><div><h3>${r.name}</h3><span class="meta">${r.mins} mins • ${r.items.length} items</span><button class="kb" data-recipe="${r.id}">View Ingredients</button></div></article>`).join('')}</div></div>`;
    },

    recipe: () => {
      const r = RECIPES.find(x => x.id === S.recipeId), f = S.serves / 4, off = S.recipeOff[r.id] || {};
      let total = 0;
      const rows = r.items.map((it, i) => {
        const on = !off[i];
        if (Array.isArray(it)) {
          const p = P[it[0]], q = Math.max(1, Math.round(it[1] * f)); if (on) total += p.price * q;
          return `<div class="ing__row ${on ? '' : 'off'}" data-ing="${i}"><span class="tick"></span><span class="ing__img"><img src="${p.img}" alt=""></span><div><h4>${p.name}</h4><small>${q} × ${p.unit}</small></div><span class="ing__loc">${loc(p)}</span><span class="ing__price">${money(p.price * q)}</span></div>`;
        }
        return `<div class="ing__row ${on ? '' : 'off'}" data-ing="${i}"><span class="tick"></span><span class="ing__img">${AISLES[it.aisle - 1]}</span><div><h4>${it.name}</h4><small>${it.qty}${f !== 1 ? ` (for ${S.serves})` : ''}</small></div><span class="ing__loc">Aisle ${it.aisle}</span><span class="ing__price" style="font-size:19px;color:var(--soft)">on your list</span></div>`;
      }).join('');
      const n = r.items.filter((_, i) => !off[i]).length;
      return `<div class="page">${pageHead(r.name, 'Your ready-to-shop ingredient list, with quantities and where to find them.')}
        <div class="recipe"><div class="recipe__hero"><img src="${r.img}" alt=""><h2>${r.name}</h2><span class="meta">${r.mins} mins • ${r.items.length} items • ${r.tags.join(', ')}</span>
          <div class="recipe__serves">Serves<div class="stepper"><button data-serves="-2" aria-label="Fewer servings">−</button><span>${S.serves}</span><button data-serves="2" aria-label="More servings">+</button></div></div></div>
          <div><div class="ing">${rows}</div>
            <div class="ing__foot"><div><b>${n} of ${r.items.length} items · ${money(total)}</b><div style="font-size:20px;color:var(--soft)">Tap an item to leave it out. Items without a price go on your shopping list.</div></div>
            <button class="kb kb--lg" data-addrecipe ${n ? '' : 'disabled'}>${u8('i15')}Add Items</button></div></div></div></div>`;
    },

    compare: () => {
      const ids = S.compare, start = Math.min(S.cmpStart, Math.max(0, ids.length - 3)), shown = ids.slice(start, start + 3);
      const rows = [...new Set(shown.flatMap(id => Object.keys(P[id].spec)))];
      const slots = [...shown]; while (slots.length < 3) slots.push(null);
      const head = slots.map(id => {
        if (!id) return `<div><button class="cmp__add" data-cmppicker><b>+</b>Add Product</button></div>`;
        const p = P[id];
        return `<div><div class="cmp__item ${S.cmpPick === id ? 'pick' : ''}">${S.cmpPick === id ? '<span class="badge">Our pick for you</span>' : ''}
          <button class="cmp__x" data-cmprm="${id}" aria-label="Remove ${p.name}">×</button>
          <div><h3>${p.name}</h3><div class="unit">${p.unit}</div><div class="price">${money(p.price)}</div></div><img src="${p.img}" alt="">
          <div class="act" data-slot="${id}">${addBtn(id)}</div></div></div>`;
      }).join('');
      return `<div class="page">${pageHead('Compare &amp; Choose', 'Compare similar products to find what’s right for you.', `<button class="kb kb--ghost" data-cmppicker>${u8('i13')}Compare (${ids.length})</button>`)}
        <div class="helper">${u8('mark8')}<p>We get it! Too many choices can be overwhelming. What matters most to you—price, quality, or convenience?</p>
          <div class="chipset">${['Price', 'Quality', 'Convenience'].map(k => `<button class="chipk ${S.cmpWhy === k ? 'on' : ''}" data-why="${k}">${k}</button>`).join('')}</div></div>
        <div class="cmp"><button class="cmp__nav" data-cmpnav="-1" ${start === 0 ? 'disabled' : ''} aria-label="Previous products"></button>
          <div class="cmp__table"><div class="cmp__row cmp__head"><div></div>${head}</div>
            ${rows.map(r => `<div class="cmp__row"><div>${r}</div>${slots.map(id => `<div>${id ? (P[id].spec[r] || '—') : ''}</div>`).join('')}</div>`).join('')}
            <div class="cmp__row"><div>Location</div>${slots.map(id => `<div>${id ? loc(P[id]) : ''}</div>`).join('')}</div></div>
          <button class="cmp__nav cmp__nav--r" data-cmpnav="1" ${start + 3 >= ids.length ? 'disabled' : ''} aria-label="Next products"></button></div>
        ${S.cmpWhy ? `<p class="note-line" style="margin-top:20px;font-size:22px">${whyText()}</p>` : ''}</div>`;
    },

    orders: () => {
      const tabs = ['All Orders', 'Frequently Bought', 'Lists'];
      let body = '';
      if (S.ordTab === 'All Orders') {
        const q = S.ordQ.trim().toLowerCase();
        const list = ORDERS.filter(o => !q || o.no.includes(q) || o.date.toLowerCase().includes(q) || o.items.some(([id]) => P[id].name.toLowerCase().includes(q)));
        body = list.length ? list.map(o => {
          const n = o.items.reduce((a, [, c]) => a + c, 0), now = o.items.reduce((t, [id, c]) => t + P[id].price * c, 0);
          return `<article class="oc ${S.openOrder === o.no ? 'open' : ''}"><div class="meta"><h3>Order #${o.no}</h3>${o.date}<br>${n} items</div>
            <div class="thumbs">${o.items.map(([id]) => `<span><img src="${P[id].img}" alt="${P[id].name}"></span>`).join('')}</div>
            <div class="total">${money(o.paid)}</div><button class="kb" data-reorder="${o.no}">${u8("i15")}Add All</button>
            <button class="more ${S.openOrder === o.no ? 'open' : ''}" data-openorder="${o.no}" aria-label="Order details"></button>            <div class="oc__detail">${o.items.map(([id, c]) => `<div class="oc__line"><img src="${P[id].img}" alt=""><b>${P[id].name}</b><span>Qty ${c}</span><span>${money(P[id].price * c)}</span><div data-slot="${id}">${addBtn(id)}</div></div>`).join('')}
              <p class="note-line" style="margin:6px 0 0">Today’s prices apply — this order would be ${money(now)} today.</p></div></article>`;
        }).join('') : `<div class="empty"><div><h3>No orders match “${S.ordQ}”.</h3><p>Try an order number or a product name, like “banana”.</p></div></div>`;
      } else if (S.ordTab === 'Frequently Bought') {
        const freq = {}; ORDERS.forEach(o => o.items.forEach(([id, c]) => freq[id] = (freq[id] || 0) + c));
        body = `<div class="grid">${Object.entries(freq).sort((a, b) => b[1] - a[1]).map(([id, n]) => productCard(P[id]).replace('<h3>', `<div class="loc">Bought ${n} times</div><h3>`)).join('')}</div>`;
      } else {
        body = `<div class="grid" style="grid-template-columns:repeat(3,1fr)">${LISTS.map((l, i) => `<div class="list-card"><h3>${l.name}</h3><div style="font-size:21px;color:var(--soft)">${l.items.length} items · ${money(l.items.reduce((t, id) => t + P[id].price, 0))}</div>
          <div class="thumbs">${l.items.map(id => `<span><img src="${P[id].img}" alt="${P[id].name}"></span>`).join('')}</div><button class="kb" data-addlist="${i}">${u8("i15")}Add List</button></div>`).join('')}</div>`;
      }
      return `<div class="page">${pageHead('Your Past Orders', 'Quickly reorder your favorites.', S.ordTab === 'All Orders' ? searchBox('orderSearch', 'Search past orders...', S.ordQ) : '')}
        <div class="with-side">${sidebar('')}<div><div class="tabs">${tabs.map(t => `<button class="${t === S.ordTab ? 'on' : ''}" data-otab="${t}">${t}</button>`).join('')}</div>${body}</div></div></div>`;
    },

    cart: () => {
      const ids = Object.keys(S.cart);
      if (!ids.length && !S.list.length) return `<div class="page">${pageHead('Review Your Cart', 'Check your items and choose how you’d like to continue.')}
        <div class="empty-cart">${u8('mark8')}<h2>Your cart is ready when you are.</h2><p>Let’s find something good — search, browse a recipe, or reorder a favorite.</p>
        <button class="kb kb--lg" data-go="home">Start Shopping</button></div></div>`;
      const sub = subtotal(), tax = sub * TAX;
      return `<div class="page">${pageHead('Review Your Cart', 'Check your items and choose how you’d like to continue.')}
        <div class="cart"><div>
          ${ids.length ? `<div class="cart__list">${ids.map(id => { const p = P[id]; return `<div class="cl"><img src="${p.img}" alt=""><div><h3>${p.name}</h3><small>${p.unit}</small><span class="loc">${loc(p)}</span></div><div class="price">${money(p.price * qty(id))}</div>
            <div class="stepper"><button data-cstep="${id}" data-d="-1" aria-label="Remove one">−</button><span>${qty(id)}</span><button data-cstep="${id}" data-d="1" aria-label="Add one">+</button></div><button class="rm" data-crm="${id}">Remove</button></div>`; }).join('')}</div>` : ''}
          ${S.list.length ? `<p class="cart__sub">Also on your shopping list</p><div class="cart__list" style="margin-top:12px">${S.list.map((l, i) => `<div class="cl cl--list"><span class="tag">Aisle ${l.aisle}</span><div><h3>${l.name}</h3><small>${l.qty || 'Pick up in store'}</small></div><span class="loc" style="font-size:20px">${AISLES[l.aisle - 1]}</span><button class="rm" data-lrm="${i}">Remove</button></div>`).join('')}</div>` : ''}
        </div>
        <aside class="summary"><div class="row"><span>Subtotal</span><span>${money(sub)}</span></div><div class="row"><span>Estimated Tax</span><span>${money(tax)}</span></div><hr>
          <div class="row total"><span>Total</span><span>${money(sub + tax)}</span></div>
          <button class="kb kb--ghost kb--lg" data-print>${u8("i16")}Print List</button>
          <button class="kb kb--lg" data-go="checkout" ${ids.length ? '' : 'disabled'}>${u8("i15")}Checkout</button>
          <p class="save">Your printed list is sorted by aisle, so you can walk the store once — no doubling back.</p></aside></div></div>`;
    },

    checkout: () => {
      const M = [
        ['self', 'i15', 'Self Checkout', 'Pick up your items and scan them at any self checkout lane. Show your code to load this cart.', 'Ready now'],
        ['assisted', 'i11', 'Assisted Checkout', 'A ULTIM8 Helper will ring you up at the assisted lanes by the entrance.', 'Ready now'],
        ['pickup', 'i12', 'Store Pick-Up', 'Relax while we pick and pack your order. We’ll text you when it’s ready at the pick-up counter.', 'Ready in about 1 hour'],
        ['delivery', 'mark8', 'Home Delivery', 'Our orange trucks bring your groceries to your door.', 'Today, 5–7 PM']
      ];
      const sub = subtotal();
      return `<div class="page">${pageHead('How would you like to finish?', 'Choose the option that works best for you today.')}
        <div class="methods">${M.map(([id, ic, t, d, w]) => `<button class="method ${S.method === id ? 'on' : ''}" data-method="${id}">${u8(ic)}<h3>${t}</h3><p>${d}</p><small>${w}</small></button>`).join('')}</div>
        <div class="checkout-foot"><span>${Object.values(S.cart).reduce((a, b) => a + b, 0)} items · Total <b>${money(sub * (1 + TAX))}</b></span>
          <button class="kb kb--lg" data-confirm ${S.method ? '' : 'disabled'}>Confirm</button></div></div>`;
    },

    done: () => {
      const msgs = { self: 'Head to any self checkout lane and scan this code to load your cart.', assisted: 'Show this code to a ULTIM8 Helper at the assisted lanes.', pickup: 'We’re picking your items now. Show this code at the pick-up counter.', delivery: 'Your order is on our delivery route for today, 5–7 PM.' };
      return `<div class="page"><div class="done"><div><h1>You’re all set!</h1><p>${msgs[S.method]}</p><span class="code">${S.code}</span>
        <p style="font-size:24px">Thanks for shopping with us. Less to decide, more to enjoy.</p>
        <div class="acts"><button class="kb kb--lg" data-restart>Done</button></div></div>${u8('mark8', 'done__mark')}</div></div>`;
    }
  };

  function whyText() {
    const ids = S.compare.slice(S.cmpStart, S.cmpStart + 3);
    const p = P[S.cmpPick]; if (!p) return '';
    const r = { Price: `${p.name} is the lowest price here at ${money(p.price)}.`, Quality: `${p.name} is ${p.spec['Key Benefits'] ? p.spec['Key Benefits'].toLowerCase() : 'a great choice'}.`, Convenience: `${p.name} is ${p.spec['Dietary Notes'] ? p.spec['Dietary Notes'].toLowerCase() : 'easy to pick up'} and in ${loc(p)}.` }[S.cmpWhy];
    return `Okay, let’s narrow this down: ${r} The choice is always yours.`;
  }
  function pickFor(why) {
    const ids = S.compare.slice(S.cmpStart, S.cmpStart + 3).map(id => P[id]);
    if (!ids.length) return null;
    if (why === 'Price') return ids.slice().sort((a, b) => a.price - b.price)[0].id;
    if (why === 'Quality') return (ids.find(p => /rich|nutrients/i.test(p.spec['Key Benefits'] || '')) || ids.slice().sort((a, b) => b.price - a.price)[0]).id;
    return (ids.find(p => /vegan|dairy-free/i.test((p.spec['Dietary Notes'] || '') + (p.spec['Key Benefits'] || ''))) || ids[0]).id;
  }

  /* ---------------- render & navigation ---------------- */
  function render(keepScroll) {
    const top = view.scrollTop;
    screenEl.classList.toggle('is-welcome', S.screen === 'welcome');
    view.innerHTML = SCREENS[S.screen]();
    u8.hydrate(view);
    if (keepScroll) { view.scrollTop = top; $$('.page', view).forEach(p => p.style.animation = 'none'); } else view.scrollTop = 0;
    $$('.menu > button[data-go]').forEach(b => b.classList.toggle('on', b.dataset.go === S.screen));
  }
  function go(screen, opts = {}) {
    closeAll();
    if (screen === S.screen && !opts.force) return;
    if (!opts.back && S.screen !== 'welcome') S.history.push(S.screen);
    if (screen === 'home' || screen === 'welcome') S.history = [];
    S.screen = screen; render();
    if (opts.back) $('.page', view)?.classList.add('back');
  }
  function back() { const prev = S.history.pop() || 'home'; go(prev, { back: true }); }
  function restart() {
    Object.assign(S, { cart: {}, list: [], compare: ['milk-2', 'milk-whole', 'milk-oat'], cmpStart: 0, cmpPick: null, cmpWhy: null, history: [], find: { cat: 'produce', sub: 'All', q: '' }, recTab: 'All', ordTab: 'All Orders', ordQ: '', serves: 4, recipeOff: {}, method: null, openOrder: null });
    $('#cartCount').textContent = 0; closePrint(); S.screen = ''; go('welcome');
  }

  /* ---------------- overlays ---------------- */
  const scrim = $('#scrim'), menu = $('#menu'), sheet = $('#sheet');
  function closeAll() { scrim.classList.remove('on'); menu.classList.remove('on'); sheet.classList.remove('on'); }
  function openSheet(html) { sheet.innerHTML = `<button class="sheet__x" data-close aria-label="Close">×</button>` + html; u8.hydrate(sheet); scrim.classList.add('on'); sheet.classList.add('on'); }
  menu.innerHTML = `<div class="menu__top"><i data-u8="wordmark"></i><button class="menu__close" data-close aria-label="Close menu">×</button></div>
    <button data-go="home"><i data-u8="mark8"></i>Home</button>
    <button data-go="find"><i data-u8="i10"></i>Find a Product</button>
    <button data-go="recipes"><i data-u8="i14"></i>Shop by Recipe</button>
    <button data-go="compare"><i data-u8="i13"></i>Compare &amp; Choose</button>
    <button data-go="orders"><i data-u8="i12"></i>Your Past Orders</button>
    <button data-go="cart"><i data-u8="i15"></i>Review Your Cart</button><hr>
    <button class="sw" id="bigText">Larger text<i></i></button>
    <button data-help><i data-u8="i11"></i>Call Helper</button>
    <button data-restart><i data-u8="spark"></i>Start Over</button>
    <div class="menu__foot">Kiosk 2 · Produce entrance</div>`;
  u8.hydrate(menu); u8.hydrate($('#kh'));
  $('#menuBtn').addEventListener('click', () => { scrim.classList.add('on'); menu.classList.add('on'); });
  scrim.addEventListener('click', closeAll);
  $('#bigText').addEventListener('click', e => { const on = e.currentTarget.classList.toggle('on'); document.documentElement.style.setProperty('--k', on ? 1.15 : 1); render(true); });

  function productSheet(id) {
    const p = P[id];
    openSheet(`<div class="pd"><div class="pd__img"><img src="${p.img}" alt=""></div><div>
      <h2>${p.name}</h2><div class="unit">${p.unit}</div><div class="price">${money(p.price)}</div><p class="desc">${p.desc}</p>
      <div class="acts"><div data-slot="${id}" style="min-width:260px">${addBtn(id)}</div>
        <button class="kb kb--ghost" data-cmpadd="${id}">${u8('i13')}Compare</button></div></div>
      <div class="pd__where"><h4>Where to find it</h4><div class="loc-big">${loc(p)} — ${AISLES[p.aisle - 1]}</div>${mapHtml(p.aisle)}</div></div>`);
  }

  /* printer */
  const printer = $('#printer'), paper = $('#paper');
  function printList() {
    const groups = {};
    Object.entries(S.cart).forEach(([id, q]) => { const p = P[id]; (groups[p.aisle] = groups[p.aisle] || []).push([`${q} × ${p.name}`, money(p.price * q)]); });
    S.list.forEach(l => (groups[l.aisle] = groups[l.aisle] || []).push([`${l.qty ? l.qty + ' ' : ''}${l.name}`, '']));
    const sub = subtotal(), d = new Date();
    paper.innerHTML = `<i data-u8="wordmark" class="r-logo"></i><div class="r-t">SHOPPING LIST</div><div class="r-s">LESS TO DECIDE. MORE TO ENJOY.</div><i data-u8="spark" class="r-spark"></i>
      <div class="r-c">KIOSK 2 · ${d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).toUpperCase()} · ${d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}</div><hr>
      ${Object.keys(groups).sort((a, b) => a - b).map(a => `<div class="r-aisle">AISLE ${a} · ${AISLES[a - 1].toUpperCase()}</div>${groups[a].map(([n, pr]) => `<div class="r-row"><i></i><span>${n}</span><span>${pr}</span></div>`).join('')}`).join('')}
      <hr><div class="r-tot"><span>EST. TOTAL</span><span>${money(sub * (1 + TAX))}</span></div><div class="r-c" style="font-size:15px">incl. est. tax ${money(sub * TAX)}</div>
      <div class="bar"></div><div class="r-c">HAVE A GREAT SHOP!</div>
      <div class="r-acts"><button class="kb kb--quiet" data-closeprint>Take List</button><button class="kb" data-go="checkout" data-closeprint>Checkout</button></div>`;
    u8.hydrate(paper);
    scrim.classList.add('on'); printer.classList.add('on'); paper.scrollTop = 0;
  }
  function closePrint() { printer.classList.remove('on'); scrim.classList.remove('on'); }

  /* toast */
  const tEl = $('#ktoast');
  function toast(msg, btn, fn) {
    tEl.innerHTML = `<span>${msg}</span>${btn ? `<button>${btn}</button>` : ''}`; tEl.classList.toggle('has-btn', !!btn);
    if (btn) tEl.querySelector('button').onclick = () => { tEl.classList.remove('on'); fn(); };
    tEl.classList.add('on'); clearTimeout(toast.t); toast.t = setTimeout(() => tEl.classList.remove('on'), 2600);
  }

  /* ---------------- interactions ---------------- */
  screenEl.addEventListener('click', e => {
    const t = e.target.closest('button, [data-start], .ing__row');
    if (!t) return;
    const d = t.dataset;
    if (d.start !== undefined) return go('home');
    if (d.closeprint !== undefined) { closePrint(); if (d.go) go(d.go); else toast('Your list is printed — enjoy your shop!'); return; }
    if (d.go) return go(d.go);
    if (d.back !== undefined) return back();
    if (d.close !== undefined) return closeAll();
    if (d.restart !== undefined) return restart();
    if (d.help !== undefined) { closeAll(); return toast('A ULTIM8 Helper is on the way to Kiosk 2. Hang tight!'); }
    if (d.add) return setQty(d.add, 1);
    if (t.parentElement?.dataset.step) { const id = t.parentElement.dataset.step; return setQty(id, qty(id) + +d.d, +d.d < 0); }
    if (d.detail) return productSheet(d.detail);
    if (d.cat) { S.find = { cat: d.cat, sub: 'All', q: '' }; if (S.screen === 'orders') return go('find'); return render(true); }
    if (d.sub) { S.find.sub = d.sub; return render(true); }
    if (d.clear) { if (d.clear === 'orderSearch') S.ordQ = ''; else S.find.q = ''; return render(true); }
    if (d.listadd) { const c = CATS.find(c => c.id === d.listadd); addList({ name: c.name, qty: '', aisle: c.aisle }); toast(`${c.name} added to your shopping list`, "View Cart", () => go("cart")); return render(true); }
    if (d.map) return openSheet(`<div class="pd__where"><h2 style="font-weight:400;font-size:52px;margin:0 0 10px">Aisle ${d.map}: ${AISLES[d.map - 1]}</h2><p style="font-size:24px;color:var(--soft);margin:0 0 26px">Walk past the produce tables and look for the orange aisle sign.</p>${mapHtml(+d.map)}</div>`);
    // recipes
    if (d.rtab) { S.recTab = d.rtab; return render(true); }
    if (d.recipe) { S.recipeId = d.recipe; S.serves = 4; return go('recipe'); }
    if (t.classList.contains('ing__row')) { const r = S.recipeOff[S.recipeId] = S.recipeOff[S.recipeId] || {}; r[d.ing] = !r[d.ing]; return render(true); }
    if (d.serves) { S.serves = Math.min(8, Math.max(2, S.serves + +d.serves)); return render(true); }
    if (d.addrecipe !== undefined) {
      const r = RECIPES.find(x => x.id === S.recipeId), off = S.recipeOff[r.id] || {}, f = S.serves / 4; let n = 0;
      r.items.forEach((it, i) => { if (off[i]) return; n++; if (Array.isArray(it)) S.cart[it[0]] = qty(it[0]) + Math.max(1, Math.round(it[1] * f)); else addList(it); });
      updateBadge(); toast(`${n} ${r.name} ingredients added`, "View Cart", () => go("cart")); return render(true);
    }
    // compare
    if (d.cmprm) { S.compare = S.compare.filter(x => x !== d.cmprm); if (S.cmpPick === d.cmprm) S.cmpPick = null; return render(true); }
    if (d.cmpnav) { S.cmpStart = Math.max(0, S.cmpStart + +d.cmpnav); S.cmpPick = S.cmpWhy ? pickFor(S.cmpWhy) : null; return render(true); }
    if (d.why) { S.cmpWhy = S.cmpWhy === d.why ? null : d.why; S.cmpPick = S.cmpWhy ? pickFor(d.why) : null; return render(true); }
    if (d.cmpadd) { if (!S.compare.includes(d.cmpadd)) S.compare.push(d.cmpadd); S.cmpStart = Math.max(0, S.compare.length - 3); closeAll(); return go('compare', { force: true }); }
    if (d.cmppicker !== undefined) {
      const opts = Object.values(P).filter(p => !S.compare.includes(p.id));
      return openSheet(`<h2 style="font-weight:400;font-size:52px;margin:0 0 8px">Add to Comparison</h2><p style="font-size:24px;color:var(--soft);margin:0 0 26px">Pick a product to compare side by side.</p>
        <div class="grid">${opts.map(p => `<article class="pc"><div class="pc__img"><img src="${p.img}" alt=""></div><h3>${p.name}</h3><div class="unit">${p.unit}</div><div class="price">${money(p.price)}</div><div class="act"><button class="kb kb--ghost" data-cmpadd="${p.id}">${u8('i13')}Compare</button></div></article>`).join('')}</div>`);
    }
    // orders
    if (d.otab) { S.ordTab = d.otab; return render(true); }
    if (d.openorder) { S.openOrder = S.openOrder === d.openorder ? null : d.openorder; return render(true); }
    if (d.reorder) { const o = ORDERS.find(o => o.no === d.reorder); o.items.forEach(([id, c]) => S.cart[id] = qty(id) + c); updateBadge(); return toast(`Order #${o.no} added to your cart`, "View Cart", () => go("cart")); }
    if (d.addlist) { const l = LISTS[+d.addlist]; l.items.forEach(id => S.cart[id] = qty(id) + 1); updateBadge(); return toast(`“${l.name}” added to your cart`, "View Cart", () => go("cart")); }
    // cart
    if (d.cstep) return setQty(d.cstep, qty(d.cstep) + +d.d, true);
    if (d.crm) { const n = P[d.crm].name; setQty(d.crm, 0, true); return toast(`${n} removed`); }
    if (d.lrm) { S.list.splice(+d.lrm, 1); updateBadge(); return render(true); }
    if (d.print !== undefined) return printList();
    // checkout
    if (d.method) { S.method = d.method; return render(true); }
    if (d.confirm !== undefined) { S.code = 'U8-' + Math.floor(1000 + Math.random() * 9000); S.cart = {}; S.list = []; $('#cartCount').textContent = 0; return go('done'); }
  });
  scrim.addEventListener('click', closePrint);

  // live search
  screenEl.addEventListener('input', e => {
    const id = e.target.id;
    if (id === 'findSearch' || id === 'homeSearch') { S.find.q = e.target.value; const box = $(id === 'homeSearch' ? '#homeResults' : '#findResults'); box.innerHTML = findResults(id === 'homeSearch' ? 6 : 4); u8.hydrate(box); $('.section-h h2', view) && ($('.section-h h2', view).textContent = S.find.q ? 'Search results' : CATS.find(c => c.id === S.find.cat).name); }
    if (id === 'orderSearch') { S.ordQ = e.target.value; const v = e.target.value, pos = e.target.selectionStart; render(true); const inp = $('#orderSearch'); inp.focus(); inp.setSelectionRange(pos, pos); }
  });

  /* ---------------- idle timeout (kiosk etiquette) ---------------- */
  let idle;
  const IDLE_MS = 120000;
  function poke() {
    clearTimeout(idle);
    idle = setTimeout(() => {
      if (S.screen === 'welcome') return;
      let n = 15;
      openSheet(`<div class="idle"><h2>Still shopping?</h2><p>We’ll start a fresh session in <b id="idleN">${n}</b> seconds to keep your cart private.</p><div class="acts"><button class="kb kb--lg" data-close>Keep Shopping</button><button class="kb kb--ghost kb--lg" data-restart>Start Over</button></div></div>`);
      const iv = setInterval(() => { n--; const el = $('#idleN'); if (!el || !sheet.classList.contains('on')) return clearInterval(iv); el.textContent = n; if (n <= 0) { clearInterval(iv); restart(); } }, 1000);
    }, IDLE_MS);
  }
  ['pointerdown', 'keydown'].forEach(ev => addEventListener(ev, poke)); poke();

  /* ---------------- messages from the guideline page ---------------- */
  addEventListener('message', e => {
    const s = e.data && e.data.u8kiosk; if (!s) return;
    if (s === 'restart') return restart();
    if (SCREENS[s]) { closePrint(); go(s, { force: true }); }
  });

  /* ---------------- fit 1920×1080 into any window ---------------- */
  const embed = new URLSearchParams(location.search).has('embed');
  document.body.classList.toggle('embed', embed);
  function fit() {
    const dev = $('#device'), pad = embed ? 0 : 80, w = 1920 + pad, h = 1080 + pad;
    const s = Math.min(innerWidth / (w + (embed ? 0 : 60)), innerHeight / (h + (embed ? 0 : 60)));
    dev.style.transform = `scale(${s})`;
    dev.style.position = 'absolute'; dev.style.left = '50%'; dev.style.top = '50%';
    dev.style.margin = `${-h / 2}px 0 0 ${-w / 2}px`;
  }
  addEventListener('resize', fit); fit();

  go('welcome', { force: true });
})();
