import { ApplicationConfig, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';

import { routes } from './app.routes';
import { productsReducer, productsFeatureKey } from './state/products/products.reducer';
import { originsReducer, originsFeatureKey } from './state/origins/origins.reducer';
import { ProductsEffects } from './state/products/products.effects';
import { OriginsEffects } from './state/origins/origins.effects';
import { PRODUCT_REPOSITORY_TOKEN, ORIGIN_REPOSITORY_TOKEN } from './core/tokens/repository.tokens';
import { ProductRepositoryImpl } from './data/repositories/product.repository.impl';
import { OriginRepositoryImpl } from './data/repositories/origin.repository.impl';
import { authInterceptor } from './admin/core/interceptors/auth.interceptor';
import { langInterceptor } from './core/interceptors/lang.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZonelessChangeDetection(),
    provideRouter(
      routes,
      withInMemoryScrolling({ anchorScrolling: 'enabled', scrollPositionRestoration: 'enabled' }),
    ),
    provideHttpClient(withInterceptors([authInterceptor, langInterceptor])),
    provideAnimations(),
    provideStore({
      [productsFeatureKey]: productsReducer,
      [originsFeatureKey]: originsReducer,
    }),
    provideEffects([ProductsEffects, OriginsEffects]),
    { provide: PRODUCT_REPOSITORY_TOKEN, useClass: ProductRepositoryImpl },
    { provide: ORIGIN_REPOSITORY_TOKEN, useClass: OriginRepositoryImpl },
  ],
};
