import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MockAdminDataService } from '../../core/services/mock-admin-data.service';

@Component({
  selector: 'app-admin-products',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="page">
      <div class="page-head">
        <div>
          <h2>Products</h2>
          <p>Mock product management UI until backend wiring is ready.</p>
        </div>
        <button type="button">+ Add Product</button>
      </div>

      <div class="card-grid">
        <article class="product-card" *ngFor="let product of data.products">
          <img [src]="product.imageUrl" [alt]="product.name" />
          <div class="meta">
            <span class="pill">{{ product.status }}</span>
            <span class="category">{{ product.category }}</span>
          </div>
          <h3>{{ product.name }}</h3>
          <p>{{ product.origin }}</p>
          <div class="actions">
            <button type="button" class="secondary">Edit</button>
            <button type="button" class="danger">Delete</button>
          </div>
        </article>
      </div>
    </section>
  `,
  styles: [
    `
      .page {
        display: grid;
        gap: 20px;
      }

      .page-head {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 16px;
      }

      h2 {
        margin: 0 0 6px;
      }

      p {
        margin: 0;
        color: rgba(255, 255, 255, 0.56);
      }

      .page-head button,
      .actions button {
        border: none;
        border-radius: 14px;
        padding: 12px 16px;
        cursor: pointer;
        font-weight: 700;
      }

      .page-head button {
        background: linear-gradient(135deg, #d7b970, #a37a36);
        color: #0f0f0f;
      }

      .card-grid {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 18px;
      }

      .product-card {
        border-radius: 22px;
        border: 1px solid rgba(255, 255, 255, 0.08);
        background: rgba(18, 18, 18, 0.86);
        overflow: hidden;
      }

      img {
        width: 100%;
        height: 220px;
        object-fit: contain;
        background: linear-gradient(180deg, rgba(201, 169, 97, 0.08), transparent);
        padding: 24px;
      }

      .meta,
      .actions {
        display: flex;
        justify-content: space-between;
        gap: 10px;
      }

      .meta {
        padding: 18px 20px 0;
      }

      .pill,
      .category {
        border-radius: 999px;
        padding: 6px 10px;
        font-size: 0.84rem;
      }

      .pill {
        background: rgba(201, 169, 97, 0.14);
        color: #e7cd95;
      }

      .category {
        background: rgba(255, 255, 255, 0.06);
        color: rgba(255, 255, 255, 0.65);
      }

      h3,
      p,
      .actions {
        padding-left: 20px;
        padding-right: 20px;
      }

      h3 {
        margin: 12px 0 6px;
      }

      .actions {
        padding-bottom: 20px;
        padding-top: 14px;
      }

      .actions .secondary {
        background: rgba(255, 255, 255, 0.08);
        color: #fff;
        flex: 1;
      }

      .actions .danger {
        background: rgba(155, 41, 41, 0.3);
        color: #ffb2b2;
        flex: 1;
      }

      @media (max-width: 1100px) {
        .card-grid {
          grid-template-columns: 1fr;
        }
      }
    `,
  ],
})
export class AdminProductsComponent {
  readonly data = inject(MockAdminDataService);
}
