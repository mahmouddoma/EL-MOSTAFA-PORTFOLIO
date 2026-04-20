import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MockAdminDataService } from '../../core/services/mock-admin-data.service';

@Component({
  selector: 'app-admin-sections',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <section class="page">
      <div class="page-head">
        <div>
          <span class="eyebrow">Sections Overview</span>
          <h2>Manage Every Public Portfolio Section</h2>
          <p>Each card below maps directly to a visible section on the public homepage.</p>
        </div>
      </div>

      <div class="section-grid">
        <article class="section-card" *ngFor="let section of data.sections">
          <div class="section-top">
            <div>
              <h3>{{ section.title }}</h3>
              <p>{{ section.description }}</p>
            </div>
            <span class="status">{{ section.status }}</span>
          </div>

          <div class="meta-grid">
            <div>
              <span class="label">Anchor</span>
              <strong>{{ section.anchor }}</strong>
            </div>
            <div>
              <span class="label">Mode</span>
              <strong>{{ section.type }}</strong>
            </div>
            <div>
              <span class="label">Editable Fields</span>
              <strong>{{ section.editableFields }}</strong>
            </div>
          </div>

          <a class="edit-link" [routerLink]="section.editRoute">Open Management View</a>
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

      h2 {
        color: var(--text-primary);
      }

      .page-head p,
      .section-top p,
      .label {
        color: var(--text-secondary);
      }

      .section-grid {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 18px;
      }

      .section-card {
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

      .section-top {
        display: flex;
        justify-content: space-between;
        gap: 14px;
      }

      .section-top h3 {
        color: var(--text-primary);
      }

      .status {
        height: fit-content;
        padding: 6px 12px;
        border-radius: 999px;
        background: rgba(245, 124, 0, 0.12);
        color: var(--color-primary);
        font-size: 0.82rem;
        font-weight: 700;
        white-space: nowrap;
      }

      .meta-grid {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 12px;
      }

      .meta-grid div {
        padding: 14px 16px;
        border-radius: 18px;
        background: var(--bg-surface);
        border: 1px solid var(--border-color);
      }

      .meta-grid strong {
        color: var(--text-primary);
      }

      .label {
        display: block;
        margin-bottom: 8px;
        font-size: 0.82rem;
      }

      .edit-link {
        display: inline-flex;
        width: fit-content;
        padding: 12px 16px;
        border-radius: 16px;
        text-decoration: none;
        font-weight: 700;
        color: #fff;
        background: linear-gradient(135deg, var(--color-primary), var(--color-accent));
        transition: all 0.25s ease;
      }

      .edit-link:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 18px rgba(245, 124, 0, 0.35);
      }

      @media (max-width: 1180px) {
        .section-grid,
        .meta-grid {
          grid-template-columns: 1fr;
        }
      }
    `,
  ],
})
export class AdminSectionsComponent {
  readonly data = inject(MockAdminDataService);
}
