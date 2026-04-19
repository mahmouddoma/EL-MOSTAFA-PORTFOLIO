import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-marquee',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="marquee-container">
      <div class="marquee-content">
        <span class="marquee-item" *ngFor="let item of items; let i = index">
          {{ item }}
        </span>
        <!-- Duplicate for seamless loop -->
        <span class="marquee-item" *ngFor="let item of items; let i = index">
          {{ item }}
        </span>
      </div>
    </div>
  `,
  styles: [`
    .marquee-container {
      background-color: var(--color-primary);
      color: var(--color-white, #fff);
      padding: 1rem 0;
      overflow: hidden;
      white-space: nowrap;
      position: relative;
      display: flex;
    }
    .marquee-content {
      display: inline-flex;
      animation: scroll 20s linear infinite;
    }
    .marquee-item {
      font-family: var(--font-body);
      font-weight: 700;
      text-transform: uppercase;
      font-size: 1.2rem;
      letter-spacing: 2px;
      padding: 0 2rem;
      display: inline-flex;
      align-items: center;
    }
    .marquee-item::after {
      content: '✦';
      margin-left: 4rem;
      color: var(--color-highlight);
    }
    @keyframes scroll {
      0% { transform: translateX(0); }
      100% { transform: translateX(-50%); }
    }
  `]
})
export class MarqueeComponent {
  @Input() items: string[] = [
    'PREMIUM QUALITY', 
    'IMPORTED DAILY', 
    '100% FRESH', 
    'GLOBAL ORIGINS', 
    'CAIRO BASED'
  ];
}
