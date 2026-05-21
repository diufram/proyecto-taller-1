import { Routes } from '@angular/router';
import { authGuard } from '@/core/guards/auth.guard';
import { roleGuard } from '@/core/guards/role.guard';
import { MainLayout } from './app/core/layout/component/app.layout';
import { Notfound } from './app/pages/notfound/notfound';

export const appRoutes: Routes = [
    { path: '', redirectTo: '/landing', pathMatch: 'full' },

    {
        path: 'landing',
        loadChildren: () =>
            import('./app/features/landing/landing.routes').then(
                (m) => m.LANDING_ROUTES,
            ),
    },

    {
        path: 'auth',
        loadChildren: () =>
            import('./app/features/auth/auth.routes').then(
                (m) => m.AUTH_ROUTES,
            ),
    },

    {
        path: '',
        component: MainLayout,
        children: [
            {
                path: 'dashboard',
                canActivate: [authGuard, roleGuard(['admin'])],
                loadChildren: () =>
                    import('./app/features/dashboard/dashboard.routes').then(
                        (m) => m.DASHBOARD_ROUTES,
                    ),
            },

            {
                path: 'admin/competencias',
                canActivate: [authGuard, roleGuard(['admin'])],
                loadChildren: () =>
                    import('./app/features/competencias/admin-competencias.routes').then(
                        (m) => m.ADMIN_COMPETENCIAS_ROUTES,
                    ),
            },

            {
                path: 'user/competencias',
                canActivate: [authGuard],
                loadChildren: () =>
                    import('./app/features/competencias/user-competencias.routes').then(
                        (m) => m.USER_COMPETENCIAS_ROUTES,
                    ),
            },

            {
                path: 'user/ranking',
                canActivate: [authGuard],
                loadChildren: () =>
                    import('./app/features/ranking/ranking.routes').then(
                        (m) => m.RANKING_ROUTES,
                    ),
            },

            {
                path: 'profile',
                canActivate: [authGuard],
                loadChildren: () =>
                    import('./app/features/profile/profile.routes').then(
                        (m) => m.PROFILE_ROUTES,
                    ),
            },
        ],
    },

    { path: 'notfound', component: Notfound },
    { path: '**', redirectTo: '/notfound' },
];
