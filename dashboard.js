/* خفّة – الصفحة الرئيسية: ملخص تفاعلي لليوم والأسبوع والجسم + تبديل الحسابات للمالك */
(function () {
  'use strict';
  var d = document, A = window.KHIFFA_APP; if (!A) return;
  var D = A.D, ar = A.ar, esc = A.esc;

  var css = d.createElement('style');
  css.textContent =
    /* hero */
    '.hm-hero{display:flex;flex-direction:column;gap:16px;background:linear-gradient(160deg,var(--mint-soft),var(--surface) 70%)}' +
    '.hm-top{display:flex;justify-content:space-between;align-items:flex-start;gap:10px;flex-wrap:wrap}' +
    '.hm-top h2{margin:2px 0 0;font-size:22px;line-height:1.3}' +
    '.hm-acc{display:inline-flex;background:var(--surface);border:1px solid var(--line);border-radius:999px;padding:3px;gap:2px}' +
    '.hm-acc button{font:inherit;font-size:13px;border:0;background:none;color:var(--muted);padding:6px 14px;border-radius:999px;cursor:pointer}' +
    '.hm-acc button[aria-pressed="true"]{background:var(--mint);color:#fff;font-weight:600}' +
    '.hm-main{display:grid;grid-template-columns:auto 1fr;gap:18px;align-items:center}' +
    '.hm-ring{width:148px;height:148px;position:relative}' +
    '.hm-ring svg{width:100%;height:100%;transform:rotate(-90deg)}' +
    '.hm-ring .fg{transition:stroke-dashoffset .9s cubic-bezier(.2,.8,.2,1),stroke .3s}' +
    '.hm-ring .c{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center}' +
    '.hm-ring .big{font-size:32px;font-weight:700;line-height:1}' +
    '.hm-ring .sm{font-size:12px;color:var(--muted);margin-top:4px}' +
    '.hm-left{font-size:15px;margin-bottom:10px}.hm-left b{font-size:20px}' +
    '.hm-mac{display:grid;grid-template-columns:58px 1fr auto;gap:8px;align-items:center;font-size:12.5px;margin-top:7px}' +
    '.hm-bar{height:8px;border-radius:8px;background:var(--line);overflow:hidden}' +
    '.hm-bar i{display:block;height:100%;width:0;border-radius:8px;background:var(--mint);transition:width .8s cubic-bezier(.2,.8,.2,1)}' +
    '.hm-bar.warn i{background:var(--warn)}' +
    '.hm-water{display:flex;align-items:center;gap:10px;background:var(--surface);border:1px solid var(--line);border-radius:16px;padding:8px 10px}' +
    '.hm-water .fimg{width:30px;height:30px}' +
    '.hm-water .t{flex:1;font-size:14px}.hm-water .t b{font-size:17px}' +
    '.hm-water .hm-bar{margin-top:4px;height:6px}.hm-water .hm-bar i{background:#3f8fd6}' +
    '.hm-rb{width:38px;height:38px;border-radius:50%;border:1px solid var(--line);background:var(--surface);color:var(--ink);font:inherit;font-size:20px;line-height:1;cursor:pointer}' +
    '.hm-rb.p{background:var(--mint);border-color:var(--mint);color:#fff}' +
    '.hm-rb:active,.hm-day:active,.hm-meal:active{transform:scale(.96)}' +
    /* week strip */
    '.hm-week{display:grid;grid-template-columns:repeat(7,minmax(0,1fr));gap:4px}' +
    '.hm-day{font:inherit;border:0;background:none;color:var(--ink);display:flex;flex-direction:column;align-items:center;gap:4px;padding:6px 0;border-radius:14px;cursor:pointer;transition:background .2s}' +
    '.hm-day:hover{background:var(--bg)}.hm-day.now{background:var(--mint-soft)}' +
    '.hm-day .dn{font-size:11.5px;color:var(--muted)}.hm-day.fut{opacity:.45}' +
    '.hm-day svg{width:36px;height:36px;transform:rotate(-90deg)}' +
    '.hm-day .n{font-size:13px;font-weight:600;margin-top:-30px;height:26px;display:flex;align-items:center}' +
    /* meals */
    '.hm-meals{display:flex;flex-direction:column;gap:8px}' +
    '.hm-meal{display:grid;grid-template-columns:auto 1fr auto;gap:12px;align-items:center;background:var(--bg);border-radius:16px;padding:10px 12px;cursor:pointer;transition:transform .15s,background .2s}' +
    '.hm-meal:hover{background:var(--mint-soft)}' +
    '.hm-meal .fimg.lg{width:44px;height:44px}' +
    '.hm-meal .t{font-weight:600;font-size:14.5px}' +
    '.hm-meal .s{font-size:12.5px;color:var(--muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}' +
    '.hm-meal .pics{display:flex;gap:2px;margin-top:4px}.hm-meal .pics .fimg{width:22px;height:22px}' +
    '.hm-meal.done{background:var(--mint-soft)}.hm-meal.done .t{color:var(--mint)}' +
    '.hm-chk{width:36px;height:36px;border-radius:50%;border:2px solid var(--line);background:var(--surface);color:transparent;font-size:18px;cursor:pointer;display:grid;place-items:center;transition:all .2s}' +
    '.hm-chk.on{background:var(--mint);border-color:var(--mint);color:#fff}' +
    '.hm-chk:disabled{opacity:.4;cursor:default}' +
    '.hm-kc{font-size:12px;color:var(--muted);text-align:center;margin-top:3px}' +
    /* tiles, insights, chart */
    '.hm-sec{display:flex;justify-content:space-between;align-items:baseline;gap:8px;margin-bottom:12px}.hm-sec h2{margin:0}' +
    '.hm-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}' +
    '.hm-tile{background:var(--bg);border-radius:14px;padding:12px;display:flex;flex-direction:column;gap:4px;min-width:0}' +
    '.hm-tile .l{font-size:12px;color:var(--muted)}.hm-tile .v{font-size:22px;font-weight:700;line-height:1.15}.hm-tile .v small{font-size:12.5px;font-weight:500;color:var(--muted)}' +
    '.hm-tile .hm-bar{height:6px;margin-top:4px}' +
    '.hm-ins{display:flex;flex-direction:column;gap:8px}' +
    '.hm-ins div{display:grid;grid-template-columns:auto 1fr;gap:10px;align-items:center;font-size:14px;background:var(--bg);border-radius:12px;padding:10px 12px}' +
    '.hm-ins .fimg{width:26px;height:26px}' +
    '.hm-ins div.w{background:var(--peach-soft)}' +
    '.hm-lim{display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:8px;margin-top:12px}' +
    '.hm-lim div{background:var(--bg);border-radius:12px;padding:8px 10px;font-size:12.5px;display:flex;justify-content:space-between;align-items:center;gap:6px}' +
    '.hm-dots{display:flex;gap:3px}.hm-dots i{width:8px;height:8px;border-radius:50%;background:var(--line)}.hm-dots i.on{background:var(--mint)}' +
    '.hm-lim div.full .hm-dots i.on{background:var(--warn)}.hm-lim div.over{color:var(--bad)}.hm-lim div.over .hm-dots i.on{background:var(--bad)}' +
    '.hm-chartw{position:relative}' +
    '.hm-chart text{fill:var(--muted);font-size:10px;font-family:var(--f-body)}' +
    '.hm-chart .b{cursor:pointer;transition:opacity .2s}.hm-chart .b:hover rect.v{opacity:.75}' +
    '.hm-chart rect.v{transform-box:fill-box;transform-origin:bottom;animation:hmGrow .7s cubic-bezier(.2,.8,.2,1) both}' +
    '@keyframes hmGrow{from{transform:scaleY(0)}to{transform:scaleY(1)}}' +
    '.hm-tip{position:absolute;pointer-events:none;background:var(--ink);color:var(--surface);font-size:12px;padding:4px 8px;border-radius:8px;white-space:nowrap;transform:translate(-50%,-110%);opacity:0;transition:opacity .15s}' +
    '.hm-prog{display:flex;justify-content:space-between;font-size:12px;color:var(--muted);margin-top:6px}' +
    '.hm-spark{width:100%;height:70px;margin-top:10px}' +
    '@media (prefers-reduced-motion:reduce){.hm-ring .fg,.hm-bar i{transition:none}.hm-chart rect.v{animation:none}}' +
    /* fine-tune sheet (app.js) */
    '.tune-sum{background:var(--bg);border-radius:14px;padding:12px;display:flex;flex-direction:column;gap:6px;position:sticky;top:-20px;z-index:1}' +
    '.tune-k b{font-size:22px}.tune-bar{height:8px;border-radius:8px;background:var(--line);overflow:hidden}.tune-bar i{display:block;height:100%;border-radius:8px;transition:width .3s}' +
    '.tune-list{display:flex;flex-direction:column;gap:6px;margin-top:10px}' +
    '.tune-row{display:grid;grid-template-columns:auto 1fr auto auto;grid-template-areas:"img info info x" ". q u u";gap:6px 10px;align-items:center;border:1px solid var(--line);border-radius:14px;padding:8px 10px}' +
    '.tune-row>.fimg{grid-area:img}.tune-row>div:not(.tune-q){grid-area:info}.tune-row .tune-q{grid-area:q}.tune-row .qu{grid-area:u;justify-self:start}.tune-row .qx{grid-area:x}' +
    '.qi{width:64px;text-align:center;font:inherit;font-weight:700;border:1px solid var(--line);border-radius:10px;padding:5px 4px;background:var(--surface);color:var(--ink)}' +
    '.qu{font:inherit;font-size:13px;border:1px dashed var(--mint);color:var(--mint);background:var(--mint-soft);border-radius:999px;padding:4px 12px;cursor:pointer}' +
    '@media (min-width:640px){.tune-row{grid-template-columns:auto 1fr auto auto auto;grid-template-areas:"img info q u x"}}' +
    '.tune-row .nm{font-weight:600;font-size:14px}' +
    '.tune-q{display:flex;align-items:center;gap:6px}.tune-q span{min-width:34px;text-align:center;font-weight:700}' +
    '.qb,.qx{width:32px;height:32px;border-radius:50%;border:1px solid var(--line);background:var(--surface);color:var(--ink);font:inherit;font-size:18px;line-height:1;cursor:pointer}' +
    '.qb[data-d="1"]{background:var(--mint);border-color:var(--mint);color:#fff}.qx{border:0;color:var(--muted)}' +
    '.tune-foot{position:sticky;bottom:-20px;background:var(--surface);padding-block:10px;display:flex;gap:10px;justify-content:flex-end;border-top:1px solid var(--line);margin-top:12px}' +
    /* tablet */
    '@media (min-width:640px){.wrap{max-width:760px;padding-inline:24px}.hm-grid{grid-template-columns:repeat(4,minmax(0,1fr))}.hm-ring{width:168px;height:168px}}' +
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
      'section.view>.hero,section.view>.daynav,section.view>[data-inst],section.view>#meals,section.view>.hm-wide,section.view>#quickAdd{grid-column:1/-1}' +
      '#meals{display:grid!important;grid-template-columns:repeat(2,minmax(0,1fr));gap:18px!important;align-items:start}' +
      '.hm-grid{grid-template-columns:repeat(2,minmax(0,1fr))}' +
      '.sheet-bg{align-items:center;padding:24px}.sheet{max-width:760px;border-radius:20px;max-height:86vh}' +
      '.toast{bottom:28px}' +
    '}' +
    '@media (min-width:1280px){#meals{grid-template-columns:repeat(3,minmax(0,1fr))}}';
  d.head.appendChild(css);

  // section + tab
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

  function go(v) { var b = d.querySelector('#tabs button[data-v="' + v + '"]'); if (b) b.click(); }
  function openDay(k) { A.setCur(k); go('today'); }

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
  function bar(p, warn, style) { return '<div class="hm-bar' + (warn ? ' warn' : '') + '"' + (style ? ' style="' + style + '"' : '') + '><i data-w="' + p.toFixed(1) + '"></i></div>'; }
  function tile(label, value, unit, p, warn) {
    return '<div class="hm-tile"><span class="l">' + label + '</span><span class="v num">' + value + (unit ? ' <small>' + unit + '</small>' : '') + '</span>' + (p != null ? bar(p, warn) : '') + '</div>';
  }
  function mini(p, today) {
    var c = 2 * Math.PI * 15, col = p > 105 ? 'var(--warn)' : 'var(--mint)';
    return '<svg viewBox="0 0 36 36"><circle cx="18" cy="18" r="15" fill="none" stroke="var(--line)" stroke-width="3.5"/>' +
      (p ? '<circle cx="18" cy="18" r="15" fill="none" stroke="' + col + '" stroke-width="3.5" stroke-linecap="round" stroke-dasharray="' + c.toFixed(1) + '" stroke-dashoffset="' + (c * (1 - Math.min(100, p) / 100)).toFixed(1) + '"/>' : '') + '</svg>';
  }

  function chart(days, target) {
    var W = 360, H = 150, pl = 6, pr = 6, pt = 16, pb = 22, n = days.length;
    var max = Math.max(target * 1.25, Math.max.apply(null, days.map(function (x) { return x.n; })) * 1.05);
    var bw = (W - pl - pr) / n, y = function (v) { return pt + (H - pt - pb) * (1 - v / max); };
    var s = '<svg class="chart hm-chart" viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="السعرات آخر 14 يوم">';
    s += '<line x1="' + pl + '" x2="' + (W - pr) + '" y1="' + y(target).toFixed(1) + '" y2="' + y(target).toFixed(1) + '" stroke="var(--peach)" stroke-dasharray="4 3"/>';
    s += '<text x="' + (W - pr) + '" y="' + (y(target) - 4).toFixed(1) + '" text-anchor="start" direction="rtl">الهدف ' + ar(target, 0) + '</text>';
    days.forEach(function (x, i) {
      var cx = W - pr - (i + 1) * bw; // RTL: today on the left
      var over = x.n > target * 1.05, top = x.n ? y(x.n) : H - pb - 3;
      s += '<g class="b" data-k="' + x.date + '" data-n="' + x.n + '" data-x="' + (cx + bw / 2).toFixed(1) + '" data-y="' + top.toFixed(1) + '">' +
        '<rect x="' + cx.toFixed(1) + '" y="' + pt + '" width="' + bw.toFixed(1) + '" height="' + (H - pt - pb) + '" fill="transparent"/>' +
        '<rect class="v" style="animation-delay:' + ((n - i) * 30) + 'ms" x="' + (cx + bw * 0.2).toFixed(1) + '" y="' + top.toFixed(1) + '" width="' + (bw * 0.6).toFixed(1) + '" height="' + Math.max(3, H - pb - top).toFixed(1) + '" rx="4" fill="' + (!x.n ? 'var(--line)' : over ? 'var(--warn)' : i === 0 ? 'var(--peach)' : 'var(--mint)') + '"/></g>';
      if (i % 2 === 0) s += '<text x="' + (cx + bw / 2).toFixed(1) + '" y="' + (H - 6) + '" text-anchor="middle">' + A.fmt(x.date, { day: 'numeric' }) + '</text>';
    });
    return s + '</svg>';
  }
  function spark(pts) {
    if (pts.length < 2) return '';
    var W = 360, H = 70, p = 6, ws = pts.map(function (x) { return x.w; }), mn = Math.min.apply(null, ws), mx = Math.max.apply(null, ws), rg = mx - mn || 1;
    var X = function (i) { return p + (W - 2 * p) * (1 - i / (pts.length - 1)); }, Y = function (v) { return p + (H - 2 * p) * (1 - (v - mn) / rg); };
    var path = pts.map(function (x, i) { return (i ? 'L' : 'M') + X(i).toFixed(1) + ' ' + Y(x.w).toFixed(1); }).join('');
    var last = pts[pts.length - 1];
    return '<svg class="hm-spark" viewBox="0 0 ' + W + ' ' + H + '" preserveAspectRatio="none" aria-hidden="true"><path d="' + path + ' L' + X(pts.length - 1).toFixed(1) + ' ' + H + ' L' + X(0).toFixed(1) + ' ' + H + 'Z" fill="var(--mint-soft)"/><path d="' + path + '" fill="none" stroke="var(--mint)" stroke-width="2.5" vector-effect="non-scaling-stroke" stroke-linejoin="round"/><circle cx="' + X(pts.length - 1).toFixed(1) + '" cy="' + Y(last.w).toFixed(1) + '" r="4" fill="var(--mint)"/></svg>';
  }

  function render() {
    var data = A.data; if (!data || sec.hidden) return;
    var st = A.settings(), target = st.level, LT = A.levelTotals(st.level);
    var today = A.dayOf(A.TODAY), tt = dayTotals(today);
    var h = new Date().getHours(), hello = h < 12 ? 'صباح الخير' : 'مساء الخير';
    var me = data.me || data.user, own = me.id === data.user.id, name = A.displayName();
    var ppl = A.people();

    // week Saturday → Friday
    var back = (A.weekKeys(A.TODAY).length - 1), sat = A.addDays(A.TODAY, -back), wk = [];
    for (var i = 0; i < 7; i++) wk.push(A.addDays(sat, i));
    var past = wk.filter(function (k) { return k <= A.TODAY; }), pDays = past.map(A.dayOf), pLogged = pDays.filter(logged);
    var mealsDone = pDays.reduce(function (s, x) { return s + dayTotals(x).meals; }, 0);
    var adherence = Math.round(pct(mealsDone, past.length * 5));
    var avgKcal = pLogged.length ? Math.round(pLogged.reduce(function (s, x) { return s + dayTotals(x).n; }, 0) / pLogged.length) : 0;
    var avgWater = past.length ? pDays.reduce(function (s, x) { return s + (x.water || 0); }, 0) / past.length : 0;
    var limits = A.weekCounts(A.TODAY, false);

    var streak = 0, k = A.TODAY; if (!logged(A.dayOf(k))) k = A.addDays(k, -1);
    while (logged(A.dayOf(k)) && streak < 400) { streak++; k = A.addDays(k, -1); }

    var wts = (data.days || []).filter(function (x) { return x.weight; }).map(function (x) { return { date: x.date, w: +x.weight }; });
    (data.inbody || []).forEach(function (r) { if (r.weight && !wts.some(function (x) { return x.date === r.date; })) wts.push({ date: r.date, w: +r.weight }); });
    wts.sort(function (a, b) { return a.date < b.date ? -1 : 1; });
    var ib = data.inbody || [], firstIb = ib[0], lastIb = ib[ib.length - 1];
    var start = firstIb ? +firstIb.weight : (wts[0] && wts[0].w), cur = wts.length ? wts[wts.length - 1].w : null;
    var goal = lastIb && lastIb.target_weight ? +lastIb.target_weight : null;
    var before = wts.filter(function (x) { return x.date <= A.addDays(A.TODAY, -7); }).pop();
    var wkChange = before && cur != null ? cur - before.w : null;

    var ch = []; for (i = 0; i < 14; i++) { var key = A.addDays(A.TODAY, -i); ch.push({ date: key, n: Math.round(dayTotals(A.dayOf(key)).n) }); }

    var left = Math.round(target - tt.n), ins = [];
    if (tt.meals === 0 && !(today.extras || []).length) ins.push(['', 'sunrise', 'لسه ما سجلتيش أكل النهارده. دوسي على الفطور تحت وابدئي.']);
    else if (left > 0) ins.push(['', 'bullseye', 'فاضل لك ' + ar(left, 0) + ' سعرة النهارده.']);
    else if (left < -80) ins.push(['w', 'warning', 'عدّيتي هدف النهارده بـ ' + ar(-left, 0) + ' سعرة. خلّي باقي اليوم خضار وماية.']);
    if (h >= 15 && (today.water || 0) < st.water / 2) ins.push(['w', 'droplet', 'الماية لسه ' + ar(today.water || 0) + ' من ' + ar(st.water) + ' أكواب، ولسه فاضل نص اليوم.']);
    if (tt.meals >= 3 && tt.p < LT.p * 0.5) ins.push(['w', 'poultry_leg', 'البروتين النهارده قليل. اختاري عشا فيه دجاج أو سمك أو جبن قريش.']);
    D.LIMITS.forEach(function (l) { if ((limits[l[0]] || 0) >= l[2]) ins.push(['w', 'stop_sign', 'خلّصتي حد ' + l[1] + ' للأسبوع ده (' + ar(l[2]) + ' مرات).']); });
    if (streak >= 3) ins.push(['', 'fire', 'ملتزمة ' + ar(streak) + ' أيام ورا بعض. كمّلي!']);
    if (wkChange != null && wkChange < 0) ins.push(['', 'party_popper', 'نزلتي ' + ar(-wkChange) + ' كجم في آخر أسبوع.']);

    var R = 62, C = 2 * Math.PI * R, ringP = Math.min(1, tt.n / target), overT = tt.n > target * 1.05;
    var macro = function (lbl, v, t, col) { return '<div class="hm-mac"><span>' + lbl + '</span><div class="hm-bar"><i data-w="' + pct(v, t).toFixed(1) + '" style="background:' + col + '"></i></div><span class="num note">' + ar(Math.round(v), 0) + '/' + ar(Math.round(t), 0) + ' ج</span></div>'; };

    var html =
      '<div class="card hm-hero hm-wide">' +
        '<div class="hm-top"><div><div class="eyebrow">' + new Date().toLocaleDateString('ar-EG', { weekday: 'long', day: 'numeric', month: 'long' }) + ' – نظام ' + ar(target, 0) + '</div>' +
          '<h2>' + (own ? hello + ' يا ' + esc(name) : 'بيانات ' + esc(name)) + '</h2>' + (own ? '' : '<div class="note">' + hello + ' يا ' + esc(me.name) + '، بتتابع حسابها دلوقتي</div>') + '</div>' +
          (ppl.length > 1 ? '<div class="hm-acc" role="group" aria-label="الحساب">' + ppl.map(function (p) { return '<button data-u="' + esc(p.id) + '" aria-pressed="' + (p.id === data.user.id) + '">' + esc(p.id === me.id ? 'حسابي' : (p.name === 'زوجتي' ? 'زوجتي وحبيبتي' : p.name)) + '</button>'; }).join('') + '</div>' : '') +
        '</div>' +
        '<div class="hm-main"><div class="hm-ring"><svg viewBox="0 0 140 140"><circle cx="70" cy="70" r="' + R + '" fill="none" stroke="var(--surface)" stroke-width="13"/><circle class="fg" cx="70" cy="70" r="' + R + '" fill="none" stroke="' + (overT ? 'var(--warn)' : 'var(--mint)') + '" stroke-width="13" stroke-linecap="round" stroke-dasharray="' + C.toFixed(1) + '" stroke-dashoffset="' + C.toFixed(1) + '" data-o="' + (C * (1 - ringP)).toFixed(1) + '"/></svg>' +
          '<div class="c"><span class="big num">' + ar(Math.round(tt.n), 0) + '</span><span class="sm">من ' + ar(target, 0) + ' سعرة</span></div></div>' +
          '<div><div class="hm-left">' + (left >= 0 ? 'فاضل <b class="num">' + ar(left, 0) + '</b> سعرة' : 'زيادة <b class="num" style="color:var(--warn)">' + ar(-left, 0) + '</b> سعرة') + '</div>' +
            macro('بروتين', tt.p, LT.p, 'var(--peach)') + macro('نشويات', tt.c, LT.c, '#d4a13a') + macro('دهون', tt.f, LT.f, '#8a6bbf') + '</div></div>' +
        '<div class="hm-water">' + A.img('droplet') + '<div class="t">ماية <b class="num">' + ar(today.water || 0) + '</b> من ' + ar(st.water) + ' أكواب' + bar(pct(today.water || 0, st.water)) + '</div>' +
          '<button class="hm-rb" id="hmWm" aria-label="شيلي كوب">−</button><button class="hm-rb p" id="hmWp" aria-label="اشربي كوب">+</button></div>' +
      '</div>' +

      '<div class="card hm-wide"><div class="hm-sec"><h2>الأسبوع</h2><span class="note">دوسي على أي يوم تفتحيه</span></div><div class="hm-week">' +
        wk.map(function (k) { var t = dayTotals(A.dayOf(k)), p = pct(t.n, target) * (t.n > target ? target / t.n * 1.06 : 1); return '<button class="hm-day' + (k === A.TODAY ? ' now' : '') + (k > A.TODAY ? ' fut' : '') + '" data-k="' + k + '"><span class="dn">' + A.fmt(k, { weekday: 'short' }) + '</span>' + mini(t.n ? pct(t.n, target) : 0) + '<span class="n num">' + A.fmt(k, { day: 'numeric' }) + '</span></button>'; }).join('') +
      '</div></div>' +

      '<div class="card"><div class="hm-sec"><h2>وجبات النهارده</h2><span class="note num">' + ar(tt.meals) + ' من 5</span></div><div class="hm-meals">' +
        D.MEALS.map(function (m) {
          var s = A.mealState(today, m.k), comps = A.mealComps(m.k, s), t = A.totals(comps);
          var idea = s.mode !== 'custom' && s.idea ? D.IDEAS.find(function (x) { return x.id === s.idea; }) : null;
          var sub = comps.length ? (s.title || (idea ? A.ideaName(idea) : comps.map(function (x) { return x.food.name.split(' (')[0]; }).join('، '))) : 'لسه ما اخترتيش – دوسي واختاري';
          return '<div class="hm-meal' + (s.done ? ' done' : '') + '" data-m="' + m.k + '" role="button" tabindex="0">' + A.img(m.img, 'lg') +
            '<div style="min-width:0"><div class="t">' + m.t + '</div><div class="s">' + esc(sub) + '</div>' + (comps.length ? '<div class="pics">' + comps.slice(0, 5).map(function (x) { return A.img(x.food.img, 'sm'); }).join('') + '</div>' : '') + '</div>' +
            '<div><button class="hm-chk' + (s.done ? ' on' : '') + '" data-c="' + m.k + '" aria-label="خلّصت ' + m.t + '"' + (comps.length ? '' : ' disabled') + '>✓</button>' + (comps.length ? '<div class="hm-kc num">' + ar(Math.round(t.n), 0) + '</div>' : '') + '</div></div>';
        }).join('') +
      '</div></div>' +

      (ins.length ? '<div class="card"><h2>ملاحظات</h2><div class="hm-ins">' + ins.slice(0, 4).map(function (x) { return '<div class="' + x[0] + '">' + A.img(x[1]) + '<span>' + x[2] + '</span></div>'; }).join('') + '</div></div>' : '') +

      '<div class="card"><div class="hm-sec"><h2>الأسبوع ده</h2><span class="note">من السبت</span></div><div class="hm-grid">' +
        tile('الالتزام بالوجبات', ar(adherence, 0) + '%', '', adherence, adherence < 60) +
        tile('متوسط السعرات', avgKcal ? ar(avgKcal, 0) : '—', avgKcal ? 'في اليوم' : 'لسه مفيش', avgKcal ? pct(avgKcal, target) : null, avgKcal > target * 1.05) +
        tile('متوسط الماية', ar(Math.round(avgWater * 10) / 10), 'كوب', pct(avgWater, st.water), avgWater < st.water * 0.6) +
        tile('أيام ورا بعض', ar(streak), streak === 1 ? 'يوم' : 'أيام', null) +
      '</div><div class="hm-lim">' +
        D.LIMITS.map(function (l) { var v = limits[l[0]] || 0, dots = ''; for (var j = 0; j < Math.max(l[2], v); j++) dots += '<i class="' + (j < v ? 'on' : '') + '"></i>'; return '<div class="' + (v > l[2] ? 'over' : v === l[2] ? 'full' : '') + '"><span>' + l[1] + '</span><span class="hm-dots" title="' + ar(v) + ' من ' + ar(l[2]) + '">' + dots + '</span></div>'; }).join('') +
      '</div></div>' +

      '<div class="card"><div class="hm-sec"><h2>السعرات آخر أسبوعين</h2><span class="note">دوسي على اليوم</span></div><div class="hm-chartw">' + chart(ch, target) + '<div class="hm-tip" id="hmTip"></div></div></div>' +

      '<div class="card"><div class="hm-sec"><h2>الجسم</h2><button class="btn ghost sm" id="hmGoBody">التفاصيل</button></div><div class="hm-grid">' +
        tile('الوزن الحالي', cur != null ? ar(cur) : '—', 'كجم', null) +
        tile('من البداية', cur != null && start ? (cur - start > 0 ? '+' : '−') + ar(Math.abs(cur - start)) : '—', 'كجم', null) +
        tile('نسبة الدهون', lastIb && lastIb.pbf ? ar(lastIb.pbf) + '%' : '—', lastIb ? 'آخر InBody' : '', null) +
        tile('الدهون الحشوية', lastIb && lastIb.vfl ? ar(lastIb.vfl) : '—', 'الطبيعي أقل من 10', null) +
      '</div>' + spark(wts.slice(-20)) +
      (goal && start && cur != null ? '<div style="margin-top:12px"><div class="eyebrow">الطريق للوزن المستهدف (' + ar(goal) + ' كجم)</div>' + bar(pct(start - cur, start - goal), false, 'height:10px') +
        '<div class="hm-prog"><span class="num">البداية ' + ar(start) + '</span><span class="num">فاضل ' + ar(Math.max(0, cur - goal)) + ' كجم</span><span class="num">الهدف ' + ar(goal) + '</span></div></div>' : '') +
      '</div>';
    sec.innerHTML = html;

    // animate in
    requestAnimationFrame(function () { requestAnimationFrame(function () {
      sec.querySelectorAll('[data-w]').forEach(function (el) { el.style.width = el.dataset.w + '%'; });
      var fg = sec.querySelector('.hm-ring .fg'); if (fg) fg.setAttribute('stroke-dashoffset', fg.dataset.o);
    }); });

    // interactions
    sec.querySelectorAll('.hm-acc button').forEach(function (b) { b.onclick = function () { A.switchUser(b.dataset.u); }; });
    var water = function (dlt) { var x = A.dayOf(A.TODAY); x.water = Math.max(0, Math.min(st.water + 6, (x.water || 0) + dlt)); A.saveDay(Object.assign({}, x)); if (dlt > 0 && x.water === st.water) A.toast('برافو! خلّصتي الماية النهارده'); A.refresh(); };
    d.getElementById('hmWp').onclick = function () { water(1); };
    d.getElementById('hmWm').onclick = function () { water(-1); };
    sec.querySelectorAll('.hm-day').forEach(function (b) { b.onclick = function () { openDay(b.dataset.k); }; });
    sec.querySelectorAll('.hm-chk').forEach(function (b) { b.onclick = function (e) {
      e.stopPropagation(); var s = A.mealState(A.dayOf(A.TODAY), b.dataset.c);
      A.setMeal(b.dataset.c, { done: !s.done, planned: false }, A.TODAY); if (!s.done) A.toast('بالهنا والشفا'); A.refresh();
    }; });
    sec.querySelectorAll('.hm-meal').forEach(function (row) {
      var open = function () { var m = D.MEALS.find(function (x) { return x.k === row.dataset.m; }); A.setCur(A.TODAY); A.openMealSheet(m, A.mealComps(m.k, A.mealState(A.dayOf(A.TODAY), m.k)).length ? 'tune' : 'idea'); };
      row.onclick = open; row.onkeydown = function (e) { if (e.key === 'Enter') open(); };
    });
    var tip = d.getElementById('hmTip'), wrapC = sec.querySelector('.hm-chartw'), svg = wrapC.querySelector('svg');
    wrapC.querySelectorAll('.b').forEach(function (g) {
      var show = function () { var r = svg.getBoundingClientRect(), sx = r.width / 360, sy = r.height / 150; tip.textContent = A.fmt(g.dataset.k, { weekday: 'long', day: 'numeric' }) + ' – ' + (+g.dataset.n ? ar(+g.dataset.n, 0) + ' سعرة' : 'مفيش تسجيل'); tip.style.left = (+g.dataset.x * sx) + 'px'; tip.style.top = (+g.dataset.y * sy) + 'px'; tip.style.opacity = 1; };
      g.onmouseenter = show; g.onmouseleave = function () { tip.style.opacity = 0; };
      g.onclick = function () { openDay(g.dataset.k); };
    });
    d.getElementById('hmGoBody').onclick = function () { go('body'); };
  }

  (window.KHIFFA_HOOKS = window.KHIFFA_HOOKS || []).push(function () { render(); });
  render();
})();
