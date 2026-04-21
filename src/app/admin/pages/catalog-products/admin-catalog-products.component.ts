import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AdminCatalogProduct } from '../../../core/models/catalog-product.model';
import { AdminCategory } from '../../../core/models/category.model';
import { CatalogProductsApiService } from '../../../core/services/catalog-products-api.service';
import { CategoriesApiService } from '../../../core/services/categories-api.service';

@Component({
  selector: 'app-admin-catalog-products',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <section class="page">
      <div class="page-head">
        <div>
          <span class="eyebrow">Catalog</span>
          <h2>Structured Product Catalog</h2>
        </div>
      </div>

      <div class="layout">
        <form class="panel" [formGroup]="form" (ngSubmit)="save()">
          <h3>{{ editing() ? 'Edit Product' : 'Create Product' }}</h3>
          <div class="grid">
            <input formControlName="slug" placeholder="slug" />
            <select formControlName="categoryId">
              <option [ngValue]="null">Category</option>
              <option *ngFor="let category of categories()" [ngValue]="category.id">
                {{ category.name['en'] || category.slug }}
              </option>
            </select>
            <input formControlName="nameEn" placeholder="name EN" />
            <input formControlName="nameAr" placeholder="name AR" />
            <input formControlName="originEn" placeholder="origin EN" />
            <input formControlName="originAr" placeholder="origin AR" />
            <input formControlName="seasonEn" placeholder="season EN" />
            <input formControlName="seasonAr" placeholder="season AR" />
            <input formControlName="calibersEn" placeholder="calibers EN" />
            <input formControlName="calibersAr" placeholder="calibers AR" />
            <input formControlName="packagingEn" placeholder="packaging EN" />
            <input formControlName="packagingAr" placeholder="packaging AR" />
            <input formControlName="sortOrder" type="number" placeholder="sort order" />
          </div>
          <textarea formControlName="shortEn" rows="2" placeholder="short description EN"></textarea>
          <textarea formControlName="shortAr" rows="2" placeholder="short description AR"></textarea>
          <textarea formControlName="longEn" rows="4" placeholder="long description EN"></textarea>
          <textarea formControlName="longAr" rows="4" placeholder="long description AR"></textarea>
          <div class="checks">
            <label><input type="checkbox" formControlName="isFeatured" /> Featured</label>
            <label><input type="checkbox" formControlName="isActive" /> Active</label>
          </div>
          <div class="actions">
            <button type="submit" [disabled]="form.invalid">Save product</button>
            <button type="button" class="ghost" (click)="reset()">Clear</button>
          </div>
        </form>

        <div class="panel image-panel" *ngIf="editing() as product">
          <h3>Images for {{ product.name['en'] || product.slug }}</h3>
          <form [formGroup]="imageForm" (ngSubmit)="addImage()">
            <input formControlName="url" placeholder="image url" />
            <input formControlName="altEn" placeholder="alt EN" />
            <input formControlName="altAr" placeholder="alt AR" />
            <input formControlName="sortOrder" type="number" placeholder="sort order" />
            <label><input type="checkbox" formControlName="isCover" /> Cover</label>
            <button type="submit" [disabled]="imageForm.invalid">Add image</button>
          </form>
          <article class="image-row" *ngFor="let image of product.images || []">
            <img [src]="image.url" [alt]="imageAlt(image.alt)" />
            <span>{{ image.url }}</span>
            <button type="button" class="danger" (click)="deleteImage(product.id, image.id)">Delete</button>
          </article>
        </div>
      </div>

      <div class="panel list">
        <article class="row" *ngFor="let product of products()">
          <div>
            <strong>{{ product.name['en'] || product.slug }}</strong>
            <small>{{ product.categorySlug }} · {{ product.isActive ? 'Active' : 'Hidden' }}</small>
          </div>
          <div class="actions">
            <button type="button" (click)="edit(product)">Edit</button>
            <button type="button" class="danger" (click)="remove(product.id)">Delete</button>
          </div>
        </article>
      </div>
    </section>
  `,
  styles: [
    `
      .page,
      form,
      .panel,
      .list,
      .image-panel {
        display: grid;
        gap: 14px;
      }

      .layout {
        display: grid;
        grid-template-columns: minmax(0, 1fr) minmax(320px, 0.8fr);
        gap: 16px;
      }

      .page-head,
      .row,
      .actions,
      .checks,
      .image-row {
        display: flex;
        gap: 10px;
        flex-wrap: wrap;
      }

      .page-head,
      .row {
        justify-content: space-between;
        align-items: center;
      }

      .panel {
        border: 1px solid var(--border-color);
        background: var(--card-bg);
        border-radius: 8px;
        padding: 18px;
      }

      .grid {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 10px;
      }

      .eyebrow {
        color: var(--color-primary);
        font-size: 0.78rem;
        font-weight: 800;
        text-transform: uppercase;
      }

      h2,
      h3,
      small {
        margin: 0;
      }

      h2,
      h3,
      strong,
      label {
        color: var(--text-primary);
      }

      small,
      .image-row span {
        color: var(--text-secondary);
      }

      input,
      select,
      textarea {
        border: 1px solid var(--border-color);
        background: var(--bg-surface);
        color: var(--text-primary);
        border-radius: 6px;
        padding: 11px 12px;
        font: inherit;
      }

      button {
        border: 0;
        border-radius: 6px;
        padding: 10px 13px;
        background: var(--color-primary);
        color: #fff;
        font-weight: 800;
        cursor: pointer;
      }

      .ghost {
        background: var(--border-color);
        color: var(--text-primary);
      }

      .danger {
        background: #d32f2f;
      }

      .image-row {
        align-items: center;
        border-top: 1px solid var(--border-color);
        padding-top: 12px;
      }

      .image-row img {
        width: 70px;
        height: 54px;
        object-fit: cover;
        border-radius: 6px;
      }

      @media (max-width: 1050px) {
        .layout,
        .grid {
          grid-template-columns: 1fr;
        }
      }
    `,
  ],
})
export class AdminCatalogProductsComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly productsApi = inject(CatalogProductsApiService);
  private readonly categoriesApi = inject(CategoriesApiService);

  readonly products = signal<AdminCatalogProduct[]>([]);
  readonly categories = signal<AdminCategory[]>([]);
  readonly editing = signal<AdminCatalogProduct | null>(null);

  readonly form = this.fb.group({
    slug: [''],
    categoryId: [null as number | null, Validators.required],
    nameEn: ['', Validators.required],
    nameAr: [''],
    shortEn: [''],
    shortAr: [''],
    longEn: [''],
    longAr: [''],
    originEn: [''],
    originAr: [''],
    seasonEn: [''],
    seasonAr: [''],
    calibersEn: [''],
    calibersAr: [''],
    packagingEn: [''],
    packagingAr: [''],
    sortOrder: [0],
    isFeatured: [false],
    isActive: [true],
  });

  readonly imageForm = this.fb.group({
    url: ['', Validators.required],
    altEn: [''],
    altAr: [''],
    sortOrder: [0],
    isCover: [false],
  });

  ngOnInit(): void {
    this.load();
    this.categoriesApi.getAdminCategories().subscribe({
      next: (categories) => this.categories.set(categories),
      error: (error) => console.error('Failed to load catalog categories', error),
    });
  }

  load(): void {
    this.productsApi.getAdminProducts({ page: 1, pageSize: 100 }).subscribe({
      next: (response) => this.products.set(response.items ?? []),
      error: (error) => console.error('Failed to load catalog products', error),
    });
  }

  save(): void {
    if (this.form.invalid) {
      return;
    }

    const value = this.form.getRawValue();
    const payload = {
      categoryId: value.categoryId ?? 0,
      slug: value.slug ?? '',
      name: { en: value.nameEn ?? '', ar: value.nameAr ?? '' },
      shortDescription: { en: value.shortEn ?? '', ar: value.shortAr ?? '' },
      longDescription: { en: value.longEn ?? '', ar: value.longAr ?? '' },
      origin: { en: value.originEn ?? '', ar: value.originAr ?? '' },
      season: { en: value.seasonEn ?? '', ar: value.seasonAr ?? '' },
      calibers: { en: value.calibersEn ?? '', ar: value.calibersAr ?? '' },
      packagingDetails: { en: value.packagingEn ?? '', ar: value.packagingAr ?? '' },
      isFeatured: Boolean(value.isFeatured),
      isActive: Boolean(value.isActive),
      sortOrder: value.sortOrder ?? 0,
    };

    const request = this.editing()
      ? this.productsApi.updateProduct(this.editing()!.id, payload)
      : this.productsApi.createProduct(payload);

    request.subscribe({
      next: () => {
        this.reset();
        this.load();
      },
      error: (error) => console.error('Failed to save catalog product', error),
    });
  }

  edit(product: AdminCatalogProduct): void {
    this.editing.set(product);
    this.form.patchValue({
      slug: product.slug,
      categoryId: product.categoryId,
      nameEn: product.name?.['en'] ?? '',
      nameAr: product.name?.['ar'] ?? '',
      shortEn: product.shortDescription?.['en'] ?? '',
      shortAr: product.shortDescription?.['ar'] ?? '',
      longEn: product.longDescription?.['en'] ?? '',
      longAr: product.longDescription?.['ar'] ?? '',
      originEn: product.origin?.['en'] ?? '',
      originAr: product.origin?.['ar'] ?? '',
      seasonEn: product.season?.['en'] ?? '',
      seasonAr: product.season?.['ar'] ?? '',
      calibersEn: product.calibers?.['en'] ?? '',
      calibersAr: product.calibers?.['ar'] ?? '',
      packagingEn: product.packagingDetails?.['en'] ?? '',
      packagingAr: product.packagingDetails?.['ar'] ?? '',
      sortOrder: product.sortOrder,
      isFeatured: product.isFeatured,
      isActive: product.isActive,
    });
  }

  reset(): void {
    this.editing.set(null);
    this.form.reset({ sortOrder: 0, isFeatured: false, isActive: true });
    this.imageForm.reset({ sortOrder: 0, isCover: false });
  }

  remove(id: number): void {
    if (!confirm('Delete this catalog product?')) {
      return;
    }
    this.productsApi.deleteProduct(id).subscribe({
      next: () => this.load(),
      error: (error) => console.error('Failed to delete catalog product', error),
    });
  }

  addImage(): void {
    const product = this.editing();
    if (!product || this.imageForm.invalid) {
      return;
    }

    const value = this.imageForm.getRawValue();
    this.productsApi
      .addImage(product.id, {
        url: value.url ?? '',
        alt: { en: value.altEn ?? '', ar: value.altAr ?? '' },
        sortOrder: value.sortOrder ?? 0,
        isCover: Boolean(value.isCover),
      })
      .subscribe({
        next: () => {
          this.imageForm.reset({ sortOrder: 0, isCover: false });
          this.reloadEditing(product.id);
        },
        error: (error) => console.error('Failed to add product image', error),
      });
  }

  deleteImage(productId: number, imageId: number): void {
    if (!confirm('Delete this image?')) {
      return;
    }

    this.productsApi.deleteImage(productId, imageId).subscribe({
      next: () => this.reloadEditing(productId),
      error: (error) => console.error('Failed to delete image', error),
    });
  }

  imageAlt(alt: unknown): string {
    return typeof alt === 'string' ? alt : (alt as Record<string, string> | undefined)?.['en'] ?? '';
  }

  private reloadEditing(id: number): void {
    this.productsApi.getAdminProductById(id).subscribe({
      next: (product) => {
        this.editing.set(product);
        this.load();
      },
      error: (error) => console.error('Failed to reload catalog product', error),
    });
  }
}
