import { Injectable } from '@angular/core';

export interface AdminProductCard {
  id: string;
  name: string;
  category: string;
  origin: string;
  imageUrl: string;
  status: 'Published' | 'Draft';
}

export interface AdminOrderRow {
  id: string;
  customer: string;
  email: string;
  total: string;
  status: 'Pending' | 'Confirmed' | 'Completed';
  date: string;
}

export interface AdminPaymentRow {
  id: string;
  orderId: string;
  customer: string;
  amount: string;
  status: 'Pending' | 'Paid';
  method: string;
  date: string;
}

export interface AdminMessageRow {
  id: string;
  name: string;
  email: string;
  subject: string;
  status: 'New' | 'Read';
  date: string;
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
      status: 'Published',
    },
    {
      id: '2',
      name: 'Fresh Kiwi',
      category: 'Exotic',
      origin: 'Greece',
      imageUrl: 'assets/real-kiwi.png',
      status: 'Published',
    },
    {
      id: '3',
      name: 'Gold Pineapples',
      category: 'Tropical',
      origin: 'Costa Rica',
      imageUrl: 'assets/real-pineapple.png',
      status: 'Draft',
    },
  ];

  readonly orders: AdminOrderRow[] = [
    {
      id: 'ORD-20260420-001',
      customer: 'Ahmed Samir',
      email: 'ahmed@example.com',
      total: 'EGP 510.00',
      status: 'Pending',
      date: '2026-04-20',
    },
    {
      id: 'ORD-20260419-002',
      customer: 'Mona Adel',
      email: 'mona@example.com',
      total: 'EGP 920.00',
      status: 'Confirmed',
      date: '2026-04-19',
    },
    {
      id: 'ORD-20260418-003',
      customer: 'Omar Nabil',
      email: 'omar@example.com',
      total: 'EGP 315.00',
      status: 'Completed',
      date: '2026-04-18',
    },
  ];

  readonly payments: AdminPaymentRow[] = [
    {
      id: 'PAY-001',
      orderId: 'ORD-20260420-001',
      customer: 'Ahmed Samir',
      amount: 'EGP 510.00',
      status: 'Pending',
      method: 'Cash on Delivery',
      date: '2026-04-20',
    },
    {
      id: 'PAY-002',
      orderId: 'ORD-20260419-002',
      customer: 'Mona Adel',
      amount: 'EGP 920.00',
      status: 'Paid',
      method: 'Paymob',
      date: '2026-04-19',
    },
  ];

  readonly messages: AdminMessageRow[] = [
    {
      id: 'MSG-001',
      name: 'Karim Saleh',
      email: 'karim@example.com',
      subject: 'Wholesale inquiry',
      status: 'New',
      date: '2026-04-20',
    },
    {
      id: 'MSG-002',
      name: 'Nour Hassan',
      email: 'nour@example.com',
      subject: 'Partnership request',
      status: 'Read',
      date: '2026-04-18',
    },
  ];
}
