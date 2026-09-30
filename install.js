/* خفّة – install helper: one-tap install on Android, guided steps on iPhone */
(function () {
  'use strict';
  var d = document, ua = navigator.userAgent || '';
  var standalone = (window.matchMedia && matchMedia('(display-mode: standalone)').matches) || navigator.standalone === true;
  var isIOS = /iphone|ipad|ipod/i.test(ua) || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1);
  var isAndroid = /android/i.test(ua);
  var inApp = /FBAN|FBAV|Instagram|WhatsApp|Snapchat|TikTok|Line\/|Twitter|MicroMessenger|GSA\//i.test(ua);
  var deferred = window.__bip || null;

  // icons for iPhone home screen + PNG favicon
  var ati = d.querySelector('link[rel="apple-touch-icon"]');
  if (!ati) { ati = d.createElement('link'); ati.rel = 'apple-touch-icon'; d.head.appendChild(ati); }
  ati.href = 'icon-180.png';
  var fav = d.createElement('link'); fav.rel = 'icon'; fav.type = 'image/png'; fav.href = 'icon-192.png'; d.head.appendChild(fav);

  var css = d.createElement('style');
  css.textContent =
    '.inst-card{display:grid;grid-template-columns:auto 1fr;gap:12px;align-items:center;background:var(--mint-soft);border:1px solid var(--mint);border-radius:16px;padding:12px 14px}' +
    '.inst-card img{width:48px;height:48px;border-radius:12px}' +
    '.inst-card b{display:block;font-size:15px}' +
    '.inst-card .note{margin:0}' +
    '.inst-card .row{margin-top:8px}' +
    '.inst-steps{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:12px;counter-reset:s}' +
    '.inst-steps li{display:grid;grid-template-columns:32px 1fr;gap:10px;align-items:center;counter-increment:s;font-size:15px}' +
    '.inst-steps li::before{content:counter(s,arabic-indic);width:32px;height:32px;border-radius:50%;background:var(--mint);color:#fff;display:grid;place-items:center;font-weight:700}' +
    '.inst-ico{display:inline-block;vertical-align:middle;width:22px;height:22px;margin-inline:3px;color:var(--mint)}' +
    '.inst-link{direction:ltr;text-align:left;font-size:13px;background:var(--bg);border:1px solid var(--line);border-radius:10px;padding:8px 10px;word-break:break-all}';
  d.head.appendChild(css);

  var SHARE = '<svg class="inst-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v12"/><path d="M8 7l4-4 4 4"/><path d="M6 11H5a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-8a1 1 0 0 0-1-1h-1"/></svg>';
  var PLUS = '<svg class="inst-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="3" y="3" width="18" height="18" rx="4"/><path d="M12 8v8M8 12h8"/></svg>';
  var DOTS = '<svg class="inst-ico" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="5" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="12" cy="19" r="2"/></svg>';
  var URL_ = location.origin + location.pathname;

  function snoozed() { try { return +localStorage.getItem('khiffa.instSnooze') > Date.now(); } catch (e) { return false; } }
  function snooze() { try { localStorage.setItem('khiffa.instSnooze', Date.now() + 5 * 864e5); } catch (e) {} }

  function openSheet(html) {
    var root = d.getElementById('sheetRoot');
    root.innerHTML = '<div class="sheet-bg"><div class="sheet" role="dialog" aria-modal="true" aria-label="تثبيت خفّة"><div class="sheet-h"><h3>تثبيت خفّة على الموبايل</h3><button class="btn ghost sm" id="instClose">إغلاق</button></div><div class="sheet-b">' + html + '</div></div></div>';
    d.body.style.overflow = 'hidden';
    var close = function () { root.innerHTML = ''; d.body.style.overflow = ''; };
    d.getElementById('instClose').onclick = close;
    root.querySelector('.sheet-bg').onclick = function (e) { if (e.target.classList.contains('sheet-bg')) close(); };
    var cp = d.getElementById('instCopy');
    if (cp) cp.onclick = function () {
      var done = function () { cp.textContent = 'اتنسخ ✓'; };
      if (navigator.clipboard) navigator.clipboard.writeText(URL_).then(done, function () {}); else done();
    };
    return close;
  }

  function guide() {
    var after = '<p class="note" style="margin:0">بعد التثبيت افتحي خفّة من الأيقونة الخضرا على الشاشة، وادخلي برمزك مرة واحدة.</p>';
    if (inApp) {
      return openSheet('<p style="margin:0">الرابط مفتوح جوه تطبيق تاني (واتساب أو إنستجرام مثلاً)، والتثبيت مش بيشتغل من هنا.</p>' +
        '<ol class="inst-steps"><li>انسخي الرابط</li><li>افتحيه في ' + (isIOS ? '<b>Safari</b>' : '<b>Chrome</b>') + '</li><li>ثبّتيه من هناك</li></ol>' +
        '<div class="inst-link">' + URL_ + '</div><button class="btn" id="instCopy">انسخي الرابط</button>');
    }
    if (isIOS) {
      return openSheet('<ol class="inst-steps">' +
        '<li><span>اضغطي زرار المشاركة ' + SHARE + ' تحت في Safari</span></li>' +
        '<li><span>انزلي واختاري <b>إضافة إلى الشاشة الرئيسية</b> ' + PLUS + '</span></li>' +
        '<li><span>اضغطي <b>إضافة</b> فوق على الشمال</span></li></ol>' + after +
        '<p class="note" style="margin:0">لو مش لاقية الاختيار، اتأكدي إن الرابط مفتوح في Safari.</p>');
    }
    return openSheet('<ol class="inst-steps">' +
      '<li><span>اضغطي على القائمة ' + DOTS + ' فوق في Chrome</span></li>' +
      '<li><span>اختاري <b>تثبيت التطبيق</b> أو <b>إضافة إلى الشاشة الرئيسية</b></span></li>' +
      '<li><span>اضغطي <b>تثبيت</b></span></li></ol>' + after);
  }

  function install() {
    if (deferred) {
      deferred.prompt();
      deferred.userChoice.then(function (c) { if (c.outcome === 'accepted') hideAll(); deferred = null; });
    } else guide();
  }

  function card(where, withSnooze) {
    var el = d.createElement('div'); el.className = 'inst-card'; el.setAttribute('data-inst', '1');
    el.innerHTML = '<img src="icon-192.png" alt=""><div style="min-width:0"><b>ثبّتي خفّة على موبايلك</b><p class="note">يفتح زي أي تطبيق، من غير متجر ومن غير مساحة تقريباً.</p>' +
      '<div class="row"><button class="btn sm" data-a="go">تثبيت</button>' + (withSnooze ? '<button class="btn ghost sm" data-a="later">مش دلوقتي</button>' : '') + '</div></div>';
    el.querySelector('[data-a="go"]').onclick = install;
    var l = el.querySelector('[data-a="later"]');
    if (l) l.onclick = function () { snooze(); el.remove(); };
    where(el);
    return el;
  }
  function hideAll() { d.querySelectorAll('[data-inst]').forEach(function (e) { e.remove(); }); }

  if (standalone) return;

  window.addEventListener('beforeinstallprompt', function (e) { e.preventDefault(); deferred = e; });
  window.addEventListener('appinstalled', hideAll);

  // login screen
  var login = d.getElementById('loginForm');
  if (login) card(function (el) { el.style.cssText = 'width:100%;max-width:320px;margin-top:14px;text-align:right'; login.parentNode.insertBefore(el, login.nextSibling); }, false);
  // today screen (only on phones, dismissible)
  var nav = d.querySelector('#v-today .daynav');
  if (nav && (isIOS || isAndroid) && !snoozed()) card(function (el) { nav.parentNode.insertBefore(el, nav); }, true);
  // account card: always available
  var acct = d.getElementById('acct');
  if (acct) { var b = d.createElement('button'); b.className = 'btn'; b.textContent = 'تثبيت التطبيق على الموبايل'; b.style.marginInlineEnd = '8px'; b.setAttribute('data-inst', '1'); b.onclick = install; acct.parentNode.insertBefore(b, acct.nextSibling); }

  if (location.hash === '#install') setTimeout(install, 400);
})();
