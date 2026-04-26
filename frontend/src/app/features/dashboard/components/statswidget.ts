import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KPIStats } from '../models/dashboard.model';

@Component({
    standalone: true,
    selector: 'my-stats-widget',
    imports: [CommonModule],
    template: `
    <div class="col-span-12 lg:col-span-6 xl:col-span-3">
        <div class="card mb-0">
            <div class="flex justify-between mb-4">
                <div>
                    <span class="block text-muted-color font-medium mb-4">Miembros Activos</span>
                    <div class="text-surface-900 dark:text-surface-0 font-medium text-xl">
                        {{ stats?.total_members || 0 }}
                    </div>
                </div>
                <div class="flex items-center justify-center bg-blue-100 dark:bg-blue-400/10 rounded-border" style="width: 2.5rem; height: 2.5rem">
                    <i class="pi pi-users text-blue-500 text-xl!"></i>
                </div>
            </div>
            <span class="text-muted-color">Total registrados</span>
        </div>
    </div>

    <div class="col-span-12 lg:col-span-6 xl:col-span-3">
        <div class="card mb-0">
            <div class="flex justify-between mb-4">
                <div>
                    <span class="block text-muted-color font-medium mb-4">Células</span>
                    <div class="text-surface-900 dark:text-surface-0 font-medium text-xl">
                        {{ stats?.total_celulas || 0 }}
                    </div>
                </div>
                <div class="flex items-center justify-center bg-orange-100 dark:bg-orange-400/10 rounded-border" style="width: 2.5rem; height: 2.5rem">
                    <i class="pi pi-home text-orange-500 text-xl!"></i>
                </div>
            </div>
            <span class="text-muted-color">Grupos activos</span>
        </div>
    </div>

    <div class="col-span-12 lg:col-span-6 xl:col-span-3">
        <div class="card mb-0">
            <div class="flex justify-between mb-4">
                <div>
                    <span class="block text-muted-color font-medium mb-4">Ofrendas (Mes)</span>
                    <div class="text-surface-900 dark:text-surface-0 font-medium text-xl">
                        {{ stats?.total_offering | currency:'USD' }}
                    </div>
                </div>
                <div class="flex items-center justify-center bg-green-100 dark:bg-green-400/10 rounded-border" style="width: 2.5rem; height: 2.5rem">
                    <i class="pi pi-dollar text-green-500 text-xl!"></i>
                </div>
            </div>
            <span class="text-primary font-medium">Recaudado </span>
        </div>
    </div>

    <div class="col-span-12 lg:col-span-6 xl:col-span-3">
        <div class="card mb-0">
            <div class="flex justify-between mb-4">
                <div>
                    <span class="block text-muted-color font-medium mb-4">Prom. Asistencia</span>
                    <div class="text-surface-900 dark:text-surface-0 font-medium text-xl">
                        {{ stats?.avg_attendance | number:'1.0-1' }}
                    </div>
                </div>
                <div class="flex items-center justify-center bg-purple-100 dark:bg-purple-400/10 rounded-border" style="width: 2.5rem; height: 2.5rem">
                    <i class="pi pi-chart-line text-purple-500 text-xl!"></i>
                </div>
            </div>
            <span class="text-muted-color">Pers. por reunión</span>
        </div>
    </div>
    `
})
export class MyStatsWidget {
    @Input() stats: KPIStats | null = null;
}