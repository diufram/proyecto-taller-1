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
import { AuthService } from '@/features/auth/services/auth.service';
import { CompetenciasService, InscripcionInfo } from '../../services/competencias.service';
import { Competencia } from '../../models/competencia.model';
import { GruposService, Grupo } from '../../../grupos/services/grupos.service';

@Component({
    selector: 'app-competencia-detalle',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ButtonModule,
        CardModule,
        TagModule,
        DialogModule,
        InputTextModule,
        ToastModule,
        SkeletonModule,
        ToolbarModule,
        IconFieldModule,
        InputIconModule,
    ],
    template: `
        <p-toast></p-toast>

        <div class="competencia-detalle">
            <p-toolbar styleClass="mb-3 w-full border-none p-0 bg-transparent">
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
                            @if (miInscripcion.grupo) {
                                <p-button
                                    label="Salir del Grupo"
                                    icon="pi pi-sign-out"
                                    severity="danger"
                                    [outlined]="true"
                                    [loading]="saliendo"
                                    (onClick)="salirDelGrupo()"
                                ></p-button>
                            }
                        } @else if (competencia) {
                            @if (competencia.tipo === 'Grupal') {
                                <p-button
                                    label="Crear Grupo"
                                    icon="pi pi-plus"
                                    severity="primary"
                                    (onClick)="openCreateDialog()"
                                ></p-button>
                                <p-button
                                    label="Unirse a Grupo"
                                    icon="pi pi-users"
                                    severity="secondary"
                                    [outlined]="true"
                                    [disabled]="grupos.length === 0"
                                    (onClick)="loadGrupos(); joinDialogVisible = true"
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
            </p-toolbar>

            @if (loading) {
                <div class="flex flex-col gap-3">
                    <p-skeleton height="2rem" width="40%"></p-skeleton>
                    <p-skeleton height="1rem" width="100%"></p-skeleton>
                    <p-skeleton height="1rem" width="80%"></p-skeleton>
                    <p-skeleton height="200px" width="100%"></p-skeleton>
                </div>
            } @else if (competencia) {
                <div class="flex flex-column gap-4">
                    <div class="competencia-header">
                        <h1 class="text-2xl font-bold m-0">{{ competencia.nombre }}</h1>
                        <div class="flex gap-2 mt-2">
                            <p-tag [value]="competencia.estado" [severity]="getEstadoSeverity(competencia.estado)"></p-tag>
                            <p-tag [value]="competencia.tipo" [severity]="competencia.tipo === 'Grupal' ? 'info' : 'secondary'"></p-tag>
                            <p-tag [value]="competencia.nivel_dificultad" severity="warn"></p-tag>
                        </div>
                    </div>

                    @if (miInscripcion) {
                        <p-card styleClass="shadow-2 border-round-2xl">
                            <ng-template pTemplate="content">
                                <div class="flex align-items-center gap-2">
                                    <i class="pi pi-check-circle text-green-500 text-xl"></i>
                                    <h3 class="text-lg font-semibold m-0">Ya estás inscrito</h3>
                                </div>
                                @if (miInscripcion.grupo) {
                                    <div class="flex flex-col gap-1 pl-6 mt-2">
                                        <span class="text-color-secondary text-sm">Tu grupo:</span>
                                        <span class="font-bold text-lg">{{ miInscripcion.grupo.nombre }}</span>
                                    </div>
                                } @else {
                                    <span class="text-color-secondary mt-2 block">Competencia individual</span>
                                }
                            </ng-template>
                        </p-card>
                    } @else {
                        @if (competencia.tipo === 'Grupal') {
                            <p-card styleClass="shadow-2 border-round-2xl">
                                <ng-template pTemplate="content">
                                    <div class="flex flex-col gap-4">
                                        <h3 class="text-lg font-semibold m-0">Grupos disponibles</h3>

                                        @if (loadingGrupos) {
                                            <div class="text-center p-4">
                                                <i class="pi pi-spin pi-spinner text-2xl"></i>
                                            </div>
                                        } @else if (grupos.length > 0) {
                                            <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                @for (grupo of grupos; track grupo.id) {
                                                    <div class="grupo-item surface-card border-round p-3 flex justify-content-between align-items-center">
                                                        <div class="flex flex-column gap-1">
                                                            <span class="font-bold">{{ grupo.nombre }}</span>
                                                            <span class="text-sm text-color-secondary">
                                                                {{ grupo.competidores_actuales }}/{{ grupo.max_participantes }} miembros
                                                            </span>
                                                        </div>
                                                        <p-tag
                                                            [value]="grupo.slots_disponibles > 0 ? 'Disponible' : 'Lleno'"
                                                            [severity]="grupo.slots_disponibles > 0 ? 'success' : 'danger'"
                                                        ></p-tag>
                                                    </div>
                                                }
                                            </div>
                                        } @else {
                                            <div class="text-center p-4 text-color-secondary">
                                                <i class="pi pi-users text-2xl mb-2 block"></i>
                                                <p>No hay grupos creados aún. ¡Sé el primero!</p>
                                            </div>
                                        }
                                    </div>
                                </ng-template>
                            </p-card>
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
                    [disabled]="!newGrupoNombre.trim()"
                    (onClick)="crearGrupo()"
                ></p-button>
            </ng-template>
        </p-dialog>

        <p-dialog
            [(visible)]="joinDialogVisible"
            header="Unirse a un Grupo"
            [modal]="true"
            [style]="{ width: '500px' }"
            [closable]="true"
        >
            <div class="flex flex-col gap-3 p-2 max-h-96 overflow-y-auto">
                @if (loadingGrupos) {
                    <div class="text-center p-4">
                        <i class="pi pi-spin pi-spinner text-2xl"></i>
                    </div>
                } @else if (grupos.length === 0) {
                    <div class="text-center p-4">
                        <p class="text-color-secondary">No hay grupos disponibles.</p>
                    </div>
                } @else {
                    @for (grupo of grupos; track grupo.id) {
                        @if (grupo.slots_disponibles > 0) {
                            <div class="grupo-item surface-card border-round p-3 flex justify-content-between align-items-center">
                                <div class="flex flex-column gap-1">
                                    <span class="font-bold">{{ grupo.nombre }}</span>
                                    <span class="text-sm text-color-secondary">
                                        {{ grupo.competidores_actuales }}/{{ grupo.max_participantes }} miembros
                                                            </span>
                                                        </div>
                                                        <p-button
                                                            label="Unirse"
                                                            icon="pi pi-check"
                                                            severity="success"
                                                            (onClick)="unirseGrupo(grupo.id)"
                                                        ></p-button>
                                                    </div>
                                                }
                    }
                }
            </div>
            <ng-template pTemplate="footer">
                <p-button
                    label="Cancelar"
                    [text]="true"
                    severity="secondary"
                    (onClick)="joinDialogVisible = false"
                ></p-button>
            </ng-template>
        </p-dialog>
    `,
})
export class CompetenciaDetalleComponent implements OnInit {
    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private competenciasService = inject(CompetenciasService);
    private gruposService = inject(GruposService);
    private toast = inject(ToastService);
    private authService = inject(AuthService);

