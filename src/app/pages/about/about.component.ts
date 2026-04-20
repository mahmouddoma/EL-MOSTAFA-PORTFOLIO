import {
  Component,
  HostListener,
  OnInit,
  ElementRef,
  ViewChild,
  AfterViewInit,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { LanguageService } from '../../core/services/language.service';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="timeline-section" #timelineSection>
      <div class="sticky-viewport">
        <!-- Deep Parallax Typography Background -->
        <div
          class="bg-typography"
          [style.transform]="'translateY(-50%) translateX(' + scrollProgress * -30 + 'vw)'"
        >
          PAS<span class="text-outline">SION</span>
        </div>

        <div class="header-content" [style.opacity]="1 - scrollProgress * 5">
          <span class="eyebrow">{{ lang.translate('hero.story') }}</span>
          <h2 class="display-3 font-playfair fw-bold theme-text mb-0">
            {{ lang.translate('hero.journey') }}
          </h2>
          <p class="theme-text">{{ lang.translate('hero.scroll') }}</p>
        </div>

        <!-- The Glowing Pipeline -->
        <div class="pipeline-track">
          <div class="pipeline-fill" [style.height.%]="scrollProgress * 100"></div>
        </div>

        <!-- The Rolling Fruit Tracker -->
        <div class="tracker-container" [style.top.%]="scrollProgress * 100">
          <!-- Aura Glow -->
          <div
            class="tracker-glow"
            [style.transform]="'translate(-50%, -50%) scale(' + trackerScale + ')'"
          ></div>

          <img
            src="assets/real-orange.png"
            class="tracker-img"
            [style.filter]="'contrast(1.2)'"
            [style.opacity]="orangeOpacity"
            [style.transform]="
              'rotate(' + scrollProgress * 1080 + 'deg) scale(' + trackerScale + ')'
            "
            alt="Orange"
            loading="lazy"
            decoding="async"
          />
          <img
            src="assets/real-kiwi.png"
            class="tracker-img"
            [style.filter]="'contrast(1.2)'"
            [style.opacity]="kiwiOpacity"
            [style.transform]="
              'rotate(' + scrollProgress * 1080 + 'deg) scale(' + trackerScale + ')'
            "
            alt="Kiwi"
            loading="lazy"
            decoding="async"
          />
          <img
            src="assets/real-apple.png"
            class="tracker-img"
            [style.filter]="'contrast(1.2)'"
            [style.opacity]="strawberryOpacity"
            [style.transform]="
              'rotate(' + scrollProgress * 1080 + 'deg) scale(' + trackerScale + ')'
            "
            alt="Apple"
            loading="lazy"
            decoding="async"
          />
        </div>

        <!-- Nodes / Waypoints -->
        <div
          class="node-content node-left"
          [class.active]="scrollProgress > 0.15 && scrollProgress < 0.45"
          [style.top.%]="25"
        >
          <div class="glass-node">
            <span class="node-number">01</span>
            <h3 class="font-playfair text-gradient">{{ lang.translate('about.nodes.0.title') }}</h3>
            <p class="theme-text mb-0">
              {{ lang.translate('about.nodes.0.desc') }}
            </p>
          </div>
        </div>

        <!-- Node 2: The Selection (Show from 45% to 75%) -->
        <div
          class="node-content node-right"
          [class.active]="scrollProgress > 0.45 && scrollProgress < 0.75"
          [style.top.%]="50"
        >
          <div class="glass-node">
            <span class="node-number">02</span>
            <h3 class="font-playfair text-gradient">{{ lang.translate('about.nodes.1.title') }}</h3>
            <p class="theme-text mb-0">
              {{ lang.translate('about.nodes.1.desc') }}
            </p>
          </div>
        </div>

        <!-- Node 3: The Delivery (Show past 75%) -->
        <div
          class="node-content node-left"
          [class.active]="scrollProgress > 0.75"
          [style.top.%]="80"
        >
          <div class="glass-node">
            <span class="node-number">03</span>
            <h3 class="font-playfair text-gradient">{{ lang.translate('about.nodes.2.title') }}</h3>
            <p class="theme-text mb-0">
              {{ lang.translate('about.nodes.2.desc') }}
            </p>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [
    `
      .font-playfair {
        font-family: var(--font-display);
      }
      .text-gradient {
        background: linear-gradient(135deg, #f57c00 0%, #d32f2f 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }

      .timeline-section {
        position: relative;
        background-color: var(--bg-primary);
        height: 400vh;
        transition: background-color 0.5s ease;
      }

      .sticky-viewport {
        position: sticky;
        top: 0;
        height: 100vh;
        width: 100%;
        overflow: hidden;
        background-color: var(--bg-primary);
        display: flex;
        justify-content: center;
        align-items: center;
        transition: background-color 0.5s ease;
      }

      .bg-typography {
        position: absolute;
        top: 50%;
        left: 10%;
        font-family: var(--font-display);
        font-size: 35vw;
        font-weight: 900;
        color: var(--border-color);
        white-space: nowrap;
        pointer-events: none;
        z-index: 1;
      }
      .text-outline {
        color: transparent;
        -webkit-text-stroke: 2px var(--border-color);
      }

      /* Intro Header */
      .header-content {
        position: absolute;
        top: 15%;
        text-align: center;
        z-index: 10;
        transition: opacity 0.3s;
      }
      .eyebrow {
        color: var(--color-primary);
        text-transform: uppercase;
        letter-spacing: 4px;
        font-size: 0.8rem;
        font-weight: 700;
      }

      /* The Pipeline */
      .pipeline-track {
        position: absolute;
        top: 10vh;
        bottom: 10vh;
        left: 50%;
        width: 4px;
        transform: translateX(-50%);
        background: var(--border-color);
        border-radius: 4px;
        z-index: 5;
      }
      .pipeline-fill {
        width: 100%;
        background: linear-gradient(180deg, #f57c00, #d32f2f);
        border-radius: 4px;
        box-shadow: 0 0 20px #f57c00;
      }

      /* Target Roller */
      .tracker-container {
        position: absolute;
        left: 50%;
        z-index: 20;
        margin-top: 10vh;
      }
      .tracker-glow {
        position: absolute;
        top: 0;
        left: 0;
        width: 150px;
        height: 150px;
        border-radius: 50%;
        background: rgba(245, 124, 0, 0.4);
        filter: blur(40px);
        transform: translate(-50%, -50%);
        transition: transform 0.2s ease-out;
      }
      .tracker-img {
        position: absolute;
        top: -90px;
        left: -90px;
        width: 180px;
        height: 180px;
        object-fit: contain;
        transform-origin: center;
      }

      /* Narrative Nodes */
      .node-content {
        position: absolute;
        width: 35vw;
        max-width: 450px;
        z-index: 15;
        opacity: 0;
        pointer-events: none;
        transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
      }
      .node-left {
        left: 10%;
        transform: translateX(-40px);
      }
      .node-right {
        right: 10%;
        transform: translateX(40px);
      }
      .node-content.active {
        opacity: 1;
        transform: translateX(0);
      }

      .glass-node {
        background: var(--glass-bg);
        border: 1px solid var(--border-color);
        border-radius: 20px;
        padding: 2.5rem;
        position: relative;
        backdrop-filter: blur(15px);
        -webkit-backdrop-filter: blur(15px);
      }
      .theme-text {
        color: var(--text-primary);
      }
      .node-number {
        position: absolute;
        top: -30px;
        right: 20px;
        font-size: 5rem;
        font-family: var(--font-display);
        font-weight: 900;
        color: var(--border-color);
        line-height: 1;
      }

      .glass-node p {
        color: var(--text-secondary);
        line-height: 1.6;
      }

      @media (max-width: 991px) {
        .pipeline-track {
          left: 14%;
        }
        .tracker-container {
          left: 14%;
        }
        .tracker-img {
          width: 130px;
          height: 130px;
          top: -65px;
          left: -65px;
        }
        .tracker-glow {
          width: 110px;
          height: 110px;
        }
        .node-content {
          width: 70%;
          max-width: 380px;
        }
        .node-left,
        .node-right {
          left: 28%;
          transform: translateX(15px);
        }
        .glass-node {
          padding: 1.5rem;
        }
        .node-number {
          font-size: 4rem;
          top: -25px;
          right: 15px;
        }
        .display-3 {
          font-size: 2.8rem;
        }
        .bg-typography {
          display: none;
        }
      }

      @media (max-width: 576px) {
        .pipeline-track {
          left: 12%;
        }
        .tracker-container {
          left: 12%;
        }
        .tracker-img {
          width: 100px;
          height: 100px;
          top: -50px;
          left: -50px;
        }
        .node-left,
        .node-right {
          left: 28%;
          transform: translateX(15px);
        }
        .node-content {
          width: 72%;
        }
        h3 {
          font-size: 1.3rem;
        }
        p {
          font-size: 0.9rem;
        }
      }
    `,
  ],
})
export class AboutComponent implements AfterViewInit {
  @ViewChild('timelineSection') section!: ElementRef<HTMLElement>;
  lang = inject(LanguageService);

