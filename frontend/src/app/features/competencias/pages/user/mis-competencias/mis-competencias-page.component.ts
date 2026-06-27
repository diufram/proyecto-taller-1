import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { forkJoin, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

import { ButtonModule } from 'primeng/button';
import { SkeletonModule } from 'primeng/skeleton';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';

import {
    CompetenciasService,
    InscripcionInfo,
} from '@/features/competencias/services/competencias.service';
import { Competencia } from '@/features/competencias/models/competencia.model';
import { ToastService } from '@/core/services/toast.service';

interface CompetenciaInscritaView {
    inscripcion: InscripcionInfo;
    competencia: Competencia;
}

@Component({
    selector: 'app-mis-competencias-page',
    standalone: true,
    imports: [CommonModule, ButtonModule, SkeletonModule, TagModule, ToastModule],
    templateUrl: './mis-competencias-page.component.html',
    styleUrl: './mis-competencias-page.component.scss',
})
export class MisCompetenciasPageComponent implements OnInit {
    private competenciasService = inject(CompetenciasService);
    private router = inject(Router);
    private toast = inject(ToastService);

    loading = false;
    competenciasInscritas: CompetenciaInscritaView[] = [];

    ngOnInit(): void {
        this.load();
    }

    load(): void {
        this.loading = true;

        this.competenciasService
            .misInscripciones()
            .pipe(
                switchMap((response) => {
                    const inscripciones = response.inscripciones ?? [];
                    if (inscripciones.length === 0) {
                        return of([]);
                    }

                    return forkJoin(
                        inscripciones.map((inscripcion) =>
                            this.competenciasService
                                .getById(inscripcion.competencia_id)
                                .pipe(
                                    map((res) => ({
                                        inscripcion,
                                        competencia: res.competencia,
                                    })),
                                    catchError(() => of(null)),
                                ),
                        ),
                    ).pipe(
                        map((items) =>
                            items.filter(
                                (item): item is CompetenciaInscritaView =>
                                    item !== null,
                            ),
                        ),
                    );
                }),
            )
            .subscribe({
                next: (items) => {
                    this.competenciasInscritas = items;
                    this.loading = false;
                },
                error: () => {
                    this.toast.error('Error', 'No se pudieron cargar tus competencias');
                    this.loading = false;
                },
            });
    }

    verProblemas(item: CompetenciaInscritaView): void {
        this.router.navigate([
            '/competencias',
            item.competencia.id,
            'problemas',
        ]);
    }

    verDetalle(item: CompetenciaInscritaView): void {
        this.router.navigate(['/competencias', item.competencia.id]);
    }

    explorarCompetencias(): void {
        this.router.navigate(['/competencias']);
    }

    get activas(): number {
        return this.competenciasInscritas.filter(
            ({ competencia }) =>
                competencia.estado === 'Abierta' || competencia.estado === 'En curso',
        ).length;
    }

    get finalizadas(): number {
        return this.competenciasInscritas.filter(
            ({ competencia }) => competencia.estado === 'Finalizada',
        ).length;
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
