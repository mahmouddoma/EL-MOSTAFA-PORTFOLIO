import { Routes } from '@angular/router';
import { adminAuthGuard } from './admin/core/guards/admin-auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/public-home/public-home.component').then((m) => m.PublicHomeComponent),
  },
  {
    path: 'admin/login',
    loadComponent: () =>
      import('./admin/pages/admin-login/admin-login.component').then((m) => m.AdminLoginComponent),
  },
  {
    path: 'admin',
    canActivate: [adminAuthGuard],
    loadComponent: () =>
      import('./admin/layout/admin-layout.component').then((m) => m.AdminLayoutComponent),
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./admin/pages/dashboard/admin-dashboard.component').then(
            (m) => m.AdminDashboardComponent,
          ),
      },
      {
        path: 'showcase',
        loadComponent: () =>
          import('./admin/pages/products/admin-products.component').then(
            (m) => m.AdminProductsComponent,
          ),
      },
      {
        path: 'origins',
        loadComponent: () =>
          import('./admin/pages/origins/admin-origins.component').then(
            (m) => m.AdminOriginsComponent,
          ),
      },
      {
        path: 'sections',
        loadComponent: () =>
          import('./admin/pages/sections/admin-sections.component').then(
            (m) => m.AdminSectionsComponent,
          ),
      },
      {
        path: 'site-content',
        loadComponent: () =>
          import('./admin/pages/site-content/admin-site-content.component').then(
            (m) => m.AdminSiteContentComponent,
          ),
      },
      {
        path: 'visual-editor',
        loadComponent: () =>
          import('./admin/pages/visual-editor/admin-visual-editor.component').then(
            (m) => m.AdminVisualEditorComponent,
          ),
      },
      {
        path: 'products',
        redirectTo: 'showcase',
        pathMatch: 'full',
      },
      {
        path: 'orders',
        redirectTo: 'sections',
        pathMatch: 'full',
      },
      {
        path: 'payments',
        redirectTo: 'origins',
        pathMatch: 'full',
      },
      {
        path: 'messages',
        loadComponent: () =>
          import('./admin/pages/messages/admin-messages.component').then(
            (m) => m.AdminMessagesComponent,
          ),
      },
    ],
  },
  {
    path: '**',
    redirectTo: '',
  },
];
