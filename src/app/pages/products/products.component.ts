import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { ProductCardComponent } from '../../shared/components/product-card/product-card.component';
import { ScrollRevealDirective } from '../../shared/directives/scroll-reveal.directive';
import {
  selectFilteredProducts,
  selectActiveFilter,
} from '../../state/products/products.selectors';
import { selectAllOrigins } from '../../state/origins/origins.selectors';
import { filterByOrigin, selectProduct, loadProducts } from '../../state/products/products.actions';
import { Product } from '../../domain/models/product.model';
import { trigger, transition, style, animate, query, stagger } from '@angular/animations';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, FormsModule, ProductCardComponent, ScrollRevealDirective],
  animations: [
    trigger('listAnimation', [
      transition('* => *', [
        query(
          ':enter',
          [
            style({ opacity: 0, transform: 'translateY(40px) scale(0.95)' }),
            stagger(100, [
              animate(
                '0.6s cubic-bezier(0.16, 1, 0.3, 1)',
                style({ opacity: 1, transform: 'translateY(0) scale(1)' }),
              ),
            ]),
          ],
          { optional: true },
        ),
        query(
          ':leave',
          [
            stagger(50, [
              animate(
                '0.3s ease-out',
                style({ opacity: 0, transform: 'scale(0.9) translateY(20px)' }),
              ),
            ]),
          ],
          { optional: true },
        ),
      ]),
    ]),
  ],
  template: `
    <section class="products-section py-5" id="products" appScrollReveal>
      <div class="container py-5">
        <div class="d-flex justify-content-between align-items-end mb-5 flex-wrap gap-4">
          <div>
            <span class="eyebrow">EL MOSTAFA COLLECTION</span>
            <h2 class="display-3 font-playfair fw-bold mb-2 text-white">Our Harvest</h2>
            <p class="text-white mb-0" style="max-width:500px">
              Explore our highly curated selection of the finest imported fruits globally.
            </p>
          </div>

          <div class="filter-wrapper">
            <select
              class="form-select custom-select glass-dropdown"
              [ngModel]="activeFilter$ | async"
              (ngModelChange)="onFilterChange($event)"
            >
              <option [ngValue]="null">🌍 All Origins</option>
              <option *ngFor="let origin of origins$ | async" [ngValue]="origin.country">
                {{ origin.flag }} {{ origin.country }}
              </option>
            </select>
          </div>
        </div>

        <!-- Asymmetric Staggered Grid -->
        <div class="row g-4 staggered-grid" [@listAnimation]="(products$ | async)?.length">
          <div
            class="col-12 col-md-6 col-lg-3 product-wrapper"
            *ngFor="let product of products$ | async"
          >
            <div class="offset-container">
              <app-product-card
                [product]="product"
                (cardClicked)="onProductClicked($event)"
              ></app-product-card>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [
    `
      .products-section {
        background-color: var(--color-dark);
        position: relative;
        overflow: hidden;
        min-height: 100vh;
      }
      .eyebrow {
        color: var(--color-primary);
        text-transform: uppercase;
        letter-spacing: 3px;
        font-size: 0.8rem;
        font-weight: 700;
        margin-bottom: 15px;
        display: block;
      }
      .font-playfair {
        font-family: var(--font-display);
      }
      .text-white {
        color: #fff;
      }
      .text-white-50 {
        color: rgba(255, 255, 255, 0.6);
      }

      .glass-dropdown {
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(255, 255, 255, 0.1);
        color: #fff;
        backdrop-filter: blur(10px);
        border-radius: 50px;
        padding: 0.75rem 2.5rem 0.75rem 1.5rem;
        font-weight: 600;
        cursor: pointer;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
      }
      .glass-dropdown:focus {
        background: rgba(255, 255, 255, 0.1);
        border-color: var(--color-primary);
        box-shadow: 0 0 0 0.25rem rgba(245, 124, 0, 0.25);
        color: #fff;
      }
      .glass-dropdown option {
        background-color: var(--color-dark);
        color: #fff;
      }

      .staggered-grid {
        position: relative;
        z-index: 10;
      }

      /* Desktop & Tablet: Stagger every even column */
      @media (min-width: 768px) {
        .offset-container {
          height: 380px;
          transition: margin 0.3s ease;
        }
        .product-wrapper:nth-child(even) .offset-container {
          margin-top: 3rem;
        }
      }

      /* Mobile: Single column, no stagger */
      @media (max-width: 767px) {
        .offset-container {
          height: auto;
          margin-bottom: 1.5rem;
        }
      }
    `,
  ],
})
export class ProductsComponent implements OnInit {
  private store = inject(Store);

  products$ = this.store.select(selectFilteredProducts);
  activeFilter$ = this.store.select(selectActiveFilter);
  origins$ = this.store.select(selectAllOrigins);

  ngOnInit() {
    this.store.dispatch(loadProducts());
  }

  onFilterChange(origin: string | null) {
    this.store.dispatch(filterByOrigin({ origin }));
  }

  onProductClicked(product: Product) {
    this.store.dispatch(selectProduct({ id: product.id }));
  }
}
