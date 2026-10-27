/* خفّة – صور حقيقية (أكل وأدوات رياضة، من غير ناس) في الرئيسية والوجبات والأفكار والجسم والتقارير.
   الصور من Unsplash (مجانية للاستخدام التجاري). الـ service worker بيحفظها عشان تظهر من غير نت. */
(function () {
  'use strict';
  var d = document;
  var U = function (id, w) { return 'https://images.unsplash.com/photo-' + id + '?w=' + (w || 560) + '&q=55&auto=format&fit=crop'; };
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
    '.hm-hero::before,.hm-hero::after{height:200px!important}' +
    '.hm-hero.kph-on .hm-main>div:last-child{background:color-mix(in srgb,var(--surface) 90%,transparent);-webkit-backdrop-filter:blur(12px);backdrop-filter:blur(12px);border-radius:18px;padding:12px 14px;box-shadow:0 8px 24px -14px rgba(0,0,0,.35)}' +
    '.hm-hero.kph-on .hm-left{color:var(--ink)}' +
    '.hm-hero.kph-on .hm-ring{background:var(--surface);border-radius:50%;box-shadow:0 10px 30px -12px rgba(0,0,0,.45)}' +
    /* صورة صغيرة لزجاجة الماية */
    '.kthumb{width:44px;height:44px;border-radius:14px;flex:none;background:var(--sky) center/cover}' +
    '.hm-water .kthumb+img,.hm-water .kthumb+.fimg{display:none}' +
    /* كروت الوجبات: صورة فوق والأيقونة الـ3D بتطلع عليها */
    '.kban{height:118px;margin:-16px -16px 0;border-radius:22px 22px 0 0;background:var(--line) center/cover;position:relative}' +
    '.kban::after{content:"";position:absolute;inset:0;border-radius:inherit;background:linear-gradient(180deg,rgba(0,0,0,0) 40%,rgba(0,0,0,.28))}' +
    '.mcard .kban+.mhead .fimg.lg{margin-top:-40px;box-shadow:0 0 0 4px var(--surface),0 8px 18px -8px rgba(0,0,0,.4);position:relative;z-index:1}' +
    '.mcard{overflow:hidden}' +
    /* طبق بنفس المكونات المختارة */
    '.kplate{position:absolute;left:14px;bottom:-26px;width:88px;height:88px;border-radius:50%;z-index:2;background:radial-gradient(circle,#fff 0 58%,#f1f1ec 59% 63%,#fff 64%);box-shadow:0 10px 24px -10px rgba(0,0,0,.5),inset 0 0 0 1px rgba(0,0,0,.05)}' +
    '.kplate .fimg,.kplate img{position:absolute;width:30px!important;height:30px!important;padding:0!important;background:none!important;box-shadow:none!important;margin:0!important;transform:translate(-50%,-50%)}' +
    '.kban.has-plate{overflow:visible}.mcard .kban.has-plate+.mhead{padding-left:96px}' +
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
    if (hero && hero.dataset.kph !== slot()) { hero.dataset.kph = slot(); hero.style.setProperty('--kph', 'url("' + U(P[slot()], 760) + '")'); hero.classList.add('kph-on'); }
    d.querySelectorAll('.hm-water').forEach(function (w) {
      if (w.querySelector('.kthumb')) return;
      var t = d.createElement('i'); t.className = 'kthumb'; t.style.backgroundImage = 'url("' + U(P.water, 200) + '")'; w.insertBefore(t, w.firstChild);
    });
    d.querySelectorAll('#meals .mcard').forEach(function (c, i) {
      var ch = c.querySelector('.chosen'), sig = ch ? ch.textContent : '';
      var old = c.firstElementChild && c.firstElementChild.classList.contains('kban') ? c.firstElementChild : null;
      if (old && old.dataset.sig === sig) return;
      if (old) old.remove();
      var b = ban('', ch ? P[pick(sig)] : (P[MEALS[i]] || P.salad)); b.dataset.sig = sig;
      var icons = ch ? Array.prototype.slice.call(ch.querySelectorAll('.comp .fimg, .comp img')).filter(function (x, j, a) { return !x.closest('.fimg') || x.classList.contains('fimg'); }).slice(0, 6) : [];
      if (icons.length) { // الطبق: أيقونات المكونات المختارة مترتبة على صحن
        var pl = d.createElement('div'); pl.className = 'kplate'; var n = icons.length;
        icons.forEach(function (ic, j) { var k = ic.cloneNode(true), a = j / n * 2 * Math.PI - Math.PI / 2, r = n === 1 ? 0 : 23; k.style.left = (44 + r * Math.cos(a)) + 'px'; k.style.top = (44 + r * Math.sin(a)) + 'px'; pl.appendChild(k); });
        b.appendChild(pl); b.classList.add('has-plate');
      }
      c.insertBefore(b, c.firstChild);
    });
    d.querySelectorAll('.icard').forEach(function (c) {
      if (c.querySelector('.kban')) return;
      var idea = window.KHIFFA_DATA.IDEAS.find(function(i){return i.id===c.dataset.idea;});
      if(idea && idea.image){var banner=d.createElement('div');banner.className='kban';var picture=d.createElement('img');picture.src=idea.image;picture.alt=idea.name;picture.loading='lazy';picture.style.cssText='width:100%;height:100%;object-fit:cover';banner.appendChild(picture);c.insertBefore(banner,c.firstChild);return;}
      c.insertBefore(ban('', P[pick(c.textContent || '')]), c.firstChild);
    });
    var bc = d.querySelector('#v-body > .card');
    if (bc && !bc.querySelector('.kban')) bc.insertBefore(ban('body', P.body, 'كل قياس خطوة نحو هدفك'), bc.firstChild);
    d.querySelectorAll('.rp-score').forEach(function (s) {
      var card = s.closest('.card'); if (!card || card.querySelector('.kban')) return;
      var n = parseInt((s.querySelector('.rp-ring b') || {}).textContent, 10) || 0;
      card.insertBefore(ban('rep', n >= 80 ? P.rTop : n >= 55 ? P.rMid : P.rLow, n >= 80 ? 'أداء ممتاز، استمري على هذا النحو' : n >= 55 ? 'أداء جيد، ويمكن تحسينه' : 'لنبدأ من جديد بخطوة صغيرة'), card.firstChild);
    });
  }
  var q = 0;
  new MutationObserver(function () { if (q) return; q = requestAnimationFrame(function () { q = 0; decorate(); }); }).observe(d.body, { childList: true, subtree: true });
  // تحميل مسبق لكل الصور وقت الفراغ عشان تظهر فوراً لما تتفتح أي صفحة (والـ service worker بيحفظها)
  // Images load on demand; service worker retains previously viewed assets.
  setInterval(decorate, 60000); // الصورة بتتغير مع وقت اليوم
  decorate();
})();

