import {
  AfterViewInit,
  Component,
  HostListener,
  Inject,
  OnDestroy,
  PLATFORM_ID,
  effect,
  signal,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

import { NavbarComponent } from '../navbar/navbar.component';
import { HeroComponent } from '../hero/hero.component';
import { FruitSliceComponent } from '../fruit-slice/fruit-slice.component';
import { MarqueeComponent } from '../../shared/components/marquee/marquee.component';
import { AboutComponent } from '../about/about.component';
import { ProductsComponent } from '../products/products.component';
import { OriginsComponent } from '../origins/origins.component';
import { WhyUsComponent } from '../../shared/components/why-us/why-us.component';
import { FooterComponent } from '../footer/footer.component';
import { LanguageService, Language } from '../../core/services/language.service';
import { VisualEditorService } from '../../core/services/visual-editor.service';

@Component({
  selector: 'app-public-home',
  standalone: true,
  imports: [
    CommonModule,
    NavbarComponent,
    HeroComponent,
    FruitSliceComponent,
    MarqueeComponent,
    AboutComponent,
    ProductsComponent,
    OriginsComponent,
    WhyUsComponent,
    FooterComponent,
  ],
  template: `
    <app-navbar></app-navbar>
    <main>
      <app-hero></app-hero>
      <app-fruit-slice></app-fruit-slice>
      <app-marquee></app-marquee>
      <app-about></app-about>
      <app-products></app-products>
      <app-origins></app-origins>
      <app-why-us></app-why-us>
    </main>
    <app-footer></app-footer>
  `,
})
export class PublicHomeComponent implements AfterViewInit, OnDestroy {
  private isBrowser: boolean;
  private selectedEditorElement: HTMLElement | null = null;
  private domObserver?: MutationObserver;
  private isApplyingOverrides = false;
  readonly isEditorMode = signal(false);

  constructor(
    @Inject(PLATFORM_ID) platformId: Object,
    private readonly route: ActivatedRoute,
    private readonly languageService: LanguageService,
    private readonly visualEditor: VisualEditorService,
  ) {
    this.isBrowser = isPlatformBrowser(platformId);

    effect(() => {
      const locale = this.languageService.currentLang();

      if (!this.isBrowser) {
        return;
      }

      queueMicrotask(() => {
        this.applyOverridesSafely(locale);
      });
    });
  }

  ngAfterViewInit(): void {
    this.route.queryParamMap.subscribe((params) => {
      const editor = params.get('editor') === 'true';
      const locale = params.get('locale');

      this.isEditorMode.set(editor);

      if (locale === 'ar' || locale === 'en') {
        this.languageService.setLanguage(locale as Language);
      }

      if (this.isBrowser) {
        document.body.classList.toggle('editor-preview', editor);
        queueMicrotask(() => this.applyOverridesSafely(this.languageService.currentLang()));
      }
    });

    if (this.isBrowser) {
      this.domObserver = new MutationObserver(() => {
        if (this.isApplyingOverrides) {
          return;
        }

        this.applyOverridesSafely(this.languageService.currentLang());
      });

      this.domObserver.observe(document.body, {
        childList: true,
        subtree: true,
      });
    }
  }

  ngOnDestroy(): void {
    this.domObserver?.disconnect();
  }

  private applyOverridesSafely(locale: Language): void {
    if (!this.isBrowser) {
      return;
    }

    this.isApplyingOverrides = true;
    this.visualEditor.applyOverrides(document, locale);
    queueMicrotask(() => {
      this.isApplyingOverrides = false;
    });
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.isBrowser || !this.isEditorMode()) {
      return;
    }

    const target = event.target as HTMLElement | null;
    const editableNode = target?.closest<HTMLElement>('[data-edit-id]');

    if (!editableNode) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();

    const nodeId = editableNode.dataset['editId'] ?? '';
    const isImage = editableNode.tagName === 'IMG';
    const value = isImage
      ? (editableNode.getAttribute('src') ?? '')
      : (editableNode.textContent ?? '').trim();

    this.selectedEditorElement?.classList.remove('editor-node-selected');
    editableNode.classList.add('editor-node-selected');
    this.selectedEditorElement = editableNode;

    window.parent.postMessage(
      {
        type: 'editor-node-selected',
        payload: {
          nodeId,
          value,
          nodeType: isImage ? 'image' : 'text',
        },
      },
      window.location.origin,
    );
  }

  @HostListener('window:scroll')
  onScroll(): void {
    if (this.isBrowser) {
      document.body.style.setProperty('--scroll-y', `${window.scrollY}px`);
      const maxScroll = document.body.scrollHeight - window.innerHeight;
      const progress = maxScroll > 0 ? window.scrollY / maxScroll : 0;
      document.body.style.setProperty('--scroll-progress', `${progress}`);
    }
  }
}
