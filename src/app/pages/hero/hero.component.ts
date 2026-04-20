import { Component, HostListener, OnInit, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, transition, style, animate, query, stagger } from '@angular/animations';
import { AnimationService } from '../../core/services/animation.service';
import { LanguageService } from '../../core/services/language.service';

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
          *ngFor="let fruit of floatingFruits; let i = index"
          class="floating-fruit"
          [style.left]="fruit.left"
          [style.top]="fruit.top"
          [style.width.px]="fruit.size"
          [style.height.px]="fruit.size"
          [style.animation-duration]="fruit.duration"
          [style.animation-delay]="fruit.delay"
          [style.transform]="'translateY(' + fruit.translateY + 'px)'"
        >
          <img
            [src]="fruit.imgSrc"
            class="real-fruit"
            alt=""
            [attr.loading]="i < 2 ? 'eager' : 'lazy'"
            decoding="async"
            [attr.fetchpriority]="i === 0 ? 'high' : null"
            aria-hidden="true"
          />
        </div>
      </div>

      <div class="container hero-content">
        <div class="hero-text-wrapper stagger-item">
          <span class="eyebrow glass-panel">{{ lang.translate('hero.eyebrow') }}</span>
        </div>
        <div class="hero-title-wrapper stagger-item">
          <!-- Outline Title (Background Parallax) -->
          <div class="hero-title-outline-container" [style.transform]="getOutlineTransform()">
            <span
              *ngFor="let char of titleChars(); let i = index"
              class="char-outline"
              [style.transition-delay]="i * 0.05 + 's'"
            >
              {{ char === ' ' ? '&nbsp;' : char }}
            </span>
          </div>

          <!-- Solid Title (Main) -->
          <h1 class="hero-title">
            <span
              *ngFor="let char of titleChars(); let i = index"
              class="char-solid"
              [style.transition-delay]="i * 0.05 + 's'"
              [style.transform]="getCharTransform(i)"
            >
              {{ char === ' ' ? '&nbsp;' : char }}
            </span>
          </h1>
        </div>
        <div class="hero-subtitle-wrapper stagger-item">
          <p class="hero-subtitle">
            {{ lang.translate('hero.subtitle') }}
          </p>
        </div>
        <div class="hero-cta-wrapper stagger-item">
          <button class="btn btn-primary cta-button glow-border" (click)="scrollToProducts()">
            <span style="position:relative; z-index:2">{{ lang.translate('hero.cta') }}</span>
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
        background-color: var(--bg-primary);
        position: relative;
        overflow: hidden;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: background-color 0.5s ease;
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
        color: var(--text-primary);
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
      .hero-title-wrapper {
        position: relative;
        perspective: 1000px;
        margin: 2rem 0;
      }
      .hero-title {
        font-family: var(--font-display);
        font-size: clamp(3rem, 10vw, 9rem);
        font-weight: 900;
        line-height: 0.95;
        margin: 0;
        position: relative;
        text-transform: uppercase;
        color: var(--text-primary);
        display: flex;
        justify-content: center;
        gap: 0.1em;
        z-index: 10;
        direction: ltr;
      }
      :host-context([dir='rtl']) .hero-title {
        gap: 0;
        direction: rtl;
      }
      .char-solid {
        display: inline-block;
        transition:
          transform 0.2s cubic-bezier(0.16, 1, 0.3, 1),
          opacity 1s ease;
        animation: charReveal 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        opacity: 0;
        filter: blur(10px);
        transform: translateY(40px) rotateX(-45deg);
        position: relative;
      }
      @keyframes charReveal {
        to {
          opacity: 1;
          filter: blur(0);
          transform: translateY(0) rotateX(0);
        }
      }

      .hero-title-outline-container {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -40%);
        width: 100%;
        display: flex;
        justify-content: center;
        gap: 0.1em;
        font-family: var(--font-display);
        font-size: clamp(3.5rem, 11vw, 10rem);
        font-weight: 900;
        text-transform: uppercase;
        pointer-events: none;
        z-index: 1;
        opacity: 0.4;
        direction: ltr;
      }
      :host-context([dir='rtl']) .hero-title-outline-container {
        gap: 0;
        direction: rtl;
      }
      .char-outline {
        display: inline-block;
        color: transparent;
        -webkit-text-stroke: 1px var(--border-color);
        animation: charReveal 1.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        opacity: 0;
        transform: translateY(60px) scale(0.9);
      }

      .char-solid::after {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 50%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
        transform: skewX(-20deg);
        animation: shimmerLetter 6s infinite;
      }

      @keyframes shimmerLetter {
        0%,
        80% {
          left: -100%;
        }
        100% {
          left: 200%;
        }
      }

      .hero-subtitle {
        font-size: clamp(1rem, 2vw, 1.25rem);
        max-width: 600px;
        margin: 1.5rem auto;
        color: var(--text-secondary);
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
  lang = inject(LanguageService);

  mouseX = () => this.animationService.laggingPosition().x;
  mouseY = () => this.animationService.laggingPosition().y;

  titleChars = computed(() => {
    const title = this.lang.translate('hero.title');
    return this.lang.currentLang() === 'ar' ? [title] : title.split('');
  });

  titleX = computed(() => (this.mouseX() - window.innerWidth / 2) * 0.015);
  titleY = computed(() => (this.mouseY() - window.innerHeight / 2) * 0.015);

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

  getCharTransform(index: number) {
    const x = this.titleX() * (1 + (index % 3) * 0.2);
    const y = this.titleY() * (1 + (index % 2) * 0.2);
    return `translate(${x}px, ${y}px)`;
  }

  getOutlineTransform() {
    const x = -50 + this.titleX() * -0.5;
    const y = -40 + this.titleY() * -0.5;
    return `translate(${x}%, ${y}%)`;
  }

  scrollToProducts() {
    document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
  }
}