/* رسالة حب لزوجتي: بتظهر كل مرة تفتح التطبيق، ومبتختفيش غير لما تدوس عليها.
   مفعّلة افتراضياً لحساب u2 بس (وهي فاتحة حسابها). لاحقاً كاختيار لأي مستخدم: settings.love = true / false. */
(function () {
  'use strict';
  var d = document;
  var MSG = [
    'أحبكِ اليوم أكثر من الأمس، وأقلَّ من الغد.',
    'أنتِ أجمل ما في أيامي، وأصدقُ دعواتي.',
    'كل خطوةٍ تخطينها نحو صحتكِ فرحةٌ لقلبي.',
    'أنتِ نعمةُ الله عليّ، وأنا فخورٌ بكِ دائمًا.',
    'وجودكِ في حياتي يجعل كل شيءٍ أخفّ وأجمل.',
    'تذكّري دائمًا: أنا معكِ في كل خطوة، وأحبكِ في كل حال.',
    'ابتسامتكِ أجمل ما أراه في يومي.',
    'أنتِ سكني ومودّتي ورحمتي… أحبكِ.',
    'إصراركِ يُلهمني، واستمراركِ يُسعدني.',
    'لو خُيّرتُ ألف مرة، لاخترتكِ في كل مرة.',
    'قلبي معكِ أينما كنتِ، فاعتني بنفسكِ لأجلي.',
    'كل يومٍ معكِ هديةٌ أشكر الله عليها.',
    'اشربي ماءكِ، وتناولي وجبتكِ، وتذكّري أن هناك من يحبكِ كثيرًا.',
    'أنتِ الأجمل في عيني، اليوم وكل يوم.',
    'صحتكِ تهمّني لأنكِ عمري كلّه.',
    'معكِ عرفتُ أن السعادة تفاصيلُ صغيرة… وأنتِ أجملها.',
    'أنتِ وطني الصغير، وبيتي الذي أعود إليه.',
    'حين أراكِ تنسى الدنيا همومها.',
    'أحبكِ كما أنتِ، وأدعمكِ في كل ما تريدين.',
    'يا أجمل صدفة، ويا أحلى قدر.',
    'أنتِ الحلم الذي تحقّق، والدعاء الذي استُجيب.',
    'كلما ابتسمتِ، أشرق يومي.',
    'فخورٌ بكِ أكثر مما تتخيلين.',
    'قلبي اختاركِ، وعقلي يوافقه كل يوم.',
    'أنتِ أول فكرة في صباحي، وآخر دعوة في مسائي.',
    'يكفيني من الدنيا أنكِ فيها.',
    'أحبكِ بكل لغات الحب، وبالصمت أيضًا.',
    'عيناكِ أجمل حكاية قرأتها.',
    'أنتِ رفيقة العمر، وأجمل ما فيه.',
    'لا يكتمل يومي إلا بصوتكِ.',
    'اعتني بقلبكِ، فهو بيتي.',
    'أنتِ قوية وجميلة، ولا شيء يقف أمام عزيمتكِ.',
    'معكِ أصبح للأيام طعمٌ ولون.',
    'حبكِ في قلبي لا يعرف النقصان.',
    'أنتِ أغلى ما أملك.',
    'كل الطرق تؤدي إليكِ.',
    'أحبكِ في الهدوء، وفي الزحام، وفي كل وقت.',
    'أنتِ نصفي الأجمل.',
    'أدعو الله أن يحفظكِ لي، ويجعلكِ لي في الجنة كما في الدنيا.',
    'وجهكِ الصبوح أجمل بداية ليومي.',
    'لو كان الحب كلمات، لكتبتُ اسمكِ ألف مرة.',
    'أنتِ السبب في كل ابتسامة على وجهي.',
    'أنتِ جميلة في كل حالاتكِ.',
    'حبكِ يسكنني، ولا أريد منه شفاءً.',
    'بكِ صار البيت جنة.',
    'أنا معكِ، اليوم وغدًا ودائمًا.',
    'أنتِ قلبي الذي يمشي على الأرض.',
    'أحبكِ… ولا أملّ من قولها.',
    'أنتِ بهجة أيامي وراحة قلبي.',
    'من أجملِ نِعَم الله عليّ أنكِ زوجتي.',
    'تعبكِ اليوم صحةٌ لكِ غدًا… وأنا بجانبكِ.',
    'كل وجبة تلتزمين بها انتصارٌ صغير أفرح به معكِ.',
    'لا تقسي على نفسكِ، أنتِ رائعة كما أنتِ.',
    'أنتِ أحلى من كل الكلام.',
    'حين تبتسمين يبتسم العالم معي.',
    'أنتِ أماني وطمأنينتي.',
    'أحبكِ حبًّا لا تحدّه الكلمات.',
    'عمري يبدأ من عندكِ.',
    'أنتِ نور البيت، ونور قلبي.',
    'اشتقت إليكِ… حتى وأنتِ بجانبي.',
    'في عينيكِ أرى كل ما أحب.',
    'أنتِ رفيقة الدرب، وسند القلب.',
    'قلبي يدقّ باسمكِ.',
    'الله يحفظكِ لي، ويديم ضحكتكِ.',
    'أنتِ الحب الذي لا يتكرر.',
    'معكِ تعلّمتُ معنى الحياة.',
    'كل يوم أكتشف فيكِ سببًا جديدًا لأحبكِ أكثر.',
    'أنتِ حبيبتي اليوم، وغدًا، وبعد مئة عام.',
    'وجودكِ يكفيني عن الدنيا وما فيها.',
    'أنتِ أحلى قرار في حياتي.',
    'أحبكِ يا زوجتي وحبيبتي.',
    'بحبك أكتر من أي حاجة في الدنيا.',
    'إنتِ أحلى حاجة حصلت لي.',
    'يا حبيبتي، إنتِ النور اللي بيضوي أيامي.',
    'كل ما أشوفك أحس إن الدنيا لسه حلوة.',
    'إنتِ مش بس مراتي… إنتِ صاحبتي وروحي.',
    'ربنا يخليكِ ليا ويديم ضحكتك.',
    'يا عمري، إنتِ أجمل ست في الدنيا في عيني.',
    'وحشتيني… حتى لو كنتِ جنبي.',
    'إنتِ قلبي وعقلي وكل حاجة حلوة فيا.',
    'لو لفّيت الدنيا كلها، مش هلاقي زيك.',
    'بحبك وأنا فخور بيكِ قوي.',
    'إنتِ السند والضهر والحب كله.',
    'صباحك ورد يا أحلى حبيبة.',
    'يا ست البنات، إنتِ أجمل وأغلى من كل حاجة.',
    'ضحكتك بتصالحني على الدنيا.',
    'كملي يا بطلة، أنا جنبك وفخور بيكِ.',
    'إنتِ حلم حياتي اللي اتحقق.',
    'يا حتة من قلبي، خلي بالك من نفسك عشاني.',
    'مفيش يوم بيعدي من غير ما أحبك أكتر.',
    'إنتِ أحلى نصيب ربنا كتبهولي.',
    'بحبك على طول، في الحلو وفي الصعب.',
    'إنتِ الأمان والدفا والحب.',
    'يا قلبي، إنتِ الحاجة الوحيدة اللي مستحيل أستغنى عنها.',
    'كل ما تبتسمي، الدنيا بتنور.',
    'إنتِ أجمل كلمة في قاموسي: حبيبتي.',
    'مهما أقول، كلامي قليل عليكِ.',
    'إنتِ روحي اللي ماشية على الأرض.',
    'عيونك أحلى من كل الصور اللي في التطبيق.',
    'اشربي مايتك يا قمر، أنا عايزك دايمًا بصحة وعافية.',
    'يا جميلة، شوية التزام وهتبقي أحلى من كده كمان… ودي صعبة أصلًا!',
    'إنتِ الحب الأول والأخير.',
    'لما بتكوني مبسوطة، أنا ببقى أسعد واحد في الدنيا.',
    'يا أحلى زوجة، ربنا يجمعنا دايمًا على خير.',
    'بحبك قد السما وأكتر.',
    'إنتِ النعمة اللي بحمد ربنا عليها كل يوم.',
    'يا ريت كل الأيام تبقى معاكِ.',
    'قلبي ملكك من أول يوم.',
    'إنتِ مش محتاجة دايت عشان تبقي حلوة… إنتِ حلوة أصلًا، ده عشان صحتك.',
    'خطوة خطوة، وأنا ماسك إيدك.',
    'إنتِ بيتي، مهما كنت فين.',
    'يا ست الكل، إنتِ ست الكل فعلًا.',
    'وجودك في حياتي أحلى هدية.',
    'بحب كل تفاصيلك، حتى اللي إنتِ مش واخدة بالك منها.',
    'كل الحب ليكِ… ومنكِ… وعشانكِ.',
    'إنتِ حبيبتي، ومراتي، وبنتي، وأمي، وكل الناس.',
    'يا عسل، يومك هيبقى حلو زيك.',
    'أنا محظوظ إنك اخترتيني.',
    'قلبي بيضحك لما بيشوفك.',
    'تعالي نكبر سوا ونفضل حبايب.',
    'إنتِ الحتة الحلوة في كل يوم.',
    'بحبك يا أغلى من روحي.',
    'إنتِ القمر اللي منوّر بيتنا.',
    'إنتِ أحلى حكاية في عمري.',
    'ربنا يحفظك ويبارك فيكِ يا نور عيني.',
    'مهما الدنيا تاخدني، قلبي راجعلك.',
    'إنتِ الحب اللي مش بيخلص.'
  ];
  var SHORT = ['يا قمري', 'يا أحلى زوجة', 'يا نور عيني', 'يا عمري', 'يا روحي', 'يا قلبي', 'يا ست البنات', 'يا أغلى الناس', 'يا أجمل حبيبة', 'يا حتة من قلبي', 'يا ضحكة أيامي', 'يا سندي وأماني', 'يا حب عمري', 'يا نور البيت', 'يا جميلة الجميلات'];
  var css = d.createElement('style');
  css.textContent =
    '.klove{position:fixed;inset:0;z-index:9999;display:grid;place-items:center;padding:24px;background:rgba(20,10,14,.45);-webkit-backdrop-filter:blur(6px);backdrop-filter:blur(6px);animation:klf .4s ease both;cursor:pointer}' +
    '.klove .in{max-width:360px;width:100%;background:linear-gradient(160deg,#fff,#fff4f2);border-radius:28px;padding:28px 24px 22px;text-align:center;box-shadow:0 30px 60px -20px rgba(120,20,40,.45);animation:klu .5s cubic-bezier(.2,.9,.3,1.2) both}' +
    '.klove img{width:76px;height:76px;animation:klb 1.6s ease-in-out infinite}' +
    '.klove h3{margin:10px 0 6px;font-size:15px;color:#c2415a;font-weight:700}' +
    '.klove p{margin:0;font-size:20px;line-height:1.8;color:#2a1a1f;font-weight:600}' +
    '.klove .sg{margin-top:14px;font-size:14px;color:#8a5a66}.klove .tp{margin-top:18px;font-size:12px;color:#b08a93}' +
    '@keyframes klf{from{opacity:0}}@keyframes klu{from{transform:translateY(30px) scale(.94);opacity:0}}@keyframes klb{50%{transform:scale(1.12)}}' +
    '.klove.kb{inset:calc(10px + env(safe-area-inset-top,0px)) 12px auto 12px;padding:0;background:none;-webkit-backdrop-filter:none;backdrop-filter:none;display:block}' +
    '.klove.kb .in{max-width:520px;margin:0 auto;padding:12px 16px;border-radius:20px;display:flex;align-items:center;gap:12px;text-align:start;box-shadow:0 14px 30px -12px rgba(120,20,40,.45)}' +
    '.klove.kb img{width:38px;height:38px;flex:none}.klove.kb h3,.klove.kb .sg{display:none}.klove.kb p{font-size:15px;line-height:1.7}.klove.kb .tp{display:none}' +
    '@media (prefers-color-scheme:dark){.klove .in{background:linear-gradient(160deg,#2a1d21,#331f25)}.klove p{color:#fbe9ed}}';
  d.head.appendChild(css);
  var shown = false;
  function want() {
    var A = window.KHIFFA_APP, D = A && A.data; if (!D || !D.me || !D.user) return null;
    if (D.user.id !== D.me.id) return false; // مش لما المالك يفتح حسابها
    var st = A.settings ? A.settings() : {};
    return st.love === true || (st.love !== false && D.me.id === 'u2');
  }
  function show(banner) {
    // بتلف على كل الرسائل بترتيب عشوائي من غير تكرار لحد ما تخلص
    var i, q = []; try { q = JSON.parse(localStorage.getItem('khiffa.loveq') || '[]'); } catch (e) {}
    q = q.filter(function (x) { return x < MSG.length; });
    if (!q.length) { for (var k = 0; k < MSG.length; k++) q.push(k); for (k = q.length - 1; k > 0; k--) { var r = Math.floor(Math.random() * (k + 1)), t = q[k]; q[k] = q[r]; q[r] = t; } }
    i = q.shift(); try { localStorage.setItem('khiffa.loveq', JSON.stringify(q)); } catch (e) {}
    var A = window.KHIFFA_APP, o = d.createElement('div'); o.className = 'klove' + (banner ? ' kb' : ''); o.setAttribute('role', 'dialog'); o.setAttribute('aria-label', 'رسالة حب');
    o.innerHTML = '<div class="in">' + (A.img ? A.img('red_heart') : '') + '<h3>إلى زوجتي وحبيبتي</h3><p>' + MSG[i] + '</p><div class="sg">— زوجكِ المُحب</div><div class="tp">اضغطي في أي مكان للمتابعة</div></div>';
    o.addEventListener('click', function () { o.style.transition = 'opacity .3s'; o.style.opacity = '0'; setTimeout(function () { o.remove(); }, 300); });
    d.body.appendChild(o);
  }
  // سطر رومانسي صغير تحت التحية في الرئيسية
  css.textContent += '.klv{margin-top:4px;font-size:14px;font-weight:600;color:#ffd9e0;text-shadow:0 1px 8px rgba(0,0,0,.35)}.hm-hero:not(.kph-on) .klv{color:#c2415a;text-shadow:none}';
  var sw = SHORT[Math.floor(Math.random() * SHORT.length)], sm = (function () { var s = MSG.filter(function (m) { return m.length < 46; }); return s[Math.floor(Math.random() * s.length)]; })();
  function line() { var h = d.querySelector('.hm-hero .hm-top h2'); if (!h || h.parentNode.querySelector('.klv') || !want()) return; var e = d.createElement('div'); e.className = 'klv'; e.textContent = '❤ ' + sw + '، ' + sm; h.insertAdjacentElement('afterend', e); }
  new MutationObserver(line).observe(d.body, { childList: true, subtree: true });
  var t = setInterval(function () { var w = want(); if (w === null) return; clearInterval(t); if (w && !shown) { shown = true; show(); } }, 400);
  // كل ما تفتح التطبيق تاني (رجعت له بعد ما قفلته)، وكل 30 دقيقة استخدام
  var hid = 0, used = 0;
  function again(banner) { if (want() && !d.querySelector('.klove')) { used = 0; show(banner); } }
  d.addEventListener('visibilitychange', function () { if (d.hidden) hid = Date.now(); else if (hid && Date.now() - hid > 120000) again(); });
  setInterval(function () { if (!d.hidden && shown) { used += 1; if (used >= 30) again(true); } }, 60000);
})();
