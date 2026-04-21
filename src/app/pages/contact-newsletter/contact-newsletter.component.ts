import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { LanguageService } from '../../core/services/language.service';
import { MessagesApiService } from '../../core/services/messages-api.service';
import { NewsletterApiService } from '../../core/services/newsletter-api.service';

@Component({
  selector: 'app-contact-newsletter',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <section class="contact-band" id="contact">
      <div class="inner">
        <form [formGroup]="contactForm" (ngSubmit)="submitMessage()" class="panel">
          <span class="eyebrow">Contact</span>
          <h2>Send a portfolio message</h2>
          <div class="grid">
            <input formControlName="name" placeholder="Name" />
            <input formControlName="email" placeholder="Email" />
          </div>
          <input formControlName="subject" placeholder="Subject" />
          <textarea formControlName="message" rows="5" placeholder="Message"></textarea>
          <button type="submit" [disabled]="contactForm.invalid || contactSaving()">
            {{ contactSaving() ? 'Sending...' : 'Send message' }}
          </button>
          <p class="status" *ngIf="contactStatus()">{{ contactStatus() }}</p>
        </form>

        <form [formGroup]="newsletterForm" (ngSubmit)="subscribe()" class="panel compact">
          <span class="eyebrow">Newsletter</span>
          <h2>Export updates</h2>
          <input formControlName="email" placeholder="Email address" />
          <button type="submit" [disabled]="newsletterForm.invalid || newsletterSaving()">
            {{ newsletterSaving() ? 'Subscribing...' : 'Subscribe' }}
          </button>
          <p class="status" *ngIf="newsletterStatus()">{{ newsletterStatus() }}</p>
        </form>
      </div>
    </section>
  `,
  styles: [
    `
      .contact-band {
        padding: clamp(56px, 8vw, 96px) 20px;
        background: var(--bg-primary);
      }

      .inner {
        width: min(1080px, 100%);
        margin: 0 auto;
        display: grid;
        grid-template-columns: minmax(0, 1.4fr) minmax(280px, 0.8fr);
        gap: 18px;
        align-items: start;
      }

      .panel {
        display: grid;
        gap: 14px;
        padding: 22px;
        border: 1px solid var(--border-color);
        background: var(--card-bg);
        border-radius: 8px;
      }

      .compact {
        position: sticky;
        top: 100px;
      }

      .grid {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 12px;
      }

      input,
      textarea {
        width: 100%;
        border: 1px solid var(--border-color);
        background: var(--bg-surface);
        color: var(--text-primary);
        border-radius: 6px;
        padding: 12px 14px;
        font: inherit;
      }

      button {
        border: 0;
        border-radius: 6px;
        padding: 13px 18px;
        background: var(--color-primary);
        color: #fff;
        font-weight: 800;
        cursor: pointer;
      }

      button:disabled {
        opacity: 0.65;
        cursor: not-allowed;
      }

      .eyebrow,
      .status {
        color: var(--color-primary);
        font-weight: 800;
      }

      h2,
      p {
        margin: 0;
      }

      h2 {
        color: var(--text-primary);
      }

      @media (max-width: 820px) {
        .inner,
        .grid {
          grid-template-columns: 1fr;
        }

        .compact {
          position: static;
        }
      }
    `,
  ],
})
export class ContactNewsletterComponent {
  private readonly fb = inject(FormBuilder);
  private readonly messagesApi = inject(MessagesApiService);
  private readonly newsletterApi = inject(NewsletterApiService);
  private readonly lang = inject(LanguageService);

  readonly contactSaving = signal(false);
  readonly newsletterSaving = signal(false);
  readonly contactStatus = signal('');
  readonly newsletterStatus = signal('');

  readonly contactForm = this.fb.nonNullable.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    subject: ['', Validators.required],
    message: ['', Validators.required],
  });

  readonly newsletterForm = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
  });

  submitMessage(): void {
    if (this.contactForm.invalid) {
      return;
    }

    this.contactSaving.set(true);
    this.messagesApi.submitMessage(this.contactForm.getRawValue()).subscribe({
      next: () => {
        this.contactStatus.set('Message sent.');
        this.contactForm.reset();
        this.contactSaving.set(false);
      },
      error: () => {
        this.contactStatus.set('Could not send the message.');
        this.contactSaving.set(false);
      },
    });
  }

  subscribe(): void {
    if (this.newsletterForm.invalid) {
      return;
    }

    this.newsletterSaving.set(true);
    this.newsletterApi
      .subscribe({
        email: this.newsletterForm.controls.email.value,
        locale: this.lang.currentLang(),
      })
      .subscribe({
        next: () => {
          this.newsletterStatus.set('Subscription request sent.');
          this.newsletterForm.reset();
          this.newsletterSaving.set(false);
        },
        error: () => {
          this.newsletterStatus.set('Could not subscribe this email.');
          this.newsletterSaving.set(false);
        },
      });
  }
}
