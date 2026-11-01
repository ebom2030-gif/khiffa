/* v38 — دليل الاستخدام داخل التطبيق: لكل نوع مستخدم الجزء الخاص به فقط حسب دوره. */
(function () {
  'use strict';
  const A = window.KHIFFA_APP, d = document;
  if (!A) return;
  const SECTIONS = {
    client: { title: 'دليل المستخدم', items: [
      ['الرئيسية', 'ملخص يومك: السعرات المتبقية، الماء، الطريق إلى هدفك، والجسم. يمكنك ترتيب البطاقات من «ترتيب البطاقات» وتغيير الشكل من «تخصيص المظهر».'],
      ['تسجيل الطعام', 'اكتب اسم الطعام في «ابحث وأضف طعامك مباشرة»، أو «كوّن وجبة أو سلطة»، أو «صوّر وجبة للاستكمال لاحقًا». الكميات قابلة للتعديل بالجرام أو الحصة أو العدد، وزر «تراجع» يظهر بعد كل تسجيل.'],
      ['وجبات اليوم', 'الوجبات الخمس ليومك؛ اضغط على أي وجبة لاختيار وجبة جاهزة أو تكرار وجبة سابقة أو تعديلها.'],
      ['مقترحات اليوم', 'خمس وجبات مقترحة من مطابخ تختارها، تتوازن مع ما سجلته. المقترح لا يُسجل إلا بضغط زر «تسجيل».'],
      ['وصفات صحية', 'دليل وصفات المطابخ، ومقترحات اليوم، ووجبات خفة الجاهزة مع البحث والمفضلة وإضافة الوصفة مباشرة لوجبة اليوم.'],
      ['الماء والنشاط', 'سجّل زجاجات الماء (330 مل) والخطوات وسعرات النشاط كما تعرضها ساعتك. تُحفظ مع يومك وتتزامن مع حسابك.'],
      ['الوزن والقياسات', 'أضف وزنك وقراءات InBody والقياسات والوزن المستهدف لمتابعة التقدم.'],
      ['أهدافي', 'أهداف الماء والخطوات وسعرات النشاط، ونسبة ما سجلته من خطة السعرات.'],
      ['التقارير', 'ملخص الأسبوع والسعرات آخر أسبوعين، والطباعة.'],
      ['أدوات خفة', 'في الرئيسية: «خطة الأسبوع» (7 أيام من مطابخك تُضاف كوجبات مقترحة، ويمكن إرسالها للأخصائي)، و«قائمة المشتريات» من الوجبات المخططة، و«التحديات والشارات»، و«التقرير الشهري A4» للطباعة أو الحفظ PDF، و«ماسح الباركود» للمنتجات المعلّبة.'],
      ['مقترحات اليوم والمطابخ', 'أعلى «وجبات اليوم» زرّا «سجل وجباتي | مقترحات اليوم». وفي نافذة اختيار أي وجبة قسم «من مطابخ العالم» يفتح المقترح أو دليل الوصفات مباشرة.'],
      ['تسجيل الوجبة بالصورة', 'من «تكوين وجبة» ← «صوّر وجبة»: يقترح التطبيق الأصناف والكميات لتؤكدها (عند تفعيل خدمة التحليل).'],
      ['المجتمع والدعم', 'المتابعة مع أخصائي التغذية والرسائل والخطة، والدعم والاقتراحات، ومسودة خاصة لأسئلتك.'],
      ['التنبيهات', 'الجرس أعلى الصفحة: الرسائل والمواعيد وتذكيرات الوجبات. فعّل الإشعارات على جوالك من مواعيد الوجبات.'],
      ['الخصوصية وحذف الحساب', 'سياسة الخصوصية: khiffa.arkiqo.com/privacy.html — وطلب حذف الحساب وكل بياناته من «الدعم والاقتراحات» (التفاصيل: khiffa.arkiqo.com/delete-account.html).'],
      ['الحساب والتحديث', 'من «حسابي»: ربط الهاتف أو البريد وكلمة المرور، وإعدادات التطبيق والمظهر، وزر «تحديث التطبيق» لجلب آخر إصدار. التطبيق يحفظ على الجهاز إن انقطع الإنترنت ويزامن عند عودته.']
    ] },
    dietitian: { title: 'دليل أخصائي التغذية', items: [
      ['دعوة مستخدم', 'من «المجتمع والدعم» ← «فتح المتابعة والرسائل» ← «دعوة مستخدم». لا تطّلع على سجلات أي مستخدم إلا بعد قبوله الربط.'],
      ['متابعة المستخدمين', 'قائمة المتابَعين مع آخر تسجيل لكل منهم، والخطة المقترحة المؤرخة، والرسائل، والتقييم الأسبوعي. الخطة المقترحة لا تغيّر طعامه المسجل.'],
      ['الرسائل والمواعيد', 'من الجرس: أرسل رسالة أو موعدًا بتذكير، واستخدم النماذج الجاهزة، وراجع حالة القراءة والتفاعل.'],
      ['إنهاء المتابعة', 'عند إنهاء المتابعة من أي طرف يُسحب الوصول فورًا.']
    ] },
    admin: { title: 'دليل المدير', items: [
      ['صلاحياتك', 'يحدد المالك صلاحياتك: إدارة المستخدمين، المحتوى، الدعم، أو متابعة المستخدمين. تظهر لك الأدوات المسموح بها فقط.'],
      ['إدارة المستخدمين', 'من «حسابي» ← إعدادات التطبيق ← «إدارة المستخدمين» (إن كانت مسموحة).'],
      ['المحتوى والدعم', 'من «المساعدة وحسابي»: «إدارة المحتوى» للأطعمة والوجبات والمستجدات مع المعاينة قبل الحفظ، و«الدعم والاقتراحات» للرد على المستخدمين.']
    ] },
    owner: { title: 'دليل المالك', items: [
      ['الأدوار', 'أربعة أدوار: مستخدم، أخصائي تغذية، مدير، مالك. تحدد صلاحيات كل مدير من «إدارة المستخدمين».'],
      ['عرض حساب آخر', 'يمكنك فتح بيانات مستخدم مسموح به؛ يظهر في «حسابي» تنبيه وزر «العودة إلى بيانات حسابي».'],
      ['المحتوى', '«إدارة المحتوى»: إضافة وتعديل وإخفاء الأطعمة والوجبات والمستجدات، والرجوع لآخر نسخة محفوظة.'],
      ['الرسائل الجماعية والمواعيد', 'من الجرس: اختر مستخدمًا وأرسل رسالة أو موعدًا، وتابع القراءة والردود.'],
      ['التحديثات', 'رقم الإصدار في release.json. بعد كل نشر يظهر للمستخدمين زر «تحديث التطبيق».'],
      ['طلبات حذف الحساب', 'تصل عبر «الدعم والاقتراحات». تحقق من الملكية، ثم أوقف الحساب من «إدارة المستخدمين» وأكّد للمستخدم خلال 30 يومًا (متطلب Google Play).'],
      ['ملفات المنصة', 'المصدر الرسمي: «شركتي\\منصة خفة» (آخر نسخة فقط + الأرشيف + النسخ الاحتياطية). المولّد: «مولد_إصدار_جديد.bat». اقرأ «طريقة_العمل.md» قبل أي تعديل.']
    ] }
  };
  const ORDER = { client: ['client'], dietitian: ['client', 'dietitian'], admin: ['client', 'admin'], owner: ['owner', 'admin', 'dietitian', 'client'] };
  function E(tag, text, cls) { const e = d.createElement(tag); if (text) e.textContent = text; if (cls) e.className = cls; return e; }
  function open() {
    const role = (A.me && A.me.role) || 'client', old = d.activeElement;
    let parts = (ORDER[role] || ORDER.client).slice();
    (window.KHIFFA_GUIDE_EXTRA || []).forEach(x => { try { if (x.when()) { SECTIONS[x.key] = { title: x.title, items: x.items }; if (!parts.includes(x.key)) parts.splice(role === 'owner' ? parts.length : 0, 0, x.key); } } catch (_) {} });
    const overlay = E('div', null, 'ac-modal'), box = E('div', null, 'ac-box kg-box');
    overlay.setAttribute('role', 'dialog'); overlay.setAttribute('aria-modal', 'true'); overlay.setAttribute('aria-label', 'دليل الاستخدام');
    const close = () => { overlay.remove(); old && old.focus && old.focus(); };
    const x = E('button', 'إغلاق', 'btn ghost'); x.type = 'button'; x.onclick = close;
    box.append(E('h2', 'دليل الاستخدام'), x, E('p', 'هذا الدليل يعرض الأجزاء الخاصة بدورك فقط.', 'note'));
    const tabs = E('div', null, 'kg-tabs'), body = E('div', null, 'kg-body');
    function show(k) {
      tabs.querySelectorAll('button').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.k === k)));
      body.replaceChildren(); const s = SECTIONS[k];
      s.items.forEach(([t, p]) => { const it = E('details', null, 'kg-item'); it.append(E('summary', t), E('p', p)); body.append(it); });
      const first = body.querySelector('details'); if (first) first.open = true;
    }
    if (parts.length > 1) parts.forEach(k => { const b = E('button', SECTIONS[k].title, 'fchip'); b.type = 'button'; b.dataset.k = k; b.onclick = () => show(k); tabs.append(b); });
    box.append(tabs, body); overlay.append(box); overlay.addEventListener('click', e => { if (e.target === overlay) close(); });
    overlay.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
    d.body.append(overlay); show(parts[0]); x.focus();
  }
  function card() {
    if (!A.me) return; const plan = d.getElementById('v-plan'); if (!plan || d.getElementById('kgGuideCard')) return;
    const c = E('div', null, 'card'); c.id = 'kgGuideCard';
    const b = E('button', 'فتح دليل الاستخدام', 'btn'); b.type = 'button'; b.onclick = open;
    c.append(E('h2', 'دليل الاستخدام'), E('p', 'شرح مختصر لكل أجزاء خفة حسب دورك.', 'note'), b); plan.prepend(c);
  }
  const style = E('style'); style.textContent = '.kg-box{width:min(100%,760px)!important;max-width:760px!important}.kg-tabs{display:flex;flex-wrap:wrap;gap:8px;margin:12px 0}.kg-item{border:1px solid var(--line);border-radius:14px;padding:10px 14px;margin-bottom:8px}.kg-item summary{font-weight:700;cursor:pointer;min-height:32px}.kg-item p{line-height:1.9;margin:8px 0 0}';
  d.head.append(style);
  function legal() { const box = d.querySelector('#login .lg-in') || d.getElementById('login'); if (!box || box.querySelector('.kd-legal')) return; const p = E('p', null, 'kd-legal'); p.style.cssText = 'text-align:center;font-size:12px;margin:14px 0 0;position:relative;z-index:2'; p.innerHTML = '<a href="privacy.html" style="color:inherit">سياسة الخصوصية</a> · <a href="delete-account.html" style="color:inherit">حذف الحساب</a>'; box.append(p); }
  legal(); new MutationObserver(legal).observe(d.getElementById('login') || d.body, { childList: true, subtree: true });
  window.KHIFFA_GUIDE = open;
  (window.KHIFFA_HOOKS = window.KHIFFA_HOOKS || []).push(card);
  (window.KHIFFA_LOGOUT_HOOKS = window.KHIFFA_LOGOUT_HOOKS || []).push(() => d.getElementById('kgGuideCard')?.remove());
  card();
})();
