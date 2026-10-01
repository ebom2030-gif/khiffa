/* خفّة – Khiffa — app logic */
(function () {
'use strict';
const D = window.KHIFFA_DATA;
const $ = s => document.querySelector(s);
const API = (window.KHIFFA_CONFIG || {}).API_URL || '';
const ar = (n, d = 1) => n == null || n === '' || isNaN(n) ? '—' : Number(n).toLocaleString('ar-EG', { maximumFractionDigits: d });
const pad = n => String(n).padStart(2, '0');
const dkey = d => d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
const parseKey = k => { const [y, m, d] = k.split('-').map(Number); return new Date(y, m - 1, d); };
const addDays = (k, n) => { const d = parseKey(k); d.setDate(d.getDate() + n); return dkey(d); };
const fmt = (k, o) => parseKey(k).toLocaleDateString('ar-EG', o);
const TODAY = dkey(new Date());
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const imgURL = n => 'https://cdn.jsdelivr.net/gh/microsoft/fluentui-emoji@main/assets/' + encodeURIComponent(n.charAt(0).toUpperCase() + n.slice(1).replace(/_/g, ' ')) + '/3D/' + n + '_3d.png';
const img = (name, cls = '') => window.KHIFFA_ICON ? window.KHIFFA_ICON(name, cls) : '<img class="fimg ' + cls + '" src="' + imgURL(name) + '" alt="">';
const GORDER = ['S', 'P', 'M', 'F', 'V', 'Fa'];

/* ================= storage & sync ================= */
const store = {
  get(k, d) { try { const v = localStorage.getItem('khiffa.' + k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
  set(k, v) { try { localStorage.setItem('khiffa.' + k, JSON.stringify(v)); } catch (e) {} },
  del(k) { try { localStorage.removeItem('khiffa.' + k); } catch (e) {} }
};
const S = { pin: store.get('pin', null), uid: store.get('uid', null), data: null, cur: TODAY, queue: store.get('queue', []), ideaFilter: 'b' };

async function api(action, payload) {
  if (!API || /PASTE_/.test(API)) throw new Error('لازم تحط رابط Apps Script في config.js');
  const r = await fetch(API, { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify({ action, pin: S.pin, uid: S.uid, ...payload }) });
  const j = await r.json(); if (!j.ok) throw new Error(j.error || 'خطأ'); return j;
}
function setSync(st) { const el = $('#sync'); el.className = 'sync ' + st; el.title = { ok: 'متزامن', wait: 'جاري الحفظ…', off: 'بدون إنترنت، هيتحفظ لما النت يرجع' }[st]; }
function enqueue(action, payload, key) { S.queue = S.queue.filter(q => q.key !== key); S.queue.push({ action, payload, key, uid: S.uid }); store.set('queue', S.queue); flush(); }
let flushing = false, flushTimer;
function flush() { clearTimeout(flushTimer); flushTimer = setTimeout(doFlush, 600); }
async function doFlush() {
  if (flushing) return; if (!S.queue.length) { setSync('ok'); return; }
  flushing = true; setSync('wait');
  try {
    while (S.queue.length) {
      const q = S.queue[0], save = S.uid; S.uid = q.uid;
      try { await api(q.action, q.payload); } finally { S.uid = save; }
      S.queue.shift(); store.set('queue', S.queue);
    }
    setSync('ok');
  } catch (e) { setSync('off'); if (/رمز/.test(e.message)) { logout(); return; } setTimeout(flush, 15000); }
  finally { flushing = false; }
}
window.addEventListener('online', flush);

async function boot() {
  const cached = store.get('data:' + (S.uid || 'me'), null);
  if (cached) { S.data = cached; showApp(); }
  try {
    const j = await api('bootstrap', {});
    S.data = j.data; S.uid = j.data.user.id; store.set('uid', S.uid);
    mergeQueue(); persist(); showApp(); flush();
  } catch (e) {
    if (/رمز/.test(e.message)) { logout(e.message); return; }
    if (!cached) { $('#loginErr').textContent = e.message; $('#loginErr').hidden = false; showLogin(); } else setSync('off');
  }
}
function mergeQueue() {
  S.queue.filter(q => q.uid === S.uid).forEach(q => {
    if (q.action === 'saveDay') upsertLocal('days', q.payload.day);
    if (q.action === 'saveInbody') upsertLocal('inbody', q.payload.reading);
    if (q.action === 'saveMeasure') upsertLocal('measures', q.payload.measure);
    if (q.action === 'saveSettings') S.data.settings = q.payload.settings;
  });
}
function upsertLocal(col, row) { const a = (S.data[col] || []).filter(r => r.date !== row.date); a.push(row); a.sort((x, y) => x.date < y.date ? -1 : 1); S.data[col] = a; }
function persist() { store.set('data:' + S.uid, S.data); }
function showLogin() { $('#login').hidden = false; $('#app').hidden = true; $('#tabs').hidden = true; setTimeout(() => $('#pin').focus(), 50); }
function showApp() { $('#login').hidden = true; $('#app').hidden = false; $('#tabs').hidden = false; renderAll(); }
function logout(msg) {
  ['pin', 'uid', 'queue'].forEach(k => store.del(k));
  try { Object.keys(localStorage).filter(k => k.startsWith('khiffa.data:')).forEach(k => localStorage.removeItem(k)); } catch (e) {}
  S.pin = null; S.uid = null; S.data = null; S.queue = [];
  if (msg) { $('#loginErr').textContent = msg; $('#loginErr').hidden = false; }
  showLogin();
}
$('#loginForm').onsubmit = e => { e.preventDefault(); const p = $('#pin').value.trim(); if (!p) return; S.pin = p; store.set('pin', p); $('#loginErr').hidden = true; boot(); };
$('#logout').onclick = () => logout();

/* ================= plan engine ================= */
const settings = () => ({ level: 1600, activity: 1.375, water: 10, noGluten: false, noLactose: false, ...(S.data.settings || {}) });
const level = () => D.LEVELS[settings().level] || D.LEVELS[1600];
const allowed = f => { const st = settings(); return !(st.noGluten && f.gluten) && !(st.noLactose && f.lactose); };
const ideaAllowed = idea => resolve(idea.parts, level()[idea.m] || {}).every(x => allowed(x.food));

/* distribute a meal's exchange targets across the foods an idea (or a custom pick) lists */
function resolve(parts, target) {
  const out = []; let legS = 0;
  const order = ['P'].concat(GORDER.filter(g => g !== 'P'));
  order.forEach(g => {
    let n = target[g] || 0; if (g === 'S') n = Math.max(0, n - legS);
    const list = (parts[g] || []).map(x => Array.isArray(x) ? { id: x[0], fixed: x[1] } : { id: x });
    if (g === 'V' && n && list.length > n) n = list.length; // vegetables: every picked type gets its own portion
    if (!n || !list.length) return;
    const counts = list.map(() => 0); let left = n;
    list.forEach((it, i) => { if (it.fixed) { const k = Math.min(it.fixed, left); counts[i] = k; left -= k; } });
    const free = list.map((it, i) => i).filter(i => !list[i].fixed);
    if (!free.length && left > 0) counts[counts.length - 1] += left, left = 0;
    for (let r = 0; left > 0; r++) { counts[free[r % free.length]]++; left--; }
    list.forEach((it, i) => { if (!counts[i]) return; const food = D.FOODS[it.id]; out.push({ food, n: counts[i] }); if (g === 'P' && food.leg) legS += counts[i]; });
  });
  return out;
}
function totals(comps) { const t = { n: 0, p: 0, c: 0, f: 0 }; comps.forEach(x => { t.n += x.food.n * x.n; t.p += x.food.p * x.n; t.c += x.food.c * x.n; t.f += x.food.f * x.n; }); return t; }
function levelTotals(L) {
  const avg = {}; GORDER.forEach(g => { const fs = Object.values(D.FOODS).filter(f => f.g === g && !f.leg); avg[g] = ['n', 'p', 'c', 'f'].reduce((o, k) => (o[k] = fs.reduce((s, f) => s + f[k], 0) / fs.length, o), {}); });
  const t = { n: 0, p: 0, c: 0, f: 0 }; Object.values(D.LEVELS[L]).forEach(m => Object.keys(m).forEach(g => ['n', 'p', 'c', 'f'].forEach(k => t[k] += avg[g][k] * m[g])));
  return t;
}
function amountText(food, n) {
  const g = Math.round(food.grams * n);
  const unit = ar(g, 0) + (food.g === 'M' ? ' مل' : ' ج');
  if (food.id === 'egg') return ar(n) + (n === 1 ? ' بيضة' : n === 2 ? ' بيضتين' : ' بيضات');
  if (food.id === 'eggwhite') return 'بياض ' + ar(n * 2) + ' بيضات';
  if (food.id === 'toast') return (n === 1 ? 'شريحة' : n === 2 ? 'شريحتين' : ar(n) + ' شرائح') + ' (' + unit + ')';
  return unit;
}
function mealState(day, k) { return (day.meals || {})[k] || {}; }
function mealComps(k, st) {
  const tgt = level()[k] || {};
  if (st.mode === 'custom' && st.picks) return resolve(Object.fromEntries(Object.entries(st.picks).filter(([, v]) => Array.isArray(v) ? v.length : v).map(([g, id]) => [g, Array.isArray(id) ? id : [id]])), tgt);
  if (st.idea) { const idea = D.IDEAS.find(i => i.id === st.idea); if (idea) return resolve(idea.parts, tgt); }
  return [];
}
function ideaName(idea) { return idea.name || D.FOODS[idea.parts.F[0]].name; }
function mealSummary(comps) { const tags = [...new Set(comps.map(x => x.food.limit).filter(Boolean))]; return { kcal: Math.round(totals(comps).n), tags }; }

/* ================= day data ================= */
const dayOf = k => (S.data.days || []).find(d => d.date === k) || { date: k, meals: {}, water: 0 };
function saveDay(day) { day.updated = new Date().toISOString(); upsertLocal('days', day); persist(); enqueue('saveDay', { day }, 'day:' + S.uid + ':' + day.date); }
function setMeal(k, patch, dateKey = S.cur) {
  const d = dayOf(dateKey); const cur = mealState(d, k); const next = { ...cur, ...patch };
  const comps = mealComps(k, next); Object.assign(next, mealSummary(comps));
  d.meals = { ...(d.meals || {}), [k]: next }; saveDay({ ...d });
}
function weekKeys(k) { const d = parseKey(k); const back = (d.getDay() + 1) % 7; const out = []; for (let i = 0; i <= back; i++) out.push(addDays(k, -i)); return out; }
function weekCounts(k, planned) {
  const c = {}; D.LIMITS.forEach(l => c[l[0]] = 0);
  weekKeys(k).forEach(key => { const day = dayOf(key); (day.extras || []).forEach(x => { if (x.tag) c[x.tag] = (c[x.tag] || 0) + 1; }); Object.keys(day.meals || {}).forEach(m => { const st = day.meals[m]; if (!st || !(st.done || planned)) return; (st.tags || []).forEach(t => c[t] = (c[t] || 0) + 1); }); });
  return c;
}

/* ================= render: today ================= */
function renderToday() {
  const st0 = settings(), L = level(), day = dayOf(S.cur), LT = levelTotals(st0.level);
  $('#planName').textContent = 'نظام ' + ar(st0.level) + ' سعرة' + (st0.noGluten ? ' – بدون جلوتين' : '') + (st0.noLactose ? ' – بدون لاكتوز' : '');
  $('#dLabel').textContent = S.cur === TODAY ? 'اليوم – ' + fmt(S.cur, { day: 'numeric', month: 'long' }) : fmt(S.cur, { weekday: 'long', day: 'numeric', month: 'long' });
  $('#dNext').disabled = S.cur >= addDays(TODAY, 6);
  const eaten = { n: 0, p: 0, c: 0, f: 0 };
  D.MEALS.forEach(m => { const st = mealState(day, m.k); if (st.done) { const t = totals(mealComps(m.k, st)); ['n', 'p', 'c', 'f'].forEach(x => eaten[x] += t[x]); } });
  (day.extras || []).forEach(x => ['n', 'p', 'c', 'f'].forEach(k => eaten[k] += (x[k] || 0) * (x.q || 1)));
  $('#kcalLeft').textContent = ar(Math.max(0, Math.round(st0.level - eaten.n)), 0); $('#kcalTarget').textContent = ar(st0.level, 0);
  $('#ringFg').setAttribute('stroke-dashoffset', 326.7 * (1 - Math.min(1, eaten.n / st0.level)));
  [['P', 'p'], ['C', 'c'], ['F', 'f']].forEach(([id, k]) => { $('#b' + id).style.width = Math.min(1, eaten[k] / LT[k]) * 100 + '%'; $('#t' + id).textContent = ar(Math.round(eaten[k]), 0) + ' / ' + ar(Math.round(LT[k]), 0) + ' ج'; });

  const box = $('#meals'); box.innerHTML = '';
  D.MEALS.forEach(m => {
    const st = mealState(day, m.k), tgt = L[m.k] || {}, comps = mealComps(m.k, st);
    const card = document.createElement('div'); card.className = 'card mcard' + (st.done ? ' done' : '');
    const slots = GORDER.filter(g => tgt[g]).map(g => '<span class="slot"><i style="background:' + D.GROUPS[g].color + '"></i>' + ar(tgt[g]) + ' ' + D.GROUPS[g].short + '</span>').join('');
    card.innerHTML = '<div class="mhead">' + img(m.img, 'lg') + '<div><div class="t">' + m.t + '</div><div class="tag">' + m.when + '</div><div class="slots">' + slots + '</div></div>' +
      '<button class="chk' + (st.done ? ' on' : '') + '" aria-pressed="' + !!st.done + '" aria-label="خلّصت ' + m.t + '"' + (comps.length ? '' : ' disabled title="اختاري الوجبة الأول"') + '>✓</button></div>';
    if (comps.length) {
      const t = totals(comps); const idea = st.mode !== 'custom' && st.idea ? D.IDEAS.find(i => i.id === st.idea) : null;
      const title = idea ? ideaName(idea) : 'وجبة من اختيارك';
      card.insertAdjacentHTML('beforeend', '<div class="chosen"><div class="nm"><span>' + esc(title) + (st.planned && !st.done ? ' <span class="tagchip">مقترحة</span>' : '') + '</span><span class="kc num">' + ar(Math.round(t.n), 0) + ' سعرة</span></div>' +
        comps.map(x => '<div class="comp">' + img(x.food.img, 'sm') + '<span>' + esc(x.food.name) + '</span><span class="amt num">' + amountText(x.food, x.n) + '</span></div>').join('') +
        (idea && idea.how ? '<p class="note" style="margin:6px 0 0">' + esc(idea.how) + '</p>' : '') + '</div>');
    }
    const act = document.createElement('div'); act.className = 'mact';
    act.innerHTML = '<button class="btn ghost sm" data-a="idea">' + (comps.length ? 'غيّري الوجبة' : 'اختاري وجبة جاهزة') + '</button><button class="btn ghost sm" data-a="custom">ركّبي بنفسك</button>';
    card.append(act);
    card.querySelector('.chk').onclick = () => { if (!comps.length) return; setMeal(m.k, { done: !st.done, planned: false }); renderToday(); };
    act.querySelector('[data-a="idea"]').onclick = () => openMealSheet(m, 'idea');
    act.querySelector('[data-a="custom"]').onclick = () => openMealSheet(m, 'custom');
    box.append(card);
  });
  renderLimits();
  const cups = $('#cups'); cups.innerHTML = '';
  for (let i = 1; i <= st0.water; i++) { const c = document.createElement('button'); c.className = 'cup' + (i <= (day.water || 0) ? ' on' : ''); c.setAttribute('aria-label', 'كوب ' + i); c.onclick = () => { const d = dayOf(S.cur); d.water = (d.water === i ? i - 1 : i); saveDay({ ...d }); renderToday(); }; cups.append(c); }
  $('#waterTxt').textContent = ar(day.water || 0) + ' من ' + ar(st0.water) + ' أكواب';
  const ws = (S.data.days || []).filter(d => d.weight).map(d => d.date).sort().reverse()[0];
  $('#wLast').textContent = ws ? 'آخر وزن مسجل: ' + ar(dayOf(ws).weight) + ' كجم (' + fmt(ws, { day: 'numeric', month: 'short' }) + ')' : 'سجلي وزنك الصبح على الريق بعد الحمام.';
  if (document.activeElement !== $('#wIn')) $('#wIn').value = day.weight || '';
  if (document.activeElement !== $('#noteIn')) $('#noteIn').value = day.note || '';
  (window.KHIFFA_HOOKS || []).forEach(f => { try { f(day); } catch (e) { console.error(e); } });
}
function renderLimits() {
  const c = weekCounts(S.cur, false);
  $('#limits').innerHTML = D.LIMITS.map(([k, l, max]) => { const v = c[k] || 0, cls = v > max ? 'over' : v === max ? 'full' : ''; return '<div class="lim ' + cls + '"><div class="eyebrow">' + l + '</div><div class="v num">' + ar(v) + ' من ' + ar(max) + '</div></div>'; }).join('');
}
$('#dPrev').onclick = () => { S.cur = addDays(S.cur, -1); renderToday(); };
$('#dNext').onclick = () => { if (S.cur >= addDays(TODAY, 6)) return; S.cur = addDays(S.cur, 1); renderToday(); };
$('#wSave').onclick = () => { const v = parseFloat($('#wIn').value); if (!v || v < 30 || v > 250) { toast('اكتبي الوزن بالكيلو، مثلاً 88.4'); return; } const d = dayOf(S.cur); d.weight = v; saveDay({ ...d }); toast('اتسجل الوزن'); renderToday(); };
let noteT; $('#noteIn').oninput = () => { clearTimeout(noteT); noteT = setTimeout(() => { const d = dayOf(S.cur); d.note = $('#noteIn').value.trim(); saveDay({ ...d }); }, 800); };

/* ================= meal sheet ================= */
function closeSheet() { $('#sheetRoot').innerHTML = ''; document.body.style.overflow = ''; }
function sheet(title, bodyFn) {
  $('#sheetRoot').innerHTML = '<div class="sheet-bg"><div class="sheet" role="dialog" aria-modal="true" aria-label="' + esc(title) + '"><div class="sheet-h"><h3>' + esc(title) + '</h3><button class="btn ghost sm" id="shClose">إغلاق</button></div><div class="sheet-b" id="shBody"></div></div></div>';
  document.body.style.overflow = 'hidden';
  $('#shClose').onclick = closeSheet; $('.sheet-bg').onclick = e => { if (e.target.classList.contains('sheet-bg')) closeSheet(); };
  bodyFn($('#shBody'));
}
function ideaCard(idea, selected) {
  const comps = resolve(idea.parts, level()[idea.m] || {}); const t = totals(comps);
  const imgs = comps.slice(0, 4).map(x => window.KHIFFA_ICON ? window.KHIFFA_ICON(x.food.img, 'sm') : '<img src="' + imgURL(x.food.img) + '" alt="">').join('');
  const gf = comps.every(x => !x.food.gluten), lf = comps.every(x => !x.food.lactose);
  const b = document.createElement('button'); b.className = 'icard' + (selected ? ' sel' : '');
  b.innerHTML = '<div class="collage">' + imgs + '</div><div style="min-width:0"><div class="nm">' + esc(ideaName(idea)) + '</div><div class="sub">' +
    comps.map(x => esc(x.food.name.split(' (')[0]) + ' ' + amountText(x.food, x.n)).join('، ') + '</div><div class="sub num" style="margin-top:2px">' + ar(Math.round(t.n), 0) + ' سعرة – ' + ar(Math.round(t.p), 0) + ' ج بروتين' +
    (gf ? '<span class="tagchip">بدون جلوتين</span>' : '') + (lf ? '<span class="tagchip">بدون لاكتوز</span>' : '') + '</div></div>';
  return b;
}
function openMealSheet(m, mode) {
  sheet(m.t, body => {
    const st = mealState(dayOf(S.cur), m.k);
    const draw = md => {
      body.innerHTML = '<div class="seg"><button data-md="idea" aria-pressed="' + (md === 'idea') + '">وجبات جاهزة</button><button data-md="custom" aria-pressed="' + (md === 'custom') + '">ركّبي بنفسك</button></div>';
      body.querySelectorAll('.seg button').forEach(b => b.onclick = () => draw(b.dataset.md));
      if (md === 'idea') {
        const list = D.IDEAS.filter(i => i.m === m.k && ideaAllowed(i));
        if (!list.length) body.insertAdjacentHTML('beforeend', '<p class="note">مفيش وجبات جاهزة مناسبة للتفضيلات الحالية.</p>');
        list.forEach(i => { const c = ideaCard(i, st.mode !== 'custom' && st.idea === i.id); c.onclick = () => { setMeal(m.k, { mode: 'idea', idea: i.id, planned: false }); closeSheet(); renderToday(); toast('اتحطت في ' + m.t); }; body.append(c); });
      } else {
        const tgt = level()[m.k] || {}; const picks = { ...(st.mode === 'custom' ? st.picks : {}) };
        if (st.mode !== 'custom' && st.idea) { mealComps(m.k, st).forEach(x => { if (x.food.g === 'V') picks.V = (picks.V || []).concat(x.food.id); else if (!picks[x.food.g]) picks[x.food.g] = x.food.id; }); }
        if (picks.V && !Array.isArray(picks.V)) picks.V = [picks.V];
        GORDER.filter(g => tgt[g]).forEach(g => {
          const G = D.GROUPS[g];
          body.insertAdjacentHTML('beforeend', '<div class="grp-h"><i style="background:' + G.color + '"></i>' + G.name + ': ' + (tgt[g] === 1 ? 'حصة' : tgt[g] === 2 ? 'حصتين' : ar(tgt[g]) + ' حصص') + (g === 'V' ? ' <span class="note" style="font-weight:400">– اختاري أكتر من نوع براحتك</span>' : '') + '</div>');
          const grid = document.createElement('div'); grid.className = 'fgrid';
          Object.values(D.FOODS).filter(f => f.g === g && allowed(f)).forEach(f => {
            const b = document.createElement('button'); b.className = 'fbtn'; b.setAttribute('aria-pressed', g === 'V' ? (picks.V || []).includes(f.id) : picks[g] === f.id);
            b.innerHTML = img(f.img) + '<span>' + esc(f.name) + '</span><span class="q num">' + amountText(f, tgt[g]) + '</span>';
            b.onclick = () => {
              if (g === 'V') { const v = picks.V || []; picks.V = v.includes(f.id) ? v.filter(x => x !== f.id) : v.concat(f.id); b.setAttribute('aria-pressed', picks.V.includes(f.id)); updateSum(); return; }
              picks[g] = picks[g] === f.id ? null : f.id; grid.querySelectorAll('.fbtn').forEach(x => x.setAttribute('aria-pressed', 'false')); if (picks[g]) b.setAttribute('aria-pressed', 'true'); updateSum(); };
            grid.append(b);
          });
          body.append(grid);
        });
        const foot = document.createElement('div'); foot.style.cssText = 'position:sticky;bottom:-20px;background:var(--surface);padding-block:10px;display:flex;gap:10px;align-items:center;border-top:1px solid var(--line)';
        foot.innerHTML = '<span class="note num" id="shSum" style="flex:1"></span><button class="btn" id="shSave">حفظ الوجبة</button>';
        body.append(foot);
        const updateSum = () => { const comps = mealComps(m.k, { mode: 'custom', picks }); const t = totals(comps); $('#shSum').textContent = comps.length ? ar(Math.round(t.n), 0) + ' سعرة – ' + ar(Math.round(t.p), 0) + ' ج بروتين' + (picks.P && D.FOODS[picks.P].leg ? ' – البقوليات بتقلل النشويات' : '') : 'اختاري صنف من كل مجموعة'; };
        updateSum();
        $('#shSave').onclick = () => { if (!Object.values(picks).some(v => Array.isArray(v) ? v.length : v)) { toast('اختاري صنف واحد على الأقل'); return; } setMeal(m.k, { mode: 'custom', picks, planned: false }); closeSheet(); renderToday(); toast('اتحفظت الوجبة'); };
      }
    };
    draw(mode);
  });
}

/* ================= ideas & week planner ================= */
function renderIdeas() {
  const f = $('#ideaFilter');
  f.innerHTML = D.MEALS.map(m => '<button class="fchip" data-m="' + m.k + '" aria-pressed="' + (S.ideaFilter === m.k) + '">' + m.t + '</button>').join('');
  f.querySelectorAll('button').forEach(b => b.onclick = () => { S.ideaFilter = b.dataset.m; renderIdeas(); });
  const list = $('#ideaList'); list.innerHTML = '';
  const m = D.MEALS.find(x => x.k === S.ideaFilter);
  D.IDEAS.filter(i => i.m === S.ideaFilter && ideaAllowed(i)).forEach(i => {
    const c = ideaCard(i, false);
    c.onclick = () => { setMeal(m.k, { mode: 'idea', idea: i.id, planned: false }, TODAY); toast('اتحطت في ' + m.t + ' النهارده'); S.cur = TODAY; renderToday(); };
    c.title = 'اضغطي عشان تحطيها في ' + m.t + ' النهارده';
    list.append(c);
  });
  renderWeek();
}
function seeded(seed) { let x = 0; for (const ch of seed) x = (x * 31 + ch.charCodeAt(0)) >>> 0; return () => ((x = (x * 1664525 + 1013904223) >>> 0) / 4294967296); }
function generateWeek() {
  const rnd = seeded(TODAY + settings().level + Date.now());
  const recent = {}; // idea -> last day index used
  for (let i = 0; i < 7; i++) {
    const k = addDays(TODAY, i); const d = dayOf(k); d.meals = { ...(d.meals || {}) };
    D.MEALS.forEach(m => {
      const st = d.meals[m.k];
      if (st && (st.done || (st.idea && !st.planned) || st.mode === 'custom')) { if (st.idea) recent[st.idea] = i; return; }
      const counts = weekCountsWith(k, d);
      let cands = D.IDEAS.filter(x => x.m === m.k && ideaAllowed(x)).filter(x => {
        const tags = mealSummary(resolve(x.parts, level()[m.k] || {})).tags;
        return tags.every(t => { const lim = D.LIMITS.find(l => l[0] === t); return !lim || (counts[t] || 0) < lim[2]; });
      });
      const fresh = cands.filter(x => recent[x.id] === undefined || i - recent[x.id] > 2);
      if (fresh.length) cands = fresh;
      if (!cands.length) return;
      const pick = cands[Math.floor(rnd() * cands.length)]; recent[pick.id] = i;
      const next = { mode: 'idea', idea: pick.id, planned: true }; Object.assign(next, mealSummary(resolve(pick.parts, level()[m.k] || {})));
      d.meals[m.k] = next;
    });
    saveDay({ ...d });
  }
  toast('اتعملت خطة ٧ أيام'); renderAll();
}
function weekCountsWith(k, dayObj) {
  const c = {}; D.LIMITS.forEach(l => c[l[0]] = 0);
  weekKeys(k).forEach(key => { const day = key === k ? dayObj : dayOf(key); Object.values(day.meals || {}).forEach(st => (st.tags || []).forEach(t => c[t] = (c[t] || 0) + 1)); });
  return c;
}
function clearWeek() {
  for (let i = 0; i < 7; i++) { const k = addDays(TODAY, i); const d = dayOf(k); if (!d.meals) continue; let ch = false; const ms = { ...d.meals }; Object.keys(ms).forEach(m => { if (ms[m].planned && !ms[m].done) { delete ms[m]; ch = true; } }); if (ch) { d.meals = ms; saveDay({ ...d }); } }
  toast('اتمسحت الاقتراحات'); renderAll();
}
$('#genWeek').onclick = generateWeek; $('#clearWeek').onclick = clearWeek;
function renderWeek() {
  const days = []; for (let i = 0; i < 7; i++) days.push(addDays(TODAY, i));
  const any = days.some(k => Object.keys(dayOf(k).meals || {}).length);
  $('#week').innerHTML = any ? days.map(k => { const d = dayOf(k); return '<div class="wday"><div class="dn">' + fmt(k, { weekday: 'long', day: 'numeric', month: 'short' }) + '</div><div class="row2">' +
    D.MEALS.map(m => { const st = mealState(d, m.k); const idea = st.idea && st.mode !== 'custom' ? D.IDEAS.find(i => i.id === st.idea) : null; return '<span>' + m.t + ': <b>' + (idea ? esc(ideaName(idea)) : st.mode === 'custom' ? 'من اختيارك' : '—') + '</b></span>'; }).join('') + '</div></div>'; }).join('') : '<p class="note">لسه مفيش خطة. اضغطي "اقترحي أسبوع".</p>';
  // shopping list from today → +6, meals not yet eaten
  const agg = {};
  days.forEach(k => { const d = dayOf(k); D.MEALS.forEach(m => { const st = mealState(d, m.k); if (st.done) return; mealComps(m.k, st).forEach(x => { agg[x.food.id] = (agg[x.food.id] || 0) + x.food.grams * x.n; }); }); });
  const ids = Object.keys(agg); $('#shopCard').hidden = !ids.length;
  const bought = store.get('shop:' + TODAY, {});
  $('#shop').innerHTML = GORDER.map(g => ids.filter(id => D.FOODS[id].g === g).map(id => { const f = D.FOODS[id]; const q = f.id === 'egg' ? ar(Math.round(agg[id] / 50)) + ' بيضة' : f.id === 'eggwhite' ? ar(Math.round(agg[id] / 33)) + ' بيضة (بياض)' : (agg[id] >= 1000 ? ar(agg[id] / 1000, 1) + (g === 'M' ? ' لتر' : ' كجم') : ar(Math.round(agg[id] / 10) * 10, 0) + (g === 'M' ? ' مل' : ' ج'));
    return '<div><label><input type="checkbox" data-id="' + id + '"' + (bought[id] ? ' checked' : '') + '>' + img(f.img, 'sm') + esc(f.name.split(' (')[0]) + '</label><span class="amt num">' + q + '</span></div>'; }).join('')).join('');
  $('#shop').querySelectorAll('input').forEach(c => c.onchange = () => { const b = store.get('shop:' + TODAY, {}); b[c.dataset.id] = c.checked; store.set('shop:' + TODAY, b); });
}

/* ================= render: body ================= */
function status(kind, val) {
  const m = { pbf: [[32, 'bad', 'عالي'], [28, 'warn', 'مرتفع'], [0, 'good', 'طبيعي']], vfl: [[15, 'bad', 'عالي'], [10, 'warn', 'مرتفع'], [0, 'good', 'طبيعي']], whr: [[0.95, 'bad', 'عالي'], [0.85, 'warn', 'مرتفع'], [0, 'good', 'طبيعي']], bmi: [[30, 'bad', 'سمنة'], [25, 'warn', 'وزن زائد'], [0, 'good', 'طبيعي']] }[kind];
  if (!m || val == null || val === '') return ''; const r = m.find(x => val >= x[0]); return '<span class="pill ' + r[1] + '">' + r[2] + '</span>';
}
const latest = () => (S.data.inbody || [])[S.data.inbody.length - 1];
function renderBody() {
  const IB = S.data.inbody || [], ib = latest(), first = IB[0];
  if (!ib) { $('#ibStats').innerHTML = '<div class="empty" style="grid-column:1/-1">لسه مفيش قياسات. ضيفي أول قياس من تحت.</div>'; $('#charts').innerHTML = ''; $('#ibTable').innerHTML = ''; }
  else {
    $('#ibDate').textContent = fmt(ib.date, { day: 'numeric', month: 'long', year: 'numeric' });
    const dl = (k, down) => { if (!first || first === ib || ib[k] == null || first[k] == null) return ''; const d = ib[k] - first[k]; if (Math.abs(d) < 0.05) return ''; const good = down ? d < 0 : d > 0; return '<div class="delta ' + (good ? 'good' : 'bad') + '">' + (d > 0 ? '+' : '−') + ar(Math.abs(d)) + ' من أول قياس</div>'; };
    const cards = [['الوزن', ib.weight, 'كجم', dl('weight', true), ''], ['الكتلة العضلية', ib.smm, 'كجم', dl('smm', false), ''], ['نسبة الدهون', ib.pbf, '%', dl('pbf', true), status('pbf', ib.pbf)], ['كتلة الدهون', ib.bfm, 'كجم', dl('bfm', true), ''], ['الدهون الحشوية', ib.vfl, 'مستوى', dl('vfl', true), status('vfl', ib.vfl)], ['الخصر للورك', ib.whr, 'نسبة', dl('whr', true), status('whr', ib.whr)], ['معدل الحرق BMR', ib.bmr, 'سعرة/يوم', '', ''], ['مؤشر الكتلة BMI', ib.bmi, 'كجم/م²', '', status('bmi', ib.bmi)]];
    $('#ibStats').innerHTML = cards.filter(c => c[1] != null && c[1] !== '').map(c => '<div class="stat"><div class="eyebrow">' + c[0] + c[4] + '</div><div class="v num">' + ar(c[1], 2) + ' <span class="u">' + c[2] + '</span></div>' + c[3] + '</div>').join('');
    $('#charts').innerHTML = [['weight', 'الوزن (كجم)', 'var(--mint)'], ['smm', 'الكتلة العضلية (كجم)', 'var(--peach)'], ['pbf', 'نسبة الدهون (%)', 'var(--warn)']].map(x => spark(IB, x[0], x[1], x[2])).join('') || '<p class="note">الرسم بيظهر من تاني قياس.</p>';
    const cols = [['date', 'التاريخ'], ['weight', 'الوزن'], ['smm', 'العضل'], ['bfm', 'الدهون كجم'], ['pbf', 'الدهون %'], ['vfl', 'الحشوية'], ['bmr', 'BMR']];
    $('#ibTable').innerHTML = '<tr>' + cols.map(c => '<th>' + c[1] + '</th>').join('') + '</tr>' + IB.slice().reverse().map(r => '<tr>' + cols.map(c => '<td class="num">' + (c[0] === 'date' ? fmt(r.date, { day: 'numeric', month: 'short', year: '2-digit' }) : ar(r[c[0]])) + '</td>').join('') + '</tr>').join('');
  }
  const M = (S.data.measures || []).map(m => ({ ...m, whr: m.waist && m.hip ? Math.round(m.waist / m.hip * 100) / 100 : null }));
  $('#mChart').innerHTML = M.length ? (spark(M, 'waist', 'الوسط (سم)', 'var(--peach)') + spark(M, 'whr', 'نسبة الخصر للورك (الطبيعي أقل من ٠٫٨٥)', 'var(--mint)') + (M.length < 2 ? '<p class="note">آخر مقاس: وسط ' + ar(M[0].waist) + ' سم – ورك ' + ar(M[0].hip) + ' سم – النسبة ' + ar(M[0].whr, 2) + '</p>' : '')) : '<p class="note">لسه مفيش مقاسات.</p>';
}
function spark(rows, k, label, color) {
  const pts = rows.filter(r => r[k] != null && r[k] !== ''); if (pts.length < 2) return '';
  const W = 320, H = 92, px = 34, py = 18, vs = pts.map(p => +p[k]); let mn = Math.min(...vs), mx = Math.max(...vs); const pv = (mx - mn || 1) * 0.25; mn -= pv; mx += pv;
  const t = p => parseKey(p.date).getTime(), t0 = t(pts[0]), t1 = t(pts[pts.length - 1]);
  const X = p => W - px - ((t(p) - t0) / ((t1 - t0) || 1)) * (W - 2 * px), Y = v => H - py - ((v - mn) / (mx - mn)) * (H - 2 * py);
  const line = pts.map((p, i) => (i ? 'L' : 'M') + X(p).toFixed(1) + ' ' + Y(+p[k]).toFixed(1)).join(' ');
  const area = line + ' L' + X(pts[pts.length - 1]).toFixed(1) + ' ' + (H - py) + ' L' + X(pts[0]).toFixed(1) + ' ' + (H - py) + ' Z';
  const showAll = pts.length <= 6;
  const dots = pts.map((p, i) => { const last = i === pts.length - 1, lab = showAll || last || i === 0; return '<circle cx="' + X(p).toFixed(1) + '" cy="' + Y(+p[k]).toFixed(1) + '" r="' + (last ? 5 : 3.5) + '" fill="' + (last ? color : 'var(--surface)') + '" stroke="' + color + '" stroke-width="2"/>' + (lab ? '<text x="' + X(p).toFixed(1) + '" y="' + (Y(+p[k]) - 9).toFixed(1) + '" text-anchor="middle">' + ar(p[k], 2) + '</text><text x="' + X(p).toFixed(1) + '" y="' + (H - 2) + '" text-anchor="middle">' + fmt(p.date, { day: 'numeric', month: 'short' }) + '</text>' : ''); }).join('');
  return '<div class="legend">' + label + '</div><svg class="chart" viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="' + label + '"><line x1="' + px + '" x2="' + (W - px) + '" y1="' + (H - py) + '" y2="' + (H - py) + '" stroke="var(--line)"/><path d="' + area + '" fill="' + color + '" fill-opacity=".12"/><path d="' + line + '" fill="none" stroke="' + color + '" stroke-width="2.5" stroke-linejoin="round"/>' + dots + '</svg>';
}
$('#f-date').value = TODAY; $('#m-date').value = TODAY;
$('#ibForm').onsubmit = e => { e.preventDefault();
  const g = id => { const v = parseFloat($('#f-' + id).value); return isNaN(v) ? null : v; };
  const r = { date: $('#f-date').value, weight: g('weight'), smm: g('smm'), bfm: g('bfm'), pbf: g('pbf'), bmr: g('bmr'), vfl: g('vfl'), whr: g('whr') };
  const prev = latest(); if (prev && prev.target_weight) r.target_weight = prev.target_weight;
  Object.keys(r).forEach(k => r[k] == null && delete r[k]);
  upsertLocal('inbody', r); persist(); enqueue('saveInbody', { reading: r }, 'ib:' + S.uid + ':' + r.date);
  toast('اتحفظ القياس'); e.target.reset(); $('#f-date').value = TODAY; renderAll(); };
$('#mForm').onsubmit = e => { e.preventDefault();
  const m = { date: $('#m-date').value, waist: parseFloat($('#m-waist').value), hip: parseFloat($('#m-hip').value) };
  if (!m.waist || !m.hip) return; upsertLocal('measures', m); persist(); enqueue('saveMeasure', { measure: m }, 'm:' + S.uid + ':' + m.date);
  toast('اتحفظ المقاس'); e.target.reset(); $('#m-date').value = TODAY; renderBody(); };

/* ================= render: plan ================= */
function saveSettings(patch) { S.data.settings = { ...settings(), ...patch }; persist(); enqueue('saveSettings', { settings: S.data.settings }, 'set:' + S.uid); renderAll(); }
function renderPlan() {
  const st0 = settings(), ib = latest();
  $('#levels').innerHTML = Object.keys(D.LEVELS).map(L => '<button data-l="' + L + '" aria-pressed="' + (+L === +st0.level) + '">' + ar(+L, 0) + '</button>').join('');
  $('#levels').querySelectorAll('button').forEach(b => b.onclick = () => { saveSettings({ level: +b.dataset.l }); toast('النظام بقى ' + ar(+b.dataset.l, 0) + ' سعرة'); });
  const LT = levelTotals(st0.level);
  $('#levelNote').textContent = 'المتوسط التقريبي: ' + ar(Math.round(LT.n), 0) + ' سعرة – بروتين ' + ar(Math.round(LT.p), 0) + ' ج (' + ar(Math.round(LT.p * 4 / LT.n * 100), 0) + '٪) – كارب ' + ar(Math.round(LT.c), 0) + ' ج – دهون ' + ar(Math.round(LT.f), 0) + ' ج';
  const L = level(), gs = GORDER;
  $('#xtbl').innerHTML = '<tr><th>الوجبة</th>' + gs.map(g => '<th>' + D.GROUPS[g].short + '</th>').join('') + '</tr>' +
    D.MEALS.map(m => '<tr><td>' + m.t + '</td>' + gs.map(g => '<td class="num">' + (L[m.k][g] ? ar(L[m.k][g]) : '–') + '</td>').join('') + '</tr>').join('') +
    '<tr style="font-weight:700"><td>المجموع</td>' + gs.map(g => '<td class="num">' + ar(D.MEALS.reduce((s, m) => s + (L[m.k][g] || 0), 0)) + '</td>').join('') + '</tr>';
  $('#fGluten').setAttribute('aria-pressed', !!st0.noGluten); $('#fLactose').setAttribute('aria-pressed', !!st0.noLactose);
  $('#s-act').value = String(st0.activity); $('#s-water').value = st0.water;
  const rows = [['هدف النظام', ar(st0.level, 0) + ' سعرة']];
  if (ib && ib.bmr) { const tdee = Math.round(ib.bmr * st0.activity); rows.push(['معدل الحرق الأساسي (InBody)', ar(ib.bmr, 0) + ' سعرة'], ['الحرق اليومي مع النشاط', ar(tdee, 0) + ' سعرة'], ['العجز اليومي المتوقع', ar(tdee - st0.level, 0) + ' سعرة'], ['نزول متوقع في الأسبوع', '≈ ' + ar(Math.max(0, (tdee - st0.level) * 7 / 7700), 2) + ' كجم']); }
  $('#calcTbl').innerHTML = rows.map((r, i) => '<tr' + (i === 0 ? ' class="hl"' : '') + '><td>' + r[0] + '</td><td class="num" style="text-align:left">' + r[1] + '</td></tr>').join('');
  $('#guide').innerHTML = gs.map(g => { const G = D.GROUPS[g]; const fs = Object.values(D.FOODS).filter(f => f.g === g && allowed(f));
    return '<div><div class="grp-h"><i style="background:' + G.color + '"></i>' + G.name + ' <span class="note" style="font-weight:400">– ' + G.hint + '</span></div><div class="flist" style="margin-top:6px">' +
      fs.map(f => '<div class="fl">' + img(f.img, 'sm') + '<div>' + esc(f.name) + '<span class="num">' + amountText(f, 1) + (f.unit ? '، ' + esc(f.unit) : '') + '، ' + ar(f.n, 0) + ' سعرة</span></div></div>').join('') + '</div></div>'; }).join('');
  $('#free').innerHTML = D.FREE.map(x => '<li>' + esc(x) + '</li>').join('');
  $('#tips').innerHTML = D.TIPS.map(x => '<li>' + esc(x) + '</li>').join('');
  $('#acct').textContent = 'داخل باسم: ' + S.data.me.name + (S.data.me.id !== S.data.user.id ? ' – بتعرض بيانات: ' + S.data.user.name : '');
}
$('#fGluten').onclick = () => saveSettings({ noGluten: !settings().noGluten });
$('#fLactose').onclick = () => saveSettings({ noLactose: !settings().noLactose });
['#s-act', '#s-water'].forEach(id => $(id).onchange = () => saveSettings({ activity: parseFloat($('#s-act').value), water: Math.min(16, Math.max(4, parseInt($('#s-water').value) || 10)) }));

/* ================= header & shell ================= */
function renderHeader() {
  $('#today').textContent = new Date().toLocaleDateString('ar-EG', { weekday: 'long', day: 'numeric', month: 'long' });
  $('#who').textContent = S.data.user.name;
  const ppl = S.data.people || [], sel = $('#person'); sel.hidden = ppl.length < 2;
  sel.innerHTML = ppl.map(p => '<option value="' + esc(p.id) + '"' + (p.id === S.data.user.id ? ' selected' : '') + '>' + esc(p.name) + '</option>').join('');
}
$('#person').onchange = e => { S.uid = e.target.value; store.set('uid', S.uid); S.cur = TODAY; boot(); };
function renderAll() { if (!S.data) return; renderHeader(); renderToday(); renderIdeas(); renderBody(); renderPlan(); }
function toast(m) { const t = $('#toast'); t.textContent = m; t.hidden = false; clearTimeout(toast.h); toast.h = setTimeout(() => t.hidden = true, 2200); }
document.querySelectorAll('#tabs button').forEach(b => b.onclick = () => {
  document.querySelectorAll('#tabs button').forEach(x => x.setAttribute('aria-selected', x === b));
  document.querySelectorAll('section.view').forEach(v => v.hidden = v.id !== 'v-' + b.dataset.v);
  store.set('tab', b.dataset.v); window.scrollTo(0, 0);
});
const t0 = store.get('tab', null); if (t0) { const b = document.querySelector('#tabs button[data-v="' + t0 + '"]'); if (b) b.click(); }
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeSheet(); });
document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible' && S.pin) { if (dkey(new Date()) !== TODAY) location.reload(); else flush(); } });
if ('serviceWorker' in navigator && location.protocol === 'https:') navigator.serviceWorker.register('sw.js').catch(() => {});

window.KHIFFA_APP = { D, dayOf, saveDay, toast, settings, level, mealComps, mealState, totals, levelTotals, weekKeys, weekCounts, fmt, ar, esc, img, addDays, TODAY, get cur() { return S.cur; }, get data() { return S.data; }, refresh: () => { if (S.data) renderToday(); }, refreshAll: () => renderAll() };
if (S.pin) boot(); else showLogin();
})();
