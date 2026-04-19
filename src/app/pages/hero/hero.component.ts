import { Component, HostListener, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, transition, style, animate, query, stagger } from '@angular/animations';
import { AnimationService } from '../../core/services/animation.service';

interface FloatingFruit {
  imgSrc: string;
  left: string;
  top: string;
  duration: string;
  delay: string;
  speedMultiplier: number;
  translateY: number;
  size: number;
}

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="hero-section" id="home" [@heroEntry]>
      <!-- Glowing Mouse Tracker Orb -->
      <div
        class="hero-orb"
        [style.transform]="'translate(' + mouseX() + 'px, ' + mouseY() + 'px)'"
      ></div>

      <!-- Floating Parallax Real Fruits (Behind text) -->
      <div class="fruits-layer">
        <div
          *ngFor="let fruit of floatingFruits"
          class="floating-fruit"
          [style.left]="fruit.left"
          [style.top]="fruit.top"
          [style.width.px]="fruit.size"
          [style.height.px]="fruit.size"
          [style.animation-duration]="fruit.duration"
          [style.animation-delay]="fruit.delay"
          [style.transform]="'translateY(' + fruit.translateY + 'px)'"
        >
          <img [src]="fruit.imgSrc" class="real-fruit" />
        </div>
      </div>

      <div class="container hero-content">
        <div class="hero-text-wrapper stagger-item">
          <span class="eyebrow glass-panel">PREMIUM FRUIT IMPORTERS</span>
        </div>
        <div class="hero-title-wrapper stagger-item blend-text-container">
          <h1 class="hero-title blend-mode-difference">
            EL MOSTAFA
            <span class="hero-title-outline">EL MOSTAFA</span>
          </h1>
        </div>
        <div class="hero-subtitle-wrapper stagger-item">
          <p class="hero-subtitle">
            Cairo's leading importer of premium tropical and exotic fruits. Sourced globally,
            delivered fresh.
          </p>
        </div>
        <div class="hero-cta-wrapper stagger-item">
          <button class="btn btn-primary cta-button glow-border" (click)="scrollToProducts()">
            <span style="position:relative; z-index:2">EXPLORE PRODUCTS</span>
          </button>
        </div>
      </div>
    </section>
  `,
  styles: [
    `
      .hero-section {
        height: 100vh;
        width: 100%;
        background-color: var(--color-dark);
        position: relative;
        overflow: hidden;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .hero-orb {
        position: absolute;
        top: -200px;
        left: -200px;
        width: 400px;
        height: 400px;
        background: radial-gradient(circle, rgba(245, 124, 0, 0.15) 0%, rgba(245, 124, 0, 0) 70%);
        border-radius: 50%;
        pointer-events: none;
        z-index: 1;
        transition: transform 0.1s linear;
      }
      .hero-content {
        position: relative;
        z-index: 10;
        text-align: center;
        color: var(--color-white, #fff);
        pointer-events: none;
      }
      .hero-content * {
        pointer-events: auto;
      }

      .eyebrow {
        font-size: 0.8rem;
        text-transform: uppercase;
        letter-spacing: 4px;
        color: var(--color-primary);
        margin-bottom: 2rem;
        display: inline-block;
        font-weight: 600;
        padding: 8px 16px;
        border-radius: 30px;
      }
      .blend-text-container {
        position: relative;
        z-index: 20;
        mix-blend-mode: exclusion;
      }
      .hero-title {
        font-family: var(--font-display);
        font-size: clamp(4rem, 12vw, 11rem);
        font-weight: 900;
        line-height: 0.9;
        margin: 0;
        position: relative;
        text-transform: uppercase;
        color: #fff;
      }
      .hero-title-outline {
        display: block;
        color: transparent;
        -webkit-text-stroke: 2px rgba(255, 255, 255, 0.4);
      }
      .hero-subtitle {
        font-size: clamp(1rem, 2vw, 1.25rem);
        max-width: 600px;
        margin: 2rem auto;
        color: rgba(255, 255, 255, 0.7);
        line-height: 1.6;
      }
      .cta-button {
        padding: 1rem 3rem;
        font-size: 1rem;
        letter-spacing: 1.5px;
        background: var(--color-primary);
        border: none;
        border-radius: 50px;
        color: #fff;
        font-weight: 600;
        text-transform: uppercase;
        cursor: pointer;
        transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
      }
      .cta-button:hover {
        transform: translateY(-5px) scale(1.05);
        background: #f57c00;
        box-shadow: 0 15px 30px rgba(245, 124, 0, 0.4);
      }

      /* Floating Real Fruits */
      .fruits-layer {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 5;
        pointer-events: none;
      }
      .floating-fruit {
        position: absolute;
        opacity: 0.8;
        animation: floatFruit infinite alternate cubic-bezier(0.4, 0, 0.2, 1);
        will-change: transform;
      }
      .real-fruit {
        width: 100%;
        height: 100%;
        object-fit: contain;
        filter: contrast(1.2) brightness(1.1);
      }

      @keyframes floatFruit {
        0% {
          transform: translateY(0) rotate(0deg);
        }
        100% {
          transform: translateY(-40px) rotate(20deg);
        }
      }
    `,
  ],
  animations: [
    trigger('heroEntry', [
      transition(':enter', [
        query(
          '.stagger-item',
          [
            style({ opacity: 0, filter: 'blur(10px)', transform: 'translateY(60px)' }),
            stagger(150, [
              animate(
                '1.2s cubic-bezier(0.16, 1, 0.3, 1)',
                style({ opacity: 1, filter: 'blur(0)', transform: 'translateY(0)' }),
              ),
            ]),
          ],
          { optional: true },
        ),
      ]),
    ]),
  ],
})
export class HeroComponent implements OnInit {
  floatingFruits: FloatingFruit[] = [];
  private animationService = inject(AnimationService);

  mouseX = () => this.animationService.laggingPosition().x;
  mouseY = () => this.animationService.laggingPosition().y;

  ngOnInit() {
    const images = [
      'assets/real-orange.png',
      'assets/real-kiwi.png',
      'assets/real-strawberry.png',
      'assets/real-orange.png',
      'assets/real-kiwi.png',
    ];

    this.floatingFruits = images.map((imgUrl, i) => ({
      imgSrc: imgUrl,
      left: `${5 + Math.random() * 85}%`,
      top: `${10 + Math.random() * 70}%`,
      duration: `${7 + Math.random() * 6}s`,
      delay: `${Math.random() * 2}s`,
      speedMultiplier: 0.15 + Math.random() * 0.4,
      translateY: 0,
      size: 100 + Math.random() * 150, // between 100px and 250px
    }));
  }

  @HostListener('window:scroll')
  onScroll() {
    const scrollY = window.scrollY;
    this.floatingFruits.forEach((fruit) => {
      fruit.translateY = scrollY * fruit.speedMultiplier;
    });
  }

  scrollToProducts() {
    document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
  }
}
