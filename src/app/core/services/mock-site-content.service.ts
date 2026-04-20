import { Injectable, signal } from '@angular/core';

export type EditableLocale = 'en' | 'ar';

interface LocalizedText {
  en: string;
  ar: string;
}

export interface MockSiteContent {
  navbar: {
    about: LocalizedText;
    products: LocalizedText;
    origins: LocalizedText;
    contact: LocalizedText;
  };
  hero: {
    eyebrow: LocalizedText;
    title: LocalizedText;
    subtitle: LocalizedText;
    cta: LocalizedText;
  };
  footer: {
    brandText: string;
    description: LocalizedText;
    address: LocalizedText;
    email: string;
    phone: string;
  };
}

const DEFAULT_CONTENT: MockSiteContent = {
  navbar: {
    about: { en: 'About', ar: 'عنا' },
    products: { en: 'Products', ar: 'منتجاتنا' },
    origins: { en: 'Origins', ar: 'المصادر' },
    contact: { en: 'Contact', ar: 'تواصل معنا' },
  },
  hero: {
    eyebrow: { en: 'PREMIUM FRUIT IMPORTERS', ar: 'مستوردو كبار الفواكه الفاخرة' },
    title: { en: 'EL MOSTAFA', ar: 'المصطفى' },
    subtitle: {
      en: "Cairo's leading importer of premium tropical and exotic fruits. Sourced globally, delivered fresh.",
      ar: 'المستورد الرائد للفواكه الاستوائية والغريبة الفاخرة في القاهرة. مستوردة عالمياً، ومسلمة طازجة.',
    },
    cta: { en: 'EXPLORE PRODUCTS', ar: 'استكشف منتجاتنا' },
  },
  footer: {
    brandText: 'EL MOSTAFA',
    description: {
      en: 'Premium quality fruit importers serving Cairo with the finest selection from around the globe since 2010.',
      ar: 'مستوردو فواكه بجودة عالية نخدم القاهرة بأفضل الاختيارات من جميع أنحاء العالم منذ عام 2010.',
    },
    address: {
      en: 'Cairo, Egypt',
      ar: 'القاهرة، مصر',
    },
    email: 'contact@elmostafafruits.com',
    phone: '+20 100 000 0000',
  },
};

@Injectable({
  providedIn: 'root',
})
export class MockSiteContentService {
  private readonly STORAGE_KEY = 'elmostafa_mock_site_content_v1';
  readonly content = signal<MockSiteContent>(this.loadContent());

  constructor() {
    window.addEventListener('storage', (event) => {
      if (event.key === this.STORAGE_KEY) {
        this.content.set(this.loadContent());
      }
    });
  }

  getNavbarLabel(key: keyof MockSiteContent['navbar'], locale: EditableLocale): string {
    return this.content().navbar[key][locale];
  }

  getHeroValue(key: keyof MockSiteContent['hero'], locale: EditableLocale): string {
    return this.content().hero[key][locale];
  }

  getFooterValue(
    key: keyof MockSiteContent['footer'],
    locale: EditableLocale,
  ): string {
    const value = this.content().footer[key];

    if (typeof value === 'string') {
      return value;
    }

    return value[locale];
  }

  getValue(nodeId: string, locale: EditableLocale): string {
    const [section, field] = nodeId.split('.');
    const state = this.content();

    if (section === 'navbar' && field in state.navbar) {
      return state.navbar[field as keyof MockSiteContent['navbar']][locale];
    }

    if (section === 'hero' && field in state.hero) {
      return state.hero[field as keyof MockSiteContent['hero']][locale];
    }

    if (section === 'footer' && field in state.footer) {
      const footerValue = state.footer[field as keyof MockSiteContent['footer']];
      return typeof footerValue === 'string' ? footerValue : footerValue[locale];
    }

    return '';
  }

  setValue(nodeId: string, locale: EditableLocale, value: string): void {
    const [section, field] = nodeId.split('.');
    const state = this.content();

    if (section === 'navbar' && field in state.navbar) {
      this.content.update((current) => ({
        ...current,
        navbar: {
          ...current.navbar,
          [field]: {
            ...current.navbar[field as keyof MockSiteContent['navbar']],
            [locale]: value,
          },
        },
      }));
      this.persist();
      return;
    }

    if (section === 'hero' && field in state.hero) {
      this.content.update((current) => ({
        ...current,
        hero: {
          ...current.hero,
          [field]: {
            ...current.hero[field as keyof MockSiteContent['hero']],
            [locale]: value,
          },
        },
      }));
      this.persist();
      return;
    }

    if (section === 'footer' && field in state.footer) {
      const footerValue = state.footer[field as keyof MockSiteContent['footer']];

      if (typeof footerValue === 'string') {
        this.content.update((current) => ({
          ...current,
          footer: {
            ...current.footer,
            [field]: value,
          },
        }));
      } else {
        this.content.update((current) => ({
          ...current,
          footer: {
            ...current.footer,
            [field]: {
              ...current.footer[field as keyof MockSiteContent['footer']] as LocalizedText,
              [locale]: value,
            },
          },
        }));
      }

      this.persist();
    }
  }

  private loadContent(): MockSiteContent {
    const raw = localStorage.getItem(this.STORAGE_KEY);

    if (!raw) {
      return structuredClone(DEFAULT_CONTENT);
    }

    try {
      return {
        ...structuredClone(DEFAULT_CONTENT),
        ...JSON.parse(raw),
      };
    } catch {
      return structuredClone(DEFAULT_CONTENT);
    }
  }

  private persist(): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.content()));
  }
}
