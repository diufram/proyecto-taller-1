import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '@/features/auth/services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
    const router = inject(Router);
    const authService = inject(AuthService);

    if (authService.hasValidAccessToken()) {
        return true;
    }

    if (typeof localStorage !== 'undefined') {
        localStorage.setItem('redirect_url', state.url);
    }

    authService.clearSession();
    router.navigate(['/auth/login']);
    return false;
};