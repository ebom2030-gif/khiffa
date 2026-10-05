/* خفّة – التقارير: تقرير يومي وتقرير أسبوعي واقتراحات مبنية على تحليل الأيام والأسابيع */
(function () {
  'use strict';
  var d = document, A = window.KHIFFA_APP; if (!A) return;
  var D = A.D, ar = A.ar, esc = A.esc;
  var dow = function (k) { return new Date(k + 'T12:00:00').getDay(); };
  var DAYN = ['الأحد', 'الاتنين', 'التلات', 'الأربع', 'الخميس', 'الجمعة', 'السبت'];

  var css = d.createElement('style');
  css.textContent =
    '.rp-bar{display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap}' +
    '.rp-nav{display:flex;align-items:center;gap:6px}.rp-nav b{min-width:150px;text-align:center;font-size:14.5px}' +
    '.rp-nav button{width:36px;height:36px;border-radius:50%;border:1px solid var(--line);background:var(--surface);color:var(--ink);font:inherit;font-size:18px;cursor:pointer}' +
    '.rp-nav button:disabled{opacity:.35;cursor:default}' +
    '.rp-score{display:grid;grid-template-columns:auto 1fr;gap:16px;align-items:center}' +
    '.rp-ring{width:104px;height:104px;position:relative}.rp-ring svg{width:100%;height:100%;transform:rotate(-90deg)}' +
    '.rp-ring .c{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center}.rp-ring b{font-size:28px;line-height:1}.rp-ring span{font-size:11.5px;color:var(--muted)}' +
    '.rp-verdict{font-size:17px;font-weight:700;margin-bottom:4px}' +
    '.rp-kv{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px;margin-top:10px}' +
    '.rp-kv div{background:var(--bg);border-radius:12px;padding:8px 10px;font-size:12.5px;color:var(--muted)}.rp-kv b{display:block;font-size:17px;color:var(--ink)}' +
    '.rp-tbl{width:100%;border-collapse:collapse;font-size:13px;table-layout:fixed}.rp-tbl td{overflow-wrap:anywhere}' +
    '.rp-meals th:nth-child(1){width:30%}.rp-meals th:nth-child(3){width:54px}.rp-meals th:nth-child(4){width:26px}' +
    '.rp-days th:nth-child(1){width:30%}.rp-days th:nth-child(6){width:50px}' +
    '.rp-tbl th{font-weight:600;color:var(--muted);font-size:12px;text-align:right;padding:6px 4px;border-bottom:1px solid var(--line)}' +
    '.rp-tbl td{padding:8px 4px;border-bottom:1px solid var(--line);vertical-align:middle}' +
    '.rp-tbl tr:last-child td{border-bottom:0}.rp-tbl .num{white-space:nowrap}' +
    '.rp-tbl tr.click{cursor:pointer}.rp-tbl tr.click:hover td{background:var(--bg)}' +
    '.rp-tbl .fimg{width:26px;height:26px;vertical-align:middle;margin-inline-end:6px}' +
    '.rp-clip{overflow:hidden;min-width:0}.rp-tbl .note{white-space:normal}' +
    '.rp-ok{color:var(--mint);font-weight:700}.rp-no{color:var(--muted)}.rp-hi{color:var(--warn);font-weight:600}' +
    '.rp-pill{display:inline-block;min-width:34px;text-align:center;border-radius:999px;padding:1px 8px;font-size:12px;font-weight:700;color:#fff}' +
    '.rp-sug{display:flex;flex-direction:column;gap:8px}' +
    '.rp-sug div{display:grid;grid-template-columns:auto 1fr;gap:10px;align-items:start;background:var(--bg);border-radius:14px;padding:10px 12px;font-size:14px;line-height:1.6}' +
    '.rp-sug div.w{background:var(--peach-soft)}.rp-sug div.g{background:var(--mint-soft)}' +
    '.rp-sug .fimg{width:28px;height:28px}.rp-sug b{display:block;font-size:14.5px}' +
    '.rp-top{display:flex;flex-wrap:wrap;gap:6px}.rp-top span{display:inline-flex;align-items:center;gap:4px;background:var(--bg);border-radius:999px;padding:3px 10px 3px 6px;font-size:12.5px}.rp-top .fimg{width:20px;height:20px}' +
    '.rp-mbar{display:flex;height:12px;border-radius:8px;overflow:hidden;background:var(--line);margin-top:6px}.rp-mbar i{display:block;height:100%}' +
    '.rp-act{display:flex;gap:8px;flex-wrap:wrap}' +
    '@media print{nav.tabs,header,.rp-act,.rp-nav button{display:none!important}.card{box-shadow:none;border:1px solid #ddd}}';
  d.head.appendChild(css);

  // section + tab (after الرئيسية)
  var sec = d.createElement('section'); sec.className = 'view'; sec.id = 'v-reports'; sec.hidden = true;
  var today = d.getElementById('v-today'); today.parentNode.insertBefore(sec, today.nextSibling);
  var tabs = d.getElementById('tabs');
  var btn = d.createElement('button'); btn.setAttribute('role', 'tab'); btn.dataset.v = 'reports'; btn.setAttribute('aria-selected', 'false'); btn.textContent = 'التقارير';
  var after = tabs.querySelector('button[data-v="today"]'); tabs.insertBefore(btn, after ? after.nextSibling : null);
  btn.onclick = function () {
    d.querySelectorAll('#tabs button').forEach(function (x) { x.setAttribute('aria-selected', x === btn); });
    d.querySelectorAll('section.view').forEach(function (v) { v.hidden = v.id !== 'v-reports'; });
    try { localStorage.setItem('khiffa.tab', '"reports"'); } catch (e) {}
    window.scrollTo(0, 0); render();
  };
  var saved = null; try { saved = JSON.parse(localStorage.getItem('khiffa.tab')); } catch (e) {}
  if (saved === 'reports') setTimeout(function () { btn.click(); }, 0);

  var R = { mode: 'day', day: A.TODAY, week: A.TODAY };

  /* ---------- analysis ---------- */
  function analyzeDay(k) {
    var day = A.dayOf(k), st = A.settings(), LT = A.levelTotals(st.level), out = { k: k, day: day, meals: [], n: 0, p: 0, c: 0, f: 0, done: 0, planned: 0, extrasN: 0, foods: {} };
    D.MEALS.forEach(function (m) {
      var s = A.mealState(day, m.k), comps = A.mealComps(m.k, s), t = A.totals(comps), tgt = A.mealTargetKcal(m.k);
      var idea = s.mode !== 'custom' && s.idea ? D.IDEAS.find(function (x) { return x.id === s.idea; }) : null;
      out.meals.push({ m: m, s: s, comps: comps, t: t, tgt: tgt, title: comps.length ? (s.title || (idea ? A.ideaName(idea) : 'وجبة مخصصة')) : '' });
      if (comps.length) out.planned++;
      if (!s.done) return;
      out.done++; out.n += t.n; out.p += t.p; out.c += t.c; out.f += t.f;
      comps.forEach(function (x) { out.foods[x.food.id] = (out.foods[x.food.id] || 0) + 1; });
    });
    (day.extras || []).forEach(function (x) { var q = x.q || 1; out.n += x.n * q; out.p += (x.p || 0) * q; out.c += (x.c || 0) * q; out.f += (x.f || 0) * q; out.extrasN += x.n * q; });
    out.water = day.water || 0; out.target = st.level; out.LT = LT; out.waterT = st.water;
    out.logged = out.done > 0 || (day.extras || []).length > 0;
    // score: meals 40 · calories close to target 30 · water 15 · protein 15
    var kd = Math.abs(out.n - out.target) / out.target;
    out.score = !out.logged ? 0 : Math.round(40 * out.done / 5 + 30 * Math.max(0, 1 - Math.max(0, kd - 0.05) * 2.5) + 15 * Math.min(1, out.water / out.waterT) + 15 * Math.min(1, out.p / (LT.p * 0.9)));
    return out;
  }
  function weekOf(k) { var back = A.weekKeys(k).length - 1, s = A.addDays(k, -back), a = []; for (var i = 0; i < 7; i++) a.push(A.addDays(s, i)); return a; }
  function analyzeWeek(k) {
    var keys = weekOf(k), days = keys.map(function (x) { return x <= A.TODAY ? analyzeDay(x) : null; }).filter(Boolean), lg = days.filter(function (x) { return x.logged; });
    var avg = function (f, arr) { arr = arr || lg; return arr.length ? arr.reduce(function (s, x) { return s + f(x); }, 0) / arr.length : 0; };
    var W = { keys: keys, days: days, logged: lg, n: avg(function (x) { return x.n; }), p: avg(function (x) { return x.p; }), c: avg(function (x) { return x.c; }), f: avg(function (x) { return x.f; }),
      water: avg(function (x) { return x.water; }, days), extras: avg(function (x) { return x.extrasN; }), score: Math.round(avg(function (x) { return x.score; }, days)),
      adherence: days.length ? Math.round(days.reduce(function (s, x) { return s + x.done; }, 0) / (days.length * 5) * 100) : 0, foods: {}, ideas: {}, veg: {} };
    days.forEach(function (x) {
      Object.keys(x.foods).forEach(function (f) { W.foods[f] = (W.foods[f] || 0) + x.foods[f]; if (D.FOODS[f].g === 'V') W.veg[f] = 1; });
      x.meals.forEach(function (mm) { if (mm.s.done && mm.title && mm.title !== 'وجبة مخصصة') W.ideas[mm.title] = (W.ideas[mm.title] || 0) + 1; });
    });
    W.limits = A.weekCounts(keys[0] > A.TODAY ? A.TODAY : (keys[6] <= A.TODAY ? keys[6] : A.TODAY), false);
    var best = lg.slice().sort(function (a, b) { return b.score - a.score; });
    W.best = best[0]; W.worst = best.length > 1 ? best[best.length - 1] : null;
    var wts = keys.map(function (x) { return A.dayOf(x).weight; }).filter(Boolean); W.w0 = wts[0]; W.w1 = wts[wts.length - 1];
    return W;
  }

  /* ---------- suggestions ---------- */
  function ideasFor(mk, maxK, avoid) {
    var L = A.level()[mk] || {};
    return D.IDEAS.filter(function (i) { return i.m === mk && (!avoid || avoid.indexOf(A.ideaName(i)) < 0); }).map(function (i) {
      var comps = window.KHIFFA_APP.mealComps(mk, { idea: i.id }); return { i: i, t: A.totals(comps) };
    }).filter(function (x) { return !maxK || x.t.n <= maxK; }).sort(function (a, b) { return b.t.p - a.t.p; }).slice(0, 2);
  }
  function daySuggestions(a) {
    var s = [], left = a.target - a.n, h = new Date().getHours(), isToday = a.k === A.TODAY;
    var rest = a.meals.filter(function (mm) { return !mm.s.done; });
    if (!a.logged) { s.push(['', 'memo', 'اليوم ده مفيهوش تسجيل', isToday ? 'سجّلي أول وجبة دلوقتي حتى لو تقريبي. التسجيل أهم من الدقة.' : 'لو فاكرة أكلتي إيه، سجّليه من صفحة اليوم عشان التقرير الأسبوعي يبقى مظبوط.']); return s; }
    if (isToday && rest.length && left > 80) {
      var mk = rest[0].m, per = Math.round(left / rest.length), id = ideasFor(mk.k, per + 60);
      s.push(['g', 'bullseye', 'فاضل ' + ar(Math.round(left), 0) + ' سعرة على ' + ar(rest.length) + (rest.length === 1 ? ' وجبة' : ' وجبات'), 'يعني حوالي ' + ar(per, 0) + ' سعرة للوجبة. ' + (id.length ? 'لـ' + mk.t + ' جرّبي: ' + id.map(function (x) { return A.ideaName(x.i) + ' (' + ar(Math.round(x.t.n), 0) + ')'; }).join(' أو ') + '.' : '')]);
    }
    if (left < -100) {
      var big = a.meals.filter(function (mm) { return mm.s.done; }).sort(function (x, y) { return (y.t.n - y.tgt) - (x.t.n - x.tgt); })[0];
      s.push(['w', 'warning', 'زيادة ' + ar(Math.round(-left), 0) + ' سعرة عن الهدف', (a.extrasN > 100 ? 'أغلبها من الأكل برا الوجبات (' + ar(Math.round(a.extrasN), 0) + ' سعرة). ' : big && big.t.n - big.tgt > 60 ? 'أكبر زيادة كانت في ' + big.m.t + ' (' + ar(Math.round(big.t.n), 0) + ' بدل حوالي ' + ar(Math.round(big.tgt), 0) + '). ' : '') + 'مش مشكلة، بكرة رجّعي للنظام ومتعوّضيش بالحرمان.']);
    }
    if (a.done >= 3 && a.p < a.LT.p * 0.75) s.push(['w', 'poultry_leg', 'البروتين ' + ar(Math.round(a.p), 0) + ' ج من ' + ar(Math.round(a.LT.p), 0), 'البروتين بيحافظ على العضل ويشبّع أكتر. زوّدي حصة دجاج أو سمك أو جبن قريش أو زبادي يوناني.']);
    if (a.water < a.waterT * 0.7 && (!isToday || h >= 18)) s.push(['w', 'droplet', 'الماية ' + ar(a.water) + ' من ' + ar(a.waterT) + ' أكواب', 'خلّي كوباية جنبك وكوب قبل كل وجبة. العطش ساعات بيتفهم إنه جوع.']);
    if (a.extrasN > 200) s.push(['w', 'popcorn', 'أكل برا الوجبات: ' + ar(Math.round(a.extrasN), 0) + ' سعرة', 'لو الجوع بيجي بين الوجبات، ضيفي خضار أو بروتين للسناك بدل الحاجات الجاهزة.']);
    if (a.score >= 85) s.push(['g', 'star', 'يوم ممتاز!', 'التزام بالوجبات والسعرات والماية. كده بالظبط.']);
    return s;
  }
  function weekSuggestions(W, P) {
    var s = [], LT = A.levelTotals(A.settings().level), st = A.settings();
    if (!W.logged.length) { s.push(['', 'memo', 'الأسبوع ده مفيهوش تسجيل لسه', 'ابدئي بالفطور النهارده، والتقرير هيتملي لوحده.']); return s; }
    var miss = W.days.length - W.logged.length;
    if (miss >= 2) s.push(['w', 'calendar', ar(miss) + ' أيام من غير تسجيل', 'الأيام اللي مش متسجلة بتخلي الصورة مش واضحة. حتى تسجيل تقريبي أحسن من مفيش.']);
    // meals most often skipped
    D.MEALS.forEach(function (m) {
      var skip = W.logged.filter(function (x) { return !A.mealState(x.day, m.k).done; }).length;
      if (W.logged.length >= 3 && skip >= Math.ceil(W.logged.length / 2)) s.push(['w', m.img, m.t + ' اتنسى ' + ar(skip) + ' من ' + ar(W.logged.length) + ' أيام', m.k.charAt(0) === 's' ? 'جهّزيه من بدري في علبة صغيرة. السناك بيمنع الجوع الكبير اللي بيوصّل للأكل الزيادة.' : 'الوجبة دي مهمة لتوزيع السعرات. لو مفيش وقت، اختاري وجبة جاهزة سريعة من القائمة.']);
    });
    if (W.p < LT.p * 0.8) s.push(['w', 'poultry_leg', 'متوسط البروتين ' + ar(Math.round(W.p), 0) + ' ج من ' + ar(Math.round(LT.p), 0), 'خلّي في كل وجبة رئيسية بروتين واضح: بيض، دجاج، سمك، تونة، جبن قريش، أو بقوليات.']);
    if (W.water < st.water * 0.7) s.push(['w', 'droplet', 'متوسط الماية ' + ar(Math.round(W.water * 10) / 10) + ' أكواب في اليوم', 'الهدف ' + ar(st.water) + '. قسّميها: كوبين الصبح، كوب قبل كل وجبة، وكوبين بعد التمرين.']);
    if (W.extras > 150) {
      var top = {}; W.days.forEach(function (x) { (x.day.extras || []).forEach(function (e) { top[e.name] = (top[e.name] || 0) + 1; }); });
      var tn = Object.keys(top).sort(function (a, b) { return top[b] - top[a]; })[0];
      s.push(['w', 'popcorn', 'الأكل برا الوجبات متوسطه ' + ar(Math.round(W.extras), 0) + ' سعرة في اليوم', (tn ? 'أكتر حاجة اتكررت: ' + tn + '. ' : '') + 'دي أسهل حتة توفّري منها من غير ما تجوعي.']);
    }
    var over = W.logged.filter(function (x) { return x.n > x.target * 1.1; }).length, under = W.logged.filter(function (x) { return x.n < x.target * 0.75 && x.done >= 4; }).length;
    if (over >= 3) s.push(['w', 'chart_increasing', ar(over) + ' أيام فوق الهدف بأكتر من 10%', 'راجعي الكميات في صفحة "عدّلي الكميات"، خصوصاً النشويات والدهون في الغدا.']);
    if (under >= 3) s.push(['w', 'chart_decreasing', ar(under) + ' أيام أقل من الهدف بكتير', 'الأكل القليل جداً بيبطّأ الحرق ويزوّد الجوع بعدين. كمّلي الحصص المكتوبة.']);
    // weekend effect
    var we = W.logged.filter(function (x) { var g = dow(x.k); return g === 4 || g === 5; }), wd = W.logged.filter(function (x) { var g = dow(x.k); return g !== 4 && g !== 5; });
    if (we.length && wd.length) { var a1 = we.reduce(function (s, x) { return s + x.n; }, 0) / we.length, a2 = wd.reduce(function (s, x) { return s + x.n; }, 0) / wd.length; if (a1 > a2 * 1.15) s.push(['w', 'party_popper', 'الويكند أعلى بـ ' + ar(Math.round(a1 - a2), 0) + ' سعرة', 'خطّطي للخروجات من بدري: اختاري مشوي وسلطة، وخلّي الحلو مشاركة مش طبق كامل.']); }
    // variety
    var rep = Object.keys(W.ideas).filter(function (k) { return W.ideas[k] >= 4; })[0];
    if (rep) s.push(['', 'shuffle_tracks_button', '«' + rep + '» اتكررت ' + ar(W.ideas[rep]) + ' مرات', 'التنويع بيدّي فيتامينات أكتر وبيمنع الملل. جرّبي "اعملي خطة الأسبوع" من صفحة الوجبات.']);
    if (Object.keys(W.veg).length < 4 && W.logged.length >= 4) s.push(['', 'leafy_green', 'الخضار ' + ar(Object.keys(W.veg).length) + ' أنواع بس الأسبوع ده', 'نوّعي الألوان: جزر، فلفل ملون، بروكلي، باذنجان، كوسة. كل لون فيه فايدة مختلفة.']);
    D.LIMITS.forEach(function (l) { var v = W.limits[l[0]] || 0; if (v > l[2]) s.push(['w', 'stop_sign', l[1] + ' ' + ar(v) + ' مرات (الحد ' + ar(l[2]) + ')', 'خففيه الأسبوع الجاي وبدّليه بدجاج أو سمك أبيض.']); });
    // compare with previous week
    if (P && P.logged.length >= 3) {
      var dS = W.score - P.score;
      if (dS >= 8) s.push(['g', 'chart_increasing', 'أحسن من الأسبوع اللي فات بـ ' + ar(dS) + ' نقطة', 'كمّلي على نفس الطريقة.']);
      else if (dS <= -8) s.push(['w', 'chart_decreasing', 'أقل من الأسبوع اللي فات بـ ' + ar(-dS) + ' نقطة', 'رجّعي للأساسيات: الوجبات الخمسة في مواعيدها والماية.']);
    }
    // weight trend across two weeks
    var wl = (A.data.days || []).filter(function (x) { return x.weight && x.date >= A.addDays(A.TODAY, -21); }).map(function (x) { return +x.weight; });
    if (wl.length >= 3) { var dw = wl[wl.length - 1] - wl[0]; if (Math.abs(dw) < 0.3 && W.adherence >= 70) s.push(['', 'balance_scale', 'الوزن ثابت تقريباً من 3 أسابيع', 'مع إن الالتزام كويس. ده طبيعي ساعات (ماية واحتباس). لو استمر أسبوعين كمان، اعملي InBody وراجعي مستوى النشاط أو نزّلي مستوى السعرات درجة.']); else if (dw <= -0.5) s.push(['g', 'party_popper', 'نزلتي ' + ar(Math.round(-dw * 10) / 10) + ' كجم في آخر 3 أسابيع', 'نزول صحي وثابت. برافو!']); }
    if (W.adherence >= 80) s.push(['g', 'star', 'التزام ' + ar(W.adherence) + '% بالوجبات', 'ده ممتاز. السر في الاستمرارية.']);
    return s;
  }

  /* ---------- view helpers ---------- */
  function ring(score) {
    var C = 2 * Math.PI * 44, col = score >= 80 ? 'var(--mint)' : score >= 55 ? '#d4a13a' : 'var(--peach)';
    return '<div class="rp-ring"><svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="44" fill="none" stroke="var(--line)" stroke-width="10"/><circle cx="50" cy="50" r="44" fill="none" stroke="' + col + '" stroke-width="10" stroke-linecap="round" stroke-dasharray="' + C.toFixed(1) + '" stroke-dashoffset="' + (C * (1 - score / 100)).toFixed(1) + '"/></svg><div class="c"><b class="num">' + ar(score) + '</b><span>من 100</span></div></div>';
  }
  function verdict(score, logged) { return !logged ? 'مفيش تسجيل' : score >= 85 ? 'ممتاز' : score >= 70 ? 'كويس جداً' : score >= 55 ? 'كويس، وفيه فرصة' : 'محتاج شوية تركيز'; }
  function pill(score, logged) { var col = !logged ? 'var(--line)' : score >= 80 ? 'var(--mint)' : score >= 55 ? '#d4a13a' : 'var(--peach)'; return '<span class="rp-pill num" style="background:' + col + '">' + (logged ? ar(score) : '–') + '</span>'; }
  function sugList(arr) { return arr.length ? '<div class="rp-sug">' + arr.map(function (x) { return '<div class="' + x[0] + '">' + A.img(x[1]) + '<span><b>' + esc(x[2]) + '</b>' + esc(x[3]) + '</span></div>'; }).join('') + '</div>' : '<p class="note">مفيش ملاحظات، كله تمام.</p>'; }
  function macroBar(p, c, f) { var t = p * 4 + c * 4 + f * 9 || 1; return '<div class="rp-mbar" title="توزيع السعرات"><i style="width:' + (p * 4 / t * 100) + '%;background:var(--peach)"></i><i style="width:' + (c * 4 / t * 100) + '%;background:#d4a13a"></i><i style="width:' + (f * 9 / t * 100) + '%;background:#8a6bbf"></i></div><div class="note num" style="margin-top:4px">بروتين ' + ar(Math.round(p * 4 / t * 100)) + '% – نشويات ' + ar(Math.round(c * 4 / t * 100)) + '% – دهون ' + ar(Math.round(f * 9 / t * 100)) + '%</div>'; }

  function renderDay() {
    var a = analyzeDay(R.day), sugs = daySuggestions(a), lim = [];
    a.meals.forEach(function (mm) { if (mm.s.done) (mm.s.tags || []).forEach(function (t) { var l = D.LIMITS.find(function (x) { return x[0] === t; }); if (l) lim.push(l[1]); }); });
    var html = '<div class="card hm-wide"><div class="rp-score">' + ring(a.score) + '<div><div class="rp-verdict">' + (a.k === A.TODAY && new Date().getHours() < 21 ? 'اليوم لسه شغال' : verdict(a.score, a.logged)) + '</div><div class="note">' + A.fmt(a.k, { weekday: 'long', day: 'numeric', month: 'long' }) + '</div>' +
      '<div class="rp-kv"><div>السعرات<b class="num">' + ar(Math.round(a.n), 0) + ' / ' + ar(a.target, 0) + '</b></div><div>الوجبات<b class="num">' + ar(a.done) + ' من 5</b></div><div>البروتين<b class="num">' + ar(Math.round(a.p), 0) + ' / ' + ar(Math.round(a.LT.p), 0) + ' ج</b></div><div>الماية<b class="num">' + ar(a.water) + ' / ' + ar(a.waterT) + '</b></div></div></div></div>' +
      (a.n ? macroBar(a.p, a.c, a.f) : '') + '</div>' +
      '<div class="card"><h2>اقتراحات</h2>' + sugList(sugs) + '</div>' +
      '<div class="card rp-clip"><h2>تفاصيل الوجبات</h2><table class="rp-tbl rp-meals"><thead><tr><th>الوجبة</th><th>اللي اتاكل</th><th>سعرات</th><th></th></tr></thead><tbody>' +
        a.meals.map(function (mm) { return '<tr><td>' + A.img(mm.m.img) + mm.m.t + '</td><td>' + (mm.title ? esc(mm.title) + '<div class="note">' + mm.comps.map(function (x) { return esc(x.food.name.split(' (')[0]) + ' ' + A.amountText(x.food, x.n); }).join('، ') + '</div>' : '<span class="rp-no">—</span>') + '</td><td class="num' + (mm.s.done && mm.t.n > mm.tgt * 1.2 ? ' rp-hi' : '') + '">' + (mm.comps.length ? ar(Math.round(mm.t.n), 0) : '—') + '</td><td>' + (mm.s.done ? '<span class="rp-ok">✓</span>' : '<span class="rp-no">✗</span>') + '</td></tr>'; }).join('') +
        ((a.day.extras || []).length ? (a.day.extras || []).map(function (x) { return '<tr><td>' + A.img(x.img || 'fork_and_knife_with_plate') + 'برا الوجبات</td><td>' + esc(x.name) + (x.q && x.q !== 1 ? ' × ' + ar(x.q) : '') + (x.t ? ' <span class="note num">' + x.t + '</span>' : '') + '</td><td class="num">' + ar(Math.round(x.n * (x.q || 1)), 0) + '</td><td><span class="rp-ok">✓</span></td></tr>'; }).join('') : '') +
      '</tbody></table>' +
      (a.day.weight || a.day.note || lim.length ? '<div class="rp-kv">' + (a.day.weight ? '<div>الوزن<b class="num">' + ar(a.day.weight) + ' كجم</b></div>' : '') + (lim.length ? '<div>أصناف محدودة<b>' + esc(lim.join('، ')) + '</b></div>' : '') + '</div>' + (a.day.note ? '<p class="note" style="margin:10px 0 0">ملاحظة اليوم: ' + esc(a.day.note) + '</p>' : '') : '') +
      '</div>';
    return { html: html, text: dayText(a, sugs) };
  }
  function renderWeek() {
    var W = analyzeWeek(R.week), P = analyzeWeek(A.addDays(weekOf(R.week)[0], -1)), sugs = weekSuggestions(W, P), st = A.settings();
    var top = Object.keys(W.foods).sort(function (a, b) { return W.foods[b] - W.foods[a]; }).slice(0, 8);
    var html = '<div class="card hm-wide"><div class="rp-score">' + ring(W.score) + '<div><div class="rp-verdict">' + verdict(W.score, W.logged.length) + '</div><div class="note">' + A.fmt(W.keys[0], { day: 'numeric', month: 'long' }) + ' – ' + A.fmt(W.keys[6], { day: 'numeric', month: 'long' }) + (P.logged.length ? ' · الأسبوع اللي فات ' + ar(P.score) : '') + '</div>' +
      '<div class="rp-kv"><div>متوسط السعرات<b class="num">' + (W.logged.length ? ar(Math.round(W.n), 0) : '—') + ' / ' + ar(st.level, 0) + '</b></div><div>الالتزام بالوجبات<b class="num">' + ar(W.adherence) + '%</b></div><div>متوسط البروتين<b class="num">' + ar(Math.round(W.p), 0) + ' ج</b></div><div>متوسط الماية<b class="num">' + ar(Math.round(W.water * 10) / 10) + ' أكواب</b></div>' +
      (W.w0 && W.w1 && W.w0 !== W.w1 ? '<div>الوزن<b class="num">' + ar(W.w0) + ' ← ' + ar(W.w1) + '</b></div>' : '') + '<div>أيام متسجلة<b class="num">' + ar(W.logged.length) + ' من ' + ar(W.days.length) + '</b></div></div></div></div>' +
      (W.logged.length ? macroBar(W.p, W.c, W.f) : '') + '</div>' +
      '<div class="card"><h2>اقتراحات الأسبوع</h2>' + sugList(sugs) + '</div>' +
      '<div class="card rp-clip"><h2>يوم بيوم</h2><table class="rp-tbl rp-days"><thead><tr><th>اليوم</th><th>سعرات</th><th>وجبات</th><th>ماية</th><th>برا</th><th>تقييم</th></tr></thead><tbody>' +
        W.keys.map(function (k) { var x = W.days.find(function (y) { return y.k === k; }); if (!x) return '<tr><td>' + DAYN[dow(k)] + ' <span class="note num">' + A.fmt(k, { day: 'numeric' }) + '</span></td><td colspan="5" class="rp-no">لسه</td></tr>';
          return '<tr class="click" data-k="' + k + '"><td>' + DAYN[dow(k)] + ' <span class="note num">' + A.fmt(k, { day: 'numeric' }) + '</span></td><td class="num' + (x.n > x.target * 1.1 ? ' rp-hi' : '') + '">' + (x.logged ? ar(Math.round(x.n), 0) : '—') + '</td><td class="num">' + ar(x.done) + '/5</td><td class="num">' + ar(x.water) + '</td><td class="num">' + (x.extrasN ? ar(Math.round(x.extrasN), 0) : '—') + '</td><td>' + pill(x.score, x.logged) + '</td></tr>'; }).join('') +
      '</tbody></table>' + (W.best && W.worst && W.best !== W.worst ? '<p class="note" style="margin:10px 0 0">أحسن يوم: ' + DAYN[dow(W.best.k)] + ' (' + ar(W.best.score) + ') – أقل يوم: ' + DAYN[dow(W.worst.k)] + ' (' + ar(W.worst.score) + ')</p>' : '') + '</div>' +
      '<div class="card"><h2>الأكتر في الأسبوع</h2>' + (top.length ? '<div class="rp-top">' + top.map(function (f) { return '<span>' + A.img(D.FOODS[f].img) + esc(D.FOODS[f].name.split(' (')[0]) + ' <b class="num">×' + ar(W.foods[f]) + '</b></span>'; }).join('') + '</div>' : '<p class="note">لسه مفيش وجبات متعلّمة إنها اتاكلت.</p>') +
        '<div class="hm-lim">' + D.LIMITS.map(function (l) { var v = W.limits[l[0]] || 0, dots = ''; for (var j = 0; j < Math.max(l[2], v); j++) dots += '<i class="' + (j < v ? 'on' : '') + '"></i>'; return '<div class="' + (v > l[2] ? 'over' : v === l[2] ? 'full' : '') + '"><span>' + l[1] + '</span><span class="hm-dots">' + dots + '</span></div>'; }).join('') + '</div></div>';
    return { html: html, text: weekText(W, sugs) };
  }
  function dayText(a, sugs) {
    return 'تقرير خفّة اليومي – ' + A.fmt(a.k, { weekday: 'long', day: 'numeric', month: 'long' }) + '\n' +
      'التقييم: ' + a.score + '/100 (' + verdict(a.score, a.logged) + ')\nالسعرات: ' + Math.round(a.n) + ' من ' + a.target + '\nالوجبات: ' + a.done + ' من 5\nالبروتين: ' + Math.round(a.p) + ' ج\nالماية: ' + a.water + ' أكواب\n\n' +
      a.meals.map(function (mm) { return (mm.s.done ? '✓ ' : '✗ ') + mm.m.t + ': ' + (mm.title || '—') + (mm.comps.length ? ' (' + Math.round(mm.t.n) + ' سعرة)' : ''); }).join('\n') +
      ((a.day.extras || []).length ? '\nبرا الوجبات: ' + a.day.extras.map(function (x) { return x.name + ' ' + Math.round(x.n * (x.q || 1)); }).join('، ') : '') +
      (sugs.length ? '\n\nاقتراحات:\n' + sugs.map(function (x) { return '- ' + x[2] + ': ' + x[3]; }).join('\n') : '');
  }
  function weekText(W, sugs) {
    return 'تقرير خفّة الأسبوعي – ' + A.fmt(W.keys[0], { day: 'numeric', month: 'long' }) + ' إلى ' + A.fmt(W.keys[6], { day: 'numeric', month: 'long' }) + '\n' +
      'التقييم: ' + W.score + '/100\nمتوسط السعرات: ' + Math.round(W.n) + '\nالالتزام بالوجبات: ' + W.adherence + '%\nمتوسط البروتين: ' + Math.round(W.p) + ' ج\nمتوسط الماية: ' + (Math.round(W.water * 10) / 10) + ' أكواب\nأيام متسجلة: ' + W.logged.length + ' من ' + W.days.length +
      (W.w0 && W.w1 ? '\nالوزن: ' + W.w0 + ' ← ' + W.w1 : '') + '\n\n' +
      W.days.map(function (x) { return DAYN[dow(x.k)] + ': ' + (x.logged ? Math.round(x.n) + ' سعرة، ' + x.done + '/5 وجبات، تقييم ' + x.score : 'مفيش تسجيل'); }).join('\n') +
      (sugs.length ? '\n\nاقتراحات:\n' + sugs.map(function (x) { return '- ' + x[2] + ': ' + x[3]; }).join('\n') : '');
  }

  function render() {
    if (!A.data || sec.hidden) return;
    var isDay = R.mode === 'day', label, prevOk = true, nextOk;
    if (isDay) { label = R.day === A.TODAY ? 'النهارده' : A.fmt(R.day, { weekday: 'long', day: 'numeric', month: 'short' }); nextOk = R.day < A.TODAY; }
    else { var wk = weekOf(R.week); label = (wk[6] >= A.TODAY && wk[0] <= A.TODAY) ? 'الأسبوع ده' : A.fmt(wk[0], { day: 'numeric', month: 'short' }) + ' – ' + A.fmt(wk[6], { day: 'numeric', month: 'short' }); nextOk = wk[6] < A.TODAY; }
    var body = isDay ? renderDay() : renderWeek();
    sec.innerHTML = '<div class="card hm-wide"><div class="rp-bar"><div class="seg" style="margin:0"><button data-md="day" aria-pressed="' + isDay + '">يومي</button><button data-md="week" aria-pressed="' + !isDay + '">أسبوعي</button></div>' +
      '<div class="rp-nav"><button id="rpPrev" aria-label="اللي قبله">›</button><b>' + label + '</b><button id="rpNext" aria-label="اللي بعده"' + (nextOk ? '' : ' disabled') + '>‹</button></div></div>' +
      '<div class="rp-act" style="margin-top:12px"><button class="btn ghost sm" id="rpCopy">انسخي التقرير</button>' + (navigator.share ? '<button class="btn ghost sm" id="rpShare">ابعتيه</button>' : '') + '<button class="btn ghost sm" id="rpPrint">اطبعي / PDF</button></div></div>' + body.html;
    sec.querySelectorAll('.seg button').forEach(function (b) { b.onclick = function () { R.mode = b.dataset.md; render(); }; });
    d.getElementById('rpPrev').onclick = function () { if (isDay) R.day = A.addDays(R.day, -1); else R.week = A.addDays(weekOf(R.week)[0], -1); render(); };
    d.getElementById('rpNext').onclick = function () { if (isDay) R.day = A.addDays(R.day, 1); else R.week = A.addDays(weekOf(R.week)[6], 1); if (R.week > A.TODAY) R.week = A.TODAY; render(); };
    d.getElementById('rpCopy').onclick = function () { var done = function () { A.toast('اتنسخ التقرير'); }; if (navigator.clipboard) navigator.clipboard.writeText(body.text).then(done, function () { A.toast('مقدرتش أنسخ'); }); };
    var sh = d.getElementById('rpShare'); if (sh) sh.onclick = function () { navigator.share({ title: 'تقرير خفّة', text: body.text }).catch(function () {}); };
    d.getElementById('rpPrint').onclick = function () { window.print(); };
    sec.querySelectorAll('tr.click').forEach(function (tr) { tr.onclick = function () { R.mode = 'day'; R.day = tr.dataset.k; render(); window.scrollTo(0, 0); }; });
  }

  (window.KHIFFA_HOOKS = window.KHIFFA_HOOKS || []).push(function () { render(); });
  render();
})();
