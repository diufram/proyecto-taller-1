import {
    ChangeDetectionStrategy,
    Component,
    OnDestroy,
    OnInit,
    ViewChild,
    inject,
    signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { ButtonModule } from 'primeng/button';
import { TableModule, Table } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { PaginatorModule } from 'primeng/paginator';
import { SkeletonModule } from 'primeng/skeleton';
import { TooltipModule } from 'primeng/tooltip';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { SelectModule } from 'primeng/select';
import { MessageService } from 'primeng/api';

import { ToastService } from '@/core/services/toast.service';
import {
    SolucionesService,
} from '../../../services/soluciones.service';
import {
    AdminSolucion,
    EstadoSolucion,
    ESTADO_SOLUCION_LABELS,
    ESTADO_SOLUCION_SEVERITY,
    ESTADOS_SOLUCION,
    LENGUAJES,
    Lenguaje,
} from '../../../models/solucion.model';
import { CompetenciasService } from '@/features/competencias/services/competencias.service';
import { Competencia } from '@/features/competencias/models/competencia.model';
import { ProblemasService } from '@/features/problemas/services/problemas.service';
import { Problema } from '@/features/problemas/models/problema.model';

interface EstadoFiltro {
    label: string;
    value: EstadoSolucion | null;
}

interface LenguajeFiltro {
    label: string;
    value: Lenguaje | null;
}

@Component({
    selector: 'app-admin-soluciones-page',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        CommonModule,
        FormsModule,
        ButtonModule,
        TableModule,
        InputTextModule,
        IconFieldModule,
        InputIconModule,
        PaginatorModule,
        SkeletonModule,
        TooltipModule,
        TagModule,
        ToastModule,
        SelectModule,
    ],
    providers: [MessageService],
    templateUrl: './admin-soluciones-page.component.html',
    styleUrl: './admin-soluciones-page.component.scss',
})
export class AdminSolucionesPageComponent implements OnInit, OnDestroy {
    private solucionesService = inject(SolucionesService);
    private competenciasService = inject(CompetenciasService);
    private problemasService = inject(ProblemasService);
    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private toast = inject(ToastService);

    @ViewChild('dt') dt?: Table;

    loading = signal(false);
    soluciones = signal<AdminSolucion[]>([]);

    competenciaId: number | null = null;
    problemaId: number | null = null;
    competencia = signal<Competencia | null>(null);
    problema = signal<Problema | null>(null);

    totalRecords = signal(0);
    currentSearch = '';
    currentPage = signal(1);
    rows = 8;
    rowsPerPageOptions = [8, 16, 24];

    currentEstado: EstadoSolucion | null = null;
    currentLenguaje: Lenguaje | null = null;

    estadoFiltroOptions: EstadoFiltro[] = [
        { label: 'Todos los estados', value: null },
        ...ESTADOS_SOLUCION.map((e) => ({
            label: ESTADO_SOLUCION_LABELS[e],
            value: e,
        })),
    ];

    lenguajeFiltroOptions: LenguajeFiltro[] = [
        { label: 'Todos los lenguajes', value: null },
        ...LENGUAJES.map((l) => ({ label: l, value: l })),
    ];

    private searchTimeout?: ReturnType<typeof setTimeout>;

    ngOnInit(): void {
        const cid = this.route.snapshot.paramMap.get('competenciaId');
        const pid = this.route.snapshot.paramMap.get('problemaId');
        if (cid) this.competenciaId = Number(cid);
        if (pid) this.problemaId = Number(pid);

        if (this.competenciaId) {
            this.loadCompetencia();
        }
        if (this.problemaId) {
            this.loadProblema();
        }
        this.load(1);
    }

    ngOnDestroy(): void {
        if (this.searchTimeout) {
            clearTimeout(this.searchTimeout);
        }
    }

    loadCompetencia(): void {
        if (!this.competenciaId) return;
        this.competenciasService.getById(this.competenciaId).subscribe({
            next: (res: { competencia: Competencia }) => {
                this.competencia.set(res.competencia);
            },
            error: () => undefined,
        });
    }

    loadProblema(): void {
        if (!this.problemaId) return;
        this.problemasService.getById(this.problemaId).subscribe({
            next: (res: { problema: Problema }) => {
                this.problema.set(res.problema);
            },
            error: () => undefined,
        });
    }

    load(page: number = 1): void {
        this.loading.set(true);

        const params: Record<string, unknown> = {
            page,
            limit: this.rows,
        };
        if (this.currentSearch.trim().length > 0) {
            params['search'] = this.currentSearch.trim();
        }
        if (this.currentEstado) {
            params['estado'] = this.currentEstado;
        }
        if (this.currentLenguaje) {
            params['lenguaje_programacion'] = this.currentLenguaje;
        }
        if (this.competenciaId) {
            params['competencia_id'] = this.competenciaId;
        }
        if (this.problemaId) {
            params['problema_id'] = this.problemaId;
        }

        this.solucionesService.getAllAdmin(params).subscribe({
            next: (response) => {
                this.soluciones.set(response.items);
                this.totalRecords.set(response.meta.total);
                this.currentPage.set(page);
                this.loading.set(false);
            },
            error: () => {
                this.toast.error('No se pudieron cargar las soluciones');
                this.loading.set(false);
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
        this.load(page);
    }

    onSearchInput(event: Event): void {
        const value = (event.target as HTMLInputElement).value ?? '';
        this.currentSearch = value;

        if (this.searchTimeout) {
            clearTimeout(this.searchTimeout);
        }
        this.searchTimeout = setTimeout(() => {
            this.load(1);
        }, 350);
    }

    onEstadoFilterChange(value: EstadoSolucion | null): void {
        this.currentEstado = value;
        this.load(1);
    }

    onLenguajeFilterChange(value: Lenguaje | null): void {
        this.currentLenguaje = value;
        this.load(1);
    }

    clearFilters(): void {
        this.currentSearch = '';
        this.currentEstado = null;
        this.currentLenguaje = null;
        this.load(1);
    }

    get hasActiveFilters(): boolean {
        return (
            this.currentSearch.trim().length > 0 ||
            this.currentEstado !== null ||
            this.currentLenguaje !== null
        );
    }

    volver(): void {
        if (this.problemaId && this.competenciaId) {
            this.router.navigate([
                '/admin/competencias/problemas',
                this.competenciaId,
            ]);
        } else {
            this.router.navigate(['/admin/competencias']);
        }
    }

    openCalificar(s: AdminSolucion): void {
        if (this.problemaId && this.competenciaId) {
            this.router.navigate([
                '/admin/competencias/problemas',
                this.competenciaId,
                'problema',
                this.problemaId,
                'soluciones',
                s.id,
                'calificar',
            ]);
            return;
        }

        if (this.competenciaId) {
            this.router.navigate([
                '/admin/competencias/problemas',
                this.competenciaId,
                'soluciones',
                s.id,
                'calificar',
            ]);
            return;
        }

        this.router.navigate(['/admin/competencias']);
    }

    displayName(s: AdminSolucion): string {
        const nombre = s.usuario_nombre?.trim();
        const apellido = s.usuario_apellido?.trim();
        if (nombre || apellido) {
            return `${nombre ?? ''} ${apellido ?? ''}`.trim();
        }
        return s.usuario_email;
    }

    estadoLabel(estado: EstadoSolucion): string {
        return ESTADO_SOLUCION_LABELS[estado];
    }

    estadoSeverity(
        estado: EstadoSolucion,
    ): 'info' | 'success' | 'danger' | 'warn' {
        return ESTADO_SOLUCION_SEVERITY[estado];
    }
}
