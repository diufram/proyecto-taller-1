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
        path: 'nuevo',
        loadComponent: () =>
            import('./pages/admin/competencia-form-page/competencia-form-page.component').then(
                (m) => m.CompetenciaFormPageComponent,
            ),
        title: 'Nueva Competencia',
        data: { breadcrumb: 'Nueva Competencia' },
    },
    {
        path: 'editar/:id',
        loadComponent: () =>
            import('./pages/admin/competencia-form-page/competencia-form-page.component').then(
                (m) => m.CompetenciaFormPageComponent,
            ),
        title: 'Editar Competencia',
        data: { breadcrumb: 'Editar Competencia' },
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
