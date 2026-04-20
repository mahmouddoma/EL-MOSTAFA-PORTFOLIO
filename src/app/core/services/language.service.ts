import { Injectable, signal, computed } from '@angular/core';

export type Language = 'en' | 'ar';

@Injectable({
  providedIn: 'root',
})
export class LanguageService {
  private readonly LANG_KEY = 'elmostafa_lang';
  readonly currentLang = signal<Language>('en');

  readonly isRtl = computed(() => this.currentLang() === 'ar');

  private translations: Record<Language, any> = {
    en: {
      nav: {
        about: 'About',
        products: 'Products',
        origins: 'Origins',
        contact: 'Contact',
      },
      hero: {
        eyebrow: 'PREMIUM FRUIT IMPORTERS',
        title: 'EL MOSTAFA',
        subtitle:
          "Cairo's leading importer of premium tropical and exotic fruits. Sourced globally, delivered fresh.",
        cta: 'EXPLORE PRODUCTS',
        story: 'OUR STORY',
        journey: 'The Journey',
        scroll: 'Scroll to trace the path of perfection.',
      },
      about: {
        nodes: [
          {
            title: 'The Origin',
            desc: "Sourced from the world's most premium, sun-drenched orchards. We partner directly with dedicated growers to ensure excellence from the root.",
          },
          {
            title: 'The Selection',
            desc: 'Rigorous hand-picking and unrivaled quality control. Every single fruit is meticulously inspected to meet the El Mostafa standard of vibrancy.',
          },
          {
            title: 'The Delivery',
            desc: 'An unbroken cold chain bridging continents directly to Cairo. We guarantee farm-fresh crispness and an unforgettable taste in every bite.',
          },
        ],
      },
      whyUs: {
        eyebrow: 'OUR COMMITMENT',
        title: 'Why El Mostafa',
        subtitle:
          'Excellence in every bite. Quality in every drop. We go beyond simple importation to deliver an unmatched standard of freshness and taste.',
        pillars: [
          {
            title: 'Global Network',
            desc: 'We source directly from premium farms across Italy, Greece, Kenya, and beyond to ensure peak freshness and variety.',
          },
          {
            title: 'Temperature Controlled',
            desc: 'State-of-the-art cold chain logistics guarantee our fruits arrive in Cairo exactly as pristine as nature intended.',
          },
          {
            title: 'Unmatched Quality',
            desc: 'Every single piece is hand-selected and quality-inspected to meet our rigorously high standards before it reaches you.',
          },
        ],
      },
      products: {
        eyebrow: 'EL MOSTAFA COLLECTION',
        title: 'Our Harvest',
        subtitle: 'Explore our highly curated selection of the finest imported fruits globally.',
        allOrigins: '🌍 All Origins',
      },
      origins: {
        eyebrow: 'OUR NETWORK',
        title: 'Global Origins',
        subtitle:
          "We source only from the world's most renowned agricultural regions, ensuring peak freshness and unparalleled taste from root to table.",
      },
      slice: {
        title: 'The Core of<br />Excellence',
        subtitle: "Unveiling nature's finest selections, handpicked for perfection.",
      },
      marquee: ['PREMIUM QUALITY', 'IMPORTED DAILY', '100% FRESH', 'GLOBAL ORIGINS', 'CAIRO BASED'],
      footer: {
        desc: 'Premium quality fruit importers serving Cairo with the finest selection from around the globe since 2010.',
        touch: 'Get in ',
        touchColor: 'Touch',
        addressLabel: 'ADDRESS',
        addressValue: 'Cairo, Egypt',
        emailLabel: 'EMAIL',
        phoneLabel: 'PHONE',
        rights: 'El Mostafa Importers. All rights reserved.',
        privacy: 'Privacy Policy',
        terms: 'Terms of Service',
      },
      common: {
        backToTop: 'Back to Top',
      },
      admin: {
        title: 'Portfolio Control Center',
        subtitle: 'Content-first dashboard aligned with the public brand theme.',
        sidebar: {
          manage: 'Manage the same public sections, visuals, and messages shown on the portfolio.',
          viewPortfolio: 'View Portfolio',
          logout: 'Logout',
        },
        nav: {
          dashboard: 'Dashboard',
          showcase: 'Showcase',
          origins: 'Origins',
          sections: 'Sections',
          siteContent: 'Site Content',
          visualEditor: 'Visual Editor',
          messages: 'Messages',
        },
      },
    },
    ar: {
      nav: {
        about: 'عنـا',
        products: 'منتجاتنا',
        origins: 'المصادر',
        contact: 'تواصل معنا',
      },
      hero: {
        eyebrow: 'مستوردو كبار الفواكه الفاخرة',
        title: 'المصطفى',
        subtitle:
          'المستورد الرائد للفواكه الاستوائية والغريبة الفاخرة في القاهرة. مستوردة عالمياً، ومسلمة طازجة.',
        cta: 'استكشف منتجاتنا',
        story: 'قصتنا',
        journey: 'الرحلة',
        scroll: 'اسحب للأسفل لتتبع مسار المثالية.',
      },
      about: {
        nodes: [
          {
            title: 'الأصـل',
            desc: 'مستورد من أفخم البساتين المشمسة حول العالم. نحن شريك مباشر مع المزارعين لضمان التميز من الجذور.',
          },
          {
            title: 'الاختيار',
            desc: 'عملية قطف صارمة ورقابة لا تضاهى على الجودة. يتم فحص كل فاكهة بدقة لتلبية معايير المصطفى للجمال.',
          },
          {
            title: 'التسـليم',
            desc: 'سلسلة تبريد لم تنقطع تربط القارات مباشرة بالقاهرة. نضمن لك قرمشة المزرعة الطازجة وطعماً لا ينسى.',
          },
        ],
      },
      whyUs: {
        eyebrow: 'التزامنا',
        title: 'لماذا المصطفى؟',
        subtitle:
          'التميز في كل قمة، الجودة في كل قطرة. نحن نتجاوز مجرد الاستيراد لتقديم مستوى لا يضاهى من الطزاجة والطعم.',
        pillars: [
          {
            title: 'شبكة عالمية',
            desc: 'نستورد مباشرة من المزارع الفاخرة في إيطاليا واليونان وكينيا وغيرها لضمان أعلى مستويات الطزاجة والتنوع.',
          },
          {
            title: 'التحكم في الحرارة',
            desc: 'تضمن الخدمات اللوجستية المتطورة لسلسلة التبريد وصول فواكهنا إلى القاهرة تماماً كما أرادتها الطبيعة.',
          },
          {
            title: 'جودة لا تضاهى',
            desc: 'يتم اختيار كل قطعة يدوياً وفحص جودتها لتلبية معاييرنا الصارمة قبل أن تصل إليك.',
          },
        ],
      },
      products: {
        eyebrow: 'مجموعة المصطفى',
        title: 'حصادنا',
        subtitle: 'استكشف تشكيلتنا المختارة بعناية من أجود الفواكه المستوردة عالمياً.',
        allOrigins: '🌍 جميع المصادر',
      },
      origins: {
        eyebrow: 'شبكتنا',
        title: 'مصادرنا العالمية',
        subtitle:
          'نستورد فقط من أشهر المناطق الزراعية في العالم، لضمان أعلى مستويات الطزاجة والمذاق الفريد.',
      },
      slice: {
        title: 'لب<br />التميز',
        subtitle: 'نكتشف أرقى مختارات الطبيعة، منتقاة بعناية للوصول إلى المثالية.',
      },
      marquee: ['جودة ممتازة', 'مستورد يومياً', 'طازج 100%', 'مصادر عالمية', 'مقرنا القاهرة'],
      footer: {
        desc: 'مستوردو فواكه بجودة عالية نخدم القاهرة بأفضل الاختيارات من جميع أنحاء العالم منذ عام 2010.',
        touch: 'تواصل ',
        touchColor: 'معنا',
        addressLabel: 'العنوان',
        addressValue: 'القاهرة، مصر',
        emailLabel: 'البريد الإلكتروني',
        phoneLabel: 'الهاتف',
        rights: 'المصطفى للمستوردين. جميع الحقوق محفوظة.',
        privacy: 'سياسة الخصوصية',
        terms: 'شروط الخدمة',
      },
      common: {
        backToTop: 'العودة للأعلى',
      },
      admin: {
        title: 'مركز التحكم في المحافظ',
        subtitle: 'لوحة تحكم تركز على المحتوى ومتوافقة مع سمة العلامة التجارية العامة.',
        sidebar: {
          manage: 'قم بإدارة نفس الأقسام العامة والمرئيات والرسائل المعروضة في المحفظة.',
          viewPortfolio: 'رؤية المحفظة',
          logout: 'تسجيل الخروج',
        },
        nav: {
          dashboard: 'لوحة التحكم',
          showcase: 'معرض الأعمال',
          origins: 'المصادر',
          sections: 'الأقسام',
          siteContent: 'محتوى الموقع',
          visualEditor: 'المحرر المرئي',
          messages: 'الرسائل',
        },
      },
    },
  };

  constructor() {
    this.initLang();
  }

  private initLang() {
    const savedLang = localStorage.getItem(this.LANG_KEY) as Language;
    if (savedLang) {
      this.setLanguage(savedLang);
    }
  }

  setLanguage(lang: Language) {
    this.currentLang.set(lang);
    localStorage.setItem(this.LANG_KEY, lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  }

  toggleLanguage() {
    const newLang = this.currentLang() === 'en' ? 'ar' : 'en';
    this.setLanguage(newLang);
  }

  translateFor(lang: Language, path: string): string {
    const keys = path.split('.');
    let value = this.translations[lang];

    for (const key of keys) {
      if (value) value = value[key];
    }

    return value || path;
  }

  translate(path: string): string {
    return this.translateFor(this.currentLang(), path);
  }
}
