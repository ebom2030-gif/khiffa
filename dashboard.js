/* خفّة – home dashboard: today, this week, and body progress at a glance */
(function () {
  'use strict';
  var d = document, A = window.KHIFFA_APP; if (!A) return;
  var D = A.D, ar = A.ar, esc = A.esc;

  var css = d.createElement('style');
  css.textContent =
    '.hm-hello{display:flex;justify-content:space-between;align-items:flex-end;gap:10px}' +
    '.hm-hello h2{margin:0;font-size:22px}' +
    '.hm-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}' +
    '.hm-tile{background:var(--bg);border:1px solid var(--line);border-radius:14px;padding:12px;display:flex;flex-direction:column;gap:4px;min-width:0}' +
    '.hm-tile .l{font-size:12px;color:var(--muted)}' +
    '.hm-tile .v{font-size:24px;font-weight:700;line-height:1.1}' +
    '.hm-tile .v small{font-size:13px;font-weight:500;color:var(--muted)}' +
    '.hm-bar{height:6px;border-radius:6px;background:var(--mint-soft);overflow:hidden;margin-top:4px}' +
    '.hm-bar i{display:block;height:100%;background:var(--mint);border-radius:6px}' +
    '.hm-bar.warn i{background:var(--warn)}' +
    '.hm-sec{display:flex;justify-content:space-between;align-items:baseline;gap:8px;margin-bottom:10px}' +
    '.hm-sec h2{margin:0}' +
    '.hm-ins{display:flex;flex-direction:column;gap:8px}' +
    '.hm-ins div{display:grid;grid-template-columns:auto 1fr;gap:10px;align-items:start;font-size:14px;background:var(--bg);border-radius:12px;padding:10px 12px}' +
    '.hm-ins i{width:8px;height:8px;border-radius:50%;margin-top:7px;background:var(--mint)}' +
    '.hm-ins i.w{background:var(--warn)}' +
    '.hm-chart text{fill:var(--muted);font-size:10px;font-family:var(--f-body)}' +
    '.hm-prog{display:flex;justify-content:space-between;font-size:12px;color:var(--muted);margin-top:6px}' +
    '.hm-limits{display:flex;flex-wrap:wrap;gap:6px}' +
    '.hm-limits span{font-size:12.5px;border:1px solid var(--line);border-radius:20px;padding:2px 10px}' +
    '.hm-limits span.full{border-color:var(--warn);color:var(--warn)}' +
    '.hm-limits span.over{border-color:var(--bad);color:var(--bad)}' +
    /* tablet */
    '@media (min-width:640px){.wrap{max-width:760px;padding-inline:24px}.hm-grid{grid-template-columns:repeat(4,minmax(0,1fr))}}' +
    /* desktop: side navigation + two-column content */
    '@media (min-width:960px){' +
      '.wrap{max-width:1240px;padding-inline:32px;padding-inline-start:252px;padding-block:0 40px}' +
      'header{padding-block:22px 16px}' +
      'nav.tabs{inset:0 0 0 auto;width:220px;flex-direction:column;justify-content:flex-start;gap:4px;border-top:0;border-inline-start:1px solid var(--line);padding:96px 12px 12px}' +
      'nav.tabs button{flex:0 0 auto;max-width:none;text-align:right;padding:12px 16px;border-radius:12px;font-size:15px}' +
      'nav.tabs button[aria-selected="true"]{background:var(--mint-soft)}' +
      'nav.tabs::before{content:"خفّة";position:absolute;top:24px;right:28px;font-family:var(--f-display);font-size:30px;font-weight:700;color:var(--mint)}' +
      'header .logo{visibility:hidden}' +
      'section.view{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:18px;align-items:start}' +
      'section.view>.hero,section.view>.daynav,section.view>[data-inst],section.view>#meals,section.view>.hm-hello,section.view>.hm-wide,section.view>#quickAdd{grid-column:1/-1}' +
      '#meals{display:grid!important;grid-template-columns:repeat(2,minmax(0,1fr));gap:18px!important;align-items:start}' +
      '.hm-grid{grid-template-columns:repeat(2,minmax(0,1fr))}' +
      '.sheet-bg{align-items:center;padding:24px}.sheet{max-width:760px;border-radius:20px;max-height:86vh}' +
      '.toast{bottom:28px}' +
    '}' +
    '@media (min-width:1280px){#meals{grid-template-columns:repeat(3,minmax(0,1fr))}}';
  d.head.appendChild(css);

  // new section + tab
  var sec = d.createElement('section'); sec.className = 'view'; sec.id = 'v-home'; sec.hidden = true;
  var first = d.getElementById('v-today'); first.parentNode.insertBefore(sec, first);
  var tabs = d.getElementById('tabs');
  var btn = d.createElement('button'); btn.setAttribute('role', 'tab'); btn.dataset.v = 'home'; btn.setAttribute('aria-selected', 'false'); btn.textContent = 'الرئيسية';
  tabs.insertBefore(btn, tabs.firstChild);
  btn.onclick = function () {
    d.querySelectorAll('#tabs button').forEach(function (x) { x.setAttribute('aria-selected', x === btn); });
    d.querySelectorAll('section.view').forEach(function (v) { v.hidden = v.id !== 'v-home'; });
    try { localStorage.setItem('khiffa.tab', '"home"'); } catch (e) {}
    window.scrollTo(0, 0); render();
  };
  var saved = null; try { saved = JSON.parse(localStorage.getItem('khiffa.tab')); } catch (e) {}
  if (!saved || saved === 'home') btn.click();

  function dayTotals(day) {
    var t = { n: 0, p: 0, c: 0, f: 0, meals: 0 };
    D.MEALS.forEach(function (m) {
      var st = A.mealState(day, m.k); if (!st.done) return; t.meals++;
      var x = A.totals(A.mealComps(m.k, st)); t.n += x.n; t.p += x.p; t.c += x.c; t.f += x.f;
    });
    (day.extras || []).forEach(function (x) { var q = x.q || 1; t.n += x.n * q; t.p += (x.p || 0) * q; t.c += (x.c || 0) * q; t.f += (x.f || 0) * q; });
    return t;
  }
  function logged(day) { var t = dayTotals(day); return t.meals > 0 || (day.extras || []).length > 0; }
  function pct(a, b) { return b ? Math.max(0, Math.min(100, a / b * 100)) : 0; }
  function tile(label, value, unit, bar, warn) {
    return '<div class="hm-tile"><span class="l">' + label + '</span><span class="v num">' + value + (unit ? ' <small>' + unit + '</small>' : '') + '</span>' +
      (bar != null ? '<div class="hm-bar' + (warn ? ' warn' : '') + '"><i style="width:' + bar + '%"></i></div>' : '') + '</div>';
  }

  function barChart(days, target) {
    var W = 340, H = 130, pl = 6, pr = 6, pt = 14, pb = 20, n = days.length;
    var max = Math.max(target * 1.25, Math.max.apply(null, days.map(function (x) { return x.n; })) * 1.05);
    var bw = (W - pl - pr) / n, y = function (v) { return pt + (H - pt - pb) * (1 - v / max); };
    var s = '<svg class="chart hm-chart" viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="السعرات آخر ١٤ يوم">';
    s += '<line x1="' + pl + '" x2="' + (W - pr) + '" y1="' + y(target).toFixed(1) + '" y2="' + y(target).toFixed(1) + '" stroke="var(--peach)" stroke-dasharray="4 3"/>';
    s += '<text x="' + (W - pr) + '" y="' + (y(target) - 4).toFixed(1) + '" text-anchor="end">الهدف ' + ar(target, 0) + '</text>';
    days.forEach(function (x, i) {
      var cx = W - pr - (i + 1) * bw; // RTL: today on the left edge, oldest on the right
      var h = x.n ? (H - pb) - y(x.n) : 0;
      var over = x.n > target * 1.05;
      if (x.n) s += '<rect x="' + (cx + bw * 0.18).toFixed(1) + '" y="' + y(x.n).toFixed(1) + '" width="' + (bw * 0.64).toFixed(1) + '" height="' + Math.max(1, h).toFixed(1) + '" rx="3" fill="' + (over ? 'var(--warn)' : 'var(--mint)') + '"/>';
      else s += '<rect x="' + (cx + bw * 0.18).toFixed(1) + '" y="' + (H - pb - 2) + '" width="' + (bw * 0.64).toFixed(1) + '" height="2" rx="1" fill="var(--line)"/>';
      if (i % 2 === 0) s += '<text x="' + (cx + bw / 2).toFixed(1) + '" y="' + (H - 6) + '" text-anchor="middle">' + A.fmt(x.date, { day: 'numeric' }) + '</text>';
    });
    return s + '</svg>';
  }

  function render() {
    var data = A.data; if (!data || sec.hidden) return;
    var st = A.settings(), target = st.level, LT = A.levelTotals(st.level);
    var today = A.dayOf(A.TODAY), tt = dayTotals(today);
    var h = new Date().getHours();
    var hello = h < 12 ? 'صباح الخير' : 'مساء الخير';

    // week = Saturday → today
    var wk = A.weekKeys(A.TODAY).reverse();
    var wDays = wk.map(A.dayOf), wLogged = wDays.filter(logged);
    var wMealsDone = wDays.reduce(function (s, x) { return s + dayTotals(x).meals; }, 0);
    var adherence = Math.round(pct(wMealsDone, wk.length * 5));
    var avgKcal = wLogged.length ? Math.round(wLogged.reduce(function (s, x) { return s + dayTotals(x).n; }, 0) / wLogged.length) : 0;
    var avgWater = wk.length ? wDays.reduce(function (s, x) { return s + (x.water || 0); }, 0) / wk.length : 0;
    var limits = A.weekCounts(A.TODAY, false);

    // streak
    var streak = 0, k = A.TODAY; if (!logged(A.dayOf(k))) k = A.addDays(k, -1);
    while (logged(A.dayOf(k)) && streak < 400) { streak++; k = A.addDays(k, -1); }

    // weight
    var wts = (data.days || []).filter(function (x) { return x.weight; }).map(function (x) { return { date: x.date, w: +x.weight }; });
    (data.inbody || []).forEach(function (r) { if (r.weight && !wts.some(function (x) { return x.date === r.date; })) wts.push({ date: r.date, w: +r.weight }); });
    wts.sort(function (a, b) { return a.date < b.date ? -1 : 1; });
    var ib = (data.inbody || []), firstIb = ib[0], lastIb = ib[ib.length - 1];
    var start = firstIb ? +firstIb.weight : (wts[0] && wts[0].w), cur = wts.length ? wts[wts.length - 1].w : null;
    var goal = lastIb && lastIb.target_weight ? +lastIb.target_weight : null;
    var weekAgo = A.addDays(A.TODAY, -7), before = wts.filter(function (x) { return x.date <= weekAgo; }).pop();
    var wkChange = before && cur != null ? cur - before.w : null;

    // 14 days chart
    var ch = []; for (var i = 0; i < 14; i++) { var key = A.addDays(A.TODAY, -i); ch.push({ date: key, n: Math.round(dayTotals(A.dayOf(key)).n) }); }

    // insights
    var ins = [];
    var left = Math.round(target - tt.n);
    if (tt.meals === 0 && !(today.extras || []).length) ins.push(['', 'لسه ما سجلتيش أكل النهارده. ابدئي بالفطار من صفحة اليوم.']);
    else if (left > 0) ins.push(['', 'فاضل لك ' + ar(left, 0) + ' سعرة النهارده.']);
    else if (left < -80) ins.push(['w', 'عدّيتي هدف النهارده بـ' + ar(-left, 0) + ' سعرة. خلّي باقي اليوم خضار وماية.']);
    if (h >= 15 && (today.water || 0) < st.water / 2) ins.push(['w', 'الماية لسه ' + ar(today.water || 0) + ' من ' + ar(st.water) + ' أكواب، ولسه فاضل نص اليوم.']);
    if (tt.meals >= 3 && tt.p < LT.p * 0.5) ins.push(['w', 'البروتين النهارده قليل. اختاري عشا فيه دجاج أو سمك أو جبن قريش.']);
    D.LIMITS.forEach(function (l) { if ((limits[l[0]] || 0) >= l[2]) ins.push(['w', 'خلّصتي حد ' + l[1] + ' للأسبوع ده (' + ar(l[2]) + ' مرات).']); });
    if (streak >= 3) ins.push(['', 'ملتزمة ' + ar(streak) + ' أيام ورا بعض. كمّلي!']);
    if (wkChange != null && wkChange < 0) ins.push(['', 'نزلتي ' + ar(-wkChange) + ' كجم في آخر أسبوع.']);

    sec.innerHTML =
      '<div class="hm-hello"><div><div class="eyebrow">' + new Date().toLocaleDateString('ar-EG', { weekday: 'long', day: 'numeric', month: 'long' }) + '</div><h2>' + hello + '، ' + esc((data.me || data.user).name) + '</h2>' + (data.me && data.me.id !== data.user.id ? '<div class="eyebrow">بتتابع بيانات: ' + esc(data.user.name) + '</div>' : '') + '</div>' +
      '<span class="note num">نظام ' + ar(target, 0) + '</span></div>' +

      '<div class="card"><div class="hm-sec"><h2>النهارده</h2><button class="btn ghost sm" id="hmGoToday">سجّلي</button></div><div class="hm-grid">' +
        tile('السعرات', ar(Math.round(tt.n), 0), 'من ' + ar(target, 0), pct(tt.n, target), tt.n > target * 1.05) +
        tile('الوجبات', ar(tt.meals), 'من ٥', pct(tt.meals, 5)) +
        tile('البروتين', ar(Math.round(tt.p), 0), 'من ' + ar(Math.round(LT.p), 0) + ' ج', pct(tt.p, LT.p)) +
        tile('الماية', ar(today.water || 0), 'من ' + ar(st.water) + ' أكواب', pct(today.water || 0, st.water)) +
      '</div></div>' +

      (ins.length ? '<div class="card"><h2>ملاحظات</h2><div class="hm-ins">' + ins.slice(0, 4).map(function (x) { return '<div><i class="' + x[0] + '"></i><span>' + x[1] + '</span></div>'; }).join('') + '</div></div>' : '') +

      '<div class="card"><div class="hm-sec"><h2>الأسبوع ده</h2><span class="note">من السبت</span></div><div class="hm-grid">' +
        tile('الالتزام بالوجبات', ar(adherence, 0) + '٪', '', adherence, adherence < 60) +
        tile('متوسط السعرات', avgKcal ? ar(avgKcal, 0) : '—', avgKcal ? 'في اليوم' : 'لسه مفيش تسجيل', avgKcal ? pct(avgKcal, target) : null, avgKcal > target * 1.05) +
        tile('متوسط الماية', ar(Math.round(avgWater * 10) / 10), 'كوب في اليوم', pct(avgWater, st.water), avgWater < st.water * 0.6) +
        tile('أيام ورا بعض', ar(streak), streak === 1 ? 'يوم' : 'أيام', null) +
      '</div><div class="hm-limits" style="margin-top:10px">' +
        D.LIMITS.map(function (l) { var v = limits[l[0]] || 0; return '<span class="' + (v > l[2] ? 'over' : v === l[2] ? 'full' : '') + '">' + l[1] + ' ' + ar(v) + ' من ' + ar(l[2]) + '</span>'; }).join('') +
      '</div></div>' +

      '<div class="card hm-wide"><div class="hm-sec"><h2>السعرات آخر أسبوعين</h2></div>' + barChart(ch, target) + '</div>' +

      '<div class="card"><div class="hm-sec"><h2>الجسم</h2><button class="btn ghost sm" id="hmGoBody">التفاصيل</button></div><div class="hm-grid">' +
        tile('الوزن الحالي', cur != null ? ar(cur) : '—', 'كجم', null) +
        tile('التغيير من البداية', cur != null && start ? (cur - start > 0 ? '+' : '−') + ar(Math.abs(cur - start)) : '—', 'كجم', null) +
        tile('نسبة الدهون', lastIb && lastIb.pbf ? ar(lastIb.pbf) + '٪' : '—', lastIb ? 'آخر InBody' : '', null) +
        tile('الدهون الحشوية', lastIb && lastIb.vfl ? ar(lastIb.vfl) : '—', 'الطبيعي أقل من ١٠', null) +
      '</div>' +
      (goal && start && cur != null ? '<div style="margin-top:12px"><div class="eyebrow">الطريق للوزن المستهدف (' + ar(goal) + ' كجم)</div><div class="hm-bar" style="height:10px"><i style="width:' + pct(start - cur, start - goal).toFixed(1) + '%"></i></div>' +
        '<div class="hm-prog"><span class="num">البداية ' + ar(start) + '</span><span class="num">فاضل ' + ar(Math.max(0, cur - goal)) + ' كجم</span><span class="num">الهدف ' + ar(goal) + '</span></div></div>' : '') +
      '</div>';

    d.getElementById('hmGoToday').onclick = function () { d.querySelector('#tabs button[data-v="today"]').click(); };
    d.getElementById('hmGoBody').onclick = function () { d.querySelector('#tabs button[data-v="body"]').click(); };
  }

  (window.KHIFFA_HOOKS = window.KHIFFA_HOOKS || []).push(function () { render(); });
  render();
})();
