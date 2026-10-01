/* خفّة – visual identity: brand mark, custom food icon set, refined theme */
(function () {
  'use strict';
  var d = document;

  /* ---------- brand mark: a leaf with a peach seed ---------- */
  var MARK = '<svg class="kf-mark" viewBox="0 0 48 48" aria-hidden="true"><rect width="48" height="48" rx="14" fill="var(--kf-deep)"/>' +
    '<path d="M13 34c0-12 8-20 22-21-1 14-9 22-21 22" fill="#fff"/><path d="M14 34L30 18" stroke="var(--kf-deep)" stroke-width="2" stroke-linecap="round"/>' +
    '<circle cx="34" cy="34" r="4" fill="var(--peach)"/></svg>';

  /* ---------- line icons (24 grid, stroke = currentColor) ---------- */
  var P = {
    bread: '<path d="M5 11a4 4 0 0 1 2-7h10a4 4 0 0 1 2 7v8a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1z"/><path d="M9 9v2M12 8v3M15 9v2"/>',
    flatbread: '<ellipse cx="12" cy="12" rx="9" ry="7"/><path d="M8 10h.01M12 9h.01M15 12h.01M10 14h.01"/>',
    rice: '<path d="M3 12h18a9 9 0 0 1-18 0z"/><path d="M7 12c0-3 2-5 5-5s5 2 5 5"/><path d="M10 9h.01M13 8h.01M14 10h.01"/>',
    potato: '<path d="M6 8c2-4 9-5 12-1s1 10-4 11-10-1-10-4 0-4 2-6z"/><path d="M10 10h.01M14 12h.01M11 14h.01"/>',
    pasta: '<path d="M3 13h18a9 7 0 0 1-18 0z"/><path d="M7 13c1-4 2-7 4-8M11 13c0-4 1-6 3-8M15 13c0-3 1-5 3-6"/>',
    bowl: '<path d="M3 11h18a9 8 0 0 1-18 0z"/><path d="M14 11l5-7"/>',
    corn: '<path d="M12 3c3 0 5 4 5 9s-2 9-5 9-5-4-5-9 2-9 5-9z"/><path d="M9 8h6M8 12h8M9 16h6M12 3v18"/>',
    grain: '<path d="M12 21V9"/><path d="M12 9c-3-1-4-3-4-6 3 0 4 2 4 6zM12 9c3-1 4-3 4-6-3 0-4 2-4 6z"/><path d="M12 15c-3-1-4-3-4-5 3 0 4 2 4 5zM12 15c3-1 4-3 4-5-3 0-4 2-4 5z"/>',
    cracker: '<rect x="4" y="4" width="16" height="16" rx="4"/><path d="M9 9h.01M15 9h.01M12 12h.01M9 15h.01M15 15h.01"/>',
    popcorn: '<path d="M6 10l2 11h8l2-11z"/><path d="M6 10a3 3 0 0 1 3-5 3 3 0 0 1 6 0 3 3 0 0 1 3 5"/><path d="M10 10l.5 11M14 10l-.5 11"/>',
    pot: '<path d="M4 10h16v6a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4z"/><path d="M2 10h20M9 6c0-1 1-2 1-3M14 6c0-1 1-2 1-3"/>',
    drumstick: '<path d="M15 4a5 5 0 0 1 5 5c0 4-5 7-8 7l-3 3a2 2 0 1 1-3-2 2 2 0 1 1-1-3l3-3c0-3 3-7 7-7z"/>',
    fish: '<path d="M3 12c3-5 9-6 14-2l4-3v10l-4-3c-5 4-11 3-14-2z"/><path d="M8 11h.01"/>',
    can: '<ellipse cx="12" cy="6" rx="7" ry="2.5"/><path d="M5 6v12c0 1.4 3 2.5 7 2.5s7-1.1 7-2.5V6"/><path d="M5 10c0 1.4 3 2.5 7 2.5s7-1.1 7-2.5"/>',
    shrimp: '<path d="M20 7c-3-3-10-3-13 2s0 10 5 10c3 0 4-2 4-4s-2-3-4-3"/><path d="M7 9l-3-4M20 7l1 4"/>',
    steak: '<path d="M5 9c1-4 7-6 11-4s5 7 2 10-6 4-9 3-5-5-4-9z"/><circle cx="14" cy="11" r="2"/>',
    egg: '<path d="M12 3c4 0 7 6 7 10a7 7 0 0 1-14 0c0-4 3-10 7-10z"/>',
    pan: '<circle cx="10" cy="12" r="7"/><path d="M17 12h5"/><circle cx="10" cy="12" r="2.5"/>',
    cheese: '<path d="M3 15l10-9 8 5v7H3z"/><path d="M3 15h18M8 18h.01M15 15.5h.01"/>',
    jar: '<rect x="6" y="8" width="12" height="13" rx="3"/><path d="M7 4h10v4H7zM9 13h6"/>',
    beans: '<path d="M7 5c3 0 4 3 3 6s-1 7-4 7-4-3-3-6 1-7 4-7z"/><path d="M16 7c3 0 5 3 4 6s-2 6-5 6-4-3-3-6 1-6 4-6z"/>',
    milk: '<path d="M7 3h10l-1 5v12a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1V8z"/><path d="M8 11h8"/>',
    apple: '<path d="M12 7c-2-1-7-1-7 5s3 9 5 9c1 0 1.5-.5 2-.5s1 .5 2 .5c2 0 5-3 5-9s-5-6-7-5z"/><path d="M12 7c0-2 1-3 3-4"/>',
    banana: '<path d="M4 6c0 8 6 13 15 12 1 0 1-1 0-1-6 0-10-4-11-11 0-1-1-1-2-1z"/><path d="M5 5l-1-2"/>',
    citrus: '<circle cx="12" cy="12" r="8"/><path d="M12 4v16M4 12h16M6.3 6.3l11.4 11.4M17.7 6.3L6.3 17.7"/>',
    strawberry: '<path d="M12 7c5 0 7 2 7 5 0 5-4 9-7 9s-7-4-7-9c0-3 2-5 7-5z"/><path d="M9 4l3 3 3-3M10 12h.01M14 12h.01M12 15h.01"/>',
    watermelon: '<path d="M3 9h18a9 9 0 0 1-18 0z"/><path d="M6 9a6 6 0 0 0 12 0M9 12h.01M12 13h.01M15 12h.01"/>',
    grapes: '<circle cx="9" cy="9" r="2.3"/><circle cx="14" cy="9" r="2.3"/><circle cx="11.5" cy="13" r="2.3"/><circle cx="7" cy="13" r="2.3"/><circle cx="16" cy="13" r="2.3"/><circle cx="11.5" cy="17.5" r="2.3"/><path d="M11.5 6V3l3 1"/>',
    date: '<path d="M12 4c3.5 0 5 3.5 5 8s-1.5 8-5 8-5-3.5-5-8 1.5-8 5-8z"/><path d="M12 4V2M10 9c0 3 0 6 1 8"/>',
    pineapple: '<path d="M12 9c3 0 5 3 5 6.5S15 21 12 21s-5-2-5-5.5S9 9 12 9z"/><path d="M12 9V6M9 4l3 2 3-2M9 13l6 4M15 13l-6 4"/>',
    berries: '<circle cx="8" cy="14" r="3.5"/><circle cx="15.5" cy="14" r="3.5"/><circle cx="12" cy="8.5" r="3"/><path d="M12 5.5V3"/>',
    pear: '<path d="M12 5c2 0 3 2 3 4 2 1 4 3 4 6a7 6 0 0 1-14 0c0-3 2-5 4-6 0-2 1-4 3-4z"/><path d="M12 5V2"/>',
    salad: '<path d="M3 12h18a9 8 0 0 1-18 0z"/><path d="M7 12c-1-3 1-6 4-5M12 12c0-4 3-6 6-4M10 10c1-2 3-2 4-1"/>',
    cucumber: '<rect x="3" y="8" width="18" height="8" rx="4" transform="rotate(-30 12 12)"/><path d="M8 13h.01M12 11h.01M15 9.5h.01"/>',
    tomato: '<circle cx="12" cy="13" r="7"/><path d="M9 6l3 2 3-2M12 8V5"/>',
    pepper: '<path d="M9 8c-3 0-4 3-4 6s2 7 5 7c2 0 2-1 2-1s0 1 2 1c3 0 5-4 5-7s-1-6-4-6c-1 0-2 1-3 1s-2-1-3-1z"/><path d="M12 8c0-2 1-4 3-5"/>',
    eggplant: '<path d="M14 6c4 1 6 5 4 9s-7 7-11 5-3-7 0-10 4-5 7-4z"/><path d="M14 6c1-1 2-2 4-2M14 6l2 2"/>',
    broccoli: '<path d="M10 21v-6M14 21v-6M9 21h6"/><path d="M7 15a3 3 0 0 1-1-6 4 4 0 0 1 6-4 4 4 0 0 1 6 4 3 3 0 0 1-1 6z"/>',
    carrot: '<path d="M14 9l-9 12c-1 1-2 0-2-1L14 9a3 3 0 0 1 4 1z"/><path d="M15 8l3-5M16 9l5-2M8 15l2 1M10 12l2 1"/>',
    mushroom: '<path d="M3 12a9 7 0 0 1 18 0z"/><path d="M9 12v6a3 3 0 0 0 6 0v-6"/>',
    leaf: '<path d="M5 19C5 9 11 4 20 4c0 9-5 15-15 15z"/><path d="M5 19L15 9"/>',
    pod: '<path d="M4 16C8 6 16 4 20 5c0 4-4 12-14 13z"/><circle cx="9" cy="13" r="1.3"/><circle cx="12" cy="11" r="1.3"/><circle cx="15" cy="9" r="1.3"/>',
    onion: '<path d="M12 4c-1 3-7 5-7 10a7 7 0 0 0 14 0c0-5-6-7-7-10z"/><path d="M12 4v-1M10 20c-2-3-2-8 2-12M14 20c2-3 2-8-2-12"/>',
    oil: '<path d="M10 3h4v3l2 3v10a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2V9l2-3z"/><path d="M12 13c-1 1.5-1.5 2.5-1.5 3a1.5 1.5 0 0 0 3 0c0-.5-.5-1.5-1.5-3z"/>',
    avocado: '<path d="M12 3c3 0 5 5 6 9s-2 9-6 9-7-5-6-9 3-9 6-9z"/><circle cx="12" cy="14" r="3"/>',
    nut: '<path d="M12 4c4 0 7 4 7 8s-3 8-7 8-7-4-7-8 3-8 7-8z"/><path d="M12 4c-1 3-1 13 0 16"/>',
    olive: '<ellipse cx="11" cy="14" rx="5" ry="6" transform="rotate(-20 11 14)"/><path d="M13 8c1-2 3-4 6-4-1 3-3 4-6 4z"/>',
    butter: '<path d="M3 15l4-6h14v6z"/><path d="M3 15v4h18v-4M7 9V6h14v3"/>',
    wrap: '<path d="M4 18L16 4a5 5 0 0 1 4 4L6 20z"/><path d="M9 13l2 2M12 10l2 2"/>',
    sandwich: '<path d="M3 10L12 4l9 6z"/><path d="M3 10v2h18v-2M4 15h16l-1 3H5z"/><path d="M3 12c2 1 4 1 6 0s4-1 6 0 4 1 6 0"/>',
    plate: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/>',
    coffee: '<path d="M4 9h13v5a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5z"/><path d="M17 10h1a2.5 2.5 0 0 1 0 5h-1M8 3c0 1-1 2 0 3M12 3c0 1-1 2 0 3"/>',
    tea: '<path d="M5 9h12l-1 9a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2z"/><path d="M17 11h1a2 2 0 0 1 0 4h-1.5M11 9V5l3-1"/>',
    juice: '<path d="M6 7h12l-1.5 13a1 1 0 0 1-1 1h-7a1 1 0 0 1-1-1z"/><path d="M14 7l2-5M7 12h10"/>',
    soup: '<path d="M3 11h18a9 8 0 0 1-18 0z"/><path d="M8 7c0-1.5 1-2 1-3.5M12 7c0-1.5 1-2 1-3.5M16 7c0-1.5 1-2 1-3.5"/>',
    cake: '<path d="M4 12h16v8H4z"/><path d="M4 15c2 1 4 1 6 0s4-1 6 0 3 1 4 0M12 12V8M12 5.5a1 1 0 0 1 0 2"/>',
    chocolate: '<rect x="6" y="3" width="12" height="18" rx="2"/><path d="M6 9h12M6 15h12M12 3v18"/>',
    drop: '<path d="M12 3c3 4 6 7 6 11a6 6 0 0 1-12 0c0-4 3-7 6-11z"/>',
    seed: '<ellipse cx="9" cy="10" rx="2.5" ry="3.5"/><ellipse cx="15" cy="9" rx="2.5" ry="3.5"/><ellipse cx="12" cy="16" rx="2.5" ry="3.5"/>'
  };

  // fluent-name → [icon, tone]
  var TONE = { g: 'var(--t-grain)', p: 'var(--t-prot)', m: 'var(--t-dairy)', f: 'var(--t-fruit)', v: 'var(--t-veg)', o: 'var(--t-fat)', d: 'var(--t-drink)', x: 'var(--t-misc)' };
  var MAP = {
    bread: 'bread g', baguette_bread: 'bread g', flatbread: 'flatbread g', cooked_rice: 'rice g', curry_rice: 'plate x', potato: 'potato g', roasted_sweet_potato: 'potato g', spaghetti: 'pasta g',
    bowl_with_spoon: 'bowl m', ear_of_corn: 'corn g', sheaf_of_rice: 'grain g', rice_cracker: 'cracker g', popcorn: 'popcorn g', pot_of_food: 'pot x', pancakes: 'cake x',
    poultry_leg: 'drumstick p', fish: 'fish p', canned_food: 'can p', shrimp: 'shrimp p', cut_of_meat: 'steak p', meat_on_bone: 'steak p', egg: 'egg p', cooking: 'pan p',
    cheese_wedge: 'cheese m', jar: 'jar m', beans: 'beans p', falafel: 'beans p', glass_of_milk: 'milk m',
    red_apple: 'apple f', green_apple: 'apple f', peach: 'apple f', banana: 'banana f', tangerine: 'citrus f', kiwi_fruit: 'citrus f', strawberry: 'strawberry f', watermelon: 'watermelon f', melon: 'watermelon f',
    grapes: 'grapes f', palm_tree: 'date f', mango: 'pear f', pineapple: 'pineapple f', blueberries: 'berries f', cherries: 'berries f', pear: 'pear f',
    green_salad: 'salad v', cucumber: 'cucumber v', tomato: 'tomato v', bell_pepper: 'pepper v', hot_pepper: 'pepper v', eggplant: 'eggplant v', broccoli: 'broccoli v', carrot: 'carrot v',
    mushroom: 'mushroom v', leafy_green: 'leaf v', pea_pod: 'pod v', onion: 'onion v',
    pouring_liquid: 'oil o', avocado: 'avocado o', chestnut: 'nut o', peanuts: 'nut o', olive: 'olive o', seedling: 'seed o', butter: 'butter o',
    stuffed_flatbread: 'wrap x', sandwich: 'sandwich x', shallow_pan_of_food: 'pan x', fork_and_knife_with_plate: 'plate x', steaming_bowl: 'soup x',
    hot_beverage: 'coffee d', teacup_without_handle: 'tea d', cup_with_straw: 'juice d', droplet: 'drop d'
  };
  function icon(name, cls) {
    var m = (MAP[name] || 'plate x').split(' '), path = P[m[0]] || P.plate;
    return '<span class="kf-ico ' + (cls || '') + '" style="--tone:' + TONE[m[1]] + '"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + path + '</svg></span>';
  }
  window.KHIFFA_ICON = icon;

  /* ---------- nav icons ---------- */
  var NAV = {
    home: '<path d="M4 11l8-7 8 7v8a1 1 0 0 1-1 1h-4v-6H9v6H5a1 1 0 0 1-1-1z"/>',
    today: '<rect x="4" y="5" width="16" height="16" rx="3"/><path d="M8 3v4M16 3v4M4 10h16M9 15l2 2 4-4"/>',
    ideas: '<path d="M3 12h18a9 8 0 0 1-18 0z"/><path d="M14 12l5-7"/>',
    body: '<path d="M5 20h14l-1.5-13h-11z"/><path d="M9 7a3 3 0 0 1 6 0M12 12l2-2"/>',
    plan: '<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M9 8h6M9 12h6M9 16h4"/>'
  };
  function decorateNav() {
    d.querySelectorAll('#tabs button').forEach(function (b) {
      if (b.querySelector('svg')) return;
      var p = NAV[b.dataset.v]; if (!p) return;
      var label = b.textContent.trim();
      b.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + p + '</svg><span>' + label + '</span>';
    });
  }

  /* ---------- theme ---------- */
  var css = d.createElement('style');
  css.textContent =
    ':root{--bg:#f3f6f4;--surface:#ffffff;--ink:#13302a;--muted:#5b7169;--line:#e2eae5;--mint:#1f8a66;--mint-soft:#e2f3eb;--peach:#ef8559;--peach-soft:#fdece3;--warn:#c98021;--bad:#c4473b;--good:#1f8a66;' +
      '--kf-deep:#14634a;--kf-grad:linear-gradient(140deg,#1f8a66 0%,#14634a 70%,#0f4f3b 100%);--shadow:0 1px 2px rgba(19,48,42,.05),0 10px 28px -12px rgba(19,48,42,.14);' +
      '--t-grain:#c68a2e;--t-prot:#d9653f;--t-dairy:#3f7fc2;--t-fruit:#cc4f74;--t-veg:#2b8f5f;--t-fat:#8a6b3d;--t-drink:#2a8a9a;--t-misc:#6a5fb0}' +
    '@media (prefers-color-scheme:dark){:root:not([data-theme="light"]){--bg:#0e1714;--surface:#16211d;--ink:#e5efe9;--muted:#93a69d;--line:#24332d;--mint:#4cc596;--mint-soft:#183329;--peach:#f49b74;--peach-soft:#3a251c;--kf-deep:#1d7a5b;--shadow:0 1px 2px rgba(0,0,0,.3),0 10px 28px -14px rgba(0,0,0,.6);' +
      '--t-grain:#e0a955;--t-prot:#f08560;--t-dairy:#71a8e6;--t-fruit:#ea7899;--t-veg:#55c08a;--t-fat:#c19a66;--t-drink:#5cc0cf;--t-misc:#a197e6}}' +
    ':root[data-theme="dark"]{--bg:#0e1714;--surface:#16211d;--ink:#e5efe9;--muted:#93a69d;--line:#24332d;--mint:#4cc596;--mint-soft:#183329;--peach:#f49b74;--peach-soft:#3a251c;--kf-deep:#1d7a5b}' +
    'body{background:var(--bg);-webkit-font-smoothing:antialiased}' +
    '.card{border:0;border-radius:22px;box-shadow:var(--shadow)}' +
    'h2{font-weight:700;letter-spacing:-.005em}' +
    'button.btn{border-radius:999px;padding:10px 18px}button.btn.sm{padding:7px 14px}' +
    'button.ghost{background:var(--surface);border:1px solid var(--line)}' +
    'input,select,textarea{border-radius:14px;background:var(--surface)}' +
    /* header */
    'header{align-items:center}' +
    '.kf-brand{display:flex;align-items:center;gap:10px}.kf-mark{width:40px;height:40px;flex:none}' +
    '.kf-brand .logo{font-size:26px;line-height:1}.kf-brand .logo small{margin-top:2px}' +
    /* signature hero */
    '.hero{background:var(--kf-grad);color:#fff;position:relative;overflow:hidden}' +
    '.hero::after{content:"";position:absolute;inset:auto -40px -60px auto;width:180px;height:180px;border-radius:50%;background:radial-gradient(circle,rgba(255,255,255,.14),transparent 70%)}' +
    '.hero .eyebrow,.hero .sm,.hero .macro{color:rgba(255,255,255,.85)}' +
    '.hero .ring circle:first-child{stroke:rgba(255,255,255,.18)}.hero #ringFg{stroke:#ffd3bf}' +
    '.hero .big{color:#fff}.hero .bar{background:rgba(255,255,255,.18)}.hero .bar i,.hero .bar.p i,.hero .bar.f i{background:#fff}.hero .bar.p i{background:#ffd3bf}' +
    /* icons */
    '.kf-ico{display:inline-grid;place-items:center;width:40px;height:40px;border-radius:12px;background:color-mix(in srgb,var(--tone) 13%,transparent);color:var(--tone);flex:none}' +
    '.kf-ico svg{width:62%;height:62%}.kf-ico.sm{width:30px;height:30px;border-radius:9px}.kf-ico.lg{width:52px;height:52px;border-radius:16px}' +
    '.collage{grid-template-columns:repeat(2,26px)}.collage .kf-ico{width:26px;height:26px;border-radius:8px}' +
    '.fbtn{border-radius:16px;padding:10px 6px;gap:4px}.fbtn .kf-ico{width:44px;height:44px}' +
    '.fbtn[aria-pressed="true"]{box-shadow:0 0 0 2px var(--mint) inset}' +
    '.icard{border-radius:18px;border:0;background:var(--bg)}.icard.sel{box-shadow:0 0 0 2px var(--mint) inset}' +
    '.chosen{border:0;border-radius:16px}' +
    '.mcard.done{box-shadow:0 0 0 2px var(--mint) inset,var(--shadow)}' +
    '.chk{width:34px;height:34px}' +
    '.slot{border:0;background:var(--bg);padding:2px 9px}' +
    '.stat,.lim,.hm-tile{border:0;background:var(--bg);border-radius:16px}' +
    'body .inst-card{border:0;background:var(--kf-grad);color:#fff}body .inst-card .note{color:rgba(255,255,255,.85)}body .inst-card .btn{background:#fff;color:var(--kf-deep)}body .inst-card .btn.ghost{background:transparent;color:#fff;border-color:rgba(255,255,255,.4)}' +
    /* bottom nav: floating pill */
    'nav.tabs{inset:auto 12px calc(10px + env(safe-area-inset-bottom,0px)) 12px;border:0;border-radius:22px;box-shadow:0 10px 30px -8px rgba(19,48,42,.28);padding:6px;gap:2px;background:var(--surface)}' +
    'nav.tabs button{display:flex;flex-direction:column;align-items:center;gap:2px;padding:7px 2px;border-radius:16px;font-size:11.5px}' +
    'nav.tabs button svg{width:22px;height:22px}' +
    'nav.tabs button[aria-selected="true"]{background:var(--mint-soft);color:var(--mint)}' +
    '.wrap{padding-block:0 112px}' +
    /* login */
    '.login{background:radial-gradient(120% 60% at 50% 0%,var(--mint-soft),var(--bg) 70%)}' +
    '.login .kf-mark{width:84px;height:84px;margin-bottom:6px;filter:drop-shadow(0 12px 24px rgba(20,99,74,.3))}' +
    '.login > img{display:none}' +
    /* desktop refinements */
    '@media (min-width:960px){nav.tabs{inset:16px 16px 16px auto;width:220px;border-radius:24px;padding:96px 12px 12px;flex-direction:column}' +
      'nav.tabs button{flex-direction:row;justify-content:flex-start;gap:12px;padding:12px 16px;font-size:15px}' +
      'nav#tabs::before{content:"";position:absolute;top:26px;right:24px;width:44px;height:44px;border-radius:14px;background:var(--kf-deep) url("data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 48 48%27%3E%3Cpath d=%27M13 34c0-12 8-20 22-21-1 14-9 22-21 22%27 fill=%27%23fff%27/%3E%3Ccircle cx=%2734%27 cy=%2734%27 r=%274%27 fill=%27%23ef8559%27/%3E%3C/svg%3E") center/100% no-repeat}' +
      'nav#tabs::after{content:"خفّة";position:absolute;top:30px;right:80px;font-family:var(--f-display);font-size:26px;font-weight:700;color:var(--mint)}' +
      '.wrap{padding-inline-start:268px;padding-block:0 40px}header .kf-brand{visibility:hidden}}';
  d.head.appendChild(css);

  /* ---------- header + login branding ---------- */
  var logo = d.querySelector('header .logo');
  if (logo && !d.querySelector('.kf-brand')) { var wrap = d.createElement('div'); wrap.className = 'kf-brand'; wrap.innerHTML = MARK; logo.parentNode.insertBefore(wrap, logo); wrap.appendChild(logo); }
  var lg = d.querySelector('.login .logo'); if (lg && !d.querySelector('.login .kf-mark')) lg.insertAdjacentHTML('beforebegin', MARK);
  d.querySelector('meta[name="theme-color"]') && d.querySelector('meta[name="theme-color"]').setAttribute('content', '#14634a');

  decorateNav();
  new MutationObserver(decorateNav).observe(d.getElementById('tabs'), { childList: true });

  /* ---------- wording follows the viewer: feminine by default, masculine for the owner (or by choice) ---------- */
  var M = [['اختاري','اختار'],['سجّلي','سجّل'],['سجلي','سجل'],['ثبّتي','ثبّت'],['ثبّتيه','ثبّته'],['أضيفيه','أضيفه'],['أضيفي','أضف'],['علّمي','علّم'],['ركّبي','ركّب'],['امسحي','امسح'],
    ['اقترحي','اقترح'],['اكتبي','اكتب'],['ادخلي','ادخل'],['افتحيه','افتحه'],['افتحي','افتح'],['انسخي','انسخ'],['اضغطي','اضغط'],['انزلي','انزل'],['عدّيتي','عدّيت'],['خلّصتي','خلّصت'],
    ['ملتزمة','ملتزم'],['نزلتي','نزلت'],['سجلتيش','سجلتش'],['ابدئي','ابدأ'],['لاقية','لاقي'],['كمّلي','كمّل'],['اشتريتيه','اشتريته'],['اخترتيها','اخترتها'],['تقدري','تقدر'],
    ['تختاري','تختار'],['تحطيها','تحطها'],['كُلي','كُل'],['تتخطيش','تتخطاش'],['زودتي','زودت'],['قللي','قلل'],['ضيفي','ضيف'],['راجعيه','راجعه'],['اتأكدي','اتأكد'],['خلّي','خلّي'],
    ['ثبّتيه','ثبّته'],['أكلتيه','أكلته'],['اعمليه','اعمله'],['اطبخيه','اطبخه'],['اكسري','اكسر'],['اخلطي','اخلط'],['انقعي','انقع'],['اخفقي','اخفق'],['عارفة','عارف'],['مش دلوقتي','مش دلوقتي']];
  M.sort(function (a, b) { return b[0].length - a[0].length; });
  var RX = new RegExp('(^|[^؀-ۿ])(' + M.map(function (x) { return x[0]; }).join('|') + ')(?=$|[^؀-ۿ])', 'g');
  var DICT = {}; M.forEach(function (x) { DICT[x[0]] = x[1]; });
  function gender() {
    try { var g = localStorage.getItem('khiffa.gender'); if (g) return JSON.parse(g); } catch (e) {}
    var A = window.KHIFFA_APP; return A && A.data && A.data.me && A.data.me.role === 'owner' ? 'm' : 'f';
  }
  function fix(str) { return str.replace(RX, function (m0, pre, w) { return pre + DICT[w]; }); }
  var busy = false;
  function masculinize(root) {
    if (gender() !== 'm' || busy) return; busy = true;
    var w = d.createTreeWalker(root || d.body, NodeFilter.SHOW_TEXT), n;
    while ((n = w.nextNode())) { var v = n.nodeValue; if (v && /[؀-ۿ]/.test(v)) { var f = fix(v); if (f !== v) n.nodeValue = f; } }
    (root && root.querySelectorAll ? root : d).querySelectorAll('[placeholder],[aria-label],[title]').forEach(function (el) {
      ['placeholder', 'aria-label', 'title'].forEach(function (a) { var v = el.getAttribute(a); if (v) { var f = fix(v); if (f !== v) el.setAttribute(a, f); } });
    });
    busy = false;
  }
  var mo = new MutationObserver(function (list) { if (busy) return; list.forEach(function (r) { r.addedNodes.forEach(function (x) { if (x.nodeType === 1) masculinize(x); else if (x.nodeType === 3 && x.parentNode) masculinize(x.parentNode); }); if (r.type === 'characterData' && r.target.parentNode) masculinize(r.target.parentNode); }); });
  mo.observe(d.body, { childList: true, subtree: true, characterData: true });
  masculinize(d.body);
  // choice in the account card
  var acct = d.getElementById('acct');
  if (acct) {
    var row = d.createElement('div'); row.className = 'filters'; row.style.margin = '10px 0';
    row.innerHTML = '<span class="note">صيغة الكلام:</span><button class="fchip" data-g="f">مؤنث</button><button class="fchip" data-g="m">مذكر</button>';
    acct.parentNode.insertBefore(row, acct.nextSibling);
    var paint = function () { row.querySelectorAll('button').forEach(function (b) { b.setAttribute('aria-pressed', b.dataset.g === gender()); }); };
    row.querySelectorAll('button').forEach(function (b) { b.onclick = function () { try { localStorage.setItem('khiffa.gender', JSON.stringify(b.dataset.g)); } catch (e) {} location.reload(); }; });
    paint(); (window.KHIFFA_HOOKS = window.KHIFFA_HOOKS || []).push(function () { paint(); masculinize(d.body); });
  }
  if (window.KHIFFA_APP && window.KHIFFA_APP.refreshAll) window.KHIFFA_APP.refreshAll();
})();
