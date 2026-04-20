import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MockAdminDataService } from '../../core/services/mock-admin-data.service';

@Component({
  selector: 'app-admin-messages',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="page">
      <div>
        <h2>Messages</h2>
        <p>Customer messages mock list.</p>
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
          <div class="date">{{ message.date }}</div>
        </article>
      </div>
    </section>
  `,
  styles: [
    `
      .page {
        display: grid;
        gap: 18px;
      }

      .message-grid {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 16px;
      }

      .message-card {
        border-radius: 22px;
        border: 1px solid rgba(255, 255, 255, 0.08);
        background: rgba(18, 18, 18, 0.86);
        padding: 20px;
      }

      .message-top {
        display: flex;
        justify-content: space-between;
        gap: 14px;
      }

      h3 {
        margin: 0 0 4px;
      }

      span,
      .date {
        color: rgba(255, 255, 255, 0.56);
      }

      .status {
        color: #d7b970;
      }

      .subject {
        margin: 18px 0 10px;
      }

      @media (max-width: 960px) {
        .message-grid {
          grid-template-columns: 1fr;
        }
      }
    `,
  ],
})
export class AdminMessagesComponent {
  readonly data = inject(MockAdminDataService);
}
