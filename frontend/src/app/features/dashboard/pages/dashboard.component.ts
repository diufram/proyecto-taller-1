import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { ButtonModule } from 'primeng/button';
import { SkeletonModule } from 'primeng/skeleton';
import { TagModule } from 'primeng/tag';

import { AuthService } from '@/features/auth/services/auth.service';
import { DashboardService } from '../services/dashboard.service';
import {
    AdminDashboardStats,
    CompetenciaEstado,
    ProblemaDificultad,
    SolucionEstado,
} from '../models/dashboard.model';

interface KpiCard {
    label: string;
    value: string | number;
    icon: string;
    tone: 'primary' | 'green' | 'orange' | 'purple' | 'blue' | 'red';
    detail: string;
}

@Component({
    selector: 'app-dashboard-page',
    standalone: true,
    imports: [CommonModule, RouterModule, ButtonModule, SkeletonModule, TagModule],
    templateUrl: './dashboard.component.html',
    styleUrl: './dashboard.component.scss',
})
export class DashboardPage implements OnInit {
    private authService = inject(AuthService);
    private dashboardService = inject(DashboardService);

    stats: AdminDashboardStats | null = null;
    loading = false;
    error = '';

    get summary() {
        return (
            this.stats?.summary ?? {
                totalCompetencias: 0,
                competenciasActivas: 0,
                totalProblemas: 0,
                totalUsuarios: 0,
                totalSoluciones: 0,
                tasaAcierto: 0,
            }
        );
    }

    readonly competenciaEstados: CompetenciaEstado[] = [
        'Abierta',
        'En curso',
        'Finalizada',
        'Cancelada',
    ];
    readonly dificultadLabels: ProblemaDificultad[] = ['Facil', 'Medio', 'Dificil'];
    readonly solucionEstados: SolucionEstado[] = [
        'Pendiente',
        'Correcto',
        'Incorrecto',
        'En revisión',
    ];

    ngOnInit(): void {
        if (this.isAdmin()) {
            this.loadAdminStats();
        }
    }

    currentUser() {
        return this.authService.currentUser();
    }

    isAdmin(): boolean {
        return this.authService.isAdmin();
    }

    get kpiCards(): KpiCard[] {
        if (!this.stats) return [];
        const summary = this.stats.summary;
        const activeDetail = this.stats.competenciaMasActiva
            ? `Más activa: ${this.stats.competenciaMasActiva.nombre}`
            : 'Sin actividad registrada';

        return [
            {
                label: 'Competencias activas',
                value: summary.competenciasActivas,
                icon: 'pi pi-trophy',
                tone: 'green',
                detail: `${summary.totalCompetencias} competencias totales`,
            },
            {
                label: 'Problemas totales',
                value: summary.totalProblemas,
                icon: 'pi pi-list-check',
                tone: 'purple',
                detail: `${this.stats.problemasSinActividad.length} sin actividad reciente`,
            },
            {
                label: 'Usuarios registrados',
                value: summary.totalUsuarios,
                icon: 'pi pi-users',
                tone: 'blue',
                detail: 'Participantes con rol usuario',
            },
            {
                label: 'Soluciones enviadas',
                value: summary.totalSoluciones,
                icon: 'pi pi-send',
                tone: 'orange',
                detail: activeDetail,
            },
            {
                label: 'Tasa de acierto',
                value: `${summary.tasaAcierto}%`,
                icon: 'pi pi-check-circle',
                tone: summary.tasaAcierto >= 50 ? 'green' : 'red',
                detail: 'Correctas sobre envíos totales',
            },
        ];
    }

    loadAdminStats(): void {
        this.loading = true;
        this.error = '';
        this.dashboardService.getAdminStats().subscribe({
            next: (stats) => {
                this.stats = stats;
                this.loading = false;
            },
            error: (err) => {
                this.error = err?.message ?? 'No se pudo cargar el dashboard.';
                this.loading = false;
            },
        });
    }

    maxValue(record: Record<string, number>): number {
        return Math.max(...Object.values(record), 1);
    }

    barWidth(value: number, record: Record<string, number>): string {
        return `${Math.max((value / this.maxValue(record)) * 100, value > 0 ? 6 : 0)}%`;
    }

    getEstadoSeverity(
        estado: CompetenciaEstado,
    ): 'success' | 'info' | 'warn' | 'danger' | 'secondary' {
        switch (estado) {
            case 'Abierta':
                return 'success';
            case 'En curso':
                return 'warn';
            case 'Finalizada':
                return 'info';
            case 'Cancelada':
                return 'danger';
            default:
                return 'secondary';
        }
    }

    getDificultadSeverity(
        dificultad: ProblemaDificultad,
    ): 'success' | 'warn' | 'danger' {
        switch (dificultad) {
            case 'Facil':
                return 'success';
            case 'Medio':
                return 'warn';
            case 'Dificil':
                return 'danger';
        }
    }
}
