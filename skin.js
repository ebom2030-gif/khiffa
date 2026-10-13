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
