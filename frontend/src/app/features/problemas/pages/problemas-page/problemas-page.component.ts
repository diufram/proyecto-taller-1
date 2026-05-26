import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

import { ButtonModule } from 'primeng/button';
import { ToolbarModule } from 'primeng/toolbar';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { SkeletonModule } from 'primeng/skeleton';
import { TooltipModule } from 'primeng/tooltip';
import { PaginatorModule } from 'primeng/paginator';
import { CardModule } from 'primeng/card';
import { MessageService } from 'primeng/api';

import { ToastService } from '@/core/services/toast.service';
import { ProblemasService } from '../../services/problemas.service';
import { Problema, Dificultad, DIFICULTADES } from '../../models/problema.model';
import { ProblemaCreateEditModalComponent } from '../../components/problema-create-edit-modal/problema-create-edit-modal.component';
import { ProblemaDeleteModalComponent } from '../../components/problema-delete-modal/problema-delete-modal.component';

@Component({
    selector: 'app-problemas-page',
    standalone: true,
    imports: [
        CommonModule,
        ButtonModule,
        CardModule,
        ToolbarModule,
        TagModule,
        ToastModule,
        SkeletonModule,
        TooltipModule,
        PaginatorModule,
        ProblemaCreateEditModalComponent,
        ProblemaDeleteModalComponent,
    ],
    providers: [MessageService],
    templateUrl: './problemas-page.component.html',
    styleUrl: './problemas-page.component.scss',
})
export class ProblemasPageComponent implements OnInit {
    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private problemasService = inject(ProblemasService);
    private toast = inject(ToastService);

    competenciaId!: number;
    competenciaNombre: string = '';

    loading = false;
    problemas: Problema[] = [];
    totalRecords = 0;
    rows = 10;
    rowsPerPageOptions = [10];

    createEditVisible = false;
    createEditMode: 'create' | 'edit' = 'create';
    selectedProblema?: Problema;

    deleteVisible = false;
    deleteTarget?: Problema;

    dificultades = DIFICULTADES;

    ngOnInit(): void {
        this.competenciaId = Number(this.route.snapshot.paramMap.get('competenciaId'));
        this.competenciaNombre = history.state?.competenciaNombre ?? `Competencia #${this.competenciaId}`;
        this.loadProblemas();
    }

    loadProblemas(): void {
        this.loading = true;
        this.problemasService.getByCompetencia(this.competenciaId).subscribe({
            next: (res) => {
                this.problemas = res.items;
                this.totalRecords = res.meta.total;
                this.loading = false;
            },
            error: () => {
                this.toast.error('No se pudieron cargar los problemas');
                this.loading = false;
            },
        });
    }

    getDificultadSeverity(dificultad: Dificultad): 'success' | 'warn' | 'danger' {
        switch (dificultad) {
            case 'Facil': return 'success';
            case 'Medio': return 'warn';
            case 'Dificil': return 'danger';
        }
    }

    openCreateModal(): void {
        this.createEditMode = 'create';
        this.selectedProblema = undefined;
        this.createEditVisible = true;
    }

    openEditModal(problema: Problema): void {
        this.createEditMode = 'edit';
        this.selectedProblema = problema;
        this.createEditVisible = true;
    }

    openDeleteModal(problema: Problema): void {
        this.deleteTarget = problema;
        this.deleteVisible = true;
    }

    onSaved(): void {
        const msg = this.createEditMode === 'create'
            ? 'Problema creado correctamente'
            : 'Problema actualizado correctamente';
        this.toast.success('Éxito', msg);
        this.createEditVisible = false;
        this.loadProblemas();
    }

    onDeleted(): void {
        this.problemasService.delete(this.deleteTarget!.id).subscribe({
            next: () => {
                this.toast.success('Éxito', 'Problema eliminado correctamente');
                this.deleteVisible = false;
                this.loadProblemas();
            },
            error: (err) => {
                this.toast.error(err);
            },
        });
    }

    volver(): void {
        this.router.navigate(['/admin/competencias']);
    }
}