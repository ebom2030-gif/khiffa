/* خفّة – اختيار شكل الشعار داخل التطبيق (5 مقترحات).
   الأساسي = 2 (نقطة الخاء ريشة). أيقونة الشاشة الرئيسية ثابتة ولا تتغير.
   التخزين: settings.logo (لكل مستخدم) + localStorage للعرض قبل الدخول. */
(function () {
  'use strict';
  var d = document, A = window.KHIFFA_APP;
  var F = 'M30 2C52 18 58 50 51 80C47 97 39 107 30 112C21 107 13 97 9 80C2 50 8 18 30 2Z';
  var C = 'M53 46 L36 56M52 70 L35 79M8 58 L24 66M11 84 L25 90M14 30 L26 38';
  var cut = function (col) { return '<path d="' + C + '" fill="none" stroke="' + col + '" stroke-width="2.6" stroke-linecap="round"/>'; };
  var fe = function (fill, col) { return '<path d="' + F + '" fill="' + fill + '"/>' + cut(col); };
  var BG = '#F6F6F1';
  var MARKS = {
    1: '<svg class="klm" viewBox="-10 -6 80 128"><g transform="rotate(28 30 60)">' + fe('#1FA971', BG) + '<path d="M30 10Q31 66 30 122" stroke="#0E7A52" stroke-width="3" fill="none" stroke-linecap="round"/></g></svg>',
    3: '<svg class="klm" viewBox="-6 -4 72 170">' + fe('#1FA971', BG) + '<path d="M30 12V150" stroke="#0E7A52" stroke-width="5" stroke-linecap="round"/><path d="M20 112v18a10 10 0 0 0 20 0v-18M30 112v18" stroke="#0E7A52" stroke-width="5" fill="none" stroke-linecap="round"/></svg>',
    4: '<svg class="klm" viewBox="0 0 120 120"><circle cx="60" cy="60" r="50" fill="none" stroke="#DDEBE3" stroke-width="10"/><circle cx="60" cy="60" r="50" fill="none" stroke="#1FA971" stroke-width="10" stroke-linecap="round" stroke-dasharray="236 314" transform="rotate(-90 60 60)"/><circle cx="10" cy="60" r="8" fill="#FF7A59"/><g transform="translate(36 22) scale(.62) rotate(28 30 60)">' + fe('#1FA971', BG) + '</g></svg>',
    5: '<svg class="klm" viewBox="0 -4 140 130"><g transform="translate(40 8) rotate(-34 30 112)">' + fe('#1FA971', BG) + '</g><g transform="translate(40 8) rotate(34 30 112)">' + fe('#FF7A59', BG) + '</g></svg>'
  };
  var NAMES = { 1: 'ريشة الورقة', 2: 'نقطة الخاء ريشة', 3: 'ريشة وشوكة', 4: 'حلقة الإنجاز', 5: 'ريشتان = نبتة' };

  var css = d.createElement('style');
  css.textContent =
    '.klogo{display:flex;align-items:center;gap:8px}.klogo .klm{height:34px;width:auto;flex:none}' +
    '.lg-brand .klm{height:32px;width:auto}' +
    '.klpick{display:grid;grid-template-columns:repeat(auto-fill,minmax(130px,1fr));gap:10px;margin-top:10px}' +
    '.klpick button{border:2px solid var(--line);background:var(--bg);border-radius:16px;padding:12px 8px 8px;cursor:pointer;font:inherit;color:var(--ink);display:flex;flex-direction:column;align-items:center;gap:6px}' +
    '.klpick button[aria-pressed=true]{border-color:var(--mint);background:var(--surface)}' +
    '.klpick .pv{display:flex;align-items:center;gap:6px;height:40px;color:var(--ink)}.klpick .pv svg{height:32px;width:auto}' +
    '.klpick small{font-size:12px;color:var(--muted)}';
  d.head.appendChild(css);

  function cur() {
    var D = A && A.data, s = (D && D.me && D.user && D.me.id === D.user.id && A.settings) ? A.settings() : null;
    var v = 0;
    try { v = +localStorage.getItem('khiffa.logo'); } catch (e) {}
    if (!v && s && s.logo) v = s.logo;
    return MARKS[v] ? v : 2;
  }

  // يحوّل الاسم المكتوب: نقطة عادية بدل الريشة (للمقترحات غير 2) ويضيف الرمز بجانبه
  function paintWm(svg, v) {
    var feather = svg.querySelector('g[fill="#1FA971"]');
    var dot = svg.querySelector('.kdot');
    if (!dot) {
      dot = d.createElementNS('http://www.w3.org/2000/svg', 'circle');
      dot.setAttribute('class', 'kdot'); dot.setAttribute('cx', '1372'); dot.setAttribute('cy', '378'); dot.setAttribute('r', '58'); dot.setAttribute('fill', 'currentColor');
      svg.appendChild(dot);
    }
    if (feather) feather.style.display = v === 2 ? '' : 'none';
    dot.style.display = v === 2 ? 'none' : '';
    var host = svg.parentNode, prev = host.querySelector(':scope > .klm');
    if (prev && prev.dataset.v !== String(v)) { prev.remove(); prev = null; }
    if (v !== 2 && !prev) {
      var t = d.createElement('div'); t.innerHTML = MARKS[v]; var m = t.firstChild; m.dataset.v = v;
      host.insertBefore(m, svg);
    }
    if (host.classList.contains('logo')) {
      var wrap = svg.closest('.klogo');
      if (!wrap) { wrap = d.createElement('div'); wrap.className = 'klogo'; host.insertBefore(wrap, host.firstChild); }
      var mk = host.querySelector(':scope > .klm'); if (mk) wrap.appendChild(mk);
      wrap.appendChild(svg);
      var old = wrap.querySelector('.klm'); if (old && v === 2) old.remove();
    }
  }
  function apply() {
    var v = cur();
    d.querySelectorAll('svg.logo-wm').forEach(function (s) { if (!s.closest('.klpick')) paintWm(s, v); });
    d.querySelectorAll('.lg-brand').forEach(function (b) { var i = b.querySelector(':scope > .klm'); if (i && v === 2) i.remove(); });
  }

  function preview(v) {
    var wm = d.querySelector('svg.logo-wm'); if (!wm) return '';
    var c = wm.cloneNode(true); var host = d.createElement('div'); host.appendChild(c); paintWm(c, v);
    return '<span class="pv">' + host.innerHTML + '</span>';
  }
  function card() {
    var plan = d.getElementById('v-plan'), D = A && A.data;
    if (!plan || !D || !D.me) return;
    if (D.me.role !== 'owner') { var old = d.getElementById('klCard'); if (old) old.remove(); return; } // قرار الهوية للمالك فقط
    var c = d.getElementById('klCard');
    if (!c) { c = d.createElement('div'); c.className = 'card'; c.id = 'klCard'; var after = d.getElementById('krmCard'); plan.insertBefore(c, after ? after.nextSibling : (plan.children[1] || null)); }
    var v = cur();
    if (c.dataset.v === String(v)) return;
    c.dataset.v = v;
    c.innerHTML = '<h2>شكل الشعار</h2><p class="note" style="margin:6px 0 0">اختاري الشكل الذي يظهر أعلى التطبيق وفي شاشة الدخول. أيقونة التطبيق على الجوال ثابتة.</p><div class="klpick">' +
      [2, 1, 3, 4, 5].map(function (n) { return '<button type="button" data-v="' + n + '" aria-pressed="' + (n === v) + '">' + preview(n) + '<small>' + NAMES[n] + (n === 2 ? ' (الأساسي)' : '') + '</small></button>'; }).join('') + '</div>';
    c.querySelectorAll('.klpick button').forEach(function (b) {
      b.onclick = function () {
        var n = +b.dataset.v;
        try { localStorage.setItem('khiffa.logo', n); } catch (e) {}
        if (A.saveSettings && D.user && D.me.id === D.user.id) A.saveSettings({ logo: n });
        c.dataset.v = ''; apply(); card();
        if (A.toast) A.toast('تم تغيير شكل الشعار ✓');
      };
    });
  }

  (window.KHIFFA_HOOKS = window.KHIFFA_HOOKS || []).push(function () { apply(); card(); });
  apply(); setInterval(function () { apply(); card(); }, 1500);
})();
