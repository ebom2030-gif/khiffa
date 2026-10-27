/* خفّة – التقارير: تقرير يومي وتقرير أسبوعي واقتراحات مبنية على تحليل الأيام والأسابيع */
(function () {
  'use strict';
  var d = document, A = window.KHIFFA_APP; if (!A) return;
  var D = A.D, ar = A.ar, esc = A.esc;
  var dow = function (k) { return new Date(k + 'T12:00:00').getDay(); };
  var DAYN = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];

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
    /* KPI dashboard row */
    '.rp-kpis{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px}' +
    '@media (min-width:640px){.rp-kpis{grid-template-columns:repeat(6,minmax(0,1fr))}}' +
    '.rp-kpi{background:var(--surface);border-radius:18px;box-shadow:var(--shadow);padding:10px 12px;min-width:0;position:relative;overflow:hidden}' +
    '.rp-kpi::before{content:"";position:absolute;inset-inline-start:0;top:12px;bottom:12px;width:3px;border-radius:3px;background:var(--kc,var(--mint))}' +
    '.rp-kpi .l{font-size:11.5px;color:var(--muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}' +
    '.rp-kpi .v{font-size:20px;font-weight:700;line-height:1.25;color:var(--ink);white-space:nowrap}.rp-kpi .v small{font-size:11.5px;font-weight:500;color:var(--muted);margin-inline-start:2px}' +
    '.rp-kpi .s{font-size:11px;color:var(--muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}' +
    '.rp-kpi .t{display:inline-flex;align-items:center;gap:2px;font-size:11px;font-weight:700;border-radius:999px;padding:0 6px;margin-top:3px;background:var(--bg);color:var(--muted)}' +
    '.rp-kpi .t.up{color:var(--mint);background:var(--mint-soft)}.rp-kpi .t.dn{color:var(--bad);background:var(--peach-soft)}' +
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

  var R = { mode: 'day', day: new Date().getHours() < 18 ? A.addDays(A.TODAY, -1) : A.TODAY, week: A.TODAY }; // صباحًا يفتح على أمس بدل يوم لم يبدأ

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
    out.water = A.bottles(day); out.target = st.level; out.LT = LT; out.waterT = st.water;
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

  /* ---------- KPIs (shared by the on-screen dashboard row and the printed report) ---------- */
  function lastWeight(k) {
    var best = null;
    (A.data.days || []).forEach(function (x) { if (x.weight && x.date <= k && (!best || x.date > best.date)) best = { date: x.date, w: +x.weight }; });
    (A.data.inbody || []).forEach(function (x) { if (x.weight && x.date <= k && (!best || x.date > best.date)) best = { date: x.date, w: +x.weight }; });
    return best;
  }
  function kpis(mode, k) {
    var st = A.settings(), LT = A.levelTotals(st.level), K;
    if (mode === 'day') {
      var a = analyzeDay(k);
      K = { mode: mode, start: k, end: k, a: a, logged: a.logged, score: a.score, kcal: a.n, kcalT: a.target, adh: Math.round(a.done / 5 * 100), prot: a.p, protT: a.LT.p, water: a.water, waterT: a.waterT, c: a.c, f: a.f };
    } else {
      var W = analyzeWeek(k), end = W.keys[6] > A.TODAY ? A.TODAY : W.keys[6];
      K = { mode: mode, start: W.keys[0], end: end, W: W, logged: W.logged.length > 0, score: W.score, kcal: W.n, kcalT: st.level, adh: W.adherence, prot: W.p, protT: LT.p, water: W.water, waterT: st.water, c: W.c, f: W.f };
    }
    var b1 = lastWeight(K.end), b0 = lastWeight(A.addDays(K.start, -1));
    K.w1 = b1 ? b1.w : null; K.w0 = b0 ? b0.w : null;
    // change only when a weight was recorded inside the period and there is an earlier one to compare with
    K.wchg = b1 && b0 && b1.date >= K.start ? Math.round((b1.w - b0.w) * 10) / 10 : null;
    K.LT = LT;
    return K;
  }
  function prevKpis(mode, k) { return mode === 'day' ? kpis('day', A.addDays(k, -1)) : kpis('week', A.addDays(weekOf(k)[0], -1)); }
  // each: [label, value, unit, sub, delta, good(boolean|null), accent]
  function kpiList(K, P) {
    var has = P && P.logged && K.logged, r1 = function (v) { return Math.round(v * 10) / 10; };
    var kd = has ? Math.abs(K.kcal - K.kcalT) - Math.abs(P.kcal - P.kcalT) : 0;
    return [
      ['التقييم', ar(K.score), '/100', K.mode === 'day' ? 'تقييم اليوم' : 'متوسط الأسبوع', has ? K.score - P.score : null, has ? K.score >= P.score : null, K.score >= 80 ? 'var(--mint)' : K.score >= 55 ? '#d4a13a' : 'var(--peach)'],
      [K.mode === 'day' ? 'السعرات' : 'متوسط السعرات', K.logged ? ar(Math.round(K.kcal), 0) : '—', '', 'الهدف ' + ar(K.kcalT, 0), has ? Math.round(K.kcal - P.kcal) : null, has ? kd <= 0 : null, K.kcal > K.kcalT * 1.1 ? 'var(--bad)' : 'var(--mint)'],
      ['الالتزام بالوجبات', ar(K.adh), '%', K.mode === 'day' ? ar(Math.round(K.adh / 20)) + ' من 5 وجبات' : 'من الوجبات المخططة', has ? K.adh - P.adh : null, has ? K.adh >= P.adh : null, 'var(--mint)'],
      [K.mode === 'day' ? 'البروتين' : 'متوسط البروتين', ar(Math.round(K.prot), 0), 'ج', 'الهدف ' + ar(Math.round(K.protT), 0) + ' ج', has ? Math.round(K.prot - P.prot) : null, has ? K.prot >= P.prot : null, 'var(--peach)'],
      [K.mode === 'day' ? 'الماء' : 'متوسط الماء', ar(r1(K.water)), 'زجاجة', 'الهدف ' + ar(K.waterT) + ' × 330 مل', has ? r1(K.water - P.water) : null, has ? K.water >= P.water : null, 'var(--water)'],
      ['تغيّر الوزن', K.wchg == null ? '—' : (K.wchg > 0 ? '+' : K.wchg < 0 ? '−' : '') + ar(Math.abs(K.wchg)), K.wchg == null ? '' : 'كجم', K.w1 != null ? 'الحالي ' + ar(K.w1) + ' كجم' : 'لا يوجد وزن مسجّل', K.wchg ? K.wchg : null, K.wchg ? K.wchg < 0 : null, '#8a6bbf']
    ];
  }
  function kpiRow(K, P) {
    return '<div class="rp-kpis hm-wide">' + kpiList(K, P).map(function (x, i) {
      var t = '';
      if (x[4] != null && x[4] !== 0) t = '<span class="t ' + (x[5] ? 'up' : 'dn') + ' num">' + (x[4] > 0 ? '▲' : '▼') + ' ' + ar(Math.abs(x[4])) + '</span>';
      else if (x[4] === 0) t = '<span class="t num">= ' + (i === 5 ? '' : 'كالسابق') + '</span>';
      return '<div class="rp-kpi" style="--kc:' + x[6] + '"><div class="l">' + x[0] + '</div><div class="v num">' + x[1] + (x[2] ? '<small>' + x[2] + '</small>' : '') + '</div><div class="s num">' + x[3] + '</div>' + t + '</div>';
    }).join('') + '</div>';
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
    if (!a.logged) { s.push(['', 'memo', 'لا يوجد تسجيل لهذا اليوم', isToday ? 'سجّلي أول وجبة الآن ولو بشكل تقريبي؛ فالتسجيل أهم من الدقة.' : 'إن كنت تتذكرين ما تناولته، فسجّليه من صفحة اليوم ليكون التقرير الأسبوعي دقيقًا.']); return s; }
    if (isToday && rest.length && left > 80) {
      var mk = rest[0].m, per = Math.round(left / rest.length), id = ideasFor(mk.k, per + 60);
      s.push(['g', 'bullseye', 'يتبقى ' + ar(Math.round(left), 0) + ' سعرة على ' + ar(rest.length) + (rest.length === 1 ? ' وجبة' : ' وجبات'), 'أي نحو ' + ar(per, 0) + ' سعرة للوجبة. ' + (id.length ? 'لـ' + mk.t + ' جرّبي: ' + id.map(function (x) { return A.ideaName(x.i) + ' (' + ar(Math.round(x.t.n), 0) + ')'; }).join(' أو ') + '.' : '')]);
    }
    if (left < -100) {
      var big = a.meals.filter(function (mm) { return mm.s.done; }).sort(function (x, y) { return (y.t.n - y.tgt) - (x.t.n - x.tgt); })[0];
      s.push(['w', 'warning', 'زيادة ' + ar(Math.round(-left), 0) + ' سعرة عن الهدف', (a.extrasN > 100 ? 'معظمها من الأكل خارج الوجبات (' + ar(Math.round(a.extrasN), 0) + ' سعرة). ' : big && big.t.n - big.tgt > 60 ? 'أكبر زيادة كانت في ' + big.m.t + ' (' + ar(Math.round(big.t.n), 0) + ' بدلًا من نحو ' + ar(Math.round(big.tgt), 0) + '). ' : '') + 'لا بأس، عودي إلى النظام غدًا ولا تعوّضي ذلك بالحرمان.']);
    }
    if (a.done >= 3 && a.p < a.LT.p * 0.75) s.push(['w', 'poultry_leg', 'البروتين ' + ar(Math.round(a.p), 0) + ' ج من ' + ar(Math.round(a.LT.p), 0), 'البروتين يحافظ على العضلات ويمنح شبعًا أطول. أضيفي حصة دجاج أو سمك أو جبن قريش أو زبادي يوناني.']);
    if (a.water < a.waterT * 0.7 && (!isToday || h >= 18)) s.push(['w', 'droplet', 'الماء ' + ar(a.water) + ' من ' + ar(a.waterT) + ' زجاجات 330 مل', 'احتفظي بزجاجة بجانبك، واشربي زجاجة قبل كل وجبة؛ فالعطش يُفهم أحيانًا على أنه جوع.']);
    if (a.extrasN > 200) s.push(['w', 'popcorn', 'أكل خارج الوجبات: ' + ar(Math.round(a.extrasN), 0) + ' سعرة', 'إذا جاء الجوع بين الوجبات، فأضيفي خضارًا أو بروتينًا للوجبة خفيفة بدلًا من الأطعمة الجاهزة.']);
    if (a.score >= 85) s.push(['g', 'star', 'يوم ممتاز!', 'التزام بالوجبات والسعرات والماء. هكذا تمامًا.']);
    return s;
  }
  function weekSuggestions(W, P) {
    var s = [], LT = A.levelTotals(A.settings().level), st = A.settings();
    if (!W.logged.length) { s.push(['', 'memo', 'لا يوجد تسجيل لهذا الأسبوع بعد', 'ابدئي بالفطور اليوم، وسيكتمل التقرير تلقائيًا.']); return s; }
    var miss = W.days.length - W.logged.length;
    if (miss >= 2) s.push(['w', 'calendar', ar(miss) + ' أيام دون تسجيل', 'الأيام غير المسجّلة تجعل الصورة غير واضحة، والتسجيل التقريبي أفضل من لا شيء.']);
    // meals most often skipped
    D.MEALS.forEach(function (m) {
      var skip = W.logged.filter(function (x) { return !A.mealState(x.day, m.k).done; }).length;
      if (W.logged.length >= 3 && skip >= Math.ceil(W.logged.length / 2)) s.push(['w', m.img, m.t + ' لم تُسجَّل في ' + ar(skip) + ' من ' + ar(W.logged.length) + ' أيام', m.k.charAt(0) === 's' ? 'جهّزيه مبكرًا في علبة صغيرة؛ فالوجبة خفيفة يمنع الجوع الشديد الذي يؤدي إلى الإفراط في الأكل.' : 'هذه الوجبة مهمة لتوزيع السعرات. إن لم يتوفر الوقت، فاختاري وجبة جاهزة سريعة من القائمة.']);
    });
    if (W.p < LT.p * 0.8) s.push(['w', 'poultry_leg', 'متوسط البروتين ' + ar(Math.round(W.p), 0) + ' ج من ' + ar(Math.round(LT.p), 0), 'اجعلي في كل وجبة رئيسية بروتينًا واضحًا: بيض، دجاج، سمك، تونة، جبن قريش، أو بقوليات.']);
    if (W.water < st.water * 0.7) s.push(['w', 'droplet', 'متوسط الماء ' + ar(Math.round(W.water * 10) / 10) + ' زجاجات في اليوم', 'الهدف ' + ar(st.water) + ' زجاجات 330 مل. قسّميها: كوبان صباحًا، وكوب قبل كل وجبة، وكوبان بعد التمرين.']);
    if (W.extras > 150) {
      var top = {}; W.days.forEach(function (x) { (x.day.extras || []).forEach(function (e) { top[e.name] = (top[e.name] || 0) + 1; }); });
      var tn = Object.keys(top).sort(function (a, b) { return top[b] - top[a]; })[0];
      s.push(['w', 'popcorn', 'متوسط الأكل خارج الوجبات ' + ar(Math.round(W.extras), 0) + ' سعرة في اليوم', (tn ? 'الأكثر تكرارًا: ' + tn + '. ' : '') + 'هذا أسهل جزء يمكنك التوفير منه دون أن تجوعي.']);
    }
    var over = W.logged.filter(function (x) { return x.n > x.target * 1.1; }).length, under = W.logged.filter(function (x) { return x.n < x.target * 0.75 && x.done >= 4; }).length;
    if (over >= 3) s.push(['w', 'chart_increasing', ar(over) + ' أيام فوق الهدف بأكثر من 10%', 'راجعي الكميات في صفحة "عدّلي الكميات"، خصوصًا النشويات والدهون في الغداء.']);
    if (under >= 3) s.push(['w', 'chart_decreasing', ar(under) + ' أيام أقل من الهدف بكثير', 'الأكل القليل جدًا يُبطئ الحرق ويزيد الجوع لاحقًا. أكملي الحصص المحددة.']);
    // weekend effect
    var we = W.logged.filter(function (x) { var g = dow(x.k); return g === 4 || g === 5; }), wd = W.logged.filter(function (x) { var g = dow(x.k); return g !== 4 && g !== 5; });
    if (we.length && wd.length) { var a1 = we.reduce(function (s, x) { return s + x.n; }, 0) / we.length, a2 = wd.reduce(function (s, x) { return s + x.n; }, 0) / wd.length; if (a1 > a2 * 1.15) s.push(['w', 'party_popper', 'عطلة الأسبوع أعلى بـ ' + ar(Math.round(a1 - a2), 0) + ' سعرة', 'خطّطي للخروجات مسبقًا: اختاري المشويات والسلطة، واجعلي الحلوى للمشاركة لا طبقًا كاملًا.']); }
    // variety
    var rep = Object.keys(W.ideas).filter(function (k) { return W.ideas[k] >= 4; })[0];
    if (rep) s.push(['', 'shuffle_tracks_button', '«' + rep + '» تكررت ' + ar(W.ideas[rep]) + ' مرات', 'التنويع يمنح فيتامينات أكثر ويمنع الملل. جرّبي "اقترحي أسبوعًا" من صفحة الوجبات.']);
    if (Object.keys(W.veg).length < 4 && W.logged.length >= 4) s.push(['', 'leafy_green', 'الخضار ' + ar(Object.keys(W.veg).length) + ' أنواع فقط هذا الأسبوع', 'نوّعي الألوان: جزر، فلفل ملون، بروكلي، باذنجان، كوسة. لكل لون فائدة مختلفة.']);
    D.LIMITS.forEach(function (l) { var v = W.limits[l[0]] || 0; if (v > l[2]) s.push(['w', 'stop_sign', l[1] + ' ' + ar(v) + ' مرات (الحد ' + ar(l[2]) + ')', 'قلّليه الأسبوع القادم واستبدليه بدجاج أو سمك أبيض.']); });
    // compare with previous week
    if (P && P.logged.length >= 3) {
      var dS = W.score - P.score;
      if (dS >= 8) s.push(['g', 'chart_increasing', 'أفضل من الأسبوع الماضي بـ ' + ar(dS) + ' نقطة', 'استمري على الطريقة نفسها.']);
      else if (dS <= -8) s.push(['w', 'chart_decreasing', 'أقل من الأسبوع الماضي بـ ' + ar(-dS) + ' نقطة', 'عودي إلى الأساسيات: الوجبات الخمس في مواعيدها والماء.']);
    }
    // weight trend across two weeks
    var wl = (A.data.days || []).filter(function (x) { return x.weight && x.date >= A.addDays(A.TODAY, -21); }).map(function (x) { return +x.weight; });
    if (wl.length >= 3) { var dw = wl[wl.length - 1] - wl[0]; if (Math.abs(dw) < 0.3 && W.adherence >= 70) s.push(['', 'balance_scale', 'الوزن ثابت تقريبًا منذ 3 أسابيع', 'رغم أن الالتزام جيد. هذا طبيعي أحيانًا (احتباس الماء). إذا استمر أسبوعين آخرين، فأجري قياس تركيب الجسم وراجعي مستوى النشاط أو اخفضي مستوى السعرات درجة.']); else if (dw <= -0.5) s.push(['g', 'party_popper', 'خسرت ' + ar(Math.round(-dw * 10) / 10) + ' كجم في آخر 3 أسابيع', 'نزول صحي وثابت. أحسنتِ!']); }
    if (W.adherence >= 80) s.push(['g', 'star', 'التزام ' + ar(W.adherence) + '% بالوجبات', 'هذا ممتاز، والسر في الاستمرارية.']);
    return s;
  }

  /* ---------- view helpers ---------- */
  function ring(score) {
    var C = 2 * Math.PI * 44, col = score >= 80 ? 'var(--mint)' : score >= 55 ? '#d4a13a' : 'var(--peach)';
    return '<div class="rp-ring"><svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="44" fill="none" stroke="var(--line)" stroke-width="10"/><circle cx="50" cy="50" r="44" fill="none" stroke="' + col + '" stroke-width="10" stroke-linecap="round" stroke-dasharray="' + C.toFixed(1) + '" stroke-dashoffset="' + (C * (1 - score / 100)).toFixed(1) + '"/></svg><div class="c"><b class="num">' + ar(score) + '</b><span>من 100</span></div></div>';
  }
  function verdict(score, logged) { return !logged ? 'لا يوجد تسجيل' : score >= 85 ? 'ممتاز' : score >= 70 ? 'جيد جدًا' : score >= 55 ? 'جيد، ويمكن تحسينه' : 'يحتاج إلى مزيد من التركيز'; }
  function pill(score, logged) { var col = !logged ? 'var(--line)' : score >= 80 ? 'var(--mint)' : score >= 55 ? '#d4a13a' : 'var(--peach)'; return '<span class="rp-pill num" style="background:' + col + '">' + (logged ? ar(score) : '–') + '</span>'; }
  function sugList(arr) { return arr.length ? '<div class="rp-sug">' + arr.map(function (x) { return '<div class="' + x[0] + '">' + A.img(x[1]) + '<span><b>' + esc(x[2]) + '</b>' + esc(x[3]) + '</span></div>'; }).join('') + '</div>' : '<p class="note">لا توجد ملاحظات، كل شيء على ما يرام.</p>'; }
  function macroBar(p, c, f) { var t = p * 4 + c * 4 + f * 9 || 1; return '<div class="rp-mbar" title="توزيع السعرات"><i style="width:' + (p * 4 / t * 100) + '%;background:var(--peach)"></i><i style="width:' + (c * 4 / t * 100) + '%;background:#d4a13a"></i><i style="width:' + (f * 9 / t * 100) + '%;background:#8a6bbf"></i></div><div class="note num" style="margin-top:4px">بروتين ' + ar(Math.round(p * 4 / t * 100)) + '% – نشويات ' + ar(Math.round(c * 4 / t * 100)) + '% – دهون ' + ar(Math.round(f * 9 / t * 100)) + '%</div>'; }

  function renderDay() {
    var a = analyzeDay(R.day), sugs = daySuggestions(a), lim = [];
    a.meals.forEach(function (mm) { if (mm.s.done) (mm.s.tags || []).forEach(function (t) { var l = D.LIMITS.find(function (x) { return x[0] === t; }); if (l) lim.push(l[1]); }); });
    var html = kpiRow(kpis('day', R.day), prevKpis('day', R.day)) + '<div class="card hm-wide"><div class="rp-score">' + ring(a.score) + '<div><div class="rp-verdict">' + (a.k === A.TODAY && new Date().getHours() < 21 ? 'اليوم لم ينتهِ بعد' : verdict(a.score, a.logged)) + '</div><div class="note">' + A.fmt(a.k, { weekday: 'long', day: 'numeric', month: 'long' }) + ' · المقارنة مع اليوم السابق</div></div></div>' +
      (a.n ? macroBar(a.p, a.c, a.f) : '') + '</div>' +
      '<div class="card"><h2>اقتراحات</h2>' + sugList(sugs) + '</div>' +
      '<div class="card rp-clip"><h2>تفاصيل الوجبات</h2><table class="rp-tbl rp-meals"><thead><tr><th>الوجبة</th><th>ما تم تناوله</th><th>سعرات</th><th></th></tr></thead><tbody>' +
        a.meals.map(function (mm) { return '<tr><td>' + A.img(mm.m.img) + mm.m.t + '</td><td>' + (mm.title ? esc(mm.title) + '<div class="note">' + mm.comps.map(function (x) { return esc(x.food.name.split(' (')[0]) + ' ' + A.amountText(x.food, x.n); }).join('، ') + '</div>' : '<span class="rp-no">—</span>') + '</td><td class="num' + (mm.s.done && mm.t.n > mm.tgt * 1.2 ? ' rp-hi' : '') + '">' + (mm.comps.length ? ar(Math.round(mm.t.n), 0) : '—') + '</td><td>' + (mm.s.done ? '<span class="rp-ok">✓</span>' : '<span class="rp-no">✗</span>') + '</td></tr>'; }).join('') +
        ((a.day.extras || []).length ? (a.day.extras || []).map(function (x) { return '<tr><td>' + A.img(x.img || 'fork_and_knife_with_plate') + 'خارج الوجبات</td><td>' + esc(x.name) + (x.q && x.q !== 1 ? ' × ' + ar(x.q) : '') + (x.t ? ' <span class="note num">' + x.t + '</span>' : '') + '</td><td class="num">' + ar(Math.round(x.n * (x.q || 1)), 0) + '</td><td><span class="rp-ok">✓</span></td></tr>'; }).join('') : '') +
      '</tbody></table>' +
      (a.day.weight || a.day.note || lim.length ? '<div class="rp-kv">' + (a.day.weight ? '<div>الوزن<b class="num">' + ar(a.day.weight) + ' كجم</b></div>' : '') + (lim.length ? '<div>أصناف محدودة<b>' + esc(lim.join('، ')) + '</b></div>' : '') + '</div>' + (a.day.note ? '<p class="note" style="margin:10px 0 0">ملاحظة اليوم: ' + esc(a.day.note) + '</p>' : '') : '') +
      '</div>';
    return { html: html, text: dayText(a, sugs) };
  }
  function renderWeek() {
    var W = analyzeWeek(R.week), P = analyzeWeek(A.addDays(weekOf(R.week)[0], -1)), sugs = weekSuggestions(W, P), st = A.settings();
    var top = Object.keys(W.foods).sort(function (a, b) { return W.foods[b] - W.foods[a]; }).slice(0, 8);
    var html = kpiRow(kpis('week', R.week), prevKpis('week', R.week)) + '<div class="card hm-wide"><div class="rp-score">' + ring(W.score) + '<div><div class="rp-verdict">' + verdict(W.score, W.logged.length) + '</div><div class="note">' + A.fmt(W.keys[0], { day: 'numeric', month: 'long' }) + ' – ' + A.fmt(W.keys[6], { day: 'numeric', month: 'long' }) + (P.logged.length ? ' · الأسبوع الماضي ' + ar(P.score) : '') + '</div>' +
      '<div class="rp-kv"><div>أيام مسجّلة<b class="num">' + ar(W.logged.length) + ' من ' + ar(W.days.length) + '</b></div>' + (W.w0 && W.w1 && W.w0 !== W.w1 ? '<div>الوزن<b class="num">' + ar(W.w0) + ' ← ' + ar(W.w1) + '</b></div>' : '') + '</div></div></div>' +
      (W.logged.length ? macroBar(W.p, W.c, W.f) : '') + '</div>' +
      '<div class="card"><h2>اقتراحات الأسبوع</h2>' + sugList(sugs) + '</div>' +
      '<div class="card rp-clip"><h2>يوم بيوم</h2><table class="rp-tbl rp-days"><thead><tr><th>اليوم</th><th>سعرات</th><th>وجبات</th><th>ماء</th><th>إضافي</th><th>تقييم</th></tr></thead><tbody>' +
        W.keys.map(function (k) { var x = W.days.find(function (y) { return y.k === k; }); if (!x) return '<tr><td>' + DAYN[dow(k)] + ' <span class="note num">' + A.fmt(k, { day: 'numeric' }) + '</span></td><td colspan="5" class="rp-no">لم يُسجَّل</td></tr>';
          return '<tr class="click" data-k="' + k + '"><td>' + DAYN[dow(k)] + ' <span class="note num">' + A.fmt(k, { day: 'numeric' }) + '</span></td><td class="num' + (x.n > x.target * 1.1 ? ' rp-hi' : '') + '">' + (x.logged ? ar(Math.round(x.n), 0) : '—') + '</td><td class="num">' + ar(x.done) + '/5</td><td class="num">' + ar(x.water) + '</td><td class="num">' + (x.extrasN ? ar(Math.round(x.extrasN), 0) : '—') + '</td><td>' + pill(x.score, x.logged) + '</td></tr>'; }).join('') +
      '</tbody></table>' + (W.best && W.worst && W.best !== W.worst ? '<p class="note" style="margin:10px 0 0">أفضل يوم: ' + DAYN[dow(W.best.k)] + ' (' + ar(W.best.score) + ') – أقل يوم: ' + DAYN[dow(W.worst.k)] + ' (' + ar(W.worst.score) + ')</p>' : '') + '</div>' +
      '<div class="card"><h2>الأكثر في الأسبوع</h2>' + (top.length ? '<div class="rp-top">' + top.map(function (f) { return '<span>' + A.img(D.FOODS[f].img) + esc(D.FOODS[f].name.split(' (')[0]) + ' <b class="num">×' + ar(W.foods[f]) + '</b></span>'; }).join('') + '</div>' : '<p class="note">لا توجد وجبات مُعلَّمة كمُتناوَلة بعد.</p>') +
        '<div class="hm-lim">' + D.LIMITS.map(function (l) { var v = W.limits[l[0]] || 0, dots = ''; for (var j = 0; j < Math.max(l[2], v); j++) dots += '<i class="' + (j < v ? 'on' : '') + '"></i>'; return '<div class="' + (v > l[2] ? 'over' : v === l[2] ? 'full' : '') + '"><span>' + l[1] + '</span><span class="hm-dots">' + dots + '</span></div>'; }).join('') + '</div></div>';
    return { html: html, text: weekText(W, sugs) };
  }
  function dayText(a, sugs) {
    return 'تقرير خفّة اليومي – ' + A.fmt(a.k, { weekday: 'long', day: 'numeric', month: 'long' }) + '\n' +
      'التقييم: ' + a.score + '/100 (' + verdict(a.score, a.logged) + ')\nالسعرات: ' + Math.round(a.n) + ' من ' + a.target + '\nالوجبات: ' + a.done + ' من 5\nالبروتين: ' + Math.round(a.p) + ' ج\nالماء: ' + a.water + ' زجاجات\n\n' +
      a.meals.map(function (mm) { return (mm.s.done ? '✓ ' : '✗ ') + mm.m.t + ': ' + (mm.title || '—') + (mm.comps.length ? ' (' + Math.round(mm.t.n) + ' سعرة)' : ''); }).join('\n') +
      ((a.day.extras || []).length ? '\nخارج الوجبات: ' + a.day.extras.map(function (x) { return x.name + ' ' + Math.round(x.n * (x.q || 1)); }).join('، ') : '') +
      (sugs.length ? '\n\nاقتراحات:\n' + sugs.map(function (x) { return '- ' + x[2] + ': ' + x[3]; }).join('\n') : '');
  }
  function weekText(W, sugs) {
    return 'تقرير خفّة الأسبوعي – ' + A.fmt(W.keys[0], { day: 'numeric', month: 'long' }) + ' إلى ' + A.fmt(W.keys[6], { day: 'numeric', month: 'long' }) + '\n' +
      'التقييم: ' + W.score + '/100\nمتوسط السعرات: ' + Math.round(W.n) + '\nالالتزام بالوجبات: ' + W.adherence + '%\nمتوسط البروتين: ' + Math.round(W.p) + ' ج\nمتوسط الماء: ' + (Math.round(W.water * 10) / 10) + ' زجاجات\nأيام مسجّلة: ' + W.logged.length + ' من ' + W.days.length +
      (W.w0 && W.w1 ? '\nالوزن: ' + W.w0 + ' ← ' + W.w1 : '') + '\n\n' +
      W.days.map(function (x) { return DAYN[dow(x.k)] + ': ' + (x.logged ? Math.round(x.n) + ' سعرة، ' + x.done + '/5 وجبات، تقييم ' + x.score : 'لا يوجد تسجيل'); }).join('\n') +
      (sugs.length ? '\n\nاقتراحات:\n' + sugs.map(function (x) { return '- ' + x[2] + ': ' + x[3]; }).join('\n') : '');
  }

  function render() {
    if (!A.data || sec.hidden) return;
    var isDay = R.mode === 'day', label, prevOk = true, nextOk;
    if (isDay) { label = R.day === A.TODAY ? 'اليوم' : A.fmt(R.day, { weekday: 'long', day: 'numeric', month: 'short' }); nextOk = R.day < A.TODAY; }
    else { var wk = weekOf(R.week); label = (wk[6] >= A.TODAY && wk[0] <= A.TODAY) ? 'هذا الأسبوع' : A.fmt(wk[0], { day: 'numeric', month: 'short' }) + ' – ' + A.fmt(wk[6], { day: 'numeric', month: 'short' }); nextOk = wk[6] < A.TODAY; }
    var body = isDay ? renderDay() : renderWeek();
    sec.innerHTML = '<div class="card hm-wide"><div class="rp-bar"><div class="seg" style="margin:0"><button data-md="day" aria-pressed="' + isDay + '">يومي</button><button data-md="week" aria-pressed="' + !isDay + '">أسبوعي</button></div>' +
      '<div class="rp-nav"><button id="rpPrev" aria-label="السابق">›</button><b>' + label + '</b><button id="rpNext" aria-label="التالي"' + (nextOk ? '' : ' disabled') + '>‹</button></div></div>' +
      '<div class="rp-act" style="margin-top:12px"><button class="btn ghost sm" id="rpCopy">انسخي التقرير</button>' + (navigator.share ? '<button class="btn ghost sm" id="rpShare">أرسليه</button>' : '') + '<button class="btn ghost sm" id="rpPrint">اطبعي / PDF</button></div></div>' + body.html;
    sec.querySelectorAll('.seg button').forEach(function (b) { b.onclick = function () { R.mode = b.dataset.md; render(); }; });
    d.getElementById('rpPrev').onclick = function () { if (isDay) R.day = A.addDays(R.day, -1); else R.week = A.addDays(weekOf(R.week)[0], -1); render(); };
    d.getElementById('rpNext').onclick = function () { if (isDay) R.day = A.addDays(R.day, 1); else R.week = A.addDays(weekOf(R.week)[6], 1); if (R.week > A.TODAY) R.week = A.TODAY; render(); };
    d.getElementById('rpCopy').onclick = function () { var done = function () { A.toast('تم نسخ التقرير'); }; if (navigator.clipboard) navigator.clipboard.writeText(body.text).then(done, function () { A.toast('تعذّر النسخ'); }); };
    var sh = d.getElementById('rpShare'); if (sh) sh.onclick = function () { navigator.share({ title: 'تقرير خفّة', text: body.text }).catch(function () {}); };
    d.getElementById('rpPrint').onclick = function () {
      if (window.KHIFFA_PRINT) window.KHIFFA_PRINT.print(R.mode, isDay ? R.day : R.week); else window.print();
    };
    sec.querySelectorAll('tr.click').forEach(function (tr) { tr.onclick = function () { R.mode = 'day'; R.day = tr.dataset.k; render(); window.scrollTo(0, 0); }; });
  }

  // shared API for print.js (A4 report)
  window.KHIFFA_REPORTS = { analyzeDay: analyzeDay, analyzeWeek: analyzeWeek, weekOf: weekOf, daySuggestions: daySuggestions, weekSuggestions: weekSuggestions,
    verdict: verdict, kpis: kpis, prevKpis: prevKpis, kpiList: kpiList, lastWeight: lastWeight, DAYN: DAYN, dow: dow };
  (window.KHIFFA_HOOKS = window.KHIFFA_HOOKS || []).push(function () { render(); });
  render();
})();
