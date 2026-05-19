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
];