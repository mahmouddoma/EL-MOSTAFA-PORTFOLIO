import { Component, HostListener, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AnimationService } from '../../core/services/animation.service';
import { ThemeService } from '../../core/services/theme.service';
import { LanguageService } from '../../core/services/language.service';
import { SiteContentService } from '../../core/services/site-content.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div
      class="custom-cursor-dot"
      [style.transform]="'translate(' + mouseX() + 'px, ' + mouseY() + 'px)'"
    ></div>
    <div
      class="custom-cursor-ring"
      [style.transform]="'translate(' + lagX() + 'px, ' + lagY() + 'px)'"
    ></div>

    <nav [class.scrolled]="isScrolled" [class.menu-open]="isMenuOpen()">
      <div class="container nav-content">
        <a class="brand" href="#" (click)="scrollToTop($event)">
          <div class="logo-wrapper">
            <img
              src="assets/logo.png"
              alt="EL MOSTAFA"
              class="logo-img"
              data-edit-id="navbar.logo"
              data-edit-label="Navbar Logo"
              data-edit-type="image"
              data-edit-scope="global"
              loading="eager"
              decoding="sync"
              fetchpriority="high"
            />
            <div class="logo-shine"></div>
          </div>
        </a>

        <!-- Desktop Navigation -->
        <div class="d-none d-lg-flex align-items-center gap-4">
          <div class="links">
            <a href="#about" (click)="scrollTo('about', $event)">
              <span data-edit-id="navbar.about" data-edit-label="Navbar About">{{
                content.getNavbarLabel('about', lang.currentLang())
              }}</span>
            </a>
            <a href="#products" (click)="scrollTo('products', $event)">
              <span data-edit-id="navbar.products" data-edit-label="Navbar Products">{{
                content.getNavbarLabel('products', lang.currentLang())
              }}</span>
            </a>
            <a href="#origins" (click)="scrollTo('origins', $event)">
              <span data-edit-id="navbar.origins" data-edit-label="Navbar Origins">{{
                content.getNavbarLabel('origins', lang.currentLang())
              }}</span>
            </a>
            <a routerLink="/catalog">Catalog</a>
            <a routerLink="/blog">Blog</a>
            <a routerLink="/quote">Quote</a>
            <a href="#contact" (click)="scrollTo('contact', $event)">
              <span data-edit-id="navbar.contact" data-edit-label="Navbar Contact">{{
                content.getNavbarLabel('contact', lang.currentLang())
              }}</span>
            </a>
          </div>

          <div class="v-divider"></div>

          <!-- Toggles -->
          <div class="toggle-group">
            <button
              class="icon-btn"
              (click)="theme.toggleTheme()"
              [title]="theme.isDarkMode() ? 'Light Mode' : 'Dark Mode'"
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

            <button class="lang-btn" (click)="lang.toggleLanguage()">
              <span class="lang-code">{{ lang.currentLang() === 'en' ? 'AR' : 'EN' }}</span>
            </button>
            <a class="admin-link" routerLink="/admin/login" title="Admin Login">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                <path d="M10 17l5-5-5-5" />
                <path d="M15 12H3" />
              </svg>
            </a>
          </div>
        </div>

        <!-- Mobile Controls -->
        <div class="d-flex d-lg-none align-items-center gap-2">
          <button class="icon-btn" (click)="theme.toggleTheme()">
            <span class="btn-icon">
              @if (theme.isDarkMode()) {
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="5" />
                  <path
                    d="M12 1v2m0 18v2M4.22 4.22l1.42 1.42m12.72 12.72l1.42 1.42M1 12h2m18 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"
                  />
                </svg>
              } @else {
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
              }
            </span>
          </button>
          <button class="lang-btn" (click)="lang.toggleLanguage()">
            <span class="lang-code">{{ lang.currentLang() === 'en' ? 'AR' : 'EN' }}</span>
          </button>
          <button class="menu-toggle" (click)="toggleMenu()" [class.active]="isMenuOpen()">
            <span class="bar bar-1"></span>
            <span class="bar bar-2"></span>
            <span class="bar bar-3"></span>
          </button>
        </div>
      </div>

      <!-- Mobile Overlay Menu -->
      <div class="mobile-overlay" [class.show]="isMenuOpen()">
        <div class="overlay-links">
          <a href="#about" (click)="mobileNavigate('about', $event)">{{
            content.getNavbarLabel('about', lang.currentLang())
          }}</a>
          <a href="#products" (click)="mobileNavigate('products', $event)">{{
            content.getNavbarLabel('products', lang.currentLang())
          }}</a>
          <a href="#origins" (click)="mobileNavigate('origins', $event)">{{
            content.getNavbarLabel('origins', lang.currentLang())
          }}</a>
          <a routerLink="/catalog" (click)="toggleMenu()">Catalog</a>
          <a routerLink="/blog" (click)="toggleMenu()">Blog</a>
          <a routerLink="/quote" (click)="toggleMenu()">Quote</a>
          <a href="#contact" (click)="mobileNavigate('contact', $event)">{{
            content.getNavbarLabel('contact', lang.currentLang())
          }}</a>
          <a routerLink="/admin/login" (click)="toggleMenu()">Admin Login</a>
        </div>
      </div>
    </nav>
  `,
  styles: [
    `
      nav {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        z-index: 1000;
        padding: 1.5rem 0;
        transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
        background: transparent;
      }
      nav.scrolled {
        padding: 0.8rem 0;
        background: var(--bg-surface);
        backdrop-filter: blur(20px);
        box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
        border-bottom: 1px solid var(--border-color);
      }

      .nav-content {
        display: flex;
        justify-content: space-between;
        align-items: center;
        position: relative;
        z-index: 1002;
      }

      .brand {
        display: flex;
        align-items: center;
        text-decoration: none;
      }

      .logo-wrapper {
        position: relative;
        overflow: hidden;
        border-radius: 12px;
      }

      .logo-img {
        height: 70px;
        width: auto;
        transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
        filter: drop-shadow(0 0 8px rgba(245, 124, 0, 0.2));
        animation: float 4s ease-in-out infinite;
      }

      .logo-shine {
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
        transition: none;
        animation: shine 5s infinite;
      }

      @keyframes float {
        0%,
        100% {
          transform: translateY(0);
        }
        50% {
          transform: translateY(-8px);
        }
      }

      @keyframes shine {
        0% {
          left: -100%;
        }
        20% {
          left: 100%;
        }
        100% {
          left: 100%;
        }
      }

      .brand:hover .logo-img {
        transform: scale(1.08);
        filter: drop-shadow(0 0 20px rgba(245, 124, 0, 0.5)) brightness(1.1);
      }

      @media (max-width: 768px) {
        .logo-img {
          height: 50px;
        }
      }

      .v-divider {
        width: 1px;
        height: 24px;
        background: var(--border-color);
      }

      .toggle-group {
        display: flex;
        align-items: center;
        gap: 1rem;
        background: var(--bg-surface);
        padding: 0.4rem;
        border-radius: 100px;
        border: 1px solid var(--border-color);
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
        transition: all 0.3s ease;
        padding: 0.5rem;
        border-radius: 50%;
      }

      .admin-link {
        width: 38px;
        height: 38px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        color: var(--text-primary);
        border-radius: 50%;
        text-decoration: none;
        transition: all 0.3s ease;
      }

      .admin-link:hover {
        background: var(--border-color);
        transform: translateY(-2px);
      }

      .admin-link svg {
        width: 18px;
        height: 18px;
      }

      .icon-btn:hover,
      .lang-btn:hover {
        background: var(--border-color);
        transform: translateY(-2px);
      }

      .btn-icon svg {
        width: 20px;
        height: 20px;
      }

      .lang-code {
        font-size: 0.75rem;
        font-weight: 700;
        letter-spacing: 1px;
        min-width: 24px;
      }

      .links {
        display: flex;
        align-items: center;
        gap: 2.5rem;
      }
      .links a {
        color: var(--text-secondary);
        text-decoration: none;
        font-size: 0.85rem;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 2px;
        position: relative;
        transition: color 0.3s ease;
      }
      .links a:hover {
        color: var(--color-primary);
      }
      .links a::after {
        content: '';
        position: absolute;
        width: 0;
        height: 2px;
        bottom: -4px;
        left: 0;
        background-color: var(--color-primary);
        transition: width 0.3s cubic-bezier(0.16, 1, 0.3, 1);
      }
      .links a:hover::after {
        width: 100%;
      }

      /* Hamburger Toggle */
      .menu-toggle {
        background: none;
        border: none;
        cursor: pointer;
        padding: 10px;
        display: flex;
        flex-direction: column;
        gap: 6px;
        z-index: 1002;
      }
      .bar {
        width: 25px;
        height: 2px;
        background-color: var(--text-primary);
        transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        border-radius: 2px;
      }
      .menu-toggle.active .bar-1 {
        transform: translateY(8px) rotate(45deg);
      }
      .menu-toggle.active .bar-2 {
        opacity: 0;
        transform: translateX(-10px);
      }
      .menu-toggle.active .bar-3 {
        transform: translateY(-8px) rotate(-45deg);
      }

      /* Mobile Overlay */
      .mobile-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100vh;
        background: var(--bg-primary);
        backdrop-filter: blur(30px);
        z-index: 1001;
        display: flex;
        justify-content: center;
        align-items: center;
        opacity: 0;
        visibility: hidden;
        transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        pointer-events: none;
      }
      .mobile-overlay.show {
        opacity: 1;
        visibility: visible;
        pointer-events: auto;
      }
      .overlay-links {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 2.5rem;
      }
      .overlay-links a {
        color: var(--text-primary);
        text-decoration: none;
        font-size: 2rem;
        font-family: var(--font-display);
        font-weight: 700;
        letter-spacing: 4px;
        text-transform: uppercase;
        opacity: 0;
        transform: translateY(30px);
        transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
      }
      .mobile-overlay.show .overlay-links a {
        opacity: 1;
        transform: translateY(0);
      }
      /* Staggered link animation */
      .mobile-overlay.show .overlay-links a:nth-child(1) {
        transition-delay: 0.1s;
      }
      .mobile-overlay.show .overlay-links a:nth-child(2) {
        transition-delay: 0.2s;
      }
      .mobile-overlay.show .overlay-links a:nth-child(3) {
        transition-delay: 0.3s;
      }
      .mobile-overlay.show .overlay-links a:nth-child(4) {
        transition-delay: 0.4s;
      }

      /* Custom Cursor Styles */
      .custom-cursor-dot {
        width: 10px;
        height: 10px;
        background-color: var(--color-primary);
        border-radius: 50%;
        position: fixed;
        top: -5px;
        left: -5px;
        pointer-events: none;
        z-index: 9999;
        mix-blend-mode: difference;
      }
      .custom-cursor-ring {
        width: 40px;
        height: 40px;
        border: 2px solid var(--color-primary);
        border-radius: 50%;
        position: fixed;
        top: -20px;
        left: -20px;
        pointer-events: none;
        z-index: 9998;
        transition: transform 0.1s;
        mix-blend-mode: difference;
      }
      @media (max-width: 768px) {
        .custom-cursor-dot,
        .custom-cursor-ring {
          display: none;
        }
      }
    `,
  ],
})
export class NavbarComponent {
  isScrolled = false;
  isMenuOpen = signal(false);
  private animationService = inject(AnimationService);
  theme = inject(ThemeService);
  lang = inject(LanguageService);
  content = inject(SiteContentService);
  private readonly router = inject(Router);

  mouseX = () => this.animationService.mousePosition().x;
  mouseY = () => this.animationService.mousePosition().y;
  lagX = () => this.animationService.laggingPosition().x;
  lagY = () => this.animationService.laggingPosition().y;

  @HostListener('window:scroll')
  onScroll() {
    this.isScrolled = window.scrollY > 50;
  }

  toggleMenu() {
    this.isMenuOpen.set(!this.isMenuOpen());
    if (this.isMenuOpen()) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }

  scrollTo(id: string, event: Event) {
    event.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      window.history.replaceState(null, '', `#${id}`);
      return;
    }

    this.router.navigate(['/'], { fragment: id }).then(() => {
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
      }, 80);
    });
  }

  scrollToTop(event: Event) {
    event.preventDefault();
    if (this.router.url.split('#')[0] !== '/') {
      this.router.navigateByUrl('/');
      return;
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
    window.history.replaceState(null, '', '/');
  }

  mobileNavigate(id: string, event: Event) {
    this.toggleMenu();
    // Small delay to let the menu close before scrolling for better performance
    setTimeout(() => {
      this.scrollTo(id, event);
    }, 400);
  }
}
