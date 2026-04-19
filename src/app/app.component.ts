import { Component, HostListener, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';

import { NavbarComponent } from './pages/navbar/navbar.component';
import { HeroComponent } from './pages/hero/hero.component';
import { FruitSliceComponent } from './pages/fruit-slice/fruit-slice.component';
import { MarqueeComponent } from './shared/components/marquee/marquee.component';
import { AboutComponent } from './pages/about/about.component';
import { ProductsComponent } from './pages/products/products.component';
import { OriginsComponent } from './pages/origins/origins.component';
import { WhyUsComponent } from './shared/components/why-us/why-us.component';
import { FooterComponent } from './pages/footer/footer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    NavbarComponent,
    HeroComponent,
    FruitSliceComponent,
    MarqueeComponent,
    AboutComponent,
    ProductsComponent,
    OriginsComponent,
    WhyUsComponent,
    FooterComponent,
  ],
  template: `
    <app-navbar></app-navbar>
    <main>
      <app-hero></app-hero>
      <app-fruit-slice></app-fruit-slice>
      <app-marquee></app-marquee>
      <app-about></app-about>
      <app-products></app-products>
      <app-origins></app-origins>
      <app-why-us></app-why-us>
    </main>
    <app-footer></app-footer>
  `,
  styleUrls: [],
})
export class AppComponent {
  title = 'el-mostafa-portfolio';
  private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  @HostListener('window:scroll')
  onScroll() {
    if (this.isBrowser) {
      document.body.style.setProperty('--scroll-y', `${window.scrollY}px`);
      // Normalized scroll from 0 to 1 based on page height
      const maxScroll = document.body.scrollHeight - window.innerHeight;
      const progress = window.scrollY / maxScroll;
      document.body.style.setProperty('--scroll-progress', `${progress}`);
    }
  }
}
