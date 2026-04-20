import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
  computed,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import {
  EditableLocale,
  MockSiteContentService,
} from '../../../core/services/mock-site-content.service';
import {
  EditorNodeMeta,
  MockVisualEditorService,
} from '../../../core/services/mock-visual-editor.service';

@Component({
  selector: 'app-admin-visual-editor',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <section class="editor-shell">
      <aside class="panel">
        <div class="panel-head">
          <div>
            <h2>Visual Editor</h2>
            <p>Click any highlighted node inside the live preview.</p>
          </div>
          <div class="locale-switch">
            <button type="button" [class.active]="locale() === 'en'" (click)="setLocale('en')">
              EN
            </button>
            <button type="button" [class.active]="locale() === 'ar'" (click)="setLocale('ar')">
              AR
            </button>
          </div>
        </div>

        <div class="node-list">
          <button
            type="button"
            class="node-chip"
            *ngFor="let node of nodes()"
            [class.active]="selectedNodeId() === node.nodeId"
            (click)="selectNode(node.nodeId)"
          >
            {{ node.label }}
          </button>
        </div>

        <div class="editor-card" *ngIf="selectedNodeId() as activeNode; else emptyState">
          <label>{{ selectedLabel() }}</label>
          <textarea
            *ngIf="selectedType() === 'textarea' || selectedType() === 'html'; else textInput"
            rows="6"
            [ngModel]="selectedValue()"
            (ngModelChange)="updateValue($event)"
          ></textarea>
          <ng-template #textInput>
            <input [ngModel]="selectedValue()" (ngModelChange)="updateValue($event)" />
          </ng-template>

          <button type="button" class="save-button" (click)="save()">Save Mock Draft</button>
          <p class="hint">
            Selected node: <strong>{{ activeNode }}</strong>
          </p>
        </div>

        <ng-template #emptyState>
          <div class="empty-card">
            Select a node from the list or click a highlighted node in the preview.
          </div>
        </ng-template>

        <div class="status">{{ status() }}</div>
      </aside>

      <div class="preview-card">
        <iframe
          #previewFrame
          class="preview-frame"
          [src]="previewUrl()"
          (load)="onPreviewLoad()"
        ></iframe>
      </div>
    </section>
  `,
  styles: [
    `
      .editor-shell {
        display: grid;
        grid-template-columns: 360px 1fr;
        gap: 18px;
        min-height: calc(100vh - 150px);
      }

      .panel,
      .preview-card {
        border-radius: 22px;
        border: 1px solid rgba(255, 255, 255, 0.08);
        background: rgba(18, 18, 18, 0.86);
      }

      .panel {
        padding: 18px;
        display: grid;
        align-content: start;
        gap: 16px;
      }

      .panel-head {
        display: flex;
        justify-content: space-between;
        gap: 14px;
      }

      h2,
      p {
        margin: 0;
      }

      .panel-head p,
      .hint,
      .status {
        color: rgba(255, 255, 255, 0.56);
      }

      .locale-switch,
      .node-list {
        display: flex;
        gap: 8px;
        flex-wrap: wrap;
      }

      .locale-switch button,
      .node-chip,
      .save-button {
        border: none;
        border-radius: 14px;
        padding: 10px 12px;
        cursor: pointer;
        font-weight: 700;
      }

      .locale-switch button,
      .node-chip {
        background: rgba(255, 255, 255, 0.05);
        color: rgba(255, 255, 255, 0.72);
      }

      .locale-switch button.active,
      .node-chip.active {
        background: rgba(201, 169, 97, 0.18);
        color: #f2ddb0;
      }

      .editor-card,
      .empty-card {
        border-radius: 18px;
        background: rgba(255, 255, 255, 0.03);
        border: 1px solid rgba(255, 255, 255, 0.08);
        padding: 16px;
      }

      label {
        display: block;
        margin-bottom: 8px;
      }

      input,
      textarea {
        width: 100%;
        border-radius: 14px;
        border: 1px solid rgba(255, 255, 255, 0.08);
        background: rgba(255, 255, 255, 0.04);
        color: #fff;
        padding: 12px 14px;
        font: inherit;
        resize: vertical;
      }

      .save-button {
        margin-top: 12px;
        background: linear-gradient(135deg, #d7b970, #a37a36);
        color: #101010;
      }

      .preview-card {
        overflow: hidden;
      }

      .preview-frame {
        width: 100%;
        height: 100%;
        min-height: calc(100vh - 150px);
        border: none;
        background: #fff;
      }

      @media (max-width: 1100px) {
        .editor-shell {
          grid-template-columns: 1fr;
        }

        .preview-frame {
          min-height: 720px;
        }
      }
    `,
  ],
})
export class AdminVisualEditorComponent implements OnInit, OnDestroy {
  private readonly sanitizer = inject(DomSanitizer);
  private readonly visualEditor = inject(MockVisualEditorService);
  private readonly siteContent = inject(MockSiteContentService);

  @ViewChild('previewFrame') previewFrame?: ElementRef<HTMLIFrameElement>;
  readonly locale = signal<EditableLocale>('en');
  readonly selectedNodeId = signal<string | null>(null);
  readonly selectedValue = signal('');
  readonly status = signal('Live preview writes to local mock storage.');
  readonly nodes = signal<EditorNodeMeta[]>([]);
  readonly previewNonce = signal(0);

  readonly activeNode = computed(
    () => this.nodes().find((node) => node.nodeId === this.selectedNodeId()) ?? null,
  );
  readonly selectedLabel = computed(() => this.activeNode()?.label ?? '');
  readonly selectedType = computed(() => this.activeNode()?.type ?? 'text');
  readonly previewUrl = computed<SafeResourceUrl>(() =>
    this.sanitizer.bypassSecurityTrustResourceUrl(
      `/?editor=true&locale=${this.locale()}&v=${this.previewNonce()}`,
    ),
  );

  private readonly messageHandler = (event: MessageEvent) => {
    if (event.origin !== window.location.origin || event.data?.type !== 'editor-node-selected') {
      return;
    }

    const { nodeId, value } = event.data.payload || {};

    if (!nodeId) {
      return;
    }

    this.selectNode(nodeId, value);
  };

  constructor() {}

  ngOnInit(): void {
    this.previewNonce.set(Date.now());
    window.addEventListener('message', this.messageHandler);
  }

  ngOnDestroy(): void {
    window.removeEventListener('message', this.messageHandler);
  }

  setLocale(locale: EditableLocale): void {
    this.locale.set(locale);
    this.previewNonce.set(Date.now());
    this.status.set(`Reloaded preview in ${locale.toUpperCase()} mode.`);
  }

  selectNode(nodeId: string, providedValue?: string): void {
    this.selectedNodeId.set(nodeId);

    // Prioritize MockSiteContentService for known nodes
    if (this.isMockSiteContentNode(nodeId)) {
      this.selectedValue.set(this.siteContent.getValue(nodeId, this.locale()));
    } else if (providedValue !== undefined) {
      this.selectedValue.set(providedValue);
    } else {
      this.selectedValue.set(this.readNodeValue(nodeId));
    }

    this.highlightSelectedNode(nodeId);
  }

  updateValue(value: string): void {
    const activeNode = this.activeNode();

    if (!activeNode) {
      return;
    }

    this.selectedValue.set(value);
    if (this.isMockSiteContentNode(activeNode.nodeId) && activeNode.type !== 'image') {
      this.siteContent.setValue(
        activeNode.nodeId,
        activeNode.scope === 'global' ? 'en' : this.locale(),
        value,
      );
    } else {
      this.visualEditor.saveOverride(
        activeNode.nodeId,
        value,
        activeNode.type,
        activeNode.scope === 'global' ? 'global' : this.locale(),
      );
      this.applyValueToPreview(activeNode.nodeId, value, activeNode.type);
    }

    this.status.set(`Live updated ${activeNode.nodeId}.`);
  }

  save(): void {
    this.status.set('Mock draft saved locally. Backend wiring comes next.');
  }

  onPreviewLoad(): void {
    const documentRef = this.previewFrame?.nativeElement.contentDocument;

    if (!documentRef) {
      return;
    }

    const scannedNodes = this.visualEditor.collectNodes(documentRef, this.locale());
    this.nodes.set(scannedNodes);

    const currentNodeId = this.selectedNodeId();
    const fallbackNodeId =
      currentNodeId && scannedNodes.some((node) => node.nodeId === currentNodeId)
        ? currentNodeId
        : (scannedNodes[0]?.nodeId ?? null);

    if (fallbackNodeId) {
      this.selectNode(fallbackNodeId);
    }

    this.status.set(`Loaded ${scannedNodes.length} editable nodes from the live preview.`);
  }

  private readNodeValue(nodeId: string): string {
    if (this.isMockSiteContentNode(nodeId)) {
      return this.siteContent.getValue(nodeId, this.locale());
    }

    const activeNode = this.nodes().find((node) => node.nodeId === nodeId);

    if (!activeNode) {
      return '';
    }

    const documentRef = this.previewFrame?.nativeElement.contentDocument;

    if (documentRef) {
      const element = documentRef.querySelector<HTMLElement>(`[data-edit-id="${nodeId}"]`);

      if (element) {
        const refreshedNodes = this.visualEditor.collectNodes(documentRef, this.locale());
        const refreshed = refreshedNodes.find((node) => node.nodeId === nodeId);

        if (refreshed) {
          this.nodes.set(refreshedNodes);
          return refreshed.value;
        }
      }
    }

    return activeNode.value;
  }

  private applyValueToPreview(nodeId: string, value: string, type: EditorNodeMeta['type']): void {
    const documentRef = this.previewFrame?.nativeElement.contentDocument;

    if (!documentRef) {
      return;
    }

    this.visualEditor.applyOverrideToFrame(documentRef, nodeId, value, type);
  }

  private highlightSelectedNode(nodeId: string): void {
    const documentRef = this.previewFrame?.nativeElement.contentDocument;

    if (!documentRef) {
      return;
    }

    documentRef
      .querySelectorAll('.editor-node-selected')
      .forEach((element) => element.classList.remove('editor-node-selected'));

    documentRef
      .querySelectorAll<HTMLElement>(`[data-edit-id="${nodeId}"]`)
      .forEach((element) => element.classList.add('editor-node-selected'));
  }

  private isMockSiteContentNode(nodeId: string): boolean {
    return [
      'navbar.about',
      'navbar.products',
      'navbar.origins',
      'navbar.contact',
      'hero.eyebrow',
      'hero.title',
      'hero.subtitle',
      'hero.cta',
      'footer.brandText',
      'footer.description',
      'footer.address',
      'footer.email',
      'footer.phone',
    ].includes(nodeId);
  }
}
