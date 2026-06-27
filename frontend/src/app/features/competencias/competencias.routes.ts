import { Routes } from '@angular/router';
import { authGuard } from '@/core/guards/auth.guard';

export const COMPETENCIAS_ROUTES: Routes = [
    {
        path: '',
        loadComponent: () =>
            import('./pages/user/competencias/competencias-page/user-competencias-page.component').then(
                (m) => m.UserCompetenciasPageComponent,
            ),
        title: 'Competencias',
        data: { breadcrumb: 'Competencias' },
    },
    {
        path: ':id',
        loadComponent: () =>
            import('./pages/user/competencias/competencia-detalle/user-competencia-detalle.component').then(
                (m) => m.UserCompetenciaDetalleComponent,
            ),
        title: 'Detalle de Competencia',
        data: { breadcrumb: 'Competencia' },
    },
    {
        path: ':id/problemas',
        canActivate: [authGuard],
        loadComponent: () =>
            import('./pages/user/competencias/competencia-problemas/competencia-problemas.component').then(
                (m) => m.UserCompetenciaProblemasComponent,
            ),
        title: 'Problemas de Competencia',
        data: { breadcrumb: 'Problemas' },
    },
    {
        path: ':id/problemas/:problemaId/resolver',
        canActivate: [authGuard],
        loadComponent: () =>
            import('@/features/soluciones/pages/resolver-problema-page/resolver-problema-page.component').then(
                (m) => m.ResolverProblemaPageComponent,
            ),
        title: 'Resolver problema',
        data: { breadcrumb: 'Resolver' },
    },
];
