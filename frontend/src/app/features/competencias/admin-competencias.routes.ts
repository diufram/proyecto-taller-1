import { Routes } from '@angular/router';

export const ADMIN_COMPETENCIAS_ROUTES: Routes = [
    {
        path: '',
        loadComponent: () =>
            import('./pages/admin/competencias-page/admin-competencias-page.component').then(
                (m) => m.AdminCompetenciasPageComponent,
            ),
        title: 'Competencias',
        data: { breadcrumb: 'Competencias' },
    },
    {
        path: 'problemas/:competenciaId',
        loadComponent: () =>
            import('@/features/problemas/pages/problemas-page/problemas-page.component').then(
                (m) => m.ProblemasPageComponent,
            ),
        title: 'Problemas',
        data: { breadcrumb: 'Problemas' },
    },
];