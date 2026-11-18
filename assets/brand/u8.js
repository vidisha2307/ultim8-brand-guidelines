/* ULTIM8 mark renderer.
   Draws the approved artwork from marks.js exactly as supplied: same paths, same proportions.
   Colour comes from CSS `color` (currentColor) so only approved palette colours are applied. */
(function () {
  let n = 0;
  function u8(name, cls) {
    const m = window.U8_MARKS[name];
    if (!m) return '';
    const [x, y, w, h] = m.vb;
    const id = 'u8m' + (++n);
    const mask = m.cut
      ? `<defs><mask id="${id}" maskUnits="userSpaceOnUse" x="${x}" y="${y}" width="${w}" height="${h}"><rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#fff"/><g fill="#000">${m.cut}</g></mask></defs>`
      : '';
    return `<svg class="u8 ${cls || ''}" viewBox="${x} ${y} ${w} ${h}" role="img" aria-label="${LABELS[name] || name}" focusable="false">${mask}<g fill="currentColor"${m.cut ? ` mask="url(#${id})"` : ''}>${m.solid}</g></svg>`;
  }
  const LABELS = {
    wordmark: 'ULTIM8', stacked: 'ULTIM8 stacked logo', mark8: 'ULTIM8 logo mark', spark: 'Spark',
    s2: 'Pharmacy 8', s5: 'Dairy 8', s6: 'Meat 8', s3: 'Grocery 8', s4: 'Optical 8', s7: 'Books 8',
    i10: 'Search', i11: 'Restrooms', i12: 'List', i13: 'Compare', i14: 'Recipe', i15: 'Cart', i16: 'Print'
  };
  /* service variations of the logo mark, in book order (page 30) */
  u8.SERVICES = [
    { key: 'mark8', label: 'Logo Mark' },
    { key: 's2', label: 'Pharmacy' },
    { key: 's5', label: 'Dairy' },
    { key: 's6', label: 'Meat' },
    { key: 's3', label: 'Grocery' },
    { key: 's4', label: 'Optical' },
    { key: 's7', label: 'Books' }
  ];
  u8.ICON = { search: 'i10', people: 'i11', list: 'i12', compare: 'i13', recipe: 'i14', cart: 'i15', print: 'i16' };
  /* replace every <i data-u8="name"> placeholder with the artwork */
  u8.hydrate = function (root) {
    (root || document).querySelectorAll('[data-u8]').forEach(el => {
      el.outerHTML = u8(el.dataset.u8, el.className);
    });
  };
  window.u8 = u8;
})();
