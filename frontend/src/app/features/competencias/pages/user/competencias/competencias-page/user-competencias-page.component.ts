import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { ButtonModule } from 'primeng/button';
import { SkeletonModule } from 'primeng/skeleton';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

import { ToastService } from '@/core/services/toast.service';
import { CompetenciasService } from '@/features/competencias/services/competencias.service';
import { Competencia } from '@/features/competencias/models/competencia.model';
import { AuthService } from '@/features/auth/services/auth.service';

@Component({
    selector: 'app-user-competencias-page',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        RouterLink,
        ButtonModule,
        SkeletonModule,
        TagModule,
        ToastModule,
    ],
    providers: [MessageService],
    templateUrl: './competencias-page.component.html',
    styleUrl: './competencias-page.component.scss',
})
export class UserCompetenciasPageComponent implements OnInit, OnDestroy {
    private competenciasService = inject(CompetenciasService);
    private authService = inject(AuthService);
    private toast = inject(ToastService);
    private router = inject(Router);

    loading = false;
    competencias: Competencia[] = [];
    inscritas = new Set<number>();
    inscribiendoCompetenciaId: number | null = null;

    private searchTimeout?: ReturnType<typeof setTimeout>;

    ngOnInit(): void {
        this.load();
    }

    ngOnDestroy(): void {
        if (this.searchTimeout) {
            clearTimeout(this.searchTimeout);
        }
    }

    load(): void {
        this.loading = true;

        this.competenciasService
            .getAll({ page: 1, limit: 100 })
            .subscribe({
                next: (response) => {
                    this.competencias = response.items;
                    this.loading = false;
                    if (this.authService.isAuthenticated()) {
                        this.loadMisInscripciones();
                    }
                },
                error: (err: any) => {
                    this.toast.error('Error', 'No se pudo cargar la lista de competencias');
                    this.loading = false;
                },
            });
    }

    onSearchInput(event: Event): void {
        // TODO: implement search for user view
    }

    verDetalle(competencia: Competencia): void {
        this.router.navigate(['/competencias', competencia.id]);
    }

    isInscrito(competenciaId: number): boolean {
        return this.inscritas.has(competenciaId);
    }

    get isAuthenticated(): boolean {
        return this.authService.isAuthenticated();
    }

    get competenciasAbiertas(): number {
        return this.competencias.filter((comp) => comp.estado === 'Abierta').length;
    }

    get competenciasEnCurso(): number {
        return this.competencias.filter((comp) => comp.estado === 'En curso').length;
    }

    inscribirse(competencia: Competencia): void {
        if (!this.isAuthenticated) {
            this.router.navigate(['/auth/login'], {
                queryParams: { redirect: `/competencias/${competencia.id}` },
            });
            return;
        }

        if (this.inscribiendoCompetenciaId || this.isInscrito(competencia.id)) {
            return;
        }

        this.inscribiendoCompetenciaId = competencia.id;

        this.competenciasService.inscribirse(competencia.id).subscribe({
            next: () => {
                this.inscritas.add(competencia.id);
                this.toast.success('Éxito', 'Te inscribiste correctamente a la competencia');
                this.inscribiendoCompetenciaId = null;
            },
            error: (err: any) => {
                const msg = err?.message || 'No se pudo completar la inscripción';
                this.toast.error('Error', msg);
                this.inscribiendoCompetenciaId = null;
            },
        });
    }

    private loadMisInscripciones(): void {
        this.competenciasService.misInscripciones().subscribe({
            next: (response: { inscripciones: Array<{ competencia_id: number }> }) => {
                this.inscritas = new Set(
                    (response.inscripciones || []).map((item: { competencia_id: number }) => item.competencia_id),
                );
            },
            error: () => {
                this.inscritas = new Set<number>();
            },
        });
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
