import { Component, OnInit, OnDestroy, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { SkeletonModule } from 'primeng/skeleton';
import { TooltipModule } from 'primeng/tooltip';
import { PaginatorModule } from 'primeng/paginator';
import { TableModule, Table } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { SelectModule } from 'primeng/select';
import { ToolbarModule } from 'primeng/toolbar';
import { MessageService } from 'primeng/api';

import { ToastService } from '@/core/services/toast.service';
import { ProblemasService, GetProblemasParams } from '../../services/problemas.service';
import {
    Problema,
    Dificultad,
    DIFICULTADES,
    DIFICULTAD_LABELS,
    ProblemasStats,
} from '../../models/problema.model';
import { ProblemaDeleteModalComponent } from '../../components/problema-delete-modal/problema-delete-modal.component';
import {
    NivelCompetencia,
    TipoCompetencia,
} from '../../services/problem-generator.service';

@Component({
    selector: 'app-problemas-page',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ButtonModule,
        TagModule,
        ToastModule,
        SkeletonModule,
        TooltipModule,
        PaginatorModule,
        TableModule,
        InputTextModule,
        IconFieldModule,
        InputIconModule,
        SelectModule,
        ToolbarModule,
        ProblemaDeleteModalComponent,
    ],
    providers: [MessageService],
    templateUrl: './problemas-page.component.html',
    styleUrl: './problemas-page.component.scss',
})
export class ProblemasPageComponent implements OnInit, OnDestroy {
    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private problemasService = inject(ProblemasService);
    private toast = inject(ToastService);

    @ViewChild('dt') dt?: Table;

    competenciaId!: number;
    competenciaNombre: string = '';
    competenciaDescripcion: string = '';
    nivelDificultad: NivelCompetencia = 'Intermedio';
    tipo: TipoCompetencia = 'Individual';

    loading = false;
    problemas: Problema[] = [];
    stats: ProblemasStats = {
        total: 0,
        por_dificultad: { Facil: 0, Medio: 0, Dificil: 0 },
    };

    totalRecords = 0;
    currentPage = 1;
    rows = 8;
    rowsPerPageOptions = [8, 16, 24];
    currentSearch = '';
    currentDificultad: Dificultad | null = null;

    deleteVisible = false;
    deleteTarget?: Problema;

    dificultadFiltroOptions: { label: string; value: Dificultad | null }[] = [
        { label: 'Todas las dificultades', value: null },
        ...DIFICULTADES.map((d) => ({ label: DIFICULTAD_LABELS[d], value: d })),
    ];

    private searchTimeout?: ReturnType<typeof setTimeout>;

    ngOnInit(): void {
        this.competenciaId = Number(
            this.route.snapshot.paramMap.get('competenciaId'),
        );
        this.competenciaNombre =
            history.state?.competenciaNombre ??
            `Competencia #${this.competenciaId}`;
        this.competenciaDescripcion =
            history.state?.competenciaDescripcion ?? '';
        this.nivelDificultad =
            (history.state?.nivelDificultad as NivelCompetencia) ??
            'Intermedio';
        this.tipo = (history.state?.tipo as TipoCompetencia) ?? 'Individual';
        this.load(1, '');
    }

    ngOnDestroy(): void {
        if (this.searchTimeout) {
            clearTimeout(this.searchTimeout);
        }
    }

    load(page: number = 1, search: string = ''): void {
        this.loading = true;

        const params: GetProblemasParams = {
            page,
            limit: this.rows,
        };
        if (search.trim().length > 0) {
            params.search = search.trim();
        }
        if (this.currentDificultad) {
            params.dificultad = this.currentDificultad;
        }

        this.problemasService.getByCompetencia(this.competenciaId, params).subscribe({
            next: (response) => {
                this.problemas = response.items;
                this.totalRecords = response.meta.total;
                this.currentPage = page;
                if (response.stats) {
                    this.stats = response.stats;
                }
                this.loading = false;
            },
            error: () => {
                this.toast.error(
                    'No se pudieron cargar los problemas',
                );
                this.loading = false;
            },
        });
    }

    onPageChange(event: {
        first?: number;
        rows?: number;
        page?: number;
    }): void {
        const first = event.first ?? 0;
        const rows = event.rows ?? this.rows;
        this.rows = rows;
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

    onDificultadFilterChange(value: Dificultad | null): void {
        this.currentDificultad = value;
        this.load(1, this.currentSearch);
    }

    clearFilters(): void {
        this.currentSearch = '';
        this.currentDificultad = null;
        this.load(1, '');
    }

    get hasActiveFilters(): boolean {
        return this.currentSearch.trim().length > 0 || !!this.currentDificultad;
    }

    getDificultadSeverity(
        dificultad: Dificultad,
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

    getDificultadLabel(dificultad: Dificultad): string {
        return DIFICULTAD_LABELS[dificultad];
    }

    getPorcentajeAciertos(problema: Problema): number {
        if (problema.total_soluciones === 0) return 0;
        return Math.round(
            (problema.soluciones_correctas / problema.total_soluciones) * 100,
        );
    }

    goToCreate(): void {
        this.router.navigate(
            ['/admin/competencias/problemas', this.competenciaId, 'nuevo'],
            {
                state: this.getNavState(),
            },
        );
    }

    goToEdit(problema: Problema): void {
        this.router.navigate(
            [
                '/admin/competencias/problemas',
                this.competenciaId,
                'editar',
                problema.id,
            ],
            {
                state: this.getNavState(),
            },
        );
    }

    goToGenerate(): void {
        this.router.navigate(
            ['/admin/competencias/problemas', this.competenciaId, 'generar-ia'],
            {
                state: this.getNavState(),
            },
        );
    }

    openDeleteModal(problema: Problema): void {
        this.deleteTarget = problema;
        this.deleteVisible = true;
    }

    onDeleted(): void {
        this.problemasService.delete(this.deleteTarget!.id).subscribe({
            next: () => {
                this.toast.success(
                    'Éxito',
                    'Problema eliminado correctamente',
                );
                this.deleteVisible = false;
                this.load(this.currentPage, this.currentSearch);
            },
            error: (err) => {
                this.toast.error(err);
            },
        });
    }

    volver(): void {
        this.router.navigate(['/admin/competencias']);
    }

    private getNavState(): {
        competenciaNombre: string;
        competenciaDescripcion: string;
        nivelDificultad: NivelCompetencia;
        tipo: TipoCompetencia;
    } {
        return {
            competenciaNombre: this.competenciaNombre,
            competenciaDescripcion: this.competenciaDescripcion,
            nivelDificultad: this.nivelDificultad,
            tipo: this.tipo,
        };
    }
}
