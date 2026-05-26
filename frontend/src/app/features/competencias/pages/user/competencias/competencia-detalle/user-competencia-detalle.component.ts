import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { SkeletonModule } from 'primeng/skeleton';
import { ToolbarModule } from 'primeng/toolbar';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';

import { ToastService } from '@/core/services/toast.service';
import { CompetenciasService, InscripcionInfo } from '@/features/competencias/services/competencias.service';
import { Competencia } from '@/features/competencias/models/competencia.model';
import { GruposService, Grupo } from '@/features/grupos/services/grupos.service';

@Component({
    selector: 'app-user-competencia-detalle',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ButtonModule,
        CardModule,
        TagModule,
        DialogModule,
        InputTextModule,
        SkeletonModule,
        ToolbarModule,
        IconFieldModule,
        InputIconModule,
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

                                @if (miInscripcion) {
                                    <p-button
                                        label="Ver Problemas"
                                        icon="pi pi-list"
                                        severity="primary"
                                        (onClick)="verProblemas()"
                                    ></p-button>
                                    @if (miInscripcion.grupo) {
                                        <p-button
                                            label="Salir del Grupo"
                                            icon="pi pi-sign-out"
                                            severity="danger"
                                            [outlined]="true"
                                            [loading]="saliendo"
                                            (onClick)="salirDelGrupo()"
                                        ></p-button>
                                    } @else {
                                        <p-button
                                            label="Desinscribirse"
                                            icon="pi pi-times"
                                            severity="danger"
                                            [outlined]="true"
                                            [loading]="desinscribiendose"
                                            (onClick)="desinscribirse()"
                                        ></p-button>
                                    }
                                } @else {
                                    <p-button
                                        label="Ver Problemas"
                                        icon="pi pi-list"
                                        severity="primary"
                                        (onClick)="verProblemas()"
                                    ></p-button>
                                    @if (competencia.tipo === 'Grupal') {
                                        <p-button
                                            label="Crear Grupo"
                                            icon="pi pi-plus"
                                            severity="primary"
                                            (onClick)="openCreateDialog()"
                                        ></p-button>
                                    } @else {
                                        <p-button
                                            label="Inscribirse"
                                            icon="pi pi-check"
                                            severity="success"
                                            (onClick)="inscribirseIndividual()"
                                            [loading]="inscribiendose"
                                        ></p-button>
                                    }
                                }
                            </div>
                        </ng-template>
                        <ng-template pTemplate="right">
                            <div class="flex gap-2 align-items-center">
                                @if (miInscripcion) {
                                    @if (miInscripcion.grupo) {
                                        <p-tag
                                            [value]="'Inscrito: ' + miInscripcion.grupo.nombre"
                                            severity="success"
                                        ></p-tag>
                                    } @else {
                                        <p-tag
                                            value="Inscrito"
                                            severity="success"
                                        ></p-tag>
                                    }
                                }
                                <p-tag [value]="competencia.estado" [severity]="getEstadoSeverity(competencia.estado)"></p-tag>
                                <p-tag [value]="competencia.tipo" [severity]="competencia.tipo === 'Grupal' ? 'info' : 'secondary'"></p-tag>
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
                                    @if (competencia.descripcion) {
                                        <p class="header-description">{{ competencia.descripcion }}</p>
                                    }
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

                        @if (competencia.tipo === 'Grupal') {
                            @if (loadingGrupos) {
                                <div class="text-center p-4">
                                    <i class="pi pi-spin pi-spinner text-2xl"></i>
                                </div>
                            } @else if (grupos.length > 0) {
                                <div class="flex flex-col gap-3">
                                    @for (grupo of grupos; track grupo.id) {
                                        <p-card styleClass="shadow-2 border-round-2xl">
                                            <ng-template pTemplate="content">
                                                <div class="flex justify-content-between align-items-center">
                                                    <div class="flex flex-col gap-1">
                                                        <span class="font-bold text-lg">{{ grupo.nombre }}</span>
                                                        <span class="text-sm text-color-secondary">
                                                            {{ grupo.competidores_actuales }}/{{ grupo.max_participantes }} miembros
                                                        </span>
                                                    </div>
                                                    <div class="flex align-items-center gap-2">
                                                        <p-tag
                                                            [value]="grupo.slots_disponibles > 0 ? 'Disponible' : 'Lleno'"
                                                            [severity]="grupo.slots_disponibles > 0 ? 'success' : 'danger'"
                                                        ></p-tag>
                                                        @if (grupo.slots_disponibles > 0 && !miInscripcion) {
                                                            <p-button
                                                                label="Unirse"
                                                                icon="pi pi-check"
                                                                severity="success"
                                                                [loading]="uniendoAGrupo === grupo.id"
                                                                (onClick)="unirseGrupo(grupo.id)"
                                                            ></p-button>
                                                        }
                                                    </div>
                                                </div>
                                            </ng-template>
                                        </p-card>
                                    }
                                </div>
                            } @else {
                                <p-card styleClass="shadow-2 border-round-2xl">
                                    <ng-template pTemplate="content">
                                        <div class="text-center p-4 text-color-secondary">
                                            <i class="pi pi-users text-2xl mb-2 block"></i>
                                            <p>No hay grupos creados aún.</p>
                                        </div>
                                    </ng-template>
                                </p-card>
                            }
                        } @else {
                            <p-card styleClass="shadow-2 border-round-2xl">
                                <ng-template pTemplate="content">
                                    <div class="flex align-items-center gap-2">
                                        <i class="pi pi-user text-4xl text-color-secondary"></i>
                                        <p class="text-color-secondary">Esta es una competencia individual</p>
                                    </div>
                                </ng-template>
                            </p-card>
                        }
                    </div>
                } @else {
                    <div class="text-center p-4">
                        <p class="text-color-secondary">Competencia no encontrada</p>
                        <p-button label="Volver" icon="pi pi-arrow-left" (onClick)="volver()"></p-button>
                    </div>
                }
        </div>

        <p-dialog
            [(visible)]="createDialogVisible"
            header="Crear Nuevo Grupo"
            [modal]="true"
            [style]="{ width: '400px' }"
            [closable]="true"
        >
            <div class="flex flex-col gap-4 p-2">
                <div class="flex flex-col gap-2">
                    <label for="grupo-nombre" class="font-medium">Nombre del Grupo</label>
                    <input
                        pInputText
                        id="grupo-nombre"
                        [(ngModel)]="newGrupoNombre"
                        placeholder="Ej: Los Magníficos"
                        class="w-full"
                    />
                </div>
            </div>
            <ng-template pTemplate="footer">
                <p-button
                    label="Cancelar"
                    [text]="true"
                    severity="secondary"
                    (onClick)="createDialogVisible = false"
                ></p-button>
                <p-button
                    label="Crear Grupo"
                    icon="pi pi-check"
                    [loading]="creandoGrupo"
                    [disabled]="!newGrupoNombre.trim() || creandoGrupo"
                    (onClick)="crearGrupo()"
                ></p-button>
            </ng-template>
</p-dialog>
    `,
})
export class UserCompetenciaDetalleComponent implements OnInit {
    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private competenciasService = inject(CompetenciasService);
    private gruposService = inject(GruposService);
    private toast = inject(ToastService);

    competencia: Competencia | null = null;
    miInscripcion: InscripcionInfo | null = null;
    grupos: Grupo[] = [];

    loading = false;
    loadingGrupos = false;
    inscribiendose = false;
    creandoGrupo = false;
    saliendo = false;
    desinscribiendose = false;
    uniendoAGrupo: number | null = null;

    createDialogVisible = false;
    newGrupoNombre = '';

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
                if (this.competencia?.tipo === 'Grupal') {
                    this.loadGrupos();
                }
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

    loadGrupos(): void {
        if (!this.competencia) return;
        this.loadingGrupos = true;
        this.gruposService.listarGrupos(this.competencia.id).subscribe({
            next: (res: { grupos: Grupo[] }) => {
                this.grupos = res.grupos;
                this.loadingGrupos = false;
            },
            error: () => {
                this.loadingGrupos = false;
            },
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

    volver(): void {
        this.router.navigate(['/user/competencias']);
    }

    verProblemas(): void {
        if (!this.competencia) return;
        this.router.navigate(['/user/competencias', this.competencia.id, 'problemas']);
    }

    openCreateDialog(): void {
        this.newGrupoNombre = '';
        this.createDialogVisible = true;
    }

    crearGrupo(): void {
        if (!this.newGrupoNombre.trim() || !this.competencia) return;

        this.creandoGrupo = true;
        this.gruposService.crearGrupo(this.competencia.id, this.newGrupoNombre.trim()).subscribe({
            next: (res: { message: string }) => {
                this.toast.success(res.message);
                this.creandoGrupo = false;
                this.createDialogVisible = false;
                this.reloadAfterAction();
            },
            error: (err: any) => {
                const message = err?.message || 'Error al crear el grupo';
                this.toast.error(message);
                this.creandoGrupo = false;
            },
        });
    }

    unirseGrupo(grupoId: number): void {
        this.uniendoAGrupo = grupoId;
        this.gruposService.unirseGrupo(grupoId).subscribe({
            next: (res: { message: string }) => {
                this.toast.success(res.message);
                this.uniendoAGrupo = null;
                this.reloadAfterAction();
            },
            error: (err: any) => {
                this.toast.error(err);
                this.uniendoAGrupo = null;
            },
        });
    }

    salirDelGrupo(): void {
        if (!this.miInscripcion?.grupo) return;

        this.saliendo = true;
        this.gruposService.salirGrupo(this.miInscripcion.grupo.id).subscribe({
            next: (res: { message: string }) => {
                this.toast.success(res.message);
                this.saliendo = false;
                this.reloadAfterAction();
            },
            error: (err: any) => {
                this.toast.error(err);
                this.saliendo = false;
            },
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
