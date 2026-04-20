import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MockAdminDataService } from '../../core/services/mock-admin-data.service';

@Component({
  selector: 'app-admin-messages',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="page">
      <div class="page-head">
        <div>
          <span class="eyebrow">Inbox</span>
          <h2>Portfolio Messages</h2>
          <p>Contact and collaboration messages sent from visitors reviewing the portfolio.</p>
        </div>
      </div>

      <div class="message-grid">
        <article class="message-card" *ngFor="let message of data.messages">
          <div class="message-top">
            <div>
              <h3>{{ message.name }}</h3>
              <span>{{ message.email }}</span>
            </div>
            <span class="status">{{ message.status }}</span>
          </div>

          <p class="subject">{{ message.subject }}</p>
          <p class="summary">{{ message.summary }}</p>

          <div class="message-footer">
            <span>{{ message.date }}</span>
            <button type="button">Open Thread</button>
          </div>
        </article>
      </div>
    </section>
  `,
  styles: [
    `
      .page { display: grid; gap: 18px; }

      .eyebrow {
        display: inline-block;
        margin-bottom: 10px;
        color: var(--color-primary);
        text-transform: uppercase;
        letter-spacing: 0.18em;
        font-size: 0.8rem;
        font-weight: 800;
      }

      h2, h3, p { margin: 0; }

      h2 { color: var(--text-primary); }

      .page-head p,
      .message-top span,
      .summary,
      .message-footer span {
        color: var(--text-secondary);
      }

      .message-grid {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 16px;
      }

      .message-card {
        display: grid;
        gap: 14px;
        padding: 22px;
        border-radius: 26px;
        border: 1px solid var(--border-color);
        background: var(--card-bg);
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
        transition: background 0.4s ease, border-color 0.4s ease;
      }

      .message-card:hover {
        border-color: rgba(245, 124, 0, 0.25);
      }

      .message-top, .message-footer {
        display: flex;
        justify-content: space-between;
        gap: 14px;
        align-items: flex-start;
      }

      .message-top h3 { color: var(--text-primary); }

      .status {
        padding: 6px 12px;
        border-radius: 999px;
        background: rgba(245, 124, 0, 0.12);
        color: var(--color-primary);
        font-size: 0.82rem;
        font-weight: 700;
        white-space: nowrap;
      }

      .subject {
        font-size: 1.05rem;
        font-weight: 700;
        color: var(--text-primary);
      }

      .summary { line-height: 1.7; }

      button {
        border: none;
        border-radius: 16px;
        padding: 10px 14px;
        cursor: pointer;
        font: inherit;
        font-weight: 700;
        color: var(--text-secondary);
        background: var(--bg-surface);
        border: 1px solid var(--border-color);
        transition: all 0.25s ease;
      }

      button:hover {
        color: var(--text-primary);
        border-color: rgba(245, 124, 0, 0.35);
      }

      @media (max-width: 960px) {
        .message-grid { grid-template-columns: 1fr; }
      }
    `,
  ],
})
export class AdminMessagesComponent {
  readonly data = inject(MockAdminDataService);
}
