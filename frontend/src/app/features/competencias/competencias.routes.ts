import { Routes } from '@angular/router';

export const COMPETENCIAS_ROUTES: Routes = [
    {
        path: '',
        loadComponent: () =>
            import('./pages/competencias-page/competencias-page.component').then(
                (m) => m.CompetenciasPageComponent,
            ),
        title: 'Competencias',
        data: { breadcrumb: 'Competencias' },
    },
    {
        path: ':id',
        loadComponent: () =>
            import('./pages/competencia-detalle/competencia-detalle.component').then(
                (m) => m.CompetenciaDetalleComponent,
            ),
        title: 'Detalle de Competencia',
        data: { breadcrumb: 'Competencia' },
    },
    {
        path: 'problemas/:competenciaId',
        loadComponent: () =>
            import('../problemas/pages/problemas-page/problemas-page.component').then(
                (m) => m.ProblemasPageComponent,
            ),
        title: 'Problemas',
        data: { breadcrumb: 'Problemas' },
    },
];