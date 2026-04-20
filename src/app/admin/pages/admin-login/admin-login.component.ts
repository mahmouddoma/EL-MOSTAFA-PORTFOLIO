import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MockAdminAuthService } from '../../core/services/mock-admin-auth.service';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="login-shell">
      <div class="login-card">
        <div class="badge">Portfolio Admin</div>
        <h1>Portfolio Dashboard Login</h1>
        <p class="intro">
          Mock authentication is active now. Use any email, then enter code
          <strong>123456</strong>.
        </p>

        <div *ngIf="step() === 1" class="form-block">
          <label>Email</label>
          <input [(ngModel)]="email" type="email" placeholder="admin@company.com" />
          <button type="button" (click)="requestCode()" [disabled]="loading()">
            {{ loading() ? 'Sending...' : 'Send Verification Code' }}
          </button>
        </div>

        <div *ngIf="step() === 2" class="form-block">
          <label>Verification Code</label>
          <input [(ngModel)]="code" type="text" maxlength="6" placeholder="123456" />
          <button type="button" (click)="verifyCode()" [disabled]="loading()">
            {{ loading() ? 'Checking...' : 'Login to Dashboard' }}
          </button>
          <button type="button" class="ghost" (click)="step.set(1)">Back</button>
        </div>

        <p *ngIf="message()" class="message">{{ message() }}</p>

        <a class="back-link" href="/">Return to Portfolio</a>
      </div>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
        min-height: 100vh;
        background-color: var(--bg-primary);
        background-image:
          radial-gradient(circle at top left, rgba(245, 124, 0, 0.18), transparent 30%),
          radial-gradient(circle at bottom right, rgba(211, 47, 47, 0.12), transparent 28%);
        color: var(--text-primary);
        transition: background-color 0.5s ease;
      }

      .login-shell {
        min-height: 100vh;
        display: grid;
        place-items: center;
        padding: 24px;
      }

      .login-card {
        width: min(480px, 100%);
        background: var(--card-bg);
        border: 1px solid var(--border-color);
        border-radius: 32px;
        padding: 32px;
        box-shadow: 0 8px 40px rgba(0, 0, 0, 0.12);
        backdrop-filter: blur(24px);
        -webkit-backdrop-filter: blur(24px);
        transition:
          background 0.4s ease,
          border-color 0.4s ease;
      }

      .badge {
        width: fit-content;
        padding: 6px 14px;
        border-radius: 999px;
        background: rgba(245, 124, 0, 0.12);
        color: var(--color-primary);
        border: 1px solid rgba(245, 124, 0, 0.28);
        margin-bottom: 18px;
        font-size: 0.82rem;
        font-weight: 700;
      }

      h1 {
        margin: 0 0 12px;
        font-size: clamp(2rem, 4vw, 2.6rem);
        color: var(--text-primary);
      }

      .intro {
        color: var(--text-secondary);
        line-height: 1.7;
        margin-bottom: 24px;
      }

      .form-block {
        display: grid;
        gap: 12px;
      }

      label {
        font-size: 0.9rem;
        font-weight: 600;
        color: var(--text-secondary);
      }

      input {
        width: 100%;
        border-radius: 16px;
        border: 1px solid var(--border-color);
        background: var(--bg-surface);
        color: var(--text-primary);
        padding: 15px 16px;
        font-size: 1rem;
        font: inherit;
        transition:
          border-color 0.25s ease,
          background 0.4s ease;
      }

      input:focus {
        outline: none;
        border-color: rgba(245, 124, 0, 0.5);
      }

      button {
        border: none;
        border-radius: 16px;
        padding: 14px 16px;
        cursor: pointer;
        font-weight: 700;
        font: inherit;
        font-weight: 700;
        background: linear-gradient(135deg, var(--color-primary), var(--color-accent));
        color: #fff;
        transition: all 0.3s ease;
      }

      button:hover:not(:disabled) {
        transform: translateY(-2px);
        box-shadow: 0 8px 24px rgba(245, 124, 0, 0.4);
      }

      button:disabled {
        opacity: 0.65;
        cursor: not-allowed;
      }

      button.ghost {
        background: transparent;
        color: var(--text-secondary);
        border: 1px solid var(--border-color);
      }

      button.ghost:hover {
        color: var(--text-primary);
        border-color: rgba(245, 124, 0, 0.35);
        transform: none;
        box-shadow: none;
      }

      .message {
        margin: 18px 0 0;
        color: var(--color-primary);
        font-size: 0.9rem;
      }

      .back-link {
        display: inline-block;
        margin-top: 22px;
        color: var(--text-secondary);
        text-decoration: none;
        font-size: 0.9rem;
        transition: color 0.25s ease;
      }

      .back-link:hover {
        color: var(--color-primary);
      }
    `,
  ],
})
export class AdminLoginComponent {
  private readonly auth = inject(MockAdminAuthService);
  private readonly router = inject(Router);

  readonly step = signal<1 | 2>(1);
  readonly loading = signal(false);
  readonly message = signal('');

  email = '';
  code = '';

  constructor() {
    if (this.auth.isAuthenticated()) {
      this.router.navigateByUrl('/admin/dashboard');
    }
  }

  requestCode(): void {
    this.loading.set(true);
    this.message.set('');

    this.auth.requestCode(this.email).subscribe({
      next: () => {
        this.loading.set(false);
        this.step.set(2);
        this.message.set('Demo code sent. Use 123456.');
      },
      error: (error: Error) => {
        this.loading.set(false);
        this.message.set(error.message);
      },
    });
  }

  verifyCode(): void {
    this.loading.set(true);
    this.message.set('');

    this.auth.verifyCode(this.email, this.code).subscribe({
      next: () => {
        this.loading.set(false);
        this.router.navigateByUrl('/admin/dashboard');
      },
      error: (error: Error) => {
        this.loading.set(false);
        this.message.set(error.message);
      },
    });
  }
}
