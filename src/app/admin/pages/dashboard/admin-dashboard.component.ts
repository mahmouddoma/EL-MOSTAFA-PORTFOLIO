import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MockAdminDataService } from '../../core/services/mock-admin-data.service';
import { PortfolioProductsApiService } from '../../../core/services/portfolio-products-api.service';
import { OriginsApiService } from '../../../core/services/origins-api.service';
import { MessagesApiService } from '../../../core/services/messages-api.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <section class="page-grid">
      <div class="hero-card">
        <div>
          <span class="eyebrow">Portfolio Dashboard</span>
          <h2>Manage the public experience without any sales flow.</h2>
          <p>
            Every tool here maps to visible portfolio sections, portfolio showcase cards, sourcing
            coverage, and inbound contact messages.
          </p>
        </div>
        <div class="hero-actions">
          <a routerLink="/admin/site-content" class="primary-action">Edit Copy</a>
          <a routerLink="/admin/visual-editor" class="secondary-action">Open Visual Editor</a>
        </div>
      </div>

      <div class="stats-grid">
        <article class="stat-card">
          <span>Live Showcase Items</span>
          <strong>{{ liveShowcaseCount() }}</strong>
          <small>{{ totalProducts() }} total cards in the portfolio grid</small>
        </article>
        <article class="stat-card">
          <span>Managed Origins</span>
          <strong>{{ originCount() }}</strong>
          <small>Sourcing origins visible inside the public network section</small>
        </article>
        <article class="stat-card">
          <span>Public Sections</span>
          <strong>{{ data.sections.length }}</strong>
          <small>Hero, story, showcase, origins, trust pillars, and footer</small>
        </article>
        <article class="stat-card">
          <span>Unread Messages</span>
          <strong>{{ unreadMessages() }}</strong>
          <small>Portfolio inquiries waiting for review</small>
        </article>
      </div>

      <div class="panel-grid">
        <section class="panel">
          <div class="panel-head">
            <div>
              <h3>Managed Public Sections</h3>
              <p>Direct links to the exact areas currently visible on the portfolio.</p>
            </div>
            <a routerLink="/admin/sections">View All</a>
          </div>

          <div class="section-list">
            <article class="section-row" *ngFor="let section of data.sections">
              <div>
                <div class="row-title">{{ section.title }}</div>
                <div class="row-meta">{{ section.anchor }} · {{ section.description }}</div>
              </div>
              <div class="row-badges">
                <span class="badge">{{ section.type }}</span>
                <span class="badge status">{{ section.status }}</span>
              </div>
            </article>
          </div>
        </section>

        <section class="panel">
          <div class="panel-head">
            <div>
              <h3>Quick Actions</h3>
              <p>Shortcuts for the most common portfolio admin tasks.</p>
            </div>
          </div>

          <div class="actions">
            <a class="action-card" routerLink="/admin/products">
              <strong>Showcase Library</strong>
              <span>Manage the featured collection cards.</span>
            </a>
            <a class="action-card" routerLink="/admin/origins">
              <strong>Origins Coverage</strong>
              <span>Review countries and item coverage.</span>
            </a>
            <a class="action-card" routerLink="/admin/site-content">
              <strong>Copy Studio</strong>
              <span>Edit headlines, labels, and footer content.</span>
            </a>
            <a class="action-card" routerLink="/admin/messages">
              <strong>Inbox</strong>
              <span>Track collaboration and contact requests.</span>
            </a>
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

      /* ── Shared card shell ──────────────────────────────────── */
      .hero-card,
      .stat-card,
      .panel {
        border-radius: 28px;
        border: 1px solid var(--border-color);
        background: var(--card-bg);
        box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
        transition: background 0.4s ease, border-color 0.4s ease;
      }

      /* ── Hero card ─────────────────────────────────────────── */
      .hero-card {
        display: grid;
        grid-template-columns: minmax(0, 1.4fr) auto;
        gap: 24px;
        padding: 28px;
        background:
          radial-gradient(circle at top right, rgba(245, 124, 0, 0.10), transparent 35%),
          var(--card-bg);
      }

      .eyebrow {
        display: inline-block;
        margin-bottom: 12px;
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

      h2 {
        font-family: var(--font-display);
        font-size: clamp(1.8rem, 3vw, 2.8rem);
        line-height: 1.1;
        color: var(--text-primary);
      }

      .hero-card p,
      .panel-head p,
      .row-meta,
      .stat-card small {
        color: var(--text-secondary);
      }

      .hero-card p {
        margin-top: 12px;
        max-width: 680px;
        line-height: 1.7;
      }

      .hero-actions {
        display: grid;
        gap: 12px;
        align-content: center;
      }

      .hero-actions a {
        min-width: 190px;
        text-align: center;
        padding: 14px 18px;
        border-radius: 18px;
        text-decoration: none;
        font-weight: 700;
        transition: all 0.3s ease;
      }

      .primary-action {
        color: #fff;
        background: linear-gradient(135deg, var(--color-primary), var(--color-accent));
      }

      .primary-action:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 20px rgba(245, 124, 0, 0.35);
      }

      .secondary-action {
        color: var(--text-primary);
        border: 1px solid var(--border-color);
        background: var(--bg-surface);
      }

      .secondary-action:hover {
        border-color: rgba(245, 124, 0, 0.4);
        background: rgba(245, 124, 0, 0.06);
      }

      /* ── Stats grid ────────────────────────────────────────── */
      .stats-grid {
        display: grid;
        grid-template-columns: repeat(4, minmax(0, 1fr));
        gap: 16px;
      }

      .stat-card {
        padding: 20px;
      }

      .stat-card span {
        display: block;
        color: var(--text-secondary);
        font-size: 0.9rem;
        margin-bottom: 12px;
      }

      .stat-card strong {
        display: block;
        margin-bottom: 8px;
        font-size: clamp(1.8rem, 4vw, 2.5rem);
        color: var(--text-primary);
      }

      /* ── Panel grid ────────────────────────────────────────── */
      .panel-grid {
        display: grid;
        grid-template-columns: minmax(0, 1.3fr) minmax(320px, 0.9fr);
        gap: 18px;
      }

      .panel {
        padding: 22px;
      }

      .panel-head {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 16px;
        margin-bottom: 18px;
      }

      .panel-head h3 {
        color: var(--text-primary);
        font-size: 1.05rem;
      }

      .panel-head a {
        color: var(--color-primary);
        text-decoration: none;
        font-weight: 700;
        white-space: nowrap;
      }

      .section-list,
      .actions {
        display: grid;
        gap: 12px;
      }

      /* ── Row / action inner cards ─────────────────────────── */
      .section-row,
      .action-card {
        border-radius: 20px;
        border: 1px solid var(--border-color);
        background: var(--bg-surface);
        transition:
          transform 0.25s ease,
          border-color 0.25s ease,
          background 0.4s ease;
      }

      .section-row {
        display: flex;
        justify-content: space-between;
        gap: 14px;
        padding: 16px 18px;
      }

      .row-title {
        font-weight: 700;
        margin-bottom: 6px;
        color: var(--text-primary);
      }

      .row-badges {
        display: flex;
        gap: 8px;
        align-items: flex-start;
        flex-wrap: wrap;
      }

      .badge {
        padding: 5px 10px;
        border-radius: 999px;
        background: var(--border-color);
        color: var(--text-secondary);
        font-size: 0.78rem;
        font-weight: 600;
      }

      .badge.status {
        background: rgba(245, 124, 0, 0.12);
        color: var(--color-primary);
      }

      .action-card {
        display: grid;
        gap: 6px;
        padding: 18px;
        color: inherit;
        text-decoration: none;
      }

      .action-card:hover {
        transform: translateY(-2px);
        border-color: rgba(245, 124, 0, 0.35);
        background: rgba(245, 124, 0, 0.04);
      }

      .action-card strong {
        color: var(--text-primary);
      }

      .action-card span {
        color: var(--text-secondary);
        font-size: 0.88rem;
      }

      @media (max-width: 1180px) {
        .stats-grid,
        .panel-grid,
        .hero-card {
          grid-template-columns: 1fr;
        }
      }

      @media (max-width: 600px) {
        .stats-grid {
          grid-template-columns: repeat(2, 1fr);
        }
      }
    `,
  ],
})
export class AdminDashboardComponent implements OnInit {
  readonly data = inject(MockAdminDataService);
  private readonly productsApi = inject(PortfolioProductsApiService);
  private readonly originsApi = inject(OriginsApiService);
  private readonly messagesApi = inject(MessagesApiService);

  readonly liveShowcaseCount = signal(0);
  readonly totalProducts = signal(0);
  readonly originCount = signal(0);
  readonly unreadMessages = signal(0);

  ngOnInit(): void {
    this.refreshStats();
  }

  refreshStats(): void {
    forkJoin({
      products: this.productsApi.getProducts(),
      origins: this.originsApi.getOrigins(),
      messages: this.messagesApi.getMessages(),
    }).subscribe({
      next: (res) => {
        this.totalProducts.set(res.products.length);
        this.liveShowcaseCount.set(res.products.filter(p => p.status === 'Live').length);
        this.originCount.set(res.origins.length);
        this.unreadMessages.set(res.messages.filter(m => m.status === 'New').length);
      },
      error: () => {
        // Fallback or error handling
      }
    });
  }
}
