/* خفّة · Khiffa — nutrition data
 * Exchange-list system (نظام البدائل). Every food entry is ONE exchange portion.
 * n = kcal, p/c/f = grams protein/carbs/fat per exchange (USDA-based averages, cooked weights unless noted).
 * tags: g = contains gluten, l = contains lactose, egg/tuna/red/liver/shrimp = weekly-limited, leg = legume (counts as 1 protein + 1 starch)
 * img = file in img/ (Fluent Emoji, MIT license, © Microsoft)
 */
window.KHIFFA_DATA = (function () {
  const GROUPS = {
    S:  { name: 'النشويات', short: 'نشويات', color: '#d9a441', hint: 'كل حصة ≈ ٨٠ سعرة' },
    P:  { name: 'البروتين', short: 'بروتين', color: '#e0784c', hint: 'كل حصة ≈ ٤٥–٧٥ سعرة و٧ جم بروتين' },
    M:  { name: 'الحليب والألبان', short: 'ألبان', color: '#6b9bd1', hint: 'كل حصة ≈ ١٠٠ سعرة' },
    F:  { name: 'الفاكهة', short: 'فاكهة', color: '#d65b7a', hint: 'كل حصة ≈ ٦٠ سعرة' },
    V:  { name: 'الخضار', short: 'خضار', color: '#2f9e7a', hint: 'كل حصة ≈ ٢٥ سعرة، وتقدري تزودي الورقيات براحتك' },
    Fa: { name: 'الدهون', short: 'دهون', color: '#9a7b4f', hint: 'كل حصة ≈ ٤٥ سعرة' }
  };

  // [id, group, name, grams-per-exchange, household measure, kcal, p, c, f, img, tags]
  const RAW = [
    // ---------- النشويات ----------
    ['toast','S','توست بر (أسمر)',30,'شريحة',75,3.5,12.5,1,'bread','g'],
    ['khubz','S','خبز بر / عربي أسمر',30,'ربع رغيف كبير',78,3,15,0.8,'flatbread','g'],
    ['rice','S','أرز أبيض مطبوخ',55,'ثلث كوب',72,1.5,15.5,0.2,'cooked_rice',''],
    ['brownrice','S','أرز بني مطبوخ',55,'ثلث كوب',68,1.4,14,0.5,'cooked_rice',''],
    ['potato','S','بطاطس مسلوقة أو بالفرن',100,'حبة صغيرة',87,1.9,20,0.1,'potato',''],
    ['sweetpot','S','بطاطا حلوة مشوية',90,'نص حبة متوسطة',81,1.8,18.6,0.1,'roasted_sweet_potato',''],
    ['pasta','S','مكرونة مطبوخة',55,'ثلث كوب',87,3.2,17,0.5,'spaghetti','g'],
    ['gfpasta','S','مكرونة أرز خالية الجلوتين',55,'ثلث كوب',80,1.5,17.5,0.5,'spaghetti',''],
    ['oats','S','شوفان (وزن جاف)',20,'٣ ملاعق كبيرة',78,2.6,13.3,1.4,'bowl_with_spoon','g'],
    ['corn','S','ذرة حلوة',80,'نص كوب',69,2.6,15,1,'ear_of_corn',''],
    ['quinoa','S','كينوا مطبوخة',65,'ثلث كوب',78,2.9,13.9,1.2,'sheaf_of_rice',''],
    ['bulgur','S','برغل مطبوخ',90,'نص كوب',75,2.8,16.8,0.2,'sheaf_of_rice','g'],
    ['ricecake','S','كعك الأرز',18,'قطعتين',70,1.4,14.5,0.5,'rice_cracker',''],
    ['popcorn','S','فشار بدون زيت',22,'٣ أكواب',85,2.8,17,1,'popcorn',''],
    ['squash','S','قرع عسلي مطبوخ',170,'كوب',68,1.5,17.6,0.2,'pot_of_food',''],

    // ---------- البروتين ----------
    ['chicken','P','صدور دجاج مشوية',30,'',49,9.3,0,1.1,'poultry_leg',''],
    ['turkey','P','صدور ديك رومي',30,'',42,8.8,0.5,0.6,'poultry_leg',''],
    ['fish','P','سمك أبيض مشوي (هامور، بلطي، فيليه)',35,'',45,9,0,1,'fish',''],
    ['salmon','P','سلمون مشوي',30,'',62,6.6,0,3.8,'fish',''],
    ['tuna','P','تونة بالماء مصفّاة',30,'',35,7.7,0,0.3,'canned_food','tuna'],
    ['shrimp','P','روبيان مطبوخ',35,'',35,8,0.1,0.4,'shrimp','shrimp'],
    ['beef','P','لحم بقري أو حاشي قليل الدهن',30,'',60,8.4,0,2.8,'cut_of_meat','red'],
    ['lamb','P','لحم غنم بدون دهن',30,'',62,8.5,0,3,'meat_on_bone','red'],
    ['kofta','P','كفتة لحم قليلة الدهن مشوية',30,'',70,7.5,0.5,4.3,'cut_of_meat','red'],
    ['liver','P','كبدة',30,'',52,8,1.5,1.4,'cut_of_meat','liver'],
    ['egg','P','بيضة كاملة',50,'بيضة',72,6.3,0.4,4.8,'egg','egg'],
    ['eggwhite','P','بياض بيض',66,'بياض بيضتين',34,7.2,0.5,0.1,'cooking',''],
    ['cottage','P','جبن قريش قليل الدسم',60,'ملعقتين كبار',49,6.6,2,1.4,'cheese_wedge','l'],
    ['greek','P','زبادي يوناني سادة قليل الدسم',75,'نص علبة صغيرة',55,7.5,3,1.5,'bowl_with_spoon','l'],
    ['feta','P','جبن فيتا قليل الدسم',30,'مكعب بحجم علبة الكبريت',54,5,1,3.5,'cheese_wedge','l'],
    ['halloumi','P','حلوم لايت',30,'شريحتين رفيعة',75,7,0.6,5,'cheese_wedge','l'],
    ['labneh','P','لبنة لايت',60,'ملعقتين كبار',66,5.4,2.5,3.9,'jar','l'],
    ['mozz','P','موزاريلا قليلة الدسم',30,'',76,7.3,0.8,4.8,'cheese_wedge','l'],
    ['foul','P','فول مدمس',100,'نص كوب',110,7.6,19.6,0.4,'beans','leg'],
    ['lentils','P','عدس مطبوخ',100,'نص كوب',116,9,20,0.4,'beans','leg'],
    ['chickpeas','P','حمص حب مطبوخ',80,'ثلث كوب',131,7.1,21.9,2.1,'falafel','leg'],
    ['kidney','P','فاصوليا حمراء مطبوخة',100,'نص كوب',127,8.7,22.8,0.5,'beans','leg'],

    // ---------- الحليب والألبان ----------
    ['milk','M','حليب قليل الدسم',240,'كوب (٢٤٠ مل)',102,8.2,12.2,2.4,'glass_of_milk','l'],
    ['laban','M','لبن رايب قليل الدسم',240,'كوب (٢٤٠ مل)',96,8.4,11.7,2.2,'glass_of_milk','l'],
    ['yogurt','M','زبادي قليل الدسم',170,'علبة',107,9,12,2.6,'bowl_with_spoon','l'],
    ['lfmilk','M','حليب خالي اللاكتوز قليل الدسم',240,'كوب (٢٤٠ مل)',105,8,12,2.5,'glass_of_milk',''],
    ['lfyogurt','M','زبادي خالي اللاكتوز',170,'علبة',105,8,12.5,2.5,'bowl_with_spoon',''],
    ['soy','M','حليب صويا غير محلّى',240,'كوب (٢٤٠ مل)',80,7,4,4,'glass_of_milk',''],

    // ---------- الفاكهة ----------
    ['apple','F','تفاح',110,'حبة صغيرة',57,0.3,15,0.2,'red_apple',''],
    ['banana','F','موز',65,'نص حبة كبيرة',58,0.7,15,0.2,'banana',''],
    ['orange','F','برتقال',130,'حبة متوسطة',61,1.2,15.3,0.2,'tangerine',''],
    ['mandarin','F','يوسفي',110,'حبتين صغار',58,0.9,14.7,0.3,'tangerine',''],
    ['strawberry','F','فراولة',190,'١٢ حبة',61,1.3,14.6,0.6,'strawberry',''],
    ['watermelon','F','حبحب',200,'كوب وربع',60,1.2,15,0.3,'watermelon',''],
    ['melon','F','شمام',170,'كوب مكعبات',58,1.4,13.9,0.3,'melon',''],
    ['grapes','F','عنب',85,'١٥ حبة',59,0.6,15.4,0.1,'grapes',''],
    ['dates','F','تمر',22,'حبتين صغار',62,0.5,16.5,0.1,'palm_tree',''],
    ['kiwi','F','كيوي',100,'حبة كبيرة',61,1.1,14.7,0.5,'kiwi_fruit',''],
    ['mango','F','مانجو',100,'نص كوب مكعبات',60,0.8,15,0.4,'mango',''],
    ['pineapple','F','أناناس',120,'ثلاثة أرباع كوب',60,0.6,15.8,0.1,'pineapple',''],
    ['blueberry','F','توت',100,'ثلاثة أرباع كوب',57,0.7,14.5,0.3,'blueberries',''],
    ['pear','F','كمثرى',100,'نص حبة كبيرة',57,0.4,15.2,0.1,'pear',''],
    ['peach','F','خوخ',150,'حبة كبيرة',59,1.4,14.3,0.4,'peach',''],
    ['guava','F','جوافة',90,'حبة متوسطة',61,2.3,12.9,0.9,'green_apple',''],
    ['pomegranate','F','رمان',75,'نص حبة صغيرة',62,1.3,14,0.9,'cherries',''],

    // ---------- الخضار ----------
    ['salad','V','سلطة خضراء (خس وجرجير)',100,'كوبين',17,1.4,3,0.2,'green_salad',''],
    ['cucumber','V','خيار',150,'حبة كبيرة',23,1,5.4,0.2,'cucumber',''],
    ['tomato','V','طماطم',120,'حبة كبيرة',22,1.1,4.7,0.2,'tomato',''],
    ['pepper','V','فلفل رومي ملون',100,'حبة',26,1,6,0.3,'bell_pepper',''],
    ['zucchini','V','كوسة مطبوخة',100,'نص كوب',17,1.2,3.1,0.3,'cucumber',''],
    ['eggplant','V','باذنجان مشوي',100,'نص كوب',35,0.8,8.7,0.2,'eggplant',''],
    ['broccoli','V','بروكلي مطبوخ',90,'نص كوب',32,2.2,6.3,0.4,'broccoli',''],
    ['carrot','V','جزر',70,'حبة متوسطة',29,0.6,6.7,0.2,'carrot',''],
    ['mushroom','V','فطر (مشروم)',100,'كوب',22,3.1,3.3,0.3,'mushroom',''],
    ['molokhia','V','ملوخية مطبوخة',100,'نص كوب',34,3.4,7,0.2,'leafy_green',''],
    ['okra','V','بامية مطبوخة',100,'نص كوب',22,1.9,4.5,0.2,'pea_pod',''],
    ['spinach','V','سبانخ مطبوخة',100,'نص كوب',23,3,3.8,0.3,'leafy_green',''],
    ['greenbeans','V','فاصوليا خضراء مطبوخة',100,'نص كوب',35,1.9,7.9,0.3,'pea_pod',''],
    ['onion','V','بصل',70,'نص حبة',28,0.8,6.5,0.1,'onion',''],

    // ---------- الدهون ----------
    ['oliveoil','Fa','زيت زيتون',5,'ملعقة صغيرة',40,0,0,4.5,'pouring_liquid',''],
    ['avocado','Fa','أفوكادو',30,'ملعقتين كبار',48,0.6,2.6,4.4,'avocado',''],
    ['almonds','Fa','لوز نيء',8,'٦ حبات',46,1.7,1.7,4,'chestnut',''],
    ['walnuts','Fa','عين جمل',7,'نصفين كبار',46,1.1,1,4.6,'chestnut',''],
    ['pistachio','Fa','فستق نيء',8,'١٠ حبات',45,1.6,2.2,3.6,'peanuts',''],
    ['pb','Fa','زبدة فول سوداني',8,'ملعقة صغيرة ونص',47,2,1.6,4,'peanuts',''],
    ['tahini','Fa','طحينة',7,'ملعقة صغيرة',42,1.2,1.5,3.8,'jar',''],
    ['olives','Fa','زيتون',40,'٨ حبات كبيرة',46,0.3,2.5,4.3,'olive',''],
    ['chia','Fa','بذور شيا',9,'ملعقة كبيرة',44,1.5,3.8,2.8,'seedling',''],
    ['sesame','Fa','سمسم',8,'ملعقة كبيرة',46,1.4,1.9,4,'seedling',''],
    ['butter','Fa','زبدة',5,'ملعقة صغيرة',36,0,0,4.1,'butter','l']
  ];
  const FOODS = {};
  RAW.forEach(r => {
    const tags = r[10] ? r[10].split(',') : [];
    FOODS[r[0]] = { id: r[0], g: r[1], name: r[2], grams: r[3], unit: r[4], n: r[5], p: r[6], c: r[7], f: r[8], img: r[9],
      gluten: tags.includes('g'), lactose: tags.includes('l'), leg: tags.includes('leg'),
      limit: tags.find(t => ['egg', 'tuna', 'red', 'liver', 'shrimp'].includes(t)) || null };
  });

  /* exchanges per meal for each calorie level.
     S نشويات · P بروتين · M ألبان · F فاكهة · V خضار · Fa دهون */
  const LEVELS = {
    1800: { b: { S: 2, P: 3, Fa: 1, V: 1 }, s1: { F: 1 }, l: { S: 3, P: 4, Fa: 2, V: 2 }, s2: { F: 1, M: 1 }, d: { S: 3, P: 4, M: 1, V: 1, Fa: 1 } },
    1700: { b: { S: 2, P: 3, Fa: 1, V: 1 }, s1: { F: 1 }, l: { S: 3, P: 4, Fa: 1, V: 2 }, s2: { F: 1, M: 1 }, d: { S: 2, P: 4, M: 1, V: 1, Fa: 1 } },
    1600: { b: { S: 2, P: 3, Fa: 1, V: 1 }, s1: { F: 1 }, l: { S: 2, P: 4, Fa: 1, V: 2 }, s2: { F: 1, M: 1 }, d: { S: 2, P: 4, M: 1, V: 1, Fa: 1 } },
    1500: { b: { S: 2, P: 3, Fa: 1, V: 1 }, s1: { F: 1 }, l: { S: 2, P: 4, Fa: 1, V: 2 }, s2: { F: 1, M: 1 }, d: { S: 2, P: 3, M: 1, V: 1 } },
    1400: { b: { S: 1, P: 3, Fa: 1, V: 1 }, s1: { F: 1 }, l: { S: 2, P: 4, Fa: 1, V: 2 }, s2: { F: 1, M: 1 }, d: { S: 2, P: 3, M: 1, V: 1 } }
  };

  const MEALS = [
    { k: 'b',  t: 'الفطور', when: 'بعد الاستيقاظ بساعة إلى ٣ ساعات', img: 'shallow_pan_of_food' },
    { k: 's1', t: 'سناك الصبح', when: 'بعد الفطور بساعتين', img: 'red_apple' },
    { k: 'l',  t: 'الغداء', when: 'بعد الفطور بـ٣–٤ ساعات، وقبل التمرين بـ٣ ساعات', img: 'curry_rice' },
    { k: 's2', t: 'سناك العصر', when: 'بعد الغداء بساعتين أو قبل التمرين بنص ساعة', img: 'glass_of_milk' },
    { k: 'd',  t: 'العشاء', when: 'بعد التمرين، وقبل النوم بـ٣ ساعات', img: 'green_salad' }
  ];

  /* Ready meals. parts: group → list of food ids; ['id', n] fixes that food's exchange count.
     Counts come from the calorie level, so every idea scales automatically. */
  const IDEAS = [
    // الفطور
    { id: 'b-foul', m: 'b', name: 'فول مدمس بزيت الزيتون', how: 'فول بالكمون والليمون وزيت الزيتون، مع بياض بيض مسلوق وخضار.', parts: { P: [['foul', 1], 'eggwhite'], S: ['khubz'], Fa: ['oliveoil'], V: ['tomato', 'cucumber'] } },
    { id: 'b-shak', m: 'b', name: 'شكشوكة بالفلفل', how: 'طماطم وفلفل على نار هادية بملعقة زيت، واكسري البيض فوقها.', parts: { P: ['egg', 'eggwhite'], S: ['khubz'], Fa: ['oliveoil'], V: ['tomato', 'pepper'] } },
    { id: 'b-omlt', m: 'b', name: 'أومليت خضار ومشروم', how: 'اخفقي البيض مع المشروم والفلفل، واطبخيه في طاسة غير لاصقة.', parts: { P: ['egg', 'eggwhite'], S: ['toast'], Fa: ['olives'], V: ['mushroom', 'pepper'] } },
    { id: 'b-oats', m: 'b', name: 'شوفان بالزبادي اليوناني والشيا', how: 'انقعي الشوفان بالماية بالليل، والصبح ضيفي الزبادي اليوناني والشيا والقرفة.', parts: { S: ['oats'], P: ['greek'], Fa: ['chia'] } },
    { id: 'b-saudi', m: 'b', name: 'فطور لبنة وبيض وزيتون', how: 'بيض مسلوق مع لبنة لايت وزيتون وخيار وطماطم وخبز أسمر.', parts: { P: ['egg', 'labneh'], S: ['khubz'], Fa: ['olives'], V: ['cucumber', 'tomato'] } },
    { id: 'b-sweet', m: 'b', name: 'بيض مسلوق وبطاطا حلوة وأفوكادو', how: 'بطاطا حلوة بالفرن مع بيض مسلوق وشرائح أفوكادو وسلطة.', parts: { P: ['egg', 'eggwhite'], S: ['sweetpot'], Fa: ['avocado'], V: ['salad'] } },
    { id: 'b-cottage', m: 'b', name: 'جبن قريش بالخيار والنعناع', how: 'جبن قريش بالنعناع والخيار المبشور وزيت زيتون، مع توست.', parts: { P: ['cottage'], S: ['toast'], Fa: ['oliveoil'], V: ['cucumber'] } },
    { id: 'b-halloumi', m: 'b', name: 'حلوم مشوي بالزعتر', how: 'حلوم لايت مشوي في طاسة بدون زيت، مع بياض بيض وطماطم وخبز.', parts: { P: [['halloumi', 1], 'eggwhite'], S: ['khubz'], V: ['tomato', 'cucumber'] } },
    { id: 'b-tuna', m: 'b', name: 'تونة بالليمون على كعك الأرز', how: 'تونة مصفّاة بالليمون والبقدونس والأفوكادو، على كعك الأرز.', parts: { P: ['tuna'], S: ['ricecake'], Fa: ['avocado'], V: ['cucumber', 'tomato'] } },
    { id: 'b-turkey', m: 'b', name: 'ساندوتش ديك رومي بالأفوكادو', how: 'توست بر بشرائح ديك رومي وأفوكادو مهروس وخس وطماطم.', parts: { P: ['turkey'], S: ['toast'], Fa: ['avocado'], V: ['salad', 'tomato'] } },
    { id: 'b-pancake', m: 'b', name: 'بان كيك شوفان', how: 'اخلطي الشوفان المطحون مع البيض وبياض البيض والقرفة، واعمليه أقراص في طاسة غير لاصقة.', parts: { S: ['oats'], P: ['eggwhite', ['egg', 1]], Fa: ['pb'] } },

    // سناك الصبح
    ...['apple', 'banana', 'orange', 'strawberry', 'watermelon', 'grapes', 'dates', 'kiwi', 'mango', 'pineapple', 'blueberry', 'pear', 'peach', 'guava', 'pomegranate', 'melon', 'mandarin']
      .map(f => ({ id: 's1-' + f, m: 's1', name: null, how: '', parts: { F: [f] } })),

    // الغداء
    { id: 'l-kabsa', m: 'l', name: 'كبسة دجاج خفيفة', how: 'دجاج مشوي على أرز مطبوخ ببهارات الكبسة بملعقة زيت، مع سلطة.', parts: { S: ['rice'], P: ['chicken'], Fa: ['oliveoil'], V: ['salad', 'tomato'] } },
    { id: 'l-sayadeya', m: 'l', name: 'سمك مشوي مع أرز صيادية', how: 'سمك أبيض مشوي بالليمون والكمون، مع أرز بالبصل المكرمل.', parts: { S: ['rice'], P: ['fish'], Fa: ['oliveoil'], V: ['salad', 'onion'] } },
    { id: 'l-molokhia', m: 'l', name: 'ملوخية بالدجاج', how: 'ملوخية بتقلية الثوم بملعقة زيت، ودجاج مسلوق أو مشوي، وأرز.', parts: { S: ['rice'], P: ['chicken'], Fa: ['oliveoil'], V: ['molokhia'] } },
    { id: 'l-pasta', m: 'l', name: 'مكرونة بالدجاج والبروكلي', how: 'مكرونة مع قطع دجاج وبروكلي ومشروم وثوم وزيت زيتون.', parts: { S: ['pasta'], P: ['chicken'], Fa: ['oliveoil'], V: ['broccoli', 'mushroom'] } },
    { id: 'l-bulgur', m: 'l', name: 'برغل بالدجاج والخضار', how: 'برغل مطبوخ بمرق الدجاج مع جزر وكوسة، ودجاج مشوي.', parts: { S: ['bulgur'], P: ['chicken'], Fa: ['oliveoil'], V: ['carrot', 'zucchini'] } },
    { id: 'l-salmon', m: 'l', name: 'سلمون مع بطاطا حلوة', how: 'سلمون بالفرن بالليمون والشبت، مع بطاطا حلوة وفاصوليا خضراء.', parts: { S: ['sweetpot'], P: ['salmon'], V: ['greenbeans', 'salad'] } },
    { id: 'l-mandi', m: 'l', name: 'مندي لحم خفيف', how: 'لحم بدون دهن مطبوخ على البخار ببهارات المندي، مع أرز وسلطة حارة.', parts: { S: ['rice'], P: ['beef'], V: ['salad', 'tomato'] } },
    { id: 'l-fasolia', m: 'l', name: 'فاصوليا حمراء باللحمة مع أرز', how: 'فاصوليا بصلصة الطماطم وقطع لحم قليل الدهن، مع أرز أبيض.', parts: { P: [['kidney', 1], 'beef'], S: ['rice'], Fa: ['oliveoil'], V: ['tomato', 'onion'] } },
    { id: 'l-kofta', m: 'l', name: 'كفتة مشوية مع بطاطس بالفرن', how: 'كفتة لحم قليل الدهن على الشواية، مع بطاطس بالفرن وسلطة.', parts: { S: ['potato'], P: ['kofta'], V: ['salad', 'onion'] } },
    { id: 'l-tikka', m: 'l', name: 'دجاج تكا مع كينوا', how: 'دجاج متبل بالزبادي وبهارات التكا بالفرن، مع كينوا وفلفل مشوي.', parts: { S: ['quinoa'], P: ['chicken'], Fa: ['oliveoil'], V: ['pepper', 'onion'] } },
    { id: 'l-shrimp', m: 'l', name: 'روبيان مشوي مع أرز', how: 'روبيان بالثوم والليمون على الشواية، مع أرز وسلطة.', parts: { S: ['rice'], P: ['shrimp'], Fa: ['oliveoil'], V: ['salad', 'tomato'] } },
    { id: 'l-tray', m: 'l', name: 'صينية دجاج وخضار بالفرن', how: 'دجاج وبطاطس وجزر وكوسة وفلفل بالفرن بملعقة زيت وبهارات.', parts: { S: ['potato'], P: ['chicken'], Fa: ['oliveoil'], V: ['carrot', 'zucchini'] } },
    { id: 'l-gfpasta', m: 'l', name: 'مكرونة أرز بالتونة والطماطم', how: 'مكرونة خالية الجلوتين بصلصة طماطم وفلفل وتونة مصفّاة.', parts: { S: ['gfpasta'], P: ['tuna'], Fa: ['oliveoil'], V: ['tomato', 'pepper'] } },
    { id: 'l-okra', m: 'l', name: 'بامية باللحمة مع أرز', how: 'بامية بصلصة الطماطم مع لحم قليل الدهن، وأرز.', parts: { S: ['rice'], P: ['lamb'], Fa: ['oliveoil'], V: ['okra', 'tomato'] } },

    // سناك العصر
    { id: 's2-yogberry', m: 's2', name: 'زبادي بالتوت', how: 'علبة زبادي مع توت طازج أو فروزن.', parts: { F: ['blueberry'], M: ['yogurt'] } },
    { id: 's2-milkdates', m: 's2', name: 'حليب بالتمر', how: 'كوب حليب مع حبتين تمر.', parts: { F: ['dates'], M: ['milk'] } },
    { id: 's2-smoothie', m: 's2', name: 'سموذي موز بالحليب', how: 'اخلطي الموز مع الحليب والقرفة والتلج.', parts: { F: ['banana'], M: ['milk'] } },
    { id: 's2-laban', m: 's2', name: 'لبن مع تفاحة', how: 'كوب لبن بارد مع تفاحة صغيرة.', parts: { F: ['apple'], M: ['laban'] } },
    { id: 's2-mango', m: 's2', name: 'زبادي خالي اللاكتوز بالمانجو', how: 'زبادي خالي اللاكتوز مع مكعبات مانجو.', parts: { F: ['mango'], M: ['lfyogurt'] } },
    { id: 's2-soy', m: 's2', name: 'سموذي فراولة بحليب الصويا', how: 'اخلطي الفراولة مع حليب الصويا غير المحلّى.', parts: { F: ['strawberry'], M: ['soy'] } },
    { id: 's2-kiwi', m: 's2', name: 'زبادي بالكيوي', how: 'علبة زبادي مع كيوي مقطع.', parts: { F: ['kiwi'], M: ['yogurt'] } },

    // العشاء
    { id: 'd-tunasalad', m: 'd', name: 'سلطة تونة بالذرة وكوب لبن', how: 'تونة مصفّاة مع ذرة وخس وخيار وليمون وزيت زيتون، وكوب لبن.', parts: { S: ['corn'], P: ['tuna'], M: ['laban'], Fa: ['oliveoil'], V: ['salad', 'cucumber'] } },
    { id: 'd-chsand', m: 'd', name: 'ساندوتش دجاج مع زبادي', how: 'خبز بر بصدور دجاج مشوية وخس وطماطم وأفوكادو، وعلبة زبادي.', parts: { S: ['khubz'], P: ['chicken'], M: ['yogurt'], Fa: ['avocado'], V: ['salad', 'tomato'] } },
    { id: 'd-lentil', m: 'd', name: 'شوربة عدس وجبن قريش', how: 'شوربة عدس بالكمون والليمون، مع جبن قريش وسلطة ولبن.', parts: { P: [['lentils', 2], 'cottage'], S: ['khubz'], M: ['laban'], Fa: ['oliveoil'], V: ['salad'] } },
    { id: 'd-biryani', m: 'd', name: 'برياني لحم مع رايتا', how: 'أرز برياني بقطع لحم قليل الدهن، مع زبادي بالخيار والنعناع.', parts: { S: ['rice'], P: ['beef'], M: ['yogurt'], V: ['cucumber', 'onion'] } },
    { id: 'd-eggs', m: 'd', name: 'بيض وجبن قريش مع توست', how: 'بيض مسلوق وجبن قريش بالطماطم والخيار، وكوب حليب.', parts: { P: [['egg', 2], 'cottage'], S: ['toast'], M: ['milk'], V: ['cucumber', 'tomato'] } },
    { id: 'd-fatteh', m: 'd', name: 'فتة حمص بالزبادي', how: 'خبز محمص في الفرن، وحمص حب، وزبادي بالثوم، وطحينة.', parts: { P: [['chickpeas', 2], 'greek'], S: ['khubz'], M: ['yogurt'], Fa: ['tahini'] } },
    { id: 'd-fish', m: 'd', name: 'سمك مع بطاطس وسلطة زبادي', how: 'فيليه سمك بالفرن مع بطاطس مسلوقة، وسلطة زبادي بالخيار.', parts: { S: ['potato'], P: ['fish'], M: ['yogurt'], Fa: ['oliveoil'], V: ['salad'] } },
    { id: 'd-shawarma', m: 'd', name: 'شاورما دجاج صحية', how: 'دجاج متبل بالفرن في خبز بر مع خس وطماطم وبصل وطحينة خفيفة، وكوب لبن.', parts: { S: ['khubz'], P: ['chicken'], M: ['laban'], Fa: ['tahini'], V: ['salad', 'tomato'] } },
    { id: 'd-quinoa', m: 'd', name: 'بول كينوا بالدجاج', how: 'كينوا مع دجاج وفلفل وخيار وأفوكادو، وزبادي خالي اللاكتوز.', parts: { S: ['quinoa'], P: ['chicken'], M: ['lfyogurt'], Fa: ['avocado'], V: ['pepper', 'cucumber'] } },
    { id: 'd-shrimpsalad', m: 'd', name: 'سلطة روبيان بالأفوكادو', how: 'روبيان مشوي مع خس وخيار وأفوكادو، وكعك الأرز، وكوب حليب صويا.', parts: { S: ['ricecake'], P: ['shrimp'], M: ['soy'], Fa: ['avocado'], V: ['salad', 'cucumber'] } },
    { id: 'd-turkeywrap', m: 'd', name: 'راب ديك رومي', how: 'خبز عربي أسمر بديك رومي وخضار ولبنة، مع كوب لبن.', parts: { S: ['khubz'], P: ['turkey', ['labneh', 1]], M: ['laban'], V: ['salad', 'cucumber'] } }
  ];

  const LIMITS = [['egg', 'بيض بالصفار', 3], ['tuna', 'تونة', 2], ['red', 'لحم أحمر', 3], ['liver', 'كبدة', 1], ['shrimp', 'روبيان', 1]];

  const FREE = ['خضار ورقية (خس، جرجير، بقدونس، كزبرة، نعناع) براحتك', 'ليمون وخل وبهارات وأعشاب', 'قهوة وشاي بدون سكر ولا حليب', 'شاي أعشاب (بابونج، زنجبيل، نعناع)', 'ماية فوّارة بدون سكر'];

  const TIPS = [
    'كل الأوزان في خفّة بعد الطبخ، ما عدا الشوفان (وزن جاف).',
    'لو بتختاري بنفسك: كل حصة في مجموعة تتبدل بأي حصة من نفس المجموعة، والكمية بتتحسب لوحدها.',
    'البقوليات (فول، عدس، حمص، فاصوليا) بتتحسب حصة بروتين + حصة نشويات، فبتقلل النشويات في نفس الوجبة.',
    'ما تعدّيش أكتر من ٤ ساعات بين كل وجبة والتانية، وما تتخطيش وجبات.',
    'الخضار مع كل وجبة رئيسية، وكل ما زودتي الورقيات كان أحسن للشبع.',
    'البيض بالصفار ٣ مرات في الأسبوع، وبياض البيض مسموح كل يوم.',
    'التونة مرة لمرتين في الأسبوع، واللحم الأحمر لحد ٣ مرات، والكبدة والروبيان مرة.',
    'الماية ٢–٢٫٥ لتر في اليوم على الأقل (٨–١٠ أكواب).',
    'البروتين باودر بعد التمرين: السكوب ≈ ١٢٠ سعرة و٢٤ جم بروتين = ٣ حصص بروتين، فقللي بروتين العشا.',
    'عند الجوع: ٣ أكواب فشار بدون زيت = حصة نشويات، أو خضار براحتك.',
    'كلي ببطء: الوجبة الرئيسية ٢٠–٣٠ دقيقة، والسناك ١٠–١٥ دقيقة.'
  ];

  return { GROUPS, FOODS, LEVELS, MEALS, IDEAS, LIMITS, FREE, TIPS };
})();
