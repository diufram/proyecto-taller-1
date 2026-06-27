import { Routes } from '@angular/router';
import { authGuard } from '@/core/guards/auth.guard';
import { roleGuard } from '@/core/guards/role.guard';
import { MainLayout } from './app/core/layout/component/app.layout';
import { PublicLayoutComponent } from './app/shared/layout/public-layout.component';
import { Notfound } from './app/pages/notfound/notfound';
import { redirectByRole } from '@/core/guards/redirect-by-role.guard';

export const appRoutes: Routes = [
    {
        path: '',
        canActivate: [redirectByRole],
        children: [],
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
        component: PublicLayoutComponent,
        children: [
            {
                path: 'landing',
                loadChildren: () =>
                    import('./app/features/landing/landing.routes').then(
                        (m) => m.LANDING_ROUTES,
                    ),
            },
            {
                path: 'competencias',
                loadChildren: () =>
                    import(
                        './app/features/competencias/competencias.routes'
                    ).then((m) => m.COMPETENCIAS_ROUTES),
            },
            {
                path: 'ranking',
                loadChildren: () =>
                    import('./app/features/ranking/ranking.routes').then(
                        (m) => m.RANKING_ROUTES,
                    ),
            },
            {
                path: 'mis-competencias',
                canActivate: [authGuard],
                loadComponent: () =>
                    import(
                        './app/features/competencias/pages/user/mis-competencias/mis-competencias-page.component'
                    ).then((m) => m.MisCompetenciasPageComponent),
                title: 'Mis Competencias',
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

        ],
    },

    { path: 'notfound', component: Notfound },
    { path: '**', redirectTo: '/notfound' },
];
