import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  EditableLocale,
  SiteContentService,
} from '../../../core/services/site-content.service';
import {
  EditorValueScope,
  EditorValueType,
  VisualEditorService,
} from '../../../core/services/visual-editor.service';
import { LanguageService } from '../../../core/services/language.service';

interface EditableField {
  nodeId: string;
  label: string;
  multiline?: boolean;
  localized?: boolean;
  mode: 'site-content' | 'visual-override';
  translationPath?: string;
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
          <span class="eyebrow">Copy Studio</span>
          <h2>Portfolio Content Management</h2>
          <p>Edit public copy across the hero, story, showcase, trust, and footer sections.</p>
        </div>

        <div class="toolbar">
          <button
            type="button"
            class="ghost"
            (click)="setLocale('en')"
            [class.active]="locale() === 'en'"
          >
            EN
          </button>
          <button
            type="button"
            class="ghost"
            (click)="setLocale('ar')"
            [class.active]="locale() === 'ar'"
          >
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
      .group-head p,
      .notice,
      .field span {
        color: var(--text-secondary);
      }

      .toolbar {
        display: flex;
        align-items: center;
        gap: 10px;
        flex-wrap: wrap;
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

      .ghost {
        background: var(--bg-surface);
        border: 1px solid var(--border-color);
        color: var(--text-secondary);
      }

      .ghost:hover {
        color: var(--text-primary);
        border-color: rgba(245, 124, 0, 0.35);
      }

      .ghost.active {
        background: rgba(245, 124, 0, 0.12);
        border-color: rgba(245, 124, 0, 0.35);
        color: var(--color-primary);
      }

      .primary {
        color: #fff;
        background: linear-gradient(135deg, var(--color-primary), var(--color-accent));
      }

      .primary:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 18px rgba(245, 124, 0, 0.35);
      }

      .notice {
        min-height: 24px;
      }

      .group-grid {
        display: grid;
        gap: 18px;
      }

      .group-card {
        border-radius: 26px;
        border: 1px solid var(--border-color);
        background: var(--card-bg);
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
        transition:
          background 0.4s ease,
          border-color 0.4s ease;
        padding: 22px;
      }

      .group-head {
        margin-bottom: 18px;
      }

      .group-head h3 {
        color: var(--text-primary);
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
        font-size: 0.85rem;
        font-weight: 600;
      }

      input,
      textarea {
        width: 100%;
        border-radius: 16px;
        border: 1px solid var(--border-color);
        background: var(--bg-surface);
        color: var(--text-primary);
        padding: 14px 16px;
        font: inherit;
        resize: vertical;
        transition:
          border-color 0.25s ease,
          background 0.4s ease;
      }

      input:focus,
      textarea:focus {
        outline: none;
        border-color: rgba(245, 124, 0, 0.5);
        background: var(--card-bg);
      }

