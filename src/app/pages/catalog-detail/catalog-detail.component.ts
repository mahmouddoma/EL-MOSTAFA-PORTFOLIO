import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CatalogProductDetail } from '../../core/models/catalog-product.model';
import { CatalogProductsApiService } from '../../core/services/catalog-products-api.service';
import { FooterComponent } from '../footer/footer.component';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-catalog-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, NavbarComponent, FooterComponent],
  template: `
    <app-navbar></app-navbar>
    <main class="page" *ngIf="product() as item">
      <a routerLink="/catalog" class="back">Back to catalog</a>
      <section class="hero">
        <img *ngIf="item.coverImageUrl" [src]="item.coverImageUrl" [alt]="item.name" />
        <div>
          <span>{{ item.categoryName }}</span>
          <h1>{{ item.name }}</h1>
          <p>{{ item.shortDescription }}</p>
          <a routerLink="/quote" [queryParams]="{ productId: item.id }" class="cta">Request quote</a>
        </div>
      </section>

      <section class="details">
        <article><strong>Origin</strong><p>{{ item.origin }}</p></article>
        <article><strong>Season</strong><p>{{ item.season }}</p></article>
        <article><strong>Calibers</strong><p>{{ item.calibers }}</p></article>
        <article><strong>Packaging</strong><p>{{ item.packagingDetails }}</p></article>
      </section>

      <article class="body">{{ item.longDescription }}</article>
    </main>
    <app-footer></app-footer>
  `,
  styles: [
    `
      .page {
        width: min(1120px, calc(100% - 40px));
        margin: 0 auto;
        padding: 120px 0 70px;
      }

      .hero {
        display: grid;
        grid-template-columns: minmax(0, 1fr) minmax(320px, 0.8fr);
        gap: 28px;
        align-items: center;
      }

      img {
        width: 100%;
        aspect-ratio: 4 / 3;
        object-fit: cover;
        border-radius: 8px;
      }

      .back,
      span,
      .cta {
        color: var(--color-primary);
        font-weight: 800;
      }

      h1 {
        color: var(--text-primary);
        font-size: clamp(2rem, 5vw, 4rem);
        margin: 10px 0;
      }

      p,
      .body {
        color: var(--text-secondary);
        line-height: 1.7;
      }

      .details {
        display: grid;
        grid-template-columns: repeat(4, minmax(0, 1fr));
        gap: 12px;
        margin-top: 30px;
      }

      .details article {
        border: 1px solid var(--border-color);
        background: var(--card-bg);
        border-radius: 8px;
        padding: 16px;
      }

      .details strong {
        color: var(--text-primary);
      }

      .cta {
        display: inline-flex;
        margin-top: 12px;
      }

      .body {
        margin-top: 30px;
      }

      @media (max-width: 900px) {
        .hero,
        .details {
          grid-template-columns: 1fr;
        }
      }
    `,
  ],
})
export class CatalogDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly productsApi = inject(CatalogProductsApiService);

  readonly product = signal<CatalogProductDetail | null>(null);

  ngOnInit(): void {
    const slug = this.route.snapshot.paramMap.get('slug');
    if (!slug) {
      return;
    }

    this.productsApi.getPublicProductBySlug(slug).subscribe({
      next: (product) => this.product.set(product),
      error: (error) => console.error('Failed to load product details', error),
    });
  }
}
