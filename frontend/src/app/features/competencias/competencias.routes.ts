export const COMPETENCIAS_ROUTES = [
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
        data: { breadcrumb: 'Detalle' },
    },
];