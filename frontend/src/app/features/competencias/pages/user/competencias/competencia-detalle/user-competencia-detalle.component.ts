import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { SkeletonModule } from 'primeng/skeleton';
import { ToolbarModule } from 'primeng/toolbar';

import { ToastService } from '@/core/services/toast.service';
import { CompetenciasService, InscripcionInfo } from '@/features/competencias/services/competencias.service';
import { Competencia } from '@/features/competencias/models/competencia.model';

@Component({
    selector: 'app-user-competencia-detalle',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ButtonModule,
        CardModule,
        TagModule,
        SkeletonModule,
        ToolbarModule,
    ],
    styleUrl: './user-competencia-detalle.component.scss',
    template: `
        <div class="competencia-detalle">
            @if (loading) {
                <div class="flex flex-col gap-3">
                    <p-skeleton height="2rem" width="40%"></p-skeleton>
                    <p-skeleton height="1rem" width="100%"></p-skeleton>
                    <p-skeleton height="1rem" width="80%"></p-skeleton>
                    <p-skeleton height="200px" width="100%"></p-skeleton>
                </div>
            } @else if (competencia) {
                <div class="competencia-header pl-1 mb-3">
                    <h3 class="text-2xl font-bold text-color m-0">{{ competencia.nombre }}</h3>
                </div>

                    <p-toolbar styleClass="mb-3 gap-2 w-full border-none p-0 bg-transparent">
                        <ng-template pTemplate="left">
                            <div class="flex gap-2 align-items-center">
                                <p-button
                                    icon="pi pi-arrow-left"
                                    label="Volver"
                                    severity="secondary"
                                    [outlined]="true"
                                    (onClick)="volver()"
                                ></p-button>

                                @if (miInscripcion && puedeVerProblemas()) {
                                    <p-button
                                        label="Ver Problemas"
                                        icon="pi pi-list"
                                        severity="primary"
                                        (onClick)="verProblemas()"
                                    ></p-button>
                                    <p-button
                                        label="Desinscribirse"
                                        icon="pi pi-times"
                                        severity="danger"
                                        [outlined]="true"
                                        [loading]="desinscribiendose"
                                        (onClick)="desinscribirse()"
                                    ></p-button>
                                } @else if (competencia.estado === 'Abierta') {
                                    <p-button
                                        label="Inscribirse"
                                        icon="pi pi-check"
                                        severity="success"
                                        (onClick)="inscribirseIndividual()"
                                        [loading]="inscribiendose"
                                    ></p-button>
                                }
                            </div>
                        </ng-template>
                        <ng-template pTemplate="right">
                            <div class="flex gap-2 align-items-center">
                                @if (miInscripcion) {
                                    <p-tag
                                        value="Inscrito"
                                        severity="success"
                                    ></p-tag>
                                }
                                <p-tag [value]="competencia.estado" [severity]="getEstadoSeverity(competencia.estado)"></p-tag>
                                <p-tag [value]="competencia.nivel_dificultad" severity="warn"></p-tag>
                            </div>
                        </ng-template>
                    </p-toolbar>

                    <div class="flex flex-col gap-4">
                        <p-card styleClass="shadow-2 border-round-2xl">
                            <ng-template pTemplate="header">
                                <div class="info-card-header">
                                    <span class="header-label">Información</span>
                                    <h2 class="header-title">{{ competencia.nombre }}</h2>
                                </div>
                            </ng-template>
                            <ng-template pTemplate="content">
                                <div class="info-grid">
                                    <div class="info-item">
                                        <div class="info-item-icon">
                                            <i class="pi pi-calendar"></i>
                                        </div>
                                        <div class="info-item-content">
                                            <span class="info-label">Fecha de inicio</span>
                                            <span class="info-value">{{ competencia.fecha_inicio | date: 'dd/MM/yyyy' }}</span>
                                            <span class="info-time">{{ competencia.fecha_inicio | date: 'HH:mm' }}</span>
                                        </div>
                                    </div>
                                    <div class="info-item">
                                        <div class="info-item-icon">
                                            <i class="pi pi-calendar-times"></i>
                                        </div>
                                        <div class="info-item-content">
                                            <span class="info-label">Fecha de fin</span>
                                            <span class="info-value">{{ competencia.fecha_fin | date: 'dd/MM/yyyy' }}</span>
                                            <span class="info-time">{{ competencia.fecha_fin | date: 'HH:mm' }}</span>
                                        </div>
                                    </div>
                                    <div class="info-item">
                                        <div class="info-item-icon">
                                            <i class="pi pi-users"></i>
                                        </div>
                                        <div class="info-item-content">
                                            <span class="info-label">Cupo máximo</span>
                                            <span class="info-value">{{ competencia.max_participantes }}</span>
                                            <span class="info-subtext">participantes</span>
                                        </div>
                                    </div>
                                    <div class="info-item">
                                        <div class="info-item-icon">
                                            <i class="pi pi-signal-diagram"></i>
                                        </div>
                                        <div class="info-item-content">
                                            <span class="info-label">Nivel</span>
                                            <span class="info-value">{{ competencia.nivel_dificultad }}</span>
                                        </div>
                                    </div>
                                </div>
                            </ng-template>
                        </p-card>

                        <p-card styleClass="shadow-2 border-round-2xl">
                            <ng-template pTemplate="content">
                                <div class="flex align-items-center gap-2">
                                    <i class="pi pi-user text-4xl text-color-secondary"></i>
                                    <p class="text-color-secondary">Esta es una competencia individual</p>
                                </div>
                            </ng-template>
                        </p-card>
                    </div>
                } @else {
                    <div class="text-center p-4">
                        <p class="text-color-secondary">Competencia no encontrada</p>
                        <p-button label="Volver" icon="pi pi-arrow-left" (onClick)="volver()"></p-button>
                    </div>
                }
        </div>
    `,
})
export class UserCompetenciaDetalleComponent implements OnInit {
    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private competenciasService = inject(CompetenciasService);
    private toast = inject(ToastService);

    competencia: Competencia | null = null;
    miInscripcion: InscripcionInfo | null = null;

    loading = false;
    inscribiendose = false;
    desinscribiendose = false;

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

        this.competenciasService.misInscripciones().subscribe({
            next: (res: { inscripciones: InscripcionInfo[] }) => {
                this.miInscripcion = res.inscripciones.find((i: InscripcionInfo) => i.competencia_id === id) ?? null;
            },
            error: () => {},
        });
    }

    getEstadoSeverity(estado: string): 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast' | undefined {
        switch (estado) {
            case 'Abierta': return 'success';
            case 'En curso': return 'warn';
            case 'Finalizada': return 'info';
            case 'Cancelada': return 'danger';
            default: return 'secondary';
        }
    }

    puedeVerProblemas(): boolean {
        return (
            this.competencia?.estado === 'Abierta' ||
            this.competencia?.estado === 'En curso'
        );
    }

    volver(): void {
        this.router.navigate(['/user/competencias']);
    }

    verProblemas(): void {
        if (!this.competencia) return;
        this.router.navigate(['/user/competencias', this.competencia.id, 'problemas']);
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
