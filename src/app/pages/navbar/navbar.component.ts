import { Component, HostListener, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnimationService } from '../../core/services/animation.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <!-- Custom Cursor -->
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
          <img src="assets/logo.png" alt="EL MOSTAFA" class="logo-img" />
        </a>

        <!-- Desktop Links -->
        <div class="links d-none d-md-flex">
          <a href="#about" (click)="scrollTo('about', $event)">About</a>
          <a href="#products" (click)="scrollTo('products', $event)">Products</a>
          <a href="#origins" (click)="scrollTo('origins', $event)">Origins</a>
          <a href="#contact" (click)="scrollTo('contact', $event)">Contact</a>
        </div>

        <!-- Mobile Toggle -->
        <button class="menu-toggle d-md-none" (click)="toggleMenu()" [class.active]="isMenuOpen()">
          <span class="bar bar-1"></span>
          <span class="bar bar-2"></span>
          <span class="bar bar-3"></span>
        </button>
      </div>

      <!-- Mobile Overlay Menu -->
      <div class="mobile-overlay" [class.show]="isMenuOpen()">
        <div class="overlay-links">
          <a href="#about" (click)="mobileNavigate('about', $event)">About</a>
          <a href="#products" (click)="mobileNavigate('products', $event)">Products</a>
          <a href="#origins" (click)="mobileNavigate('origins', $event)">Origins</a>
          <a href="#contact" (click)="mobileNavigate('contact', $event)">Contact</a>
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
        background: rgba(10, 10, 10, 0.7);
        backdrop-filter: blur(20px);
        box-shadow: 0 4px 30px rgba(0, 0, 0, 0.2);
        border-bottom: 1px solid rgba(255, 255, 255, 0.05);
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

      .logo-img {
        height: 50px;
        width: auto;
        transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
        filter: drop-shadow(0 0 8px rgba(245, 124, 0, 0.2));
      }

      .brand:hover .logo-img {
        transform: scale(1.05);
        filter: drop-shadow(0 0 15px rgba(245, 124, 0, 0.4)) brightness(1.1);
      }

      @media (max-width: 768px) {
        .logo-img {
          height: 40px;
        }
      }

      .links {
        gap: 2.5rem;
      }
      .links a {
        color: rgba(255, 255, 255, 0.7);
        text-decoration: none;
        font-size: 0.85rem;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 2px;
        position: relative;
        transition: color 0.3s ease;
      }
      .links a:hover {
        color: #fff;
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
        background-color: #fff;
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
        background: rgba(10, 10, 12, 0.98);
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
        color: #fff;
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
    }
  }

  scrollToTop(event: Event) {
    event.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  mobileNavigate(id: string, event: Event) {
    this.toggleMenu();
    // Small delay to let the menu close before scrolling for better performance
    setTimeout(() => {
      this.scrollTo(id, event);
    }, 400);
  }
}
