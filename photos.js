/* خفّة – صور حقيقية (أكل وأدوات رياضة، من غير ناس) في الرئيسية والوجبات والأفكار والجسم والتقارير.
   الصور من Unsplash (مجانية للاستخدام التجاري). الـ service worker بيحفظها عشان تظهر من غير نت. */
(function () {
  'use strict';
  var d = document;
  var U = function (id, w) { return 'https://images.unsplash.com/photo-' + id + '?w=' + (w || 800) + '&q=70&auto=format&fit=crop'; };
  var P = {
    morning: '1497888329096-51c27beff665', noon: '1605291535065-e1d52d2b264a', night: '1787385629709-fc09b4fb6179',
    b: '1742642415922-0039b8433318', s1: '1490474418585-ba9bad8fd0ea', l: '1670398564097-0762e1b30b3a', s2: '1641494587136-eec74f1944ae', d: '1676300186673-615bcc8d5d68',
    egg: '1551014029-03820d0b88f5', chicken: '1670398564097-0762e1b30b3a', fish: '1539136788836-5699e78bfc75', tuna: '1768326119231-bf064c1b8fdf',
    meat: '1542365887-1149961dccc7', shrimp: '1751641676715-db06bb0f2ad8', salad: '1676300186673-615bcc8d5d68', oats: '1654923064926-be7e64267a31',
    yogurt: '1641494587136-eec74f1944ae', fruit: '1482508809494-03688cd42e7e', sandwich: '1509722747041-616f39b57569', soup: '1643786661490-966f1877effa',
    water: '1598410924570-6e37b6c54fe6', body: '1523901839036-a3030662f220',
    rTop: '1490474418585-ba9bad8fd0ea', rMid: '1605291535065-e1d52d2b264a', rLow: '1562771242-7d077824055a'
  };
  window.KHIFFA_PHOTOS = { P: P, url: U };
  var MEALS = ['b', 's1', 'l', 's2', 'd'];
  // أول كلمة بتطابق في اسم الوجبة/مكوناتها بتحدد الصورة
  var KW = [[/روبيان|جمبري/, 'shrimp'], [/تونة|تونه/, 'tuna'], [/سلمون|سمك|فيليه|بلطي|هامور|سردين/, 'fish'], [/كبدة|لحم|كفتة|ستيك|برجر|لحمة/, 'meat'],
    [/فراخ|دجاج|صدر|شيش/, 'chicken'], [/شوربة|شوربه/, 'soup'], [/شوفان|جرانولا/, 'oats'], [/بيض|أومليت|اومليت|شكشوكة/, 'egg'],
    [/زبادي|لبنة|لبن|جبن قريش/, 'yogurt'], [/سندوتش|ساندويتش|توست|راب|تورتيلا/, 'sandwich'], [/فاكه|تفاح|فراولة|موز|برتقال|تمر|بطيخ/, 'fruit'], [/سلطة|سلطه|خضار/, 'salad']];
  function pick(txt) { for (var i = 0; i < KW.length; i++) if (KW[i][0].test(txt)) return KW[i][1]; return 'salad'; }
  function slot() { var h = new Date().getHours(); return h < 11 ? 'morning' : h < 17 ? 'noon' : 'night'; }

  var css = d.createElement('style'); css.id = 'kf-photos';
  css.textContent =
    /* الرئيسية: صورة حسب وقت اليوم بتسيح في الكارت */
    '.hm-hero{position:relative;overflow:hidden;isolation:isolate}' +
    '.hm-hero::before{content:"";position:absolute;inset:0 0 auto 0;height:250px;z-index:-1;background:linear-gradient(180deg,rgba(8,20,15,.62) 0,rgba(8,20,15,.25) 45%,rgba(8,20,15,0) 62%),var(--kph,none) center 40%/cover}' +
    '.hm-hero::after{content:"";position:absolute;inset:0 0 auto 0;height:250px;z-index:-1;background:linear-gradient(180deg,transparent 45%,var(--surface) 100%)}' +
    '.hm-hero.kph-on{background:var(--surface)}.hm-hero.kph-on .hm-top{min-height:96px;color:#fff}' +
    '.hm-hero.kph-on .hm-top h2{color:#fff;text-shadow:0 1px 10px rgba(0,0,0,.35)}.hm-hero.kph-on .hm-top .eyebrow,.hm-hero.kph-on .hm-top .note{color:rgba(255,255,255,.88)}' +
    '.hm-hero.kph-on .hm-acc{background:rgba(255,255,255,.18);-webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px)}.hm-hero.kph-on .hm-acc button{color:#fff}' +
    '.hm-hero.kph-on .hm-acc button[aria-pressed="true"]{background:#fff;color:var(--ink)}' +
    '.hm-hero.kph-on .hm-ring{background:var(--surface);border-radius:50%;box-shadow:0 10px 30px -12px rgba(0,0,0,.45)}' +
    /* صورة صغيرة لزجاجة الماية */
    '.kthumb{width:44px;height:44px;border-radius:14px;flex:none;background:var(--sky) center/cover}' +
    '.hm-water .kthumb+img,.hm-water .kthumb+.fimg{display:none}' +
    /* كروت الوجبات: صورة فوق والأيقونة الـ3D بتطلع عليها */
    '.kban{height:118px;margin:-16px -16px 0;border-radius:22px 22px 0 0;background:var(--line) center/cover;position:relative}' +
    '.kban::after{content:"";position:absolute;inset:0;border-radius:inherit;background:linear-gradient(180deg,rgba(0,0,0,0) 40%,rgba(0,0,0,.28))}' +
    '.mcard .kban+.mhead .fimg.lg{margin-top:-40px;box-shadow:0 0 0 4px var(--surface),0 8px 18px -8px rgba(0,0,0,.4);position:relative;z-index:1}' +
    '.mcard{overflow:hidden}' +
    /* الوجبات الجاهزة */
    '.icard{overflow:hidden}.icard .kban{grid-column:1/-1;height:104px;margin:-10px -10px 0;border-radius:18px 18px 0 0}' +
    '.icard .kban+.collage{margin-top:-34px;background:var(--surface);border-radius:14px;padding:4px;width:64px;box-shadow:0 6px 14px -8px rgba(0,0,0,.35);position:relative;z-index:1}' +
    /* الجسم والتقارير */
    '.kban.body{height:130px}.kban.rep{height:120px}' +
    '.kban .kcap{position:absolute;inset:auto 14px 12px;color:#fff;font-weight:700;font-size:15px;z-index:1;text-shadow:0 1px 8px rgba(0,0,0,.5)}' +
    '@media (min-width:900px){.kban{height:140px}.icard .kban{height:120px}}';
  d.head.appendChild(css);

  function ban(cls, id, cap) {
    var b = d.createElement('div'); b.className = 'kban ' + (cls || ''); b.setAttribute('aria-hidden', 'true');
    b.style.backgroundImage = 'url("' + U(id) + '")'; if (cap) b.innerHTML = '<span class="kcap">' + cap + '</span>';
    return b;
  }
  function decorate() {
    var hero = d.querySelector('.hm-hero');
    if (hero && hero.dataset.kph !== slot()) { hero.dataset.kph = slot(); hero.style.setProperty('--kph', 'url("' + U(P[slot()], 1080) + '")'); hero.classList.add('kph-on'); }
    d.querySelectorAll('.hm-water').forEach(function (w) {
      if (w.querySelector('.kthumb')) return;
      var t = d.createElement('i'); t.className = 'kthumb'; t.style.backgroundImage = 'url("' + U(P.water, 200) + '")'; w.insertBefore(t, w.firstChild);
    });
    d.querySelectorAll('#meals .mcard').forEach(function (c, i) {
      if (c.firstElementChild && c.firstElementChild.classList.contains('kban')) return;
      c.insertBefore(ban('', P[MEALS[i]] || P.salad), c.firstChild);
    });
    d.querySelectorAll('.icard').forEach(function (c) {
      if (c.querySelector('.kban')) return;
      c.insertBefore(ban('', P[pick(c.textContent || '')]), c.firstChild);
    });
    var bc = d.querySelector('#v-body > .card');
    if (bc && !bc.querySelector('.kban')) bc.insertBefore(ban('body', P.body, 'كل قياس خطوة لقدّام'), bc.firstChild);
    d.querySelectorAll('.rp-score').forEach(function (s) {
      var card = s.closest('.card'); if (!card || card.querySelector('.kban')) return;
      var n = parseInt((s.querySelector('.rp-ring b') || {}).textContent, 10) || 0;
      card.insertBefore(ban('rep', n >= 80 ? P.rTop : n >= 55 ? P.rMid : P.rLow, n >= 80 ? 'شغل ممتاز، كمّلي كده' : n >= 55 ? 'ماشية كويس' : 'يلا نشدّ حيلنا'), card.firstChild);
    });
  }
  var q = 0;
  new MutationObserver(function () { if (q) return; q = requestAnimationFrame(function () { q = 0; decorate(); }); }).observe(d.body, { childList: true, subtree: true });
  setInterval(decorate, 60000); // الصورة بتتغير مع وقت اليوم
  decorate();
})();
