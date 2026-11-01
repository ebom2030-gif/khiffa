/* v46 — شركاء خفة: «مطاعم وجيم قريبة»، «مكاني» لمدير المطعم أو الجيم (صلاحيات على مكانه فقط)، واعتماد الشركاء ورسالة التعريف للمالك. */
(function () {
  'use strict';
  const A = window.KHIFFA_APP, d = document;
  if (!A) return;
  const E = (tag, text, cls) => { const e = d.createElement(tag); if (text != null && text !== '') e.textContent = text; if (cls) e.className = cls; return e; };
  const B = (text, fn, cls = 'btn') => { const b = E('button', text, cls); b.type = 'button'; b.onclick = fn; return b; };
  const num = (n, f = 0) => Number(n || 0).toLocaleString('ar-u-nu-latn', { maximumFractionDigits: f });
  const KIND = { restaurant: 'مطعم دايت', gym: 'صالة رياضية' };
  const SERVER = 'خدمة الشركاء تحتاج تحديث الخادم مرة واحدة (نشر_الخادم.bat).';
  let list = null, mine = undefined, tab = 'restaurant', here = null, loading = false;
  const api = async (action, payload = {}) => { try { return await A.api(action, payload); } catch (e) { if (/unknown action/i.test(e.message)) throw Error(SERVER); throw e; } };
  const digits = s => String(s || '').replace(/[^0-9]/g, '');
  const km = (a, b) => { const R = 6371, t = x => x * Math.PI / 180, dl = t(b.lat - a.lat), dn = t(b.lng - a.lng); const h = Math.sin(dl / 2) ** 2 + Math.cos(t(a.lat)) * Math.cos(t(b.lat)) * Math.sin(dn / 2) ** 2; return 2 * R * Math.asin(Math.sqrt(h)); };
  const mapUrl = p => p.lat != null && p.lng != null ? 'https://www.google.com/maps/search/?api=1&query=' + p.lat + ',' + p.lng : 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(p.name + ' ' + (p.address || p.city || ''));
  function link(text, href, cls) { const a = E('a', text, cls || 'btn ghost'); a.href = href; a.target = '_blank'; a.rel = 'noopener'; return a; }
  function modal(title) {
    const old = d.activeElement, o = E('div', null, 'ac-modal'), box = E('div', null, 'ac-box kp-box'); o.setAttribute('role', 'dialog'); o.setAttribute('aria-modal', 'true'); o.setAttribute('aria-label', title);
    const close = () => { o.remove(); old && old.focus && old.focus(); };
    const h = E('div', null, 'kp-head'); h.append(E('h2', title), B('إغلاق', close, 'btn ghost')); box.append(h); o.append(box);
    o.addEventListener('click', e => { if (e.target === o) close(); }); o.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
    d.body.append(o); return { box, close };
  }
  function field(form, label, name, value, type = 'text', opts = {}) { const l = E('label', null, 'kd-field'); l.append(E('span', label)); const i = d.createElement(type === 'textarea' ? 'textarea' : 'input'); if (type !== 'textarea') i.type = type; i.name = name; i.value = value ?? ''; Object.assign(i, opts); l.append(i); form.append(l); return i; }
  async function shrink(file, max = 360) {
    const img = await new Promise((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = rej; i.src = URL.createObjectURL(file); });
    const s = Math.min(1, max / Math.max(img.width, img.height)), c = d.createElement('canvas'); c.width = Math.round(img.width * s); c.height = Math.round(img.height * s); c.getContext('2d').drawImage(img, 0, 0, c.width, c.height); return c.toDataURL('image/jpeg', .78);
  }

  /* ---------- القائمة للمستخدم ---------- */
  async function load(force) {
    if (loading || (list && !force)) return; loading = true;
    try { list = (await api('partnerList')).partners || []; } catch (e) { list = { error: e.message }; } finally { loading = false; }
    try { mine = (await api('partnerMine')).partner || null; } catch (_) { mine = null; }
    draw();
  }
  function locate() {
    if (!navigator.geolocation) { A.toast('تحديد الموقع غير مدعوم في هذا المتصفح'); return; }
    navigator.geolocation.getCurrentPosition(p => { here = { lat: p.coords.latitude, lng: p.coords.longitude }; draw(); A.toast('رُتّبت الأماكن حسب الأقرب لك'); }, () => A.toast('لم يُسمح بتحديد الموقع'), { enableHighAccuracy: false, timeout: 10000, maximumAge: 600000 });
  }
  function addItem(p, it) {
    const day = A.dayOf(A.TODAY);
    day.extras = [...(day.extras || []), { id: 'partner-' + it.id, k: (crypto.randomUUID ? crypto.randomUUID() : String(Date.now())), name: it.name + ' — ' + p.name, portion: 'وجبة', q: 1, n: Math.round(it.kcal || 0), p: it.p || 0, c: it.c || 0, f: it.f || 0, img: 'fork_and_knife_with_plate', t: new Date().toTimeString().slice(0, 5) }];
    A.saveDay({ ...day }); A.refreshAll(); A.toast('أُضيفت ' + it.name + ' إلى طعام اليوم');
  }
  function placeCard(p) {
    const c = E('div', null, 'card kp-place');
    const head = E('div', null, 'kp-place-h'), logo = E('div', null, 'kp-logo');
    if (p.logo) { const i = E('img'); i.src = p.logo; i.alt = ''; logo.append(i); } else logo.textContent = p.kind === 'gym' ? '🏋️' : '🥗';
    const t = E('div'); t.append(E('h3', p.name), E('small', [KIND[p.kind], p.city, p.hours].filter(Boolean).join(' · ')));
    if (p._d != null) t.append(E('span', num(p._d, 1) + ' كم', 'kp-dist'));
    head.append(logo, t); c.append(head, E('span', '✓ شريك معتمد من خفة', 'kp-badge'));
    if (p.offer) c.append(E('p', '🎁 ' + p.offer, 'kp-offer'));
    if (p.about) c.append(E('p', p.about, 'note'));
    const act = E('div', null, 'kp-actions');
    if (p.phone) act.append(link('📞 اتصال', 'tel:' + digits(p.phone)));
    if (p.whatsapp) act.append(link('💬 واتساب', 'https://wa.me/' + digits(p.whatsapp) + '?text=' + encodeURIComponent('السلام عليكم، وصلت لكم من تطبيق خفة دايت')));
    act.append(link('📍 الموقع', mapUrl(p)));
    c.append(act);
    if (p.items && p.items.length) {
      const det = E('details', null, 'kp-menu'); det.append(E('summary', (p.kind === 'gym' ? 'الاشتراكات والبرامج' : 'القائمة الصحية') + ' (' + num(p.items.length) + ')'));
      p.items.forEach(it => { const r = E('div', null, 'kp-item'); if (it.image) { const im = E('img'); im.src = it.image; im.alt = ''; im.loading = 'lazy'; r.append(im); } const tx = E('div'); tx.append(E('b', it.name), E('small', [it.kcal ? num(it.kcal) + ' سعرة' : '', it.p ? 'بروتين ' + num(it.p) + ' ج' : '', it.price, it.note].filter(Boolean).join(' · '))); r.append(tx); if (p.kind !== 'gym' && it.kcal) r.append(B('أضف لطعام اليوم', () => addItem(p, it), 'btn ghost sm')); det.append(r); });
      c.append(det);
    }
    return c;
  }
  function draw() {
    const sec = d.getElementById('v-partners'); if (!sec || sec.hidden) return;
    sec.replaceChildren();
    const h = E('div', null, 'kd-page-heading'); h.append(E('h1', 'مطاعم دايت وصالات رياضية'), E('p', 'أماكن شريكة معتمدة من خفة: وجبات صحية بالسعرات، وصالات للتمرين، مع التواصل والموقع.', 'note')); sec.append(h);
    const pills = E('div', null, 'kb-pills'); [['restaurant', '🥗 مطاعم دايت'], ['gym', '🏋️ صالات رياضية']].forEach(([k, l]) => { const b = B(l, () => { tab = k; draw(); }, ''); b.setAttribute('aria-selected', String(tab === k)); pills.append(b); }); sec.append(pills);
    const bar = E('div', null, 'kp-bar'); bar.append(B(here ? '📍 مرتبة حسب الأقرب لك' : '📍 الأقرب لي', locate, here ? 'btn' : 'btn ghost'));
    if (mine) bar.append(B('🏪 مكاني (' + (mine.status === 'approved' ? 'معتمد' : mine.status === 'paused' ? 'موقوف' : 'قيد المراجعة') + ')', managePlace, 'btn ghost'));
    else bar.append(B('➕ سجّل مطعمك أو الجيم كشريك', applyForm, 'btn ghost'));
    if (A.me && A.me.role === 'owner') bar.append(B('🛡️ إدارة الشركاء', adminPanel, 'btn ghost'));
    sec.append(bar);
    if (list == null) { sec.append(E('p', 'جارٍ التحميل…', 'note')); load(); return; }
    if (list.error) { sec.append(E('p', list.error, 'note')); return; }
    let rows = list.filter(p => p.kind === tab).map(p => ({ ...p, _d: here && p.lat != null && p.lng != null ? km(here, p) : null }));
    if (here) rows.sort((a, b) => (a._d ?? 1e9) - (b._d ?? 1e9));
    if (!rows.length) { const e = E('div', null, 'card'); e.append(E('h2', tab === 'gym' ? 'لا توجد صالات شريكة بعد' : 'لا توجد مطاعم شريكة بعد'), E('p', 'نضيف الشركاء تباعًا. هل تعرف مكانًا مناسبًا؟ شارك معه رابط خفة ليسجّل.', 'note'), B('مشاركة رابط التسجيل', shareInvite, 'btn ghost')); sec.append(e); return; }
    const grid = E('div', null, 'kp-grid'); rows.forEach(p => grid.append(placeCard(p))); sec.append(grid);
  }
  function shareInvite() { const t = invite(); if (navigator.share) navigator.share({ title: 'خفة دايت — شركاء', text: t }).catch(() => {}); else { navigator.clipboard?.writeText(t); A.toast('تم نسخ الرسالة'); } }
  function invite() {
    return 'السلام عليكم ورحمة الله،\nنقدّم لكم «خفة دايت»، منصة لمتابعة النظام الغذائي يستخدمها أشخاص يبحثون يوميًا عن وجبات صحية محسوبة السعرات وأماكن للتمرين.\n\nندعوكم للانضمام مجانًا كشريك:\n• صفحة خاصة لمكانكم بالقائمة الصحية والسعرات أو الاشتراكات\n• ظهور للمستخدمين القريبين منكم\n• تواصل مباشر بالاتصال وواتساب، وزر الموقع على الخريطة\n• شارة «شريك معتمد من خفة دايت»\n\nللتسجيل: افتحوا khiffa.arkiqo.com ← أنشئوا حسابًا ← «مطاعم وجيم» ← «سجّل مطعمك أو الجيم كشريك».';
  }

  /* ---------- التسجيل وإدارة المكان (مدير المطعم/الجيم) ---------- */
  function placeForm(box, p, submit) {
    const f = E('form', null, 'kp-form');
    if (!p) { const k = E('label', null, 'kd-field'); k.append(E('span', 'نوع المكان')); const s = d.createElement('select'); s.name = 'kind'; [['restaurant', 'مطعم دايت / وجبات صحية'], ['gym', 'صالة رياضية / جيم']].forEach(([v, t]) => s.append(new Option(t, v))); k.append(s); f.append(k); }
    field(f, 'اسم المكان', 'name', p?.name, 'text', { required: true, maxLength: 80 });
    field(f, 'المدينة', 'city', p?.city, 'text', { maxLength: 40 }); field(f, 'العنوان', 'address', p?.address, 'text', { maxLength: 160 });
    field(f, 'رقم الهاتف (مع رمز الدولة)', 'phone', p?.phone, 'tel', { placeholder: '+9665…' }); field(f, 'رقم واتساب', 'whatsapp', p?.whatsapp, 'tel', { placeholder: '+9665…' });
    field(f, 'ساعات العمل', 'hours', p?.hours, 'text', { placeholder: 'مثال: 12 ظهرًا – 12 ليلًا' }); field(f, 'عرض لمستخدمي خفة (اختياري)', 'offer', p?.offer, 'text', { placeholder: 'مثال: خصم 10% بإظهار التطبيق' });
    field(f, 'نبذة', 'about', p?.about, 'textarea', { maxLength: 600, rows: 3 });
    const lat = field(f, 'خط العرض (اختياري)', 'lat', p?.lat ?? '', 'number', { step: 'any' }), lng = field(f, 'خط الطول (اختياري)', 'lng', p?.lng ?? '', 'number', { step: 'any' });
    f.append(B('📍 استخدم موقعي الحالي كموقع المكان', () => navigator.geolocation?.getCurrentPosition(x => { lat.value = x.coords.latitude.toFixed(6); lng.value = x.coords.longitude.toFixed(6); A.toast('تم تحديد الموقع'); }, () => A.toast('لم يُسمح بتحديد الموقع')), 'btn ghost'));
    const lf = field(f, 'شعار المكان (اختياري)', 'logoFile', '', 'file', { accept: 'image/*' }); let logo;
    lf.onchange = async () => { if (lf.files[0]) logo = await shrink(lf.files[0], 240); };
    const save = E('button', p ? 'حفظ التعديلات' : 'إرسال طلب الانضمام', 'btn'); save.type = 'submit'; f.append(save);
    f.onsubmit = async e => { e.preventDefault(); save.disabled = true; const v = Object.fromEntries(new FormData(f)); delete v.logoFile; if (logo !== undefined) v.logo = logo; try { await submit(v); } catch (er) { A.toast(er.message); } finally { save.disabled = false; } };
    box.append(f);
  }
  function applyForm() {
    const m = modal('انضم كشريك في خفة'); m.box.append(E('p', 'سجّل مطعمك الصحي أو الجيم. بعد مراجعة الإدارة يظهر مكانك للمستخدمين القريبين، وتديره أنت من «مكاني» (معلومات المكان والقائمة فقط).', 'note'));
    placeForm(m.box, null, async v => { const r = await api('partnerApply', v); A.toast(r.status === 'approved' ? 'تمت إضافة المكان' : 'تم إرسال الطلب — سيظهر بعد اعتماد الإدارة'); m.close(); list = null; load(true); });
  }
  async function managePlace() {
    const m = modal('مكاني'); let data; try { data = await api('partnerMine'); } catch (e) { m.box.append(E('p', e.message, 'note')); return; }
    const p = data.partner; if (!p) { m.close(); applyForm(); return; }
    m.box.append(E('p', 'الحالة: ' + (p.status === 'approved' ? '✓ معتمد وظاهر للمستخدمين' : p.status === 'paused' ? 'موقوف مؤقتًا من الإدارة' : 'قيد المراجعة من الإدارة'), 'kp-status'));
    const tabs = E('div', null, 'kb-pills'), body = E('div');
    const show = k => { tabs.querySelectorAll('button').forEach(b => b.setAttribute('aria-selected', String(b.dataset.k === k))); body.replaceChildren(); if (k === 'info') placeForm(body, p, async v => { await api('partnerSave', { ...v, id: p.id }); A.toast('تم حفظ معلومات المكان'); list = null; load(true); }); else itemsPanel(body, p, data.items); };
    [['info', 'معلومات المكان'], ['items', p.kind === 'gym' ? 'الاشتراكات والبرامج' : 'القائمة الصحية']].forEach(([k, l]) => { const b = B(l, () => show(k), ''); b.dataset.k = k; tabs.append(b); });
    m.box.append(tabs, body); show('items');
  }
  function itemsPanel(body, p, items) {
    const gym = p.kind === 'gym', list_ = E('div', null, 'kp-items');
    const redraw = () => { list_.replaceChildren(); if (!items.length) list_.append(E('p', gym ? 'أضف اشتراكاتك وبرامجك.' : 'أضف أصناف قائمتك الصحية بالسعرات — تظهر للمستخدمين ويمكنهم إضافتها لطعامهم.', 'note')); items.forEach(it => { const r = E('div', null, 'kp-item'); const tx = E('div'); tx.append(E('b', it.name), E('small', [it.kcal ? num(it.kcal) + ' سعرة' : '', it.price, it.note].filter(Boolean).join(' · '))); r.append(tx, B('حذف', async () => { try { await api('partnerItemDelete', { partner: p.id, id: it.id }); items = items.filter(x => x.id !== it.id); redraw(); list = null; } catch (e) { A.toast(e.message); } }, 'btn ghost sm')); list_.append(r); }); };
    const f = E('form', null, 'kp-form kp-item-form');
    field(f, gym ? 'اسم الاشتراك أو البرنامج' : 'اسم الصنف', 'name', '', 'text', { required: true, maxLength: 80 });
    if (!gym) { field(f, 'السعرات', 'kcal', '', 'number', { min: 0, max: 5000 }); field(f, 'بروتين (جم)', 'p', '', 'number', { min: 0, step: 'any' }); field(f, 'كربوهيدرات (جم)', 'c', '', 'number', { min: 0, step: 'any' }); field(f, 'دهون (جم)', 'f', '', 'number', { min: 0, step: 'any' }); }
    field(f, 'السعر', 'price', '', 'text', { placeholder: gym ? 'مثال: 250 ر.س شهريًا' : 'مثال: 32 ر.س' }); field(f, 'ملاحظة', 'note', '', 'text', { maxLength: 160 });
    const imf = field(f, 'صورة (اختياري)', 'imgFile', '', 'file', { accept: 'image/*' }); let image = '';
    imf.onchange = async () => { if (imf.files[0]) image = await shrink(imf.files[0], 420); };
    const add = E('button', 'إضافة', 'btn'); add.type = 'submit'; f.append(add);
    f.onsubmit = async e => { e.preventDefault(); add.disabled = true; const v = Object.fromEntries(new FormData(f)); delete v.imgFile; try { const r = await api('partnerItemSave', { ...v, partner: p.id, image }); items = [{ ...v, id: r.id, kcal: +v.kcal || 0 }, ...items]; f.reset(); image = ''; redraw(); list = null; A.toast('تمت الإضافة'); } catch (er) { A.toast(er.message); } finally { add.disabled = false; } };
    body.append(f, list_); redraw();
  }

  /* ---------- إدارة الشركاء (المالك) ---------- */
  async function adminPanel() {
    const m = modal('إدارة الشركاء'); let rows; try { rows = (await api('partnerAdmin')).partners; } catch (e) { m.box.append(E('p', e.message, 'note')); return; }
    const inv = E('div', null, 'card kp-invite'); inv.append(E('h3', 'رسالة التعريف للمطاعم والصالات'), E('pre', invite(), 'kp-pre'));
    const ia = E('div', null, 'kp-actions'); ia.append(B('نسخ الرسالة', () => { navigator.clipboard?.writeText(invite()); A.toast('تم نسخ الرسالة'); }, 'btn ghost'), link('إرسال عبر واتساب', 'https://wa.me/?text=' + encodeURIComponent(invite()), 'btn')); inv.append(ia); m.box.append(inv);
    m.box.append(E('h3', 'الطلبات والشركاء (' + num(rows.length) + ')'));
    if (!rows.length) m.box.append(E('p', 'لا توجد طلبات بعد.', 'note'));
    rows.forEach(p => {
      const r = E('div', null, 'kp-item kp-admin'); const tx = E('div'); tx.append(E('b', p.name + ' — ' + KIND[p.kind]), E('small', [p.city, 'المدير: ' + (p.owner_name || '—'), p.phone, new Date(p.created).toLocaleDateString('ar')].filter(Boolean).join(' · ')));
      const st = E('span', p.status === 'approved' ? 'معتمد' : p.status === 'paused' ? 'موقوف' : 'قيد المراجعة', 'kp-st kp-' + p.status); const act = E('div', null, 'kp-actions');
      const set = s => async () => { try { await api('partnerStatus', { id: p.id, status: s }); p.status = s; st.textContent = s === 'approved' ? 'معتمد' : 'موقوف'; st.className = 'kp-st kp-' + s; list = null; A.toast('تم التحديث'); } catch (e) { A.toast(e.message); } };
      act.append(B('اعتماد', set('approved'), 'btn sm'), B('إيقاف', set('paused'), 'btn ghost sm')); r.append(tx, st, act); m.box.append(r);
    });
  }

  /* ---------- الدليل حسب الدور ---------- */
  (window.KHIFFA_GUIDE_EXTRA = window.KHIFFA_GUIDE_EXTRA || []).push(
    { key: 'partnerMgr', when: () => !!mine, title: 'دليل مدير المطعم / الجيم', items: [
      ['صلاحياتك', 'تدير مكانك فقط: معلوماته، شعاره، موقعه، قائمته أو اشتراكاته. لا ترى بيانات المستخدمين الصحية.'],
      ['مكاني', 'من «مطاعم وجيم» ← «مكاني»: تبويب «معلومات المكان» للتعديل، وتبويب «القائمة الصحية» (أو «الاشتراكات») للإضافة والحذف.'],
      ['الظهور', 'يظهر مكانك بعد اعتماد الإدارة، مرتبًا حسب قربه من المستخدم. أدخل موقع المكان بدقة (زر «استخدم موقعي الحالي» وأنت في المكان).'],
      ['القائمة بالسعرات', 'اكتب السعرات والبروتين والكربوهيدرات والدهون لكل صنف؛ يستطيع المستخدم إضافته لطعام يومه بضغطة.'],
      ['العروض', 'حقل «عرض لمستخدمي خفة» يظهر في بطاقة مكانك، مثل خصم عند إظهار التطبيق.']] },
    { key: 'partnerOwner', when: () => A.me && A.me.role === 'owner', title: 'دليل المالك — الشركاء', items: [
      ['اعتماد الشركاء', 'من «مطاعم وجيم» ← «إدارة الشركاء»: تعتمد الطلبات الجديدة أو توقف أي شريك. مدير المطعم/الجيم يدير مكانه فقط.'],
      ['رسالة التعريف', 'في «إدارة الشركاء» رسالة جاهزة للنسخ أو الإرسال عبر واتساب للمطاعم والصالات.']] }
  );

  const css = E('style'); css.textContent = `.kp-box{width:min(100%,760px)!important;max-width:760px!important}.kp-head{display:flex;justify-content:space-between;align-items:center;gap:10px}.kp-head h2{margin:0}
.kp-bar{display:flex;flex-wrap:wrap;gap:8px;margin:0 0 14px;grid-column:1/-1}.kp-bar .btn{flex:1 1 200px;min-height:44px}
.kp-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:14px;grid-column:1/-1}
.kp-place{display:grid;gap:8px}.kp-place-h{display:flex;gap:12px;align-items:center}.kp-place-h h3{margin:0;font-size:17px}.kp-place-h small{color:var(--muted)}
.kp-logo{width:56px;height:56px;border-radius:16px;background:var(--mint-soft,#e8f4ec);display:grid;place-items:center;font-size:28px;overflow:hidden;flex:none}.kp-logo img{width:100%;height:100%;object-fit:cover}
.kp-dist{display:block;margin-top:2px;font-size:12px;font-weight:700;color:#1E8A4C}.kp-badge{justify-self:start;font-size:11px;font-weight:700;color:#1E8A4C;background:var(--mint-soft,#e8f4ec);border-radius:999px;padding:3px 10px}
.kp-offer{margin:0;font-weight:600;color:#B7791F}.kp-actions{display:flex;flex-wrap:wrap;gap:8px}.kp-actions a{border:1px solid var(--line);border-radius:999px;background:var(--surface);color:var(--ink,#1d2b22);font-weight:700;font-size:14px}.kp-actions a.btn:not(.ghost){background:#1E8A4C;color:#fff;border-color:#1E8A4C}.kp-actions .btn,.kp-actions a{flex:1 1 90px;min-height:42px;display:inline-flex;align-items:center;justify-content:center;text-decoration:none}
.kp-menu summary{cursor:pointer;font-weight:700;min-height:36px}.kp-item{display:grid;grid-template-columns:auto 1fr auto;gap:10px;align-items:center;border-top:1px solid var(--line);padding:8px 0}.kp-item img{width:52px;height:52px;border-radius:10px;object-fit:cover}.kp-item>div{display:grid}.kp-item small{color:var(--muted)}
.kp-form{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}.kp-form .kd-field{display:grid;gap:4px}.kp-form .kd-field:has(textarea),.kp-form>button{grid-column:1/-1}.kp-form input,.kp-form select,.kp-form textarea{min-height:44px;font:inherit;font-size:16px}
.kp-status{font-weight:700}.kp-pre{white-space:pre-wrap;font:inherit;font-size:13px;line-height:1.9;background:var(--bg);border-radius:12px;padding:10px;max-height:240px;overflow:auto}
.kp-st{font-size:12px;font-weight:700;border-radius:999px;padding:3px 10px;background:#fff4d6;color:#8a5a00}.kp-approved{background:#e2f5e8;color:#1E6B3C}.kp-paused{background:#fde2e1;color:#a12622}.kp-admin{grid-template-columns:1fr auto}.kp-admin .kp-actions{grid-column:1/-1}
@media(max-width:600px){.kp-form{grid-template-columns:1fr}.kp-grid{grid-template-columns:1fr}}`;
  d.head.append(css);
  function watch() { const sec = d.getElementById('v-partners'); if (!sec || sec.dataset.kpWatch) return; sec.dataset.kpWatch = '1'; new MutationObserver(() => { if (!sec.hidden) draw(); }).observe(sec, { attributes: true, attributeFilter: ['hidden'] }); if (!sec.hidden) draw(); }
  function render() { if (!A.me || !A.data) return; watch(); if (mine === undefined) { mine = null; api('partnerMine').then(r => { mine = r.partner || null; }).catch(() => {}); } }
  window.KHIFFA_PARTNERS = { open: () => { const b = d.querySelector('#tabs button[data-v="partners"]'); if (b) b.click(); }, invite };
  (window.KHIFFA_HOOKS = window.KHIFFA_HOOKS || []).push(render);
  (window.KHIFFA_LOGOUT_HOOKS = window.KHIFFA_LOGOUT_HOOKS || []).push(() => { list = null; mine = undefined; here = null; });
  new MutationObserver(watch).observe(d.getElementById('app') || d.body, { childList: true });
  window.addEventListener('khiffa-ready', render); render();
})();
