import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Quote } from '../../../core/models/quote.model';
import { QuotesApiService } from '../../../core/services/quotes-api.service';

@Component({
  selector: 'app-admin-quotes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <section class="page">
      <div class="page-head">
        <div>
          <span class="eyebrow">Quotes</span>
          <h2>Quote Requests</h2>
        </div>
        <button type="button" (click)="exportCsv()">Export CSV</button>
      </div>

      <div class="filters">
        <input [(ngModel)]="search" placeholder="Search" />
        <select [(ngModel)]="status">
          <option [ngValue]="undefined">All statuses</option>
          <option [ngValue]="0">New</option>
          <option [ngValue]="1">In Progress</option>
          <option [ngValue]="2">Closed</option>
          <option [ngValue]="3">Archived</option>
        </select>
        <button type="button" (click)="load()">Apply</button>
      </div>

      <div class="panel">
        <article class="row" *ngFor="let quote of quotes()">
          <div>
            <strong>{{ quote.fullName }}</strong>
            <small>{{ quote.company }} · {{ quote.email }} · {{ quote.createdAt | date }}</small>
            <p>{{ quote.message }}</p>
          </div>
          <div class="actions">
            <select [ngModel]="quote.status" (ngModelChange)="updateStatus(quote, $event)">
              <option [ngValue]="0">New</option>
              <option [ngValue]="1">In Progress</option>
              <option [ngValue]="2">Closed</option>
              <option [ngValue]="3">Archived</option>
            </select>
            <button type="button" class="danger" (click)="remove(quote.id)">Delete</button>
          </div>
        </article>
      </div>
    </section>
  `,
  styles: [
    `
      .page,
      .panel {
        display: grid;
        gap: 14px;
      }

      .page-head,
      .filters,
      .row,
      .actions {
        display: flex;
        gap: 10px;
        flex-wrap: wrap;
      }

      .page-head,
      .row {
        justify-content: space-between;
        align-items: flex-start;
      }

      .eyebrow {
        color: var(--color-primary);
        font-size: 0.78rem;
        font-weight: 800;
        text-transform: uppercase;
      }

      h2,
      p,
      small {
        margin: 0;
      }

      h2,
      strong {
        color: var(--text-primary);
      }

      p,
      small {
        color: var(--text-secondary);
      }

      .panel {
        border: 1px solid var(--border-color);
        background: var(--card-bg);
        border-radius: 8px;
        padding: 18px;
      }

      .row {
        border-top: 1px solid var(--border-color);
        padding-top: 12px;
      }

      input,
      select {
        border: 1px solid var(--border-color);
        background: var(--bg-surface);
        color: var(--text-primary);
        border-radius: 6px;
        padding: 10px 12px;
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

      .danger {
        background: #d32f2f;
      }
    `,
  ],
})
export class AdminQuotesComponent implements OnInit {
  private readonly quotesApi = inject(QuotesApiService);

  readonly quotes = signal<Quote[]>([]);
  search = '';
  status?: number;

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.quotesApi
      .getQuotes({ search: this.search || undefined, status: this.status, page: 1, pageSize: 100 })
      .subscribe({
        next: (response) => this.quotes.set(response.items ?? []),
        error: (error) => console.error('Failed to load quotes', error),
      });
  }

  updateStatus(quote: Quote, status: number): void {
    this.quotesApi.updateStatus(quote.id, { status }).subscribe({
      next: () => this.load(),
      error: (error) => console.error('Failed to update quote status', error),
    });
  }

  remove(id: number): void {
    if (!confirm('Delete this quote request?')) {
      return;
    }
    this.quotesApi.deleteQuote(id).subscribe({
      next: () => this.load(),
      error: (error) => console.error('Failed to delete quote', error),
    });
  }

  exportCsv(): void {
    this.quotesApi.exportCsv({ search: this.search || undefined, status: this.status }).subscribe({
      next: (blob) => this.download(blob, 'quotes.csv'),
      error: (error) => console.error('Failed to export quotes', error),
    });
  }

  private download(blob: Blob, filename: string): void {
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = filename;
    anchor.click();
    URL.revokeObjectURL(url);
  }
}
