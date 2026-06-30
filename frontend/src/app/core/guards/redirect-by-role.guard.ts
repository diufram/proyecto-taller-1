import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '@/features/auth/services/auth.service';

export const redirectByRole: CanActivateFn = () => {
    const router = inject(Router);
    const authService = inject(AuthService);

    if (authService.isAuthenticated() && authService.isAdmin()) {
        router.navigate(['/dashboard']);
        return false;
    }

    router.navigate(['/landing']);
    return false;
};
