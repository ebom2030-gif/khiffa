/* خفّة – InBody: رفع صورة ورقة النتائج وقراءتها على الجهاز (tesseract.js) + مسميات الورقة عربي/إنجليزي + تعديل قياس سابق.
   لا يحفظ أي شيء تلقائيًا: يملأ الخانات فقط، والحفظ من زر "حفظ القياس" الموجود في app.js. */
(function () {
  'use strict';

  /* ================= parser (pure, also used by the node unit test) ================= */
  // [key, aliases (letters only, lowercase), min, max, decimals]
  var FIELDS = [
    ['weight', ['weight'], 25, 300, 1],
    ['smm', ['skeletalmusclemass', 'smm'], 5, 90, 1],
    ['bfm', ['bodyfatmass', 'bfm'], 1, 160, 1],
    ['pbf', ['percentbodyfat', 'pbf'], 2, 75, 1],
    ['bmi', ['bodymassindex', 'bmi'], 10, 70, 1],
    ['bmr', ['basalmetabolicrate', 'bmr'], 700, 3800, 0],
    ['vfl', ['visceralfatlevel', 'vfl'], 1, 30, 0],
    ['whr', ['waisthipratio', 'whr'], 0.5, 1.6, 2],
    ['ffm', ['fatfreemass', 'ffm'], 15, 160, 1],
    ['tbw', ['totalbodywater', 'tbw'], 10, 110, 1],
    ['score', ['inbodyscore', 'inbodypoints'], 20, 120, 0],
    ['target_weight', ['targetweight'], 25, 250, 1]
  ];
  var RANGE = /\(?\s*-?\d+(?:\.\d+)?\s*(?:kg|%|l|kcal)?\s*[~∼〜]\s*\d+(?:\.\d+)?\s*\)?|\(\s*\d+(?:\.\d+)?\s*[-–]\s*\d+(?:\.\d+)?\s*\)|\b\d+\.\d+\s*[-–]\s*\d+\.\d+\b/gi;
  var VAL_BEFORE_RANGE = /(\d+(?:\.\d+)?)\s*(?:kg|%|l|kcal|points?)?\s*\(?\s*\d+(?:\.\d+)?\s*(?:kg|%|l|kcal)?\s*[~∼〜]\s*\d+(?:\.\d+)?/i;

  // approximate substring match (Sellers): smallest edit distance of pat against any substring of txt
  function fuzzyFind(txt, pat, maxErr) {
    var m = pat.length, n = txt.length, prev = new Array(m + 1), cur = new Array(m + 1), start = new Array(m + 1), pstart = new Array(m + 1), best = null, i, j;
    for (i = 0; i <= m; i++) { prev[i] = i; pstart[i] = 0; }
    for (j = 1; j <= n; j++) {
      cur[0] = 0; start[0] = j;
      for (i = 1; i <= m; i++) {
        var sub = prev[i - 1] + (pat[i - 1] === txt[j - 1] ? 0 : 1), del = prev[i] + 1, ins = cur[i - 1] + 1;
        if (sub <= del && sub <= ins) { cur[i] = sub; start[i] = pstart[i - 1]; } else if (del <= ins) { cur[i] = del; start[i] = pstart[i]; } else { cur[i] = ins; start[i] = start[i - 1]; }
      }
      if (cur[m] <= maxErr && (!best || cur[m] < best.err)) best = { err: cur[m], s: start[m], e: j };
      var t = prev; prev = cur; cur = t; t = pstart; pstart = start; start = t;
    }
    return best;
  }
  function cleanNums(s) {
    return s
      .replace(/(\d),(\d{3})(?!\d)/g, '$1$2')                       // 1,502 → 1502
      .replace(/(\d)\s*[,·]\s*(\d)/g, '$1.$2')                       // 88,8 → 88.8
      .replace(/(\d)\s+\.\s*(\d)|(\d)\.\s+(\d)/g, function (m, a, b, c, e) { return (a || c) + '.' + (b || e); })
      .replace(/(^|[^A-Za-z])([0-9OoDlI|S.]+)(?![A-Za-z])/g, function (m, pre, tok) { // OCR letter/digit confusions inside numbers
        return /\d/.test(tok) ? pre + tok.replace(/[OoD]/g, '0').replace(/[lI|]/g, '1').replace(/S/g, '5') : m;
      });
  }
  function pickValue(rest) {
    rest = cleanNums(rest).replace(/\/\s*100\b/g, ' ');
    var vb = rest.match(VAL_BEFORE_RANGE);
    var nums = (rest.replace(RANGE, ' ').match(/-?\d+(?:\.\d+)?/g) || []).map(Number);
    var out = [];
    if (vb) out.push(+vb[1]);                      // "33.4 (32.1~39.3)" → the value before the normal range
    if (nums.length >= 3) out.push(nums[nums.length - 1]); // bar-graph scales / history: the reading is the last number
    nums.forEach(function (v) { out.push(v); });
    return out;
  }
  function fitRange(v, f) {
    if (v == null || isNaN(v)) return null;
    v = Math.abs(v);
    if (v >= f[2] && v <= f[3]) return v;
    // lost decimal point: 888 → 88.8, 109 → 1.09
    if (f[4] > 0 && v === Math.round(v)) { var d = v / Math.pow(10, f[4]); if (d >= f[2] && d <= f[3]) return d; var d1 = v / 10; if (d1 >= f[2] && d1 <= f[3]) return d1; }
    return null;
  }
  function parse(text) {
    var lines = String(text || '').split(/\r?\n/), cand = {}, res = {}, found = [];
    lines.forEach(function (line, li) {
      var L = '', pos = [];
      for (var i = 0; i < line.length; i++) { var ch = line[i].toLowerCase(); if (ch >= 'a' && ch <= 'z') { L += ch; pos.push(i); } }
      if (!L) return;
      FIELDS.forEach(function (f) {
        f[1].forEach(function (al) {
          var hit;
          if (al.length <= 4) { // short code: exact word, not part of a ratio like TBW/FFM
            var rx = new RegExp('(^|[^A-Za-z/])' + al + '(?![A-Za-z/])', 'i'), m = line.match(rx);
            if (!m) return; var s0 = m.index + m[1].length; hit = { end: s0 + al.length, start: s0 };
          } else {
            var fz = fuzzyFind(L, al, al.length >= 13 ? 2 : al.length >= 9 ? 1 : 0); if (!fz) return;
            hit = { start: pos[fz.s], end: pos[fz.e - 1] + 1, ls: fz.s, le: fz.e };
            if (f[0] === 'weight') { // not "Target Weight", "Ideal Weight", "Weight Control"
              var before = L.slice(Math.max(0, fz.s - 7), fz.s), after = L.slice(fz.e, fz.e + 7);
              if (/target|ideal|tarqet/.test(before) || /^contr/.test(after)) return;
            }
            if (f[0] === 'bfm' && /percent/.test(L.slice(Math.max(0, fz.s - 8), fz.s))) return;
            if (f[0] === 'bmi' && /^ass/.test(L.slice(fz.e))) return;
          }
          var rest = line.slice(hit.end).replace(/^[1lI|!](?=\s+\d)/, ''); // "Leve1 9": a misread last letter glued to the label
          if (!/\d/.test(rest) && lines[li + 1]) rest += ' ' + lines[li + 1]; // value printed on the next line
          var vals = pickValue(rest), v = null;
          for (var k = 0; k < vals.length && v == null; k++) v = fitRange(vals[k], f);
          if (v != null) (cand[f[0]] = cand[f[0]] || []).push(v);
        });
      });
    });
    FIELDS.forEach(function (f) {
      var a = cand[f[0]]; if (!a || !a.length) return;
      // most frequent reading wins (the same value appears in several sheet sections); ties → first seen
      var cnt = {}, best = a[0]; a.forEach(function (v) { cnt[v] = (cnt[v] || 0) + 1; if (cnt[v] > cnt[best]) best = v; });
      res[f[0]] = +best.toFixed(f[4]); found.push(f[0]);
    });
    // derived values (InBody definitions): FFM = Weight − BFM, PBF = BFM / Weight
    var derived = [];
    if (res.weight && res.bfm && res.ffm == null) { res.ffm = +(res.weight - res.bfm).toFixed(1); derived.push('ffm'); }
    if (res.weight && res.bfm && res.pbf == null) { res.pbf = +(res.bfm / res.weight * 100).toFixed(1); derived.push('pbf'); }
    if (res.weight && res.ffm && res.bfm == null) { res.bfm = +(res.weight - res.ffm).toFixed(1); derived.push('bfm'); }
    var warn = [];
    if (res.weight && res.bfm && res.pbf && Math.abs(res.bfm / res.weight * 100 - res.pbf) > 3) warn.push('pbf');
    if (res.smm && res.weight && res.smm > res.weight * 0.7) warn.push('smm');
    // test date: 2026.09.27 / 2026-09-27 / 27.09.2026
    var t = cleanNums(String(text || '')), dm = t.match(/(20\d\d)\s*[.\-\/]\s*(\d{1,2})\s*[.\-\/]\s*(\d{1,2})/), date = null;
    if (dm) date = dm[1] + '-' + ('0' + dm[2]).slice(-2) + '-' + ('0' + dm[3]).slice(-2);
    else if ((dm = t.match(/\b(\d{1,2})\s*[.\-\/]\s*(\d{1,2})\s*[.\-\/]\s*(20\d\d)\b/))) date = dm[3] + '-' + ('0' + dm[2]).slice(-2) + '-' + ('0' + dm[1]).slice(-2);
    if (date && (+date.slice(5, 7) > 12 || +date.slice(8) > 31 || +date.slice(5, 7) < 1 || +date.slice(8) < 1)) date = null;
    return { values: res, found: found, derived: derived, warn: warn, date: date };
  }
  var IBP = { parse: parse, FIELDS: FIELDS, fuzzyFind: fuzzyFind };
  if (typeof module === 'object' && module.exports) module.exports = IBP;
  if (typeof window === 'undefined' || typeof document === 'undefined') return;
  window.KHIFFA_INBODY = IBP;

  /* ================= UI ================= */
  var d = document, A = window.KHIFFA_APP; if (!A) return;
  var form = d.getElementById('ibForm'); if (!form) return;
  var $ = function (id) { return d.getElementById(id); };
  var KEYS = { weight: 'f-weight', smm: 'f-smm', bfm: 'f-bfm', pbf: 'f-pbf', bmi: 'f-bmi', bmr: 'f-bmr', vfl: 'f-vfl', whr: 'f-whr', ffm: 'f-ffm', tbw: 'f-tbw', score: 'f-score', target_weight: 'f-target' };
  // fields the current app.js submit handler does not read (it keeps date, weight, smm, bfm, pbf, bmr, vfl, whr)
  var EXTRA = ['bmi', 'ffm', 'tbw', 'score', 'target_weight'];
  var NAME = { weight: 'الوزن', smm: 'كتلة العضلات الهيكلية', bfm: 'كتلة الدهون', pbf: 'نسبة الدهون', bmi: 'مؤشر كتلة الجسم', bmr: 'معدل الأيض الأساسي', vfl: 'مستوى الدهون الحشوية', whr: 'نسبة الخصر للورك', ffm: 'الكتلة الخالية من الدهون', tbw: 'إجمالي ماء الجسم', score: 'تقييم تركيب الجسم', target_weight: 'الوزن المستهدف' };

  var css = d.createElement('style');
  css.textContent =
    '.ib-up{display:flex;flex-wrap:wrap;gap:8px;align-items:center;margin-bottom:14px;padding:12px;border-radius:18px;background:var(--mint-soft)}' +
    '.ib-up .note{flex-basis:100%;margin-bottom:2px}' +
    '.ib-upbtn{display:inline-flex;align-items:center;gap:6px;cursor:pointer;font-size:14px;font-weight:600;border-radius:999px;padding:10px 18px;background:var(--mint);color:#fff;box-shadow:0 6px 14px -8px rgba(31,169,113,.8);user-select:none}' +
    '.ib-upbtn.ghost{background:var(--surface);color:var(--ink);border:1px solid var(--line);box-shadow:none;padding:8px 14px;font-size:13px}' +
    '.ib-upbtn:focus-within{outline:2px solid var(--ink);outline-offset:2px}' +
    '#ibUpBtn::before{content:"";width:18px;height:18px;background:currentColor;-webkit-mask:url("data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 24 24%27%3E%3Cpath d=%27M9 3 7.2 5H4a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-3.2L15 3H9zm3 5a4.5 4.5 0 1 1 0 9 4.5 4.5 0 0 1 0-9z%27/%3E%3C/svg%3E") center/contain no-repeat;mask:url("data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 24 24%27%3E%3Cpath d=%27M9 3 7.2 5H4a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-3.2L15 3H9zm3 5a4.5 4.5 0 1 1 0 9 4.5 4.5 0 0 1 0-9z%27/%3E%3C/svg%3E") center/contain no-repeat}' +
    '.ib-up.busy .ib-upbtn{opacity:.5;pointer-events:none}' +
    '.ib-prog{flex-basis:100%;display:grid;gap:4px}.ib-bar{height:8px;border-radius:8px;background:var(--surface);overflow:hidden}.ib-bar i{display:block;height:100%;width:0;background:var(--mint);transition:width .3s}' +
    '.ib-msg{flex-basis:100%;font-size:13.5px;line-height:1.6;border-radius:12px;padding:8px 12px;background:var(--surface)}.ib-msg.err{background:var(--peach-soft);color:var(--ink)}.ib-msg b{display:block}' +
    '#ibForm label{display:grid;grid-template-rows:1fr auto auto;align-items:end;font-size:12px;line-height:1.35}' +
    '#ibForm label .ib-l{color:var(--ink);font-weight:600}#ibForm label .en{display:block;font-weight:400;font-size:10.5px;color:var(--muted);direction:ltr;text-align:right}' +
    '#ibForm label::after{content:"";min-height:15px;font-size:10.5px}' +
    '#ibForm label.ib-auto input{background:var(--mint-soft);box-shadow:0 0 0 2px var(--mint);border-color:transparent}' +
    '#ibForm label.ib-warn input{background:var(--peach-soft);box-shadow:0 0 0 2px var(--peach)}' +
    '#ibForm label.ib-auto::after{content:"قُرئت تلقائيًا";color:var(--mint);font-weight:600}' +
    '#ibForm label.ib-warn::after{content:"تحقّقي من هذه القيمة";color:var(--peach)}' +
    '#ibForm.ib-editing{box-shadow:0 0 0 2px var(--peach);border-radius:14px;padding:8px}' +
    '#ibTable tr:not(:first-child){cursor:pointer}#ibTable tr:not(:first-child):hover td{background:var(--bg)}' +
    '#ibTable th small{display:block;font-size:10px;font-weight:500;opacity:.8}' +
    '#ibStats .eyebrow .en{display:block;font-size:10.5px;opacity:.85}';
  d.head.appendChild(css);

  /* ---------- bilingual labels on the stats / table / charts rendered by app.js ---------- */
  var STAT = { 'الوزن': ['الوزن', 'Weight'], 'الكتلة العضلية': ['كتلة العضلات الهيكلية', 'Skeletal Muscle Mass – SMM'], 'نسبة الدهون': ['نسبة الدهون', 'Percent Body Fat – PBF'], 'كتلة الدهون': ['كتلة الدهون', 'Body Fat Mass – BFM'],
    'الدهون الحشوية': ['مستوى الدهون الحشوية', 'Visceral Fat Level – VFL'], 'الخصر للورك': ['نسبة الخصر للورك', 'Waist-Hip Ratio – WHR'], 'معدل الحرق BMR': ['معدل الأيض الأساسي', 'Basal Metabolic Rate – BMR'], 'مؤشر الكتلة BMI': ['مؤشر كتلة الجسم', 'BMI'] };
  var TH = { 'التاريخ': 'Date', 'الوزن': 'Weight', 'العضلات': 'SMM', 'الدهون كجم': 'BFM', 'الدهون %': 'PBF', 'الحشوية': 'VFL', 'BMR': 'kcal' };
  var LEG = { 'الوزن (كجم)': 'الوزن · Weight (kg)', 'الكتلة العضلية (كجم)': 'كتلة العضلات الهيكلية · SMM (kg)', 'نسبة الدهون (%)': 'نسبة الدهون · PBF (%)' };
  var busy = false;
  function relabel() {
    if (busy) return; busy = true;
    try {
      d.querySelectorAll('#ibStats .stat .eyebrow').forEach(function (e) {
        if (e.dataset.bi) return; var tn = e.firstChild; if (!tn || tn.nodeType !== 3) return;
        var k = tn.nodeValue.trim(), m = STAT[k]; if (!m) return;
        tn.nodeValue = m[0] + ' '; var en = d.createElement('span'); en.className = 'en'; en.textContent = ''; en.hidden = true; e.appendChild(en); e.dataset.bi = 1;
      });
      // extra tiles for values app.js does not show
      var st = $('ibStats'), ib = (A.data && A.data.inbody || []).slice(-1)[0];
      if (st && ib && !st.querySelector('.ib-x') && st.querySelector('.stat')) {
        [['ffm', 'الكتلة الخالية من الدهون', 'Fat Free Mass – FFM', 'كجم'], ['tbw', 'إجمالي ماء الجسم', 'Total Body Water – TBW', 'لتر'], ['score', 'تقييم تركيب الجسم', 'InBody Score', '/100'], ['target_weight', 'الوزن المستهدف', 'Target Weight', 'كجم']].forEach(function (x) {
          if (ib[x[0]] == null || ib[x[0]] === '') return;
          var el = d.createElement('div'); el.className = 'stat ib-x';
          el.innerHTML = '<div class="eyebrow" data-bi="1">' + x[1] + ' <span class="en" hidden></span></div><div class="v num">' + A.ar(ib[x[0]], 2) + ' <span class="u">' + x[3] + '</span></div>';
          st.appendChild(el);
        });
      }
      d.querySelectorAll('#ibTable th').forEach(function (th) { if (th.dataset.bi) return; var k = th.textContent.trim(); if (TH[k]) { th.innerHTML = A.esc(k === 'BMR' ? 'الأيض الأساسي' : k); th.dataset.bi = 1; } });
      d.querySelectorAll('#charts .legend').forEach(function (l) { var k = l.textContent.trim(); if (LEG[k]) l.textContent = k; });
    } finally { busy = false; }
  }
  var mo = new MutationObserver(function () { relabel(); });
  ['ibStats', 'ibTable', 'charts'].forEach(function (id) { var el = $(id); if (el) mo.observe(el, { childList: true }); });
  relabel();

  /* ---------- edit an earlier reading (click a row) ---------- */
  var editing = null;
  function fill(r, auto) {
    Object.keys(KEYS).forEach(function (k) { var el = $(KEYS[k]); if (el && (!auto || r[k] != null)) el.value = r[k] == null || r[k] === '' ? '' : r[k]; });
  }
  function clearMarks() { form.querySelectorAll('label.ib-auto,label.ib-warn').forEach(function (l) { l.classList.remove('ib-auto', 'ib-warn'); }); }
  function setEditing(r) {
    editing = r ? r.date : null;
    form.classList.toggle('ib-editing', !!r); $('ibCancel').hidden = !r;
    $('ibFormTitle').textContent = r ? 'تعديل قياس ' + A.fmt(r.date, { day: 'numeric', month: 'long', year: 'numeric' }) : 'إضافة قياس تركيب الجسم';
  }
  $('ibTable').addEventListener('click', function (e) {
    var tr = e.target.closest('tr'); if (!tr) return;
    var rows = Array.prototype.slice.call(this.querySelectorAll('tr')), i = rows.indexOf(tr); if (i < 1) return;
    var IB = (A.data && A.data.inbody) || [], r = IB[IB.length - i]; if (!r) return;
    clearMarks(); hideMsg(); fill(r); $('f-date').value = r.date; setEditing(r);
    $('ibCard').scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
  $('ibCancel').onclick = function () { form.reset(); $('f-date').value = A.TODAY; clearMarks(); hideMsg(); setEditing(null); };
  form.addEventListener('input', function (e) { var l = e.target.closest('label'); if (l) l.classList.remove('ib-warn'); });

  /* ---------- keep the extra fields when saving (app.js reads only part of the form) ---------- */
  var stash = null;
  d.addEventListener('submit', function (e) {
    if (e.target !== form) return;
    var g = function (id) { var v = parseFloat($(id).value); return isNaN(v) ? null : v; };
    stash = { date: $('f-date').value, v: {} };
    EXTRA.forEach(function (k) { var v = g(KEYS[k]); if (v != null) stash.v[k] = v; });
  }, true);
  form.addEventListener('submit', function () {
    // runs after app.js' onsubmit handler (registered earlier), which already stored the reading
    var s = stash; stash = null; clearMarks(); hideMsg(); setEditing(null);
    if (!s || !A.data) return;
    var rec = (A.data.inbody || []).find(function (r) { return r.date === s.date; });
    if (!rec) return;
    var add = {}; Object.keys(s.v).forEach(function (k) { if (rec[k] == null || k === 'target_weight') add[k] = s.v[k]; });
    if (!Object.keys(add).length) return;
    Object.assign(rec, add); // same object is referenced by the pending sync queue item → the server gets them on flush
    try { // keep the offline copies in sync too
      var q = JSON.parse(localStorage.getItem('khiffa.queue') || '[]');
      q.forEach(function (it) { if (it.action === 'saveInbody' && it.payload && it.payload.reading && it.payload.reading.date === s.date) Object.assign(it.payload.reading, add); });
      localStorage.setItem('khiffa.queue', JSON.stringify(q));
      var uid = A.data.user && A.data.user.id, dk = 'khiffa.data:' + uid, cached = uid && JSON.parse(localStorage.getItem(dk) || 'null');
      if (cached && cached.inbody) { cached.inbody.forEach(function (r) { if (r.date === s.date) Object.assign(r, add); }); localStorage.setItem(dk, JSON.stringify(cached)); }
    } catch (err) {}
    var st = $('ibStats'); if (st) { var x = st.querySelectorAll('.ib-x'); x.forEach(function (n) { n.remove(); }); relabel(); }
  });

  /* ---------- upload + OCR ---------- */
  var up = $('ibUp');
  function msg(html, err) { var m = $('ibMsg'); m.innerHTML = html; m.className = 'ib-msg' + (err ? ' err' : ''); m.hidden = false; }
  function hideMsg() { $('ibMsg').hidden = true; }
  function prog(p, t) { $('ibProg').hidden = false; $('ibBar').style.width = Math.round(Math.max(0, Math.min(1, p)) * 100) + '%'; if (t) $('ibProgT').textContent = t; }
  function load(src, globalName) {
    return new Promise(function (res, rej) {
      if (window[globalName]) return res(window[globalName]);
      var s = d.createElement('script'); s.src = src; s.async = true;
      s.onload = function () { window[globalName] ? res(window[globalName]) : rej(new Error('lib')); };
      s.onerror = function () { rej(new Error('net')); }; d.head.appendChild(s);
    });
  }
  // downscale + grayscale + contrast stretch → faster and cleaner OCR
  function prepImage(file) {
    return new Promise(function (res, rej) {
      var url = URL.createObjectURL(file), img = new Image();
      img.onload = function () {
        var MAX = 2200, w = img.naturalWidth, h = img.naturalHeight, k = Math.min(1, MAX / Math.max(w, h));
        if (Math.max(w, h) * k < 1400 && Math.max(w, h) < 1400) k = Math.min(2, 1400 / Math.max(w, h)); // tiny screenshots: upscale a bit
        var c = d.createElement('canvas'); c.width = Math.round(w * k); c.height = Math.round(h * k);
        var x = c.getContext('2d', { willReadFrequently: true }); x.imageSmoothingQuality = 'high'; x.drawImage(img, 0, 0, c.width, c.height);
        try {
          var id = x.getImageData(0, 0, c.width, c.height), p = id.data, lo = 255, hi = 0, i, v;
          for (i = 0; i < p.length; i += 16) { v = p[i] * .299 + p[i + 1] * .587 + p[i + 2] * .114; if (v < lo) lo = v; if (v > hi) hi = v; }
          var sc = 255 / Math.max(40, hi - lo);
          for (i = 0; i < p.length; i += 4) { v = (p[i] * .299 + p[i + 1] * .587 + p[i + 2] * .114 - lo) * sc; v = v < 0 ? 0 : v > 255 ? 255 : v; p[i] = p[i + 1] = p[i + 2] = v; }
          x.putImageData(id, 0, 0);
        } catch (e) {}
        URL.revokeObjectURL(url); res(c);
      };
      img.onerror = function () { URL.revokeObjectURL(url); rej(new Error('img')); };
      img.src = url;
    });
  }
  // PDF: use its text layer when present (exported LookinBody PDFs), otherwise render page 1 for OCR
  function fromPdf(file) {
    var V = '3.11.174';
    return load('https://cdnjs.cloudflare.com/ajax/libs/pdf.js/' + V + '/pdf.min.js', 'pdfjsLib').then(function (lib) {
      lib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/' + V + '/pdf.worker.min.js';
      return file.arrayBuffer().then(function (buf) { return lib.getDocument({ data: buf }).promise; });
    }).then(function (pdf) {
      return pdf.getPage(1).then(function (page) {
        return page.getTextContent().then(function (tc) {
          var rows = {}; tc.items.forEach(function (it) { var y = Math.round(it.transform[5] / 3); (rows[y] = rows[y] || []).push(it); });
          var text = Object.keys(rows).sort(function (a, b) { return b - a; }).map(function (y) { return rows[y].sort(function (a, b) { return a.transform[4] - b.transform[4]; }).map(function (it) { return it.str; }).join(' '); }).join('\n');
          if (text.replace(/\s/g, '').length > 150) return { text: text };
          var vp = page.getViewport({ scale: 1 }), sc = 2200 / Math.max(vp.width, vp.height), v2 = page.getViewport({ scale: sc }), c = d.createElement('canvas');
          c.width = v2.width; c.height = v2.height;
          return page.render({ canvasContext: c.getContext('2d'), viewport: v2 }).promise.then(function () { return { canvas: c }; });
        });
      });
    });
  }
  var STEP = { 'loading tesseract core': 'تحميل محرك القراءة…', 'initializing tesseract': 'تهيئة محرك القراءة…', 'loading language traineddata': 'تحميل بيانات اللغة الإنجليزية…', 'initializing api': 'تجهيز القراءة…', 'recognizing text': 'قراءة الأرقام من الصورة…' };
  function ocr(canvas) {
    return load('https://cdn.jsdelivr.net/npm/tesseract.js@5.1.1/dist/tesseract.min.js', 'Tesseract').then(function (T) {
      return T.createWorker('eng', 1, {
        logger: function (m) {
          var base = { 'loading tesseract core': 0, 'initializing tesseract': .1, 'loading language traineddata': .15, 'initializing api': .3, 'recognizing text': .35 }[m.status];
          var span = m.status === 'recognizing text' ? .63 : m.status === 'loading language traineddata' ? .15 : .05;
          if (base != null) prog(base + span * (m.progress || 0), (STEP[m.status] || 'جارٍ العمل…') + (m.status === 'recognizing text' ? ' ' + Math.round((m.progress || 0) * 100) + '%' : ''));
        }
      }).then(function (w) {
        return w.setParameters({ preserve_interword_spaces: '1' }).then(function () { return w.recognize(canvas); })
          .then(function (r) { w.terminate(); return r.data.text; }, function (e) { w.terminate(); throw e; });
      });
    });
  }
  function apply(P) {
    clearMarks();
    var v = P.values, n = 0;
    Object.keys(KEYS).forEach(function (k) {
      if (v[k] == null) return; var el = $(KEYS[k]); if (!el) return;
      el.value = v[k]; n++; var l = el.closest('label'); l.classList.add(P.warn.indexOf(k) >= 0 ? 'ib-warn' : 'ib-auto');
    });
    var di = $('f-date');
    if (P.date && P.date <= A.TODAY) { di.value = P.date; di.closest('label').classList.add('ib-auto'); }
    else if (!di.value) di.value = A.TODAY;
    var miss = Object.keys(KEYS).filter(function (k) { return v[k] == null; }).map(function (k) { return NAME[k].split(' · ')[0]; });
    return { n: n, miss: miss };
  }
  function handle(file) {
    if (!file) return;
    var isPdf = /pdf/i.test(file.type) || /\.pdf$/i.test(file.name || '');
    if (!isPdf && !/^image\//.test(file.type || 'image/')) { msg('<b>نوع الملف غير مدعوم</b>اختاري صورة (JPG أو PNG أو HEIC) أو ملف PDF.', true); return; }
    if (file.size > 25 * 1024 * 1024) { msg('<b>الملف كبير جدًا</b>الحد الأقصى 25 ميجابايت.', true); return; }
    hideMsg(); up.classList.add('busy'); prog(0.02, isPdf ? 'فتح ملف PDF…' : 'تجهيز الصورة…');
    var job = isPdf ? fromPdf(file).then(function (r) { return r.text != null ? r.text : ocr(r.canvas); }) : prepImage(file).then(ocr);
    job.then(function (text) {
      prog(1, 'اكتملت القراءة');
      var P = parse(text), res = apply(P);
      if (!res.n) { msg('<b>لم نتمكن من قراءة الأرقام</b>تأكدي أن الصورة واضحة ومضاءة جيدًا ومأخوذة من الأعلى للورقة كاملة، أو أدخلي القيم يدويًا.', true); return; }
      msg('<b>راجعي القيم قبل الحفظ</b>تمت قراءة ' + A.ar(res.n) + ' قيمة وتلوينها بالأخضر' + (P.warn.length ? '، والقيم المظللة بالبرتقالي تحتاج إلى تحقق' : '') + '. لن يُحفظ شيء حتى تضغطي «حفظ القياس».' +
        (res.miss.length ? '<br><span class="note">لم تُقرأ: ' + A.esc(res.miss.join('، ')) + '</span>' : ''));
      $('ibCard').scrollIntoView({ behavior: 'smooth', block: 'start' });
    }).catch(function (e) {
      var m = e && e.message;
      msg(m === 'net' || m === 'lib' || (!navigator.onLine) ? '<b>تعذّر تحميل أداة القراءة</b>تحتاج القراءة التلقائية إلى الإنترنت في أول مرة. تحققي من الاتصال وحاولي مجددًا، أو أدخلي القيم يدويًا.'
        : m === 'img' ? '<b>تعذّر فتح الصورة</b>جرّبي صورة أخرى (JPG أو PNG)، أو التقطي صورة جديدة.'
        : '<b>حدث خطأ أثناء القراءة</b>جرّبي صورة أوضح، أو أدخلي القيم يدويًا.', true);
      if (window.console) console.warn('InBody OCR', e);
    }).then(function () { up.classList.remove('busy'); setTimeout(function () { $('ibProg').hidden = true; }, 900); });
  }
  ['ibFile', 'ibFile2'].forEach(function (id) { var inp = $(id); if (inp) inp.addEventListener('change', function () { var f = inp.files && inp.files[0]; inp.value = ''; handle(f); }); });
  IBP.handle = handle; IBP.apply = apply;
})();
