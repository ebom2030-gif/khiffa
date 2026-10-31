/* Approved design layer. No changes to nutrition, authentication or API data. */
(function () {
  'use strict';
  const A = window.KHIFFA_APP, d = document;
  if (!A) return;
  const sheet = d.createElement('link'); sheet.rel = 'stylesheet'; sheet.href = 'approved-design.css'; d.head.append(sheet);
  const layouts = ['الهجين', 'التركيز', 'المتابعة', 'اليومي', 'المتوازن', 'المختصر'];
  const palettes = ['الأخضر والذهبي', 'الحديقة', 'الزيتون', 'البحري'];
  const templates = layouts.flatMap((label, layout) => palettes.map((palette, color) => ({
    id: layout * 4 + color, label: label + ' · ' + palette, layout, color
  })));
  const defaults = () => ({ template: 0, layout: 0, color: 0, theme: 'system', density: 'comfortable', logo: 0, order: [] });
  let prefs = defaults(), identity = null, editing = false, dragged = null, scheduled = false;
  const own = () => A.data && A.data.me && String(A.data.me.id);
  const key = () => 'khiffa.design.v1:' + identity;
  function normalize(value) {
    const p = Object.assign(defaults(), value && typeof value === 'object' ? value : {});
    for (const [field, max] of [['template', 23], ['layout', 5], ['color', 3], ['logo', 6]]) {
      if (!Number.isInteger(p[field]) || p[field] < 0 || p[field] > max) p[field] = 0;
    }
    if (!['system', 'light', 'dark'].includes(p.theme)) p.theme = 'system';
    if (!['comfortable', 'compact'].includes(p.density)) p.density = 'comfortable';
    p.order = Array.isArray(p.order) ? [...new Set(p.order.filter(x => typeof x === 'string' && /^[a-z0-9-]+$/.test(x)))].slice(0, 40) : [];
    return p;
  }
  function load() {
    const id = own();
    if (id === identity) return;
    identity = id; prefs = defaults(); editing = false;
    if (id) { try { prefs = normalize(JSON.parse(localStorage.getItem(key()))); } catch (_) {} }
    remote = ''; pullRemote();
    apply();
  }
  const mine = () => A.data && A.data.me && A.data.user && String(A.data.me.id) === String(A.data.user.id);
  let remote = '';
  function pushRemote() {
    if (!mine()) return;
    const v = JSON.stringify(prefs); if (v === remote) return; remote = v;
    try { A.saveSettings({ design: JSON.parse(v) }); } catch (_) {}
  }
  function pullRemote() {
    if (!mine() || editing) return false;
    const d = A.settings && A.settings().design; if (!d || typeof d !== 'object') return false;
    const v = JSON.stringify(normalize(d)); if (v === remote && v === JSON.stringify(prefs)) return false;
    remote = v; if (v === JSON.stringify(prefs)) return false;
    prefs = normalize(d); try { localStorage.setItem(key(), v); } catch (_) {}
    return true;
  }
  function save() {
    if (!identity) return false;
    pushRemote();
    try { localStorage.setItem(key(), JSON.stringify(prefs)); return true; }
    catch (_) { A.toast('تعذر حفظ المظهر على هذا الجهاز. قد تكون مساحة التخزين ممتلئة.'); return false; }
  }
  function go(view) {
    const button = d.querySelector('#tabs button[data-v="' + view + '"]');
    if (button) button.click();
  }
  function brandMarkup(logo) {
    // v38: ملفات شعار مستقلة (assets/logo-0..6.png) بخلفية شفافة، بدل القص من لوحة الهوية.
    const n = Math.max(0, Math.min(6, Number(logo) || 0));
    return '<span class="kd-brand-image" role="img" aria-label="' + (n ? 'خفة دايت — البديل الشخصي ' + n : 'خفة دايت — الشعار الرسمي') + '"><img alt="" src="assets/logo-' + n + '.png" decoding="async"></span>';
  }
  function brands() {
    d.querySelectorAll('.logo,.lg-brand').forEach(host => {
      let b = host.querySelector(':scope > .kd-brand-slot');
      if (!b) { b = d.createElement('span'); b.className = 'kd-brand-slot'; host.prepend(b); }
      if (b.dataset.logo !== String(prefs.logo)) { b.innerHTML = brandMarkup(prefs.logo); b.dataset.logo = prefs.logo; }
    });
    const nav = d.getElementById('tabs');
    if (nav) {
      let b = nav.querySelector('.kd-nav-brand');
      if (!b) { b = d.createElement('div'); b.className = 'kd-nav-brand'; nav.prepend(b); }
      if (b.dataset.logo !== String(prefs.logo)) { b.innerHTML = brandMarkup(prefs.logo); b.dataset.logo = prefs.logo; }
    }
  }
  function apply() {
    const root = d.documentElement;
    root.dataset.kdLayout = prefs.layout;
    root.dataset.kdColor = prefs.color;
    root.dataset.kdDensity = prefs.density;
    root.dataset.kdEditing = String(editing);
    root.dataset.kdMode = prefs.theme;
    if (prefs.theme === 'system') root.removeAttribute('data-theme'); else root.dataset.theme = prefs.theme;
    brands(); arrange();
  }
  function action(label, fn, cls) {
    const b = d.createElement('button'); b.type = 'button'; b.className = cls || 'btn ghost sm'; b.textContent = label; b.onclick = fn; return b;
  }
  function layoutHome() {
    const hero = d.querySelector('#v-home > .hm-hero');
    if (!hero || hero.dataset.kdSplit) return;
    hero.dataset.kdSplit = 'true'; hero.dataset.kdBlock = 'hero';
    const main = hero.querySelector('.hm-main'), water = hero.querySelector('.hm-water');
    if (main) {
      const summary = d.createElement('div'); summary.className = 'card kd-calories'; summary.dataset.kdBlock = 'summary';
      const h = d.createElement('h2'); h.textContent = 'السعرات اليوم'; summary.append(h, main); hero.after(summary);
    }
    if (water) {
      const card = d.createElement('div'); card.className = 'card kd-water'; card.dataset.kdBlock = 'water';
      const h = d.createElement('h2'); h.textContent = 'الماء والسوائل'; card.append(h, water); hero.parentNode.append(card);
    }
    const cta = action('خطتي الغذائية', () => go('plan'), 'btn kd-hero-cta'); hero.append(cta);
    const goalCard = d.createElement('div'); goalCard.className = 'card kd-goal'; goalCard.dataset.kdBlock = 'goal';
    const readings = (A.data && A.data.inbody || []).filter(r => Number(r.weight) > 0);
    const last = readings[readings.length - 1], first = readings[0];
    const h = d.createElement('h2'); h.textContent = 'الطريق إلى هدفك'; goalCard.append(h);
    if (last && Number(last.target_weight) > 0 && first) {
      const start = Number(first.weight), current = Number(last.weight), target = Number(last.target_weight);
      const percent = start === target ? (current === target ? 100 : 0) : Math.max(0, Math.min(100, Math.round((current - start) / (target - start) * 100)));
      const value = d.createElement('strong'); value.className = 'kd-goal-value'; value.textContent = current.toLocaleString('ar-u-nu-latn') + ' كجم';
      const note = d.createElement('p'); note.className = 'note'; note.textContent = 'الوزن المستهدف ' + target.toLocaleString('ar-u-nu-latn') + ' كجم';
      const progress = d.createElement('progress'); progress.max = 100; progress.value = percent; progress.setAttribute('aria-label','التقدم نحو الوزن المستهدف');
      const achieved = d.createElement('p'); achieved.className = 'note'; achieved.textContent = percent + '% من الطريق إلى الهدف';
      goalCard.append(value, note, progress, achieved);
    } else {
      const note = d.createElement('p'); note.className = 'note'; note.textContent = 'أضف قياسك ووزنك المستهدف لعرض تقدمك هنا.'; goalCard.append(note);
    }
    goalCard.append(action('متابعة قياساتي', () => go('body'))); hero.parentNode.append(goalCard);
  }
  function headerSearch() {
    const header = d.querySelector('#app > header'); if (!header || header.querySelector('.kd-search')) return;
    const button = action('ابحث عن وجبة أو أضف طعامًا', () => { go('today'); const q = d.getElementById('qaQ'); if(q) {q.scrollIntoView({block:'center'});q.focus();} }, 'kd-search');
    header.append(button);
  }
  const blockNames = ['hero', 'summary', 'week', 'meals', 'insights', 'weekly', 'calories', 'body', 'water', 'goal'];
  function cards() {
    const home = d.getElementById('v-home'); if (!home) return [];
    const list = [...home.children].filter(x => x.classList.contains('card') && !x.classList.contains('kd-tools') && !x.classList.contains('kd-shortcuts'));
    list.forEach((card, index) => {
      if (!card.dataset.kdBlock) {
        const h = card.querySelector('h2');
        const title = h ? h.textContent : '';
        const id = card.id === 'foodFastEntry' ? 'fast' : card.id === 'kfQuick' ? 'quick' : card.classList.contains('care-card') ? 'care' : card.classList.contains('hm-hero') ? 'summary' : /وجبات اليوم/.test(title) ? 'meals' : /^الأسبوع$/.test(title) ? 'week' : /هذا الأسبوع/.test(title) ? 'weekly' : /أسبوعين/.test(title) ? 'calories' : /^الجسم$/.test(title) ? 'body' : ('block-' + index);
        card.dataset.kdBlock = id;
      }
      const id = card.dataset.kdBlock;
      card.draggable = editing;
      let controls = card.querySelector(':scope > .kd-move');
      if (editing && !controls) {
        controls = d.createElement('div'); controls.className = 'kd-move';
        const label = card.querySelector('h2');
        controls.setAttribute('role', 'group'); controls.setAttribute('aria-label', 'ترتيب ' + (label ? label.textContent : 'الملخص'));
        controls.append(action('تحريك لأعلى', () => move(id, -1)), action('تحريك لأسفل', () => move(id, 1)));
        card.prepend(controls);
      } else if (!editing && controls) controls.remove();
      card.ondragstart = e => { if (!editing || e.target !== card) { e.preventDefault(); return; } dragged = id; e.dataTransfer.setData('text/plain', id); e.dataTransfer.effectAllowed = 'move'; card.classList.add('kd-dragging'); };
      card.ondragend = () => { dragged = null; card.classList.remove('kd-dragging'); };
      card.ondragover = e => { if (editing && dragged && dragged !== id) { e.preventDefault(); e.dataTransfer.dropEffect = 'move'; } };
      card.ondrop = e => {
        if (!editing || !dragged || dragged === id) return;
        e.preventDefault(); const order = cards().map(x => x.dataset.kdBlock);
        order.splice(order.indexOf(dragged), 1); order.splice(order.indexOf(id), 0, dragged);
        prefs.order = order; save(); arrange(); A.toast('تم حفظ ترتيب البطاقات');
      };
    });
    return list;
  }
  function move(id, delta) {
    const list = cards().map(x => x.dataset.kdBlock), i = list.indexOf(id), j = i + delta;
    if (i < 0 || j < 0 || j >= list.length) return;
    [list[i], list[j]] = [list[j], list[i]]; prefs.order = list;
    const stored = save(); arrange();
    if (stored) A.toast('تم حفظ الترتيب');
    d.querySelector('[data-kd-block="' + id + '"] .kd-move button')?.focus();
  }
  function arrange() {
    const list = cards(), home = d.getElementById('v-home'); if (!home) return;
    if (prefs.order.length) {
      const current = list.map(x => x.dataset.kdBlock);
      const wanted = prefs.order.filter(x => current.includes(x)).concat(current.filter(x => !prefs.order.includes(x)));
      if (current.join() !== wanted.join()) wanted.forEach(id => home.append(list.find(x => x.dataset.kdBlock === id)));
      list.forEach(card => { card.style.order = wanted.indexOf(card.dataset.kdBlock); });
    } else {
      list.forEach(card => { card.style.removeProperty('order'); });
    }
  }
  function toolbar() {
    const home = d.getElementById('v-home'); if (!home || home.querySelector('.kd-tools')) return;
    const bar = d.createElement('div'); bar.className = 'kd-tools'; bar.style.order = '-100';
    const intro = d.createElement('div'); intro.innerHTML = '<span class="kd-eyebrow">رحلتك نحو حياة أخف</span><h1>خطوة صغيرة، فرق كبير</h1>';
    const buttons = d.createElement('div'); buttons.className = 'kd-tool-actions';
    const edit = action(editing ? 'إنهاء الترتيب' : 'ترتيب البطاقات', () => { editing = !editing; edit.textContent = editing ? 'إنهاء الترتيب' : 'ترتيب البطاقات'; edit.setAttribute('aria-pressed', String(editing)); apply(); });
    edit.setAttribute('aria-pressed', String(editing));
    buttons.append(edit, action('تخصيص المظهر', () => { go('plan'); d.getElementById('kdAppearance')?.scrollIntoView({behavior:'smooth', block:'start'}); }));
    bar.append(intro, buttons); home.prepend(bar);
  }
  function selector(label, field, options, fn) {
    const wrap = d.createElement('label'); wrap.className = 'kd-field';
    const title = d.createElement('span'); title.textContent = label;
    const select = d.createElement('select'); select.name = field; select.setAttribute('aria-label', label);
    options.forEach(([value, text]) => { const o = d.createElement('option'); o.value = value; o.textContent = text; select.append(o); });
    select.value = String(prefs[field]);
    select.onchange = () => { fn(select.value); const ok = save(); apply(); panel(true); if (ok) A.toast('تم حفظ المظهر'); };
    wrap.append(title, select); return wrap;
  }
  function panel(force) {
    if (!own()) return;
    const plan = d.getElementById('v-plan'); if (!plan) return;
    let c = d.getElementById('kdAppearance');
    if (c && !force && c.dataset.account === identity) return;
    if (!c) { c = d.createElement('div'); c.id = 'kdAppearance'; c.className = 'card kd-appearance'; plan.prepend(c); }
    c.dataset.account = identity; c.replaceChildren();
    const title = d.createElement('h2'); title.textContent = 'مظهرك، بطريقتك';
    const note = d.createElement('p'); note.className = 'note'; note.textContent = '24 قالبًا جاهزًا. ادمج توزيع البطاقات والألوان والمسافات كما تحب. تُحفظ اختياراتك مع حسابك وتظهر على كل أجهزتك.';
    const fields = d.createElement('div'); fields.className = 'kd-fields';
    fields.append(
      selector('القالب الجاهز', 'template', templates.map(t => [t.id, String(t.id+1).padStart(2,'0') + ' · ' + t.label]), v => { const t = templates[+v]; prefs.template = t.id; prefs.layout = t.layout; prefs.color = t.color; prefs.order = []; }),
      selector('توزيع البطاقات', 'layout', layouts.map((x,i) => [i,x]), v => { prefs.layout = +v; prefs.order = []; }),
      selector('ألوان المظهر', 'color', palettes.map((x,i) => [i,x]), v => { prefs.color = +v; }),
      selector('وضع العرض', 'theme', [['system','حسب الجهاز'],['light','فاتح'],['dark','ليلي']], v => { prefs.theme = v; }),
      selector('المسافات', 'density', [['comfortable','مريحة'],['compact','مختصرة']], v => { prefs.density = v; }),
      selector('الشعار الشخصي', 'logo', [[0,'الشعار الرسمي الافتراضي'], ...[1,2,3,4,5,6].map(i => [i,'البديل الشخصي ' + i])], v => { prefs.logo = +v; })
    );
    const previews = d.createElement('div'); previews.className = 'kd-logo-options';
    for (let i = 0; i <= 6; i++) {
      const b = action('', () => { prefs.logo = i; const ok = save(); apply(); panel(true); if (ok) A.toast('تم حفظ الشعار الشخصي'); });
      b.className = 'kd-logo-option'; b.setAttribute('aria-label', i ? 'اختيار البديل الشخصي ' + i : 'اختيار الشعار الرسمي'); b.setAttribute('aria-pressed', String(prefs.logo === i));
      b.innerHTML = brandMarkup(i) + '<span>' + (i ? 'البديل ' + i : 'الرسمي') + '</span>'; previews.append(b);
    }
    const reset = action('استعادة المظهر الافتراضي', () => { prefs = defaults(); editing = false; const ok = save(); apply(); panel(true); if (ok) A.toast('تمت استعادة المظهر الافتراضي'); });
    c.append(title, note, fields, previews, reset);
  }
  function sync() { scheduled = false; load(); if (pullRemote()) { apply(); panel(true); } layoutHome(); headerSearch(); toolbar(); panel(false); brands(); arrange(); }
  function schedule() { if (!scheduled) { scheduled = true; requestAnimationFrame(sync); } }
  const observer = new MutationObserver(records => {
    if (records.some(r => [...r.addedNodes].some(n => n.nodeType === 1 && !n.matches('.kd-move,.kd-nav-brand,.kd-brand-slot')))) schedule();
  });
  observer.observe(d.getElementById('app') || d.body, {childList: true, subtree:true});
  (window.KHIFFA_HOOKS = window.KHIFFA_HOOKS || []).push(schedule);
  (window.KHIFFA_LOGOUT_HOOKS = window.KHIFFA_LOGOUT_HOOKS || []).push(() => { identity = null; prefs = defaults(); editing = false; apply(); });
  window.addEventListener('storage', e => { if (identity && e.key === key()) { try { prefs = normalize(JSON.parse(e.newValue)); apply(); panel(true); } catch (_) {} } });
  window.KHIFFA_DESIGN = { templates: templates.map(t => ({...t})), normalize };
  load(); sync();
})();
