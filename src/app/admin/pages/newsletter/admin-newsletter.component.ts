import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NewsletterSubscriber } from '../../../core/models/newsletter.model';
import { NewsletterApiService } from '../../../core/services/newsletter-api.service';

@Component({
  selector: 'app-admin-newsletter',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <section class="page">
      <div class="page-head">
        <div>
          <span class="eyebrow">Newsletter</span>
          <h2>Subscribers</h2>
        </div>
        <button type="button" (click)="exportCsv()">Export CSV</button>
      </div>

      <div class="filters">
        <input [(ngModel)]="search" placeholder="Search email" />
        <select [(ngModel)]="isConfirmed">
          <option [ngValue]="undefined">Any confirmation</option>
          <option [ngValue]="true">Confirmed</option>
          <option [ngValue]="false">Unconfirmed</option>
        </select>
        <select [(ngModel)]="isUnsubscribed">
          <option [ngValue]="undefined">Any subscription</option>
          <option [ngValue]="false">Subscribed</option>
          <option [ngValue]="true">Unsubscribed</option>
        </select>
        <button type="button" (click)="load()">Apply</button>
      </div>

      <div class="panel">
        <article class="row" *ngFor="let subscriber of subscribers()">
          <div>
            <strong>{{ subscriber.email }}</strong>
            <small>
              {{ subscriber.locale }} ·
              {{ subscriber.isConfirmed ? 'Confirmed' : 'Pending' }} ·
              {{ subscriber.unsubscribedAt ? 'Unsubscribed' : 'Active' }}
            </small>
          </div>
          <button type="button" class="danger" (click)="remove(subscriber.id)">Delete</button>
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
      .row {
        display: flex;
        gap: 10px;
        flex-wrap: wrap;
      }

      .page-head,
      .row {
        justify-content: space-between;
        align-items: center;
      }

      .eyebrow {
        color: var(--color-primary);
        font-size: 0.78rem;
        font-weight: 800;
        text-transform: uppercase;
      }

      h2,
      small {
        margin: 0;
      }

      h2,
      strong {
        color: var(--text-primary);
      }

      small {
        color: var(--text-secondary);
      }

      .panel {
        border: 1px solid var(--border-color);
        background: var(--card-bg);
        border-radius: 8px;
        padding: 18px;
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
export class AdminNewsletterComponent implements OnInit {
  private readonly newsletterApi = inject(NewsletterApiService);

  readonly subscribers = signal<NewsletterSubscriber[]>([]);
  search = '';
  isConfirmed?: boolean;
  isUnsubscribed?: boolean;

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.newsletterApi
      .getSubscribers({
        search: this.search || undefined,
        isConfirmed: this.isConfirmed,
        isUnsubscribed: this.isUnsubscribed,
        page: 1,
        pageSize: 100,
      })
      .subscribe({
        next: (response) => this.subscribers.set(response.items ?? []),
        error: (error) => console.error('Failed to load subscribers', error),
      });
  }

  remove(id: number): void {
    if (!confirm('Delete this subscriber?')) {
      return;
    }

    this.newsletterApi.deleteSubscriber(id).subscribe({
      next: () => this.load(),
      error: (error) => console.error('Failed to delete subscriber', error),
    });
  }

  exportCsv(): void {
    this.newsletterApi
      .exportCsv({
        search: this.search || undefined,
        isConfirmed: this.isConfirmed,
        isUnsubscribed: this.isUnsubscribed,
      })
      .subscribe({
        next: (blob) => this.download(blob, 'newsletter.csv'),
        error: (error) => console.error('Failed to export newsletter', error),
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
