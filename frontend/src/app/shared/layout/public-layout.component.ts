import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { AuthService } from '@/features/auth/services/auth.service';

@Component({
    selector: 'app-public-layout',
    standalone: true,
    imports: [CommonModule, RouterModule, ButtonModule, TooltipModule],
    template: `
        <div class="min-h-screen bg-[#0a0a0f] text-white font-sans">
            <nav
                class="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-white/5"
            >
                <div class="max-w-7xl mx-auto px-6 md:px-12 py-4">
                    <div class="flex items-center justify-between">
                        <a
                            class="flex items-center gap-3 cursor-pointer"
                            routerLink="/landing"
                        >
                            <div
                                class="w-9 h-9 rounded-lg bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/20"
                            >
                                <i
                                    class="pi pi-code text-[#0a0a0f] text-sm font-bold"
                                ></i>
                            </div>
                            <span
                                class="text-xl font-bold tracking-tight text-white"
                            >
                                Compex
                            </span>
                        </a>

                        <div class="hidden md:flex items-center gap-8">
                            <a
                                routerLink="/landing"
                                [fragment]="'features'"
                                class="text-sm font-medium text-gray-400 hover:text-white transition-colors duration-300"
                                >Funciones</a
                            >
                            <a
                                routerLink="/landing"
                                [fragment]="'how'"
                                class="text-sm font-medium text-gray-400 hover:text-white transition-colors duration-300"
                                >Cómo funciona</a
                            >
                            <a
                                routerLink="/competencias"
                                routerLinkActive="text-white"
                                class="text-sm font-medium text-gray-400 hover:text-white transition-colors duration-300"
                                >Competencias</a
                            >
                            <a
                                routerLink="/ranking"
                                routerLinkActive="text-white"
                                class="text-sm font-medium text-gray-400 hover:text-white transition-colors duration-300"
                                >Ranking</a
                            >
                        </div>

                        <div class="flex items-center gap-4">
                            @if (!isLoggedIn()) {
                                <a
                                    routerLink="/auth/login"
                                    class="hidden md:block text-sm font-medium text-gray-400 hover:text-white transition-colors"
                                    >Login</a
                                >
                                <p-button
                                    label="Comenzar"
                                    severity="success"
                                    size="small"
                                    routerLink="/auth/register"
                                    styleClass="font-semibold px-4 py-2 rounded-lg shadow-lg hover:scale-105 transition-transform"
                                ></p-button>
                            } @else if (isAdmin()) {
                                <a
                                    routerLink="/dashboard"
                                    class="hidden md:inline-flex items-center gap-2 text-sm font-medium text-gray-400 hover:text-white transition-colors"
                                >
                                    <i class="pi pi-th-large text-sm"></i>
                                    <span>Dashboard</span>
                                </a>
                                <div
                                    class="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-sm"
                                >
                                    <i class="pi pi-user text-emerald-400"></i>
                                    <span class="text-white font-medium">{{ userName() }}</span>
                                    <span
                                        class="text-[10px] uppercase tracking-wide px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300"
                                        >Admin</span
                                    >
                                </div>
                                <p-button
                                    icon="pi pi-sign-out"
                                    severity="secondary"
                                    [outlined]="true"
                                    size="small"
                                    (onClick)="logout()"
                                    pTooltip="Cerrar sesión"
                                ></p-button>
                            } @else {
                                <a
                                    routerLink="/competencias"
                                    class="hidden md:inline-flex items-center gap-2 text-sm font-medium text-gray-400 hover:text-white transition-colors"
                                >
                                    <i class="pi pi-trophy text-sm"></i>
                                    <span>Mis competencias</span>
                                </a>
                                <a
                                    routerLink="/profile"
                                    class="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-sm hover:bg-white/10 transition-colors"
                                >
                                    <i class="pi pi-user text-emerald-400"></i>
                                    <span class="text-white font-medium">{{ userName() }}</span>
                                </a>
                                <p-button
                                    icon="pi pi-sign-out"
                                    severity="secondary"
                                    [outlined]="true"
                                    size="small"
                                    (onClick)="logout()"
                                    pTooltip="Cerrar sesión"
                                ></p-button>
                            }
                        </div>
                    </div>
                </div>
            </nav>

            <main class="pt-20">
                <router-outlet></router-outlet>
            </main>
        </div>
    `,
})
export class PublicLayoutComponent {
    private authService = inject(AuthService);
    private router = inject(Router);

    isLoggedIn(): boolean {
        return this.authService.isAuthenticated();
    }

    isAdmin(): boolean {
        return this.authService.isAdmin();
    }

    userName(): string {
        return this.authService.currentUser()?.nombre_usuario ?? 'Usuario';
    }

    logout(): void {
        this.authService.logout();
    }
}
