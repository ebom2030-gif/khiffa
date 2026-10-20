/* خفّة – تحسينات الاستخدام:
   1) الكروت جوه النوافذ مبقتش تتضغط (flex-shrink) — كان سبب ظهور شريط صورة بس في "وجبات جاهزة" و"كرّري وجبة".
   2) خانة بحث في نافذة الوجبة (وجبات جاهزة / ركّبي بنفسكِ). */
(function () {
  'use strict';
  var d = document;
  var css = d.createElement('style');
  css.textContent =
    '.sheet-b>*{flex-shrink:0}' +
    '.sheet .icard .kban{height:86px}' +
    '.kq{position:sticky;top:-12px;z-index:3;background:var(--surface);padding:6px 0 8px;margin-bottom:-4px}' +
    '.kq input{width:100%;box-sizing:border-box;font:inherit;font-size:16px;padding:12px 44px 12px 14px;border:1px solid var(--line);border-radius:14px;background:var(--bg);color:var(--ink)}' +
    '.kq{--ic:url("data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%2720%27 height=%2720%27 fill=%27none%27 stroke=%27%236F7C76%27 stroke-width=%272%27%3E%3Ccircle cx=%279%27 cy=%279%27 r=%276%27/%3E%3Cpath d=%27m14 14 4 4%27/%3E%3C/svg%3E")}' +
    '.kq::after{content:"";position:absolute;right:14px;top:50%;width:20px;height:20px;margin-top:-10px;background:var(--ic) no-repeat center}' +
    '.kq-none{text-align:center;color:var(--muted);padding:18px 0}';
  d.head.appendChild(css);

  var norm = function (s) {
    return String(s || '').replace(/[ً-ٰٟـ]/g, '').replace(/[أإآ]/g, 'ا').replace(/ى/g, 'ي').replace(/ة/g, 'ه').replace(/ؤ/g, 'و').replace(/ئ/g, 'ي').toLowerCase();
  };
  var Q = '';

  function items(body) {
    var ic = body.querySelectorAll('.icard');
    if (ic.length) return ic;
    return body.querySelectorAll('.fbtn');
  }
  function apply(body) {
    var q = norm(Q).trim(), list = items(body), shown = 0;
    list.forEach(function (el) {
      var ok = !q || q.split(/\s+/).every(function (w) { return norm(el.textContent).indexOf(w) >= 0; });
      el.style.display = ok ? '' : 'none'; if (ok) shown++;
    });
    var none = body.querySelector('.kq-none');
    if (!shown && q) { if (!none) { none = d.createElement('div'); none.className = 'kq-none'; body.appendChild(none); } none.textContent = 'لا توجد نتائج لـ «' + Q + '»'; }
    else if (none) none.remove();
  }
  function decorate() {
    d.querySelectorAll('.sheet-b').forEach(function (body) {
      var list = items(body);
      if (list.length < 4) return;
      var box = body.querySelector('.kq');
      if (!box) {
        box = d.createElement('div'); box.className = 'kq';
        var isIdeas = !!body.querySelector('.icard');
        box.innerHTML = '<input type="search" enterkeyhint="search" placeholder="' + (isIdeas ? 'ابحثي: دجاج، بيض، شوفان…' : 'ابحثي: توست، زبادي، تفاح…') + '" aria-label="بحث">';
        var seg = body.querySelector('.seg');
        if (seg && seg.parentNode === body) seg.insertAdjacentElement('afterend', box); else body.insertBefore(box, body.firstChild);
        var inp = box.querySelector('input');
        inp.value = Q;
        inp.addEventListener('input', function () { Q = inp.value; apply(body); });
      }
      apply(body);
    });
    if (!d.querySelector('.sheet-b')) Q = ''; // نافذة جديدة = بحث جديد
  }
  var t = 0;
  new MutationObserver(function () { if (t) return; t = requestAnimationFrame(function () { t = 0; decorate(); }); }).observe(d.body, { childList: true, subtree: true });
})();
