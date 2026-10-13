/* خفّة – التقرير المطبوع (A4): رأس بالهوية، مؤشرات، رسم السعرات 14 يومًا، توزيع العناصر، جدول الوجبات، الحدود الأسبوعية، الاقتراحات.
   يعتمد على بيانات reports.js (window.KHIFFA_REPORTS) ولا يكرر التحليل. الطباعة من نفس الصفحة (بدون نافذة جديدة) لتعمل داخل التطبيق المثبّت. */
(function () {
  'use strict';
  var d = document, A = window.KHIFFA_APP; if (!A) return;
  var esc = A.esc;
  var C = { green: '#1FA971', greenSoft: '#E5F6EE', coral: '#FF7A59', coralSoft: '#FFEDE6', ink: '#1D2A25', muted: '#6F7C76', line: '#E3E7E1', bg: '#F6F7F3', gold: '#D9A13A', violet: '#8A6BBF', water: '#3C8DE0', ctx: '#CBE6D8' };
  var n0 = function (v) { return v == null || isNaN(v) ? '—' : Math.round(v).toLocaleString('en-US'); };
  var n1 = function (v) { return v == null || isNaN(v) ? '—' : (Math.round(v * 10) / 10).toLocaleString('en-US', { maximumFractionDigits: 1 }); };
  var chromeV = (navigator.userAgent.match(/Chrom(?:e|ium)\/(\d+)/) || [])[1] | 0;
  var marginBoxes = chromeV >= 131; // @page margin boxes (page numbers) — Chromium 131+

  var css = d.createElement('style'); css.id = 'kp-print-css';
  css.textContent =
    '#kp-print{display:none}' +
    '@page{size:A4;margin:12mm 12mm 15mm}' +
    (marginBoxes ? '@page{@bottom-left{content:"صفحة " counter(page) " من " counter(pages);font:9pt "IBM Plex Sans Arabic",Tahoma,sans-serif;color:#6F7C76}@bottom-right{content:"تقرير صادر من تطبيق خفّة · Khiffa";font:9pt "IBM Plex Sans Arabic",Tahoma,sans-serif;color:#6F7C76}}' : '') +
    '@media print{' +
      'html,body.kp-printing{background:#fff!important;background-image:none!important}' +
      'body.kp-printing>*:not(#kp-print){display:none!important}body.kp-printing::before,body.kp-printing::after{display:none!important}' +
      'body.kp-printing #kp-print{display:block!important}' +
    '}' +
    '#kp-print,#kp-print *{box-sizing:border-box;-webkit-print-color-adjust:exact;print-color-adjust:exact}' +
    '#kp-print{direction:rtl;font-family:var(--f-body,"IBM Plex Sans Arabic"),"IBM Plex Sans Arabic",Tahoma,sans-serif;color:' + C.ink + ';background:#fff;font-size:9.5pt;line-height:1.5;width:100%}' +
    '#kp-print .num{font-variant-numeric:tabular-nums}' +
    '#kp-print .kp-sec{break-inside:avoid;page-break-inside:avoid;margin-top:5mm}' +
    '#kp-print .kp-sec.kp-flow{break-inside:auto;page-break-inside:auto}#kp-print .kp-flow h3{break-after:avoid;page-break-after:avoid}' +
    '#kp-print h3{font-size:11pt;font-weight:700;margin:0 0 2.5mm;display:flex;align-items:center;gap:2mm}' +
    '#kp-print h3::before{content:"";width:1.2mm;height:4.2mm;border-radius:1mm;background:' + C.green + '}' +
    /* header band */
    '#kp-print .kp-head{background:linear-gradient(120deg,' + C.green + ',#168A5C);color:#fff;border-radius:4mm;padding:5mm 6mm;display:flex;justify-content:space-between;align-items:center;gap:6mm}' +
    '#kp-print .kp-brand{font-family:"Reem Kufi",var(--f-body,"IBM Plex Sans Arabic"),Tahoma,sans-serif;font-size:20pt;font-weight:700;line-height:1.1}#kp-print .kp-brand small{display:block;font-family:inherit;font-size:9pt;font-weight:500;opacity:.9;margin-top:1mm}' +
    '#kp-print .kp-title{font-size:13pt;font-weight:700;margin-top:2mm}' +
    '#kp-print .kp-meta{display:grid;grid-template-columns:auto auto;gap:.6mm 4mm;font-size:9pt;text-align:right}#kp-print .kp-meta span{opacity:.85}#kp-print .kp-meta b{font-weight:600}' +
    /* KPI cards */
    '#kp-print .kp-kpis{display:grid;grid-template-columns:repeat(6,minmax(0,1fr));gap:2.5mm;margin-top:5mm}' +
    '#kp-print .kp-kpi{border:0.3mm solid ' + C.line + ';border-radius:3mm;padding:2.5mm 3mm;border-top:1.2mm solid var(--kc);background:#fff}' +
    '#kp-print .kp-kpi .l{font-size:8pt;color:' + C.muted + ';white-space:nowrap}' +
    '#kp-print .kp-kpi .v{font-size:15pt;font-weight:700;line-height:1.25;white-space:nowrap}#kp-print .kp-kpi .v small{font-size:8pt;font-weight:500;color:' + C.muted + ';margin-inline-start:.8mm}' +
    '#kp-print .kp-kpi .s{font-size:7.5pt;color:' + C.muted + ';white-space:nowrap}' +
    '#kp-print .kp-kpi .t{display:inline-block;font-size:7.5pt;font-weight:700;border-radius:2mm;padding:0 1.5mm;margin-top:.8mm}' +
    '#kp-print .kp-kpi .t.up{color:' + C.green + ';background:' + C.greenSoft + '}#kp-print .kp-kpi .t.dn{color:#C9452B;background:' + C.coralSoft + '}#kp-print .kp-kpi .t.eq{color:' + C.muted + ';background:' + C.bg + '}' +
    '#kp-print .kp-verdict{margin-top:3mm;font-size:9.5pt;color:' + C.muted + '}#kp-print .kp-verdict b{color:' + C.ink + '}' +
    /* charts */
    '#kp-print .kp-charts{display:grid;grid-template-columns:2.1fr 1fr;gap:4mm}' +
    '#kp-print .kp-box{border:0.3mm solid ' + C.line + ';border-radius:3mm;padding:3mm 3.5mm}' +
    '#kp-print svg{display:block;width:100%;height:auto;direction:ltr}' +
    '#kp-print .kp-leg{display:flex;flex-wrap:wrap;gap:1mm 4mm;font-size:8pt;color:' + C.muted + ';margin-top:1.5mm}#kp-print .kp-leg i{display:inline-block;width:2.6mm;height:2.6mm;border-radius:.8mm;margin-inline-end:1mm;vertical-align:-.3mm}' +
    '#kp-print .kp-mac{display:grid;grid-template-columns:24mm 1fr;gap:3mm;align-items:center}' +
    '#kp-print .kp-mac table{width:100%;border-collapse:collapse;font-size:8.5pt}#kp-print .kp-mac td{padding:.8mm 0}#kp-print .kp-mac td:last-child{text-align:left;color:' + C.muted + '}' +
    /* tables */
    '#kp-print table.kp-t{width:100%;border-collapse:collapse;font-size:8.3pt;table-layout:fixed}' +
    '#kp-print .kp-t th{background:' + C.bg + ';color:' + C.muted + ';font-weight:600;text-align:right;padding:1.6mm 1.4mm;border-bottom:0.3mm solid ' + C.line + '}' +
    '#kp-print .kp-t td{padding:1.5mm 1.4mm;border-bottom:0.3mm solid ' + C.line + ';vertical-align:top;overflow-wrap:anywhere;white-space:normal;word-break:normal}' +
    '#kp-print .kp-t tr{break-inside:avoid}#kp-print .kp-t tr:nth-child(even) td{background:#FBFCFA}' +
    '#kp-print .kp-t .ok{color:' + C.green + ';font-weight:700}#kp-print .kp-t .no{color:#A9B2AD}#kp-print .kp-t .hi{color:#C9452B;font-weight:700}' +
    '#kp-print .kp-t .k{display:block;color:' + C.muted + ';font-size:7.5pt}' +
    '#kp-print .kp-pill{display:inline-block;min-width:8mm;text-align:center;border-radius:3mm;padding:0 1.5mm;color:#fff;font-weight:700;font-size:8pt}' +
    /* limits */
    '#kp-print .kp-lims{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:2.5mm}' +
    '#kp-print .kp-lim{border:0.3mm solid ' + C.line + ';border-radius:3mm;padding:2mm 2.5mm;font-size:8.5pt}#kp-print .kp-lim b{display:block;font-size:12pt}' +
    '#kp-print .kp-lim.over{border-color:' + C.coral + ';background:' + C.coralSoft + '}#kp-print .kp-lim.full{border-color:' + C.gold + '}' +
    '#kp-print .kp-dots{display:flex;gap:1mm;margin-top:1mm}#kp-print .kp-dots i{width:2.6mm;height:2.6mm;border-radius:50%;background:' + C.line + '}#kp-print .kp-dots i.on{background:' + C.green + '}#kp-print .kp-lim.over .kp-dots i.on{background:' + C.coral + '}' +
    /* suggestions */
    '#kp-print ol.kp-sug{margin:0;padding:0;list-style:none;display:grid;grid-template-columns:1fr 1fr;gap:2.5mm}' +
    '#kp-print .kp-sug li{border-radius:3mm;padding:2.2mm 3mm;background:' + C.bg + ';font-size:8.5pt;break-inside:avoid;border-inline-start:1mm solid ' + C.muted + '}' +
    '#kp-print .kp-sug li.w{background:' + C.coralSoft + ';border-color:' + C.coral + '}#kp-print .kp-sug li.g{background:' + C.greenSoft + ';border-color:' + C.green + '}#kp-print .kp-sug b{display:block;font-size:9pt}' +
    '#kp-print .kp-foot{margin-top:6mm;padding-top:2mm;border-top:0.3mm solid ' + C.line + ';display:flex;justify-content:space-between;font-size:8pt;color:' + C.muted + '}' +
    /* on-screen preview (only used by tests / debugging) */
    'body.kp-preview>*:not(#kp-print){display:none!important}body.kp-preview #kp-print{display:block;max-width:186mm;margin:0 auto;padding:6mm 0}';
  d.head.appendChild(css);

  var box = d.createElement('div'); box.id = 'kp-print'; box.setAttribute('dir', 'rtl'); d.body.appendChild(box);

  function scoreCol(s, logged) { return logged === false ? '#B9C2BD' : s >= 80 ? C.green : s >= 55 ? C.gold : C.coral; }

  /* ---------- charts (inline SVG, fixed colors so they print the same in dark mode) ---------- */
  function kcalChart(endKey, periodStart, target) {
    var R = window.KHIFFA_REPORTS, keys = [];
    for (var i = 13; i >= 0; i--) keys.push(A.addDays(endKey, -i));
    var rows = keys.map(function (k) { var a = k <= A.TODAY ? R.analyzeDay(k) : null; return { k: k, n: a && a.logged ? a.n : null, inP: k >= periodStart }; });
    var W = 520, H = 200, pl = 40, pr = 6, pt = 20, pb = 36, cw = (W - pl - pr) / 14;
    var max = Math.max(target * 1.25, Math.max.apply(null, rows.map(function (r) { return r.n || 0; })) * 1.08);
    var Y = function (v) { return H - pb - v / max * (H - pt - pb); };
    // RTL reading: oldest on the right, newest on the left
    var X = function (i) { return W - pr - (i + 1) * cw; };
    var g = '';
    [0, 0.5, 1].forEach(function (f) { var v = Math.round(target * f / 100) * 100 || 0, y = Y(v); g += '<line x1="' + pl + '" x2="' + (W - pr) + '" y1="' + y.toFixed(1) + '" y2="' + y.toFixed(1) + '" stroke="' + C.line + '" stroke-width="1"/><text x="' + (pl - 5) + '" y="' + (y + 3).toFixed(1) + '" text-anchor="end" font-size="10.5" fill="' + C.muted + '">' + n0(v) + '</text>'; });
    rows.forEach(function (r, i) {
      var x = X(i) + cw * 0.18, bw = cw * 0.64, lab = A.fmt(r.k, { weekday: 'short' }).replace('ال', ''), dn = +r.k.slice(8);
      if (r.n != null) {
        var col = !r.inP ? C.ctx : r.n > target * 1.1 ? C.coral : C.green, y = Y(r.n);
        g += '<rect x="' + x.toFixed(1) + '" y="' + y.toFixed(1) + '" width="' + bw.toFixed(1) + '" height="' + (H - pb - y).toFixed(1) + '" rx="3" fill="' + col + '"/>';
        if (r.inP || rows.length <= 7) g += '<text x="' + (x + bw / 2).toFixed(1) + '" y="' + (y - 4).toFixed(1) + '" text-anchor="middle" font-size="10.5" font-weight="700" fill="' + C.ink + '">' + n0(r.n) + '</text>';
      } else g += '<rect x="' + x.toFixed(1) + '" y="' + (H - pb - 2) + '" width="' + bw.toFixed(1) + '" height="2" fill="' + C.line + '"/>';
      g += '<text x="' + (x + bw / 2).toFixed(1) + '" y="' + (H - pb + 14) + '" text-anchor="middle" font-size="10.5" fill="' + (r.inP ? C.ink : C.muted) + '">' + esc(lab) + '</text>' +
        '<text x="' + (x + bw / 2).toFixed(1) + '" y="' + (H - pb + 27) + '" text-anchor="middle" font-size="9.5" fill="' + C.muted + '">' + dn + '</text>';
    });
    var ty = Y(target);
    g += '<line x1="' + pl + '" x2="' + (W - pr) + '" y1="' + ty.toFixed(1) + '" y2="' + ty.toFixed(1) + '" stroke="' + C.ink + '" stroke-width="1.4" stroke-dasharray="5 4"/>' +
      '<text x="' + (pl + 4) + '" y="' + (ty - 5).toFixed(1) + '" font-size="11" font-weight="700" fill="' + C.ink + '">الهدف ' + n0(target) + '</text>';
    return '<svg viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="السعرات اليومية مقابل الهدف">' + g + '</svg>' +
      '<div class="kp-leg"><span><i style="background:' + C.green + '"></i>ضمن الفترة</span><span><i style="background:' + C.coral + '"></i>أعلى من الهدف بأكثر من 10%</span><span><i style="background:' + C.ctx + '"></i>قبل الفترة (للمقارنة)</span><span><i style="background:' + C.ink + ';height:.5mm;vertical-align:.6mm"></i>الهدف اليومي</span></div>';
  }
  function macroDonut(p, c, f, LT) {
    var kp = p * 4, kc = c * 4, kf = f * 9, t = kp + kc + kf;
    var R0 = 38, CC = 2 * Math.PI * R0, off = 0, seg = '';
    if (t > 0) [[kp, C.coral], [kc, C.gold], [kf, C.violet]].forEach(function (x) { var L = x[0] / t * CC; seg += '<circle cx="50" cy="50" r="' + R0 + '" fill="none" stroke="' + x[1] + '" stroke-width="16" stroke-dasharray="' + L.toFixed(2) + ' ' + (CC - L).toFixed(2) + '" stroke-dashoffset="' + (-off).toFixed(2) + '" transform="rotate(-90 50 50)"/>'; off += L; });
    else seg = '<circle cx="50" cy="50" r="' + R0 + '" fill="none" stroke="' + C.line + '" stroke-width="16"/>';
    var pc = function (v) { return t ? Math.round(v / t * 100) + '%' : '—'; };
    return '<div class="kp-mac"><svg viewBox="0 0 100 100" role="img" aria-label="توزيع السعرات">' + seg + '<text x="50" y="49" text-anchor="middle" font-size="15" font-weight="700" fill="' + C.ink + '">' + n0(t) + '</text><text x="50" y="62" text-anchor="middle" font-size="8" fill="' + C.muted + '">سعرة</text></svg>' +
      '<table><tr><td><span style="color:' + C.coral + '">●</span> بروتين <b class="num">' + pc(kp) + '</b></td><td class="num">' + n0(p) + ' / ' + n0(LT.p) + ' ج</td></tr>' +
      '<tr><td><span style="color:' + C.gold + '">●</span> نشويات <b class="num">' + pc(kc) + '</b></td><td class="num">' + n0(c) + ' / ' + n0(LT.c) + ' ج</td></tr>' +
      '<tr><td><span style="color:' + C.violet + '">●</span> دهون <b class="num">' + pc(kf) + '</b></td><td class="num">' + n0(f) + ' / ' + n0(LT.f) + ' ج</td></tr></table></div>';
  }

  /* ---------- sections ---------- */
  function kpiCards(K, P) {
    var R = window.KHIFFA_REPORTS;
    return '<div class="kp-kpis">' + R.kpiList(K, P).map(function (x, i) {
      var t = x[4] == null ? '' : x[4] === 0 ? '<span class="t eq">= بلا تغيير</span>' : '<span class="t ' + (x[5] ? 'up' : 'dn') + ' num">' + (x[4] > 0 ? '▲ ' : '▼ ') + n1(Math.abs(x[4])) + '</span>';
      return '<div class="kp-kpi" style="--kc:' + x[6].replace('var(--mint)', C.green).replace('var(--peach)', C.coral).replace('var(--bad)', '#E5484D').replace('var(--water)', C.water) + '"><div class="l">' + x[0] + '</div><div class="v num">' + x[1] + (x[2] ? '<small>' + x[2] + '</small>' : '') + '</div><div class="s num">' + x[3] + '</div>' + t + '</div>';
    }).join('') + '</div>';
  }
  function cut(s, n) { s = String(s || ''); return s.length > n ? s.slice(0, n - 1) + '…' : s; }
  function weekTable(W) {
    var R = window.KHIFFA_REPORTS, D = A.D;
    var head = '<tr><th style="width:15%">اليوم</th>' + D.MEALS.map(function (m) { return '<th>' + m.t + '</th>'; }).join('') + '<th style="width:9%">خارج الوجبات</th><th style="width:8%">السعرات</th><th style="width:7%">التقييم</th></tr>';
    var rows = W.keys.map(function (k) {
      var x = W.days.find(function (y) { return y.k === k; }), dl = R.DAYN[R.dow(k)] + '<span class="k num">' + A.fmt(k, { day: 'numeric', month: 'long' }) + '</span>';
      if (!x || !x.logged) return '<tr><td>' + dl + '</td><td colspan="' + (D.MEALS.length + 3) + '" class="no">' + (x ? 'لم يُسجَّل' : 'لم يأتِ بعد') + '</td></tr>';
      return '<tr><td>' + dl + '</td>' + x.meals.map(function (mm) {
        if (!mm.comps.length) return '<td class="no">—</td>';
        return '<td class="' + (mm.s.done ? '' : 'no') + '">' + (mm.s.done ? '<span class="ok">✓</span> ' : '✗ ') + esc(cut(mm.title, 26)) + '<span class="k num' + (mm.s.done && mm.t.n > mm.tgt * 1.2 ? ' hi' : '') + '">' + n0(mm.t.n) + ' سعرة</span></td>';
      }).join('') + '<td class="num">' + (x.extrasN ? n0(x.extrasN) : '—') + '</td><td class="num' + (x.n > x.target * 1.1 ? ' hi' : '') + '"><b>' + n0(x.n) + '</b></td><td><span class="kp-pill num" style="background:' + scoreCol(x.score) + '">' + x.score + '</span></td></tr>';
    }).join('');
    return '<table class="kp-t">' + head + rows + '</table>';
  }
  function dayTable(a) {
    var rows = a.meals.map(function (mm) {
      return '<tr><td>' + mm.m.t + '</td><td>' + (mm.title ? '<b>' + esc(mm.title) + '</b><span class="k">' + mm.comps.map(function (x) { return esc(x.food.name.split(' (')[0]) + ' ' + A.amountText(x.food, x.n); }).join('، ') + '</span>' : '<span class="no">—</span>') + '</td><td class="num' + (mm.s.done && mm.t.n > mm.tgt * 1.2 ? ' hi' : '') + '">' + (mm.comps.length ? n0(mm.t.n) : '—') + '</td><td class="num">' + n0(mm.tgt) + '</td><td>' + (mm.s.done ? '<span class="ok">✓ تم</span>' : '<span class="no">✗ لم يتم</span>') + '</td></tr>';
    }).join('') + (a.day.extras || []).map(function (x) {
      return '<tr><td>خارج الوجبات</td><td>' + esc(x.name) + (x.q && x.q !== 1 ? ' × ' + n1(x.q) : '') + (x.t ? ' <span class="k num" style="display:inline">' + esc(x.t) + '</span>' : '') + '</td><td class="num">' + n0(x.n * (x.q || 1)) + '</td><td class="no">—</td><td><span class="ok">✓</span></td></tr>';
    }).join('');
    return '<table class="kp-t"><tr><th style="width:16%">الوجبة</th><th>ما تم تناوله</th><th style="width:11%">السعرات</th><th style="width:11%">المستهدف</th><th style="width:12%">الحالة</th></tr>' + rows + '</table>';
  }
  function limitsBlock(counts) {
    return '<div class="kp-lims">' + A.D.LIMITS.map(function (l) {
      var v = counts[l[0]] || 0, dots = '';
      for (var j = 0; j < Math.max(l[2], v); j++) dots += '<i class="' + (j < v ? 'on' : '') + '"></i>';
      return '<div class="kp-lim ' + (v > l[2] ? 'over' : v === l[2] ? 'full' : '') + '">' + l[1] + '<b class="num">' + v + ' / ' + l[2] + '</b><div class="kp-dots">' + dots + '</div></div>';
    }).join('') + '</div>';
  }
  function sugBlock(arr) {
    if (!arr.length) return '<p style="margin:0;color:' + C.muted + '">لا توجد ملاحظات؛ كل شيء على ما يرام.</p>';
    return '<ol class="kp-sug">' + arr.slice(0, 8).map(function (x) { return '<li class="' + x[0] + '"><b>' + esc(x[2]) + '</b>' + esc(x[3]) + '</li>'; }).join('') + '</ol>';
  }

  function build(mode, key) {
    var R = window.KHIFFA_REPORTS; if (!R || !A.data) return '';
    var K = R.kpis(mode, key), P = R.prevKpis(mode, key), isDay = mode === 'day';
    var user = (A.data.user && A.data.user.name) || '', now = new Date();
    var period = isDay ? A.fmt(K.start, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
      : A.fmt(K.W.keys[0], { day: 'numeric', month: 'long' }) + ' – ' + A.fmt(K.W.keys[6], { day: 'numeric', month: 'long', year: 'numeric' });
    var sugs = isDay ? R.daySuggestions(K.a) : R.weekSuggestions(K.W, P.W);
    var counts = isDay ? A.weekCounts(key, false) : K.W.limits;
    var verdict = R.verdict(K.score, K.logged);
    var html =
      '<div class="kp-head"><div><div class="kp-brand">خفّة · Khiffa<small>متابعة النظام الغذائي بنظام البدائل</small></div><div class="kp-title">' + (isDay ? 'التقرير اليومي' : 'التقرير الأسبوعي') + '</div></div>' +
        '<div class="kp-meta"><span>الاسم</span><b>' + esc(user) + '</b><span>الفترة</span><b class="num">' + esc(period) + '</b><span>مستوى السعرات</span><b class="num">' + n0(K.kcalT) + ' سعرة</b><span>تاريخ الإصدار</span><b class="num">' + esc(now.toLocaleDateString('ar-u-nu-latn', { day: 'numeric', month: 'long', year: 'numeric' })) + '</b></div></div>' +
      kpiCards(K, P) +
      '<div class="kp-verdict">التقييم العام: <b>' + verdict + '</b>' + (isDay ? '' : ' · أيام مسجّلة <b class="num">' + K.W.logged.length + ' من ' + K.W.days.length + '</b>') + (P.logged ? ' · ' + (isDay ? 'اليوم السابق' : 'الأسبوع السابق') + ' <b class="num">' + P.score + '/100</b> (الأسهم مقارنةً به)' : '') + '</div>' +
      '<div class="kp-sec kp-charts"><div class="kp-box"><h3>السعرات اليومية مقابل الهدف (آخر 14 يومًا)</h3>' + kcalChart(K.end, K.start, K.kcalT) + '</div>' +
        '<div class="kp-box"><h3>توزيع السعرات' + (isDay ? '' : ' (متوسط يومي)') + '</h3>' + macroDonut(K.prot, K.c, K.f, K.LT) + '</div></div>' +
      '<div class="kp-sec kp-flow"><h3>' + (isDay ? 'تفاصيل الوجبات' : 'الوجبات يومًا بيوم') + '</h3>' + (isDay ? dayTable(K.a) : weekTable(K.W)) +
        (isDay && (K.a.day.weight || K.a.day.note) ? '<p style="margin:2mm 0 0;font-size:8.5pt;color:' + C.muted + '">' + (K.a.day.weight ? 'الوزن: <b class="num" style="color:' + C.ink + '">' + n1(K.a.day.weight) + ' كجم</b>' : '') + (K.a.day.note ? (K.a.day.weight ? ' · ' : '') + 'ملاحظة اليوم: ' + esc(K.a.day.note) : '') + '</p>' : '') + '</div>' +
      '<div class="kp-sec"><h3>الحدود الأسبوعية' + (isDay ? ' (حتى هذا اليوم)' : '') + '</h3>' + limitsBlock(counts) + '</div>' +
      '<div class="kp-sec"><h3>الاقتراحات</h3>' + sugBlock(sugs) + '</div>' +
      (marginBoxes ? '' : '<div class="kp-foot"><span>تقرير صادر من تطبيق خفّة · Khiffa</span><span class="num">' + esc(now.toLocaleString('ar-u-nu-latn')) + '</span></div>');
    return html;
  }

  function print(mode, key) {
    var html = build(mode, key); if (!html) { window.print(); return; }
    box.innerHTML = html;
    d.body.classList.add('kp-printing');
    var go = function () { try { window.print(); } catch (e) { A.toast('تعذّرت الطباعة'); } };
    var done = function () { d.body.classList.remove('kp-printing'); window.removeEventListener('afterprint', done); };
    window.addEventListener('afterprint', done);
    // wait for the Arabic web font so the PDF uses it
    if (d.fonts && d.fonts.ready) Promise.race([d.fonts.ready, new Promise(function (r) { setTimeout(r, 1200); })]).then(function () { setTimeout(go, 60); });
    else setTimeout(go, 60);
  }

  window.KHIFFA_PRINT = { print: print, build: build,
    // test/debug helper: render the A4 layout on screen without opening the print dialog
    preview: function (mode, key) { box.innerHTML = build(mode, key); d.body.classList.add('kp-printing', 'kp-preview'); },
    close: function () { d.body.classList.remove('kp-printing', 'kp-preview'); } };
})();
