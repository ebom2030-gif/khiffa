/* خفّة – إضافات: زرار + سريع، باركود المنتجات، كرّري وجبة، ضبط السعرات من الوزن، تذكير بالماية والوجبات */
(function () {
  'use strict';
  var d = document, A = window.KHIFFA_APP; if (!A) return;
  var D = A.D, ar = A.ar, esc = A.esc;
  var LS = { get: function (k, v) { try { var x = localStorage.getItem('khiffa.' + k); return x ? JSON.parse(x) : v; } catch (e) { return v; } }, set: function (k, v) { try { localStorage.setItem('khiffa.' + k, JSON.stringify(v)); } catch (e) {} } };

  var css = d.createElement('style');
  css.textContent =
    '.kf-fab{position:fixed;left:16px;bottom:calc(88px + env(safe-area-inset-bottom,0px));z-index:8;width:58px;height:58px;border-radius:50%;border:0;background:var(--peach);color:#fff;font-size:32px;line-height:1;box-shadow:0 10px 24px -8px rgba(255,122,89,.7);cursor:pointer;display:grid;place-items:center;transition:transform .2s}' +
    '.kf-fab:active{transform:scale(.92)}' +
    '@media (min-width:960px){.kf-fab{bottom:28px;left:28px}}' +
    '.kf-acts{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}' +
    '.kf-act{display:flex;flex-direction:column;align-items:center;gap:6px;padding:16px 8px;border-radius:18px;border:0;background:var(--bg);font:inherit;font-weight:600;color:var(--ink);cursor:pointer}' +
    '.kf-act .fimg{width:44px;height:44px}.kf-act small{font-weight:400;color:var(--muted);font-size:12px}' +
    '.kf-cam{position:relative;border-radius:16px;overflow:hidden;background:#000;aspect-ratio:4/3}.kf-cam video{width:100%;height:100%;object-fit:cover}' +
    '.kf-cam::after{content:"";position:absolute;inset:30% 12%;border:3px solid rgba(255,255,255,.85);border-radius:14px}' +
    '.kf-prod{display:grid;grid-template-columns:auto 1fr;gap:12px;align-items:center;background:var(--bg);border-radius:16px;padding:12px}' +
    '.kf-prod img{width:64px;height:64px;object-fit:contain;border-radius:12px;background:#fff}' +
    '.kf-past{display:grid;grid-template-columns:auto 1fr auto;gap:10px;align-items:center;width:100%;text-align:right;border:0;background:var(--bg);border-radius:16px;padding:10px 12px;font:inherit;color:inherit;cursor:pointer}' +
    '.kf-past .pics{display:flex;gap:2px}.kf-past .pics .fimg{width:26px;height:26px}.kf-past .nm{font-weight:600}' +
    '.kf-lvl{display:grid;grid-template-columns:auto 1fr;gap:12px;align-items:center}.kf-lvl .fimg{width:44px;height:44px}';
  d.head.appendChild(css);

  function sheet(title, html) {
    var root = d.getElementById('sheetRoot');
    root.innerHTML = '<div class="sheet-bg"><div class="sheet" role="dialog" aria-modal="true" aria-label="' + esc(title) + '"><div class="sheet-h"><h3>' + esc(title) + '</h3><button class="btn ghost sm" data-x>إغلاق</button></div><div class="sheet-b">' + html + '</div></div></div>';
    d.body.style.overflow = 'hidden';
    var close = function () { stopCam(); root.innerHTML = ''; d.body.style.overflow = ''; };
    root.querySelector('[data-x]').onclick = close;
    root.querySelector('.sheet-bg').onclick = function (e) { if (e.target.classList.contains('sheet-bg')) close(); };
    return { body: root.querySelector('.sheet-b'), close: close };
  }
  function go(v) { var b = d.querySelector('#tabs button[data-v="' + v + '"]'); if (b) b.click(); }
  function addExtra(x) {
    var day = A.dayOf(A.cur), now = new Date();
    x.t = String(now.getHours()).padStart(2, '0') + ':' + String(now.getMinutes()).padStart(2, '0');
    day.extras = (day.extras || []).concat(x); A.saveDay(Object.assign({}, day)); A.refresh(); A.toast('تم تسجيل: ' + x.name);
  }

  /* ---------- زرار + ---------- */
  var fab = d.createElement('button'); fab.className = 'kf-fab'; fab.setAttribute('aria-label', 'إضافة سريعة'); fab.textContent = '+';
  d.body.appendChild(fab);
  var showFab = function () { fab.hidden = !A.data || d.getElementById('app').hidden; };
  fab.onclick = function () {
    var s = sheet('إضافة سريعة',
      '<div class="kf-acts">' +
      '<button class="kf-act" data-a="search">' + A.img('magnifying_glass_tilted_left') + 'سجّلي طعامًا<small>بالاسم أو بالوزن</small></button>' +
      '<button class="kf-act" data-a="scan">' + A.img('mobile_phone') + 'باركود منتج<small>زبادي، شيبسي، عصير...</small></button>' +
      '<button class="kf-act" data-a="repeat">' + A.img('repeat_button') + 'كرّري وجبة<small>مما تناولته سابقًا</small></button>' +
      '<button class="kf-act" data-a="water">' + A.img('droplet') + 'زجاجة ماء<small>330 مل</small></button></div>');
    s.body.querySelectorAll('.kf-act').forEach(function (b) { b.onclick = function () {
      var a = b.dataset.a; s.close();
      if (a === 'search') { go('today'); setTimeout(function () { var q = d.getElementById('qaQ'); if (q) { q.scrollIntoView({ block: 'center', behavior: 'smooth' }); q.focus(); } }, 150); }
      if (a === 'scan') scan();
      if (a === 'repeat') pickSlot();
      if (a === 'water') { var x = A.dayOf(A.TODAY); x.w3 = A.bottles(x) + 1; A.saveDay(Object.assign({}, x)); A.refresh(); A.toast('زجاجة ماء ✓ (' + ar(x.w3) + ' من ' + ar(A.settings().water) + ')'); }
    }; });
  };

  /* ---------- باركود (Open Food Facts) ---------- */
  var camStream = null, camTimer = null, zx = null;
  function stopCam() { if (camTimer) clearInterval(camTimer); camTimer = null; if (zx && zx.reset) { try { zx.reset(); } catch (e) {} } zx = null; if (camStream) camStream.getTracks().forEach(function (t) { t.stop(); }); camStream = null; }
  function loadZX() { return new Promise(function (ok, no) { if (window.ZXing) return ok(); var s = d.createElement('script'); s.src = 'https://cdn.jsdelivr.net/npm/@zxing/library@0.21.3/umd/index.min.js'; s.onload = ok; s.onerror = no; d.head.appendChild(s); }); }
  function scan() {
    var s = sheet('باركود منتج',
      '<div class="kf-cam"><video id="kfVid" playsinline muted></video></div>' +
      '<p class="note" id="kfMsg" style="margin:0">وجّهي الكاميرا على الباركود.</p>' +
      '<div class="row"><input id="kfCode" type="number" inputmode="numeric" placeholder="أو اكتبي رقم الباركود" style="flex:1"><button class="btn" id="kfGo">بحث</button></div><div id="kfRes"></div>');
    var vid = d.getElementById('kfVid'), msg = d.getElementById('kfMsg'), done = false;
    var found = function (code) { if (done) return; done = true; stopCam(); d.getElementById('kfCode').value = code; lookup(code, s); };
    d.getElementById('kfGo').onclick = function () { var c = d.getElementById('kfCode').value.trim(); if (c.length >= 6) { done = true; stopCam(); lookup(c, s); } };
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) { msg.textContent = 'الكاميرا غير متاحة هنا، اكتبي الرقم المكتوب أسفل الباركود.'; return; }
    if ('BarcodeDetector' in window) {
      navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } }).then(function (st) {
        camStream = st; vid.srcObject = st; vid.play();
        var det = new window.BarcodeDetector({ formats: ['ean_13', 'ean_8', 'upc_a', 'upc_e', 'code_128'] });
        camTimer = setInterval(function () { det.detect(vid).then(function (r) { if (r && r[0]) found(r[0].rawValue); }).catch(function () {}); }, 350);
      }).catch(function () { msg.textContent = 'تعذّر فتح الكاميرا. اسمحي بالوصول إلى الكاميرا أو اكتبي الرقم.'; });
    } else {
      loadZX().then(function () {
        zx = new window.ZXing.BrowserMultiFormatReader();
        zx.decodeFromVideoDevice(null, vid, function (r) { if (r) found(r.getText()); });
      }).catch(function () { msg.textContent = 'تعذّر تشغيل الماسح. اكتبي رقم الباركود.'; });
    }
  }
  function lookup(code, s) {
    var res = d.getElementById('kfRes'); if (!res) return;
    var cache = LS.get('bc', {});
    var show = function (p) {
      var k100 = p.k, grams = p.serving || 100;
      res.innerHTML = '<div class="kf-prod">' + (p.img ? '<img src="' + esc(p.img) + '" alt="">' : A.img('package')) + '<div><div style="font-weight:700">' + esc(p.name) + '</div><div class="note num">' + ar(k100, 0) + ' سعرة لكل 100 ' + (p.ml ? 'مل' : 'جم') + ' – بروتين ' + ar(p.p, 1) + ' ج</div></div></div>' +
        '<div class="row" style="margin-top:10px"><label class="note">الكمية التي تناولتها (' + (p.ml ? 'مل' : 'جم') + ')<input id="kfG" type="number" inputmode="decimal" value="' + grams + '" style="width:120px;display:block;margin-top:4px"></label><b class="num" id="kfK" style="font-size:20px"></b></div>' +
        '<button class="btn" id="kfAdd" style="width:100%;margin-top:10px">سجّلي</button>';
      var g = d.getElementById('kfG'), kk = d.getElementById('kfK');
      var upd = function () { kk.textContent = ar(Math.round(k100 * (parseFloat(g.value) || 0) / 100), 0) + ' سعرة'; }; g.oninput = upd; upd();
      d.getElementById('kfAdd').onclick = function () {
        var q = (parseFloat(g.value) || 0) / 100; if (!q) return;
        addExtra({ id: 'bc-' + code, name: p.name, portion: '100 ' + (p.ml ? 'مل' : 'جم'), q: Math.round(q * 1000) / 1000, n: k100, p: p.p, c: p.c, f: p.f, img: 'package', amt: ar(parseFloat(g.value)) + (p.ml ? ' مل' : ' جم'), tag: null });
        s.close();
      };
    };
    if (cache[code]) return show(cache[code]);
    res.innerHTML = '<p class="note">جارٍ البحث عن المنتج…</p>';
    fetch('https://world.openfoodfacts.org/api/v2/product/' + encodeURIComponent(code) + '.json?fields=product_name,product_name_ar,product_name_en,brands,nutriments,serving_quantity,image_front_small_url,quantity')
      .then(function (r) { return r.json(); }).then(function (j) {
        var pr = j && j.product, n = pr && pr.nutriments;
        var k = n && (n['energy-kcal_100g'] || (n['energy_100g'] ? n['energy_100g'] / 4.184 : 0));
        if (!pr || !k) { res.innerHTML = '<p class="note">هذا المنتج غير موجود في قاعدة البيانات. سجّليه من البحث واكتبي السعرات المدوّنة على العلبة.</p>'; return; }
        var p = { name: (pr.product_name_ar || pr.product_name || pr.product_name_en || 'منتج') + (pr.brands ? ' – ' + pr.brands.split(',')[0] : ''), k: Math.round(k), p: +(n.proteins_100g || 0), c: +(n.carbohydrates_100g || 0), f: +(n.fat_100g || 0), serving: Math.round(+pr.serving_quantity || 0) || null, img: pr.image_front_small_url || '', ml: /ml|l\b/i.test(pr.quantity || '') };
        cache[code] = p; LS.set('bc', cache); show(p);
      }).catch(function () { res.innerHTML = '<p class="note">لا يوجد اتصال بالإنترنت أو الخدمة غير متاحة حاليًا.</p>'; });
  }

  /* ---------- كرّري وجبة ---------- */
  function pastMeals(k) {
    var seen = {}, out = [];
    for (var i = 1; i <= 45 && out.length < 12; i++) {
      var key = A.addDays(A.TODAY, -i), st = A.mealState(A.dayOf(key), k), comps = A.mealComps(k, st);
      if (!comps.length || !st.done) continue;
      var sig = comps.map(function (x) { return x.food.id + ':' + Math.round(x.n * 100); }).sort().join(',');
      if (seen[sig]) continue; seen[sig] = 1;
      var idea = st.mode !== 'custom' && st.idea ? D.IDEAS.find(function (x) { return x.id === st.idea; }) : null;
      out.push({ key: key, comps: comps, title: st.title || (idea ? A.ideaName(idea) : comps.map(function (x) { return x.food.name.split(' (')[0]; }).slice(0, 3).join('، ')) });
    }
    return out;
  }
  function pickSlot() {
    var s = sheet('كرّري وجبة', '<p class="note" style="margin:0">اختاري الوجبة:</p><div class="kf-acts">' + D.MEALS.map(function (m) { return '<button class="kf-act" data-k="' + m.k + '">' + A.img(m.img) + m.t + '</button>'; }).join('') + '</div>');
    s.body.querySelectorAll('[data-k]').forEach(function (b) { b.onclick = function () { s.close(); repeat(D.MEALS.find(function (m) { return m.k === b.dataset.k; })); }; });
  }
  function repeat(m) {
    var list = pastMeals(m.k);
    var s = sheet('كرّري ' + m.t, list.length ? '<p class="note" style="margin:0">اضغطي على أي وجبة لتسجيلها ' + (A.cur === A.TODAY ? 'اليوم' : 'في اليوم المفتوح') + ' بالكميات نفسها.</p>' + list.map(function (x, i) {
      var t = A.totals(x.comps); return '<button class="kf-past" data-i="' + i + '"><div class="pics">' + x.comps.slice(0, 4).map(function (c) { return A.img(c.food.img, 'sm'); }).join('') + '</div><div style="min-width:0"><div class="nm">' + esc(x.title) + '</div><div class="note">' + A.fmt(x.key, { weekday: 'long', day: 'numeric', month: 'short' }) + '</div></div><b class="num">' + ar(Math.round(t.n), 0) + '</b></button>';
    }).join('') : '<p class="note">لم تُسجَّل ' + m.t + ' كوجبة مُتناوَلة في آخر 45 يومًا.</p>');
    s.body.querySelectorAll('.kf-past').forEach(function (b) { b.onclick = function () {
      var x = list[+b.dataset.i];
      A.setMeal(m.k, { mode: 'custom', items: x.comps.map(function (c) { return { id: c.food.id, n: c.n }; }), title: x.title, done: true, planned: false }, A.cur);
      s.close(); A.refresh(); A.toast('تم تسجيل ' + m.t + ' ✓');
    }; });
  }
  function addRepeatButtons() {
    var cards = d.querySelectorAll('#meals .mcard');
    cards.forEach(function (c, i) {
      var act = c.querySelector('.mact'), m = D.MEALS[i]; if (!act || !m || act.querySelector('[data-rep]')) return;
      var b = d.createElement('button'); b.className = 'btn ghost sm'; b.dataset.rep = m.k; b.textContent = 'كرّري وجبة سابقة'; b.onclick = function () { repeat(m); }; act.appendChild(b);
    });
  }

  /* ---------- ضبط السعرات من الوزن ---------- */
  function suggestLevel() {
    var data = A.data, ib = (data.inbody || []).filter(function (r) { return +r.bmr; }).pop(); if (!ib) return null;
    var wts = (data.days || []).filter(function (x) { return x.weight; }), cur = wts.length ? +wts[wts.length - 1].weight : +ib.weight;
    var st = A.settings(), bmr = +ib.bmr - 10 * ((+ib.weight || cur) - cur), tdee = bmr * (st.activity || 1.375), want = tdee - 500;
    var levels = Object.keys(D.LEVELS).map(Number).sort(function (a, b) { return a - b; });
    var best = levels.reduce(function (b, l) { return Math.abs(l - want) < Math.abs(b - want) ? l : b; }, levels[0]);
    return { level: best, bmr: Math.round(bmr), tdee: Math.round(tdee), cur: cur, ib: ib };
  }
  function levelCard() {
    var home = d.getElementById('v-home'); if (!home || home.hidden || !A.data) return;
    var old = d.getElementById('kfLvl'); if (old) old.remove();
    var sg = suggestLevel(), st = A.settings(); if (!sg || sg.level === st.level || LS.get('lvlSkip', 0) === sg.level) return;
    var c = d.createElement('div'); c.className = 'card hm-wide'; c.id = 'kfLvl';
    c.innerHTML = '<div class="kf-lvl">' + A.img('balance_scale') + '<div><b>السعرات المناسبة الآن ' + ar(sg.level, 0) + ' بدلًا من ' + ar(st.level, 0) + '</b><div class="note">حسب آخر وزن (' + ar(sg.cur) + ' كجم) وآخر InBody: الحرق الأساسي نحو ' + ar(sg.bmr, 0) + '، ومع النشاط ' + ar(sg.tdee, 0) + '، مطروحًا منه 500 لإنقاص الوزن.</div>' +
      '<div class="row" style="margin-top:8px"><button class="btn sm" id="kfLvlOk">طبّقي ' + ar(sg.level, 0) + '</button><button class="btn ghost sm" id="kfLvlNo">ليس الآن</button></div></div></div>';
    var first = home.querySelector('.card'); home.insertBefore(c, first ? first.nextSibling : null);
    d.getElementById('kfLvlOk').onclick = function () { A.saveSettings({ level: sg.level }); A.toast('أصبح النظام ' + ar(sg.level, 0) + ' سعرة'); };
    d.getElementById('kfLvlNo').onclick = function () { LS.set('lvlSkip', sg.level); c.remove(); };
  }

  /* ---------- تذكير بالماية والوجبات ---------- */
  var TIMES = { b: 9, s1: 11.5, l: 14.5, s2: 17.5, d: 20.5 };
  function remindOn() { return LS.get('remind', false) && 'Notification' in window && Notification.permission === 'granted'; }
  function notify(tag, title, body) {
    var sent = LS.get('rem:' + A.TODAY, {}); if (sent[tag]) return; sent[tag] = 1; LS.set('rem:' + A.TODAY, sent);
    var opt = { body: body, icon: 'icon-192.png', badge: 'icon-192.png', tag: 'khiffa-' + tag, dir: 'rtl', lang: 'ar' };
    if (navigator.serviceWorker && navigator.serviceWorker.ready) navigator.serviceWorker.ready.then(function (r) { r.showNotification(title, opt); }).catch(function () { try { new Notification(title, opt); } catch (e) {} });
    else try { new Notification(title, opt); } catch (e) {}
  }
  function checkRemind() {
    if (!remindOn() || !A.data) return;
    var now = new Date(), h = now.getHours() + now.getMinutes() / 60, day = A.dayOf(A.TODAY), st = A.settings();
    D.MEALS.forEach(function (m) { if (h >= TIMES[m.k] + 0.5 && h < TIMES[m.k] + 3 && !A.mealState(day, m.k).done) notify(m.k, 'خفّة – ' + m.t, 'لم تسجّلي ' + m.t + ' بعد. سجّليها بضغطة من التطبيق.'); });
    var expect = Math.floor(st.water * Math.min(1, Math.max(0, (h - 8) / 13)));
    if (h >= 11 && A.bottles(day) < expect - 1) notify('w' + Math.floor(h / 3), 'خفّة – الماء', 'اشربي زجاجة ماء. حتى الآن ' + ar(A.bottles(day)) + ' من ' + ar(st.water) + '.');
  }
  setInterval(checkRemind, 10 * 60 * 1000);
  function remindToggle() {
    var acct = d.getElementById('acct'); if (!acct || d.getElementById('kfRem')) return;
    var row = d.createElement('div'); row.className = 'row'; row.id = 'kfRem'; row.style.margin = '10px 0';
    row.innerHTML = '<span class="note">تذكير بالماء والوجبات:</span><button class="fchip" id="kfRemBtn"></button><span class="note" style="width:100%">يعمل ما دام التطبيق مفتوحًا أو في الخلفية. على الآيفون يجب أن يكون مثبّتًا على الشاشة الرئيسية.</span>';
    acct.parentNode.insertBefore(row, acct.nextSibling);
    var b = d.getElementById('kfRemBtn'), paint = function () { b.textContent = remindOn() ? 'مُفعّل ✓' : 'فعّلي'; b.setAttribute('aria-pressed', remindOn()); };
    b.onclick = function () {
      if (remindOn()) { LS.set('remind', false); paint(); return; }
      if (!('Notification' in window)) { A.toast('هذا المتصفح لا يدعم التنبيهات'); return; }
      Notification.requestPermission().then(function (p) { LS.set('remind', p === 'granted'); paint(); if (p === 'granted') { A.toast('تم تفعيل التذكير'); checkRemind(); } else A.toast('يلزم السماح بالتنبيهات من إعدادات المتصفح'); });
    };
    paint();
  }

  (window.KHIFFA_HOOKS = window.KHIFFA_HOOKS || []).push(function () { showFab(); addRepeatButtons(); levelCard(); remindToggle(); checkRemind(); });
  d.querySelectorAll('#tabs button').forEach(function (b) { b.addEventListener('click', function () { setTimeout(levelCard, 0); }); });
  showFab(); addRepeatButtons(); if (A.data) { levelCard(); remindToggle(); }
})();
