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
];