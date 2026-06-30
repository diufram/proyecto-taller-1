import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { SkeletonModule } from 'primeng/skeleton';

import { ToastService } from '@/core/services/toast.service';
import {
    CompetenciasService,
    InscripcionInfo,
} from '@/features/competencias/services/competencias.service';
import { Competencia } from '@/features/competencias/models/competencia.model';
import { AuthService } from '@/features/auth/services/auth.service';

@Component({
    selector: 'app-user-competencia-detalle',
    standalone: true,
    imports: [CommonModule, FormsModule, ButtonModule, TagModule, SkeletonModule],
    styleUrl: './user-competencia-detalle.component.scss',
    template: `
        <div class="competencia-detalle">
            @if (loading) {
                <div class="flex flex-col gap-3">
                    <p-skeleton height="2rem" width="40%"></p-skeleton>
                    <p-skeleton height="1rem" width="100%"></p-skeleton>
                    <p-skeleton height="200px" width="100%"></p-skeleton>
                </div>
            } @else if (competencia) {
                <header class="competencia-page-header">
                    <div class="competencia-page-copy">
                        <span class="eyebrow">Competencia #{{ competencia.id }}</span>
                        <h1 class="competencia-page-title">{{ competencia.nombre }}</h1>
                        <p class="competencia-page-subtitle">
                            Revisa el calendario, el cupo y tu estado de inscripción
                            antes de participar en esta competencia.
                        </p>
                        <div class="competencia-tags-row">
                            @if (miInscripcion) {
                                <p-tag value="Inscrito" severity="success"></p-tag>
                            }
                            <p-tag
                                [value]="competencia.estado"
                                [severity]="getEstadoSeverity(competencia.estado)"
                            ></p-tag>
                            <p-tag
                                [value]="competencia.nivel_dificultad"
                                severity="warn"
                            ></p-tag>
                        </div>
                    </div>
                    <div class="competencia-page-status">
                        <span class="status-label">Estado actual</span>
                        <strong>{{ competencia.estado }}</strong>
                        <small>{{ miInscripcion ? 'Estás inscrito' : 'Inscripción individual' }}</small>
                    </div>
                </header>

                <div class="detalle-toolbar">
                    <div class="detalle-toolbar-left">
                        <p-button
                            icon="pi pi-arrow-left"
                            label="Volver"
                            severity="secondary"
                            [outlined]="true"
                            (onClick)="volver()"
                        ></p-button>

                        @if (miInscripcion) {
                            <p-button
                                label="Desinscribirse"
                                icon="pi pi-times"
                                severity="danger"
                                [outlined]="true"
                                [loading]="desinscribiendose"
                                (onClick)="desinscribirse()"
                            ></p-button>
                        } @else if (competencia.estado === 'Abierta') {
                            @if (isAuthenticated) {
                                <p-button
                                    label="Inscribirme"
                                    icon="pi pi-check"
                                    severity="success"
                                    (onClick)="inscribirseIndividual()"
                                    [loading]="inscribiendose"
                                ></p-button>
                            } @else {
                                <p-button
                                    label="Inicia sesión para inscribirte"
                                    icon="pi pi-sign-in"
                                    severity="success"
                                    (onClick)="goToLogin()"
                                ></p-button>
                            }
                        }
                    </div>
                </div>

                <div class="detalle-grid">
                    <article class="detalle-card">
                        <div class="detalle-card-header">
                            <span class="header-label">Información</span>
                            <h2 class="header-title">{{ competencia.nombre }}</h2>
                        </div>
                        <div class="info-grid">
                            <div class="info-item">
                                <div class="info-item-icon">
                                    <i class="pi pi-calendar"></i>
                                </div>
                                <div class="info-item-content">
                                    <span class="info-label">Fecha de inicio</span>
                                    <span class="info-value">{{
                                        competencia.fecha_inicio
                                            | date: 'dd/MM/yyyy'
                                    }}</span>
                                    <span class="info-time">{{
                                        competencia.fecha_inicio | date: 'HH:mm'
                                    }}</span>
                                </div>
                            </div>
                            <div class="info-item">
                                <div class="info-item-icon">
                                    <i class="pi pi-calendar-times"></i>
                                </div>
                                <div class="info-item-content">
                                    <span class="info-label">Fecha de fin</span>
                                    <span class="info-value">{{
                                        competencia.fecha_fin
                                            | date: 'dd/MM/yyyy'
                                    }}</span>
                                    <span class="info-time">{{
                                        competencia.fecha_fin | date: 'HH:mm'
                                    }}</span>
                                </div>
                            </div>
                            <div class="info-item">
                                <div class="info-item-icon">
                                    <i class="pi pi-users"></i>
                                </div>
                                <div class="info-item-content">
                                    <span class="info-label">Cupo máximo</span>
                                    <span class="info-value">{{
                                        competencia.max_participantes
                                    }}</span>
                                    <span class="info-subtext">participantes</span>
                                </div>
                            </div>
                            <div class="info-item">
                                <div class="info-item-icon">
                                    <i class="pi pi-signal-diagram"></i>
                                </div>
                                <div class="info-item-content">
                                    <span class="info-label">Nivel</span>
                                    <span class="info-value">{{
                                        competencia.nivel_dificultad
                                    }}</span>
                                </div>
                            </div>
                        </div>
                    </article>

                    <div class="info-notice">
                        <i class="pi pi-user"></i>
                        <p class="info-notice-text">
                            Esta vista es solo para inscripción. Para resolver
                            problemas, entra desde Mis competencias.
                        </p>
                    </div>
                </div>
            } @else {
                <div class="text-center p-4">
                    <p class="info-notice-text">Competencia no encontrada</p>
                    <p-button
                        label="Volver"
                        icon="pi pi-arrow-left"
                        (onClick)="volver()"
                    ></p-button>
                </div>
            }
        </div>
    `,
})
export class UserCompetenciaDetalleComponent implements OnInit {
    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private competenciasService = inject(CompetenciasService);
    private authService = inject(AuthService);
    private toast = inject(ToastService);

