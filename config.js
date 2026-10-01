// رابط Apps Script (Khiffa API على حساب eb.om2030)
window.KHIFFA_CONFIG = {
  API_URL: 'https://script.google.com/macros/s/AKfycbwdusNK6VAk767_NkD5Bsvcqy-rYu1p-Pb_Hb6iyoAa04BlVoyC73kIyhdOCZ1kB3hGhQ/exec'
};
// الهوية والأيقونات + البحث عن الأكل + الصفحة الرئيسية + زرار التثبيت
['theme.js', 'search.js', 'dashboard.js', 'install.js'].forEach(function (f) { var s = document.createElement('script'); s.src = f; s.async = false; document.body.appendChild(s); });
window.addEventListener('beforeinstallprompt', function (e) { e.preventDefault(); window.__bip = e; });
