import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '@/features/auth/services/auth.service';

@Component({
    selector: 'app-dashboard-page',
    standalone: true,
    imports: [CommonModule],
    template: `
        <div class="p-4">
            <h1 class="text-2xl font-bold mb-4">Dashboard</h1>
            <div *ngIf="currentUser()" class="card">
                <p>Bienvenido, {{ currentUser()?.nombre_usuario }}</p>
                <p>Rol: {{ currentUser()?.rol }}</p>
            </div>
            <div class="mt-4">
                <p>Aquí se mostrarán las competencias y estadísticas.</p>
            </div>
        </div>
    `,
})
export class DashboardPage implements OnInit {
    private authService = inject(AuthService);

    ngOnInit(): void {}

    currentUser() {
        return this.authService.currentUser();
    }
}
