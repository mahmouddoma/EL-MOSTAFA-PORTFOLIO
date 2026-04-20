import { Injectable, signal } from '@angular/core';
import { EditableLocale } from './mock-site-content.service';

export type EditorValueType = 'text' | 'textarea' | 'html' | 'image';
export type EditorValueScope = EditableLocale | 'global';

export interface EditorNodeMeta {
  nodeId: string;
  label: string;
  type: EditorValueType;
  scope: EditorValueScope;
  value: string;
}

interface EditorOverride {
  nodeId: string;
  type: EditorValueType;
  scope: EditorValueScope;
  value: string;
}

@Injectable({
  providedIn: 'root',
})
export class MockVisualEditorService {
  private readonly STORAGE_KEY = 'elmostafa_visual_editor_overrides_v1';
  readonly overrides = signal<Record<string, EditorOverride>>(this.loadOverrides());

  constructor() {
    window.addEventListener('storage', (event) => {
      if (event.key === this.STORAGE_KEY) {
        this.overrides.set(this.loadOverrides());
      }
    });
  }

  collectNodes(root: ParentNode, locale: EditableLocale): EditorNodeMeta[] {
    const elements = Array.from(root.querySelectorAll<HTMLElement>('[data-edit-id]'));
    const deduped = new Map<string, EditorNodeMeta>();

    for (const element of elements) {
      const nodeId = element.dataset['editId'];

      if (!nodeId || deduped.has(nodeId)) {
        continue;
      }

      const type = this.getNodeType(element);
      const scope = this.getNodeScope(element);
      const override = this.findOverride(nodeId, scope === 'global' ? 'global' : locale);

      deduped.set(nodeId, {
        nodeId,
        label: element.dataset['editLabel'] ?? this.humanizeNodeId(nodeId),
        type,
        scope,
        value: override?.value ?? this.readElementValue(element, type),
      });
    }

    return Array.from(deduped.values());
  }

  saveOverride(
    nodeId: string,
    value: string,
    type: EditorValueType,
    scope: EditorValueScope,
  ): void {
    this.overrides.update((current) => ({
      ...current,
      [this.makeKey(nodeId, scope)]: {
        nodeId,
        value,
        type,
        scope,
      },
    }));

    this.persist();
  }

  applyOverrides(root: ParentNode, locale: EditableLocale): void {
    const elements = Array.from(root.querySelectorAll<HTMLElement>('[data-edit-id]'));

    for (const element of elements) {
      const nodeId = element.dataset['editId'];

      if (!nodeId) {
        continue;
      }

      const type = this.getNodeType(element);
      const scope = this.getNodeScope(element);
      const override = this.findOverride(nodeId, scope === 'global' ? 'global' : locale);

      if (!override) {
        continue;
      }

      this.writeElementValue(element, override.value, type);
    }
  }

  applyOverrideToFrame(
    root: ParentNode,
    nodeId: string,
    value: string,
    type: EditorValueType,
  ): void {
    const elements = Array.from(root.querySelectorAll<HTMLElement>(`[data-edit-id="${nodeId}"]`));

    for (const element of elements) {
      this.writeElementValue(element, value, type);
    }
  }

  private readElementValue(element: HTMLElement, type: EditorValueType): string {
    if (type === 'image' && element instanceof HTMLImageElement) {
      return element.getAttribute('src') ?? '';
    }

    if (type === 'html') {
      return element.innerHTML.trim();
    }

    return (element.textContent ?? '')
      .replace(/\u00A0/g, ' ')
      .replace(/&nbsp;/g, ' ')
      .trim();
  }

  private writeElementValue(element: HTMLElement, value: string, type: EditorValueType): void {
    if (type === 'image' && element instanceof HTMLImageElement) {
      element.src = value;
      return;
    }

    if (type === 'html') {
      element.innerHTML = value;
      return;
    }

    element.textContent = value;
  }

  private getNodeType(element: HTMLElement): EditorValueType {
    const declaredType = element.dataset['editType'] as EditorValueType | undefined;

    if (declaredType) {
      return declaredType;
    }

    if (element instanceof HTMLImageElement) {
      return 'image';
    }

    const textLength = (element.textContent ?? '').trim().length;
    return textLength > 100 ? 'textarea' : 'text';
  }

  private getNodeScope(element: HTMLElement): EditorValueScope {
    const declaredScope = element.dataset['editScope'] as EditorValueScope | undefined;
    return declaredScope ?? 'en';
  }

  private findOverride(nodeId: string, scope: EditorValueScope): EditorOverride | null {
    const allOverrides = this.overrides();
    return allOverrides[this.makeKey(nodeId, scope)] ?? null;
  }

  private makeKey(nodeId: string, scope: EditorValueScope): string {
    return `${scope}::${nodeId}`;
  }

  private humanizeNodeId(nodeId: string): string {
    return nodeId
      .split('.')
      .map((chunk) => chunk.replace(/[-_]/g, ' '))
      .map((chunk) => chunk.charAt(0).toUpperCase() + chunk.slice(1))
      .join(' / ');
  }

  private loadOverrides(): Record<string, EditorOverride> {
    const raw = localStorage.getItem(this.STORAGE_KEY);

    if (!raw) {
      return {};
    }

    try {
      return JSON.parse(raw) as Record<string, EditorOverride>;
    } catch {
      return {};
    }
  }

  private persist(): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.overrides()));
  }
}
