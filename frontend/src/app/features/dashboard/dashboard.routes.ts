import { Routes } from '@angular/router';
import { DashboardPage } from './pages/dashboard.component';

export const DASHBOARD_ROUTES: Routes = [
  { 
    path: '', 
    component: DashboardPage,
    title: 'INE - Dashboard'
    // data: { title: 'Dashboard' } // Opcional: si usas breadcrumbs o títulos dinámicos
  }
];