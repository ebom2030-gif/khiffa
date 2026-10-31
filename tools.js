/* v39 — أدوات خفة: خطة الأسبوع، قائمة المشتريات، التحديات والشارات، التقرير الشهري A4، ماسح الباركود. */
(function () {
  'use strict';
  const A = window.KHIFFA_APP, D = window.KHIFFA_DATA, d = document;
  if (!A || !D) return;
  const E = (tag, text, cls) => { const e = d.createElement(tag); if (text != null && text !== '') e.textContent = text; if (cls) e.className = cls; return e; };
  const B = (text, fn, cls = 'btn') => { const b = E('button', text, cls); b.type = 'button'; b.onclick = fn; return b; };
  const num = (n, f = 0) => Number(n || 0).toLocaleString('ar-u-nu-latn', { maximumFractionDigits: f });
  const pad = n => String(n).padStart(2, '0');
  const key = dt => dt.getFullYear() + '-' + pad(dt.getMonth() + 1) + '-' + pad(dt.getDate());
  const addDays = (k, n) => A.addDays ? A.addDays(k, n) : (() => { const [y, m, dd] = k.split('-').map(Number); const t = new Date(y, m - 1, dd + n); return key(t); })();
  const R = () => window.KHIFFA_SUGGESTIONS;
  const own = () => A.data && A.data.me && A.data.user && String(A.data.me.id) === String(A.data.user.id);
  const days = () => (A.data && A.data.days) || [];
  const dayMap = () => Object.fromEntries(days().map(x => [x.date, x]));

  function modal(title, wide) {
    const old = d.activeElement, overlay = E('div', null, 'ac-modal'), box = E('div', null, 'ac-box kt-box' + (wide ? ' kt-wide' : ''));
    overlay.setAttribute('role', 'dialog'); overlay.setAttribute('aria-modal', 'true'); overlay.setAttribute('aria-label', title);
    const close = () => { overlay.remove(); stopCamera(); old && old.focus && old.focus(); };
    const head = E('div', null, 'kt-head'); head.append(E('h2', title), B('إغلاق', close, 'btn ghost'));
    box.append(head); overlay.append(box); overlay.addEventListener('click', e => { if (e.target === overlay) close(); });
    overlay.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
    d.body.append(overlay); setTimeout(() => head.querySelector('button').focus(), 0);
    return { box, close };
  }

  /* ---------- خطة الأسبوع ---------- */
  function mealTarget(k) { try { return A.mealTargetKcal ? A.mealTargetKcal(k) : (Number(A.settings().level) || 1600) / 5; } catch (_) { return 320; } }
  function buildWeek(seed) {
    const eng = R(); if (!eng) return null;
    const st = A.settings(), filters = (st.dailySuggestions && st.dailySuggestions.filters) || {}, all = Object.keys(eng.cuisines);
    const start = A.TODAY, out = [];
    for (let i = 0; i < 7; i++) {
      const date = addDays(start, i + 1), meals = {};
      D.MEALS.forEach((m, j) => { const sel = (filters[m.k] && filters[m.k].length ? filters[m.k] : all); const s = eng.suggest(m.k, sel, D.FOODS, st, mealTarget(m.k), seed + i * 7 + j * 3); if (s) meals[m.k] = s; });
      out.push({ date, meals });
    }
    return out;
  }
  function weekPlan() {
    if (!R()) { A.toast('محرك المقترحات غير جاهز بعد'); return; }
    const m = modal('خطة الأسبوع من مطابخك', true);
    let seed = Number(A.settings().weekSeed) || Math.floor(Math.random() * 1000), week = buildWeek(seed);
    const note = E('p', 'سبعة أيام تبدأ من الغد، من المطابخ المختارة في «مقترحات اليوم»، وبكميات تناسب خطة سعراتك. الخطة لا تُسجَّل كطعام مأكول؛ تظهر في كل يوم كوجبات «مقترحة» تؤكدها عند تناولها.', 'note');
    const grid = E('div', null, 'kt-week');
    function draw() {
      grid.replaceChildren();
      week.forEach(day => {
        const c = E('div', null, 'kt-day'); const dt = new Date(day.date + 'T12:00:00');
        c.append(E('h3', dt.toLocaleDateString('ar', { weekday: 'long', day: 'numeric', month: 'long' })));
        let total = 0;
        D.MEALS.forEach(mm => { const s = day.meals[mm.k]; if (!s) return; const kc = R().calories(s.items, D.FOODS); total += kc; const row = E('div', null, 'kt-meal'); row.append(E('b', mm.t), E('span', s.title), E('small', num(kc) + ' سعرة · ' + (R().cuisines[s.cuisine] || ''))); c.append(row); });
        c.append(E('p', 'المجموع ≈ ' + num(total) + ' سعرة', 'kt-total')); grid.append(c);
      });
    }
    draw();
    const actions = E('div', null, 'kt-actions');
    actions.append(
      B('خطة أخرى', () => { seed += 37; week = buildWeek(seed); draw(); }, 'btn ghost'),
      B('اعتماد الخطة في أيامي', () => {
        let n = 0; week.forEach(day => D.MEALS.forEach(mm => { const s = day.meals[mm.k]; if (!s) return; const cur = A.dayOf(day.date).meals?.[mm.k]; if (cur && cur.done) return; A.setMeal(mm.k, { mode: 'custom', title: s.title, items: s.items.map(x => ({ ...x, food: structuredClone(D.FOODS[x.id]) })), planned: true }, day.date); n++; }));
        A.saveSettings({ weekPlan: { from: week[0].date, to: week[6].date, seed, created: new Date().toISOString() }, weekSeed: seed }); A.setCur(A.TODAY); A.refreshAll();
        A.toast('تمت إضافة ' + num(n) + ' وجبة مقترحة لأيام الأسبوع');
      }),
      B('قائمة المشتريات لهذه الخطة', () => { m.close(); shopping(week); }, 'btn ghost'),
      B('إرسال الخطة للأخصائي', () => sendToCoach(week), 'btn ghost')
    );
    m.box.append(note, actions, grid);
  }
  async function sendToCoach(week) {
    try {
      const o = await A.api('careOverview', {});
      if (!o.coach) { A.toast('لست مرتبطًا بأخصائي بعد — اربط حسابك من «المجتمع والدعم».'); return; }
      const lines = week.map(day => day.date + ': ' + D.MEALS.map(mm => day.meals[mm.k] ? mm.t + ' ' + day.meals[mm.k].title : '').filter(Boolean).join(' · '));
      await A.api('careMessage', { client: A.me.id, text: 'خطة أسبوعي المقترحة للمراجعة والاعتماد:\n' + lines.join('\n') });
      A.toast('أُرسلت الخطة إلى ' + o.coach.name);
    } catch (e) { A.toast(e.message || 'تعذّر الإرسال'); }
  }

  /* ---------- قائمة المشتريات ---------- */
  const GROUPS = { P: 'البروتينات', S: 'النشويات والخبز', V: 'الخضار', F: 'الفواكه', M: 'الألبان', Fa: 'الدهون والمكسرات' };
  function shopping(week) {
    const totals = {};
    const add = (id, n) => { if (!D.FOODS[id] || !(n > 0)) return; totals[id] = (totals[id] || 0) + n; };
    if (week) week.forEach(day => Object.values(day.meals).forEach(s => s.items.forEach(x => add(x.id, x.n))));
    else {
      for (let i = 0; i < 7; i++) { const day = A.dayOf(addDays(A.TODAY, i)); Object.keys(day.meals || {}).forEach(k => { const st = day.meals[k]; if (st && !st.done) A.mealComps(k, st).forEach(c => add(c.food.id, c.n)); }); }
      const drafts = (A.settings().dailySuggestions || {}).drafts || {}; Object.values(drafts).forEach(dr => (dr.items || []).forEach(x => add(x.id, x.n)));
    }
    const m = modal('قائمة المشتريات');
    const ids = Object.keys(totals);
    if (!ids.length) { m.box.append(E('p', 'لا توجد وجبات مقترحة أو مخططة للأيام القادمة. اعتمد «خطة الأسبوع» أو اختر مقترحات اليوم، ثم افتح القائمة.', 'note'), B('فتح خطة الأسبوع', () => { m.close(); weekPlan(); })); return; }
    const checked = new Set((A.settings().shoppingChecked) || []);
    m.box.append(E('p', week ? 'مكونات خطة الأسبوع المعروضة.' : 'مكونات الوجبات المقترحة في الأيام السبعة القادمة ومقترحات اليوم.', 'note'));
    const list = E('div', null, 'kt-shop'), byG = {};
    ids.forEach(id => { const g = D.FOODS[id].g; (byG[g] = byG[g] || []).push(id); });
    Object.keys(byG).forEach(g => {
      list.append(E('h3', GROUPS[g] || 'أخرى'));
      byG[g].sort((a, b) => D.FOODS[a].name.localeCompare(D.FOODS[b].name, 'ar')).forEach(id => {
        const f = D.FOODS[id], l = E('label', null, 'kt-check'), cb = d.createElement('input'); cb.type = 'checkbox'; cb.checked = checked.has(id);
        cb.onchange = () => { cb.checked ? checked.add(id) : checked.delete(id); if (own()) A.saveSettings({ shoppingChecked: [...checked].slice(-300) }); };
        const grams = Math.round(totals[id] * (f.grams || 0));
        l.append(cb, E('span', f.name), E('small', grams >= 1000 ? num(grams / 1000, 1) + ' كجم' : grams ? num(grams) + ' جم' : A.amountText(f, totals[id])));
        list.append(l);
      });
    });
    const text = () => Object.keys(byG).map(g => (GROUPS[g] || '') + ':\n' + byG[g].map(id => '• ' + D.FOODS[id].name + ' — ' + num(Math.round(totals[id] * (D.FOODS[id].grams || 0))) + ' جم').join('\n')).join('\n\n');
    const actions = E('div', null, 'kt-actions');
    actions.append(B('مشاركة / نسخ', async () => { const t = 'قائمة مشتريات خفة دايت\n\n' + text(); try { if (navigator.share) await navigator.share({ title: 'قائمة المشتريات', text: t }); else { await navigator.clipboard.writeText(t); A.toast('تم نسخ القائمة'); } } catch (_) {} }, 'btn ghost'),
      B('مسح العلامات', () => { checked.clear(); list.querySelectorAll('input').forEach(i => { i.checked = false; }); if (own()) A.saveSettings({ shoppingChecked: [] }); }, 'btn ghost'));
    m.box.append(actions, list);
  }

  /* ---------- التحديات والشارات ---------- */
  function streak(test) { const map = dayMap(); let n = 0, k = A.TODAY; if (!test(map[k])) k = addDays(k, -1); while (test(map[k])) { n++; k = addDays(k, -1); } return n; }
  function countLast(test, span) { const map = dayMap(); let n = 0; for (let i = 0; i < span; i++) if (test(map[addDays(A.TODAY, -i)])) n++; return n; }
  function challenges() {
    const st = A.settings(), waterGoal = Number(st.water) || 8, stepsGoal = Number(st.stepsGoal) || 7500;
    const doneMeals = x => x ? Object.values(x.meals || {}).filter(m => m && m.done).length : 0;
    const water = x => x && A.bottles(x) >= waterGoal, logged = x => doneMeals(x) >= 3, steps = x => x && Number(x.steps) >= stepsGoal, full = x => doneMeals(x) >= 5;
    const weights = ((A.data && A.data.inbody) || []).filter(r => Number(r.weight) > 0);
    const lost = weights.length > 1 ? Number(weights[0].weight) - Number(weights[weights.length - 1].weight) : 0;
    return [
      { id: 'water7', t: '7 أيام ماء كامل', icon: '💧', v: streak(water), goal: 7 },
      { id: 'log7', t: 'أسبوع التزام بالتسجيل', icon: '📝', v: streak(logged), goal: 7, hint: '3 وجبات على الأقل يوميًا' },
      { id: 'steps5', t: 'هدف الخطوات 5 أيام', icon: '👟', v: countLast(steps, 7), goal: 5, hint: 'خلال آخر 7 أيام' },
      { id: 'full3', t: 'يوم كامل ×3', icon: '🍽️', v: countLast(full, 7), goal: 3, hint: 'خمس وجبات مسجلة في اليوم' },
      { id: 'log30', t: 'شهر التزام', icon: '🏆', v: countLast(logged, 30), goal: 20, hint: '20 يومًا من آخر 30' },
      { id: 'kg2', t: 'أول 2 كجم', icon: '⚖️', v: Math.max(0, Math.round(lost * 10) / 10), goal: 2, hint: 'من أول قياس مسجل' }
    ];
  }
  function badgesModal() {
    const m = modal('التحديات والشارات'); const grid = E('div', null, 'kt-badges');
    challenges().forEach(c => { const done = c.v >= c.goal, card = E('div', null, 'kt-badge' + (done ? ' done' : '')); card.append(E('span', c.icon, 'kt-ico'), E('b', c.t), E('small', (done ? 'حصلت عليها 🎉' : num(Math.min(c.v, c.goal), 1) + ' / ' + num(c.goal)) + (c.hint ? ' · ' + c.hint : ''))); const p = d.createElement('progress'); p.max = c.goal; p.value = Math.min(c.v, c.goal); card.append(p); grid.append(card); });
    m.box.append(E('p', 'تُحسب من سجلاتك الفعلية فقط، وتتحدث تلقائيًا.', 'note'), grid);
  }

  /* ---------- التقرير الشهري A4 ---------- */
  function monthlyReport() {
    const now = new Date(A.TODAY + 'T12:00:00'), y = now.getFullYear(), mo = now.getMonth(), first = key(new Date(y, mo, 1)), last = key(new Date(y, mo + 1, 0));
    const list = days().filter(x => x.date >= first && x.date <= last).sort((a, b) => a.date < b.date ? -1 : 1);
    const kcal = x => { let t = 0; D.MEALS.forEach(m => { const s = A.mealState(x, m.k); if (s.done) t += A.totals(A.mealComps(m.k, s)).n; }); (x.extras || []).forEach(e => { t += (Number(e.n) || 0) * (Number(e.q) || 1); }); return t; };
    const rows = list.map(x => ({ date: x.date, kcal: kcal(x), water: A.bottles(x), steps: Number(x.steps) || 0, weight: Number(x.weight) || null, meals: Object.values(x.meals || {}).filter(m => m.done).length }));
    const logged = rows.filter(r => r.meals > 0), avg = f => logged.length ? logged.reduce((s, r) => s + f(r), 0) / logged.length : 0;
    const ib = ((A.data && A.data.inbody) || []).filter(r => r.date >= first && r.date <= last && Number(r.weight) > 0);
    const name = A.displayName ? A.displayName() : '', level = Number(A.settings().level) || 0;
    const esc = A.esc;
    const badges = challenges().filter(c => c.v >= c.goal).map(c => c.icon + ' ' + c.t).join('، ') || '—';
    const html = '<!doctype html><html lang="ar" dir="rtl"><head><meta charset="utf-8"><title>تقرير خفة دايت الشهري</title><link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@400;600;700&display=swap" rel="stylesheet"><style>@page{size:A4;margin:14mm}body{font-family:"IBM Plex Sans Arabic",sans-serif;color:#1d2b22;margin:0;text-align:right}header{display:flex;justify-content:space-between;align-items:center;border-bottom:3px solid #1E6B3C;padding-bottom:8px;margin-bottom:12px}header img{height:62px}h1{font-size:20px;margin:0;color:#1E6B3C}h2{font-size:15px;color:#1E6B3C;margin:16px 0 6px}.k{display:grid;grid-template-columns:repeat(4,1fr);gap:8px}.k div{border:1px solid #d9e6dc;border-radius:10px;padding:8px}.k b{display:block;font-size:18px}.k small{color:#5b6b60}table{width:100%;border-collapse:collapse;font-size:11.5px}th,td{border:1px solid #d9e6dc;padding:4px 6px;text-align:right}th{background:#eef6f0}tr:nth-child(even) td{background:#fafcfa}footer{margin-top:14px;font-size:10px;color:#6b7a70;border-top:1px solid #d9e6dc;padding-top:6px}</style></head><body>' +
      '<header><div><h1>التقرير الشهري — ' + esc(now.toLocaleDateString('ar', { month: 'long', year: 'numeric' })) + '</h1><div>' + esc(name) + ' · خطة ' + num(level) + ' سعرة</div></div><img src="' + location.origin + '/assets/logo-0.png" alt="خفة دايت"></header>' +
      '<div class="k"><div><small>أيام مسجلة</small><b>' + num(logged.length) + ' / ' + num(rows.length || new Date(y, mo + 1, 0).getDate()) + '</b></div><div><small>متوسط السعرات</small><b>' + num(avg(r => r.kcal)) + '</b></div><div><small>متوسط الماء</small><b>' + num(avg(r => r.water), 1) + ' زجاجة</b></div><div><small>متوسط الخطوات</small><b>' + num(avg(r => r.steps)) + '</b></div></div>' +
      '<h2>الوزن وتركيب الجسم</h2>' + (ib.length ? '<table><tr><th>التاريخ</th><th>الوزن (كجم)</th><th>نسبة الدهون %</th><th>الوزن المستهدف</th></tr>' + ib.map(r => '<tr><td>' + r.date + '</td><td>' + num(r.weight, 1) + '</td><td>' + (r.pbf != null ? num(r.pbf, 1) : '—') + '</td><td>' + (r.target_weight ? num(r.target_weight, 1) : '—') + '</td></tr>').join('') + '</table>' : '<p>لا توجد قياسات هذا الشهر.</p>') +
      '<h2>الإنجازات</h2><p>' + esc(badges) + '</p>' +
      '<h2>السجل اليومي</h2><table><tr><th>التاريخ</th><th>وجبات مسجلة</th><th>السعرات</th><th>% من الخطة</th><th>الماء</th><th>الخطوات</th></tr>' + rows.map(r => '<tr><td>' + r.date + '</td><td>' + num(r.meals) + '</td><td>' + num(r.kcal) + '</td><td>' + (level ? num(r.kcal / level * 100) + '%' : '—') + '</td><td>' + num(r.water) + '</td><td>' + num(r.steps) + '</td></tr>').join('') + '</table>' +
      '<footer>خفة دايت — نمط حياة أخف .. لصحة أفضل · القيم الغذائية تقديرية من المكونات والكميات المسجلة، وليست تشخيصًا طبيًا. أُنشئ في ' + esc(new Date().toLocaleString('ar')) + '</footer><script>onload=()=>setTimeout(()=>print(),400)<\/script></body></html>';
    const w = window.open('', '_blank'); if (!w) { A.toast('اسمح بالنوافذ المنبثقة لطباعة التقرير'); return; } w.document.open(); w.document.write(html); w.document.close();
  }

  /* ---------- ماسح الباركود ---------- */
  let stream = null, scanTimer = null;
  function stopCamera() { clearInterval(scanTimer); scanTimer = null; if (stream) { stream.getTracks().forEach(t => t.stop()); stream = null; } }
  async function lookup(code) {
    const r = await fetch('https://world.openfoodfacts.org/api/v2/product/' + encodeURIComponent(code) + '.json?fields=product_name,product_name_ar,brands,nutriments,serving_size,image_front_small_url');
    const j = await r.json(); if (j.status !== 1 || !j.product) throw Error('المنتج غير موجود في قاعدة Open Food Facts. أدخله يدويًا من «تكوين وجبة».');
    return j.product;
  }
  function barcode() {
    const m = modal('ماسح الباركود'), info = E('div', null, 'kt-scan');
    const video = d.createElement('video'); video.setAttribute('playsinline', ''); video.muted = true; video.className = 'kt-video';
    const manual = E('div', null, 'kt-actions'), input = d.createElement('input'); input.inputMode = 'numeric'; input.placeholder = 'أو اكتب رقم الباركود'; input.setAttribute('aria-label', 'رقم الباركود');
    manual.append(input, B('بحث', () => found(input.value.trim())));
    const result = E('div', null, 'kt-result');
    m.box.append(E('p', 'وجّه الكاميرا إلى باركود المنتج المعلّب. البيانات من Open Food Facts (قاعدة مفتوحة)، وقد تختلف عن العبوة؛ راجعها قبل الحفظ.', 'note'), info, manual, result);
    async function found(code) {
      if (!/^\d{6,14}$/.test(code)) { A.toast('رقم باركود غير صالح'); return; }
      stopCamera(); video.remove(); result.replaceChildren(E('p', 'جارٍ البحث عن ' + code + '…', 'note'));
      try {
        const p = await lookup(code), nu = p.nutriments || {}, k100 = Number(nu['energy-kcal_100g'] ?? (nu['energy_100g'] ? nu['energy_100g'] / 4.184 : NaN));
        const name = p.product_name_ar || p.product_name || ('منتج ' + code);
        if (!Number.isFinite(k100)) throw Error('لا توجد سعرات مسجلة لهذا المنتج.');
        result.replaceChildren();
        if (p.image_front_small_url) { const im = E('img', null, 'kt-prod'); im.src = p.image_front_small_url; im.alt = name; result.append(im); }
        const g = d.createElement('input'); g.type = 'number'; g.min = '1'; g.max = '2000'; g.value = String(parseFloat(p.serving_size) || 100); g.setAttribute('aria-label', 'الكمية بالجرام');
        const est = E('p', '', 'kt-total'); const upd = () => { const q = Number(g.value) || 0; est.textContent = num(k100 * q / 100) + ' سعرة · بروتين ' + num((nu.proteins_100g || 0) * q / 100, 1) + ' ج · كربوهيدرات ' + num((nu.carbohydrates_100g || 0) * q / 100, 1) + ' ج · دهون ' + num((nu.fat_100g || 0) * q / 100, 1) + ' ج'; }; g.oninput = upd; upd();
        const lab = E('label', 'الكمية (جرام)', 'kd-field'); lab.append(g);
        result.append(E('h3', name + (p.brands ? ' — ' + p.brands : '')), E('p', num(k100) + ' سعرة لكل 100 جم', 'note'), lab, est,
          B('إضافة إلى طعام اليوم', () => { const q = Number(g.value) || 0; if (q <= 0) return; const day = A.dayOf(A.TODAY); const f = v => Math.round((Number(v) || 0) * q / 100 * 10) / 10;
            day.extras = [...(day.extras || []), { id: 'barcode-' + code, k: (crypto.randomUUID ? crypto.randomUUID() : String(Date.now())), name: name, portion: num(q) + ' جم', q: 1, n: Math.round(k100 * q / 100), p: f(nu.proteins_100g), c: f(nu.carbohydrates_100g), f: f(nu.fat_100g), img: 'shopping_cart', barcode: code, t: new Date().toTimeString().slice(0, 5) }];
            A.saveDay({ ...day }); A.refreshAll(); A.toast('أُضيف ' + name + ' إلى طعام اليوم'); m.close(); }));
      } catch (e) { result.replaceChildren(E('p', e.message || 'تعذّر البحث، تحقق من الاتصال.', 'note')); }
    }
    if (!('BarcodeDetector' in window) || !navigator.mediaDevices) { info.append(E('p', 'الماسح بالكاميرا غير مدعوم في هذا المتصفح؛ اكتب رقم الباركود بالأسفل. (يعمل في Chrome على Android).', 'note')); return; }
    info.append(video);
    (async () => {
      try {
        const det = new window.BarcodeDetector({ formats: ['ean_13', 'ean_8', 'upc_a', 'upc_e', 'code_128'] });
        stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } }); video.srcObject = stream; await video.play();
        scanTimer = setInterval(async () => { try { const r = await det.detect(video); if (r && r[0]) found(r[0].rawValue); } catch (_) {} }, 450);
      } catch (_) { info.replaceChildren(E('p', 'لم يُسمح باستخدام الكاميرا؛ اكتب رقم الباركود بالأسفل.', 'note')); }
    })();
  }

  /* ---------- حذف حساب نهائياً (للمالك — طلبات الحذف) ---------- */
  async function purgeModal() {
    const m = modal('حذف حساب نهائيًا');
    m.box.append(E('p', 'لتنفيذ طلبات حذف الحساب (سياسة الخصوصية وGoogle Play). يحذف الحساب وكل سجلاته وصوره ورسائله نهائيًا ولا يمكن التراجع. حسابات المالك لا تُحذف.', 'note'));
    let users = [];
    try { users = ((await A.api('listUsers', {})).users || []).filter(u => u.role !== 'owner' && String(u.id) !== String(A.me.id)); } catch (e) { m.box.append(E('p', e.message, 'note')); return; }
    const sel = d.createElement('select'); sel.setAttribute('aria-label', 'الحساب'); sel.append(new Option('اختر الحساب…', ''));
    users.forEach(u => sel.append(new Option(u.name + ' — ' + (u.phone || u.email || u.username || u.id), u.id)));
    const confirm = d.createElement('input'); confirm.placeholder = 'اكتب «حذف نهائي» للتأكيد'; confirm.setAttribute('aria-label', 'تأكيد الحذف');
    const go = B('حذف الحساب وكل بياناته', async () => {
      if (!sel.value || confirm.value.trim() !== 'حذف نهائي') { A.toast('اختر الحساب واكتب «حذف نهائي»'); return; }
      go.disabled = true;
      try { await A.api('accountPurge', { uid: sel.value, confirm: sel.value }); A.toast('تم حذف الحساب وكل بياناته'); m.close(); }
      catch (e) { A.toast(/unknown|غير معروف/i.test(e.message) ? 'حدّث الخادم أولًا (نشر_الخادم.bat) لتفعيل الحذف النهائي.' : e.message); go.disabled = false; }
    }, 'btn');
    go.style.background = '#b42318';
    const row = E('div', null, 'kt-actions'); row.append(sel, confirm); m.box.append(row, go);
  }
  function ownerCard() {
    if (!A.me || A.me.role !== 'owner') return; const plan = d.getElementById('v-plan'); if (!plan || d.getElementById('ktPurge')) return;
    const c = E('div', null, 'card'); c.id = 'ktPurge'; c.append(E('h2', 'طلبات حذف الحساب'), E('p', 'تنفيذ طلب مستخدم بحذف حسابه وبياناته نهائيًا.', 'note'), B('فتح أداة الحذف النهائي', purgeModal, 'btn ghost')); plan.append(c);
  }

  /* ---------- الواجهة ---------- */
  const TOOLS = [['📅', 'خطة الأسبوع', weekPlan], ['🛒', 'قائمة المشتريات', () => shopping()], ['🏅', 'التحديات والشارات', badgesModal], ['📄', 'التقرير الشهري A4', monthlyReport], ['🔎', 'ماسح الباركود', barcode]];
  function toolsCard(id) {
    const c = E('div', null, 'card kt-card'); c.id = id; c.append(E('h2', 'أدوات خفة'));
    const row = E('div', null, 'kt-tools'); TOOLS.forEach(([ic, t, fn]) => { const b = B('', fn, 'kt-tool'); b.append(E('span', ic, 'kt-ico'), E('span', t)); row.append(b); });
    c.append(row);
    const ch = challenges(), done = ch.filter(x => x.v >= x.goal).length, next = ch.filter(x => x.v < x.goal).sort((a, b) => b.v / b.goal - a.v / a.goal)[0];
    c.append(E('p', '🏅 ' + num(done) + ' شارة من ' + num(ch.length) + (next ? ' · الأقرب: ' + next.t + ' (' + num(Math.min(next.v, next.goal), 1) + '/' + num(next.goal) + ')' : ''), 'note'));
    return c;
  }
  function render() {
    if (!A.me || !A.data) return;
    ownerCard();
    const home = d.getElementById('v-home');
    if (home) { const old = d.getElementById('ktHome'), card = toolsCard('ktHome'); card.dataset.kdBlock = 'tools'; if (old) old.replaceWith(card); else home.append(card); }
    const today = d.getElementById('v-today');
    if (today && !d.getElementById('ktToday')) { const bar = E('div', null, 'kt-strip'); bar.id = 'ktToday'; bar.append(B('📅 خطة الأسبوع', weekPlan, 'fchip'), B('🛒 المشتريات', () => shopping(), 'fchip'), B('🔎 باركود', barcode, 'fchip')); const sw = today.querySelector(':scope > .kd-mealswitch'); if (sw) sw.after(bar); else today.prepend(bar); }
  }
  const style = E('style'); style.textContent =
    '.kt-box{width:min(100%,720px)!important;max-width:720px!important}.kt-wide{width:min(100%,1100px)!important;max-width:1100px!important}.kt-head{display:flex;justify-content:space-between;align-items:center;gap:10px}.kt-head h2{margin:0}' +
    '.kt-actions{display:flex;flex-wrap:wrap;gap:8px;margin:12px 0}.kt-actions .btn{flex:1 1 160px;min-height:44px}.kt-actions input{flex:2 1 180px;min-height:44px;font-size:16px}' +
    '.kt-week{display:grid;grid-template-columns:repeat(auto-fill,minmax(230px,1fr));gap:12px}.kt-day{border:1px solid var(--line);border-radius:16px;padding:12px}.kt-day h3{margin:0 0 8px;font-size:15px}.kt-meal{display:grid;gap:2px;padding:6px 0;border-top:1px dashed var(--line)}.kt-meal small{color:var(--muted)}.kt-total{font-weight:700;margin:8px 0 0}' +
    '.kt-shop h3{margin:14px 0 6px;font-size:15px}.kt-check{display:grid;grid-template-columns:auto 1fr auto;gap:10px;align-items:center;padding:8px 10px;border:1px solid var(--line);border-radius:12px;margin-bottom:6px}.kt-check input{width:22px;height:22px}.kt-check input:checked+span{text-decoration:line-through;color:var(--muted)}' +
    '.kt-badges{display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:10px}.kt-badge{border:1px solid var(--line);border-radius:16px;padding:12px;display:grid;gap:4px;opacity:.85}.kt-badge.done{border-color:var(--mint,#138358);background:var(--mint-soft,#eef7f1);opacity:1}.kt-badge progress{width:100%}.kt-ico{font-size:24px}' +
    '.kt-video{width:100%;max-height:300px;border-radius:14px;background:#000;object-fit:cover}.kt-prod{width:96px;height:96px;object-fit:contain;float:left;border-radius:10px}.kt-result{margin-top:10px}' +
    '.kt-tools{display:grid;grid-template-columns:repeat(auto-fit,minmax(120px,1fr));gap:8px}.kt-tool{display:grid;justify-items:center;gap:4px;min-height:84px;padding:10px;border:1px solid var(--line);border-radius:16px;background:var(--surface);font:inherit;font-weight:600;cursor:pointer;color:inherit}.kt-tool:hover{border-color:var(--mint,#138358)}' +
    '.kt-strip{display:flex;flex-wrap:wrap;gap:8px;margin:0 0 12px;grid-column:1/-1}@media(min-width:960px){#app #v-home>#ktHome{grid-column:1/-1!important}}';
  d.head.append(style);
  window.KHIFFA_TOOLS = { weekPlan, shopping, badges: badgesModal, monthlyReport, barcode, challenges };
  (window.KHIFFA_HOOKS = window.KHIFFA_HOOKS || []).push(render);
  (window.KHIFFA_LOGOUT_HOOKS = window.KHIFFA_LOGOUT_HOOKS || []).push(() => { d.getElementById('ktHome')?.remove(); d.getElementById('ktToday')?.remove(); d.getElementById('ktPurge')?.remove(); stopCamera(); });
  window.addEventListener('khiffa-ready', render); render();
})();
