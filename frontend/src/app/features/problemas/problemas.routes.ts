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
];
