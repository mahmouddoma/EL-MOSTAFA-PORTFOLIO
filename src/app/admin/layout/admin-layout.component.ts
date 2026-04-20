import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MockAdminAuthService } from '../core/services/mock-admin-auth.service';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="admin-shell">
      <aside class="sidebar">
        <div class="brand-block">
          <div class="brand-mark">EM</div>
          <div>
            <div class="brand-title">EL MOSTAFA</div>
            <div class="brand-subtitle">Admin Dashboard</div>
          </div>
        </div>

        <nav class="nav-list">
          <a
            *ngFor="let item of navItems"
            [routerLink]="item.route"
            routerLinkActive="active"
            class="nav-item"
          >
            <span class="nav-icon">{{ item.icon }}</span>
            <span>{{ item.label }}</span>
          </a>
        </nav>

        <div class="sidebar-footer">
          <a routerLink="/" class="footer-link">View Site</a>
          <button type="button" class="footer-link logout" (click)="logout()">Logout</button>
        </div>
      </aside>

      <section class="content-shell">
        <header class="topbar">
          <div>
            <div class="topbar-title">Portfolio Control Center</div>
            <div class="topbar-subtitle">Mock auth enabled until backend integration.</div>
          </div>

          <div class="admin-chip">
            <div class="chip-avatar">A</div>
            <div>
              <div class="chip-name">{{ adminName() }}</div>
              <div class="chip-email">{{ adminEmail() }}</div>
            </div>
          </div>
        </header>

        <main class="page-host">
          <router-outlet></router-outlet>
        </main>
      </section>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
        min-height: 100vh;
        background:
          radial-gradient(circle at top left, rgba(201, 169, 97, 0.12), transparent 35%), #0a0a0a;
        color: #f8f4e8;
      }

      .admin-shell {
        min-height: 100vh;
        display: grid;
        grid-template-columns: 280px 1fr;
      }

      .sidebar {
        border-right: 1px solid rgba(255, 255, 255, 0.08);
        background: rgba(11, 11, 11, 0.92);
        backdrop-filter: blur(16px);
        display: flex;
        flex-direction: column;
        padding: 24px 18px;
      }

      .brand-block {
        display: flex;
        align-items: center;
        gap: 14px;
        padding: 8px 10px 20px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      }

      .brand-mark {
        width: 50px;
        height: 50px;
        border-radius: 16px;
        display: grid;
        place-items: center;
        background: linear-gradient(135deg, #c9a961, #8e6a2d);
        color: #101010;
        font-weight: 900;
        letter-spacing: 1px;
      }

      .brand-title {
        font-weight: 800;
        letter-spacing: 1.4px;
      }

      .brand-subtitle {
        color: rgba(255, 255, 255, 0.56);
        font-size: 0.86rem;
      }

      .nav-list {
        display: flex;
        flex-direction: column;
        gap: 10px;
        padding: 22px 0;
      }

      .nav-item {
        text-decoration: none;
        color: rgba(255, 255, 255, 0.72);
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 14px 16px;
        border-radius: 18px;
        border: 1px solid transparent;
        transition: 0.25s ease;
      }

      .nav-item:hover,
      .nav-item.active {
        color: #0d0d0d;
        background: linear-gradient(135deg, #d7b970, #b99245);
        border-color: rgba(255, 255, 255, 0.1);
      }

      .nav-icon {
        width: 26px;
        height: 26px;
        border-radius: 8px;
        display: grid;
        place-items: center;
        background: rgba(255, 255, 255, 0.06);
        font-size: 0.75rem;
        font-weight: 700;
      }

      .nav-item.active .nav-icon {
        background: rgba(0, 0, 0, 0.12);
      }

      .sidebar-footer {
        margin-top: auto;
        display: grid;
        gap: 10px;
        padding: 18px 10px 0;
        border-top: 1px solid rgba(255, 255, 255, 0.08);
      }

      .footer-link {
        color: rgba(255, 255, 255, 0.72);
        text-decoration: none;
        background: transparent;
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-radius: 14px;
        padding: 12px 14px;
        text-align: left;
        cursor: pointer;
      }

      .footer-link.logout {
        color: #ffaaa0;
      }

      .content-shell {
        padding: 24px;
      }

      .topbar {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 18px;
        margin-bottom: 22px;
        padding: 18px 20px;
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-radius: 22px;
        background: rgba(20, 20, 20, 0.84);
      }

      .topbar-title {
        font-size: 1.3rem;
        font-weight: 800;
      }

      .topbar-subtitle {
        color: rgba(255, 255, 255, 0.55);
        font-size: 0.92rem;
      }

      .admin-chip {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 10px 14px;
        background: rgba(255, 255, 255, 0.04);
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-radius: 999px;
      }

      .chip-avatar {
        width: 38px;
        height: 38px;
        border-radius: 50%;
        display: grid;
        place-items: center;
        font-weight: 800;
        background: linear-gradient(135deg, #d7b970, #8e6a2d);
        color: #111;
      }

      .chip-name {
        font-weight: 700;
      }

      .chip-email {
        color: rgba(255, 255, 255, 0.55);
        font-size: 0.85rem;
      }

      .page-host {
        min-height: calc(100vh - 130px);
      }

      @media (max-width: 960px) {
        .admin-shell {
          grid-template-columns: 1fr;
        }

        .sidebar {
          border-right: none;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }
      }
    `,
  ],
})
export class AdminLayoutComponent {
  private readonly auth = inject(MockAdminAuthService);
  private readonly router = inject(Router);

  readonly navItems = [
    { label: 'Dashboard', route: '/admin/dashboard', icon: 'DB' },
    { label: 'Products', route: '/admin/products', icon: 'PR' },
    { label: 'Site Content', route: '/admin/site-content', icon: 'SC' },
    { label: 'Visual Editor', route: '/admin/visual-editor', icon: 'VE' },
    { label: 'Orders', route: '/admin/orders', icon: 'OR' },
    { label: 'Payments', route: '/admin/payments', icon: 'PY' },
    { label: 'Messages', route: '/admin/messages', icon: 'MS' },
  ];

  readonly adminName = computed(() => this.auth.session()?.fullName ?? 'Admin User');
  readonly adminEmail = computed(() => this.auth.session()?.email ?? 'admin@local.dev');

  logout(): void {
    this.auth.logout();
    this.router.navigateByUrl('/admin/login');
  }
}
