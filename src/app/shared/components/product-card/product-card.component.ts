import { Component, Input, Output, EventEmitter, HostListener, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '../../../domain/models/product.model';
import { LanguageService } from '../../../core/services/language.service';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      class="product-card premium-showcase"
      (click)="cardClicked.emit(product)"
      (mouseenter)="onHover(true)"
      (mouseleave)="onHover(false)"
      [style.transform]="getTransform()"
    >
      <div class="glass-sweep"></div>

      <!-- Core background -->
      <div class="card-bg"></div>

      <!-- Content -->
      <div class="card-content">
        <!-- Floating Fruit & Aura -->
        <div class="fruit-stage">
          <div class="aura-glow"></div>
          <img
            [src]="product.imageUrl"
            class="fruit-img levitate"
            [style.filter]="
              product.imageFilter ? product.imageFilter + ' contrast(1.1)' : 'contrast(1.1)'
            "
            alt="{{ product.name }}"
            loading="lazy"
            decoding="async"
          />
          <div class="pedestal-line"></div>
        </div>

        <!-- Stable Info (Always visible, clean, small) -->
        <div class="meta-section">
          <div class="category-indicator">{{ product.category }}</div>
          <h3 class="fruit-title font-playfair">{{ lang.isRtl() ? product.name_ar : product.name }}</h3>
        </div>

        <!-- Hidden Hover Details -->
        <div class="hover-details">
          <p class="fruit-origin text-white mb-2">
            <span class="text-primary me-1">➤</span>{{ product.origin.join(', ') }}
          </p>
          <div class="pill-container" *ngIf="product.varieties && product.varieties.length > 0">
            <span
              class="variety-pill"
              *ngFor="let variety of product.varieties; let i = index"
              [style.transition-delay]="i * 0.05 + 's'"
            >
              {{ variety }}
            </span>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .font-playfair {
        font-family: var(--font-display);
      }

      .premium-showcase {
        position: relative;
        height: 320px; /* Very compact fixed height */
        border-radius: 12px;
        cursor: pointer;
        transition: transform 0.2s ease-out;
        box-shadow: 0 15px 35px rgba(0, 0, 0, 0.4);
        background: transparent;
        overflow: hidden;
        max-width: 260px;
        margin: 0 auto;
      }

      .card-bg {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: var(--card-bg);
        border: 1px solid var(--border-color);
        border-radius: 12px;
        z-index: 1;
        transition:
          background 0.5s ease,
          border-color 0.5s ease;
      }

      .premium-showcase:hover .card-bg {
        border-color: var(--color-primary);
        background: var(--bg-surface);
      }

      /* Glass Shine Sweep */
      .glass-sweep {
        position: absolute;
        top: 0;
        left: -100%;
        width: 50%;
        height: 100%;
        background: linear-gradient(to right, transparent, rgba(255, 255, 255, 0.06), transparent);
        transform: skewX(-20deg);
        z-index: 10;
        pointer-events: none;
      }
      .premium-showcase:hover .glass-sweep {
        animation: shine 1.2s ease-out forwards;
      }
      @keyframes shine {
        100% {
          left: 200%;
        }
      }

      .card-content {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 5;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        padding: 1.5rem 1rem;
      }

      /* FRUIT STAGE */
      .fruit-stage {
        position: relative;
        width: 100%;
        height: 140px;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-top: 1rem;
        transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
      }

      .premium-showcase:hover .fruit-stage {
        transform: translateY(-25px) scale(1.15); /* Lift and scale fruit */
      }

      .aura-glow {
        position: absolute;
        width: 70px;
        height: 70px;
        background: var(--color-primary);
        filter: blur(40px);
        opacity: 0;
        transition: opacity 0.6s ease;
        z-index: 1;
      }
      .premium-showcase:hover .aura-glow {
        opacity: 0.35;
      }

      .fruit-img {
        height: 140px;
        width: 140px;
        object-fit: contain;
        z-index: 3;
        filter: drop-shadow(0 15px 15px rgba(0, 0, 0, 0.6));
      }

      /* Floating Animation */
      @keyframes levitate {
        0% {
          transform: translateY(0px);
        }
        100% {
          transform: translateY(-8px);
        }
      }
      .levitate {
        animation: levitate 3s infinite alternate ease-in-out;
      }

      /* Highlight Line Pedestal */
      .pedestal-line {
        position: absolute;
        bottom: -15px;
        width: 50px;
        height: 1px;
        background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.15), transparent);
        z-index: 2;
        transition:
          width 0.5s,
          background 0.5s,
          box-shadow 0.5s;
      }
      .premium-showcase:hover .pedestal-line {
        width: 90px;
        background: linear-gradient(90deg, transparent, var(--color-primary), transparent);
        box-shadow: 0 0 12px var(--color-primary);
      }

      /* META SECTION */
      .meta-section {
        margin-top: auto;
        padding-bottom: 0.5rem;
        text-align: center;
        transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
      }
      .premium-showcase:hover .meta-section {
        transform: translateY(-55px);
      }

      .category-indicator {
        font-size: 0.6rem;
        text-transform: uppercase;
        letter-spacing: 2.5px;
        color: var(--color-primary);
        margin-bottom: 0.4rem;
        opacity: 0.8;
      }

      .fruit-title {
        font-size: 1.15rem;
        font-weight: 700;
        color: var(--text-primary);
        margin: 0;
        transition: color 0.3s;
      }
      .premium-showcase:hover .fruit-title {
        color: var(--color-highlight);
      }

      /* HOVER DETAILS */
      .hover-details {
        position: absolute;
        bottom: 1.25rem;
        left: 1rem;
        right: 1rem;
        opacity: 0;
        transform: translateY(20px);
        transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
        text-align: center;
        pointer-events: none;
      }
      .premium-showcase:hover .hover-details {
        opacity: 1;
        transform: translateY(0);
        pointer-events: auto;
      }

      .fruit-origin {
        font-size: 0.8rem;
        margin-bottom: 0.8rem;
      }

      .pill-container {
        display: flex;
        flex-wrap: wrap;
        gap: 0.35rem;
        justify-content: center;
      }

      .variety-pill {
        font-size: 0.65rem;
        padding: 4px 8px;
        border-radius: 4px;
        background: var(--bg-surface);
        color: var(--text-secondary);
        border: 1px solid var(--border-color);
        opacity: 0;
        transform: translateY(15px) scale(0.9);
        transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
      }

      .premium-showcase:hover .variety-pill {
        opacity: 1;
        transform: translateY(0) scale(1);
        background: var(--color-primary);
        color: #fff;
        border-color: var(--color-primary);
      }
    `,
  ],
})
export class ProductCardComponent {
  lang = inject(LanguageService);
  @Input() product!: Product;
  @Output() cardClicked = new EventEmitter<Product>();

  isHovered = false;
  mouseX = 0;
  mouseY = 0;

  onHover(hovered: boolean) {
    if (!hovered) {
      this.mouseX = 0;
      this.mouseY = 0;
    }
    this.isHovered = hovered;
  }

  @HostListener('mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    if (this.isHovered) {
      const card = event.currentTarget as HTMLElement;
      const rect = card.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      this.mouseX = (x / rect.width - 0.5) * 15;
      this.mouseY = (y / rect.height - 0.5) * -15;
    }
  }

  getTransform() {
    if (this.isHovered) {
      return `perspective(1000px) rotateX(${this.mouseY}deg) rotateY(${this.mouseX}deg) scale(1.02)`;
    }
    return 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
  }
}
