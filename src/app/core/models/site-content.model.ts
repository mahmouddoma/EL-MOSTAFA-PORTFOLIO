import { LocalizedText } from './localized-text.model';

export interface SiteContent {
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

