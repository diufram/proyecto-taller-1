import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { SkeletonModule } from 'primeng/skeleton';
import { ToolbarModule } from 'primeng/toolbar';

import { ToastService } from '@/core/services/toast.service';
import { ProblemasService } from '@/features/problemas/services/problemas.service';
import { Problema, Dificultad } from '@/features/problemas/models/problema.model';
import { CompetenciasService } from '@/features/competencias/services/competencias.service';
import { Competencia } from '@/features/competencias/models/competencia.model';

@Component({
    selector: 'app-user-competencia-problemas',
    standalone: true,
    imports: [
        CommonModule,
        ButtonModule,
        CardModule,
        TagModule,
        ToastModule,
        SkeletonModule,
        ToolbarModule,
    ],
    templateUrl: './competencia-problemas.component.html',
    styleUrl: './competencia-problemas.component.scss',
})
export class UserCompetenciaProblemasComponent implements OnInit {
    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private problemasService = inject(ProblemasService);
    private competenciasService = inject(CompetenciasService);
    private toast = inject(ToastService);

    competenciaId!: number;
    competencia: Competencia | null = null;
    problemas: Problema[] = [];
    loading = false;
    loadingCompetencia = false;

    ngOnInit(): void {
        this.competenciaId = Number(this.route.snapshot.paramMap.get('id'));
        if (this.competenciaId) {
            this.loadCompetencia();
            this.loadProblemas();
        }
    }

    loadCompetencia(): void {
        this.loadingCompetencia = true;
        this.competenciasService.getById(this.competenciaId).subscribe({
            next: (res: { competencia: Competencia }) => {
                this.competencia = res.competencia;
                this.loadingCompetencia = false;
            },
            error: () => {
                this.loadingCompetencia = false;
            },
        });
    }

    loadProblemas(): void {
        this.loading = true;
        this.problemasService.getByCompetencia(this.competenciaId).subscribe({
            next: (res: { items: Problema[] }) => {
                this.problemas = res.items;
                this.loading = false;
            },
            error: () => {
                this.toast.error('Error', 'No se pudieron cargar los problemas');
                this.loading = false;
            },
        });
    }

    volver(): void {
        this.router.navigate(['/user/competencias', this.competenciaId]);
    }

    verProblema(problema: Problema): void {
        // TODO: Navigate to problem detail/solver page
        this.toast.info('Info', 'Funcionalidad en desarrollo');
    }

    getDificultadSeverity(dificultad: Dificultad): 'success' | 'warn' | 'danger' {
        switch (dificultad) {
            case 'Facil': return 'success';
            case 'Medio': return 'warn';
            case 'Dificil': return 'danger';
        }
    }

    getDificultadLabel(dificultad: Dificultad): string {
        switch (dificultad) {
            case 'Facil': return 'Fácil';
            case 'Medio': return 'Medio';
            case 'Dificil': return 'Difícil';
        }
    }
}