/* خفّة – quick food search: type what you ate, pick it, done */
(function () {
  'use strict';
  var d = document;
  // [name, portion, kcal, protein, carbs, fat, aliases, img, limitTag]  — typical home/restaurant portions, approximate values
  var COMMON = [
    // سندوتشات وفطار
    ['سندوتش فول', 'رغيف بلدي صغير', 330, 14, 52, 7, 'ساندوتش فول,فول', 'stuffed_flatbread'],
    ['سندوتش طعمية', 'رغيف بلدي صغير', 350, 11, 45, 15, 'فلافل,طعميه,ساندوتش طعمية', 'falafel'],
    ['سندوتش جبنة بيضا', 'رغيف صغير', 280, 12, 35, 10, 'جبنه,ساندوتش جبنة', 'sandwich'],
    ['سندوتش بيض', 'رغيف صغير', 320, 15, 33, 14, 'ساندوتش بيض', 'sandwich', 'egg'],
    ['سندوتش شاورما دجاج', 'متوسط', 450, 28, 45, 17, 'شاورما فراخ,شورما', 'stuffed_flatbread'],
    ['سندوتش شاورما لحم', 'متوسط', 520, 26, 44, 26, 'شاورما لحمة', 'stuffed_flatbread', 'red'],
    ['سندوتش كبدة', 'متوسط', 400, 22, 40, 16, 'كبده اسكندراني', 'stuffed_flatbread', 'liver'],
    ['سندوتش تونة', 'توست', 300, 20, 30, 10, 'ساندوتش تونه', 'sandwich', 'tuna'],
    ['سندوتش حلوم', 'صامولي', 350, 16, 32, 17, 'حلومي', 'sandwich'],
    ['برجر لحم', 'سندوتش', 550, 28, 45, 28, 'برجر,همبرجر', 'sandwich', 'red'],
    ['برجر دجاج', 'سندوتش', 480, 24, 48, 21, 'تشيكن برجر,برجر فراخ', 'sandwich'],
    ['حواوشي', 'رغيف', 550, 25, 45, 30, 'حواوشى', 'stuffed_flatbread', 'red'],
    ['بيتزا', 'شريحة متوسطة', 285, 12, 36, 10, 'بيتزا', 'flatbread'],
    ['فطيرة زعتر', 'قطعة', 280, 6, 35, 13, 'مناقيش,منقوشة', 'flatbread'],
    ['فطيرة جبنة', 'قطعة', 320, 12, 34, 15, 'فطاير', 'flatbread'],
    ['بيضة مسلوقة', 'بيضة', 72, 6.3, 0.4, 4.8, 'بيض مسلوق', 'egg', 'egg'],
    ['بيضة مقلية', 'بيضة', 90, 6.3, 0.4, 7, 'بيض مقلي,بيض عيون', 'cooking', 'egg'],
    ['أومليت', 'بيضتين', 190, 13, 2, 14, 'اومليت,عجة', 'cooking', 'egg'],
    ['شكشوكة', 'طبق بيضتين', 220, 13, 10, 14, 'شكشوكه', 'shallow_pan_of_food', 'egg'],
    ['فول مدمس بالزيت', 'طبق صغير', 200, 11, 30, 5, 'فول', 'beans'],
    ['حمص بطحينة', '٣ ملاعق', 100, 3, 9, 6, 'حمص', 'falafel'],
    ['متبل', '٣ ملاعق', 70, 1, 5, 5, 'بابا غنوج', 'eggplant'],
    ['جبنة بيضا', '٣٠ ج', 80, 5, 1, 6, 'جبنه بيضاء,دمياطي,فيتا', 'cheese_wedge'],
    ['جبنة شيدر', 'شريحة', 110, 7, 0, 9, 'شيدر', 'cheese_wedge'],
    ['جبنة مثلثات', 'قطعة', 45, 2, 1, 4, 'جبنة نستو,كيري', 'cheese_wedge'],
    ['لبنة كاملة الدسم', 'ملعقتين كبار', 100, 4, 3, 8, 'لبنه', 'jar'],
    ['زبادي كامل الدسم', 'علبة', 110, 6, 8, 6, 'زبادي', 'bowl_with_spoon'],
    ['عسل', 'ملعقة صغيرة', 21, 0, 6, 0, 'عسل نحل', 'jar'],
    ['مربى', 'ملعقة كبيرة', 50, 0, 13, 0, 'مربة', 'jar'],
    ['عيش بلدي', 'رغيف', 250, 9, 50, 1.5, 'خبز بلدي,عيش', 'flatbread'],
    ['خبز عربي', 'رغيف كبير', 230, 8, 47, 1, 'خبز,تميس', 'flatbread'],
    ['صامولي', 'قطعة', 160, 5, 30, 2, 'صمولي', 'baguette_bread'],
    ['توست أبيض', 'شريحة', 75, 2.5, 14, 1, 'توست', 'bread'],
    ['كرواسون', 'قطعة سادة', 230, 5, 26, 12, 'كرواسان', 'baguette_bread'],
    ['كورن فليكس بالحليب', 'كوب', 200, 8, 36, 2, 'كورنفليكس,سيريال', 'bowl_with_spoon'],
    ['بان كيك', '٢ قطعة', 350, 8, 50, 12, 'بانكيك', 'pancakes'],
    // مشروبات
    ['قهوة سادة', 'كوب بدون سكر', 5, 0.3, 0, 0, 'قهوه,امريكانو,قهوة تركي,اسبريسو,كوفي', 'hot_beverage'],
    ['قهوة بالسكر', 'كوب بمعلقة سكر', 25, 0.3, 5, 0, 'قهوه بسكر', 'hot_beverage'],
    ['قهوة عربية', 'فنجان', 5, 0, 1, 0, 'قهوة سعودية,قهوه عربي', 'teacup_without_handle'],
    ['نسكافيه باللبن', 'كوب بسكر', 110, 4, 16, 3, 'نسكافيه,نس كافيه', 'hot_beverage'],
    ['لاتيه', 'كوب متوسط', 190, 10, 15, 10, 'لاتيه,قهوة بالحليب', 'hot_beverage'],
    ['كابتشينو', 'كوب متوسط', 120, 6, 10, 6, 'كابتشينو,كابوتشينو', 'hot_beverage'],
    ['آيس لاتيه', 'كوب متوسط', 180, 8, 18, 8, 'ايس كوفي,قهوة مثلجة', 'cup_with_straw'],
    ['شاي', 'كوب بدون سكر', 2, 0, 0, 0, 'شاي اخضر,شاي أحمر', 'teacup_without_handle'],
    ['شاي بالسكر', 'كوب بمعلقتين', 35, 0, 9, 0, 'شاي بسكر', 'teacup_without_handle'],
    ['شاي بالحليب', 'كوب', 70, 2, 9, 2, 'شاي بلبن', 'hot_beverage'],
    ['كرك', 'كوب', 150, 4, 22, 5, 'شاي كرك', 'hot_beverage'],
    ['عصير برتقال فريش', 'كوب', 110, 2, 26, 0.5, 'عصير برتقال', 'cup_with_straw'],
    ['عصير مانجو', 'كوب', 130, 1, 32, 0.5, 'عصير', 'cup_with_straw'],
    ['مشروب غازي', 'علبة', 140, 0, 39, 0, 'بيبسي,كولا,سفن,حاجة ساقعة,مياه غازية', 'cup_with_straw'],
    ['مشروب غازي دايت', 'علبة', 1, 0, 0, 0, 'بيبسي دايت,كولا زيرو', 'cup_with_straw'],
    ['مشروب طاقة', 'علبة', 110, 0, 28, 0, 'ريد بول,طاقة', 'cup_with_straw'],
    ['حليب كامل الدسم', 'كوب', 150, 8, 12, 8, 'لبن,حليب', 'glass_of_milk'],
    ['سموذي فواكه', 'كوب', 180, 3, 40, 1, 'سموذي', 'cup_with_straw'],
    ['بروتين شيك بالماية', 'سكوب', 120, 24, 3, 1.5, 'بروتين,واي', 'cup_with_straw'],
    ['ماية', 'كوب', 0, 0, 0, 0, 'مياه,مويه', 'droplet'],
    // حلويات وسناكات
    ['شوكولاتة', 'لوح صغير ٤٠ ج', 215, 3, 24, 12, 'شيكولاتة,شوكولا,جالكسي,كيت كات', 'chestnut'],
    ['بسكويت', 'قطعتين', 100, 1, 14, 4.5, 'بسكوت', 'rice_cracker'],
    ['كيك', 'شريحة', 350, 4, 50, 15, 'كيكة,تورتة', 'pancakes'],
    ['كنافة', 'قطعة', 400, 6, 50, 20, 'كنافه', 'pancakes'],
    ['بسبوسة', 'قطعة', 300, 4, 45, 12, 'هريسة حلوة', 'pancakes'],
    ['آيس كريم', 'كرة', 140, 2, 16, 7, 'ايس كريم,جيلاتي', 'bowl_with_spoon'],
    ['لقيمات', '٥ حبات', 250, 3, 35, 11, 'لقيمات', 'popcorn'],
    ['معمول', 'قطعة', 150, 2, 20, 7, 'معمول تمر', 'rice_cracker'],
    ['تمر', 'حبة', 23, 0.2, 6, 0, 'تمرة,بلح', 'palm_tree'],
    ['مكسرات مشكلة', 'حفنة ٣٠ ج', 180, 5, 6, 15, 'مكسرات,لوز,كاجو,فول سوداني', 'peanuts'],
    ['شيبس', 'كيس صغير', 150, 2, 15, 10, 'شبس,ليز,تشيبس', 'popcorn'],
    ['فشار سينما', 'علبة وسط', 400, 5, 45, 22, 'فشار', 'popcorn'],
    ['موزة', 'حبة متوسطة', 105, 1.3, 27, 0.4, 'موز', 'banana'],
    ['تفاحة', 'حبة متوسطة', 95, 0.5, 25, 0.3, 'تفاح', 'red_apple'],
    ['برتقالة', 'حبة', 62, 1.2, 15, 0.2, 'برتقال', 'tangerine'],
    // وجبات
    ['كبسة دجاج', 'طبق متوسط', 650, 35, 75, 22, 'كبسه,رز بخاري', 'curry_rice'],
    ['مندي لحم', 'طبق متوسط', 750, 38, 80, 30, 'مندي', 'curry_rice', 'red'],
    ['مندي دجاج', 'طبق متوسط', 650, 38, 75, 20, 'مضغوط', 'curry_rice'],
    ['رز أبيض', 'كوب', 205, 4, 45, 0.4, 'أرز,رز', 'cooked_rice'],
    ['مكرونة بالصلصة', 'طبق', 400, 13, 70, 8, 'مكرونه,باستا,اسباجتي', 'spaghetti'],
    ['مكرونة بشاميل', 'قطعة', 450, 18, 40, 24, 'بشاميل', 'spaghetti', 'red'],
    ['كشري', 'طبق متوسط', 650, 20, 110, 15, 'كشرى', 'steaming_bowl'],
    ['ملوخية', 'طبق بدون رز', 120, 5, 10, 7, 'ملوخيه', 'leafy_green'],
    ['محشي', '٥ صوابع', 250, 5, 40, 8, 'ورق عنب,محشى', 'pot_of_food'],
    ['فراخ مشوية', 'ربع فرخة', 300, 35, 0, 17, 'دجاج مشوي,فراخ', 'poultry_leg'],
    ['فراخ بانيه', 'قطعة', 300, 25, 15, 15, 'بانيه,تشيكن', 'poultry_leg'],
    ['بروستد', '٢ قطعة', 550, 35, 25, 34, 'دجاج مقلي,كنتاكي,البيك', 'poultry_leg'],
    ['سمك مقلي', 'قطعة', 300, 25, 10, 17, 'سمك', 'fish'],
    ['سمك مشوي', 'قطعة ١٥٠ ج', 190, 38, 0, 4, 'سمك', 'fish'],
    ['كفتة', '٣ أصابع', 250, 17, 4, 18, 'كباب,كفته', 'cut_of_meat', 'red'],
    ['ستيك', '١٥٠ ج', 350, 40, 0, 20, 'لحم مشوي', 'cut_of_meat', 'red'],
    ['سلطة خضرا', 'طبق', 40, 2, 8, 0.5, 'سلطه', 'green_salad'],
    ['سلطة سيزر', 'طبق', 350, 15, 15, 26, 'سيزر', 'green_salad'],
    ['تبولة', 'طبق صغير', 130, 2, 12, 9, 'تبوله', 'green_salad'],
    ['فتوش', 'طبق صغير', 150, 3, 15, 9, 'فتوش', 'green_salad'],
    ['شوربة عدس', 'طبق', 180, 10, 28, 3, 'شوربه عدس', 'steaming_bowl'],
    ['شوربة خضار', 'طبق', 90, 3, 15, 2, 'شوربه', 'steaming_bowl'],
    ['بطاطس مقلية', 'وسط', 365, 4, 48, 17, 'فرايز,بطاطس', 'potato'],
    ['مسقعة', 'طبق', 300, 6, 20, 22, 'مسقعه', 'eggplant'],
    ['فتة', 'طبق', 600, 25, 70, 25, 'فته', 'curry_rice', 'red'],
    ['جريش', 'طبق', 300, 10, 45, 9, 'هريس', 'steaming_bowl'],
    ['سمبوسة', 'قطعة', 130, 3, 12, 8, 'سمبوسك', 'rice_cracker'],
    ['فاهيتا دجاج', 'سندوتش', 450, 28, 45, 16, 'فاهيتا', 'stuffed_flatbread'],
    ['سوشي', '٦ قطع', 250, 9, 38, 7, 'سوشى', 'rice_cracker']
  ];

  var norm = function (s) {
    return String(s).toLowerCase().replace(/[ً-ْـ]/g, '').replace(/[أإآ]/g, 'ا').replace(/ة/g, 'ه').replace(/ى/g, 'ي').replace(/ؤ/g, 'و').replace(/ئ/g, 'ي').replace(/\s+/g, ' ').trim();
  };

  var A = window.KHIFFA_APP; if (!A) return;
  var D = A.D;
  var ITEMS = COMMON.map(function (r, i) { return { id: 'c' + i, name: r[0], portion: r[1], n: r[2], p: r[3], c: r[4], f: r[5], key: norm(r[0] + ' ' + (r[6] || '')), img: r[7], tag: r[8] || null }; });
  Object.keys(D.FOODS).forEach(function (k) {
    var f = D.FOODS[k];
    ITEMS.push({ id: 'f-' + k, name: f.name, portion: 'حصة: ' + f.grams + (f.g === 'M' ? ' مل' : ' ج') + (f.unit ? ' (' + f.unit + ')' : ''), n: f.n, p: f.p, c: f.c, f: f.f, key: norm(f.name), img: f.img, tag: f.limit });
  });

  function search(q) {
    q = norm(q); if (!q) return [];
    var words = q.split(' ');
    var scored = [];
    ITEMS.forEach(function (it) {
      var nm = norm(it.name), s = 0;
      if (nm === q) s = 100; else if (nm.indexOf(q) === 0) s = 80; else if (it.key.indexOf(q) >= 0) s = 60;
      else if (words.every(function (w) { return it.key.indexOf(w) >= 0; })) s = 40;
      else if (words.some(function (w) { return w.length > 2 && it.key.indexOf(w) >= 0; })) s = 15;
      if (s) scored.push([s - (it.id.charAt(0) === 'f' ? 5 : 0), it]);
    });
    return scored.sort(function (a, b) { return b[0] - a[0]; }).slice(0, 8).map(function (x) { return x[1]; });
  }

  var css = d.createElement('style');
  css.textContent =
    '.qa{display:flex;flex-direction:column;gap:10px}' +
    '.qa-in{position:relative}' +
    '.qa-in input{width:100%;padding:11px 40px 11px 12px;font-size:15px;border-radius:12px}' +
    '.qa-in svg{position:absolute;right:12px;top:50%;transform:translateY(-50%);width:18px;height:18px;color:var(--muted)}' +
    '.qa-res{display:flex;flex-direction:column;gap:6px}' +
    '.qa-item{display:grid;grid-template-columns:auto 1fr auto;gap:10px;align-items:center;background:var(--bg);border:1px solid var(--line);border-radius:12px;padding:8px 10px;text-align:right;font:inherit;color:inherit;cursor:pointer;width:100%}' +
    '.qa-item:hover,.qa-item.sel{border-color:var(--mint)}' +
    '.qa-item .nm{font-weight:600;font-size:14px}' +
    '.qa-item .sub{font-size:12px;color:var(--muted)}' +
    '.qa-item .kc{font-weight:700;color:var(--mint)}' +
    '.qa-qty{display:flex;gap:6px;flex-wrap:wrap;align-items:center}' +
    '.qa-qty button{font:inherit;border:1.5px solid var(--line);background:var(--surface);color:var(--ink);border-radius:10px;padding:5px 12px;cursor:pointer}' +
    '.qa-qty button[aria-pressed="true"]{border-color:var(--mint);background:var(--mint-soft);font-weight:700}' +
    '.qa-log{display:flex;flex-direction:column;gap:4px;border-top:1px solid var(--line);padding-top:8px}' +
    '.qa-row{display:grid;grid-template-columns:auto 1fr auto auto;gap:8px;align-items:center;font-size:13.5px}' +
    '.qa-row .x{border:0;background:none;color:var(--muted);font-size:18px;cursor:pointer;padding:0 6px}';
  d.head.appendChild(css);

  var card = d.createElement('div'); card.className = 'card qa'; card.id = 'quickAdd';
  card.innerHTML = '<h2 style="margin:0">سجّلي أي أكلة أو مشروب</h2>' +
    '<div class="qa-in"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg>' +
    '<input id="qaQ" type="search" placeholder="مثلاً: سندوتش فول، قهوة، موزة" autocomplete="off" enterkeyhint="search"></div>' +
    '<div class="qa-res" id="qaRes"></div><div class="qa-log" id="qaLog" hidden></div>';
  var meals = d.getElementById('meals');
  meals.parentNode.insertBefore(card, meals);

  var $q = d.getElementById('qaQ'), $res = d.getElementById('qaRes'), $log = d.getElementById('qaLog');
  var QTY = [[0.5, 'نص'], [1, 'واحد'], [1.5, 'واحد ونص'], [2, 'اتنين'], [3, '٣']];

  function row(it) {
    var b = d.createElement('button'); b.className = 'qa-item';
    b.innerHTML = A.img(it.img, 'sm') + '<div style="min-width:0"><div class="nm">' + A.esc(it.name) + '</div><div class="sub">' + A.esc(it.portion) + '</div></div><span class="kc num">' + A.ar(it.n, 0) + ' سعرة</span>';
    return b;
  }
  function pick(it) {
    $res.innerHTML = '';
    var sel = row(it); sel.classList.add('sel'); sel.disabled = true; $res.append(sel);
    var q = d.createElement('div'); q.className = 'qa-qty'; var chosen = 1;
    q.innerHTML = '<span class="note">الكمية:</span>' + QTY.map(function (x) { return '<button data-q="' + x[0] + '" aria-pressed="' + (x[0] === 1) + '">' + x[1] + '</button>'; }).join('');
    q.querySelectorAll('button').forEach(function (b) { b.onclick = function () { chosen = +b.dataset.q; q.querySelectorAll('button').forEach(function (x) { x.setAttribute('aria-pressed', x === b); }); add.textContent = 'أضيفي (' + A.ar(Math.round(it.n * chosen), 0) + ' سعرة)'; }; });
    $res.append(q);
    var act = d.createElement('div'); act.className = 'mact';
    var add = d.createElement('button'); add.className = 'btn'; add.textContent = 'أضيفي (' + A.ar(it.n, 0) + ' سعرة)';
    var cancel = d.createElement('button'); cancel.className = 'btn ghost'; cancel.textContent = 'إلغاء';
    add.onclick = function () { save(it, chosen); };
    cancel.onclick = function () { $res.innerHTML = ''; $q.value = ''; };
    act.append(add, cancel); $res.append(act);
  }
  function manual(text) {
    $res.innerHTML = '<div class="qa-item" style="cursor:default;grid-template-columns:1fr"><div><div class="nm">أضيفي «' + A.esc(text) + '» يدوي</div><div class="sub">لو عارفة السعرات تقريباً اكتبيها</div>' +
      '<div class="row" style="margin-top:8px"><input id="qaKc" type="number" inputmode="numeric" placeholder="السعرات" style="width:110px"><button class="btn sm" id="qaMan">أضيفي</button></div></div></div>';
    d.getElementById('qaMan').onclick = function () {
      var kc = parseFloat(d.getElementById('qaKc').value); if (!kc || kc < 0 || kc > 3000) { A.toast('اكتبي السعرات رقم'); return; }
      save({ id: 'manual', name: text, portion: 'إدخال يدوي', n: kc, p: 0, c: 0, f: 0, img: 'fork_and_knife_with_plate', tag: null }, 1);
    };
  }
  function save(it, q) {
    var day = A.dayOf(A.cur); var now = new Date();
    var ex = (day.extras || []).slice();
    ex.push({ id: it.id, name: it.name, portion: it.portion, q: q, n: it.n, p: it.p, c: it.c, f: it.f, img: it.img, tag: it.tag || null, t: String(now.getHours()).padStart(2, '0') + ':' + String(now.getMinutes()).padStart(2, '0') });
    day.extras = ex; A.saveDay(Object.assign({}, day));
    $q.value = ''; $res.innerHTML = '';
    A.toast('اتسجلت: ' + it.name); A.refresh();
  }
  function render(day) {
    var ex = day.extras || [];
    $log.hidden = !ex.length;
    $log.innerHTML = ex.length ? '<div class="eyebrow">اتسجل النهارده برا الوجبات: ' + A.ar(Math.round(ex.reduce(function (s, x) { return s + x.n * (x.q || 1); }, 0)), 0) + ' سعرة</div>' +
      ex.map(function (x, i) { return '<div class="qa-row">' + A.img(x.img || 'fork_and_knife_with_plate', 'sm') + '<span>' + A.esc(x.name) + (x.q !== 1 ? ' × ' + A.ar(x.q) : '') + ' <span class="note">' + (x.t || '') + '</span></span><span class="num note">' + A.ar(Math.round(x.n * (x.q || 1)), 0) + '</span><button class="x" data-i="' + i + '" aria-label="امسحي ' + A.esc(x.name) + '">×</button></div>'; }).join('') : '';
    $log.querySelectorAll('.x').forEach(function (b) { b.onclick = function () { var dd = A.dayOf(A.cur); var e2 = (dd.extras || []).slice(); e2.splice(+b.dataset.i, 1); dd.extras = e2; A.saveDay(Object.assign({}, dd)); A.refresh(); }; });
  }

  var t;
  $q.addEventListener('input', function () {
    clearTimeout(t); t = setTimeout(function () {
      var v = $q.value.trim(); $res.innerHTML = ''; if (!v) return;
      var r = search(v);
      r.forEach(function (it) { var b = row(it); b.onclick = function () { pick(it); }; $res.append(b); });
      var m = d.createElement('button'); m.className = 'btn ghost sm'; m.textContent = r.length ? 'مش لاقية اللي أكلته؟ أضيفيه يدوي' : 'مش موجود، أضيفيه يدوي';
      m.onclick = function () { manual(v); }; $res.append(m);
    }, 150);
  });
  $q.addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); var f = $res.querySelector('.qa-item:not(.sel)'); if (f) f.click(); } });

  (window.KHIFFA_HOOKS = window.KHIFFA_HOOKS || []).push(render);
  A.refresh();
})();
