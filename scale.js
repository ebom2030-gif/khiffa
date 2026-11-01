/* v49 — ربط الميزان الذكي بالبلوتوث (Web Bluetooth).
 * يدعم الموازين التي تتبع معيار Bluetooth: Weight Scale (0x181D) و Body Composition (0x181B)،
 * ومنها موازين Xiaomi Mi Body Composition 2 وكثير من الموازين الذكية. يعمل في Chrome/Edge على Android والكمبيوتر؛
 * لا يدعمه Safari على iPhone (قيد من Apple). الوزن يُحفظ في «وزن الصباح» لليوم الحالي. */
(function () {
  'use strict';
  const A = window.KHIFFA_APP, d = document; if (!A) return;
  const SUP = !!(navigator.bluetooth && navigator.bluetooth.requestDevice);
  let dev = null, last = null, stableTimer = null;

  function E(t, x, c) { const e = d.createElement(t); if (x) e.textContent = x; if (c) e.className = c; return e; }
  function u16(v, i) { return v.getUint16(i, true); }

  /* 0x2A9D Weight Measurement */
  function parseWeight(v) {
    const fl = v.getUint8(0), raw = u16(v, 1);
    return { kg: fl & 1 ? raw * 0.01 * 0.45359237 : raw * 0.005, stable: true };
  }
  /* 0x2A9C Body Composition: Xiaomi (13 بايت) أو المعيار */
  function parseBody(v) {
    if (v.byteLength === 13) { // Mi Body Composition Scale 2
      const c1 = v.getUint8(1), unit = v.getUint8(0) & 1 ? 'lb' : (c1 & 0x40 ? 'jin' : 'kg'), raw = u16(v, 11) / 100;
      const kg = unit === 'kg' ? raw / 2 : unit === 'jin' ? raw / 2 : raw * 0.45359237;
      return { kg, stable: !!(c1 & 0x20), removed: !!(c1 & 0x80), imp: c1 & 0x02 ? u16(v, 9) : null };
    }
    const fl = u16(v, 0); let i = 2; const out = { fat: u16(v, i) * 0.1, stable: true }; i += 2;
    const si = !(fl & 1);
    if (fl & 0x2) i += 7; if (fl & 0x4) i += 1; if (fl & 0x8) i += 2; if (fl & 0x10) i += 2; if (fl & 0x20) i += 2;
    if (fl & 0x40) i += 2; if (fl & 0x80) i += 2; if (fl & 0x100) i += 2; if (fl & 0x200) i += 2;
    if (fl & 0x400 && v.byteLength >= i + 2) out.kg = si ? u16(v, i) * 0.005 : u16(v, i) * 0.01 * 0.45359237;
    return out;
  }

  function save(kg) {
    kg = Math.round(kg * 10) / 10; if (!(kg >= 30 && kg <= 250)) { A.toast('القراءة خارج النطاق، أعد الوزن'); return; }
    const day = A.dayOf(A.TODAY); day.weight = kg; A.saveDay({ ...day }); A.refreshAll();
    A.toast('تم حفظ الوزن من الميزان: ' + A.ar(kg) + ' كجم');
  }

  function open() {
    const ov = E('div', null, 'ac-modal'), box = E('div', null, 'ac-box ksc-box'); ov.setAttribute('role', 'dialog'); ov.setAttribute('aria-modal', 'true');
    const close = () => { try { dev && dev.gatt && dev.gatt.connected && dev.gatt.disconnect(); } catch (_) {} clearTimeout(stableTimer); ov.remove(); };
    const x = E('button', 'إغلاق', 'btn ghost'); x.type = 'button'; x.onclick = close;
    const big = E('div', '-- كجم', 'ksc-big'), st = E('p', '', 'note'), act = E('div', null, 'row'); act.style.cssText = 'gap:8px;flex-wrap:wrap;justify-content:center';
    box.append(E('h2', '⚖️ ربط الميزان بالبلوتوث'), x);
    if (!SUP) {
      box.append(E('p', 'المتصفح الحالي لا يدعم البلوتوث للمواقع. افتح خفة من Chrome أو Edge على Android أو الكمبيوتر. على iPhone لا تسمح Apple بذلك حتى الآن؛ سجّل الوزن يدويًا من «وزن الصباح».', 'note'));
      ov.append(box); d.body.append(ov); return;
    }
    box.append(E('p', 'شغّل البلوتوث، واصعد على الميزان حافي القدمين ليعمل، ثم اضغط «بحث عن الميزان» واختره من القائمة. يدعم الموازين الذكية التي تتبع معيار البلوتوث للوزن (مثل Xiaomi Mi Scale وغيرها).', 'note'), big, st, act);
    const go = E('button', '🔍 بحث عن الميزان', 'btn'); go.type = 'button';
    const keep = E('button', 'حفظ هذا الوزن', 'btn'); keep.type = 'button'; keep.hidden = true; keep.onclick = () => { if (last) { save(last); close(); } };
    act.append(go, keep);
    const show = r => {
      if (r.kg == null || !(r.kg > 0)) return; last = Math.round(r.kg * 10) / 10;
      big.textContent = A.ar(last) + ' كجم'; keep.hidden = false;
      st.textContent = r.stable ? 'القراءة ثابتة ✓' + (r.fat ? ' · الدهون ' + A.ar(Math.round(r.fat * 10) / 10) + '٪' : '') : 'جارٍ الوزن… اثبت على الميزان';
      if (r.stable) { clearTimeout(stableTimer); stableTimer = setTimeout(() => { keep.focus(); }, 300); }
    };
    go.onclick = async () => {
      try {
        go.disabled = true; st.textContent = 'اختر الميزان من نافذة المتصفح…';
        dev = await navigator.bluetooth.requestDevice({ filters: [{ services: [0x181d] }, { services: [0x181b] }, { namePrefix: 'MIBFS' }, { namePrefix: 'MI SCALE' }, { namePrefix: 'MI_SCALE' }], optionalServices: [0x181d, 0x181b, 0x180f] });
        st.textContent = 'جارٍ الاتصال بـ ' + (dev.name || 'الميزان') + '…';
        const srv = await dev.gatt.connect(); let ok = false;
        for (const [s, c, fn] of [[0x181d, 0x2a9d, parseWeight], [0x181b, 0x2a9c, parseBody]]) {
          try { const ch = await (await srv.getPrimaryService(s)).getCharacteristic(c); ch.addEventListener('characteristicvaluechanged', e => { try { show(fn(e.target.value)); } catch (_) {} }); await ch.startNotifications(); ok = true; } catch (_) {}
        }
        if (!ok) throw Error('nosvc');
        st.textContent = 'متصل ✓ — اصعد على الميزان واثبت حتى تثبت القراءة';
      } catch (e) {
        go.disabled = false;
        st.textContent = e && e.name === 'NotFoundError' ? 'لم يُختر ميزان. تأكد أن الميزان يعمل (اصعد عليه) وأن البلوتوث مفعّل.' : e && e.message === 'nosvc' ? 'هذا الميزان يستخدم نظامًا خاصًا بالشركة المصنعة ولا يرسل الوزن بمعيار البلوتوث. سجّل الوزن يدويًا.' : 'تعذّر الاتصال: ' + ((e && e.message) || 'خطأ');
      }
    };
    ov.addEventListener('click', e => { if (e.target === ov) close(); });
    ov.append(box); d.body.append(ov);
  }

  const css = E('style'); css.textContent = '.ksc-box{width:min(100%,460px)!important;text-align:center}.ksc-big{font-size:44px;font-weight:800;color:var(--mint);margin:14px 0 4px;font-variant-numeric:tabular-nums}.ksc-btn{margin-inline-start:6px}';
  d.head.append(css);
  function mount() {
    const s = d.getElementById('wSave'); if (s && !d.getElementById('kscBtn')) { const b = E('button', '⚖️ من الميزان', 'btn ghost ksc-btn'); b.id = 'kscBtn'; b.type = 'button'; b.onclick = open; s.after(b); }
    const body = d.getElementById('v-body'); if (body && !d.getElementById('kscCard')) {
      const c = E('div', null, 'card'); c.id = 'kscCard'; const b = E('button', '⚖️ ربط الميزان بالبلوتوث', 'btn'); b.type = 'button'; b.onclick = open;
      c.append(E('h2', 'الميزان الذكي'), E('p', 'اربط ميزانك بالبلوتوث ليُسجَّل وزنك تلقائيًا في «وزن الصباح».', 'note'), b); body.prepend(c);
    }
  }
  window.KHIFFA_SCALE = open;
  (window.KHIFFA_HOOKS = window.KHIFFA_HOOKS || []).push(mount); mount();
})();
