export type Lang = "en" | "ar";

const STORAGE_KEY = "dc1_lang";

export function detectLanguage(): Lang {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === "en" || saved === "ar") return saved;
  } catch {}
  try {
    const nav = navigator.language || (navigator as any).userLanguage || "";
    if (nav.startsWith("ar")) return "ar";
  } catch {}
  return "en";
}

export function persistLanguage(lang: Lang) {
  try { localStorage.setItem(STORAGE_KEY, lang); } catch {}
}

// ——— Translation dictionary ———
const translations: Record<string, Record<Lang, string>> = {
  // Nav
  "nav.how_it_works": { en: "How It Works", ar: "كيف يعمل" },
  "nav.advantages": { en: "Advantages", ar: "المزايا" },
  "nav.early_access": { en: "Early Access", ar: "الوصول المبكر" },
  "nav.get_early_access": { en: "Get Early Access", ar: "احصل على الوصول المبكر" },

  // Hero
  "hero.title": { en: "Power, Digitalized", ar: "رقمنة الطاقة" },
  "hero.subtitle": {
    en: "The decentralized compute marketplace built on Saudi Arabia's most competitive energy.",
    ar: "سوق الحوسبة اللامركزية المبنية على الطاقة الأكثر تنافسية في المملكة العربية السعودية.",
  },
  "hero.i_have_hardware": { en: "I Have Hardware", ar: "أملك أجهزة" },
  "hero.i_need_compute": { en: "I Need Compute", ar: "أحتاج حوسبة" },
  "hero.detected_gpu": { en: "We detected your", ar: "تم اكتشاف" },
  "hero.could_earn": { en: "— you could earn", ar: "— يمكنك ربح" },
  "hero.see_earnings": { en: "See Your Earnings", ar: "شاهد أرباحك" },
  "hero.not_your_gpu": { en: "Not your GPU? Select manually →", ar: "ليس جهازك؟ اختر يدوياً ←" },
  "hero.select_gpu": { en: "Select your GPU to see earnings", ar: "اختر معالجك الرسومي لمعرفة الأرباح" },
  "hero.detection_tip": { en: "For accurate detection, use Chrome or Edge with hardware acceleration enabled", ar: "للكشف الدقيق، استخدم Chrome أو Edge مع تفعيل تسريع الأجهزة" },

  // Stats
  "stats.providers": { en: "Providers", ar: "مزودون" },
  "stats.gpus": { en: "GPUs", ar: "معالجات رسومية" },
  "stats.avg_cost": { en: "Avg Cost", ar: "متوسط التكلفة" },
  "stats.uptime": { en: "Uptime", ar: "وقت التشغيل" },

  // Problem / Solution
  "problem.title": { en: "The Problem", ar: "المشكلة" },
  "solution.title": { en: "The DC1 Solution", ar: "حل DC1" },
  "problem.1": {
    en: "Cloud compute is expensive, centralized, and barely exists in the MENA region.",
    ar: "الحوسبة السحابية مكلفة ومركزية وشبه معدومة في منطقة الشرق الأوسط وشمال أفريقيا.",
  },
  "problem.2": {
    en: "GPU demand is exploding. Supply is locked behind hyperscalers charging 3-5x markup.",
    ar: "الطلب على المعالجات الرسومية يتزايد بسرعة. العرض محتكر من شركات كبرى بأسعار مضاعفة 3-5 مرات.",
  },
  "problem.3": {
    en: "Saudi regulations require data sovereignty — but local compute options are almost nonexistent.",
    ar: "الأنظمة السعودية تتطلب سيادة البيانات — لكن خيارات الحوسبة المحلية شبه معدومة.",
  },
  "solution.1": {
    en: "We connect hardware owners directly to developers who need compute. No middleman markup.",
    ar: "نربط أصحاب الأجهزة مباشرة بالمطورين الذين يحتاجون حوسبة. بدون وسيط.",
  },
  "solution.2": {
    en: "Powered by Saudi Arabia's competitive energy rates — up to 60% lower than global average.",
    ar: "مدعوم بأسعار الطاقة التنافسية في السعودية — أقل بنسبة تصل إلى 60% من المتوسط العالمي.",
  },
  "solution.3": {
    en: "SDAIA-compliant from day one. Your data stays in the Kingdom. Always.",
    ar: "متوافق مع سدايا من اليوم الأول. بياناتك تبقى في المملكة. دائماً.",
  },

  // How It Works
  "how.title": { en: "How It Works", ar: "كيف يعمل" },
  "how.providers": { en: "For Providers", ar: "للمزودين" },
  "how.platform": { en: "The Platform", ar: "المنصة" },
  "how.renters": { en: "For Renters", ar: "للمستأجرين" },
  "how.p1": { en: "Connect your hardware — GPU, CPU, or storage", ar: "وصّل أجهزتك — معالج رسومي أو مركزي أو تخزين" },
  "how.p2": { en: "Set your availability and preferences", ar: "حدد التوفر والتفضيلات" },
  "how.p3": { en: "Earn competitive returns. We handle billing, security, and compliance.", ar: "اربح عوائد تنافسية. نتولى الفوترة والأمان والامتثال." },
  "how.pl1": { en: "DC1 matches supply with demand automatically", ar: "DC1 يطابق العرض والطلب تلقائياً" },
  "how.pl2": { en: "Market maker pricing — fair rates guaranteed both sides", ar: "تسعير صانع السوق — أسعار عادلة مضمونة للطرفين" },
  "how.pl3": { en: "3-layer security: Guardian, Watcher, and Auditor protect every transaction", ar: "أمان ثلاثي الطبقات: الحارس والمراقب والمدقق يحمون كل معاملة" },
  "how.r1": { en: "Browse available compute by type, location, and price", ar: "تصفح الحوسبة المتاحة حسب النوع والموقع والسعر" },
  "how.r2": { en: "Deploy workloads in minutes with simple API or dashboard", ar: "انشر أحمال العمل في دقائق عبر API أو لوحة التحكم" },
  "how.r3": { en: "Pay only for what you use — no commitments, no lock-in", ar: "ادفع فقط ما تستخدمه — بدون التزامات أو قيود" },

  // Advantages
  "adv.title": { en: "The DC1 Advantage", ar: "ميزة DC1" },
  "adv.energy": { en: "Competitive Energy", ar: "طاقة تنافسية" },
  "adv.energy_desc": { en: "Saudi energy rates from $0.048/kWh. Your compute costs drop before we even optimize.", ar: "أسعار الطاقة السعودية من $0.048/kWh. تكاليف حوسبتك تنخفض قبل أي تحسين." },
  "adv.sovereignty": { en: "Data Sovereignty", ar: "سيادة البيانات" },
  "adv.sovereignty_desc": { en: "SDAIA & NDMO compliant. Government-grade data residency. Your data never leaves the Kingdom.", ar: "متوافق مع سدايا و NDMO. إقامة بيانات حكومية. بياناتك لا تغادر المملكة أبداً." },
  "adv.agnostic": { en: "Hardware Agnostic", ar: "أجهزة متعددة" },
  "adv.agnostic_desc": { en: "GPUs, CPUs, storage — any hardware, any vendor. Not locked to one chip maker.", ar: "معالجات رسومية، مركزية، تخزين — أي جهاز من أي مصنع. بدون قيود." },
  "adv.security": { en: "Security by Design", ar: "أمان بالتصميم" },
  "adv.security_desc": { en: "3-agent security model. Zero direct connections. Firecracker micro-VM isolation. End-to-end encrypted.", ar: "نموذج أمان ثلاثي الوكلاء. بدون اتصالات مباشرة. عزل Firecracker micro-VM. تشفير شامل." },
  "adv.pricing": { en: "Market Maker Pricing", ar: "تسعير صانع السوق" },
  "adv.pricing_desc": { en: "We set fair prices both sides. Providers get guaranteed rates. Renters get transparent pricing.", ar: "نحدد أسعاراً عادلة للطرفين. المزودون يحصلون على أسعار مضمونة. المستأجرون يحصلون على تسعير شفاف." },
  "adv.global": { en: "Saudi-First, Global Reach", ar: "سعودي أولاً، عالمي الوصول" },
  "adv.global_desc": { en: "Built in the Kingdom for the world. Regulatory moat meets global demand.", ar: "بُني في المملكة للعالم. حصن تنظيمي يلبي الطلب العالمي." },

  // Earnings Calculator
  "calc.your_earnings": { en: "Your Estimated Earnings", ar: "أرباحك المقدرة" },
  "calc.utilization": { en: "Utilization", ar: "الاستخدام" },
  "calc.monthly_earnings": { en: "estimated monthly earnings", ar: "الأرباح الشهرية المقدرة" },
  "calc.market_rate": { en: "Market Rate/hr", ar: "سعر السوق/ساعة" },
  "calc.your_cut": { en: "Your Cut (85%)", ar: "حصتك (85%)" },
  "calc.power_cost": { en: "Power Cost/hr", ar: "تكلفة الطاقة/ساعة" },
  "calc.dc1_vs": { en: "DC1 vs Hosting Elsewhere", ar: "DC1 مقابل الاستضافة الأخرى" },
  "calc.start_earning": { en: "Start Earning — Join Below", ar: "ابدأ الربح — انضم أدناه" },
  "calc.dc1_earns_more": { en: "DC1 earns you", ar: "DC1 يكسبك" },
  "calc.more_than_us": { en: "more than US-based hosting", ar: "أكثر من الاستضافة في أمريكا" },

  // Early Access / Waitlist
  "waitlist.title": { en: "Join the Waitlist", ar: "انضم لقائمة الانتظار" },
  "waitlist.subtitle": { en: "Be among the first to access decentralized compute in Saudi Arabia.", ar: "كن من أوائل من يصلون إلى الحوسبة اللامركزية في المملكة العربية السعودية." },
  "waitlist.i_have_hardware": { en: "I Have Hardware", ar: "أملك أجهزة" },
  "waitlist.i_need_compute": { en: "I Need Compute", ar: "أحتاج حوسبة" },
  "waitlist.full_name": { en: "Full Name", ar: "الاسم الكامل" },
  "waitlist.email": { en: "Email", ar: "البريد الإلكتروني" },
  "waitlist.phone": { en: "Phone", ar: "الهاتف" },
  "waitlist.company": { en: "Company / Organization", ar: "الشركة / المنظمة" },
  "waitlist.city": { en: "City", ar: "المدينة" },
  "waitlist.hardware_type": { en: "Hardware Type", ar: "نوع الجهاز" },
  "waitlist.gpu_models": { en: "GPU Models", ar: "موديلات المعالج الرسومي" },
  "waitlist.num_units": { en: "Number of Units", ar: "عدد الوحدات" },
  "waitlist.power_cost": { en: "Monthly Power Cost (﷼)", ar: "تكلفة الطاقة الشهرية (﷼)" },
  "waitlist.use_case": { en: "Use Case", ar: "حالة الاستخدام" },
  "waitlist.gpu_preference": { en: "GPU Preference", ar: "تفضيل المعالج الرسومي" },
  "waitlist.budget": { en: "Estimated Monthly Budget", ar: "الميزانية الشهرية المقدرة" },
  "waitlist.hear_about": { en: "How did you hear about us?", ar: "كيف سمعت عنا؟" },
  "waitlist.message": { en: "Message / Notes", ar: "رسالة / ملاحظات" },
  "waitlist.submit": { en: "Request Early Access", ar: "طلب الوصول المبكر" },
  "waitlist.submitting": { en: "Submitting...", ar: "جاري الإرسال..." },
  "waitlist.reach_out": { en: "We'll reach out within 48 hours.", ar: "سنتواصل معك خلال 48 ساعة." },
  "waitlist.already_registered": { en: "Already registered", ar: "مسجل بالفعل" },
  "waitlist.already_registered_desc": { en: "This email is already on our waitlist. We'll be in touch soon!", ar: "هذا البريد مسجل بالفعل في قائمة الانتظار. سنتواصل معك قريباً!" },
  "waitlist.on_the_list": { en: "You're on the list!", ar: "أنت في القائمة!" },
  "waitlist.be_in_touch": { en: "We'll be in touch within 48 hours.", ar: "سنتواصل معك خلال 48 ساعة." },

  // Trust bar
  "trust.sdaia": { en: "Built for SDAIA Compliance", ar: "مبني للتوافق مع سدايا" },
  "trust.registered": { en: "Registered in Saudi Arabia", ar: "مسجل في المملكة العربية السعودية" },
  "trust.startup": { en: "Startup Weekend Riyadh 2026", ar: "ستارت أب ويكند الرياض 2026" },

  // Footer
  "footer.tagline": { en: "Power, Digitalized", ar: "رقمنة الطاقة" },
  "footer.contact": { en: "Contact", ar: "تواصل معنا" },
  "footer.privacy": { en: "Privacy Policy", ar: "سياسة الخصوصية" },
  "footer.legal": { en: "DC Power Solutions Company | CR 7053667775", ar: "شركة DC لحلول الطاقة | سجل تجاري 7053667775" },
  "footer.copyright": { en: "© 2026 DC1 — Saudi Arabia's Compute Marketplace", ar: "© 2026 DC1 — سوق الحوسبة في المملكة العربية السعودية" },
  "footer.cookie_settings": { en: "Cookie Settings", ar: "إعدادات ملفات تعريف الارتباط" },

  // Legal section
  "legal.title": { en: "Legal Disclaimers", ar: "إخلاء المسؤولية القانونية" },

  // Cookie consent
  "cookie.text": {
    en: "We use essential cookies and anonymous analytics to improve your experience. No advertising cookies are used.",
    ar: "نستخدم ملفات تعريف الارتباط الأساسية والتحليلات المجهولة لتحسين تجربتك. لا نستخدم ملفات تعريف ارتباط إعلانية.",
  },
  "cookie.accept": { en: "Accept", ar: "قبول" },
  "cookie.decline": { en: "Decline", ar: "رفض" },

  // Earn page
  "earn.title": { en: "DC1", ar: "DC1" },
  "earn.subtitle": { en: "Turn your idle GPU into income — powered by Saudi Arabia's competitive energy", ar: "حوّل معالجك الرسومي الخامل إلى دخل — مدعوم بطاقة السعودية التنافسية" },
  "earn.your_hardware": { en: "Your Hardware", ar: "أجهزتك" },
  "earn.detecting": { en: "Detecting your GPU...", ar: "جاري اكتشاف المعالج الرسومي..." },
  "earn.auto_matched": { en: "Auto-matched from detection", ar: "تم المطابقة تلقائياً" },
  "earn.show_raw": { en: "Show raw details", ar: "عرض التفاصيل الخام" },
  "earn.hide_raw": { en: "Hide raw details", ar: "إخفاء التفاصيل الخام" },
  "earn.estimated_earnings": { en: "Estimated earnings:", ar: "الأرباح المقدرة:" },
  "earn.not_your_gpu": { en: "Not your GPU? Select manually →", ar: "ليس جهازك؟ اختر يدوياً ←" },
  "earn.select_gpu": { en: "Select your GPU to see your earnings estimate", ar: "اختر معالجك الرسومي لمعرفة تقدير الأرباح" },
  "earn.detection_tip": { en: "For accurate detection, use Chrome or Edge with hardware acceleration enabled", ar: "للكشف الدقيق، استخدم Chrome أو Edge مع تفعيل تسريع الأجهزة" },
  "earn.like_what_you_see": { en: "Like what you see?", ar: "أعجبك ما ترى؟" },
  "earn.join_waitlist": { en: "Start Earning — Join the Waitlist", ar: "ابدأ الربح — انضم لقائمة الانتظار" },
  "earn.name": { en: "Name", ar: "الاسم" },
  "earn.email": { en: "Email", ar: "البريد الإلكتروني" },
  "earn.location": { en: "Location", ar: "الموقع" },
  "earn.detected_gpu": { en: "Detected GPU", ar: "المعالج المكتشف" },
  "earn.gpu_count": { en: "How many GPUs do you have?", ar: "كم عدد المعالجات لديك؟" },
  "earn.join_provider": { en: "Join Provider Waitlist →", ar: "انضم لقائمة المزودين ←" },
  "earn.free_to_join": { en: "Free to join. No commitment. We'll notify you when DC1 launches.", ar: "انضمام مجاني. بدون التزام. سنبلغك عند إطلاق DC1." },
  "earn.on_the_list": { en: "You're on the list!", ar: "أنت في القائمة!" },
  "earn.will_email": { en: "We'll email you when DC1 launches in your region.", ar: "سنراسلك عند إطلاق DC1 في منطقتك." },
  "earn.market_data": { en: "Market data from vast.ai — updated live", ar: "بيانات السوق من vast.ai — محدثة مباشرة" },

  // Placeholders
  "placeholder.your_name": { en: "Your name", ar: "اسمك" },
  "placeholder.email": { en: "you@email.com", ar: "you@email.com" },
  "placeholder.full_name": { en: "Your full name", ar: "اسمك الكامل" },
  "placeholder.company_email": { en: "you@company.com", ar: "you@company.com" },
  "placeholder.phone": { en: "+966", ar: "+966" },
  "placeholder.company": { en: "Your company", ar: "شركتك" },
  "placeholder.city": { en: "e.g. Riyadh, Jeddah", ar: "مثال: الرياض، جدة" },
  "placeholder.gpu_models": { en: "e.g. RTX 4090, A100", ar: "مثال: RTX 4090, A100" },
  "placeholder.units": { en: "e.g. 10", ar: "مثال: 10" },
  "placeholder.power_cost": { en: "e.g. 5000", ar: "مثال: 5000" },
  "placeholder.gpu_preference": { en: "e.g. A100, H100, RTX 4090", ar: "مثال: A100, H100, RTX 4090" },
  "placeholder.message": { en: "Anything else you'd like us to know?", ar: "هل هناك شيء آخر تريد إخبارنا به؟" },

  // Select options
  "select.use_case": { en: "Select use case", ar: "اختر حالة الاستخدام" },
  "select.budget": { en: "Select budget range", ar: "اختر نطاق الميزانية" },
  "select.hear_about": { en: "Select one", ar: "اختر" },
};

export function t(key: string, lang: Lang): string {
  return translations[key]?.[lang] || translations[key]?.en || key;
}
