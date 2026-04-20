import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MockAdminDataService } from '../../core/services/mock-admin-data.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="page-grid">
      <div class="page-heading">
        <h2>Dashboard</h2>
        <p>Quick overview of the portfolio dashboard state.</p>
      </div>

      <div class="stats-grid">
        <article class="stat-card">
          <span>Products</span>
          <strong>{{ data.products.length }}</strong>
        </article>
        <article class="stat-card">
          <span>Total Orders</span>
          <strong>{{ data.orders.length }}</strong>
        </article>
        <article class="stat-card">
          <span>Unread Messages</span>
          <strong>{{ unreadMessages }}</strong>
        </article>
        <article class="stat-card">
          <span>Total Revenue</span>
          <strong>EGP 1,745.00</strong>
        </article>
      </div>

      <div class="panel-grid">
        <section class="panel">
          <div class="panel-head">
            <h3>Recent Orders</h3>
          </div>
          <div class="table-like">
            <div class="row header">
              <span>Order</span>
              <span>Customer</span>
              <span>Status</span>
              <span>Total</span>
            </div>
            <div class="row" *ngFor="let order of data.orders">
              <span>{{ order.id }}</span>
              <span>{{ order.customer }}</span>
              <span class="status">{{ order.status }}</span>
              <span>{{ order.total }}</span>
            </div>
          </div>
        </section>

        <section class="panel">
          <div class="panel-head">
            <h3>Quick Actions</h3>
          </div>
          <div class="actions">
            <a class="action-card" href="/admin/products">Manage Products</a>
            <a class="action-card" href="/admin/site-content">Edit Site Content</a>
            <a class="action-card" href="/admin/visual-editor">Open Visual Editor</a>
          </div>
        </section>
      </div>
    </section>
  `,
  styles: [
    `
      .page-grid {
        display: grid;
        gap: 20px;
      }

      .page-heading h2 {
        margin: 0 0 6px;
        font-size: 2rem;
      }

      .page-heading p {
        margin: 0;
        color: rgba(255, 255, 255, 0.58);
      }

      .stats-grid {
        display: grid;
        grid-template-columns: repeat(4, minmax(0, 1fr));
        gap: 16px;
      }

      .stat-card,
      .panel {
        border-radius: 22px;
        border: 1px solid rgba(255, 255, 255, 0.08);
        background: rgba(18, 18, 18, 0.86);
      }

      .stat-card {
        padding: 18px 20px;
      }

      .stat-card span {
        display: block;
        color: rgba(255, 255, 255, 0.56);
        margin-bottom: 10px;
      }

      .stat-card strong {
        font-size: 2rem;
      }

      .panel-grid {
        display: grid;
        grid-template-columns: 1.45fr 1fr;
        gap: 18px;
      }

      .panel {
        padding: 20px;
      }

      .panel-head {
        margin-bottom: 16px;
      }

      .panel-head h3 {
        margin: 0;
      }

      .table-like {
        display: grid;
      }

      .row {
        display: grid;
        grid-template-columns: 1.6fr 1fr 0.8fr 0.8fr;
        gap: 12px;
        padding: 12px 0;
        border-bottom: 1px solid rgba(255, 255, 255, 0.06);
      }

      .row.header {
        color: rgba(255, 255, 255, 0.5);
        font-size: 0.86rem;
        text-transform: uppercase;
        letter-spacing: 1px;
      }

      .status {
        color: #d7b970;
      }

      .actions {
        display: grid;
        gap: 12px;
      }

      .action-card {
        text-decoration: none;
        color: #fff8ec;
        padding: 16px;
        border-radius: 18px;
        border: 1px solid rgba(255, 255, 255, 0.08);
        background: linear-gradient(135deg, rgba(201, 169, 97, 0.16), rgba(255, 255, 255, 0.02));
      }

      @media (max-width: 1100px) {
        .stats-grid,
        .panel-grid {
          grid-template-columns: 1fr;
        }
      }
    `,
  ],
})
export class AdminDashboardComponent {
  readonly data = inject(MockAdminDataService);
  readonly unreadMessages = this.data.messages.filter((message) => message.status === 'New').length;
}
