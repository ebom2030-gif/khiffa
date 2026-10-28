['https://images.unsplash.com', 'https://cdn.jsdelivr.net'].forEach(function (h) { var l = document.createElement('link'); l.rel = 'preconnect'; l.href = h; document.head.appendChild(l); });
// الاتصال بخادم خفّة على Cloudflare.
window.KHIFFA_CONFIG = {
  ONESIGNAL_APP_ID: '9d88c76a-d22e-4a5d-aa49-df1fad891feb', // App ID من OneSignal (مش سري) — الإشعارات بتشتغل لما يتحط
  API_URL: '/api/'
};
// الهوية والأيقونات + البحث عن الأكل + الصفحة الرئيسية + زرار التثبيت
(function(){
  var files=['updater.js','theme.js','search.js','dashboard.js','reports.js','features.js','skin.js','photos.js','reminders.js','ux.js','ux2.js','logos.js','install.js','accounts.js','inbody.js','print.js','community.js','food-entry.js','coaching.js','responsive.js','notifications.js','direct-notices.js','system-ui.js'];
  // Download extensions concurrently, execute in their tested dependency order.
  files.forEach(function(file){var link=document.createElement('link');link.rel='preload';link.as='script';link.href=file+'?v=35';document.head.append(link);});
  function load(index){
    if(index>=files.length){if(window.KHIFFA_APP)window.KHIFFA_APP.refreshAll();window.dispatchEvent(new Event('khiffa-ready'));return;}
    var script=document.createElement('script');script.src=files[index]+'?v=35';script.async=false;
    script.onload=function(){load(index+1);};
    script.onerror=function(){console.error('Khiffa module failed',files[index]);if(!document.getElementById('khiffa-load-error')){var banner=document.createElement('div');banner.id='khiffa-load-error';banner.setAttribute('role','alert');banner.style.cssText='position:fixed;bottom:90px;left:12px;right:12px;z-index:10002;background:#fff4e5;color:#532e00;padding:14px;border-radius:14px';banner.textContent='تعذّر تحميل جزء من التطبيق. ';var retry=document.createElement('button');retry.textContent='إعادة المحاولة';retry.onclick=function(){location.reload();};banner.append(retry);document.body.append(banner);}load(index+1);};
    document.body.append(script);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',function(){load(0);},{once:true});else load(0);
})();
window.addEventListener('beforeinstallprompt', function (e) { e.preventDefault(); window.__bip = e; });

