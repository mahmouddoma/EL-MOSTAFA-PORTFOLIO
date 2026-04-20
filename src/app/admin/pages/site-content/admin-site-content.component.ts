import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  EditableLocale,
  MockSiteContentService,
} from '../../../core/services/mock-site-content.service';

interface EditableField {
  nodeId: string;
  label: string;
  multiline?: boolean;
  localized?: boolean;
}

interface EditableGroup {
  title: string;
  description: string;
  fields: EditableField[];
}

@Component({
  selector: 'app-admin-site-content',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <section class="page">
      <div class="page-head">
        <div>
          <h2>Site Content</h2>
          <p>Edit the main portfolio copy with fake local persistence for now.</p>
        </div>
        <div class="toolbar">
          <button type="button" class="ghost" (click)="setLocale('en')" [class.active]="locale() === 'en'">
            EN
          </button>
          <button type="button" class="ghost" (click)="setLocale('ar')" [class.active]="locale() === 'ar'">
            AR
          </button>
          <button type="button" class="primary" (click)="saveChanges()">Save Changes</button>
        </div>
      </div>

      <div class="notice">{{ notice() }}</div>

      <div class="group-grid">
        <article class="group-card" *ngFor="let group of groups">
          <div class="group-head">
            <h3>{{ group.title }}</h3>
            <p>{{ group.description }}</p>
          </div>

          <div class="field-grid">
            <label class="field" *ngFor="let field of group.fields">
              <span>{{ field.label }}</span>
              <textarea
                *ngIf="field.multiline; else singleLineInput"
                [(ngModel)]="draft[field.nodeId]"
                rows="4"
              ></textarea>
              <ng-template #singleLineInput>
                <input [(ngModel)]="draft[field.nodeId]" type="text" />
              </ng-template>
            </label>
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
        align-items: flex-start;
        gap: 18px;
      }

      h2,
      h3,
      p {
        margin: 0;
      }

      .page-head p,
      .group-head p {
        color: rgba(255, 255, 255, 0.56);
      }

      .toolbar {
        display: flex;
        align-items: center;
        gap: 10px;
      }

      button {
        border: none;
        border-radius: 14px;
        padding: 12px 16px;
        cursor: pointer;
        font-weight: 700;
      }

      .ghost {
        background: rgba(255, 255, 255, 0.05);
        color: rgba(255, 255, 255, 0.7);
      }

      .ghost.active {
        background: rgba(201, 169, 97, 0.18);
        color: #f2ddb0;
      }

      .primary {
        background: linear-gradient(135deg, #d7b970, #a37a36);
        color: #101010;
      }

      .notice {
        min-height: 24px;
        color: #d7b970;
      }

      .group-grid {
        display: grid;
        gap: 18px;
      }

      .group-card {
        border-radius: 22px;
        border: 1px solid rgba(255, 255, 255, 0.08);
        background: rgba(18, 18, 18, 0.86);
        padding: 22px;
      }

      .group-head {
        margin-bottom: 18px;
      }

      .field-grid {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 14px;
      }

      .field {
        display: grid;
        gap: 8px;
      }

      .field span {
        color: rgba(255, 255, 255, 0.72);
        font-size: 0.92rem;
      }

      input,
      textarea {
        width: 100%;
        border-radius: 16px;
        border: 1px solid rgba(255, 255, 255, 0.08);
        background: rgba(255, 255, 255, 0.04);
        color: #fff;
        padding: 14px 16px;
        font: inherit;
        resize: vertical;
      }

      @media (max-width: 960px) {
        .page-head,
        .field-grid {
          grid-template-columns: 1fr;
          display: grid;
        }

        .toolbar {
          justify-content: flex-start;
          flex-wrap: wrap;
        }
      }
    `,
  ],
})
export class AdminSiteContentComponent implements OnInit {
  readonly locale = signal<EditableLocale>('en');
  readonly notice = signal('Editing local fake content. Save writes to localStorage.');

  readonly groups: EditableGroup[] = [
    {
      title: 'Navbar',
      description: 'Top navigation labels shown on the public portfolio.',
      fields: [
        { nodeId: 'navbar.about', label: 'About Label' },
        { nodeId: 'navbar.products', label: 'Products Label' },
        { nodeId: 'navbar.origins', label: 'Origins Label' },
        { nodeId: 'navbar.contact', label: 'Contact Label' },
      ],
    },
    {
      title: 'Hero',
      description: 'Main hero copy shown in the first fold.',
      fields: [
        { nodeId: 'hero.eyebrow', label: 'Eyebrow' },
        { nodeId: 'hero.title', label: 'Title' },
        { nodeId: 'hero.subtitle', label: 'Subtitle', multiline: true },
        { nodeId: 'hero.cta', label: 'CTA Label' },
      ],
    },
    {
      title: 'Footer / Contact',
      description: 'Editable contact information and footer brand copy.',
      fields: [
        { nodeId: 'footer.brandText', label: 'Brand Text', localized: false },
        { nodeId: 'footer.description', label: 'Description', multiline: true },
        { nodeId: 'footer.address', label: 'Address' },
        { nodeId: 'footer.email', label: 'Email', localized: false },
        { nodeId: 'footer.phone', label: 'Phone', localized: false },
      ],
    },
  ];

  draft: Record<string, string> = {};

  constructor(private readonly content: MockSiteContentService) {}

  ngOnInit(): void {
    this.loadDraft();
  }

  setLocale(locale: EditableLocale): void {
    this.locale.set(locale);
    this.loadDraft();
  }

  saveChanges(): void {
    for (const group of this.groups) {
      for (const field of group.fields) {
        const value = this.draft[field.nodeId] ?? '';
        const locale = field.localized === false ? 'en' : this.locale();
        this.content.setValue(field.nodeId, locale, value);
      }
    }

    this.notice.set(`Saved ${this.locale().toUpperCase()} content locally. Public preview updates immediately.`);
  }

  private loadDraft(): void {
    const nextDraft: Record<string, string> = {};

    for (const group of this.groups) {
      for (const field of group.fields) {
        const locale = field.localized === false ? 'en' : this.locale();
        nextDraft[field.nodeId] = this.content.getValue(field.nodeId, locale);
      }
    }

    this.draft = nextDraft;
  }
}
