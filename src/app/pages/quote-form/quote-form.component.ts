import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CatalogProductListItem } from '../../core/models/catalog-product.model';
import { CatalogProductsApiService } from '../../core/services/catalog-products-api.service';
import { LanguageService } from '../../core/services/language.service';
import { QuotesApiService } from '../../core/services/quotes-api.service';
import { FooterComponent } from '../footer/footer.component';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-quote-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NavbarComponent, FooterComponent],
  template: `
    <app-navbar></app-navbar>
    <main class="page">
      <section>
        <span>Request Quote</span>
        <h1>Send a product inquiry</h1>
      </section>

      <form [formGroup]="form" (ngSubmit)="submit()">
        <div class="grid">
          <input formControlName="fullName" placeholder="Full name" />
          <input formControlName="company" placeholder="Company" />
          <input formControlName="country" placeholder="Country" />
          <input formControlName="email" placeholder="Email" />
          <input formControlName="phone" placeholder="Phone" />
          <input formControlName="quantity" placeholder="Quantity" />
        </div>

        <select formControlName="productId">
          <option [ngValue]="null">Select product</option>
          <option *ngFor="let product of products()" [ngValue]="product.id">
            {{ product.name }}
          </option>
        </select>

        <textarea formControlName="message" rows="6" placeholder="Message"></textarea>
        <button type="submit" [disabled]="form.invalid || saving()">
          {{ saving() ? 'Sending...' : 'Submit quote request' }}
        </button>
        <p *ngIf="status()">{{ status() }}</p>
      </form>
    </main>
    <app-footer></app-footer>
  `,
  styles: [
    `
      .page {
        min-height: 100vh;
        width: min(900px, calc(100% - 40px));
        margin: 0 auto;
        padding: 120px 0 70px;
      }

      span,
      p {
        color: var(--color-primary);
        font-weight: 800;
      }

      h1 {
        color: var(--text-primary);
        margin: 8px 0 24px;
        font-size: clamp(2rem, 5vw, 4rem);
      }

      form,
      .grid {
        display: grid;
        gap: 12px;
      }

      .grid {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }

      input,
      select,
      textarea {
        border: 1px solid var(--border-color);
        background: var(--card-bg);
        color: var(--text-primary);
        border-radius: 6px;
        padding: 13px 14px;
        font: inherit;
      }

      button {
        border: 0;
        border-radius: 6px;
        padding: 14px 18px;
        background: var(--color-primary);
        color: #fff;
        font-weight: 800;
        cursor: pointer;
      }

      @media (max-width: 760px) {
        .grid {
          grid-template-columns: 1fr;
        }
      }
    `,
  ],
})
export class QuoteFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly productsApi = inject(CatalogProductsApiService);
  private readonly quotesApi = inject(QuotesApiService);
  private readonly lang = inject(LanguageService);

  readonly products = signal<CatalogProductListItem[]>([]);
  readonly saving = signal(false);
  readonly status = signal('');

  readonly form = this.fb.group({
    fullName: ['', Validators.required],
    company: ['', Validators.required],
    country: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phone: [''],
    quantity: [''],
    productId: [null as number | null],
    message: [''],
  });

  ngOnInit(): void {
    this.productsApi.getPublicProducts({ page: 1, pageSize: 100 }).subscribe({
      next: (response) => this.products.set(response.items ?? []),
      error: (error) => console.error('Failed to load quote products', error),
    });

    const productId = Number(this.route.snapshot.queryParamMap.get('productId'));
    if (Number.isFinite(productId) && productId > 0) {
      this.form.controls.productId.setValue(productId);
    }
  }

  submit(): void {
    if (this.form.invalid) {
      return;
    }

    const value = this.form.getRawValue();
    this.saving.set(true);
    const payload = {
        fullName: value.fullName ?? '',
        company: value.company ?? '',
        country: value.country ?? '',
        email: value.email ?? '',
        phone: value.phone ?? undefined,
        quantity: value.quantity ?? undefined,
        productId: value.productId ?? undefined,
        message: value.message ?? undefined,
        locale: this.lang.currentLang(),
      };

    this.quotesApi
      .submitQuote(payload)
      .subscribe({
        next: () => {
          this.status.set('Quote request sent.');
          this.form.reset();
          this.saving.set(false);
        },
        error: () => {
          this.status.set('Could not submit the quote request.');
          this.saving.set(false);
        },
      });
  }
}
