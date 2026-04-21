import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PortfolioProductsApiService } from '../../../core/services/portfolio-products-api.service';
import { PortfolioProductApi } from '../../../core/models/portfolio-product.model';

@Component({
  selector: 'app-admin-products',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="page">
      <div class="page-head">
        <div>
          <span class="eyebrow">Showcase Management</span>
          <h2>Portfolio Showcase Library</h2>
          <p>Manage the collection cards shown in the public portfolio grid.</p>
        </div>
        <button type="button">+ Add Showcase Card</button>
      </div>

      <div *ngIf="loading()" class="loading-state">
        <p>Loading products...</p>
      </div>

      <ng-container *ngIf="!loading()">
        <div class="summary-strip">
          <div class="summary-item">
            <strong>{{ liveCount() }}</strong>
            <span>Live cards</span>
          </div>
          <div class="summary-item">
            <strong>{{ draftCount() }}</strong>
            <span>Draft cards</span>
          </div>
          <div class="summary-item">
            <strong>{{ products().length }}</strong>
            <span>Total managed cards</span>
          </div>
        </div>

        <div *ngIf="products().length === 0" class="empty-state">
          <p>No products found in the showcase library.</p>
        </div>

        <div class="card-grid" *ngIf="products().length > 0">
          <article class="product-card" *ngFor="let product of products()">
            <img [src]="product.imageUrl" [alt]="product.name" />

            <div class="content">
              <div class="meta">
                <span class="pill">{{ product.status }}</span>
                <span class="category">{{ product.category }}</span>
              </div>

              <h3>{{ product.name }}</h3>
              <p class="origin">{{ product.origin.join(', ') }}</p>
              <p class="note">{{ product.note }}</p>

              <div class="footer">
                <small>Updated {{ product.updatedAt | date:'mediumDate' }}</small>
                <div class="actions">
                  <button type="button" class="secondary">Edit Copy</button>
                  <button type="button" class="secondary">Update Image</button>
                </div>
              </div>
            </div>
          </article>
        </div>
      </ng-container>
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
        align-items: flex-end;
        gap: 18px;
      }

      .eyebrow {
        display: inline-block;
        margin-bottom: 10px;
        color: var(--color-primary);
        text-transform: uppercase;
        letter-spacing: 0.18em;
        font-size: 0.8rem;
        font-weight: 800;
      }

      h2,
      h3,
      p {
        margin: 0;
      }

      .page-head p,
      .origin,
      .note,
      small,
      .loading-state,
      .empty-state {
        color: var(--text-secondary);
      }

      .loading-state, .empty-state {
        padding: 40px;
        text-align: center;
        border: 1px dashed var(--border-color);
        border-radius: 26px;
      }

      .page-head button,
      .actions button {
        border: none;
        border-radius: 16px;
        padding: 12px 16px;
        cursor: pointer;
        font-weight: 700;
        font: inherit;
        transition: all 0.25s ease;
      }

      .page-head button {
        color: #fff;
        background: linear-gradient(135deg, var(--color-primary), var(--color-accent));
      }

      .page-head button:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 18px rgba(245, 124, 0, 0.35);
      }

      .summary-strip {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 16px;
      }

      .summary-item,
      .product-card {
        border-radius: 24px;
        border: 1px solid var(--border-color);
        background: var(--card-bg);
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
        transition:
          background 0.4s ease,
          border-color 0.4s ease;
      }

      .summary-item {
        padding: 18px 20px;
      }

      .summary-item strong {
        display: block;
        margin-bottom: 8px;
        font-size: 2rem;
        color: var(--text-primary);
      }

      .summary-item span {
        color: var(--text-secondary);
      }

      .card-grid {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 18px;
      }

      .product-card {
        overflow: hidden;
      }

      img {
        width: 100%;
        height: 230px;
        object-fit: contain;
        background:
          radial-gradient(circle at top, rgba(245, 124, 0, 0.08), transparent 54%),
          var(--bg-surface);
        padding: 26px;
      }

      .content {
        display: grid;
        gap: 14px;
        padding: 18px 20px 20px;
      }

      .meta,
      .footer,
      .actions {
        display: flex;
        justify-content: space-between;
        gap: 10px;
        align-items: center;
      }

      .pill,
      .category {
        border-radius: 999px;
        padding: 5px 11px;
        font-size: 0.82rem;
        font-weight: 600;
      }

      .pill {
        background: rgba(245, 124, 0, 0.12);
        color: var(--color-primary);
      }

      .category {
        background: var(--border-color);
        color: var(--text-secondary);
      }

      .origin {
        font-weight: 700;
        color: var(--text-primary);
      }

      .note {
        line-height: 1.6;
      }

      .footer {
        align-items: flex-end;
      }

      .actions {
        flex-wrap: wrap;
        justify-content: flex-end;
      }

      .actions .secondary {
        color: var(--text-secondary);
        background: var(--bg-surface);
        border: 1px solid var(--border-color);
      }

      .actions .secondary:hover {
        color: var(--text-primary);
        border-color: rgba(245, 124, 0, 0.35);
      }

      @media (max-width: 1180px) {
        .summary-strip,
        .card-grid {
          grid-template-columns: 1fr;
        }
      }

      @media (max-width: 720px) {
        .page-head,
        .footer {
          display: grid;
          gap: 14px;
        }
        .actions {
          justify-content: flex-start;
        }
      }
    `,
  ],
})
export class AdminProductsComponent implements OnInit {
  private readonly productsApi = inject(PortfolioProductsApiService);

  readonly products = signal<PortfolioProductApi[]>([]);
  readonly loading = signal(true);

  readonly liveCount = computed(() =>
    this.products().filter((p) => p.status === 'Live').length
  );
  readonly draftCount = computed(() =>
    this.products().filter((p) => p.status === 'Draft' || p.status === 'Hidden').length
  );

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.loading.set(true);
    this.productsApi.getProducts().subscribe({
      next: (data) => {
        this.products.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      }
    });
  }
}
