import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LanguageService } from '../../core/services/language.service';
import { Store } from '@ngrx/store';
import { OriginCardComponent } from '../../shared/components/origin-card/origin-card.component';
import { ScrollRevealDirective } from '../../shared/directives/scroll-reveal.directive';
import { selectAllOrigins } from '../../state/origins/origins.selectors';
import { loadOrigins } from '../../state/origins/origins.actions';
import { trigger, transition, style, animate, query, stagger } from '@angular/animations';

@Component({
  selector: 'app-origins',
  standalone: true,
  imports: [CommonModule, OriginCardComponent, ScrollRevealDirective],
  animations: [
    trigger('listAnimation', [
      transition('* => *', [
        query(
          ':enter',
          [
            style({ opacity: 0, transform: 'translateY(30px)' }),
            stagger(80, [
              animate(
                '0.6s cubic-bezier(0.16, 1, 0.3, 1)',
                style({ opacity: 1, transform: 'translateY(0)' }),
              ),
            ]),
          ],
          { optional: true },
        ),
      ]),
    ]),
  ],
  template: `
    <section class="origins-section py-5" id="origins" appScrollReveal>
      <div class="container py-5">
        <div class="row mb-5">
          <div class="col-12 text-center header-container">
            <span class="eyebrow" data-edit-id="origins.eyebrow" data-edit-label="Origins Eyebrow">{{ lang.translate('origins.eyebrow') }}</span>
            <h2 class="display-4 font-playfair fw-bold theme-text mb-3" data-edit-id="origins.title" data-edit-label="Origins Title">{{ lang.translate('origins.title') }}</h2>
            <p class="theme-text-muted mx-auto" style="max-width: 600px;" data-edit-id="origins.subtitle" data-edit-label="Origins Subtitle" data-edit-type="textarea">
              {{ lang.translate('origins.subtitle') }}
            </p>
          </div>
        </div>

        <div class="row justify-content-center g-4" [@listAnimation]="(origins$ | async)?.length">
          <div class="col-12 col-sm-6 col-md-4 col-lg-3" *ngFor="let origin of origins$ | async">
            <app-origin-card [origin]="origin"></app-origin-card>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [
    `
      .font-playfair {
        font-family: var(--font-display);
      }
      .origins-section {
        background-color: var(--bg-primary);
        position: relative;
        transition: background-color 0.5s ease;
      }
      .eyebrow {
        color: var(--color-primary);
        text-transform: uppercase;
        letter-spacing: 3px;
        font-size: 0.8rem;
        font-weight: 700;
        margin-bottom: 1rem;
        display: inline-block;
      }
      .theme-text {
        color: var(--text-primary);
      }
      .theme-text-muted {
        color: var(--text-secondary);
        font-size: 1.1rem;
      }
    `,
  ],
})
export class OriginsComponent implements OnInit {
  private store = inject(Store);
  lang = inject(LanguageService);
  origins$ = this.store.select(selectAllOrigins);

  ngOnInit() {
    this.store.dispatch(loadOrigins());
  }
}
