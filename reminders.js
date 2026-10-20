/* خفّة – مواعيد الوجبات + إشعارات حقيقية (OneSignal) بتوصل والتطبيق مقفول.
   - أول فتح: شاشة "مواعيد وجباتكِ" (لو المستخدم فاتح حسابه ولسه ما حددش مواعيد).
   - التعديل من صفحة النظام.
   - التخزين في settings: mt = {b,s1,l,s2,d: 'HH:MM' أو ''}، rm = {on, before}، tz.
   - الإرسال من الخادم (Code.gs → remindTick_) كل 5 دقائق، للمستخدم بالـ external_id = uid. */
(function () {
  'use strict';
  var d = document, A = window.KHIFFA_APP, CFG = window.KHIFFA_CONFIG || {};
  var MEALS = [['b', 'الفطور', '09:00'], ['s1', 'سناك الصباح', '11:30'], ['l', 'الغداء', '14:30'], ['s2', 'سناك العصر', '17:30'], ['d', 'العشاء', '20:30']];
  var BEFORE = [5, 10, 15, 30];
  var BASE = location.pathname.replace(/[^/]*$/, ''); // '/khiffa/' على GitHub أو '/' على الدومين

  var css = d.createElement('style');
  css.textContent =
    '.krm{position:fixed;inset:0;z-index:9000;background:rgba(15,25,20,.45);display:flex;align-items:flex-end;justify-content:center}' +
    '.krm .in{width:100%;max-width:480px;max-height:92vh;overflow:auto;background:var(--surface);border-radius:26px 26px 0 0;padding:22px 18px 18px;box-shadow:0 -10px 40px -10px rgba(0,0,0,.35);animation:krmu .35s ease both}' +
    '@media (min-width:700px){.krm{align-items:center}.krm .in{border-radius:26px}}' +
    '@keyframes krmu{from{transform:translateY(40px);opacity:0}}' +
    '.krm h2{margin:0 0 4px}.krm .sub{color:var(--muted);font-size:14px;margin:0 0 14px;line-height:1.7}' +
    '.krm .row{display:grid;grid-template-columns:auto 1fr auto;gap:10px;align-items:center;padding:10px 12px;border-radius:16px;background:var(--bg);margin-bottom:8px}' +
    '.krm .row .fimg{width:34px;height:34px}.krm .row b{font-size:15px}' +
    '.krm input[type=time]{font:inherit;font-size:16px;padding:8px 10px;border:1px solid var(--line);border-radius:12px;background:var(--surface);color:var(--ink);direction:ltr}' +
    '.krm .row.off input{opacity:.35}.krm .sw{display:flex;align-items:center;gap:6px;font-size:12px;color:var(--muted)}' +
    '.krm .bf{display:flex;gap:8px;flex-wrap:wrap;margin:6px 0 14px}.krm .bf button{border:1px solid var(--line);background:var(--surface);color:var(--ink);border-radius:999px;padding:8px 14px;font:inherit}' +
    '.krm .bf button[aria-pressed=true]{background:var(--mint);border-color:var(--mint);color:#fff}' +
    '.krm .act{display:flex;gap:10px;margin-top:6px}.krm .act .btn{flex:1}' +
    '.krm .lbl{font-weight:700;margin:12px 0 4px}.krm .kx{display:flex;flex-direction:column;gap:8px;margin:4px 0 14px}.krm .kx .sw{font-size:14px;color:var(--ink)}';
  d.head.appendChild(css);

  function own() { var D = A && A.data; return D && D.me && D.user && D.me.id === D.user.id; }
  function st() { return A.settings ? A.settings() : {}; }

  /* ---------- OneSignal (يتحمّل بس لو المفتاح موجود في config.js) ---------- */
  var osReady = null;
  function oneSignal() {
    if (!CFG.ONESIGNAL_APP_ID) return Promise.resolve(null);
    if (osReady) return osReady;
    osReady = new Promise(function (res) {
      window.OneSignalDeferred = window.OneSignalDeferred || [];
      window.OneSignalDeferred.push(function (OS) {
        OS.init({ appId: CFG.ONESIGNAL_APP_ID, serviceWorkerPath: BASE.slice(1) + 'sw.js', serviceWorkerParam: { scope: BASE }, notifyButton: { enable: false }, allowLocalhostAsSecureOrigin: true })
          .then(function () { res(OS); }).catch(function () { res(null); });
      });
      var s = d.createElement('script'); s.src = 'https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.page.js'; s.defer = true; d.head.appendChild(s);
    });
    return osReady;
  }
  function linkUser() { // يربط الجهاز بحساب المستخدم عشان الخادم يبعت له هو بس
    var D = A.data; if (!D || !D.me) return;
    oneSignal().then(function (OS) { if (OS) try { OS.login(String(D.me.id)); } catch (e) {} });
  }
  function askPermission() {
    return oneSignal().then(function (OS) {
      if (!OS) { // لسه المفتاح مش متحط: نطلب الإذن عادي عشان يبقى جاهز
        return ('Notification' in window) ? Notification.requestPermission().then(function (p) { return p === 'granted'; }) : false;
      }
      return OS.Notifications.requestPermission().then(function () { linkUser(); return OS.Notifications.permission; });
    }).catch(function () { return false; });
  }

  /* ---------- شاشة المواعيد ---------- */
  function open(first) {
    if (d.querySelector('.krm')) return;
    var s = st(), mt = s.mt || {}, rm = s.rm || { on: true, before: 10 };
    var o = d.createElement('div'); o.className = 'krm'; o.setAttribute('role', 'dialog'); o.setAttribute('aria-label', 'مواعيد الوجبات');
    var D = A.D || {}, img = function (k) { var m = (D.MEALS || []).find(function (x) { return x.k === k; }); return m && A.img ? A.img(m.img) : ''; };
    o.innerHTML = '<div class="in"><h2>' + (first ? 'مواعيد وجباتكِ ⏰' : 'مواعيد الوجبات والتنبيهات') + '</h2>' +
      '<p class="sub">اختاري الوقت الذي يناسبكِ لكل وجبة، وسيصلكِ تنبيه على الجوال قبلها حتى لو كان التطبيق مغلقًا. يمكنكِ تعديلها في أي وقت من صفحة «النظام».</p>' +
      MEALS.map(function (m) { var v = mt[m[0]] === undefined ? m[2] : mt[m[0]]; return '<div class="row' + (v ? '' : ' off') + '" data-k="' + m[0] + '">' + img(m[0]) + '<b>' + m[1] + '</b><span style="display:flex;align-items:center;gap:8px"><input type="time" value="' + (v || m[2]) + '" aria-label="موعد ' + m[1] + '"><label class="sw"><input type="checkbox"' + (v ? ' checked' : '') + '> تنبيه</label></span></div>'; }).join('') +
      '<div class="lbl">التنبيه قبل الوجبة بـ</div><div class="bf">' + BEFORE.map(function (b) { return '<button type="button" data-b="' + b + '" aria-pressed="' + (+rm.before === b) + '">' + b + (b > 10 ? ' دقيقة' : ' دقائق') + '</button>'; }).join('') + '</div>' +
      '<div class="lbl">تنبيهات أخرى</div><div class="kx">' +
      [['water', 'تذكير بشرب الماء خلال اليوم'], ['weight', 'تذكير بوزن الصباح'], ['summary', 'ملخص آخر اليوم']].map(function (x) { return '<label class="sw"><input type="checkbox" data-x="' + x[0] + '"' + (rm[x[0]] !== false ? ' checked' : '') + '> ' + x[1] + '</label>'; }).join('') + '</div>' +
      '<label class="sw" style="font-size:14px;margin-bottom:12px"><input type="checkbox" id="krmOn"' + (rm.on !== false ? ' checked' : '') + '> تفعيل الإشعارات على هذا الجوال</label>' +
      '<div class="act"><button class="btn" id="krmSave">حفظ المواعيد</button>' + (first ? '<button class="btn ghost" id="krmLater">لاحقًا</button>' : '<button class="btn ghost" id="krmLater">إلغاء</button>') + '</div></div>';
    d.body.appendChild(o);
    o.querySelectorAll('.row').forEach(function (r) { var c = r.querySelector('input[type=checkbox]'); c.onchange = function () { r.classList.toggle('off', !c.checked); }; });
    o.querySelectorAll('.bf button').forEach(function (b) { b.onclick = function () { o.querySelectorAll('.bf button').forEach(function (x) { x.setAttribute('aria-pressed', x === b); }); }; });
    var close = function () { o.remove(); };
    o.addEventListener('click', function (e) { if (e.target === o && !first) close(); });
    o.querySelector('#krmLater').onclick = function () { if (first) try { localStorage.setItem('khiffa.rmLater', Date.now()); } catch (e) {} close(); };
    o.querySelector('#krmSave').onclick = function () {
      var mt2 = {}; o.querySelectorAll('.row').forEach(function (r) { mt2[r.dataset.k] = r.querySelector('input[type=checkbox]').checked ? r.querySelector('input[type=time]').value : ''; });
      var bsel = o.querySelector('.bf button[aria-pressed=true]'), on = o.querySelector('#krmOn').checked;
      var tz = 'Asia/Riyadh'; try { tz = Intl.DateTimeFormat().resolvedOptions().timeZone || tz; } catch (e) {}
      var rm2 = { on: on, before: bsel ? +bsel.dataset.b : 10 }; o.querySelectorAll('[data-x]').forEach(function (c) { rm2[c.dataset.x] = c.checked; });
      A.saveSettings({ mt: mt2, rm: rm2, tz: tz });
      close();
      if (on) askPermission().then(function (ok) { A.toast(ok ? 'تم حفظ المواعيد وتفعيل الإشعارات ✓' : 'تم حفظ المواعيد. اسمحي بالإشعارات من إعدادات المتصفح لتصلكِ التنبيهات'); });
      else A.toast('تم حفظ المواعيد');
    };
  }

  /* ---------- كارت في صفحة النظام ---------- */
  function card() {
    var plan = d.getElementById('v-plan'); if (!plan || d.getElementById('krmCard') || !A.data) return;
    var c = d.createElement('div'); c.className = 'card'; c.id = 'krmCard';
    plan.insertBefore(c, plan.children[1] || null);
    paint();
  }
  function paint() {
    var c = d.getElementById('krmCard'); if (!c || !A.data) return;
    var s = st(), mt = s.mt || {}, rm = s.rm || {};
    var list = MEALS.filter(function (m) { return mt[m[0]]; }).map(function (m) { return m[1] + ' ' + mt[m[0]]; }).join(' · ');
    c.innerHTML = '<h2>مواعيد الوجبات والتنبيهات</h2><p class="note" style="margin:6px 0 10px;line-height:1.8">' +
      (s.mt ? (list || 'لا توجد تنبيهات مفعّلة') + (rm.on === false ? ' — الإشعارات متوقفة' : ' — التنبيه قبل الوجبة بـ ' + (rm.before || 10) + ((rm.before || 10) > 10 ? ' دقيقة' : ' دقائق') + [['water', 'الماء'], ['weight', 'الوزن'], ['summary', 'ملخص اليوم']].filter(function (x) { return rm[x[0]] !== false; }).map(function (x) { return ' · ' + x[1]; }).join('')) : 'لم تُحدَّد مواعيد الوجبات بعد.') +
      '</p><button class="btn sm" id="krmEdit">' + (s.mt ? 'تعديل المواعيد' : 'تحديد المواعيد') + '</button>';
    c.querySelector('#krmEdit').onclick = function () { open(false); };
  }

  /* ---------- أول فتح ---------- */
  var asked = false;
  function first() {
    if (asked || !A.data || !own()) return;
    var s = A.data.settings || {};
    if (s.mt) { asked = true; if ((s.rm || {}).on !== false) linkUser(); return; }
    var later = 0; try { later = +localStorage.getItem('khiffa.rmLater') || 0; } catch (e) {}
    if (Date.now() - later < 864e5) { asked = true; return; } // "لاحقًا" = يسأل تاني بكرة
    if (d.querySelector('.klove')) return; // استني لحد ما رسالة الحب تتقفل
    asked = true; open(true);
  }

  (window.KHIFFA_HOOKS = window.KHIFFA_HOOKS || []).push(function () { card(); paint(); first(); });
  setInterval(function () { card(); first(); }, 1500);
})();