    competencia: Competencia | null = null;
    miInscripcion: InscripcionInfo | null = null;

    loading = false;
    inscribiendose = false;
    desinscribiendose = false;

    get isAuthenticated(): boolean {
        return this.authService.isAuthenticated();
    }

    ngOnInit(): void {
        const id = Number(this.route.snapshot.paramMap.get('id'));
        if (id) {
            this.loadData(id);
        }
    }

    loadData(id: number): void {
        this.loading = true;
        this.competenciasService.getById(id).subscribe({
            next: (res: { competencia: Competencia }) => {
                this.competencia = res.competencia;
                this.loading = false;
            },
            error: () => {
                this.toast.error('No se pudo cargar la competencia');
                this.loading = false;
            },
        });

        if (this.isAuthenticated) {
            this.competenciasService.misInscripciones().subscribe({
                next: (res: { inscripciones: InscripcionInfo[] }) => {
                    this.miInscripcion =
                        res.inscripciones.find(
                            (i: InscripcionInfo) => i.competencia_id === id,
                        ) ?? null;
                },
                error: () => {},
            });
        }
    }

    getEstadoSeverity(
        estado: string,
    ):
        | 'success'
        | 'info'
        | 'warn'
        | 'danger'
        | 'secondary'
        | 'contrast'
        | undefined {
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

    volver(): void {
        this.router.navigate(['/competencias']);
    }

    goToLogin(): void {
        this.router.navigate(['/auth/login'], {
            queryParams: { redirect: this.router.url },
        });
    }

    inscribirseIndividual(): void {
        if (!this.competencia) return;

        this.inscribiendose = true;
        this.competenciasService.inscribirse(this.competencia.id).subscribe({
            next: (res: { message: string }) => {
                this.toast.success(res.message);
                this.inscribiendose = false;
                this.reloadAfterAction();
            },
            error: (err: any) => {
                this.toast.error(err);
                this.inscribiendose = false;
            },
        });
    }

    desinscribirse(): void {
        if (!this.miInscripcion) return;

        this.desinscribiendose = true;
        this.competenciasService.desinscribirse(this.miInscripcion.id).subscribe({
            next: (res: { message: string }) => {
                this.toast.success(res.message);
                this.desinscribiendose = false;
                this.reloadAfterAction();
            },
            error: (err: any) => {
                this.toast.error(err);
                this.desinscribiendose = false;
            },
        });
    }

    private reloadAfterAction(): void {
        const id = this.competencia?.id;
        if (id) {
            this.loadData(id);
        }
    }
}
