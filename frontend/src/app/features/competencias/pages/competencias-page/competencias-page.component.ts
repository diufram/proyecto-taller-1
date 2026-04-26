import { Component, OnInit, OnDestroy, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { TableModule, Table } from 'primeng/table';
import { ToolbarModule } from 'primeng/toolbar';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { PaginatorModule } from 'primeng/paginator';
import { SkeletonModule } from 'primeng/skeleton';
import { TooltipModule } from 'primeng/tooltip';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

import { AuthService } from '@/features/auth/services/auth.service';
import { ToastService } from '@/core/services/toast.service';
import { CompetenciasService } from '../../services/competencias.service';
import {
    Competencia,
    CreateCompetenciaDto,
    UpdateCompetenciaDto,
} from '../../models/competencia.model';
import { CompetenciaCreateEditModalComponent, ModalMode } from '../../components/competencia-create-edit-modal/competencia-create-edit-modal.component';
import { CompetenciaDeleteModalComponent } from '../../components/competencia-delete-modal/competencia-delete-modal.component';
import { RowAction } from '@/shared/components/shared-table/interfaces/table-config.interface';

@Component({
    selector: 'app-competencias-page',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ButtonModule,
        TableModule,
        ToolbarModule,
        InputTextModule,
        IconFieldModule,
        InputIconModule,
        PaginatorModule,
        SkeletonModule,
        TooltipModule,
        TagModule,
        ToastModule,
        CompetenciaCreateEditModalComponent,
        CompetenciaDeleteModalComponent,
    ],
    providers: [MessageService],
    templateUrl: './competencias-page.component.html',
    styleUrl: './competencias-page.component.scss',
})
export class CompetenciasPageComponent implements OnInit, OnDestroy {
    private competenciasService = inject(CompetenciasService);
    private authService = inject(AuthService);
    private toast = inject(ToastService);

    @ViewChild('dt') dt?: Table;

    loading = false;
    competencias: Competencia[] = [];

    totalRecords: number = 0;
    currentSearch: string = '';
    currentPage: number = 1;
    rows: number = 8;
    rowsPerPageOptions: number[] = [8];

    rowActions: RowAction[] = [];

    createEditVisible = false;
    createEditMode: ModalMode = 'create';
    selectedCompetencia?: Competencia;

    deleteVisible = false;
    deleteTarget?: Competencia;

    private searchTimeout?: ReturnType<typeof setTimeout>;

    get isAdmin(): boolean {
        return this.authService.isAdmin();
    }

    ngOnInit(): void {
        this.setupActions();
        this.loadFirstPage();
    }

    ngOnDestroy(): void {
        if (this.searchTimeout) {
            clearTimeout(this.searchTimeout);
        }
    }

    load(page: number = 1, search: string = ''): void {
        this.loading = true;

        this.competenciasService
            .getAll({ page, limit: this.rows, busqueda: search })
            .subscribe({
                next: (response) => {
                    this.competencias = response.items;
                    this.totalRecords = response.meta.total;
                    this.currentPage = page;
                    this.loading = false;
                },
                error: (err) => {
                    this.toast.error('Error', 'No se pudo cargar la lista de competencias');
                    this.loading = false;
                },
            });
    }

    loadFirstPage(): void {
        this.load(1, '');
    }

    onPageChange(event: { first?: number; rows?: number; page?: number }): void {
        const first = event.first ?? 0;
        const rows = event.rows ?? this.rows;
        const page = (event.page ?? Math.floor(first / rows)) + 1;
        this.load(page, this.currentSearch);
    }

    onSearchInput(event: Event): void {
        const value = (event.target as HTMLInputElement).value ?? '';
        this.currentSearch = value;

        if (this.searchTimeout) {
            clearTimeout(this.searchTimeout);
        }

        this.searchTimeout = setTimeout(() => {
            this.load(1, value);
        }, 350);
    }

    onCreate(): void {
        this.createEditMode = 'create';
        this.selectedCompetencia = undefined;
        this.createEditVisible = true;
    }

    onAction(e: { action: string; data: Competencia }): void {
        const comp = e.data;
        switch (e.action) {
            case 'edit':
                this.createEditMode = 'edit';
                this.selectedCompetencia = comp;
                this.createEditVisible = true;
                break;
            case 'delete':
                this.deleteTarget = comp;
                this.deleteVisible = true;
                break;
        }
    }

    onSaved(): void {
        const msg =
            this.createEditMode === 'create'
                ? 'Competencia creada correctamente'
                : 'Competencia actualizada correctamente';
        this.toast.success('Éxito', msg);
        this.createEditVisible = false;
        this.loadFirstPage();
    }

    onDeleted(): void {
        this.toast.success('Éxito', 'Competencia eliminada correctamente');
        this.deleteVisible = false;
        this.loadFirstPage();
    }

    private setupActions(): void {
        const allActions: RowAction[] = [
            {
                key: 'edit',
                icon: 'pi pi-pencil',
                severity: 'info',
                tooltip: 'Editar',
            },
            {
                key: 'delete',
                icon: 'pi pi-trash',
                severity: 'danger',
                tooltip: 'Eliminar',
            },
        ];

        this.rowActions = allActions;
    }

    getEstadoSeverity(
        estado: string,
    ): 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast' | undefined {
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
}