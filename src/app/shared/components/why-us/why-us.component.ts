import { Component } from '@angular/core';

@Component({
  selector: 'app-why-us',
  standalone: true,
  template: `
    <section class="why-us py-5 bg-dark" id="why-us" appScrollReveal>
      <div class="container py-5">
        <div class="row text-center mb-5">
          <div class="col-12">
            <span class="eyebrow">OUR COMMITMENT</span>
            <h2 class="display-4 text-white font-playfair fw-bold mb-3">Why El Mostafa</h2>
            <p class="text-white-50 mx-auto" style="max-width: 600px;">
              Excellence in every bite. Quality in every drop. We go beyond simple importation to
              deliver an unmatched standard of freshness and taste.
            </p>
          </div>
        </div>
        <div class="row g-4 justify-content-center">
          <div class="col-12 col-md-4">
            <div class="glass-pillar">
              <div class="bg-number font-playfair">1</div>
              <div class="pillar-content">
                <h3 class="font-playfair">Global Network</h3>
                <p>
                  We source directly from premium farms across Italy, Greece, Kenya, and beyond to
                  ensure peak freshness and variety.
                </p>
              </div>
            </div>
          </div>
          <div class="col-12 col-md-4">
            <div class="glass-pillar" style="transition-delay: 0.1s">
              <div class="bg-number font-playfair">2</div>
              <div class="pillar-content">
                <h3 class="font-playfair">Temperature Controlled</h3>
                <p>
                  State-of-the-art cold chain logistics guarantee our fruits arrive in Cairo exactly
                  as pristine as nature intended.
                </p>
              </div>
            </div>
          </div>
          <div class="col-12 col-md-4">
            <div class="glass-pillar" style="transition-delay: 0.2s">
              <div class="bg-number font-playfair">3</div>
              <div class="pillar-content">
                <h3 class="font-playfair">Unmatched Quality</h3>
                <p>
                  Every single piece is hand-selected and quality-inspected to meet our rigorously
                  high standards before it reaches you.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [
    `
      .why-us {
        background-color: var(--color-dark);
        position: relative;
      }
      .bg-dark {
        background-color: var(--color-dark);
      }
      .eyebrow {
        color: var(--color-primary);
        text-transform: uppercase;
        letter-spacing: 3px;
        font-size: 0.8rem;
        font-weight: 700;
        margin-bottom: 1rem;
        display: inline-block;
      }
      .text-white {
        color: #fff;
      }
      .text-white-50 {
        color: rgba(255, 255, 255, 0.6);
        font-size: 1.1rem;
        line-height: 1.6;
      }
      .font-playfair {
        font-family: var(--font-display);
      }

      .glass-pillar {
        position: relative;
        padding: 2.5rem 2rem;
        background: radial-gradient(
          circle at top right,
          rgba(40, 40, 45, 1) 0%,
          rgba(18, 18, 20, 1) 100%
        );
        border: 1px solid rgba(255, 255, 255, 0.05);
        border-radius: 16px;
        height: 100%;
        color: #fff;
        overflow: hidden;
        transition:
          transform 0.4s cubic-bezier(0.16, 1, 0.3, 1),
          border-color 0.4s ease,
          box-shadow 0.4s ease;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        cursor: default;
      }

      .glass-pillar:hover {
        transform: translateY(-10px);
        border-color: rgba(245, 124, 0, 0.3);
        box-shadow: 0 20px 40px rgba(245, 124, 0, 0.1);
      }

      .bg-number {
        position: absolute;
        top: -20px;
        right: 10px;
        font-size: 10rem;
        font-weight: 900;
        color: rgba(255, 255, 255, 0.02);
        line-height: 1;
        z-index: 0;
        transition:
          transform 0.6s cubic-bezier(0.16, 1, 0.3, 1),
          color 0.6s ease;
        user-select: none;
        pointer-events: none;
      }

      .glass-pillar:hover .bg-number {
        color: rgba(245, 124, 0, 0.06);
        transform: translateY(-15px) scale(1.05);
      }

      .pillar-content {
        position: relative;
        z-index: 2;
        display: flex;
        flex-direction: column;
        height: 100%;
      }

      .glass-pillar h3 {
        margin-top: 1rem;
        margin-bottom: 1.5rem;
        font-size: 1.6rem;
        color: var(--color-primary);
        font-weight: 700;
        letter-spacing: 0.5px;
        transition: color 0.3s ease;
      }

      .glass-pillar:hover h3 {
        color: var(--color-highlight, #ff9800);
      }

      .glass-pillar p {
        color: rgba(255, 255, 255, 0.7);
        line-height: 1.7;
        font-size: 0.95rem;
        margin-bottom: 0;
      }

      @media (max-width: 768px) {
        .bg-number {
          font-size: 6.5rem;
          top: -10px;
        }
        .glass-pillar {
          padding: 2rem 1.5rem;
        }
        .glass-pillar h3 {
          font-size: 1.4rem;
        }
      }
    `,
  ],
})
export class WhyUsComponent {}
