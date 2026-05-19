import { Component, Input, Output, EventEmitter, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

import { GruposService, Grupo } from '../../services/grupos.service';
import { Competencia } from '../../models/competencia.model';

export type GrupoMode = 'create' | 'join';

@Component({
    selector: 'app-grupos-page',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ButtonModule,
        DialogModule,
        InputTextModule,
        TagModule,
        ToastModule,
    ],
    providers: [MessageService],
    template: `
        <p-toast></p-toast>

        <div class="grupos-page">
            <div class="mb-3 pl-1">
                <h3 class="text-2xl font-bold text-color m-0">Grupos - {{ competencia?.nombre }}</h3>
            </div>

            <p-toolbar styleClass="mb-3 gap-2 w-full border-none p-0 bg-transparent">
                <ng-template pTemplate="left">
                    <div class="actions-container flex flex-col md:flex-row w-full gap-2 items-stretch md:items-center">
                        <p-button
                            label="Crear Grupo"
                            icon="pi pi-plus"
                            severity="primary"
                            class="w-full md:w-auto"
                            (onClick)="openCreateDialog()"
                        ></p-button>
                        <p-button
                            label="Unirse a Grupo"
                            icon="pi pi-users"
                            severity="secondary"
                            [outlined]="true"
                            class="w-full md:w-auto"
                            (onClick)="loadGrupos(); joinDialogVisible = true"
                        ></p-button>
                    </div>
                </ng-template>
            </p-toolbar>

            @if (loading) {
                <div class="text-center p-4">
                    <i class="pi pi-spin pi-spinner text-3xl"></i>
                    <p>Cargando grupos...</p>
                </div>
            } @else if (grupos.length === 0) {
                <div class="text-center p-4 border-round surface-card">
                    <i class="pi pi-users text-4xl text-color-secondary mb-2"></i>
                    <p class="text-color-secondary">No hay grupos creados aún. ¡Sé el primero en crear uno!</p>
                </div>
            } @else {
                <div class="grupos-list flex flex-col gap-3">
                    @for (grupo of grupos; track grupo.id) {
                        <div class="grupo-card surface-card border-round p-3 flex justify-content-between align-items-center">
                            <div class="flex flex-column gap-1">
                                <span class="font-bold text-lg">{{ grupo.nombre }}</span>
                                <div class="flex gap-2 align-items-center">
                                    <i class="pi pi-users text-color-secondary text-sm"></i>
                                    <span class="text-sm text-color-secondary">
                                        {{ grupo.competidores_actuales }}/{{ grupo.max_participantes }} participantes
                                    </span>
                                </div>
                            </div>
                            <p-tag
                                [value]="grupo.slots_disponibles > 0 ? 'Slots disponibles' : 'Lleno'"
                                [severity]="grupo.slots_disponibles > 0 ? 'success' : 'danger'"
                            ></p-tag>
                        </div>
                    }
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
                    [loading]="saving"
                    [disabled]="!newGrupoNombre.trim()"
                    (onClick)="createGrupo()"
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
            <div class="flex flex-col gap-3 p-2">
                @if (loadingGrupos) {
                    <div class="text-center p-4">
                        <i class="pi pi-spin pi-spinner text-2xl"></i>
                    </div>
                } @else if (grupos.length === 0) {
                    <div class="text-center p-4">
                        <p class="text-color-secondary">No hay grupos disponibles en este momento.</p>
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
                                    [disabled]="grupo.slots_disponibles <= 0"
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
export class GruposPageComponent implements OnInit {
    @Input() competencia!: Competencia;
    @Output() onGrupoCreated = new EventEmitter<void>();

    private gruposService = inject(GruposService);
    private messageService = inject(MessageService);

    grupos: Grupo[] = [];
    loading = false;
    loadingGrupos = false;
    saving = false;

    createDialogVisible = false;
    joinDialogVisible = false;
    newGrupoNombre = '';

    ngOnInit(): void {
        this.loadGrupos();
    }

    loadGrupos(): void {
        this.loading = true;
        this.gruposService.listarGrupos(this.competencia.id).subscribe({
            next: (res) => {
                this.grupos = res.grupos;
                this.loading = false;
            },
            error: () => {
                this.messageService.error('Error', 'No se pudieron cargar los grupos');
                this.loading = false;
            },
        });
    }

    openCreateDialog(): void {
        this.newGrupoNombre = '';
        this.createDialogVisible = true;
    }

    createGrupo(): void {
        if (!this.newGrupoNombre.trim() || !this.competencia) return;

        this.saving = true;
        this.gruposService.crearGrupo(this.competencia.id, this.newGrupoNombre.trim()).subscribe({
            next: (res) => {
                this.messageService.success('Éxito', res.message);
                this.saving = false;
                this.createDialogVisible = false;
                this.loadGrupos();
                this.onGrupoCreated.emit();
            },
            error: (err) => {
                this.messageService.error('Error', err.error?.message || 'No se pudo crear el grupo');
                this.saving = false;
            },
        });
    }

    loadGruposForJoin(): void {
        this.loadingGrupos = true;
        this.gruposService.listarGrupos(this.competencia.id).subscribe({
            next: (res) => {
                this.grupos = res.grupos;
                this.loadingGrupos = false;
            },
            error: () => {
                this.messageService.error('Error', 'No se pudieron cargar los grupos');
                this.loadingGrupos = false;
            },
        });
    }

    unirseGrupo(grupoId: number): void {
        this.gruposService.unirseGrupo(grupoId).subscribe({
            next: (res) => {
                this.messageService.success('Éxito', res.message);
                this.joinDialogVisible = false;
                this.onGrupoCreated.emit();
            },
            error: (err) => {
                this.messageService.error('Error', err.error?.message || 'No se pudo unir al grupo');
            },
        });
    }
}