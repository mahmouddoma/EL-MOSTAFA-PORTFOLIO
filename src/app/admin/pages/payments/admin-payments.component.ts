import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MockAdminDataService } from '../../core/services/mock-admin-data.service';

@Component({
  selector: 'app-admin-payments',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="table-page">
      <div class="head">
        <div>
          <h2>Payments</h2>
          <p>Mock payments table.</p>
        </div>
      </div>

      <div class="table-card">
        <div class="row header">
          <span>Payment</span>
          <span>Order</span>
          <span>Customer</span>
          <span>Method</span>
          <span>Status</span>
          <span>Amount</span>
        </div>
        <div class="row" *ngFor="let payment of data.payments">
          <span>{{ payment.id }}</span>
          <span>{{ payment.orderId }}</span>
          <span>{{ payment.customer }}</span>
          <span>{{ payment.method }}</span>
          <span>{{ payment.status }}</span>
          <span>{{ payment.amount }}</span>
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
        grid-template-columns: 1fr 1.4fr 1fr 1fr 0.8fr 0.8fr;
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
export class AdminPaymentsComponent {
  readonly data = inject(MockAdminDataService);
}
