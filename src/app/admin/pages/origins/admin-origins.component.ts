import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OriginsApiService } from '../../../core/services/origins-api.service';
import { OriginApi } from '../../../core/models/origin-api.model';

@Component({
  selector: 'app-admin-origins',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="page">
      <div class="page-head">
        <div>
          <span class="eyebrow">Origins Management</span>
          <h2>Public Origins Network</h2>
          <p>Control the countries and sourcing coverage displayed in the portfolio.</p>
        </div>
        <button type="button">+ Add Origin</button>
      </div>

      <div *ngIf="loading()" class="loading-state">
        <p>Loading origins...</p>
      </div>

      <div *ngIf="!loading() && origins().length === 0" class="empty-state">
        <p>No origins found in the network.</p>
      </div>

      <div class="origin-grid" *ngIf="!loading() && origins().length > 0">
        <article class="origin-card" *ngFor="let origin of origins()">
          <div class="origin-top">
            <div class="flag">{{ origin.flag }}</div>
            <div>
              <h3>{{ origin.country }}</h3>
              <p>{{ origin.focus }}</p>
            </div>
          </div>

          <div class="stats">
            <div>
              <strong>{{ origin.featuredItems }}</strong>
              <span>Featured items</span>
            </div>
            <div>
              <strong>{{ origin.status }}</strong>
              <span>Visibility status</span>
            </div>
          </div>

          <div class="actions">
            <button type="button" class="secondary">Edit Coverage</button>
            <button type="button" class="secondary">Sync Cards</button>
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
      .origin-top p,
      .stats span,
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

      button {
        border: none;
        border-radius: 16px;
        padding: 12px 16px;
        cursor: pointer;
        font: inherit;
        font-weight: 700;
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

      .origin-grid {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 18px;
      }

      .origin-card {
        display: grid;
        gap: 18px;
        padding: 22px;
        border-radius: 26px;
        border: 1px solid var(--border-color);
        background: var(--card-bg);
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
        transition:
          background 0.4s ease,
          border-color 0.4s ease;
      }

      .origin-top {
        display: flex;
        gap: 16px;
        align-items: flex-start;
      }

      .origin-top h3 {
        color: var(--text-primary);
      }

      .flag {
        width: 52px;
        height: 52px;
        display: grid;
        place-items: center;
        border-radius: 16px;
        background: rgba(245, 124, 0, 0.12);
        color: var(--color-primary);
        font-weight: 800;
        letter-spacing: 0.08em;
        flex-shrink: 0;
      }

      .stats {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 12px;
      }

      .stats div {
        padding: 16px;
        border-radius: 18px;
        background: var(--bg-surface);
        border: 1px solid var(--border-color);
      }

      .stats strong {
        display: block;
        margin-bottom: 6px;
        color: var(--text-primary);
      }

      .actions {
        display: flex;
        gap: 10px;
        flex-wrap: wrap;
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
        .origin-grid {
          grid-template-columns: 1fr;
        }
      }

      @media (max-width: 720px) {
        .page-head {
          display: grid;
        }
      }
    `,
  ],
})
export class AdminOriginsComponent implements OnInit {
  private readonly originsApi = inject(OriginsApiService);

  readonly origins = signal<OriginApi[]>([]);
  readonly loading = signal(true);

  ngOnInit(): void {
    this.loadOrigins();
  }

  loadOrigins(): void {
    this.loading.set(true);
    this.originsApi.getOrigins().subscribe({
      next: (data) => {
        this.origins.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      }
    });
  }
}
