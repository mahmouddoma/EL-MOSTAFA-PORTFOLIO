import { Component, inject } from '@angular/core';
import { ScrollRevealDirective } from '../../shared/directives/scroll-reveal.directive';
import { LanguageService } from '../../core/services/language.service';
import { SiteContentService } from '../../core/services/site-content.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [ScrollRevealDirective],
  template: `
    <footer class="footer pt-5 pb-4" id="contact" appScrollReveal>
      <div class="footer-nano-line"></div>
      <div class="container pt-4">
        <div class="row mb-5">
          <div class="col-md-6 mb-4 mb-md-0 text-center text-md-start">
            <h2 class="brand-glow mb-3" data-edit-id="footer.brandText" data-edit-label="Footer Brand" data-edit-scope="global">{{ content.getFooterValue('brandText', lang.currentLang()) }}</h2>
            <p class="text-white-50 mx-auto ms-md-0 me-md-auto" style="max-width: 350px">
              <span data-edit-id="footer.description" data-edit-label="Footer Description" data-edit-type="textarea">{{ content.getFooterValue('description', lang.currentLang()) }}</span>
            </p>
          </div>
          <div class="col-md-6 text-center text-md-end">
            <h3 class="font-playfair theme-text mb-4">
              {{ lang.translate('footer.touch') }}<span class="text-primary">{{ lang.translate('footer.touchColor') }}</span>
            </h3>
            <ul class="contact-list list-unstyled">
              <li class="mb-2">
                <strong class="text-white-50 me-2">{{ lang.translate('footer.addressLabel') }}</strong>
                <span class="contact-value" data-edit-id="footer.address" data-edit-label="Footer Address">{{ content.getFooterValue('address', lang.currentLang()) }}</span>
              </li>
              <li class="mb-2">
                <strong class="text-white-50 me-2">{{ lang.translate('footer.emailLabel') }}</strong>
                <span class="contact-value" data-edit-id="footer.email" data-edit-label="Footer Email" data-edit-scope="global">{{ content.getFooterValue('email', lang.currentLang()) }}</span>
              </li>
              <li class="mb-0">
                <strong class="text-white-50 me-2">{{ lang.translate('footer.phoneLabel') }}</strong>
                <span class="contact-value" data-edit-id="footer.phone" data-edit-label="Footer Phone" data-edit-scope="global">{{ content.getFooterValue('phone', lang.currentLang()) }}</span>
              </li>
            </ul>
          </div>
        </div>

        <div class="row pt-4 mt-4 bottom-bar align-items-center">
          <div class="col-md-6 mb-3 mb-md-0 text-center text-md-start">
            <small class="text-white-50"
              >&copy; {{ currentYear }} {{ lang.translate('footer.rights') }}</small
            >
          </div>
          <div class="col-md-6 text-center text-md-end footer-links">
            <a href="#" class="footer-link me-4">{{ lang.translate('footer.privacy') }}</a>
            <a href="#" class="footer-link">{{ lang.translate('footer.terms') }}</a>
          </div>
        </div>
      </div>
    </footer>
  `,
  styles: [
    `
      .footer {
        position: relative;
        z-index: 10;
        background-color: var(--bg-surface);
        transition: background-color 0.5s ease;
      }

      .footer-nano-line {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 1px;
        background: linear-gradient(90deg, transparent, rgba(245, 124, 0, 0.5), transparent);
        box-shadow: 0 0 15px rgba(245, 124, 0, 0.4);
      }

      .brand-glow {
        font-family: var(--font-display);
        font-weight: 900;
        letter-spacing: 3px;
        margin: 0;
        font-size: 2.5rem;
        background: linear-gradient(45deg, var(--text-primary), var(--color-primary));
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        transition: all 0.5s ease;
        cursor: default;
      }
      .brand-glow:hover {
        background: linear-gradient(45deg, #f57c00, #fff);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        text-shadow: 0 0 20px rgba(245, 124, 0, 0.3);
      }

      .font-playfair {
        font-family: var(--font-display);
      }

      .text-primary {
        color: var(--color-primary) !important;
      }

      .theme-text {
        color: var(--text-primary);
      }

      .text-white-50 {
        color: var(--text-secondary) !important;
        font-size: 0.95rem;
      }

      .contact-list strong {
        font-size: 0.75rem;
        letter-spacing: 1px;
      }

      .contact-value {
        font-family: var(--font-body);
        color: var(--text-primary);
      }

      .bottom-bar {
        border-top: 1px solid var(--border-color);
      }

      .footer-link {
        color: var(--text-secondary);
        text-decoration: none;
        font-size: 0.85rem;
        position: relative;
        padding-bottom: 2px;
        transition: color 0.3s ease;
      }

      .footer-link::after {
        content: '';
        position: absolute;
        width: 0;
        height: 1px;
        bottom: 0;
        left: 0;
        background-color: var(--color-primary);
        transition: width 0.3s ease;
      }

      .footer-link:hover {
        color: #fff;
      }

      .footer-link:hover::after {
        width: 100%;
      }
    `,
  ],
})
export class FooterComponent {
  currentYear = new Date().getFullYear();
  lang = inject(LanguageService);
  content = inject(SiteContentService);
}