      @media (max-width: 960px) {
        .page-head,
        .field-grid {
          display: grid;
          grid-template-columns: 1fr;
        }
      }
    `,
  ],
})
export class AdminSiteContentComponent implements OnInit {
  readonly locale = signal<EditableLocale>('en');
  readonly notice = signal(
    'Content edits save locally and feed either the public copy store or the visual override layer.',
  );

  readonly groups: EditableGroup[] = [
    {
      title: 'Navigation And Hero',
      description: 'Top navigation labels and first-fold portfolio messaging.',
      fields: [
        { nodeId: 'navbar.about', label: 'About Label', mode: 'site-content' },
        { nodeId: 'navbar.products', label: 'Showcase Label', mode: 'site-content' },
        { nodeId: 'navbar.origins', label: 'Origins Label', mode: 'site-content' },
        { nodeId: 'navbar.contact', label: 'Contact Label', mode: 'site-content' },
        { nodeId: 'hero.eyebrow', label: 'Hero Eyebrow', mode: 'site-content' },
        { nodeId: 'hero.title', label: 'Hero Title', mode: 'site-content' },
        {
          nodeId: 'hero.subtitle',
          label: 'Hero Subtitle',
          mode: 'site-content',
          multiline: true,
        },
        { nodeId: 'hero.cta', label: 'Hero CTA', mode: 'site-content' },
      ],
    },
    {
      title: 'Story Timeline',
      description: 'Narrative copy for the journey section and its three nodes.',
      fields: [
        {
          nodeId: 'about.eyebrow',
          label: 'Story Eyebrow',
          mode: 'visual-override',
          translationPath: 'hero.story',
        },
        {
          nodeId: 'about.title',
          label: 'Story Title',
          mode: 'visual-override',
          translationPath: 'hero.journey',
        },
        {
          nodeId: 'about.subtitle',
          label: 'Story Subtitle',
          mode: 'visual-override',
          translationPath: 'hero.scroll',
        },
        {
          nodeId: 'about.node1.title',
          label: 'Story Node 1 Title',
          mode: 'visual-override',
          translationPath: 'about.nodes.0.title',
        },
        {
          nodeId: 'about.node1.desc',
          label: 'Story Node 1 Description',
          mode: 'visual-override',
          translationPath: 'about.nodes.0.desc',
          multiline: true,
        },
        {
          nodeId: 'about.node2.title',
          label: 'Story Node 2 Title',
          mode: 'visual-override',
          translationPath: 'about.nodes.1.title',
        },
        {
          nodeId: 'about.node2.desc',
          label: 'Story Node 2 Description',
          mode: 'visual-override',
          translationPath: 'about.nodes.1.desc',
          multiline: true,
        },
        {
          nodeId: 'about.node3.title',
          label: 'Story Node 3 Title',
          mode: 'visual-override',
          translationPath: 'about.nodes.2.title',
        },
        {
          nodeId: 'about.node3.desc',
          label: 'Story Node 3 Description',
          mode: 'visual-override',
          translationPath: 'about.nodes.2.desc',
          multiline: true,
        },
      ],
    },
    {
      title: 'Section Headlines',
      description: 'Headings and subtitles for the showcase, origins, and trust sections.',
      fields: [
        {
          nodeId: 'products.eyebrow',
          label: 'Showcase Eyebrow',
          mode: 'visual-override',
          translationPath: 'products.eyebrow',
        },
        {
          nodeId: 'products.title',
          label: 'Showcase Title',
          mode: 'visual-override',
          translationPath: 'products.title',
        },
        {
          nodeId: 'products.subtitle',
          label: 'Showcase Subtitle',
          mode: 'visual-override',
          translationPath: 'products.subtitle',
          multiline: true,
        },
        {
          nodeId: 'origins.eyebrow',
          label: 'Origins Eyebrow',
          mode: 'visual-override',
          translationPath: 'origins.eyebrow',
        },
        {
          nodeId: 'origins.title',
          label: 'Origins Title',
          mode: 'visual-override',
          translationPath: 'origins.title',
        },
        {
          nodeId: 'origins.subtitle',
          label: 'Origins Subtitle',
          mode: 'visual-override',
          translationPath: 'origins.subtitle',
          multiline: true,
        },
        {
          nodeId: 'whyUs.eyebrow',
          label: 'Why Us Eyebrow',
          mode: 'visual-override',
          translationPath: 'whyUs.eyebrow',
        },
        {
          nodeId: 'whyUs.title',
          label: 'Why Us Title',
          mode: 'visual-override',
          translationPath: 'whyUs.title',
        },
        {
          nodeId: 'whyUs.subtitle',
          label: 'Why Us Subtitle',
          mode: 'visual-override',
          translationPath: 'whyUs.subtitle',
          multiline: true,
        },
      ],
    },
    {
      title: 'Footer And Contact',
      description: 'Brand text and contact details displayed at the bottom of the page.',
      fields: [
        { nodeId: 'footer.brandText', label: 'Brand Text', localized: false, mode: 'site-content' },
        {
          nodeId: 'footer.description',
          label: 'Footer Description',
          mode: 'site-content',
          multiline: true,
        },
        { nodeId: 'footer.address', label: 'Address', mode: 'site-content' },
        { nodeId: 'footer.email', label: 'Email', localized: false, mode: 'site-content' },
        { nodeId: 'footer.phone', label: 'Phone', localized: false, mode: 'site-content' },
      ],
    },
  ];

  draft: Record<string, string> = {};

  constructor(
    private readonly content: SiteContentService,
    private readonly visualEditor: VisualEditorService,
    private readonly language: LanguageService,
  ) {}

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

        if (field.mode === 'site-content') {
          const locale = field.localized === false ? 'en' : this.locale();
          this.content.setValue(field.nodeId, locale, value);
          continue;
        }

        this.visualEditor.saveOverride(
          field.nodeId,
          value,
          this.getOverrideType(field),
          this.getOverrideScope(field),
        );
      }
    }

    this.notice.set(
      `Saved ${this.locale().toUpperCase()} portfolio copy. Public preview reads the updates immediately.`,
    );
  }

  private loadDraft(): void {
    const nextDraft: Record<string, string> = {};

    for (const group of this.groups) {
      for (const field of group.fields) {
        if (field.mode === 'site-content') {
          const locale = field.localized === false ? 'en' : this.locale();
          nextDraft[field.nodeId] = this.content.getValue(field.nodeId, locale);
          continue;
        }

        nextDraft[field.nodeId] = this.getVisualOverrideValue(field);
      }
    }

    this.draft = nextDraft;
  }

  private getVisualOverrideValue(field: EditableField): string {
    const overrides = this.visualEditor.overrides();
    const key = `${this.getOverrideScope(field)}::${field.nodeId}`;
    const override = overrides[key];

    if (override) {
      return override.value;
    }

    if (field.translationPath) {
      return this.language.translateFor(this.locale(), field.translationPath);
    }

    return '';
  }

  private getOverrideScope(field: EditableField): EditorValueScope {
    return field.localized === false ? 'global' : this.locale();
  }

  private getOverrideType(field: EditableField): EditorValueType {
    return field.multiline ? 'textarea' : 'text';
  }
}
