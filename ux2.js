/* خفّة – تحسينات تجربة الاستخدام (المرحلة 1–3):
   - دمج «اليوم» في «الرئيسية» (5 صفحات بدل 6)، مع رابط لتفاصيل اليوم.
   - صفحة النظام: الإعدادات أولًا، والمراجع (البدائل، الإرشادات…) تُطوى.
   - نموذج InBody: الخانات الأساسية ظاهرة والباقي تحت «خانات إضافية».
   - روابط الإشعارات: ?eat=b (أكلتها) · ?meal=b (اختيار الوجبة) · ?water=1 · ?go=reports
   - مسافة سفلية حتى لا يغطي الزر + والشريط السفلي المحتوى. */
(function () {
  'use strict';
  var d = document, A = window.KHIFFA_APP;
  var css = d.createElement('style');
  css.textContent =
    '.wrap{padding-bottom:180px!important}.toast{bottom:160px!important;display:flex;align-items:center;gap:10px;max-width:calc(100vw - 32px)}' +
    '.tundo{border:0;background:var(--mint);color:#fff;border-radius:999px;padding:5px 12px;font:inherit;font-weight:700;cursor:pointer}' +
    '.kf-fab{width:52px!important;height:52px!important;font-size:28px!important}' +
    '#tabs button[data-v="today"]{display:none!important}' +
    '.kmore{display:flex;justify-content:center;margin-top:10px}.kmore .btn{width:100%}' +
    '.kcol>h2,.kcol .kcol-h{cursor:pointer;display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:0}' +
    '.kcol>h2::after,.kcol .kcol-h::after{content:"";width:9px;height:9px;border-inline-start:2px solid var(--muted);border-bottom:2px solid var(--muted);transform:rotate(-45deg);transition:transform .2s;flex:none}' +
    '.kcol.open>h2::after,.kcol.open .kcol-h::after{transform:rotate(135deg)}' +
    '.kcol:not(.open)>:not(h2):not(.kcol-keep){display:none!important}' +
    '.kgroup{margin:22px 4px 8px;font-size:13px;font-weight:700;color:var(--muted);letter-spacing:.02em}' +
    '.ib-more{grid-column:1/-1;display:contents}.ib-more[hidden]{display:none!important}' +
    '.ib-toggle{grid-column:1/-1;justify-self:start;border:0;background:none;color:var(--mint);font:inherit;font-weight:700;cursor:pointer;padding:6px 0}';
  d.head.appendChild(css);

  function go(v) { var b = d.querySelector('#tabs button[data-v="' + v + '"]'); if (b) b.click(); }

  /* ---------- الرئيسية: رابط تفاصيل اليوم (الماء، الوزن، الملاحظة، الأيام) ---------- */
  function homeLink() {
    var meals = d.querySelector('#v-home .hm-meals'); if (!meals || meals.parentNode.querySelector('.kmore')) return;
    var w = d.createElement('div'); w.className = 'kmore';
    w.innerHTML = '<button class="btn ghost sm" type="button">تفاصيل اليوم: الماء والوزن والملاحظة</button>';
    w.firstChild.onclick = function () { if (A.setCur) A.setCur(A.TODAY); go('today'); };
    meals.insertAdjacentElement('afterend', w);
  }
  // لو آخر صفحة محفوظة كانت «اليوم» افتح الرئيسية
  try { if (JSON.parse(localStorage.getItem('khiffa.tab')) === 'today') localStorage.setItem('khiffa.tab', '"home"'); } catch (e) {}

  /* ---------- صفحة النظام ---------- */
  var SETTINGS = [/مستوى السعرات/, /مواعيد الوجبات/, /تفضيلات الأكل/, /^حسابي|^الحساب/, /إدارة المستخدمين/, /شكل الشعار/, /المتابعة مع أخصائي/, /المساعدة وحسابي/, /تحديث التطبيق/];
  function title(c) { var h = c.querySelector('h2'); return h ? h.textContent.trim() : ''; }
  function planOrder() {
    var plan = d.getElementById('v-plan'); if (!plan) return;
    var cards = Array.prototype.filter.call(plan.children, function (c) { return c.classList && c.classList.contains('card'); });
    if (!cards.length) return;
    var top = [], rest = [];
    SETTINGS.forEach(function (re) { cards.forEach(function (c) { if (top.indexOf(c) < 0 && re.test(title(c))) top.push(c); }); });
    cards.forEach(function (c) { if (top.indexOf(c) < 0) rest.push(c); });
    var lbl = plan.querySelector('.kgroup');
    if (!lbl) { lbl = d.createElement('div'); lbl.className = 'kgroup'; lbl.textContent = 'دليل النظام والمراجع — اضغطي على أي عنوان لفتحه'; }
    top.forEach(function(c){c.classList.remove('kcol');}); var want = top.concat([lbl], rest), cur = Array.prototype.filter.call(plan.children, function (c) { return want.indexOf(c) >= 0; });
    var same = cur.length === want.length && cur.every(function (c, i) { return c === want[i]; });
    if (!same) want.forEach(function (c) { plan.appendChild(c); });
    rest.forEach(function (c) {
      if (c.classList.contains('kcol') || !c.querySelector(':scope > h2')) return;
      c.classList.add('kcol');
      c.querySelector(':scope > h2').addEventListener('click', function () { c.classList.toggle('open'); });
    });
  }

  /* ---------- InBody: الخانات الأساسية + «خانات إضافية» ---------- */
  var EXTRA = ['f-bmi', 'f-vfl', 'f-whr', 'f-ffm', 'f-tbw', 'f-score'];
  function inbodyForm() {
    var first = d.getElementById('f-bmi'); if (!first || d.querySelector('.ib-toggle')) return;
    var labels = EXTRA.map(function (id) { var i = d.getElementById(id); return i && i.closest('label'); }).filter(Boolean);
    if (!labels.length) return;
    var box = d.createElement('div'); box.className = 'ib-more'; box.hidden = true;
    var tl = d.getElementById('f-target'), anchor = tl && tl.closest('label');
    if (anchor) anchor.insertAdjacentElement('afterend', box); else labels[0].parentNode.insertBefore(box, labels[0]);
    labels.forEach(function (l) { box.appendChild(l); });
    var t = d.createElement('button'); t.type = 'button'; t.className = 'ib-toggle'; t.textContent = '+ خانات إضافية (اختيارية)';
    box.parentNode.insertBefore(t, box);
    var openIt = function () { box.hidden = false; t.textContent = '− إخفاء الخانات الإضافية'; };
    t.onclick = function () { if (box.hidden) openIt(); else { box.hidden = true; t.textContent = '+ خانات إضافية (اختيارية)'; } };
    // لو القراءة التلقائية أو التعديل ملأ خانة مخفية افتحها
    setInterval(function () { if (box.hidden && EXTRA.some(function (id) { var i = d.getElementById(id); return i && i.value; })) openIt(); }, 1000);
  }

  /* ---------- روابط الإشعارات ---------- */
  var handled = false;
  function deepLinks() {
    if (handled || !A || !A.data || !A.data.me) return;
    var q = new URLSearchParams(location.search); if (!q.toString()) { handled = true; return; }
    handled = true;
    var D = A.D, meal = function (k) { return (D.MEALS || []).find(function (m) { return m.k === k; }); };
    var clean = function () { try { history.replaceState(null, '', location.pathname); } catch (e) {} };
    var own = A.data.user && A.data.me.id === A.data.user.id;
    if (!own) { clean(); return; }
    setTimeout(function () {
      var k = q.get('eat'), mk = q.get('meal');
      if (k && meal(k)) {
        var m = meal(k), st = A.mealState(A.dayOf(A.TODAY), k);
        if (A.mealComps(k, st).length) { A.setMeal(k, { done: true, planned: false }, A.TODAY); if (A.refresh) A.refresh(); A.toast('سُجّلت ' + m.t + ' ✓', A.undoMeal); }
        else { if (A.setCur) A.setCur(A.TODAY); A.openMealSheet(m, 'idea'); A.toast('اختاري ما تناولتِه في ' + m.t); }
      } else if (mk && meal(mk)) { if (A.setCur) A.setCur(A.TODAY); A.openMealSheet(meal(mk), 'idea'); }
      else if (q.get('water')) { var dd = A.dayOf(A.TODAY); dd.w3 = A.bottles(dd) + 1; A.saveDay(Object.assign({}, dd)); if (A.refresh) A.refresh(); A.toast('أُضيفت زجاجة ماء 💧'); }
      else if (q.get('go')) go(q.get('go'));
      clean();
    }, 600);
  }

  function run() { homeLink(); planOrder(); inbodyForm(); deepLinks(); }
  (window.KHIFFA_HOOKS = window.KHIFFA_HOOKS || []).push(run);
  setInterval(run, 1200);
})();

