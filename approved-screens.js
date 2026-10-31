/* v38 — شاشات التصميم المعتمد فوق v37: تستخدم وظائف وبيانات v37 الفعلية (المتابعة، المقترحات، دليل الوصفات، الخطوات والنشاط المتزامن). */
(function () {
  'use strict';
  const A = window.KHIFFA_APP, d = document;
  if (!A) return;
  const link = d.createElement('link'); link.rel='stylesheet'; link.href='approved-screens.css'; d.head.append(link);
  const routes = [
    ['home','الرئيسية','house'],['today','وجبات اليوم','calendar'],['suggestions','مقترحات اليوم','bento_box'],['programs','برامجي الغذائية','clipboard'],
    ['body','الوزن والقياسات','straight_ruler'],['hydration','الماء والنشاط','droplet'],['recipes','وصفات صحية','green_salad'],
    ['community','المجتمع والدعم','people_hugging'],['reports','التقارير والتحليلات','bar_chart'],['goals','أهدافي','bullseye'],['account','حسابي','bust_in_silhouette']
  ];
  const names = Object.fromEntries(routes.map(r=>[r[0],r[1]]));
  const NATIVE = new Set(['home','today','suggestions','body','reports']);
  const native = new Map(); let route='home', mounted=false, pending=false, lastKey='', recipeFilter='all', query='', favoritesOnly=false;
  const state = () => A.data;
  const uid = () => String(state()?.user?.id || '');
  const esc = A.esc;
  const num = n => Number(n||0).toLocaleString('ar-u-nu-latn',{maximumFractionDigits:1});
  const bounded = (n,max) => Math.max(0,Math.min(max,Number(n)||0));
  function node(tag,cls,text) { const el=d.createElement(tag); if(cls)el.className=cls; if(text!==undefined)el.textContent=text;return el; }
  function button(label,fn,cls='btn ghost') {const el=node('button',cls,label);el.type='button';el.onclick=fn;return el;}
  function heading(title,description) {const el=node('div','kd-page-heading');const h=node('h1','',title);h.tabIndex=-1;el.append(h);if(description)el.append(node('p','note',description));return el;}
  function card(title) {const el=node('div','card');if(title)el.append(node('h2','',title));return el;}
  function routeKey() {return 'khiffa.screen:'+String(state()?.me?.id||'');}
  function localKey() {return 'khiffa.screen-data.v1:'+uid();}
  function readLocal() {try{const value=JSON.parse(localStorage.getItem(localKey()));return value&&typeof value==='object'&&!Array.isArray(value)?value:{};}catch{return {};}}
  function saveLocal(patch) {try{localStorage.setItem(localKey(),JSON.stringify({...readLocal(),...patch}));return true;}catch{A.toast('تعذر الحفظ على هذا الجهاز');return false;}}
  function todaySteps() {return bounded(A.dayOf(A.TODAY).steps,200000);}
  function todayActive() {return bounded(A.dayOf(A.TODAY).activeKcal,20000);}
  function nutrition() {const day=A.dayOf(A.TODAY);let total=0;A.D.MEALS.forEach(m=>{const meal=A.mealState(day,m.k);if(meal.done)total+=A.totals(A.mealComps(m.k,meal)).n;});(day.extras||[]).forEach(x=>{total+=Number(x.n)||0;});return total;}
  function announce(text){A.toast(text);}
  function mount() {
    if(mounted||!state())return;
    const nav=d.getElementById('tabs'),app=d.getElementById('app');if(!nav||!app)return;
    mounted=true;d.documentElement.dataset.kdScreens='true';
    [...nav.querySelectorAll('button[data-v]')].forEach(b=>native.set(b.dataset.v,b.onclick));
    for(const [id] of routes){
      if(!NATIVE.has(id)&&!d.getElementById('v-'+id)){const section=node('section','view kd-screen');section.id='v-'+id;section.hidden=true;section.setAttribute('aria-label',names[id]);app.append(section);}
    }
    adopt();
    ['plan','ideas'].forEach(id=>{const b=nav.querySelector('button[data-v="'+id+'"]');if(b){b.dataset.kdInternal='true';b.onclick=()=>navigate(id);}});
    mountPrograms();
    const account=d.getElementById('acct')?.closest('.card');if(account)d.getElementById('v-account').append(account);
    let saved='home';try{const value=JSON.parse(localStorage.getItem(routeKey()));if(names[value]||value==='plan'||value==='ideas')saved=value;}catch{}
    navigate(saved,false);
  }
  // يعيد بناء أزرار التنقل بترتيب اللوحة، ويتبنى أي زر أصلي يُضاف لاحقاً (مثل «المقترحات») دون تكرار.
  function adopt(){
    const nav=d.getElementById('tabs');if(!nav)return;
    nav.querySelectorAll('button[data-v]:not([data-kd])').forEach(b=>{const v=b.dataset.v;if(b.onclick)native.set(v,b.onclick);nav.querySelectorAll('button[data-kd][data-v="'+v+'"]').forEach(x=>x.remove());if(v==='plan'||v==='ideas'){b.dataset.kd='internal';b.dataset.kdInternal='true';b.onclick=()=>navigate(v);}});
    for(const [id,label,icon] of routes){
      let b=nav.querySelector('button[data-v="'+id+'"]');
      if(!b){if(NATIVE.has(id)&&!d.getElementById('v-'+id))continue;b=node('button');b.type='button';b.dataset.v=id;b.setAttribute('role','tab');}
      if(b.dataset.kd!=='route'){b.dataset.kd='route';b.replaceChildren();const image=node('img','ti');image.alt='';image.src=A.imgURL(icon);b.append(image,node('span','kd-nav-label',label),node('span','kd-nav-short',{home:'الرئيسية',today:'الوجبات',body:'المتابعة',community:'مجتمع',account:'المزيد'}[id]||label));b.onclick=()=>navigate(id);}
      nav.append(b);
    }
    const sel=route==='plan'?'account':route==='ideas'?'recipes':(route==='suggestions'&&matchMedia('(max-width:959px)').matches)?'today':route;
    nav.querySelectorAll('button[data-v]').forEach(b=>b.setAttribute('aria-selected',String(b.dataset.v===sel)));
  }
  function navigate(id,remember=true){
    if(!mounted||(!names[id]&&!native.has(id)))return;
    if(NATIVE.has(id)&&!d.getElementById('v-'+id)){A.toast('جارٍ تجهيز الصفحة…');return;}
    route=id;lastKey='';
    if(native.get(id))native.get(id).call(d.querySelector('#tabs button[data-v="'+id+'"]'));
    d.querySelectorAll('section.view').forEach(v=>{v.hidden=v.id!=='v-'+id;});
    const selected=id==='plan'?'account':id==='ideas'?'recipes':(id==='suggestions'&&matchMedia('(max-width:959px)').matches)?'today':id;
    d.querySelectorAll('#tabs button[data-v]').forEach(b=>b.setAttribute('aria-selected',String(b.dataset.v===selected)));
    d.documentElement.dataset.kdRoute=id;
    if(remember){try{localStorage.setItem(routeKey(),JSON.stringify(id));}catch{}}
    render();window.scrollTo(0,0);d.querySelector('#v-'+id+' h1')?.focus({preventScroll:true});
  }
  function mountPrograms(){
    const section=d.getElementById('v-programs');if(!section)return;
    if(!section.querySelector('.kd-page-heading')){
      section.prepend(heading('برنامجي الغذائي','خطتك الحالية وتوزيع الحصص والتفضيلات الغذائية.'));
      const intro=card('خطتك الحالية');intro.classList.add('kd-program-intro');
      intro.append(node('p','note','خيارات السعرات والحصص هي الخيارات الموجودة في نظامك الحالي. راجع الأخصائي قبل تغيير خطتك.'),button('تخطيط وجبات الأسبوع',()=>navigate('ideas')));section.append(intro);
    }
    ['levels','xtbl','fGluten','s-act'].forEach(id=>{const c=d.getElementById(id)?.closest('.card');if(c&&c.parentNode!==section){c.classList.remove('kcol');section.append(c);}});
  }
  function renderHydration(section){
    section.replaceChildren(heading('الماء والنشاط','تابع الماء وسجّل نشاطك اليومي.'));
    const day=A.dayOf(A.TODAY),goal=Number(A.settings().water)||8,count=A.bottles(day);
    const water=card('الماء اليوم');water.classList.add('kd-water-card');
    const current=node('strong','kd-metric',num(count)+' من '+num(goal)+' زجاجات');water.append(current,node('p','note','حجم الزجاجة 330 مل · '+num(count*330)+' مل مسجلة'));
    const p=node('progress');p.max=Math.max(goal,count,1);p.value=count;p.setAttribute('aria-label','الماء المسجل اليوم');water.append(p);
    const controls=node('div','kd-inline');
    function adjust(delta){const current=A.dayOf(A.TODAY);current.w3=bounded(A.bottles(current)+delta,goal+6);A.saveDay(current);A.refreshAll();render(true);}
    const minus=button('زجاجة أقل',()=>adjust(-1));minus.disabled=count<=0;
    const plus=button('شربت زجاجة',()=>adjust(1),'btn');plus.disabled=count>=goal+6;controls.append(plus,minus);water.append(controls);section.append(water);
    const activity=card('نشاطي اليوم');const target=Number(A.settings().stepsGoal)||7500;
    activity.append(node('strong','kd-metric',num(todaySteps())+' من '+num(target)+' خطوة'),node('p','note','سعرات النشاط: '+num(todayActive())+' سعرة · تُحفظ مع يومك وتتزامن مع حسابك.'));
    const form=node('form','kd-activity-form');const day0=A.dayOf(A.TODAY);
    for(const [name,label,max,val]of [['steps','خطوات اليوم',200000,day0.steps],['activeKcal','سعرات النشاط كما تعرضها الساعة (اختياري)',20000,day0.activeKcal]]){const field=node('label','kd-field');field.append(node('span','',label));const input=node('input');input.type='number';input.min='0';input.max=String(max);input.step='1';input.name=name;input.value=String(bounded(val,max));field.append(input);form.append(field);}
    const save=node('button','btn','حفظ نشاط اليوم');save.type='submit';form.append(save);
    form.onsubmit=e=>{e.preventDefault();const day=A.dayOf(A.TODAY);day.steps=bounded(form.elements.steps.value,200000);day.activeKcal=bounded(form.elements.activeKcal.value,20000);A.saveDay({...day});A.refreshAll();announce('تم حفظ نشاط اليوم');render(true);};
    activity.append(form);section.append(activity);
  }
  function recipesSetup(section){
    if(section.querySelector('.kd-recipe-controls')){renderRecipeList();return;}
    section.replaceChildren(heading('وصفات صحية','دليل المطابخ، ومقترحات اليوم، ووجبات خفة الجاهزة بكميات محسوبة وفق خطتك.'));
    const entry=node('div','kd-entry-grid');
    const lib=card('دليل وصفات المطابخ');lib.append(node('p','note','وصفات منزلية من ثمانية مطابخ مع القيم الغذائية والمفضلة.'),button('فتح دليل الوصفات',()=>window.KHIFFA_RECIPE_LIBRARY?window.KHIFFA_RECIPE_LIBRARY():A.toast('الدليل غير متاح الآن'),'btn'));
    const sug=card('مقترحات اليوم');sug.append(node('p','note','خمس وجبات مقترحة تتوازن مع ما سجلته اليوم.'),button('عرض مقترحات اليوم',()=>navigate('suggestions')));
    entry.append(lib,sug);section.append(entry);
    const controls=card();controls.classList.add('kd-recipe-controls');const search=node('input');search.type='search';search.placeholder='ابحث عن وصفة أو مكوّن';search.setAttribute('aria-label','البحث في الوصفات');search.value=query;
    search.oninput=()=>{query=search.value;renderRecipeList();};controls.append(search);
    const filters=node('div','kd-inline');
    for(const [id,label]of [['all','الكل'],...A.D.MEALS.map(m=>[m.k,m.t])]){const b=button(label,()=>{recipeFilter=id;filters.querySelectorAll('[data-filter]').forEach(x=>x.setAttribute('aria-pressed',String(x.dataset.filter===id)));renderRecipeList();},'fchip');b.dataset.filter=id;b.setAttribute('aria-pressed',String(id===recipeFilter));filters.append(b);}
    const fav=button('المفضلة فقط',()=>{favoritesOnly=!favoritesOnly;fav.setAttribute('aria-pressed',String(favoritesOnly));renderRecipeList();},'fchip');fav.setAttribute('aria-pressed',String(favoritesOnly));controls.append(node('h2','','وجبات خفة الجاهزة'),filters,fav);controls.prepend(controls.lastChild);
    const count=node('p','note');count.id='kdRecipeCount';count.setAttribute('aria-live','polite');const list=node('div','kd-recipe-grid');list.id='kdRecipeList';section.append(controls,count,list);renderRecipeList();
  }
  function favoriteIds(){const ids=A.settings().ideaFavorites;return Array.isArray(ids)?ids.filter(x=>typeof x==='string'):[];}
  function recipeAllowed(idea){const s=A.settings();return A.mealComps(idea.m,{idea:idea.id}).every(x=>!(s.noGluten&&x.food.gluten)&&!(s.noLactose&&x.food.lactose));}
  function photoFor(idea){const P=window.KHIFFA_PHOTOS; if(!P)return '';const text=idea.name;if(P.pick){const k=P.pick(text);if(P.P[k])return P.url(P.P[k],560);}const key=/دجاج|فراخ/.test(text)?'chicken':/سمك|سلمون/.test(text)?'fish':/شوفان/.test(text)?'oats':/زبادي|لبن/.test(text)?'yogurt':'salad';return P.url(P.P[key],560);}
  function renderRecipeList(){
    const list=d.getElementById('kdRecipeList');if(!list||!state())return;
    const norm=s=>String(s).replace(/[ً-ٰٟـ]/g,'').replace(/[أإآ]/g,'ا').replace(/ة/g,'ه');const q=norm(query.trim());const favs=favoriteIds();
    const recipes=A.D.IDEAS.filter(i=>(recipeFilter==='all'||i.m===recipeFilter)&&(!q||norm(i.name+' '+i.how).includes(q))&&(!favoritesOnly||favs.includes(i.id))&&recipeAllowed(i));
    list.replaceChildren();d.getElementById('kdRecipeCount').textContent=num(recipes.length)+' وصفة';
    if(!recipes.length){list.append(node('p','kd-empty','لا توجد وصفات تطابق البحث والتفضيلات الحالية.'));return;}
    recipes.forEach(idea=>{const c=card();c.classList.add('kd-recipe');const open=button('',()=>openRecipe(idea),'kd-recipe-open');const img=node('img');img.alt=idea.name;img.loading='lazy';img.src=photoFor(idea);open.append(img,node('h2','',idea.name));const total=A.totals(A.mealComps(idea.m,{idea:idea.id}));open.append(node('p','note',num(Math.round(total.n))+' سعرة حرارية · '+A.D.MEALS.find(m=>m.k===idea.m).t));const fav=button(favs.includes(idea.id)?'إزالة من المفضلة':'حفظ في المفضلة',()=>{const ids=favoriteIds();A.saveSettings({ideaFavorites:ids.includes(idea.id)?ids.filter(x=>x!==idea.id):[...ids,idea.id]});renderRecipeList();},'kd-recipe-favorite');fav.setAttribute('aria-pressed',String(favs.includes(idea.id)));c.append(open,fav);list.append(c);});
  }
  function openRecipe(idea){
    d.querySelector('.kd-recipe-dialog')?.remove();const modal=node('dialog','kd-recipe-dialog');modal.setAttribute('aria-label',idea.name);const content=node('div','kd-recipe-detail');const close=button('إغلاق',()=>modal.close(),'btn ghost');content.append(close,node('h2','',idea.name),node('p','',idea.how));
    const items=node('ul','kd-ingredients');A.mealComps(idea.m,{idea:idea.id}).forEach(x=>items.append(node('li','',x.food.name+' — '+A.amountText(x.food,x.n))));content.append(items);
    const meal=A.D.MEALS.find(m=>m.k===idea.m);content.append(button('إضافة إلى '+meal.t+' اليوم',()=>{A.setCur(A.TODAY);A.setMeal(meal.k,{mode:'idea',idea:idea.id,items:null,title:null,planned:false},A.TODAY);A.refreshAll();modal.close();announce('تمت إضافة الوصفة إلى '+meal.t);},'btn'));
    modal.append(content);modal.addEventListener('close',()=>modal.remove(),{once:true});d.body.append(modal);modal.showModal();
  }
  function goalTile(label,value,target,detail){const c=card(label);c.append(node('strong','kd-metric',detail));const p=node('progress');p.max=Math.max(Number(target)||1,Number(value)||0,1);p.value=bounded(value,p.max);p.setAttribute('aria-label',label);c.append(p,node('p','note',num(target?Math.min(100,Math.round(value/target*100)):0)+'%'));return c;}
  function renderGoals(section){
    section.replaceChildren(heading('أهدافي','تقدمك من بياناتك المسجلة، دون افتراض إنجازات غير موجودة.'));const s=A.settings(),day=A.dayOf(A.TODAY),grid=node('div','kd-goal-grid');
    const stepsGoal=Number(s.stepsGoal)||7500,activeGoal=Number(s.activeKcalGoal)||300;
    grid.append(goalTile('الماء',A.bottles(day),s.water,num(A.bottles(day))+' / '+num(s.water)+' زجاجات'),goalTile('الخطوات',todaySteps(),stepsGoal,num(todaySteps())+' / '+num(stepsGoal)+' خطوة'),goalTile('سعرات النشاط',todayActive(),activeGoal,num(todayActive())+' / '+num(activeGoal)+' سعرة'),goalTile('السعرات المسجلة',nutrition(),s.level,num(Math.round(nutrition()))+' / '+num(s.level)+' سعرة'));
    section.append(grid,node('p','note','نسبة السعرات تصف ما سُجل من هدف الخطة، وليست تقييمًا صحيًا.'));
    const c=card('إعداد أهداف المتابعة');const form=node('form','kd-goal-form');
    for(const [name,label,value,min,max]of [['water','هدف الماء (زجاجات 330 مل)',s.water,4,16],['stepsGoal','هدف الخطوات يوميًا',stepsGoal,100,100000],['activeKcalGoal','هدف سعرات النشاط يوميًا',activeGoal,10,5000]]){const field=node('label','kd-field');field.append(node('span','',label));const input=node('input');input.type='number';input.name=name;input.value=value;input.min=min;input.max=max;input.required=true;input.step='1';field.append(input);form.append(field);}
    const save=node('button','btn','حفظ أهداف المتابعة');save.type='submit';form.append(save);form.onsubmit=e=>{e.preventDefault();A.saveSettings({water:Number(form.elements.water.value),stepsGoal:Number(form.elements.stepsGoal.value),activeKcalGoal:Number(form.elements.activeKcalGoal.value)});announce('تم حفظ أهداف المتابعة');render(true);};c.append(form,button('تعديل الوزن المستهدف من قياسات الجسم',()=>navigate('body')));section.append(c);
  }
  function renderCommunity(section){
    section.replaceChildren(heading('المجتمع والدعم','المتابعة مع أخصائي التغذية، والدعم، ومسوداتك الخاصة.'));
    const care=card('المتابعة مع أخصائي');care.append(node('p','note','اربط حسابك بأخصائي، وتابع الخطة والرسائل، أو أدر متابعة المستخدمين حسب صلاحيتك.'),button('فتح المتابعة والرسائل',()=>window.KHIFFA_OPEN_CARE?window.KHIFFA_OPEN_CARE():A.toast('المتابعة غير متاحة الآن'),'btn'));section.append(care);
    const help=card('الدعم والمساعدة');help.append(node('p','note','الدعم والاقتراحات، والجولة التعريفية، وربط الهاتف أو البريد.'),button('فتح المساعدة وحسابي',()=>{navigate('plan');setTimeout(()=>d.getElementById('kfCommunity')?.scrollIntoView({behavior:'smooth',block:'start'}),60);}));section.append(help);
    const c=card('مسودتي الخاصة');c.append(node('p','note','لا يوجد نشر عام بين المستخدمين في هذه النسخة. المسودة خاصة ومحفوظة على هذا الجهاز فقط.'));
    const form=node('form','kd-draft-form'),label=node('label','kd-field');label.append(node('span','','أسئلة أو أفكار لمناقشتها مع الأخصائي'));const text=node('textarea');text.rows=5;text.maxLength=4000;text.name='draft';text.value=typeof readLocal().communityDraft==='string'?readLocal().communityDraft:'';label.append(text);const save=node('button','btn ghost','حفظ المسودة');save.type='submit';form.append(label,save);form.onsubmit=e=>{e.preventDefault();if(saveLocal({communityDraft:text.value}))announce('تم حفظ المسودة على هذا الجهاز');};c.append(form);section.append(c);
  }
  function renderAccount(section){
    const existing=d.getElementById('acct')?.closest('.card');section.replaceChildren(heading('حسابي','بيانات الحساب والوصول إلى أقسام خفة.'));
    const me=state().me||state().user;const profile=card(me.name||'حسابي');profile.classList.add('kd-profile');const roleNames={owner:'مالك المنصة',dietitian:'أخصائي تغذية',client:'عميل'};
    profile.append(node('p','note',roleNames[me.role]||'حساب مستخدم'));
    if(me.id!==state().user.id){profile.append(node('p','note','تعرض الآن بيانات '+A.displayName()),button('العودة إلى بيانات حسابي',()=>A.switchUser(me.id)));}
    section.append(profile);const grid=node('div','kd-account-links');routes.filter(r=>r[0]!=='account').forEach(([id,label])=>grid.append(button(label,()=>navigate(id),'kd-account-link')));grid.append(button('إعدادات التطبيق والمظهر',()=>navigate('plan'),'kd-account-link'));grid.append(button('دليل الاستخدام',()=>window.KHIFFA_GUIDE&&window.KHIFFA_GUIDE(),'kd-account-link'));section.append(grid);if(existing)section.append(existing);
  }
  // v39: زرّا التبديل «سجل وجباتي | مقترحات اليوم» أعلى الصفحتين
  function mealSwitch(){
    for(const id of ['today','suggestions']){
      const sec=d.getElementById('v-'+id);if(!sec)continue;let sw=sec.querySelector(':scope > .kd-mealswitch');
      if(!sw){sw=node('div','kd-mealswitch');sw.setAttribute('role','group');sw.setAttribute('aria-label','التبديل بين سجل الوجبات والمقترحات');
        sw.append(button('سجل وجباتي',()=>navigate('today'),''),button('مقترحات اليوم 🌍',()=>navigate('suggestions'),''));sec.prepend(sw);}
      else if(sec.firstElementChild!==sw)sec.prepend(sw);
      const [a,b]=sw.children;a.setAttribute('aria-pressed',String(route==='today'));b.setAttribute('aria-pressed',String(route==='suggestions'));
    }
  }
  function homeShortcuts(){const home=d.getElementById('v-home');if(!home||home.querySelector('.kd-shortcuts'))return;const links=node('div','kd-shortcuts');[['today','وجبات اليوم','fork_and_knife_with_plate'],['hydration','الماء','droplet'],['hydration','النشاط','running_shoe'],['body','الوزن','balance_scale'],['recipes','وصفات','green_salad'],['goals','أهدافي','bullseye']].forEach(([id,label,icon])=>{const b=button('',()=>navigate(id),'kd-shortcut');const im=node('img','kd-sc-ico');im.alt='';im.src=A.imgURL(icon);b.append(im,node('span','',label));links.append(b);});home.querySelector('.kd-tools')?.after(links);}
  function render(force=false){
    if(!state())return;mountPrograms();homeShortcuts();mealSwitch();
    const key=uid()+'|'+route+'|'+JSON.stringify(state().settings)+'|'+JSON.stringify(state().days)+'|'+JSON.stringify(state().inbody)+'|'+JSON.stringify(readLocal());
    if(!force&&key===lastKey)return;lastKey=key;const section=d.getElementById('v-'+route);if(!section)return;
    if(route==='hydration')renderHydration(section);else if(route==='recipes')recipesSetup(section);else if(route==='goals')renderGoals(section);else if(route==='community')renderCommunity(section);else if(route==='account')renderAccount(section);
  }
  function sync(){pending=false;if(!state())return;mount();if(mounted)adopt();render();}
  function schedule(){if(!pending){pending=true;requestAnimationFrame(sync);}}
  const observer=new MutationObserver(records=>{if(records.some(r=>r.type==='childList'&&r.addedNodes.length))schedule();});observer.observe(d.getElementById('app'),{childList:true,subtree:true});const navEl=d.getElementById('tabs');if(navEl)new MutationObserver(r=>{if(r.some(x=>[...x.addedNodes].some(n=>n.nodeType===1&&n.matches('button[data-v]:not([data-kd])'))))schedule();}).observe(navEl,{childList:true});
  (window.KHIFFA_HOOKS=window.KHIFFA_HOOKS||[]).push(schedule);
  (window.KHIFFA_LOGOUT_HOOKS=window.KHIFFA_LOGOUT_HOOKS||[]).push(()=>{d.querySelector('.kd-recipe-dialog')?.close();lastKey='';route='home';});
  window.addEventListener('storage',e=>{if(e.key===localKey())render(true);});
  sync();
})();
