/* خفّة – صيغة الكلام حسب النوع + أرقام واضحة (الشكل الأصلي زي ما هو) */
(function () {
  'use strict';
  var d = document;

  /* ---------- أرقام إنجليزي: الصفر العربي شكله زي النقطة ---------- */
  (function () {
    var L = function (l) { return l === 'ar-EG' ? 'ar-EG-u-nu-latn' : l; };
    var n = Number.prototype.toLocaleString, dd = Date.prototype.toLocaleDateString, dt = Date.prototype.toLocaleString, tt = Date.prototype.toLocaleTimeString;
    Number.prototype.toLocaleString = function (l, o) { return n.call(this, L(l), o); };
    Date.prototype.toLocaleDateString = function (l, o) { return dd.call(this, L(l), o); };
    Date.prototype.toLocaleString = function (l, o) { return dt.call(this, L(l), o); };
    Date.prototype.toLocaleTimeString = function (l, o) { return tt.call(this, L(l), o); };
  })();

  /* ---------- wording follows the viewer: feminine by default, masculine for the owner (or by choice) ---------- */
  var M = [['اختاري','اختار'],['سجّلي','سجّل'],['سجلي','سجل'],['ثبّتي','ثبّت'],['ثبّتيه','ثبّته'],['أضيفيه','أضيفه'],['أضيفي','أضف'],['علّمي','علّم'],['ركّبي','ركّب'],['امسحي','امسح'],
    ['اقترحي','اقترح'],['اكتبي','اكتب'],['ادخلي','ادخل'],['افتحيه','افتحه'],['افتحي','افتح'],['انسخي','انسخ'],['اضغطي','اضغط'],['انزلي','انزل'],['عدّيتي','عدّيت'],['خلّصتي','خلّصت'],
    ['ملتزمة','ملتزم'],['نزلتي','نزلت'],['سجلتيش','سجلتش'],['ابدئي','ابدأ'],['لاقية','لاقي'],['كمّلي','كمّل'],['اشتريتيه','اشتريته'],['اخترتيها','اخترتها'],['تقدري','تقدر'],
    ['تختاري','تختار'],['تحطيها','تحطها'],['كُلي','كُل'],['تتخطيش','تتخطاش'],['زودتي','زودت'],['قللي','قلل'],['ضيفي','ضيف'],['راجعيه','راجعه'],['اتأكدي','اتأكد'],['خلّي','خلّي'],
    ['ثبّتيه','ثبّته'],['أكلتيه','أكلته'],['اعمليه','اعمله'],['اطبخيه','اطبخه'],['اكسري','اكسر'],['اخلطي','اخلط'],['انقعي','انقع'],['اخفقي','اخفق'],['عارفة','عارف'],['مش دلوقتي','مش دلوقتي'],
    ['عدّلي','عدّل'],['غيّري','غيّر'],['اشربي','اشرب'],['دوسي','دوس'],['زوّدي','زوّد'],['قلّلي','قلّل'],['شيلي','شيل'],['رجّعي','رجّع'],['اخترتيش','اخترتش'],['تفتحيه','تفتحه'],['خلّصتي','خلّصت'],['وابدئي','وابدأ'],['واختاري','واختار'],
    ['جهّزيه','جهّزه'],['متعوّضيش','متعوّضش'],['قسّميها','قسّمها'],['خففيه','خففه'],['بدّليه','بدّله'],['جرّبي','جرّب'],['نوّعي','نوّع'],['خطّطي','خطّط'],['اعملي','اعمل'],['راجعي','راجع'],
    ['نزّلي','نزّل'],['انسخي','انسخ'],['ابعتيه','ابعته'],['اطبعي','اطبع'],['فاكرة','فاكر'],['أكلتي','أكلت'],['توفّري','توفّر'],['تجوعي','تجوع'],['سجّليه','سجّله'],['اكتبيها','اكتبها'],['عارفة','عارف']];
  M.sort(function (a, b) { return b[0].length - a[0].length; });
  var RX = new RegExp('(^|[^؀-ۿ])(' + M.map(function (x) { return x[0]; }).join('|') + ')(?=$|[^؀-ۿ])', 'g');
  var DICT = {}; M.forEach(function (x) { DICT[x[0]] = x[1]; });
  function gender() {
    try { var g = localStorage.getItem('khiffa.gender'); if (g) return JSON.parse(g); } catch (e) {}
    var A = window.KHIFFA_APP, x = A && A.data; return x && x.me && x.me.role === 'owner' && x.me.id === x.user.id ? 'm' : 'f';
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
