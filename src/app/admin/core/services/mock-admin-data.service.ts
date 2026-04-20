import { Injectable } from '@angular/core';

export interface AdminProductCard {
  id: string;
  name: string;
  category: string;
  origin: string;
  imageUrl: string;
  status: 'Live' | 'Draft';
  updatedAt: string;
  note: string;
}

export interface AdminOriginRow {
  id: string;
  flag: string;
  country: string;
  focus: string;
  featuredItems: number;
  status: 'Active' | 'Seasonal';
}

export interface AdminSectionRow {
  id: string;
  title: string;
  anchor: string;
  type: 'Content' | 'Visual' | 'Hybrid';
  editableFields: number;
  status: 'Live' | 'Review';
  description: string;
  editRoute: string;
}

export interface AdminMessageRow {
  id: string;
  name: string;
  email: string;
  subject: string;
  status: 'New' | 'Read';
  date: string;
  summary: string;
}

@Injectable({
  providedIn: 'root',
})
export class MockAdminDataService {
  readonly products: AdminProductCard[] = [
    {
      id: '1',
      name: 'Premium Apples',
      category: 'Stone',
      origin: 'Italy',
      imageUrl: 'assets/real-apple.png',
      status: 'Live',
      updatedAt: '2026-04-20',
      note: 'Featured in the public showcase grid.',
    },
    {
      id: '2',
      name: 'Fresh Kiwi',
      category: 'Exotic',
      origin: 'Greece',
      imageUrl: 'assets/real-kiwi.png',
      status: 'Live',
      updatedAt: '2026-04-19',
      note: 'Visible in the live portfolio collection.',
    },
    {
      id: '3',
      name: 'Gold Pineapples',
      category: 'Tropical',
      origin: 'Costa Rica',
      imageUrl: 'assets/real-pineapple.png',
      status: 'Draft',
      updatedAt: '2026-04-17',
      note: 'Prepared as a future highlight card.',
    },
  ];

  readonly origins: AdminOriginRow[] = [
    {
      id: 'IT',
      flag: 'IT',
      country: 'Italy',
      focus: 'Apples, plums, peaches, and cherries',
      featuredItems: 5,
      status: 'Active',
    },
    {
      id: 'GR',
      flag: 'GR',
      country: 'Greece',
      focus: 'Kiwi and premium seasonal cherries',
      featuredItems: 3,
      status: 'Active',
    },
    {
      id: 'KE',
      flag: 'KE',
      country: 'Kenya',
      focus: 'Hass avocado and specialty imports',
      featuredItems: 1,
      status: 'Seasonal',
    },
  ];

  readonly sections: AdminSectionRow[] = [
    {
      id: 'hero',
      title: 'Hero Landing',
      anchor: '#home',
      type: 'Hybrid',
      editableFields: 4,
      status: 'Live',
      description: 'Main headline, subtitle, CTA, and floating visual assets.',
      editRoute: '/admin/site-content',
    },
    {
      id: 'about',
      title: 'Story Timeline',
      anchor: '#about',
      type: 'Visual',
      editableFields: 6,
      status: 'Live',
      description: 'Narrative journey section with timeline nodes and animated imagery.',
      editRoute: '/admin/visual-editor',
    },
    {
      id: 'products',
      title: 'Showcase Grid',
      anchor: '#products',
      type: 'Hybrid',
      editableFields: 3,
      status: 'Live',
      description: 'Featured collection cards displayed in the portfolio grid.',
      editRoute: '/admin/showcase',
    },
    {
      id: 'origins',
      title: 'Origins Network',
      anchor: '#origins',
      type: 'Hybrid',
      editableFields: 3,
      status: 'Live',
      description: 'Country coverage cards and sourcing network presentation.',
      editRoute: '/admin/origins',
    },
    {
      id: 'why-us',
      title: 'Trust Pillars',
      anchor: '#why-us',
      type: 'Content',
      editableFields: 5,
      status: 'Review',
      description: 'Reason-to-trust section with three portfolio promise pillars.',
      editRoute: '/admin/site-content',
    },
    {
      id: 'footer',
      title: 'Footer Contact',
      anchor: '#contact',
      type: 'Content',
      editableFields: 5,
      status: 'Live',
      description: 'Brand line, address, email, and phone details in the footer.',
      editRoute: '/admin/site-content',
    },
  ];

  readonly messages: AdminMessageRow[] = [
    {
      id: 'MSG-001',
      name: 'Karim Saleh',
      email: 'karim@example.com',
      subject: 'Portfolio collaboration request',
      status: 'New',
      date: '2026-04-20',
      summary: 'Asked about a branded landing page and visual direction for a new campaign.',
    },
    {
      id: 'MSG-002',
      name: 'Nour Hassan',
      email: 'nour@example.com',
      subject: 'Brand presentation feedback',
      status: 'Read',
      date: '2026-04-18',
      summary: 'Shared notes about the storytelling flow and product presentation section.',
    },
  ];
}
