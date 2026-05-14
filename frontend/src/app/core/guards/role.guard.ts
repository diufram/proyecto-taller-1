import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '@/features/auth/services/auth.service';

export const roleGuard = (allowedRoles: string[]): CanActivateFn => {
    return () => {
        const router = inject(Router);
        const authService = inject(AuthService);
        const user = authService.currentUser();

        if (!user?.rol) {
            router.navigate(['/auth/login']);
            return false;
        }

        const normalizedRole = user.rol.toLowerCase();
        const canAccess = allowedRoles
            .map((role) => role.toLowerCase())
            .includes(normalizedRole);

        if (canAccess) {
            return true;
        }

        router.navigate(['/competencias']);
        return false;
    };
};
