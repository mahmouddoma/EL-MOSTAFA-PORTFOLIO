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

          <div class="form-field">
            <label>Full Name</label>
            <input formControlName="name" placeholder="Enter your full name" />
          </div>

          <div class="form-field">
            <label>Email Address</label>
            <input formControlName="email" placeholder="email@example.com" />
            <span
              class="error-text"
              *ngIf="
                contactForm.get('email')?.touched && contactForm.get('email')?.errors?.['email']
              "
            >
              Please enter a valid email address.
            </span>
          </div>

          <div class="form-field">
            <label>Subject</label>
            <input formControlName="subject" placeholder="What is this about?" />
          </div>

          <div class="form-field">
            <label>Message</label>
            <textarea
              formControlName="message"
              rows="5"
              placeholder="How can we help you?"
            ></textarea>
          </div>

          <button type="submit" [disabled]="contactForm.invalid || contactSaving()">
            <span *ngIf="!contactSaving()">Send Message</span>
            <span *ngIf="contactSaving()">Sending...</span>
          </button>

          <p class="status success" *ngIf="contactStatus() === 'Message sent.'">
            {{ contactStatus() }}
          </p>
          <p class="status error" *ngIf="contactStatus() && contactStatus() !== 'Message sent.'">
            {{ contactStatus() }}
          </p>
        </form>

        <form [formGroup]="newsletterForm" (ngSubmit)="subscribe()" class="panel compact">
          <span class="eyebrow">Newsletter</span>
          <h2>Export updates</h2>
          <div class="form-field">
            <label>Email Address</label>
            <input formControlName="email" placeholder="email@example.com" />
          </div>
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
        display: flex;
        flex-direction: column;
        gap: 18px;
        padding: 30px;
        border: 1px solid var(--border-color);
        background: var(--card-bg);
        border-radius: 12px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
      }

      .compact {
        position: sticky;
        top: 100px;
      }

      .form-field {
        display: flex;
        flex-direction: column;
        gap: 6px;
      }

      label {
        font-size: 0.8rem;
        font-weight: 700;
        color: var(--text-secondary);
        text-transform: uppercase;
        letter-spacing: 1px;
      }

      input,
      textarea {
        width: 100%;
        border: 1px solid var(--border-color);
        background: var(--bg-surface);
        color: var(--text-primary);
        border-radius: 8px;
        padding: 12px 14px;
        font: inherit;
        transition: border-color 0.3s ease;
      }

      input:focus,
      textarea:focus {
        outline: none;
        border-color: var(--color-primary);
      }

      .error-text {
        font-size: 0.75rem;
        color: var(--color-accent);
        font-weight: 600;
      }

      button {
        border: 0;
        border-radius: 8px;
        padding: 14px 20px;
        background: var(--color-primary);
        color: #fff;
        font-weight: 800;
        cursor: pointer;
        transition:
          transform 0.2s ease,
          box-shadow 0.2s ease;
        margin-top: 8px;
      }

      button:hover:not(:disabled) {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(245, 124, 0, 0.3);
      }

      button:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }

      .status {
        font-size: 0.9rem;
        font-weight: 700;
        text-align: center;
        padding: 10px;
        border-radius: 6px;
      }

      .status.success {
        background: rgba(46, 125, 50, 0.1);
        color: var(--color-success);
      }

      .status.error {
        background: rgba(211, 47, 47, 0.1);
        color: var(--color-accent);
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
