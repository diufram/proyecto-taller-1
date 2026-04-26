import { Routes } from '@angular/router';
import { LoginComponent } from './pages/sign-in/login.component';
import { RegisterComponent } from './pages/sign-up/register.component';

export const AUTH_ROUTES: Routes = [
    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full',
    },
    {
        path: 'login',
        component: LoginComponent,
        title: 'INE - Iniciar Sesion',
    },
    {
        path: 'register',
        component: RegisterComponent,
        title: 'INE - Crear Cuenta',
    },
];