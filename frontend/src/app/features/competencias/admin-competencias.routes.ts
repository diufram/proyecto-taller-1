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
        loadChildren: () =>
            import('@/features/problemas/problemas.routes').then(
                (m) => m.PROBLEMAS_ROUTES,
            ),
        data: { breadcrumb: 'Problemas' },
    },
];
