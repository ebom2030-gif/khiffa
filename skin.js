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

  /* ---------- login: real lifestyle photography (Unsplash, free licence), crossfading ---------- */
  var PH = ['photo-1562771242-7d077824055a', 'photo-1494390248081-4e521a5940db', 'photo-1746796751590-a8c0f15d4900', 'photo-1598410924570-6e37b6c54fe6'];
  var phURL = function (id, w) { return 'https://images.unsplash.com/' + id + '?w=' + (w || 1080) + '&q=60&auto=format&fit=crop'; };
  var lcss = d.createElement('style');
  lcss.textContent =
    '#login.kf-login{position:relative;min-height:100dvh;padding:0;gap:0;display:block;text-align:right;color:#fff;background:#0E1A15;overflow:hidden}' +
    '.lg-photos{position:absolute;inset:0}' +
    '.lg-photos div{position:absolute;inset:0;background-size:cover;background-position:center;opacity:0;transform:scale(1.08);transition:opacity 1.6s ease,transform 7s ease-out}' +
    '.lg-photos div.on{opacity:1;transform:scale(1)}' +
    '.lg-shade{position:absolute;inset:0;background:linear-gradient(180deg,rgba(8,16,12,.55) 0%,rgba(8,16,12,0) 22%,rgba(8,16,12,.05) 40%,rgba(8,16,12,.78) 66%,rgba(8,16,12,.95) 100%)}' +
    '.lg-in{position:relative;z-index:2;min-height:100dvh;display:flex;flex-direction:column;padding:calc(22px + env(safe-area-inset-top,0px)) 24px calc(22px + env(safe-area-inset-bottom,0px));box-sizing:border-box;max-width:520px;margin:0 auto}' +
    '.lg-brand{display:flex;align-items:center;gap:10px}' +
    '.lg-brand img{width:38px;height:38px;border-radius:12px}' +
    '.lg-brand .logo-wm{height:34px;width:auto;color:inherit;display:block}' +
    '.lg-brand b{font-size:24px;font-weight:700;letter-spacing:.01em}' +
    '.lg-copy{margin-top:auto}' +
    '.lg-copy h1{margin:0 0 8px;font-size:32px;line-height:1.3;font-weight:700}' +
    '.lg-copy p{margin:0 0 14px;font-size:15px;line-height:1.7;opacity:.85;max-width:380px}' +
    '.lg-dots{display:flex;gap:6px;margin-bottom:20px}.lg-dots i{width:6px;height:6px;border-radius:6px;background:rgba(255,255,255,.4);transition:all .4s}.lg-dots i.on{width:22px;background:#fff}' +
    '#login.kf-login #loginForm{all:unset;display:block}' +
    '#login.kf-login #loginForm label.eyebrow{display:none}' +
    '.lg-pin{position:relative}' +
    '#login.kf-login #pin{display:block;box-sizing:border-box;width:100%;height:58px;border:1px solid rgba(255,255,255,.35)!important;border-radius:16px!important;background:rgba(255,255,255,.12)!important;-webkit-backdrop-filter:blur(10px);backdrop-filter:blur(10px);color:#fff;font-size:24px!important;letter-spacing:.5em!important;text-align:center;margin:0 0 12px!important}' +
    '#login.kf-login #pin::placeholder{color:rgba(255,255,255,.55)}' +
    '#login.kf-login #pin:focus{outline:0;border-color:#fff!important;background:rgba(255,255,255,.18)!important}' +
    '.lg-eye{position:absolute;left:12px;top:14px;border:0;background:none;color:rgba(255,255,255,.75);font:inherit;font-size:13px;cursor:pointer;padding:6px}' +
    '#login.kf-login #loginForm button[type="submit"]{display:block;width:100%;height:58px;border:0;border-radius:16px;background:#fff;color:#0E1A15;font:inherit;font-weight:700;font-size:17px;cursor:pointer}' +
    '#login.kf-login #loginForm button[type="submit"]:active{transform:scale(.98)}' +
    '#login.kf-login .err{color:#FFB9A6;margin:12px 0 0;text-align:center;font-weight:600}' +
    '#login.kf-login [data-inst]{display:none!important}' +
    '.lg-inst{display:block;margin:14px auto 0;border:0;background:none;color:#fff;opacity:.7;font:inherit;font-size:13px;cursor:pointer}' +
    '@media (min-width:900px){' +
      '.lg-in{max-width:none;margin:0;width:44%;min-width:420px;position:absolute;inset:0 auto 0 0;background:#FBFAF7;color:#1D2A25;padding:56px 64px;justify-content:center}' +
      '.lg-shade{background:linear-gradient(90deg,rgba(8,16,12,.15),rgba(8,16,12,.55))}' +
      '.lg-copy{margin-top:40px}.lg-copy p{opacity:1;color:#6F7C76}.lg-dots i{background:#D7DCD6}.lg-dots i.on{background:#1FA971}' +
      '.lg-brand{position:absolute;top:44px;right:64px}' +
      '#login.kf-login #pin{background:#F2F3EE!important;border-color:#E3E6DF!important;color:#1D2A25}#login.kf-login #pin::placeholder{color:#A3ABA6}' +
      '#login.kf-login #pin:focus{border-color:#1FA971!important;background:#fff!important}.lg-eye{color:#6F7C76}' +
      '#login.kf-login #loginForm button[type="submit"]{background:#1FA971;color:#fff}' +
      '.lg-inst{color:#6F7C76}#login.kf-login .err{color:#E5484D}' +
    '}';
  d.head.appendChild(lcss);
  function loginScreen() {
    var L = d.getElementById('login'), form = d.getElementById('loginForm');
    if (!L || !form || L.classList.contains('kf-login')) return;
    L.classList.add('kf-login');
    Array.prototype.slice.call(L.children).forEach(function (c) { if (c !== form && !c.hasAttribute('data-inst')) c.remove(); });
    var ph = d.createElement('div'); ph.className = 'lg-photos';
    var pw = innerWidth > 900 ? 1280 : 820;
    ph.innerHTML = PH.map(function (id, i) { return '<div' + (i ? ' data-bg="' + phURL(id, pw) + '"' : ' class="on" style="background-image:url(' + phURL(id, pw) + ')"') + '></div>'; }).join('');
    setTimeout(function () { ph.querySelectorAll('[data-bg]').forEach(function (x) { x.style.backgroundImage = 'url(' + x.dataset.bg + ')'; }); }, 2500); // الصور التانية بعد ما الأولى تظهر
    var shade = d.createElement('div'); shade.className = 'lg-shade';
    var inn = d.createElement('div'); inn.className = 'lg-in';
    inn.innerHTML = '<div class="lg-brand"><img src="icon-192.png" alt="">' + ((d.querySelector('.logo-wm') || {}).outerHTML || '<b>خفّة</b>') + '</div>' +
      '<div class="lg-copy"><h1>صحتك أسلوب حياة.</h1><p>أكلٌ متوازن، وحركةٌ يومية، وماءٌ كافٍ… وخفّة ترافقك خطوةً بخطوة.</p><div class="lg-dots">' + PH.map(function (x, i) { return '<i' + (i ? '' : ' class="on"') + '></i>'; }).join('') + '</div></div>';
    L.insertBefore(ph, L.firstChild); L.insertBefore(shade, ph.nextSibling); L.insertBefore(inn, shade.nextSibling);
    inn.querySelector('.lg-copy').appendChild(form);
    var pin = d.getElementById('pin'), wrap = d.createElement('div'); wrap.className = 'lg-pin';
    pin.parentNode.insertBefore(wrap, pin); wrap.appendChild(pin); pin.placeholder = 'رمز الدخول';
    pin.addEventListener('input', function () { pin.style.letterSpacing = pin.value ? '' : '0'; }); pin.style.letterSpacing = '0';
    var eye = d.createElement('button'); eye.type = 'button'; eye.className = 'lg-eye'; eye.textContent = 'إظهار';
    eye.onclick = function () { var sh = pin.type === 'password'; pin.type = sh ? 'text' : 'password'; eye.textContent = sh ? 'إخفاء' : 'إظهار'; pin.focus(); };
    wrap.appendChild(eye);
    var btn = form.querySelector('button[type="submit"]'); if (btn) btn.textContent = 'دخول';
    var link = d.createElement('button'); link.type = 'button'; link.className = 'lg-inst'; link.textContent = 'ثبّتي التطبيق على الجوال';
    link.onclick = function () { var b = L.querySelector('[data-inst] [data-a="go"]'); if (b) b.click(); else location.hash = 'install'; };
    form.appendChild(link);
    var k = 0, slides = ph.children, dots = inn.querySelectorAll('.lg-dots i');
    setInterval(function () { if (L.hidden) return; slides[k].classList.remove('on'); dots[k].classList.remove('on'); k = (k + 1) % slides.length; slides[k].classList.add('on'); dots[k].classList.add('on'); }, 6000);
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
