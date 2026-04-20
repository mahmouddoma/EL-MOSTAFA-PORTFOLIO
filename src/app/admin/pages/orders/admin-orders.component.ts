import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MockAdminDataService } from '../../core/services/mock-admin-data.service';

@Component({
  selector: 'app-admin-orders',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="table-page">
      <div class="head">
        <div>
          <h2>Orders</h2>
          <p>Fake order data for dashboard UI review.</p>
        </div>
      </div>

      <div class="table-card">
        <div class="row header">
          <span>Order</span>
          <span>Customer</span>
          <span>Status</span>
          <span>Total</span>
          <span>Date</span>
        </div>
        <div class="row" *ngFor="let order of data.orders">
          <span>{{ order.id }}</span>
          <span>{{ order.customer }}</span>
          <span>{{ order.status }}</span>
          <span>{{ order.total }}</span>
          <span>{{ order.date }}</span>
        </div>
      </div>
    </section>
  `,
  styles: [
    `
      .table-page {
        display: grid;
        gap: 18px;
      }

      .table-card {
        border-radius: 22px;
        border: 1px solid rgba(255, 255, 255, 0.08);
        background: rgba(18, 18, 18, 0.86);
        padding: 0 20px;
      }

      .row {
        display: grid;
        grid-template-columns: 1.6fr 1fr 0.8fr 0.8fr 0.8fr;
        gap: 12px;
        padding: 16px 0;
        border-bottom: 1px solid rgba(255, 255, 255, 0.06);
      }

      .header {
        color: rgba(255, 255, 255, 0.5);
      }
    `,
  ],
})
export class AdminOrdersComponent {
  readonly data = inject(MockAdminDataService);
}
