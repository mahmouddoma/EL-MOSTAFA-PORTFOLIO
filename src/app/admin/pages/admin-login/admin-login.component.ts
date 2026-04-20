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
        <div class="badge">Admin Access</div>
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
        background:
          radial-gradient(circle at top left, rgba(201, 169, 97, 0.18), transparent 30%),
          linear-gradient(145deg, #080808, #111);
        color: #fff7ea;
      }

      .login-shell {
        min-height: 100vh;
        display: grid;
        place-items: center;
        padding: 24px;
      }

      .login-card {
        width: min(480px, 100%);
        background: rgba(18, 18, 18, 0.92);
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-radius: 28px;
        padding: 32px;
        box-shadow: 0 30px 80px rgba(0, 0, 0, 0.35);
      }

      .badge {
        width: fit-content;
        padding: 8px 12px;
        border-radius: 999px;
        background: rgba(201, 169, 97, 0.14);
        color: #e8cb87;
        border: 1px solid rgba(201, 169, 97, 0.22);
        margin-bottom: 18px;
      }

      h1 {
        margin: 0 0 12px;
        font-size: clamp(2rem, 4vw, 2.6rem);
      }

      .intro {
        color: rgba(255, 247, 234, 0.72);
        line-height: 1.7;
        margin-bottom: 24px;
      }

      .form-block {
        display: grid;
        gap: 12px;
      }

      label {
        font-size: 0.92rem;
        color: rgba(255, 247, 234, 0.7);
      }

      input {
        width: 100%;
        border-radius: 16px;
        border: 1px solid rgba(255, 255, 255, 0.08);
        background: rgba(255, 255, 255, 0.04);
        color: #fff;
        padding: 15px 16px;
        font-size: 1rem;
      }

      button {
        border: none;
        border-radius: 16px;
        padding: 14px 16px;
        cursor: pointer;
        font-weight: 700;
        background: linear-gradient(135deg, #d7b970, #a37a36);
        color: #0f0f0f;
      }

      button.ghost {
        background: transparent;
        color: rgba(255, 247, 234, 0.76);
        border: 1px solid rgba(255, 255, 255, 0.08);
      }

      .message {
        margin: 18px 0 0;
        color: #f1cb7d;
      }

      .back-link {
        display: inline-block;
        margin-top: 22px;
        color: rgba(255, 247, 234, 0.68);
        text-decoration: none;
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
