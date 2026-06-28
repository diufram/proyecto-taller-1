import { Routes } from '@angular/router';

export const PROBLEMAS_ROUTES: Routes = [
    {
        path: '',
        loadComponent: () =>
            import('./pages/problemas-page/problemas-page.component').then(
                (m) => m.ProblemasPageComponent,
            ),
        title: 'Problemas',
        data: { breadcrumb: 'Problemas' },
    },
    {
        path: 'nuevo',
        loadComponent: () =>
            import(
                './pages/problema-form-page/problema-form-page.component'
            ).then((m) => m.ProblemaFormPageComponent),
        title: 'Nuevo Problema',
        data: { breadcrumb: 'Nuevo' },
    },
    {
        path: 'editar/:problemaId',
        loadComponent: () =>
            import(
                './pages/problema-form-page/problema-form-page.component'
            ).then((m) => m.ProblemaFormPageComponent),
        title: 'Editar Problema',
        data: { breadcrumb: 'Editar' },
    },
    {
        path: 'generar-ia',
        loadComponent: () =>
            import(
                './pages/problema-generate-page/problema-generate-page.component'
            ).then((m) => m.ProblemaGeneratePageComponent),
        title: 'Generar con IA',
        data: { breadcrumb: 'Generar con IA' },
    },
    {
        path: 'soluciones',
        loadComponent: () =>
            import(
                '@/features/soluciones/pages/admin/admin-soluciones-page/admin-soluciones-page.component'
            ).then((m) => m.AdminSolucionesPageComponent),
        title: 'Soluciones de la competencia',
        data: { breadcrumb: 'Soluciones' },
    },
    {
        path: 'soluciones/:solucionId/calificar',
        loadComponent: () =>
            import(
                '@/features/soluciones/pages/admin/calificar-solucion-page/calificar-solucion-page.component'
            ).then((m) => m.CalificarSolucionPageComponent),
        title: 'Calificar solución',
        data: { breadcrumb: 'Calificar' },
    },
    {
        path: 'problema/:problemaId/soluciones',
        loadComponent: () =>
            import(
                '@/features/soluciones/pages/admin/admin-soluciones-page/admin-soluciones-page.component'
            ).then((m) => m.AdminSolucionesPageComponent),
        title: 'Soluciones del problema',
        data: { breadcrumb: 'Soluciones' },
    },
    {
        path: 'problema/:problemaId/soluciones/:solucionId/calificar',
        loadComponent: () =>
            import(
                '@/features/soluciones/pages/admin/calificar-solucion-page/calificar-solucion-page.component'
            ).then((m) => m.CalificarSolucionPageComponent),
        title: 'Calificar solución',
        data: { breadcrumb: 'Calificar' },
    },
];
