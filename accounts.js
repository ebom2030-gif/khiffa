/* خفّة – الحسابات والصلاحيات: دخول باسم المستخدم وكلمة المرور، بطاقة «حسابي»، وإدارة المستخدمين للمالك.
 * يعتمد على: KHIFFA_APP.api / startSession / setToken / logout / me (app.js)، والخادم: login, logout, changePassword, listUsers, saveUser, setPassword. */
(function () {
  'use strict';
  var d = document, A = window.KHIFFA_APP;
  if (!A) return;
  var ROLE = { owner: 'مالك المنصة', admin: 'مدير', dietitian: 'أخصائي تغذية', client: 'مستخدم' };
  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  var ls = {
    get: function (k) { try { var v = localStorage.getItem('khiffa.' + k); return v ? JSON.parse(v) : null; } catch (e) { return null; } },
    set: function (k, v) { try { localStorage.setItem('khiffa.' + k, JSON.stringify(v)); } catch (e) {} }
  };
  var ua = function () { return (navigator.userAgent || '').slice(0, 160); };

  /* ============================ styles ============================ */
  var css = d.createElement('style'); css.id = 'kf-accounts';
  css.textContent =
    /* login fields (match skin.js #pin look) */
    '.ac-field{display:block;width:100%;margin:6px 0 10px}' +
    '#login.kf-login .ac-in{display:block;box-sizing:border-box;width:100%;height:56px;border:1px solid rgba(255,255,255,.35);border-radius:16px;background:rgba(255,255,255,.12);-webkit-backdrop-filter:blur(10px);backdrop-filter:blur(10px);color:#fff;font:inherit;font-size:16px;padding:0 16px;margin:0 0 10px}' +
    '#login.kf-login .ac-in::placeholder{color:rgba(255,255,255,.6)}' +
    '#login.kf-login .ac-in:focus{outline:0;border-color:#fff;background:rgba(255,255,255,.18)}' +
    '#login.kf-login .ac-pass .ac-in{padding-left:72px}' +
    '#login.kf-login .ac-pass .lg-eye{top:12px}' +
    '.ac-in[dir="ltr"]{text-align:right}.ac-in[dir="ltr"]:placeholder-shown{direction:rtl}' +
    '.ac-switch{display:block;margin:12px auto 0;border:0;background:none;color:inherit;opacity:.8;font:inherit;font-size:13px;text-decoration:underline;text-underline-offset:4px;cursor:pointer}' +
    '#login:not(.kf-login) .ac-in{width:100%;margin:6px 0 10px}' +
    '#login:not(.kf-login) .ac-pass{position:relative}#login:not(.kf-login) .lg-eye{position:absolute;left:8px;top:14px;border:0;background:none;color:var(--muted);font:inherit;font-size:12px;cursor:pointer}' +
    '@media (min-width:900px){#login.kf-login .ac-in{background:#F2F3EE;border-color:#E3E6DF;color:#1D2A25}#login.kf-login .ac-in::placeholder{color:#A3ABA6}' +
      '#login.kf-login .ac-in:focus{border-color:#1FA971;background:#fff}.ac-switch{color:#6F7C76}}' +
    /* account card */
    '.ac-me{display:flex;align-items:center;gap:12px;margin:4px 0 12px}' +
    '.ac-av{flex:none;width:48px;height:48px;border-radius:16px;display:grid;place-items:center;background:var(--mint-soft);color:var(--mint);font-weight:700;font-size:20px}' +
    '.ac-me b{display:block;font-size:16px}.ac-me .note{margin:0}' +
    '.ac-badge{display:inline-block;font-size:11.5px;font-weight:600;padding:2px 10px;border-radius:999px;background:var(--mint-soft);color:var(--mint);white-space:nowrap}' +
    '.ac-badge.owner{background:var(--peach-soft);color:var(--peach)}.ac-badge.dietitian{background:#E4F0FF;color:#2F6FB8}' +
    '.ac-badge.off{background:var(--line);color:var(--muted)}' +
    '.ac-det{border:1px solid var(--line);border-radius:16px;padding:0 14px;margin:6px 0 12px}' +
    '.ac-det summary{cursor:pointer;list-style:none;padding:12px 0;font-weight:600;display:flex;justify-content:space-between;align-items:center}.ac-det summary::-webkit-details-marker{display:none}' +
    '.ac-det summary::after{content:"+";color:var(--muted);font-size:18px}.ac-det[open] summary::after{content:"−"}' +
    '.ac-form{display:grid;gap:10px;padding-bottom:14px}' +
    '.ac-form label{display:grid;gap:4px;font-size:13px;color:var(--muted)}' +
    '.ac-form input,.ac-form select{width:100%;height:44px;border-radius:14px;padding:0 12px;font-size:15px}' +
    '.ac-msg{font-size:13px;margin:0;min-height:0}.ac-msg.err{color:var(--bad)}.ac-msg.ok{color:var(--good)}' +
    '#logout.ac-out{width:100%;color:var(--bad);border-color:var(--line)}' +
    /* users admin */
    '.ac-head{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:6px}.ac-head h2{margin:0}' +
    '.ac-sum{display:flex;gap:8px;flex-wrap:wrap;margin:4px 0 12px}' +
    '.ac-list{display:grid;gap:10px}' +
    '.ac-u{display:grid;grid-template-columns:auto 1fr auto;gap:4px 12px;align-items:center;padding:12px;border:1px solid var(--line);border-radius:18px;background:var(--surface)}' +
    '.ac-u.off{opacity:.62}' +
    '.ac-u .ac-av{width:42px;height:42px;border-radius:14px;font-size:17px}' +
    '.ac-u .nm{font-weight:700;display:flex;gap:6px;align-items:center;flex-wrap:wrap}' +
    '.ac-u .meta{font-size:12.5px;color:var(--muted);direction:rtl}.ac-u .meta bdi{direction:ltr}' +
    '.ac-acts{grid-column:1/-1;display:flex;gap:6px;flex-wrap:wrap;margin-top:6px}' +
    '.ac-acts button{font:inherit;font-size:12.5px;border:1px solid var(--line);background:var(--surface);color:var(--ink);border-radius:999px;padding:5px 12px;cursor:pointer}' +
    '.ac-acts button:hover{border-color:var(--mint);color:var(--mint)}.ac-acts button.dng{color:var(--bad)}' +
    '.ac-sw{position:relative;width:44px;height:26px;border-radius:999px;border:0;background:var(--line);cursor:pointer;flex:none;transition:background .2s}' +
    '.ac-sw::after{content:"";position:absolute;top:3px;right:3px;width:20px;height:20px;border-radius:50%;background:#fff;box-shadow:0 1px 3px rgba(0,0,0,.25);transition:transform .2s}' +
    '.ac-sw[aria-checked="true"]{background:var(--mint)}.ac-sw[aria-checked="true"]::after{transform:translateX(-18px)}.ac-sw:disabled{opacity:.4;cursor:default}' +
    '.ac-empty{padding:18px;text-align:center;color:var(--muted);font-size:13px}' +
    /* modal */
    '.ac-modal{position:fixed;inset:0;z-index:60;background:rgba(10,20,16,.5);display:flex;align-items:flex-end;justify-content:center}' +
    '.ac-box{background:var(--surface);color:var(--ink);width:100%;max-width:480px;max-height:92vh;overflow:auto;border-radius:24px 24px 0 0;padding:18px 18px calc(18px + env(safe-area-inset-bottom,0px));box-shadow:0 -10px 40px -10px rgba(0,0,0,.35)}' +
    '@media (min-width:640px){.ac-modal{align-items:center}.ac-box{border-radius:22px}}' +
    '.ac-box h3{margin:0 0 4px;font-size:18px}.ac-box .ac-sub{margin:0 0 14px;font-size:13px;color:var(--muted)}' +
    '.ac-row2{display:grid;grid-template-columns:1fr 1fr;gap:10px}@media (max-width:420px){.ac-row2{grid-template-columns:1fr}}' +
    '.ac-foot{display:flex;gap:8px;justify-content:flex-start;margin-top:4px}.ac-foot .btn{min-width:110px}' +
    '.ac-chk{display:flex!important;align-items:center;gap:8px;grid-template-columns:none!important;color:var(--ink)!important;font-size:14px!important}.ac-chk input{width:20px;height:20px}' +
    '.ac-gen{display:flex;gap:6px}.ac-gen input{flex:1}.ac-gen button{flex:none}';
  d.head.appendChild(css);

  /* ============================ login screen ============================ */
  var legacy = false;
  function loginUI() {
    var form = d.getElementById('loginForm'), pin = d.getElementById('pin');
    if (!form || !pin || d.getElementById('acCreds')) return;
    var pinBox = pin.closest('.lg-pin') || pin;
    var leg = d.createElement('div'); leg.id = 'acLegacy'; leg.hidden = true;
    pinBox.parentNode.insertBefore(leg, pinBox);
    var lbl = form.querySelector('label[for="pin"]'); if (lbl) leg.appendChild(lbl);
    leg.appendChild(pinBox);
    var creds = d.createElement('div'); creds.id = 'acCreds';
    creds.innerHTML =
      '<input id="acUser" class="ac-in" type="text" name="username" dir="ltr" autocomplete="username" autocapitalize="none" autocorrect="off" spellcheck="false" placeholder="رقم الهاتف أو البريد الإلكتروني" aria-label="رقم الهاتف أو البريد الإلكتروني">' +
      '<div class="lg-pin ac-pass"><input id="acPass" class="ac-in" type="password" name="password" dir="ltr" autocomplete="current-password" placeholder="كلمة المرور" aria-label="كلمة المرور">' +
      '<button type="button" class="lg-eye" id="acEye">إظهار</button></div>';
    leg.parentNode.insertBefore(creds, leg);
    var last = ls.get('lastUser'); if (last) d.getElementById('acUser').value = last;
    var pass = d.getElementById('acPass'), eye = d.getElementById('acEye');
    eye.onclick = function () { var sh = pass.type === 'password'; pass.type = sh ? 'text' : 'password'; eye.textContent = sh ? 'إخفاء' : 'إظهار'; pass.focus(); };
    var sw = d.createElement('button'); sw.type = 'button'; sw.className = 'ac-switch'; sw.id = 'acSwitch';
    var btn = form.querySelector('button[type="submit"]');
    (btn && btn.nextSibling ? form.insertBefore(sw, btn.nextSibling) : form.appendChild(sw));
    var setMode = function (on) {
      legacy = on; leg.hidden = !on; creds.hidden = on;
      sw.textContent = on ? 'الدخول باسم المستخدم وكلمة المرور' : 'الدخول برمز (للحسابات القديمة)';
      var err = d.getElementById('loginErr'); if (err) err.hidden = true;
      setTimeout(function () { (on ? pin : (d.getElementById('acUser').value ? pass : d.getElementById('acUser'))).focus(); }, 30);
    };
    sw.onclick = function () { setMode(!legacy); };
    setMode(false);
    var orig = form.onsubmit;
    form.onsubmit = function (e) {
      if (legacy) return orig && orig.call(form, e);
      e.preventDefault();
      var u = d.getElementById('acUser').value.trim(), p = pass.value, err = d.getElementById('loginErr');
      if (!u || !p) { err.textContent = 'يُرجى إدخال الهاتف أو البريد وكلمة المرور'; err.hidden = false; return; }
      err.hidden = true; if (btn) { btn.disabled = true; btn.textContent = 'جارٍ الدخول…'; }
      A.api('login', { username: u, password: p, ua: ua() }).then(function (j) {
        ls.set('lastUser', u); pass.value = '';
        A.startSession(j.token);
      }).catch(function (x) {
        err.textContent = x.message || 'تعذّر الاتصال بالخادم'; err.hidden = false; pass.select();
      }).then(function () { if (btn) { btn.disabled = false; btn.textContent = 'دخول'; } });
    };
  }
  loginUI(); setTimeout(loginUI, 0);
  (window.KHIFFA_LOGOUT_HOOKS = window.KHIFFA_LOGOUT_HOOKS || []).push(function () {
    var p = d.getElementById('acPass'); if (p) p.value = '';
    var pin = d.getElementById('pin'); if (pin) pin.value = '';
    var m = d.querySelector('.ac-modal'); if (m) m.remove();
    usersCache = null;
  });

  /* ============================ helpers ============================ */
  function initial(n) { return esc(String(n || '؟').trim().charAt(0) || '؟'); }
  function badge(role) { return '<span class="ac-badge ' + esc(role) + '">' + esc(ROLE[role] || role) + '</span>'; }
  function when(s) {
    if (!s) return 'لم يسجّل الدخول بعد';
    var t = new Date(String(s).length > 10 ? s : s + 'T00:00:00');
    if (isNaN(t)) return esc(s);
    return 'آخر دخول: ' + t.toLocaleDateString('ar-EG', { day: 'numeric', month: 'short', year: 'numeric' }) + (String(s).length > 10 ? ' · ' + t.toLocaleTimeString('ar-EG', { hour: 'numeric', minute: '2-digit' }) : '');
  }
  function msg(el, text, ok) { el.textContent = text || ''; el.className = 'ac-msg ' + (ok ? 'ok' : 'err'); }
  function busy(btn, on, label) { if (!btn) return; if (on) { btn.dataset.l = btn.textContent; btn.textContent = label || 'جارٍ الحفظ…'; } else btn.textContent = btn.dataset.l || btn.textContent; btn.disabled = on; }
  function genPass() { var c = 'abcdefghjkmnpqrstuvwxyz23456789', s = '', a = new Uint32Array(10); (window.crypto || {}).getRandomValues ? crypto.getRandomValues(a) : a.forEach(function (x, i) { a[i] = Math.random() * 1e9; }); for (var i = 0; i < 10; i++) s += c[a[i] % c.length]; return s; }

  /* ============================ «حسابي» card ============================ */
  function accountCard() {
    var me = A.me, acct = d.getElementById('acct'); if (!me || !acct) return;
    var card = acct.closest('.card'); if (!card) return;
    var h2 = card.querySelector('h2'); if (h2 && h2.textContent !== 'حسابي') h2.textContent = 'حسابي';
    var out = d.getElementById('logout'); if (out) out.classList.add('ac-out');
    var box = d.getElementById('acMe');
    if (!box) {
      box = d.createElement('div'); box.id = 'acMe';
      (h2 ? card.insertBefore(box, h2.nextSibling) : card.insertBefore(box, card.firstChild));
      var det = d.createElement('details'); det.className = 'ac-det'; det.id = 'acPw';
      card.insertBefore(det, out || null);
    }
    var key = me.id + '|' + me.username + '|' + me.hasPassword + '|' + me.name + '|' + me.email + '|' + me.phone;
    if (box.dataset.k === key) return; box.dataset.k = key;
    box.innerHTML = '<div class="ac-me"><div class="ac-av">' + initial(me.name) + '</div><div><b>' + esc(me.name) + '</b>' +
      '<p class="note">' + ((me.phone || me.email || me.username) ? '<bdi dir="ltr">' + esc(me.phone || me.email || me.username) + '</bdi> · ' : '') + badge(me.role) + '</p></div></div>';
    var det2 = d.getElementById('acPw'), first = !me.hasPassword;
    det2.innerHTML = '<summary>' + (first ? 'إنشاء كلمة مرور' : 'تغيير كلمة المرور') + '</summary><form class="ac-form" id="acPwForm" autocomplete="off">' +
      (first ? '<p class="note" style="margin:0">الدخول لهذا الحساب يتم برمز حاليًا. اربط رقم الهاتف أو البريد بكلمة مرور. يقبل حقل كلمة المرور الرموز مثل @، ويتوقف رمز الدخول القديم بعد الحفظ.</p>' : '') +
      (first ? '<label>رقم الهاتف مع رمز الدولة أو البريد الإلكتروني<input name="identity" dir="ltr" autocomplete="username" autocapitalize="none" spellcheck="false" required placeholder="name@example.com" value="' + esc(me.phone || me.email || '') + '"></label>' : '') +
      (!first ? '<label>كلمة المرور الحالية<input name="old" type="password" dir="ltr" autocomplete="current-password"></label>' : '') +
      '<div class="ac-row2"><label>كلمة المرور الجديدة<input name="new" type="password" dir="ltr" autocomplete="new-password" minlength="8"></label>' +
      '<label>تأكيد كلمة المرور<input name="new2" type="password" dir="ltr" autocomplete="new-password"></label></div>' +
      '<p class="ac-msg" id="acPwMsg"></p><div><button class="btn" type="submit">حفظ كلمة المرور</button></div></form>';
    d.getElementById('acPwForm').onsubmit = function (e) {
      e.preventDefault();
      var f = e.target, m = d.getElementById('acPwMsg'), b = f.querySelector('button[type="submit"]');
      var nw = f.new.value, n2 = f.new2.value;
      if (nw.length < 8 || nw.length > 128) return msg(m, 'كلمة المرور من 8 إلى 128 حرفًا، وتقبل الرموز مثل @');
      if (nw !== n2) return msg(m, 'كلمتا المرور غير متطابقتين');
      var body = { newPassword: nw, ua: ua() };
      if (f.old) body.oldPassword = f.old.value;
      if(first){body.identity=f.elements.namedItem('identity').value.trim();body.password=nw;if(!body.identity)return msg(m,'رقم الهاتف أو البريد مطلوب');}
      busy(b, true);
      A.api(first ? 'linkIdentity' : 'changePassword', body).then(function (j) {
        if (j.token) A.setToken(j.token);
        if (j.me) Object.assign(A.me, j.me);
        if (body.identity) ls.set('lastUser', body.identity);
        A.toast('تم حفظ كلمة المرور'); accountCard();
      }).catch(function (x) { msg(m, x.message); }).then(function () { busy(b, false); });
    };
  }

  /* ============================ owner: إدارة المستخدمين ============================ */
  var usersCache = null, loading = false;
  function adminCard() {
    var me = A.me, plan = d.getElementById('v-plan'), card = d.getElementById('acAdmin');
    if (!me || !(me.role === 'owner' || (me.role === 'admin' && me.permissions && me.permissions.users)) || !plan) { if (card) card.remove(); return; }
    if (!card) {
      card = d.createElement('div'); card.className = 'card'; card.id = 'acAdmin';
      card.innerHTML = '<div class="ac-head"><h2>إدارة المستخدمين</h2><button class="btn sm" id="acAdd">+ إضافة مستخدم</button></div>' +
        '<div class="ac-sum" id="acSum"></div><div class="ac-list" id="acList"><div class="ac-empty">جارٍ التحميل…</div></div>';
      var acct = d.getElementById('acct'), accCard = acct && acct.closest('.card');
      if (accCard && accCard.parentNode === plan) plan.insertBefore(card, accCard.nextSibling); else plan.appendChild(card);
      d.getElementById('acAdd').onclick = function () { userModal(null); };
    }
    if (!usersCache && !loading) loadUsers();
  }
  function loadUsers() {
    loading = true;
    return A.api('listUsers', {}).then(function (j) { usersCache = j.users || []; paintUsers(); })
      .catch(function (x) { var l = d.getElementById('acList'); if (l) l.innerHTML = '<div class="ac-empty">' + esc(x.message) + '</div>'; })
      .then(function () { loading = false; });
  }
  function nameOf(id) { var u = (usersCache || []).filter(function (x) { return String(x.id) === String(id); })[0]; return u ? u.name : ''; }
  function paintUsers() {
    var list = d.getElementById('acList'); if (!list || !usersCache) return;
    var me = A.me, us = usersCache.slice().sort(function (a, b) { var o = { owner: 0, admin: 1, dietitian: 2, client: 3 }; return (o[a.role] - o[b.role]) || (a.active === b.active ? 0 : a.active ? -1 : 1); });
    var cnt = function (r) { return usersCache.filter(function (u) { return u.role === r && u.active; }).length; };
    d.getElementById('acSum').innerHTML = '<span class="ac-badge">المستخدمون: ' + cnt('client') + '</span><span class="ac-badge dietitian">الأخصائيون: ' + cnt('dietitian') + '</span>' +
      (usersCache.some(function (u) { return !u.active; }) ? '<span class="ac-badge off">موقوف: ' + usersCache.filter(function (u) { return !u.active; }).length + '</span>' : '');
    if (!us.length) { list.innerHTML = '<div class="ac-empty">لا يوجد مستخدمون بعد</div>'; return; }
    list.innerHTML = us.map(function (u) {
      var self = String(u.id) === String(me.id);
      var identityLabel=u.phone||u.email; var meta = [identityLabel ? '<bdi>'+esc(identityLabel)+'</bdi>' : u.username ? '<bdi>@' + esc(u.username) + '</bdi>' : '<span style="color:var(--warn)">بلا اسم مستخدم</span>'];
      if (u.role === 'client') meta.push(u.coach ? 'الأخصائي: ' + esc(nameOf(u.coach) || u.coach) : 'بلا أخصائي');
      meta.push(u.hasPassword ? when(u.last_login) : 'يدخل برمز قديم');
      return '<div class="ac-u' + (u.active ? '' : ' off') + '" data-id="' + esc(u.id) + '"><div class="ac-av">' + initial(u.name) + '</div>' +
        '<div><div class="nm">' + esc(u.name) + (self ? ' <span class="note">(أنت)</span>' : '') + ' ' + badge(u.role) + (u.active ? '' : ' <span class="ac-badge off">موقوف</span>') + '</div>' +
        '<div class="meta">' + meta.join(' · ') + '</div></div>' +
        '<button class="ac-sw" role="switch" aria-label="الحساب مفعّل" title="' + (u.active ? 'إيقاف الحساب' : 'تفعيل الحساب') + '" aria-checked="' + !!u.active + '" data-a="toggle"' + (self ? ' disabled' : '') + '></button>' +
        '<div class="ac-acts"><button data-a="edit">تعديل</button><button data-a="pw">إعادة تعيين كلمة المرور</button></div></div>';
    }).join('');
    list.querySelectorAll('.ac-u').forEach(function (row) {
      var u = usersCache.filter(function (x) { return String(x.id) === row.dataset.id; })[0];
      row.querySelectorAll('[data-a]').forEach(function (b) {
        b.onclick = function () { if (b.dataset.a === 'edit') userModal(u); else if (b.dataset.a === 'pw') pwModal(u); else toggle(u, b); };
      });
    });
  }
  function toggle(u, b) {
    var on = !u.active;
    if (!on && !confirm('إيقاف حساب «' + u.name + '»؟ لن يتمكن من الدخول حتى يُعاد تفعيله.')) return;
    b.disabled = true;
    A.api('saveUser', { id: u.id, name: u.name, username: u.username, role: u.role, email: u.email, coach: u.coach, active: on })
      .then(function () { A.toast(on ? 'تم تفعيل الحساب' : 'تم إيقاف الحساب'); return loadUsers(); })
      .catch(function (x) { A.toast(x.message); b.disabled = false; });
  }
  function modal(html) {
    var m = d.createElement('div'); m.className = 'ac-modal';
    m.innerHTML = '<div class="ac-box" role="dialog" aria-modal="true">' + html + '</div>';
    d.body.appendChild(m);
    var close = function () { m.remove(); d.removeEventListener('keydown', esc_); };
    var esc_ = function (e) { if (e.key === 'Escape') close(); };
    d.addEventListener('keydown', esc_);
    m.addEventListener('click', function (e) { if (e.target === m) close(); });
    m.querySelectorAll('[data-close]').forEach(function (b) { b.onclick = close; });
    setTimeout(function () { var i = m.querySelector('input'); if (i) i.focus(); }, 40);
    return { el: m, close: close };
  }
  function userModal(u) {
    var isNew = !u, me = A.me, self = u && String(u.id) === String(me.id);
    var coaches = (usersCache || []).filter(function (x) { return x.role === 'dietitian' && x.active; });
    var roleOpts = (self && me.role==='owner' ? ['owner'] : ['client','dietitian','admin']).map(function (r) { return '<option value="' + r + '"' + ((u ? u.role : 'client') === r ? ' selected' : '') + '>' + ROLE[r] + '</option>'; }).join('');
    var m = modal('<h3>' + (isNew ? 'إضافة مستخدم' : 'تعديل المستخدم') + '</h3><p class="ac-sub">' + (isNew ? 'حساب جديد يدخل باسم المستخدم وكلمة المرور.' : 'تعديل بيانات «' + esc(u.name) + '».') + '</p>' +
      '<form class="ac-form" id="acUForm" autocomplete="off">' +
      '<label>الاسم<input name="name" required value="' + esc(u ? u.name : '') + '"></label>' +
      '<div class="ac-row2"><label>اسم المستخدم<input name="username" dir="ltr" autocapitalize="none" spellcheck="false" placeholder="name" value="' + esc(u ? u.username : '') + '"></label>' +
      '<label>الدور<select name="role"' + (self || me.role!=='owner' ? ' disabled' : '') + '>' + roleOpts + '</select></label></div>' +
      '<label>البريد الإلكتروني<input name="email" type="email" dir="ltr" value="' + esc(u ? u.email : '') + '"></label>' +
      '<label id="acCoachL">الأخصائي المتابع<select name="coach"><option value="">— بدون —</option>' + coaches.map(function (c) { return '<option value="' + esc(c.id) + '"' + (u && String(u.coach) === String(c.id) ? ' selected' : '') + '>' + esc(c.name) + '</option>'; }).join('') + '</select></label>' +
      (isNew ? '<label>كلمة المرور الأولية<span class="ac-gen"><input name="password" dir="ltr" autocomplete="new-password" minlength="6" placeholder="٦ أحرف على الأقل"><button type="button" class="btn ghost sm" id="acGen">توليد</button></span></label>' : '') +
      (!isNew && !self ? '<label class="ac-chk"><input type="checkbox" name="active"' + (u.active ? ' checked' : '') + '> الحساب مفعّل</label>' : '') +
      (me.role==='owner' ? '<fieldset><legend>صلاحيات المدير فقط</legend>'+[['users','إدارة حسابات المستخدمين'],['content','إدارة المحتوى العام'],['support','إدارة الدعم'],['clients','الاطلاع على بيانات المتابعة']].map(function(x){return '<label class="ac-chk"><input type="checkbox" name="perm_'+x[0]+'"'+(u&&u.permissions&&u.permissions[x[0]]?' checked':'')+'>'+x[1]+'</label>';}).join('')+'</fieldset>' : '') + '<p class="ac-msg" id="acUMsg"></p>' +
      '<div class="ac-foot"><button class="btn" type="submit">' + (isNew ? 'إضافة' : 'حفظ') + '</button><button class="btn ghost" type="button" data-close>إلغاء</button></div></form>');
    var f = m.el.querySelector('#acUForm'), coachL = m.el.querySelector('#acCoachL');
    var syncCoach = function () { coachL.hidden = f.role.value !== 'client'; };
    f.role.onchange = syncCoach; syncCoach();
    if (!coaches.length) coachL.querySelector('select').insertAdjacentHTML('afterend', '<span class="note">لا يوجد أخصائيو تغذية بعد</span>');
    var g = m.el.querySelector('#acGen'); if (g) g.onclick = function () { f.password.value = genPass(); f.password.type = 'text'; };
    f.onsubmit = function (e) {
      e.preventDefault();
      var mm = m.el.querySelector('#acUMsg'), b = f.querySelector('button[type="submit"]');
      var body = { name: f.name.value.trim(), username: f.username.value.trim().toLowerCase(), role: f.role.value, email: f.email.value.trim(), coach: f.role.value === 'client' ? f.coach.value : '', active: f.active ? f.active.checked : (u ? u.active : true) };
      if (u) body.id = u.id; if(me.role==='owner'){body.permissions={};['users','content','support','clients'].forEach(function(k){body.permissions[k]=f.elements.namedItem('perm_'+k).checked;});}
      if (!body.name) return msg(mm, 'الاسم مطلوب');
      if (body.username && !/^[a-z0-9._-]{3,32}$/.test(body.username)) return msg(mm, 'اسم المستخدم من ٣ إلى ٣٢ حرفًا إنجليزيًا أو رقمًا (ويُسمح بـ . _ -)');
      if(isNew&&!body.username)body.username='user_'+Date.now(); if (isNew) { body.password = f.password.value; if (body.password.length < 6) return msg(mm, 'كلمة المرور الأولية يجب ألا تقل عن ٦ أحرف'); }
      busy(b, true);
      A.api('saveUser', body).then(function () {
        m.close(); A.toast(isNew ? 'تمت إضافة المستخدم' : 'تم حفظ التعديلات');
        if (self) { A.me.name = body.name; A.me.username = body.username; accountCard(); }
        return loadUsers();
      }).catch(function (x) { msg(mm, x.message); busy(b, false); });
    };
  }
  function pwModal(u) {
    var m = modal('<h3>إعادة تعيين كلمة المرور</h3><p class="ac-sub">كلمة مرور جديدة لـ«' + esc(u.name) + '»' + (u.username ? ' (<bdi dir="ltr">@' + esc(u.username) + '</bdi>)' : '') + '. سيُسجَّل خروجه من جميع الأجهزة.</p>' +
      '<form class="ac-form" id="acPForm" autocomplete="off">' +
      (u.username ? '' : '<p class="ac-msg err">لا يوجد اسم مستخدم لهذا الحساب. يُرجى تحديده من «تعديل» أولًا.</p>') +
      '<label>كلمة المرور الجديدة<span class="ac-gen"><input name="password" dir="ltr" autocomplete="new-password" minlength="6"><button type="button" class="btn ghost sm" id="acGen2">توليد</button></span></label>' +
      '<p class="ac-msg" id="acPMsg"></p>' +
      '<div class="ac-foot"><button class="btn" type="submit"' + (u.username ? '' : ' disabled') + '>حفظ</button><button class="btn ghost" type="button" data-close>إلغاء</button></div></form>');
    var f = m.el.querySelector('#acPForm');
    m.el.querySelector('#acGen2').onclick = function () { f.password.value = genPass(); };
    f.onsubmit = function (e) {
      e.preventDefault();
      var mm = m.el.querySelector('#acPMsg'), b = f.querySelector('button[type="submit"]'), pw = f.password.value;
      if (pw.length < 6) return msg(mm, 'كلمة المرور يجب ألا تقل عن ٦ أحرف');
      busy(b, true);
      A.api('setPassword', { id: u.id, password: pw }).then(function () {
        m.close(); A.toast('تم تعيين كلمة المرور الجديدة'); return loadUsers();
      }).catch(function (x) { msg(mm, x.message); busy(b, false); });
    };
  }

  function render() { try { accountCard(); adminCard(); } catch (e) { console.error(e); } }
  (window.KHIFFA_HOOKS = window.KHIFFA_HOOKS || []).push(render);
  render();
})();