    competencia: Competencia | null = null;
    miInscripcion: InscripcionInfo | null = null;
    grupos: Grupo[] = [];

    loading = false;
    loadingGrupos = false;
    inscribiendose = false;
    creandoGrupo = false;
    saliendo = false;

    createDialogVisible = false;
    joinDialogVisible = false;
    newGrupoNombre = '';

    get isAdmin(): boolean {
        return this.authService.isAdmin();
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
            next: (res) => {
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
            next: (res) => {
                this.miInscripcion = res.inscripciones.find(i => i.competencia_id === id) ?? null;
            },
            error: () => {},
        });
    }

    loadGrupos(): void {
        if (!this.competencia) return;
        this.loadingGrupos = true;
        this.gruposService.listarGrupos(this.competencia.id).subscribe({
            next: (res) => {
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
        this.router.navigate(['/competencias']);
    }

    openCreateDialog(): void {
        this.newGrupoNombre = '';
        this.createDialogVisible = true;
    }

    crearGrupo(): void {
        if (!this.newGrupoNombre.trim() || !this.competencia) return;

        this.creandoGrupo = true;
        this.gruposService.crearGrupo(this.competencia.id, this.newGrupoNombre.trim()).subscribe({
            next: (res) => {
                this.toast.success(res.message);
                this.creandoGrupo = false;
                this.createDialogVisible = false;
                this.reloadAfterAction();
            },
            error: (err) => {
                this.toast.error(err);
                this.creandoGrupo = false;
            },
        });
    }

    unirseGrupo(grupoId: number): void {
        this.gruposService.unirseGrupo(grupoId).subscribe({
            next: (res) => {
                this.toast.success(res.message);
                this.joinDialogVisible = false;
                this.reloadAfterAction();
            },
            error: (err) => {
                this.toast.error(err);
            },
        });
    }

    salirDelGrupo(): void {
        if (!this.miInscripcion?.grupo) return;

        this.saliendo = true;
        this.gruposService.salirGrupo(this.miInscripcion.grupo.id).subscribe({
            next: (res) => {
                this.toast.success(res.message);
                this.saliendo = false;
                this.reloadAfterAction();
            },
            error: (err) => {
                this.toast.error(err);
                this.saliendo = false;
            },
        });
    }

    inscribirseIndividual(): void {
        if (!this.competencia) return;

        this.inscribiendose = true;
        this.competenciasService.inscribirse(this.competencia.id).subscribe({
            next: (res) => {
                this.toast.success(res.message);
                this.inscribiendose = false;
                this.reloadAfterAction();
            },
            error: (err) => {
                this.toast.error(err);
                this.inscribiendose = false;
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