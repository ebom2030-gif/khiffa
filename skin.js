/* خفّة – الهوية البصرية: تطبيق أكل صحي (أخضر فريش + مرجاني، كروت ناعمة، صور الأكل في المقدمة) */
(function () {
  'use strict';
  var d = document, A = window.KHIFFA_APP;
  var css = d.createElement('style'); css.id = 'kf-skin';
  css.textContent =
    ':root{--bg:#F6F6F1;--surface:#FFFFFF;--ink:#1D2A25;--muted:#6F7C76;--line:#ECEEE7;--mint:#1FA971;--mint-soft:#E5F6EE;--peach:#FF7A59;--peach-soft:#FFEDE6;--warn:#F2A33A;--bad:#E5484D;--good:#1FA971;' +
      '--sun:#FFF3D6;--rose:#FFE6E6;--tang:#FFEBDA;--sky:#E4F0FF;--leaf:#E3F6EA;--water:#3C8DE0;' +
      '--f-display:"IBM Plex Sans Arabic",Tahoma,sans-serif;--shadow:0 1px 2px rgba(29,42,37,.04),0 10px 28px -14px rgba(29,42,37,.22)}' +
    '@media (prefers-color-scheme:dark){:root:not([data-theme="light"]){--bg:#0F1513;--surface:#18201D;--ink:#E9F0EC;--muted:#94A39C;--line:#26302C;--mint:#3CCB8D;--mint-soft:#173327;--peach:#FF8F72;--peach-soft:#3A241D;' +
      '--sun:#3A3220;--rose:#3A2426;--tang:#3A2B1F;--sky:#1E2A3A;--leaf:#1C3326;--shadow:0 10px 28px -14px rgba(0,0,0,.6)}}' +
    'body{background:var(--bg);-webkit-font-smoothing:antialiased}' +
    'h2{font-family:var(--f-body);font-weight:700;font-size:18px;letter-spacing:0}' +
    '.logo{font-family:"Reem Kufi",var(--f-body)}' +
    '.card{border:0;border-radius:22px;box-shadow:var(--shadow)}' +
    'button.btn{border-radius:999px;padding:10px 18px;box-shadow:0 6px 14px -8px rgba(31,169,113,.8)}button.btn.sm{padding:7px 14px}' +
    'button.btn.ghost,button.ghost{box-shadow:none;background:var(--surface);border:1px solid var(--line);color:var(--ink)}' +
    'input,select,textarea{border-radius:14px}' +
    '.seg{border-radius:999px}.seg button{border-radius:999px}' +
    '.fchip{border-radius:999px}' +
    /* hero */
    '.hero{background:linear-gradient(150deg,var(--mint-soft),var(--surface) 75%)}' +
    '.hero .bar,.hm-bar{background:var(--line)}' +
    /* meal cards: the food picture leads */
    '.mhead .fimg.lg{width:60px;height:60px;padding:8px;border-radius:20px;background:var(--leaf)}' +
    '#meals .mcard:nth-child(1) .mhead .fimg.lg{background:var(--sun)}#meals .mcard:nth-child(2) .mhead .fimg.lg{background:var(--rose)}' +
    '#meals .mcard:nth-child(3) .mhead .fimg.lg{background:var(--tang)}#meals .mcard:nth-child(4) .mhead .fimg.lg{background:var(--sky)}#meals .mcard:nth-child(5) .mhead .fimg.lg{background:var(--leaf)}' +
    '.mcard.done{box-shadow:0 0 0 2px var(--mint),var(--shadow)}' +
    '.chosen{border:0;border-radius:16px}.comp .fimg.sm{width:30px;height:30px}' +
    '.chk{width:36px;height:36px}' +
    '.slot{border:0;background:var(--bg)}' +
    '.hm-meal .fimg.lg{width:52px;height:52px;padding:6px;border-radius:18px;background:var(--leaf)}' +
    '.hm-meal[data-m="b"] .fimg.lg{background:var(--sun)}.hm-meal[data-m="s1"] .fimg.lg{background:var(--rose)}.hm-meal[data-m="l"] .fimg.lg{background:var(--tang)}.hm-meal[data-m="s2"] .fimg.lg{background:var(--sky)}' +
    '.fbtn{border:0;background:var(--bg);border-radius:16px;box-shadow:inset 0 0 0 1.5px transparent}.fbtn .fimg{width:44px;height:44px}' +
    '.fbtn[aria-pressed="true"]{background:var(--mint-soft);box-shadow:inset 0 0 0 2px var(--mint)}' +
    '.icard{border:0;border-radius:18px}.icard.sel{box-shadow:inset 0 0 0 2px var(--mint)}' +
    '.sheet{border-radius:26px 26px 0 0}.sheet-h{border-bottom:0}' +
    /* water bottles */
    '.cup{border-color:var(--line)}.cup.on{border-color:var(--water)}.cup.on::after{background:var(--water);opacity:.28}' +
    '.hm-water .hm-bar i{background:var(--water)}' +
    /* phone: floating tab bar with food-style icons */
    '@media (max-width:959px){' +
      'nav.tabs{inset:auto 10px calc(10px + env(safe-area-inset-bottom,0px)) 10px;border:0;border-radius:24px;box-shadow:0 12px 30px -12px rgba(29,42,37,.35);padding:4px;background:var(--surface)}' +
      'nav.tabs button{display:flex;flex-direction:column;align-items:center;gap:1px;font-size:11px;padding:6px 2px;border-radius:18px}' +
      'nav.tabs button[aria-selected="true"]{background:var(--mint-soft);color:var(--mint)}' +
      '.wrap{padding-bottom:120px}.toast{bottom:96px}' +
    '}' +
    'nav.tabs .ti{width:24px;height:24px;object-fit:contain;filter:grayscale(.6);opacity:.75}nav.tabs button[aria-selected="true"] .ti{filter:none;opacity:1}' +
    '@media (min-width:960px){nav.tabs button{display:flex;align-items:center;gap:10px}}';
  d.head.appendChild(css);
  d.querySelector('meta[name="theme-color"]') && d.querySelector('meta[name="theme-color"]').setAttribute('content', '#1FA971');

  /* ---------- login: food-app welcome screen ---------- */
  var lcss = d.createElement('style');
  lcss.textContent =
    '#login.kf-login{min-height:100dvh;padding:0;gap:0;justify-content:flex-start;align-items:stretch;background:var(--bg);text-align:right}' +
    '.lg-hero{position:relative;overflow:hidden;background:linear-gradient(160deg,#1FA971 0%,#12865A 60%,#0E6E4A 100%);color:#fff;padding:calc(36px + env(safe-area-inset-top,0px)) 24px 86px;min-height:46vh;display:flex;flex-direction:column;justify-content:flex-end}' +
    '.lg-hero::before{content:"";position:absolute;width:420px;height:420px;border-radius:50%;background:radial-gradient(circle,rgba(255,255,255,.18),transparent 65%);top:-160px;left:-140px}' +
    '.lg-hero::after{content:"";position:absolute;width:300px;height:300px;border-radius:50%;background:radial-gradient(circle,rgba(255,122,89,.35),transparent 70%);bottom:-120px;right:-80px}' +
    '.lg-brand{position:relative;z-index:1;display:flex;align-items:center;gap:12px}' +
    '.lg-brand img{width:56px;height:56px;border-radius:16px;background:#fff;padding:6px;box-shadow:0 8px 20px -8px rgba(0,0,0,.35)}' +
    '.lg-brand .logo{color:#fff;font-size:40px;line-height:1}' +
    '.lg-hero h1{position:relative;z-index:1;margin:18px 0 6px;font-size:26px;line-height:1.35;font-weight:700}' +
    '.lg-hero p{position:relative;z-index:1;margin:0;font-size:15px;opacity:.9;max-width:420px}' +
    '.lg-food{position:absolute;inset:0;pointer-events:none;z-index:0}' +
    '.lg-food img{position:absolute;width:64px;height:64px;filter:drop-shadow(0 10px 14px rgba(0,0,0,.25));animation:lgFloat 6s ease-in-out infinite}' +
    '.lg-food img:nth-child(1){top:7%;left:6%;width:72px;height:72px}.lg-food img:nth-child(2){top:8%;left:42%;animation-delay:-1.5s}' +
    '.lg-food img:nth-child(3){top:30%;left:26%;width:52px;height:52px;animation-delay:-3s}.lg-food img:nth-child(4){top:12%;right:10%;width:56px;height:56px;animation-delay:-2s}' +
    '.lg-food img:nth-child(5){top:24%;left:40%;width:48px;height:48px;animation-delay:-4s}' +
    '@keyframes lgFloat{0%,100%{transform:translateY(0) rotate(-4deg)}50%{transform:translateY(-10px) rotate(4deg)}}' +
    '@media (prefers-reduced-motion:reduce){.lg-food img{animation:none}}' +
    '.lg-panel{position:relative;z-index:2;margin:-56px 16px 0;display:flex;flex-direction:column;align-items:center;gap:14px;padding-bottom:28px}' +
    '#login.kf-login #loginForm{max-width:420px!important;border-radius:26px;padding:24px 22px;box-shadow:0 20px 40px -20px rgba(29,42,37,.35)}' +
    '.lg-title{font-size:20px;font-weight:700;margin:0 0 4px}.lg-sub{font-size:14px;color:var(--muted);margin:0 0 16px}' +
    '#login.kf-login #loginForm label.eyebrow{display:none}' +
    '.lg-pin{position:relative}' +
    '#login.kf-login #pin{height:60px;border-radius:18px!important;border:1.5px solid var(--line)!important;background:var(--bg);font-size:26px!important;letter-spacing:.5em!important;margin:0 0 14px!important;transition:border-color .2s,box-shadow .2s}' +
    '#login.kf-login #pin:focus{outline:0;border-color:var(--mint)!important;box-shadow:0 0 0 4px var(--mint-soft)}' +
    '.lg-eye{position:absolute;left:10px;top:14px;border:0;background:none;color:var(--muted);font:inherit;font-size:13px;cursor:pointer;padding:6px}' +
    '#login.kf-login #loginForm button[type="submit"]{height:54px;font-size:17px;border-radius:18px}' +
    '#login.kf-login .err{color:var(--bad);margin:10px 0 0;text-align:center}' +
    '.lg-feats{display:flex;flex-wrap:wrap;justify-content:center;gap:8px;max-width:420px}' +
    '.lg-feats span{display:inline-flex;align-items:center;gap:6px;background:var(--surface);border-radius:999px;padding:6px 12px 6px 8px;font-size:13px;box-shadow:var(--shadow)}' +
    '.lg-feats img{width:22px;height:22px}' +
    '.lg-foot{font-size:12px;color:var(--muted);margin-top:4px}' +
    '#login.kf-login .inst-card{max-width:420px!important;margin-top:0!important;border-radius:22px}' +
    '@media (min-width:900px){#login.kf-login{flex-direction:row;align-items:stretch}' +
      '.lg-hero{flex:1.1;min-height:100dvh;padding:56px;justify-content:center}.lg-hero h1{font-size:40px}.lg-hero p{font-size:17px}' +
      '.lg-food img{width:96px!important;height:96px!important}' +
      '.lg-panel{flex:.9;margin:0;justify-content:center;padding:40px}}';
  d.head.appendChild(lcss);
  function loginScreen() {
    var L = d.getElementById('login'), form = d.getElementById('loginForm');
    if (!L || !form || L.classList.contains('kf-login') || !A) return;
    L.classList.add('kf-login');
    Array.prototype.slice.call(L.children).forEach(function (c) { if (c !== form && !c.hasAttribute('data-inst')) c.remove(); });
    var u = A.imgURL;
    var hero = d.createElement('div'); hero.className = 'lg-hero';
    hero.innerHTML = '<div class="lg-food">' + ['avocado', 'green_salad', 'strawberry', 'red_apple', 'broccoli'].map(function (n) { return '<img src="' + u(n) + '" alt="">'; }).join('') + '</div>' +
      '<div class="lg-brand"><img src="icon-192.png" alt=""><div class="logo">خفّة</div></div>' +
      '<h1>أكل صحي بطعم حلو،<br>ووزن بينزل بخفّة.</h1><p>نظام البدائل الغذائية، السعرات، الماية، والوزن… كله في مكان واحد وبخطوة واحدة.</p>';
    var panel = d.createElement('div'); panel.className = 'lg-panel';
    L.insertBefore(hero, L.firstChild); L.insertBefore(panel, hero.nextSibling);
    panel.appendChild(form);
    form.insertAdjacentHTML('afterbegin', '<h2 class="lg-title">أهلاً وسهلاً</h2><p class="lg-sub">رمز الدخول بتاعك، وبعدها كل حاجة جاهزة.</p>');
    var pin = d.getElementById('pin'), wrap = d.createElement('div'); wrap.className = 'lg-pin';
    pin.parentNode.insertBefore(wrap, pin); wrap.appendChild(pin);
    var eye = d.createElement('button'); eye.type = 'button'; eye.className = 'lg-eye'; eye.textContent = 'إظهار';
    eye.onclick = function () { var sh = pin.type === 'password'; pin.type = sh ? 'text' : 'password'; eye.textContent = sh ? 'إخفاء' : 'إظهار'; pin.focus(); };
    wrap.appendChild(eye);
    var btn = form.querySelector('button[type="submit"]'); if (btn) btn.textContent = 'دخول';
    panel.insertAdjacentHTML('beforeend', '<div class="lg-feats">' + [['bar_chart', 'تقارير يومية وأسبوعية'], ['fork_and_knife_with_plate', 'وجبات جاهزة بالبدائل'], ['droplet', 'متابعة الماية'], ['mobile_phone', 'باركود المنتجات']].map(function (f) { return '<span><img src="' + u(f[0]) + '" alt="">' + f[1] + '</span>'; }).join('') + '</div><div class="lg-foot">خفّة – من ARKIQO</div>');
    var inst = L.querySelector('[data-inst]'); if (inst) panel.insertBefore(inst, panel.querySelector('.lg-feats'));
  }
  loginScreen(); setTimeout(loginScreen, 0);

  var ICON = { home: 'house', today: 'green_salad', reports: 'bar_chart', ideas: 'fork_and_knife_with_plate', body: 'straight_ruler', plan: 'clipboard' };
  function icons() {
    if (!A) return;
    d.querySelectorAll('#tabs button').forEach(function (b) {
      if (b.querySelector('.ti') || !ICON[b.dataset.v]) return;
      var i = d.createElement('img'); i.className = 'ti'; i.alt = ''; i.src = A.imgURL(ICON[b.dataset.v]); b.insertBefore(i, b.firstChild);
    });
  }
  icons(); setTimeout(icons, 0);
  (window.KHIFFA_HOOKS = window.KHIFFA_HOOKS || []).push(icons);
})();
