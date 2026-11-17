"""Builds ar.html from index.html. Every replacement must match, so any change to the English
page that is not mirrored here fails the build instead of leaving English behind."""
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
html = (ROOT / 'index.html').read_text()

SECTION_CODES = [('A1', 'أ1'), ('B1', 'ب1'), ('C1', 'ج1'), ('D1', 'د1'), ('E1', 'هـ1'), ('F1', 'و1'), ('G1', 'ز1'), ('H1', 'ح1')]

# (english, arabic, how many times it must appear; 0 = at least once, replace all)
PAIRS = [
    # head
    ('<html lang="en" dir="ltr">', '<html lang="ar" dir="rtl">', 1),
    ('<title>The Mansouri Gazette | Yara Al-Mansouri, PhD</title>', '<title>جريدة المنصوري | د. يارا المنصوري</title>', 1),
    ('<meta name="description" content="The Mansouri Gazette: the career of Yara Saud Al-Mansouri, PhD, Principal Product Engineer and Design Technology Lead in Riyadh, told as a vintage broadsheet newspaper.">',
     '<meta name="description" content="جريدة المنصوري: المسيرة المهنية للدكتورة يارا سعود المنصوري، كبيرة مهندسي المنتجات وقائدة تقنيات التصميم في الرياض، في هيئة جريدة كلاسيكية.">', 1),
    ('<meta property="og:title" content="The Mansouri Gazette | Yara Al-Mansouri, PhD">', '<meta property="og:title" content="جريدة المنصوري | د. يارا المنصوري">', 1),
    ('<meta property="og:description" content="16 years, 40+ products, 9 million readers. A product engineer\'s career, in newsprint.">',
     '<meta property="og:description" content="مسيرة مهندسة منتجات من الرياض، في ورق الجرائد وبلغتين.">', 1),
    # cover
    ('Skip to the front page', 'انتقل إلى الصفحة الأولى', 1),
    ('aria-label="Photograph: the towers of the King Abdullah Financial District in Riyadh at dusk"',
     'aria-label="صورة: أبراج مركز الملك عبدالله المالي في الرياض عند الغسق"', 1),
    ('<span class="tag">THE RIYADH EDITION<span lang="ar" dir="rtl">طبعة الرياض</span></span>', '<span class="tag">طبعة الرياض<span lang="en" dir="ltr">THE RIYADH EDITION</span></span>', 1),
    ("Read today's paper ↓", 'اقرأ عدد اليوم ↓', 1),
    # masthead
    ('<b>Today\'s lead · <span lang="ar" dir="rtl">خبر اليوم</span></b>Riyadh engineer builds products that read both ways. Page A1.',
     '<b>خبر اليوم · <span lang="en" dir="ltr">Today\'s lead</span></b>مهندسة من الرياض تبني منتجات تُقرأ في الاتجاهين. الصفحة أ1.', 1),
    ('“Designed with care, built to be read, in either direction.”', '«صُمّمت بعناية، وبُنيت لتُقرأ، في أيّ اتجاه.»', 1),
    ('<span class="ar-name" lang="ar" dir="rtl" aria-hidden="true">جريدة المنصوري</span>\n    <h1 aria-label="The Mansouri Gazette"><span>The Mansouri Gazette</span></h1>',
     '<span class="ar-name" lang="en" dir="ltr" aria-hidden="true">The Mansouri Gazette</span>\n    <h1><span>جريدة المنصوري</span></h1>', 1),
    ('<span>Vol. XVI · No. 40</span>', '<span>السنة السادسة عشرة · العدد 40</span>', 1),
    ('<span>Riyadh, Saudi Arabia</span>', '<span>الرياض، المملكة العربية السعودية</span>', 1),
    ('<span id="today">Monday, 16 November 2026</span>', '<span id="today">الاثنين 16 نوفمبر 2026</span>', 1),
    ('<span>Portfolio Edition</span>', '<span>طبعة الملف المهني</span>', 1),
    # section strip, drawer and language switch
    ('aria-label="The Mansouri Gazette, front page"', 'aria-label="جريدة المنصوري، الصفحة الأولى"', 1),
    ('<span>The Mansouri Gazette</span></a>', '<span>جريدة المنصوري</span></a>', 1),
    ('<nav aria-label="Sections">', '<nav aria-label="الأقسام">', 1),
    ('<a class="sec" href="#front">Front Page ', '<a class="sec" href="#front">الصفحة الأولى ', 1),
    ('<a class="sec" href="#business">Business ', '<a class="sec" href="#business">الاقتصاد ', 1),
    ('<a class="sec" href="#features">Features ', '<a class="sec" href="#features">تحقيقات ', 1),
    ('<a class="sec" href="#classifieds">Classifieds ', '<a class="sec" href="#classifieds">إعلانات ', 1),
    ('<a class="sec" href="#research">Science ', '<a class="sec" href="#research">العلوم ', 1),
    ('<a class="sec" href="#honours">Honours ', '<a class="sec" href="#honours">الشرف ', 1),
    ('<a class="sec" href="#academy">Academy ', '<a class="sec" href="#academy">الأكاديمية ', 1),
    ('<a class="sec" href="#letters">Letters ', '<a class="sec" href="#letters">الرسائل ', 1),
    ('<a class="lang" href="ar.html" hreflang="ar" lang="ar" data-lang>عربي<span class="sr-only"> (Arabic edition)</span></a>',
     '<a class="lang" href="index.html" hreflang="en" data-lang><span lang="en">English</span><span class="sr-only">، النسخة الإنجليزية</span></a>', 1),
    ('aria-controls="drawer">Sections</button>', 'aria-controls="drawer">الأقسام</button>', 1),
    ('<div class="drawer" id="drawer" role="dialog" aria-modal="true" aria-label="Sections">', '<div class="drawer" id="drawer" role="dialog" aria-modal="true" aria-label="الأقسام">', 1),
    ('<header><b>Sections</b><button class="btn" type="button" data-close>Close</button></header>', '<header><b>الأقسام</b><button class="btn" type="button" data-close>إغلاق</button></header>', 1),
    ('<nav aria-label="Sections, mobile">', '<nav aria-label="الأقسام، للهاتف">', 1),
    ('<a href="#front">Front Page ', '<a href="#front">الصفحة الأولى ', 1),
    ('<a href="#business">Business ', '<a href="#business">الصفحات الاقتصادية ', 1),
    ('<a href="#features">Features ', '<a href="#features">تحقيقات ', 1),
    ('<a href="#classifieds">Classifieds ', '<a href="#classifieds">الإعلانات المبوبة ', 1),
    ('<a href="#research">Science &amp; Letters ', '<a href="#research">العلوم والآداب ', 1),
    ('<a href="#honours">Honours ', '<a href="#honours">لوحة الشرف ', 1),
    ('<a href="#academy">Academy ', '<a href="#academy">الأكاديمية والإعلانات ', 1),
    ('<a href="#letters">Letters to the Editor ', '<a href="#letters">رسائل إلى المحرر ', 1),
    ('<a class="lang" href="ar.html" hreflang="ar" lang="ar" data-lang>اقرأ بالعربية</a>', '<a class="lang" href="index.html" hreflang="en" lang="en" data-lang>Read in English</a>', 1),
    ('role="region" aria-label="In this edition">\n  <span class="lbl">In this edition</span>', 'role="region" aria-label="في هذا العدد">\n  <span class="lbl">في هذا العدد</span>', 1),
    ('aria-pressed="false">Pause</button>', 'aria-pressed="false">إيقاف مؤقت</button>', 1),
    # front page
    ('<span class="kicker">Exclusive · Technology &amp; Design</span>', '<span class="kicker">خاص · التقنية والتصميم</span>', 1),
    ('Riyadh Engineer Builds Products That Read Both Ways', 'مهندسة من الرياض تبني منتجات تُقرأ في الاتجاهين', 1),
    ('<p class="deck">Principal Product Engineer, Design Technology Lead and HCI researcher, designing products that read naturally in Arabic and English.</p>',
     '<p class="deck">كبيرة مهندسي المنتجات، وقائدة تقنيات التصميم، وباحثة في التفاعل بين الإنسان والحاسوب؛ تصمّم منتجات تُقرأ بسلاسة بالعربية والإنجليزية.</p>', 1),
    ('<span>By <b>The Editorial Desk</b></span><span>Riyadh Bureau</span><span>Filed 16 Nov 2026</span><span>Reading time: one coffee</span>',
     '<span>بقلم <b>هيئة التحرير</b></span><span>مكتب الرياض</span><span>نُشر في 16 نوفمبر 2026</span><span>مدة القراءة: فنجان قهوة</span>', 1),
    ('<p class="dropcap">Yara Saud Al-Mansouri builds digital products in Saudi Arabia and the United Kingdom, across health tech, fintech, education and mobility. She leads teams from the first research interview to launch, and colleagues note she still designs and writes code every week.</p>',
     '<p>تبني يارا سعود المنصوري منتجات رقمية في المملكة العربية السعودية والمملكة المتحدة، في مجالات التقنية الصحية والمالية والتعليم والتنقّل. تقود فرقها من أول مقابلة بحثية حتى الإطلاق، ويشهد زملاؤها أنها ما زالت تصمّم وتكتب الشيفرة كل أسبوع.</p>', 1),
    ('<p>Her work spans a national telemedicine service, a fintech super-app, an open-source library used across the Arab world and two startups of her own. Her PhD in Human-Computer Interaction, focused on Arabic interfaces, produced a granted patent.</p>',
     '<p>تمتد أعمالها من خدمة وطنية للطب الاتصالي، إلى تطبيق مالي شامل، فمكتبة مفتوحة المصدر تُستخدم في أنحاء العالم العربي، وشركتين ناشئتين أسّستهما. وقد أثمرت أطروحتها للدكتوراه في التفاعل بين الإنسان والحاسوب، المتخصصة في الواجهات العربية، براءةَ اختراع ممنوحة.</p>', 1),
    ('<p>She now serves as Principal Product Engineer and Design Technology Lead at Faseela Ventures, where she sets the front-end and design-system direction for the whole product.</p>',
     '<p>وهي اليوم كبيرة مهندسي المنتجات وقائدة تقنيات التصميم في «فسيلة فنتشرز»، حيث ترسم توجّه الواجهات الأمامية ونظام التصميم للمنتج بأكمله.</p>', 1),
    ('<a class="btn solid" href="#features">Read the features</a>', '<a class="btn solid" href="#features">اقرأ التحقيقات</a>', 1),
    ('rel="noopener">Take the print edition (CV)</a>', 'rel="noopener">خذ النسخة المطبوعة (السيرة الذاتية)</a>', 1),
    ('aria-label="Wire services"', 'aria-label="وكالات الأنباء"', 1),
    ('<span class="stamp">PhD · HCI</span>', '<span class="stamp">دكتوراه</span>', 1),
    ('<figcaption>Fig. 1: Lines of type running in both directions, set by our compositor. Move your pointer over the plate to disturb the ink.</figcaption>',
     '<figcaption>شكل 1: أسطر من الحروف تجري في الاتجاهين، صفّها منضّد الجريدة. مرّر المؤشر فوق اللوحة لتحرّك الحبر.</figcaption>', 1),
    ('aria-label="Front page sidebar"', 'aria-label="الشريط الجانبي للصفحة الأولى"', 1),
    ('<h3>By the Numbers</h3>', '<h3>بالأرقام</h3>', 1),
    ('<h3>Forecast</h3>\n      Riyadh, outlook for hiring managers\n      <b>Clear, 100% chance of shipping</b>\n      Light accessibility reviews, no major findings expected.',
     '<h3>حالة الطقس</h3>\n      الرياض، توقعات لمديري التوظيف\n      <b>صحو، واحتمال الإطلاق 100%</b>\n      مراجعات خفيفة لإتاحة الوصول، ولا ملاحظات جوهرية متوقعة.', 1),
    # section heads: Arabic leads, English becomes the subtitle
    ('The Business Pages<span class="ar" lang="ar" dir="rtl">الصفحات الاقتصادية</span>', 'الصفحات الاقتصادية<span class="ar" lang="en" dir="ltr">The Business Pages</span>', 1),
    ('Features<span class="ar" lang="ar" dir="rtl">تحقيقات</span>', 'تحقيقات<span class="ar" lang="en" dir="ltr">Features</span>', 1),
    ('Classifieds<span class="ar" lang="ar" dir="rtl">الإعلانات المبوبة</span>', 'الإعلانات المبوبة<span class="ar" lang="en" dir="ltr">Classifieds</span>', 1),
    ('Science &amp; Letters<span class="ar" lang="ar" dir="rtl">العلوم والآداب</span>', 'العلوم والآداب<span class="ar" lang="en" dir="ltr">Science &amp; Letters</span>', 1),
    ('The Honours List<span class="ar" lang="ar" dir="rtl">لوحة الشرف</span>', 'لوحة الشرف<span class="ar" lang="en" dir="ltr">The Honours List</span>', 1),
    ('Academy &amp; Notices<span class="ar" lang="ar" dir="rtl">الأكاديمية والإعلانات</span>', 'الأكاديمية والإعلانات<span class="ar" lang="en" dir="ltr">Academy &amp; Notices</span>', 1),
    ('Letters to the Editor<span class="ar" lang="ar" dir="rtl">رسائل إلى المحرر</span>', 'رسائل إلى المحرر<span class="ar" lang="en" dir="ltr">Letters to the Editor</span>', 1),
    # business
    ('<p class="ssub">Dispatches from a career that began at the freelance desk</p>', '<p class="ssub">رسائل من مسيرة بدأت على مكتب العمل الحر</p>', 1),
    ('<div class="sfolio">Section B · Pages B1 to B4</div>', '<div class="sfolio">القسم ب · الصفحات من ب1 إلى ب4</div>', 1),
    ('Startup desk · Two ventures, two endings', 'مكتب الشركات الناشئة · مشروعان ونهايتان', 1),
    ('Beyond the day job · Held alongside the full-time roles above', 'خارج ساعات الدوام · أدوار تؤديها إلى جانب وظائفها بدوام كامل', 1),
    # features
    ('Eight case studies, each with the problem, the work and the measured result', 'ثمانية تحقيقات، في كلٍّ منها المشكلة والعمل والنتيجة المقيسة', 1),
    ('Section C · Open any feature to read it in full and try its demonstration', 'القسم ج · افتح أي تحقيق لتقرأه كاملًا وتجرّب عرضه الحي', 1),
    ('aria-label="Filter features by subject"', 'aria-label="تصفية التحقيقات حسب الموضوع"', 1),
    # classifieds
    ('Skills on offer. Rates negotiable, references available', 'مهارات معروضة. الأجر قابل للتفاوض، والتزكيات متوفرة', 1),
    ('Section D · Bars show years of practice on an 18-year scale, as listed on the CV', 'القسم د · تُظهر الأشرطة سنوات الممارسة على مقياس من 18 عامًا، كما وردت في السيرة الذاتية', 1),
    ('aria-label="Filter skills by level"', 'aria-label="تصفية المهارات حسب المستوى"', 1),
    # research
    ('<p class="ssub">Patents, papers and the speaking circuit</p>', '<p class="ssub">براءات الاختراع والأبحاث والمحاضرات</p>', 1),
    ('Section E · 2 patents · 9 publications · 31 talks', 'القسم هـ · براءتا اختراع · 9 منشورات · 31 محاضرة', 1),
    ('<h3>From the Patent Office</h3><p class="hint">One granted, one pending</p>', '<h3>من مكتب براءات الاختراع</h3><p class="hint">واحدة ممنوحة، وأخرى قيد الدراسة</p>', 1),
    ('<h3>The Press Notes</h3><p class="hint">Media and writing</p>', '<h3>في الصحافة</h3><p class="hint">الإعلام والكتابة</p>', 1),
    ('<h3>Journal Abstracts</h3><p class="hint">6 selected of 9 · ', '<h3>ملخصات الدوريات</h3><p class="hint">6 مختارة من 9 · ', 1),
    ('rel="noopener">full list</a>', 'rel="noopener">القائمة الكاملة</a>', 1),
    ('<h3>Lecture Circuit</h3><p class="hint">8 selected of 31 talks and keynotes</p>', '<h3>جولة المحاضرات</h3><p class="hint">8 مختارة من 31 محاضرة وكلمة رئيسية</p>', 1),
    # honours
    ('Special editions, printed as the news broke', 'ملاحق خاصة، طُبعت لحظة صدور الخبر', 1),
    ('Section F · Ten awards, 2010 to 2025', 'القسم و · عشر جوائز، من 2010 إلى 2025', 1),
    ('Extra! Extra!', 'عاجل! عاجل!', 3),
    ('<span class="ed">Special Edition · 2025</span>', '<span class="ed">ملحق خاص · 2025</span>', 1),
    ('<h3>Al-Mansouri Named Design Technology Leader of the Year</h3>', '<h3>المنصوري قائدةً لتقنيات التصميم لهذا العام</h3>', 1),
    ('<p>Gulf Design Week Awards cite Mizan, the bilingual design system behind a fintech super-app.</p>', '<p>جوائز أسبوع الخليج للتصميم تكرّم «ميزان»، نظام التصميم ثنائي اللغة خلف تطبيق مالي شامل.</p>', 1),
    ('<span class="stamp">Winner</span>', '<span class="stamp">فائزة</span>', 2),
    ('<span class="ed">Late Edition · 2024</span>', '<span class="ed">الطبعة الأخيرة · 2024</span>', 1),
    ('<h3>Savings Goals Takes Best Fintech Experience</h3>', '<h3>«أهداف الادخار» تنال جائزة أفضل تجربة مالية</h3>', 1),
    ('<p>Arab Fintech Excellence Awards recognise a savings feature built from research with real savers.</p>', '<p>جوائز التميّز العربي للتقنية المالية تكرّم ميزة ادخار بُنيت على بحث مع مدّخرين حقيقيين.</p>', 1),
    ('<span class="ed">Evening Edition · 2022</span>', '<span class="ed">الطبعة المسائية · 2022</span>', 1),
    ('<h3>Thesis on Arabic Type Wins Best Doctoral Thesis in HCI</h3>', '<h3>أطروحة عن الحرف العربي تفوز بجائزة أفضل أطروحة دكتوراه</h3>', 1),
    ('<p>Eastmoor Institute of Technology honours her research on adaptive Arabic type. A patent followed.</p>', '<p>معهد إيستمور للتقنية يكرّم بحثها في الحرف العربي المتكيّف، وقد تبعته براءة اختراع.</p>', 1),
    ('<span class="stamp blue">Honoured</span>', '<span class="stamp blue">تكريم</span>', 1),
    # academy
    ('Degrees conferred and certificates on record', 'الدرجات العلمية الممنوحة والشهادات المسجّلة', 1),
    ('Section G · Four qualifications · Twenty certification notices', 'القسم ز · أربعة مؤهلات · عشرون إعلانًا عن شهادات مهنية', 1),
    ('<span class="yr">Sep 2018 – Jul 2022</span><h3>PhD in Human-Computer Interaction</h3><div class="inst">Eastmoor Institute of Technology, part-time and remote</div><ul><li>Thesis: “Adaptive Typography for Arabic Interfaces: Readability, Density and Trust”</li><li><b>Best Doctoral Thesis in HCI, 2022</b></li></ul>',
     '<span class="yr">سبتمبر 2018 – يوليو 2022</span><h3>دكتوراه في التفاعل بين الإنسان والحاسوب</h3><div class="inst">معهد إيستمور للتقنية، بدوام جزئي وعن بُعد</div><ul><li>الأطروحة: «الطباعة المتكيّفة للواجهات العربية: المقروئية والكثافة والثقة»</li><li><b>أفضل أطروحة دكتوراه في التفاعل بين الإنسان والحاسوب، 2022</b></li></ul>', 1),
    ('<span class="yr">Sep 2011 – Sep 2012</span><h3>MSc in Interaction Design, with Distinction</h3><div class="inst">University of Northbridge, United Kingdom</div><ul><li>Dissertation: “Bilingual Navigation Menus on Small Screens”</li><li><b>Full scholarship</b></li></ul>',
     '<span class="yr">سبتمبر 2011 – سبتمبر 2012</span><h3>ماجستير في تصميم التفاعل، بامتياز</h3><div class="inst">جامعة نورثبريدج، المملكة المتحدة</div><ul><li>الرسالة: «قوائم التنقّل ثنائية اللغة على الشاشات الصغيرة»</li><li><b>منحة دراسية كاملة</b></li></ul>', 1),
    ('<span class="yr">Sep 2006 – Jun 2010</span><h3>BSc in Computer Science, First Class Honours</h3><div class="inst">Najd Valley University, Riyadh</div><ul><li><b>GPA 4.81 / 5.00</b></li><li>Exchange semester, Lindenhall University, Germany, 2009</li><li><b>Best Graduation Project, 2010</b></li></ul>',
     '<span class="yr">سبتمبر 2006 – يونيو 2010</span><h3>بكالوريوس علوم الحاسب، مع مرتبة الشرف الأولى</h3><div class="inst">جامعة وادي نجد، الرياض</div><ul><li><b>المعدل التراكمي 4.81 من 5.00</b></li><li>فصل دراسي ضمن برنامج تبادل، جامعة ليندنهال، ألمانيا، 2009</li><li><b>أفضل مشروع تخرّج، 2010</b></li></ul>', 1),
    ('<span class="yr">Jan 2021 – Jun 2021</span><h3>Executive Certificate in Technology Leadership</h3><div class="inst">Eastmoor Business School, online</div><ul><li>Six-month programme completed while working full-time</li></ul>',
     '<span class="yr">يناير 2021 – يونيو 2021</span><h3>شهادة تنفيذية في القيادة التقنية</h3><div class="inst">كلية إيستمور لإدارة الأعمال، عن بُعد</div><ul><li>برنامج من ستة أشهر أتمّته إلى جانب عملها بدوام كامل</li></ul>', 1),
    ('<h3>Public Notices: Certifications</h3><p>19 earned and 1 in progress. Search by name or issuer.</p>', '<h3>إعلانات رسمية: الشهادات المهنية</h3><p>19 شهادة مكتسبة، وواحدة قيد الإنجاز. ابحث بالاسم أو بالجهة المانحة.</p>', 1),
    ('for="cert-q">Search certifications</label>', 'for="cert-q">البحث في الشهادات</label>', 1),
    ('placeholder="Search notices"', 'placeholder="ابحث في الإعلانات"', 1),
    ('aria-label="Filter by status"', 'aria-label="التصفية حسب الحالة"', 1),
    ('No notices match that search. Clear the search or choose another status.', 'لا توجد إعلانات تطابق بحثك. امسح البحث أو اختر حالة أخرى.', 1),
    ('Languages spoken: Arabic (native), English (C2, IELTS 8.5), French (B2, DELF B2), German (A2), Turkish (A1, learning). Pastimes: Arabic calligraphy shown in two group exhibitions, three half marathons, restoring old film cameras, and chess at an online rating of 1,850.',
     'اللغات: العربية (اللغة الأم)، والإنجليزية (C2، آيلتس 8.5)، والفرنسية (B2، DELF B2)، والألمانية (A2)، والتركية (A1، قيد التعلّم). الهوايات: الخط العربي، وقد عُرضت أعمالها في معرضين جماعيين؛ وثلاثة أنصاف ماراثون؛ وترميم كاميرات الأفلام القديمة؛ والشطرنج بتصنيف 1,850 على الإنترنت.', 1),
    # letters
    ('Hiring for a principal or leadership role? Write in. Every letter gets a reply', 'تبحث عن قيادية أو عن كبيرة مهندسين؟ اكتب إلينا، فلكل رسالة ردّ', 1),
    ('Section H · The editorial office is open to roles, design-system and accessibility work, advisory requests and speaking invitations',
     'القسم ح · مكتب التحرير يرحّب بعروض العمل، ومشاريع أنظمة التصميم وإتاحة الوصول، وطلبات الاستشارة، ودعوات التحدث', 1),
    ('<h3>The Editorial Office</h3>\n      <p>Riyadh Bureau. Correspondence welcome in English or Arabic.</p>', '<h3>مكتب التحرير</h3>\n      <p>مكتب الرياض. نرحّب بالمراسلة بالعربية أو بالإنجليزية.</p>', 1),
    ('<dt>Post</dt>', '<dt>البريد</dt>', 1),
    ('data-copy="yara.almansouri@mail.example">Copy</button>', 'data-copy="yara.almansouri@mail.example">نسخ</button>', 1),
    ('<dt>Telephone</dt><dd><a href="tel:+966550000000">', '<dt>الهاتف</dt><dd><a href="tel:+966550000000" dir="ltr">', 1),
    ('<dt>Bureau</dt><dd>Riyadh, Saudi Arabia</dd>', '<dt>المكتب</dt><dd>الرياض، المملكة العربية السعودية</dd>', 1),
    ('<dt>Portfolio</dt>', '<dt>الملف المهني</dt>', 1),
    ('<div class="head"><b>A Letter to the Editor</b><span>To: Y. Al-Mansouri<br>Riyadh Bureau</span></div>', '<div class="head"><b>رسالة إلى المحرر</b><span>إلى: ي. المنصوري<br>مكتب الرياض</span></div>', 1),
    ('<p class="salute">Dear Editor,</p>', '<p class="salute">حضرة المحرر،</p>', 1),
    ('<label for="l-name">Your name</label>', '<label for="l-name">اسمك</label>', 1),
    ('<label for="l-email">Reply address</label><input id="l-email" name="email" type="email"', '<label for="l-email">بريدك للرد</label><input id="l-email" name="email" type="email" dir="ltr"', 1),
    ('<label for="l-org">Publication or company (optional)</label>', '<label for="l-org">الجهة أو الشركة (اختياري)</label>', 1),
    ('<label for="l-topic">Regarding</label>', '<label for="l-topic">الموضوع</label>', 1),
    ('<option value="">Choose a subject</option>', '<option value="">اختر موضوعًا</option>', 1),
    ("<option>A role I'm hiring for</option>", '<option>وظيفة أبحث عمّن يشغلها</option>', 1),
    ('<option>Design system or accessibility work</option>', '<option>مشروع نظام تصميم أو إتاحة وصول</option>', 1),
    ('<option>Advisory or mentoring</option>', '<option>استشارة أو إرشاد</option>', 1),
    ('<option>Speaking invitation</option>', '<option>دعوة للتحدث</option>', 1),
    ('<option>Something else</option>', '<option>موضوع آخر</option>', 1),
    ('<label for="l-msg">Your letter <span', '<label for="l-msg">رسالتك <span', 1),
    ('Your letter opens in your email app, addressed to the editor. Nothing is stored on this page.', 'تُفتح رسالتك في تطبيق البريد لديك، موجّهةً إلى المحرر. ولا يُحفظ شيء في هذه الصفحة.', 1),
    ('type="submit">Seal the letter</button>', 'type="submit">اختم الرسالة</button>', 1),
    ('<h4>Your letter is sealed and ready</h4>', '<h4>رسالتك مختومة وجاهزة</h4>', 1),
    ('<p style="text-align:left;margin:0;font-size:14px">Choose Open in email app to send it, or copy it and post it to yara.almansouri@mail.example yourself.</p>',
     '<p style="text-align:start;margin:0;font-size:14px">اختر «افتح في تطبيق البريد» لإرسالها، أو انسخها وأرسلها بنفسك إلى <span dir="ltr">yara.almansouri@mail.example</span>.</p>', 1),
    ('href="#">Open in email app</a>', 'href="#">افتح في تطبيق البريد</a>', 1),
    ('id="sealed-copy">Copy letter</button>', 'id="sealed-copy">انسخ الرسالة</button>', 1),
    # footer
    ('<b>The Mansouri Gazette</b>\n  <span>Printed in Riyadh · Portfolio Summit 2026 edition · Organisations, credential IDs and .example links come from a fictional competition CV.</span>',
     '<b>جريدة المنصوري</b>\n  <span>طُبعت في الرياض · عدد قمة الملفات المهنية 2026 · أسماء الجهات وأرقام الشهادات وروابط <span dir="ltr">.example</span> مأخوذة من سيرة ذاتية افتراضية خاصة بالمسابقة.</span>', 1),
    ('<button type="button" data-front>Back to the front page</button>', '<button type="button" data-front>العودة إلى الصفحة الأولى</button>', 1),
    ('aria-label="Back to the front page">↑ Front page</button>', 'aria-label="العودة إلى الصفحة الأولى">↑ الصفحة الأولى</button>', 1),
    # scripts
    ('<script src="data-en.js"></script>', '<script src="data-ar.js"></script>', 1),
]

for en, ar, n in PAIRS:
    found = html.count(en)
    if (n and found != n) or (not n and found == 0):
        raise SystemExit(f'Expected {n or "≥1"} of: {en[:90]!r}, found {found}')
    html = html.replace(en, ar)

# section codes in the navigation: A1 → أ1 …
for en, ar in SECTION_CODES:
    html = html.replace(f'<small>{en}</small>', f'<small>{ar}</small>')

(ROOT / 'ar.html').write_text(html)
print('wrote ar.html', len(html))
