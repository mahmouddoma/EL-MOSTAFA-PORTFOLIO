import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AdminAuthService } from '../core/services/admin-auth.service';
import { LanguageService } from '../../core/services/language.service';
import { ThemeService } from '../../core/services/theme.service';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="admin-shell">
      <div class="background-orb orb-left"></div>
      <div class="background-orb orb-right"></div>

      <aside class="sidebar glass-panel">
        <div class="brand-block">
          <div class="brand-mark">EM</div>
          <div>
            <div class="brand-title">EL MOSTAFA</div>
            <div class="brand-subtitle">Portfolio CMS</div>
          </div>
        </div>

        <p class="sidebar-copy">
          {{ lang.translate('admin.sidebar.manage') }}
        </p>

        <nav class="nav-list">
          <a
            *ngFor="let item of navItems()"
            [routerLink]="item.route"
            routerLinkActive="active"
            class="nav-item"
          >
            <span class="nav-icon">{{ item.icon }}</span>
            <span>{{ item.label }}</span>
          </a>
        </nav>

        <div class="sidebar-footer">
          <a routerLink="/" class="footer-link">{{
            lang.translate('admin.sidebar.viewPortfolio')
          }}</a>
          <button type="button" class="footer-link logout" (click)="logout()">
            {{ lang.translate('admin.sidebar.logout') }}
          </button>
        </div>
      </aside>

      <section class="content-shell">
        <header class="topbar glass-panel">
          <div>
            <div class="topbar-title">{{ lang.translate('admin.title') }}</div>
            <div class="topbar-subtitle">
              {{ lang.translate('admin.subtitle') }}
            </div>
          </div>

          <div class="header-actions">
            <!-- Theme + Language Toggles -->
            <div class="toggle-group glass-panel">
              <!-- Theme Toggle (SVG icons, same as portfolio navbar) -->
              <button
                type="button"
                class="icon-btn"
                (click)="theme.toggleTheme()"
                [title]="theme.isDarkMode() ? 'Switch to Light' : 'Switch to Dark'"
              >
                <span class="btn-icon" [class.rotate]="theme.isDarkMode()">
                  @if (theme.isDarkMode()) {
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <circle cx="12" cy="12" r="5" />
                      <line x1="12" y1="1" x2="12" y2="3" />
                      <line x1="12" y1="21" x2="12" y2="23" />
                      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                      <line x1="1" y1="12" x2="3" y2="12" />
                      <line x1="21" y1="12" x2="23" y2="12" />
                      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                    </svg>
                  } @else {
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                    </svg>
                  }
                </span>
              </button>

              <!-- Language Toggle (same as portfolio navbar) -->
              <button type="button" class="lang-btn" (click)="lang.toggleLanguage()">
                <span class="lang-code">{{ lang.currentLang() === 'en' ? 'AR' : 'EN' }}</span>
              </button>
            </div>

            <!-- Admin Chip -->
            <div class="admin-chip glass-panel">
              <div class="chip-avatar">A</div>
              <div>
                <div class="chip-name">{{ adminName() }}</div>
                <div class="chip-email">{{ adminEmail() }}</div>
              </div>
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
        color: var(--text-primary);
        background-color: var(--bg-primary);
        background-image:
          radial-gradient(circle at top left, rgba(245, 124, 0, 0.12), transparent 35%),
          radial-gradient(circle at bottom right, rgba(211, 47, 47, 0.1), transparent 35%);
        transition: background-color 0.5s ease;
      }

      .admin-shell {
        position: relative;
        min-height: 100vh;
        display: grid;
        grid-template-columns: 300px minmax(0, 1fr);
        gap: 24px;
        padding: 24px;
        overflow: hidden;
      }

      .background-orb {
        position: absolute;
        width: 420px;
        height: 420px;
        border-radius: 50%;
        filter: blur(80px);
        opacity: 0.4;
        pointer-events: none;
      }

      .orb-left {
        top: -140px;
        left: -120px;
        background: rgba(245, 124, 0, 0.15);
      }

      .orb-right {
        right: -160px;
        bottom: -100px;
        background: rgba(211, 47, 47, 0.12);
      }

      .glass-panel {
        background: var(--glass-bg);
        border: 1px solid var(--border-color);
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
        backdrop-filter: blur(24px);
        -webkit-backdrop-filter: blur(24px);
      }

      .sidebar {
        position: relative;
        z-index: 1;
        border-radius: 30px;
        display: flex;
        flex-direction: column;
        padding: 24px 20px;
      }

      .brand-block {
        display: flex;
        align-items: center;
        gap: 14px;
      }

      .brand-mark {
        width: 56px;
        height: 56px;
        border-radius: 18px;
        display: grid;
        place-items: center;
        background: linear-gradient(135deg, var(--color-primary), var(--color-accent));
        color: #fff;
        font-weight: 900;
        letter-spacing: 0.08em;
        flex-shrink: 0;
      }

      .brand-title {
        font-family: var(--font-display);
        font-size: 1.05rem;
        font-weight: 900;
        letter-spacing: 0.12em;
        color: var(--text-primary);
      }

      .brand-subtitle {
        font-size: 0.8rem;
        color: var(--text-secondary);
        margin-top: 2px;
      }

      .sidebar-copy {
        margin: 18px 0 0;
        line-height: 1.7;
        font-size: 0.9rem;
        color: var(--text-secondary);
      }

      .nav-list {
        display: grid;
        gap: 6px;
        margin: 26px 0 0;
      }

      .nav-item {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 12px 16px;
        border-radius: 18px;
        text-decoration: none;
        color: var(--text-secondary);
        border: 1px solid transparent;
        font-weight: 600;
        font-size: 0.9rem;
        transition:
          transform 0.25s ease,
          background 0.25s ease,
          border-color 0.25s ease,
          color 0.25s ease;
      }

      .nav-item:hover,
      .nav-item.active {
        transform: translateX(4px);
        color: var(--text-primary);
        border-color: rgba(245, 124, 0, 0.26);
        background: linear-gradient(135deg, rgba(245, 124, 0, 0.12), rgba(211, 47, 47, 0.06));
      }

      [dir='rtl'] .nav-item:hover,
      [dir='rtl'] .nav-item.active {
        transform: translateX(-4px);
      }

      .nav-icon {
        width: 30px;
        height: 30px;
        display: grid;
        place-items: center;
        border-radius: 10px;
        background: var(--border-color);
        font-size: 0.7rem;
        font-weight: 800;
        color: var(--text-primary);
        flex-shrink: 0;
      }

      .sidebar-footer {
        margin-top: auto;
        display: grid;
        gap: 10px;
        padding-top: 20px;
      }

      .footer-link {
        border: 1px solid var(--border-color);
        background: transparent;
        color: var(--text-secondary);
        border-radius: 16px;
        padding: 13px 14px;
        text-decoration: none;
        text-align: start;
        cursor: pointer;
        font: inherit;
        font-size: 0.9rem;
        font-weight: 600;
        transition: all 0.3s ease;
      }

      .footer-link:hover {
        background: var(--border-color);
        color: var(--text-primary);
      }

      .footer-link.logout {
        color: #e84057;
      }

      .footer-link.logout:hover {
        background: rgba(232, 64, 87, 0.1);
        border-color: rgba(232, 64, 87, 0.3);
      }

      .content-shell {
        position: relative;
        z-index: 1;
        min-width: 0;
      }

      .topbar {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 18px;
        border-radius: 28px;
        padding: 16px 24px;
        margin-bottom: 22px;
      }

      .topbar-title {
        font-family: var(--font-display);
        font-size: clamp(1.2rem, 2vw, 1.7rem);
        font-weight: 800;
        color: var(--text-primary);
      }

      .topbar-subtitle {
        font-size: 0.85rem;
        color: var(--text-secondary);
        margin-top: 2px;
      }

      .header-actions {
        display: flex;
        align-items: center;
        gap: 14px;
        flex-shrink: 0;
      }

      /* Toggle group — identical pattern to the portfolio navbar */
      .toggle-group {
        display: flex;
        align-items: center;
        gap: 4px;
        padding: 5px;
        border-radius: 100px;
      }

      .icon-btn,
      .lang-btn {
        background: transparent;
        border: none;
        color: var(--text-primary);
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 8px;
        border-radius: 50%;
        transition: all 0.3s ease;
      }

      .icon-btn:hover,
      .lang-btn:hover {
        background: var(--border-color);
        transform: translateY(-2px);
      }

      .btn-icon {
        display: flex;
        align-items: center;
        justify-content: center;
        transition: transform 0.5s ease;
      }

      .btn-icon.rotate {
        animation: spinOnce 0.5s ease;
      }

      @keyframes spinOnce {
        from {
          transform: rotate(-30deg);
        }
        to {
          transform: rotate(0deg);
        }
      }

      .btn-icon svg {
        width: 18px;
        height: 18px;
      }

      .lang-code {
        font-size: 0.78rem;
        font-weight: 800;
        letter-spacing: 1px;
        min-width: 24px;
        text-align: center;
        color: var(--text-secondary);
      }

      .lang-btn:hover .lang-code {
        color: var(--color-primary);
      }

      /* Admin chip */
      .admin-chip {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 8px 14px;
        border-radius: 999px;
      }

      .chip-avatar {
        width: 36px;
        height: 36px;
        border-radius: 50%;
        display: grid;
        place-items: center;
        background: linear-gradient(135deg, var(--color-primary), var(--color-accent));
        color: #fff;
        font-weight: 800;
        font-size: 0.85rem;
        flex-shrink: 0;
      }

      .chip-name {
        font-weight: 700;
        font-size: 0.88rem;
        color: var(--text-primary);
        white-space: nowrap;
      }

      .chip-email {
        font-size: 0.75rem;
        color: var(--text-secondary);
        white-space: nowrap;
      }

      .page-host {
        min-height: calc(100vh - 150px);
      }

      @media (max-width: 1080px) {
        .admin-shell {
          grid-template-columns: 1fr;
        }

        .sidebar {
          padding-bottom: 18px;
        }
      }

      @media (max-width: 720px) {
        .admin-shell {
          padding: 16px;
          gap: 16px;
        }

        .topbar {
          flex-direction: column;
          align-items: flex-start;
          border-radius: 24px;
        }

        .header-actions {
          width: 100%;
          justify-content: space-between;
        }
      }
    `,
  ],
})
export class AdminLayoutComponent {
  private readonly auth = inject(AdminAuthService);
  private readonly router = inject(Router);
  readonly lang = inject(LanguageService);
  readonly theme = inject(ThemeService);

  readonly navItems = computed(() => [
    { label: this.lang.translate('admin.nav.dashboard'), route: '/admin/dashboard', icon: 'DB' },
    { label: this.lang.translate('admin.nav.showcase'), route: '/admin/showcase', icon: 'SH' },
    { label: 'Catalog', route: '/admin/catalog-products', icon: 'CP' },
    { label: 'Articles', route: '/admin/articles', icon: 'AR' },
    { label: 'Resources', route: '/admin/resources', icon: 'RS' },
    { label: 'Quotes', route: '/admin/quotes', icon: 'QT' },
    { label: 'Newsletter', route: '/admin/newsletter', icon: 'NL' },
    { label: 'Users', route: '/admin/users', icon: 'US' },
    { label: this.lang.translate('admin.nav.origins'), route: '/admin/origins', icon: 'OR' },
    { label: this.lang.translate('admin.nav.sections'), route: '/admin/sections', icon: 'SE' },
    {
      label: this.lang.translate('admin.nav.siteContent'),
      route: '/admin/site-content',
      icon: 'SC',
    },
    {
      label: this.lang.translate('admin.nav.visualEditor'),
      route: '/admin/visual-editor',
      icon: 'VE',
    },
    { label: this.lang.translate('admin.nav.messages'), route: '/admin/messages', icon: 'MS' },
  ]);

  readonly adminName = computed(() => this.auth.session()?.user.fullName ?? 'Admin User');
  readonly adminEmail = computed(() => this.auth.session()?.user.email ?? 'admin@local.dev');

  logout(): void {
    this.auth.logout();
    this.router.navigateByUrl('/admin/login');
  }
}