  scrollProgress = 0;
  trackerScale = 1;

  orangeOpacity = 1;
  kiwiOpacity = 0;
  strawberryOpacity = 0;

  private rectTop = 0;
  private rectHeight = 0;

  ngAfterViewInit() {
    // Small delay to ensure the DOM has settled for sticky bound calculations
    setTimeout(() => {
      this.updateBounds();
    }, 600);
  }

  @HostListener('window:resize')
  onResize() {
    this.updateBounds();
  }

  @HostListener('window:scroll')
  onScroll() {
    if (!this.rectHeight) return;

    // Track scroll globally across the entire 400vh section bounds
    const scrollY = window.scrollY;
    // How far we've scrolled into the section
    const rawProgress = (scrollY - this.rectTop) / (this.rectHeight - window.innerHeight);
    this.scrollProgress = Math.max(0, Math.min(1, rawProgress));

    // Calculate node popping physics
    const d1 = Math.max(0, 1 - Math.abs(this.scrollProgress - 0.25) * 15);
    const d2 = Math.max(0, 1 - Math.abs(this.scrollProgress - 0.5) * 15);
    const d3 = Math.max(0, 1 - Math.abs(this.scrollProgress - 0.8) * 15);
    this.trackerScale = 1 + (d1 + d2 + d3) * 0.4; // swells fruit size when passing a node

    // Image morphing transitions based on scroll depth
    if (this.scrollProgress < 0.35) {
      this.orangeOpacity = 1;
      this.kiwiOpacity = 0;
      this.strawberryOpacity = 0;
    } else if (this.scrollProgress < 0.45) {
      // Crossfade Orange -> Kiwi
      const t = (this.scrollProgress - 0.35) * 10;
      this.orangeOpacity = 1 - t;
      this.kiwiOpacity = t;
      this.strawberryOpacity = 0;
    } else if (this.scrollProgress < 0.65) {
      this.orangeOpacity = 0;
      this.kiwiOpacity = 1;
      this.strawberryOpacity = 0;
    } else if (this.scrollProgress < 0.75) {
      // Crossfade Kiwi -> Apple/Strawberry
      const t = (this.scrollProgress - 0.65) * 10;
      this.orangeOpacity = 0;
      this.kiwiOpacity = 1 - t;
      this.strawberryOpacity = t;
    } else {
      this.orangeOpacity = 0;
      this.kiwiOpacity = 0;
      this.strawberryOpacity = 1;
    }
  }

  private updateBounds() {
    const rect = this.section.nativeElement.getBoundingClientRect();
    this.rectTop = rect.top + window.scrollY;
    this.rectHeight = rect.height;
  }
}
