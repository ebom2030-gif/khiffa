/* v42 — مطابقة لوحتي التصميم المعتمدتين (الجوال والكمبيوتر):
   رأس بتحية وصورة رمزية، شريط وجبات اليوم بالصور، وصفات مقترحة، تذكيرات اليوم، حلقات الأهداف، تبويبات أعلى الشاشات، أكواب الماء. */
(function () {
  'use strict';
  const A = window.KHIFFA_APP, D = window.KHIFFA_DATA, d = document;
  if (!A || !D) return;
  const E = (tag, text, cls) => { const e = d.createElement(tag); if (text != null && text !== '') e.textContent = text; if (cls) e.className = cls; return e; };
  const num = (n, f = 0) => Number(n || 0).toLocaleString('ar-u-nu-latn', { maximumFractionDigits: f });
  const PH = () => window.KHIFFA_PHOTOS;
  const go = v => { const b = d.querySelector('#tabs button[data-v="' + v + '"]'); if (b) b.click(); };
  const first = n => String(n || '').trim().split(/\s+/)[0] || '';
  const DEF_T = { b: '08:00', s1: '11:00', l: '14:00', s2: '17:00', d: '20:00' };
  const fmtT = t => { const [h, m] = String(t || '').split(':').map(Number); if (!Number.isFinite(h)) return ''; const pm = h >= 12; return pad(((h + 11) % 12) + 1) + ':' + pad(m || 0) + (pm ? ' م' : ' ص'); };
  const pad = n => String(n).padStart(2, '0');
  function setPh(img, text, w) { const P = PH(); if (P && P.apply) P.apply(img, text, w); else img.src = photo(text, w); }
  function photo(text, w) { const P = PH(); if (!P) return ''; const k = P.pick ? P.pick(text || '') : 'salad'; return P.url(P.P[k] || P.P.salad, w || 360); }
  function mealInfo(m) {
    const day = A.dayOf(A.TODAY), st = A.mealState(day, m.k), comps = A.mealComps(m.k, st);
    let title = st.title || '';
    if (!title && st.idea) { const idea = D.IDEAS.find(i => i.id === st.idea); if (idea) title = A.ideaName(idea); }
    if (!title && comps.length) title = comps.slice(0, 2).map(c => c.food.name).join(' مع ');
    return { st, title, kcal: comps.length ? A.totals(comps).n : 0, done: !!st.done, time: ((A.settings().mt || {})[m.k]) || DEF_T[m.k] };
  }

  /* ---------- الرأس ---------- */
  function header() {
    const h = d.querySelector('#app > header'); if (!h || !A.me) return;
    let g = h.querySelector('.kb-hello');
    if (!g) {
      g = E('button', null, 'kb-hello'); g.type = 'button'; g.setAttribute('aria-label', 'حسابي'); g.onclick = () => go('account');
      const av = E('span', null, 'kb-avatar'), tx = E('span', null, 'kb-hello-tx'); tx.append(E('b'), E('small', 'رحلتك نحو حياة أكثر صحة'));
      g.append(av, tx); h.append(g);
    }
    const name = A.displayName ? A.displayName() : A.me.name;
    const av = g.querySelector('.kb-avatar'), ini = first(name).charAt(0) || '؟', hi = 'أهلاً ' + first(name), hb = g.querySelector('.kb-hello-tx b');
    if (av.textContent !== ini) av.textContent = ini; if (hb.textContent !== hi) hb.textContent = hi;
  }

  /* ---------- بطاقات الرئيسية ---------- */
  function card(id, title, action) {
    const c = E('div', null, 'card kb-card'); c.id = id; c.dataset.kdBlock = id;
    const head = E('div', null, 'kb-head'); head.append(E('h2', title)); if (action) { const b = E('button', action[0], 'kb-more'); b.type = 'button'; b.onclick = action[1]; head.append(b); }
    c.append(head); return c;
  }
  function mealStrip() {
    const c = card('kbMeals', 'وجبات اليوم', ['عرض الكل', () => go('today')]);
    const row = E('div', null, 'kb-strip');
    D.MEALS.forEach(m => {
      const x = mealInfo(m), b = E('button', null, 'kb-meal' + (x.done ? ' done' : '')); b.type = 'button';
      b.onclick = () => { A.setCur(A.TODAY); A.openMealSheet(m, 'idea'); };
      const top = E('div', null, 'kb-meal-top'); top.append(E('b', m.t), E('small', fmtT(x.time)));
      const img = E('img'); img.alt = ''; img.loading = 'lazy'; img.decoding = 'async'; setPh(img, x.title || m.t); img.onerror = () => img.remove();
      const fig = E('div', null, 'kb-meal-img'); fig.append(img); if (x.done) fig.append(E('span', '✓', 'kb-check'));
      b.append(top, fig, E('span', x.title || 'اختر وجبتك', 'kb-meal-name'), E('small', x.kcal ? num(x.kcal) + ' سعرة' : 'لم تُسجَّل بعد', 'kb-meal-kcal'));
      row.append(b);
    });
    c.append(row); return c;
  }
  function recipes() {
    const R = window.KHIFFA_SUGGESTIONS; if (!R || !R.recipes) return null;
    const c = card('kbRecipes', 'وصفات مقترحة لك', ['عرض الكل', () => window.KHIFFA_RECIPE_LIBRARY ? window.KHIFFA_RECIPE_LIBRARY() : go('recipes')]);
    const st = A.settings(), favs = st.recipeFavorites || [], day = Number(A.TODAY.replace(/-/g, '')) || 1;
    const pool = R.recipes.filter(r => { try { return R.allowed ? R.allowed(r, D.FOODS, st) : true; } catch (_) { return true; } });
    const pick = []; for (let i = 0; i < pool.length && pick.length < 4; i++) { const r = pool[(day * 7 + i * 13) % pool.length]; if (!pick.includes(r)) pick.push(r); }
    const row = E('div', null, 'kb-recipes');
    pick.forEach(r => {
      const kc = R.calories ? R.calories(r.items.map(x => ({ id: x.id, n: x.g / D.FOODS[x.id].grams })), D.FOODS) : 0;
      const b = E('button', null, 'kb-recipe'); b.type = 'button'; b.onclick = () => window.KHIFFA_RECIPE_LIBRARY && window.KHIFFA_RECIPE_LIBRARY();
      const img = E('img'); img.alt = ''; img.loading = 'lazy'; setPh(img, r.title, 420); img.onerror = () => img.remove();
      const t = E('div', null, 'kb-recipe-tx'); t.append(E('b', r.title), E('small', num(kc) + ' سعرة · ' + (R.cuisines[r.cuisine] || '')));
      b.append(img, t); if (favs.includes(r.id)) b.append(E('span', '♥', 'kb-fav')); row.append(b);
    });
    c.append(row); return c;
  }
  function reminders() {
    const c = card('kbRemind', 'تذكيرات اليوم', ['تعديل', () => { go('plan'); setTimeout(() => d.getElementById('rmCard')?.scrollIntoView({ behavior: 'smooth' }), 80); }]);
    const list = E('div', null, 'kb-remind'), day = A.dayOf(A.TODAY), goal = Number(A.settings().water) || 8;
    const items = D.MEALS.map(m => { const x = mealInfo(m); return { t: x.time, label: m.t, done: x.done, on: () => { A.setCur(A.TODAY); A.openMealSheet(m, 'idea'); } }; });
    items.push({ t: '21:00', label: 'شرب الماء (' + num(A.bottles(day)) + ' من ' + num(goal) + ')', done: A.bottles(day) >= goal, on: () => go('hydration') });
    items.sort((a, b) => a.t < b.t ? -1 : 1).forEach(it => { const r = E('button', null, 'kb-rem' + (it.done ? ' done' : '')); r.type = 'button'; r.onclick = it.on; r.append(E('span', it.done ? '✓' : '', 'kb-box'), E('span', it.label), E('small', fmtT(it.t))); list.append(r); });
    c.append(list); return c;
  }
  function ring(value, goal, label, sub, color) {
    const p = goal > 0 ? Math.max(0, Math.min(100, Math.round(value / goal * 100))) : 0, w = E('div', null, 'kb-ring');
    w.innerHTML = '<svg viewBox="0 0 42 42" aria-hidden="true"><circle cx="21" cy="21" r="16" fill="none" stroke="var(--line)" stroke-width="4"/><circle cx="21" cy="21" r="16" fill="none" stroke="' + color + '" stroke-width="4" stroke-linecap="round" stroke-dasharray="' + (p * 1.005).toFixed(1) + ' 100.5" transform="rotate(-90 21 21)"/></svg>';
    w.append(E('b', num(p) + '%'), E('span', label), E('small', sub)); w.setAttribute('aria-label', label + ' ' + p + '%'); return w;
  }
  function goals() {
    const c = card('kbGoals', 'أهدافي', ['عرض الكل', () => go('goals')]);
    const s = A.settings(), day = A.dayOf(A.TODAY), stepsG = Number(s.stepsGoal) || 7500, actG = Number(s.activeKcalGoal) || 300, water = Number(s.water) || 8;
    let kc = 0; D.MEALS.forEach(m => { const st = A.mealState(day, m.k); if (st.done) kc += A.totals(A.mealComps(m.k, st)).n; });
    const row = E('div', null, 'kb-rings');
    row.append(ring(A.bottles(day), water, 'الماء', num(A.bottles(day)) + '/' + num(water) + ' أكواب', '#2f8cf0'), ring(Number(day.steps) || 0, stepsG, 'الخطوات', num(day.steps || 0) + ' خطوة', '#1E8A4C'), ring(Number(day.activeKcal) || 0, actG, 'النشاط', num(day.activeKcal || 0) + ' سعرة', '#F28C28'), ring(kc, Number(s.level) || 1600, 'السعرات', num(kc) + ' سعرة', '#C9A227'));
    c.append(row); return c;
  }
  function home() {
    const h = d.getElementById('v-home'); if (!h) return;
    const blocks = [mealStrip(), recipes(), reminders(), goals()].filter(Boolean);
    blocks.forEach(b => { const old = d.getElementById(b.id); if (old) old.replaceWith(b); else h.append(b); });
  }

  /* ---------- تبويبات أعلى الشاشات + أكواب الماء ---------- */
  function pills(sectionId, tabs) {
    const sec = d.getElementById(sectionId); if (!sec) return;
    let bar = sec.querySelector(':scope > .kb-pills'); if (bar) return;
    bar = E('div', null, 'kb-pills'); bar.setAttribute('role', 'tablist');
    tabs.forEach(([label, find], i) => { const b = E('button', label); b.type = 'button'; b.setAttribute('role', 'tab'); b.setAttribute('aria-selected', String(i === 0)); b.onclick = () => { bar.querySelectorAll('button').forEach(x => x.setAttribute('aria-selected', String(x === b))); const t = find(sec); if (t) t.scrollIntoView({ behavior: 'smooth', block: 'start' }); }; bar.append(b); });
    const h1 = sec.querySelector(':scope > .kd-page-heading'); if (h1) h1.after(bar); else sec.prepend(bar);
  }
  const byTitle = re => sec => [...sec.querySelectorAll('h2,h3')].find(h => re.test(h.textContent))?.closest('.card') || null;
  function screens() {
    pills('v-body', [['الوزن', byTitle(/تركيب الجسم|الوزن/)], ['القياسات', byTitle(/الوسط|القياسات/)], ['الصور', byTitle(/إضافة قياس|صورة/)], ['التحليلات', byTitle(/التطور|كل قياسات/)]]);
    pills('v-goals', [['أهدافي', s => s.querySelector('.kd-goal-grid')], ['إنجازاتي', () => { window.KHIFFA_TOOLS && window.KHIFFA_TOOLS.badges(); return null; }], ['الإعداد', byTitle(/إعداد أهداف/)]]);
    pills('v-reports', [['أسبوعي', s => s.querySelector('.card')], ['شهري (A4)', () => { window.KHIFFA_TOOLS && window.KHIFFA_TOOLS.monthlyReport(); return null; }]]);
    pills('v-programs', [['خطة حالية', byTitle(/خطتك الحالية/)], ['خطة الأسبوع', () => { window.KHIFFA_TOOLS && window.KHIFFA_TOOLS.weekPlan(); return null; }], ['المشتريات', () => { window.KHIFFA_TOOLS && window.KHIFFA_TOOLS.shopping(); return null; }]]);
    const w = d.querySelector('#v-hydration .kd-water-card');
    if (w && !w.querySelector('.kb-cups')) {
      const goal = Number(A.settings().water) || 8, n = A.bottles(A.dayOf(A.TODAY)), cups = E('div', null, 'kb-cups'); cups.setAttribute('aria-hidden', 'true');
      for (let i = 0; i < Math.max(goal, n); i++) cups.append(E('span', null, i < n ? 'on' : ''));
      w.querySelector('progress')?.after(cups);
    }
  }
  /* ---------- خيارات الوجبة ظاهرة مباشرة في «وجبات اليوم» ---------- */
  function options(m) {
    const R = window.KHIFFA_SUGGESTIONS, st = A.settings(), out = [];
    if (R) {
      const f = (st.dailySuggestions && st.dailySuggestions.filters && st.dailySuggestions.filters[m.k]) || [], sel = f.length ? f : Object.keys(R.cuisines);
      const tgt = A.mealTargetKcal ? A.mealTargetKcal(m.k) : 320, seed = Number(A.cur.replace(/-/g, '')) % 97;
      for (let i = 0; i < 6 && out.length < 2; i++) { const x = R.suggest(m.k, sel, D.FOODS, st, tgt, seed + i * 5); if (x && !out.some(o => o.title === x.title)) out.push({ kind: 'recipe', title: x.title, sub: R.cuisines[x.cuisine] || '', kcal: R.calories(x.items, D.FOODS), items: x.items }); }
    }
    const ideas = D.IDEAS.filter(i => !i.hidden && i.m === m.k && A.mealComps(m.k, { idea: i.id }).every(c => !(st.noGluten && c.food.gluten) && !(st.noLactose && c.food.lactose)));
    if (ideas.length) { const i = ideas[(Number(A.cur.replace(/-/g, '')) + m.k.length) % ideas.length]; out.push({ kind: 'idea', id: i.id, title: A.ideaName(i), sub: 'وجبة جاهزة', kcal: A.totals(A.mealComps(m.k, { idea: i.id })).n }); }
    return out;
  }
  function choose(m, o) {
    const done = A.cur <= A.TODAY;
    if (o.kind === 'idea') A.setMeal(m.k, { mode: 'idea', idea: o.id, items: null, title: null, planned: !done });
    else A.setMeal(m.k, { mode: 'custom', title: o.title, items: o.items.map(x => ({ ...x, food: structuredClone(D.FOODS[x.id]) })), planned: !done });
    A.refreshAll(); A.toast((done ? 'سُجّل ' : 'أُضيف ') + m.t + ': ' + o.title, A.undoMeal);
  }
  function mealOptions() {
    const sec = d.getElementById('v-today'); if (!sec) return;
    const cards = [...sec.querySelectorAll('.mcard')]; if (cards.length !== D.MEALS.length) return;
    cards.forEach((c, i) => {
      const m = D.MEALS[i]; if (c.querySelector('.chosen') || c.querySelector('.kb-opts')) return;
      const box = E('div', null, 'kb-opts'); box.append(E('p', 'اختر ' + m.t + ' بضغطة:', 'kb-opts-t'));
      const row = E('div', null, 'kb-opts-row');
      options(m).forEach(o => { const b = E('button', null, 'kb-opt'); b.type = 'button'; const img = E('img'); img.alt = ''; img.loading = 'lazy'; setPh(img, o.title, 300); img.onerror = () => img.remove(); const t = E('div', null, 'kb-opt-tx'); t.append(E('b', o.title), E('small', num(o.kcal) + ' سعرة · ' + o.sub)); b.append(img, t, E('span', 'اختيار', 'kb-opt-go')); b.onclick = e => { e.stopPropagation(); choose(m, o); }; row.append(b); });
      const more = E('button', 'خيارات أكثر ومطابخ العالم ←', 'kb-opt-more'); more.type = 'button'; more.onclick = e => { e.stopPropagation(); A.openMealSheet(m, 'idea'); };
      box.append(row, more); c.append(box);
    });
  }
  function render() { if (!A.me || !A.data) return; header(); home(); screens(); mealOptions(); }

  const css = E('style'); css.id = 'kb-style'; css.textContent = `
#app>header .kb-hello{display:flex;align-items:center;gap:10px;border:0;background:var(--surface);border:1px solid var(--line);border-radius:16px;padding:6px 10px 6px 14px;font:inherit;color:inherit;cursor:pointer;text-align:right}
.kb-avatar{width:40px;height:40px;border-radius:50%;display:grid;place-items:center;background:linear-gradient(135deg,#1E8A4C,#0F5132);color:#fff;font-weight:700;font-size:18px;flex:none}
.kb-hello-tx{display:grid;line-height:1.3}.kb-hello-tx b{font-size:14px}.kb-hello-tx small{font-size:11px;color:var(--muted)}
@media(max-width:959px){#app>header{display:grid!important;grid-template-columns:1fr auto 1fr;align-items:center}#app>header .logo{grid-column:2;justify-self:center}#app>header .hdr-side{grid-column:3;grid-row:1;justify-self:start}#app>header .kb-hello{grid-column:1;grid-row:1;justify-self:start;padding:0;border:0;background:none}.kb-hello-tx,#app>header .date,#app>header #kfSaveState{display:none!important}.kb-avatar{width:38px;height:38px}}
.kb-card .kb-head{display:flex;justify-content:space-between;align-items:center;gap:8px;margin-bottom:10px}.kb-card h2{margin:0}
.kb-more{border:0;background:var(--mint-soft,#e8f4ec);color:var(--mint,#138358);border-radius:999px;padding:4px 12px;font:inherit;font-size:12px;font-weight:600;cursor:pointer}
.kb-strip{display:grid;grid-auto-flow:column;grid-auto-columns:minmax(150px,1fr);gap:10px;overflow-x:auto;scroll-snap-type:x mandatory;padding-bottom:4px}
.kb-meal{scroll-snap-align:start;display:grid;gap:6px;text-align:right;border:1px solid var(--line);border-radius:16px;padding:10px;background:var(--surface);font:inherit;color:inherit;cursor:pointer}
.kb-meal-top{display:flex;justify-content:space-between;font-size:12px}.kb-meal-top small{color:#E07A1F}
.kb-meal-img{position:relative;height:96px;border-radius:12px;overflow:hidden;background:var(--mint-soft,#e8f4ec)}.kb-meal-img img{width:100%;height:100%;object-fit:cover}
.kb-check{position:absolute;bottom:6px;left:6px;width:24px;height:24px;border-radius:50%;background:#1E8A4C;color:#fff;display:grid;place-items:center;font-size:13px;border:2px solid #fff}
.kb-meal-name{font-weight:600;font-size:13px;line-height:1.5;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;min-height:2.9em}.kb-meal-kcal{color:var(--muted);font-size:12px}
.kb-recipes{display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:10px}
.kb-recipe{position:relative;display:grid;border:1px solid var(--line);border-radius:16px;overflow:hidden;padding:0;background:var(--surface);font:inherit;color:inherit;text-align:right;cursor:pointer}
.kb-recipe img{width:100%;height:110px;object-fit:cover;background:var(--mint-soft,#e8f4ec)}.kb-recipe-tx{display:grid;gap:2px;padding:8px 10px}.kb-recipe-tx b{font-size:13px;line-height:1.5}.kb-recipe-tx small{color:var(--muted);font-size:11px}
.kb-fav{position:absolute;top:8px;left:8px;width:28px;height:28px;border-radius:50%;background:#fff;color:#e0245e;display:grid;place-items:center}
.kb-remind{display:grid;gap:6px}.kb-rem{display:grid;grid-template-columns:auto 1fr auto;align-items:center;gap:10px;border:0;border-bottom:1px solid var(--line);background:none;padding:8px 2px;font:inherit;color:inherit;text-align:right;cursor:pointer}
.kb-rem small{color:var(--muted)}.kb-box{width:22px;height:22px;border-radius:7px;border:2px solid var(--line);display:grid;place-items:center;color:#fff;font-size:12px}.kb-rem.done .kb-box{background:#1E8A4C;border-color:#1E8A4C}.kb-rem.done span:nth-child(2){color:var(--muted);text-decoration:line-through}
.kb-rings{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:8px}.kb-ring{position:relative;display:grid;justify-items:center;gap:2px;text-align:center}
.kb-ring svg{width:74px;height:74px}.kb-ring b{position:absolute;top:24px;font-size:13px}.kb-ring span{font-weight:600;font-size:13px}.kb-ring small{color:var(--muted);font-size:11px}
.kb-pills{display:flex;gap:6px;padding:5px;border-radius:999px;background:var(--surface);border:1px solid var(--line);margin:0 0 14px;grid-column:1/-1;overflow-x:auto}
.kb-pills button{flex:1;min-height:40px;white-space:nowrap;border:0;border-radius:999px;background:transparent;font:inherit;font-weight:600;color:var(--muted);cursor:pointer;padding:0 12px}.kb-pills button[aria-selected="true"]{background:#1E8A4C;color:#fff}
.kb-opts{margin-top:10px;border-top:1px dashed var(--line);padding-top:10px}.kb-opts-t{margin:0 0 8px;font-weight:700;font-size:13px;color:var(--mint,#138358)}
.kb-opts-row{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px}
.kb-opt{display:grid;grid-template-rows:auto 1fr auto;border:1px solid var(--line);border-radius:14px;overflow:hidden;padding:0;background:var(--surface);font:inherit;color:inherit;text-align:right;cursor:pointer}
.kb-opt img{width:100%;height:84px;object-fit:cover;background:var(--mint-soft,#e8f4ec)}.kb-opt-tx{display:grid;gap:2px;padding:6px 8px}.kb-opt-tx b{font-size:12.5px;line-height:1.5}.kb-opt-tx small{font-size:11px;color:var(--muted)}
.kb-opt-go{margin:0 8px 8px;border-radius:999px;background:#1E8A4C;color:#fff;text-align:center;font-size:12px;font-weight:700;padding:5px 0}
.kb-opt-more{margin-top:8px;width:100%;min-height:40px;border:0;border-radius:12px;background:var(--mint-soft,#e8f4ec);color:var(--mint,#138358);font:inherit;font-weight:700;cursor:pointer}
@media(max-width:420px){.kb-opts-row{grid-template-columns:repeat(3,minmax(0,1fr));gap:6px}.kb-opt img{height:64px}.kb-opt-tx b{font-size:11.5px}}
.kb-cups{display:flex;flex-wrap:wrap;gap:6px;margin:10px 0}.kb-cups span{width:24px;height:32px;border:2px solid #2f8cf0;border-top-width:3px;border-radius:3px 3px 8px 8px;opacity:.45}.kb-cups span.on{background:linear-gradient(#7cc0ff,#2f8cf0);opacity:1}
@media(min-width:960px){#app #v-home>#kbMeals{grid-column:span 8;order:-75}#app #v-home>#kbRemind{grid-column:span 4;order:-75}#app #v-home>#kbRecipes{grid-column:span 8;order:-70}#app #v-home>#kbGoals{grid-column:span 4;order:-70}
#app>header .kd-search{flex:1;max-width:560px;min-height:46px;border-radius:14px;text-align:right;padding:0 18px}}
@media(max-width:959px){#app>header>.hdr-side{display:none!important}#app>header #who{display:none!important}#app>header>*:not(.logo):not(.kb-hello):not(.hdr-side){grid-row:1!important;grid-column:3!important;justify-self:end!important;margin:0!important}.kb-recipes{grid-template-columns:repeat(2,minmax(0,1fr))}.kb-recipe img{height:96px}}
@media(min-width:960px){#app>header>.logo{display:none!important}}
@media(max-width:959px){#app #v-home>#kbMeals{order:4!important}#app #v-home>#kbGoals{order:5!important}#app #v-home>#kbRecipes{order:6!important}#app #v-home>#kbRemind{order:7!important}.kb-rings{grid-template-columns:repeat(2,minmax(0,1fr))}}
`;
  d.head.append(css);
  (window.KHIFFA_HOOKS = window.KHIFFA_HOOKS || []).push(render);
  (window.KHIFFA_LOGOUT_HOOKS = window.KHIFFA_LOGOUT_HOOKS || []).push(() => { d.querySelector('.kb-hello')?.remove(); ['kbMeals', 'kbRecipes', 'kbRemind', 'kbGoals'].forEach(id => d.getElementById(id)?.remove()); });
  let t = 0; new MutationObserver(() => { clearTimeout(t); t = setTimeout(() => { if (A.me && A.data) { header(); screens(); mealOptions(); } }, 120); }).observe(d.getElementById('app') || d.body, { childList: true, subtree: true });
  window.addEventListener('khiffa-ready', render); render();
})();
