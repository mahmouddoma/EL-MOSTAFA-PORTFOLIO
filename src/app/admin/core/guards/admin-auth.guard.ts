import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { MockAdminAuthService } from '../services/mock-admin-auth.service';

export const adminAuthGuard: CanActivateFn = () => {
  const auth = inject(MockAdminAuthService);
  const router = inject(Router);

  if (auth.isAuthenticated()) {
    return true;
  }

  return router.createUrlTree(['/admin/login']);
};
