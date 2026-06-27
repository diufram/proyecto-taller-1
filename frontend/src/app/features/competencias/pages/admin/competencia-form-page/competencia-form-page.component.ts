import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
    FormBuilder,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize } from 'rxjs';

import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { SelectModule } from 'primeng/select';
import { SkeletonModule } from 'primeng/skeleton';
import { TextareaModule } from 'primeng/textarea';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';

import { ToastService } from '@/core/services/toast.service';
import {
    Competencia,
    CreateCompetenciaDto,
    ESTADOS,
    NIVELES,
    UpdateCompetenciaDto,
} from '@/features/competencias/models/competencia.model';
import { CompetenciasService } from '@/features/competencias/services/competencias.service';

type CompetenciaFormMode = 'create' | 'edit';

@Component({
    selector: 'app-competencia-form-page',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        ButtonModule,
        DatePickerModule,
        InputNumberModule,
        InputTextModule,
        MessageModule,
        SelectModule,
        SkeletonModule,
        TextareaModule,
        ToastModule,
        ToolbarModule,
    ],
    templateUrl: './competencia-form-page.component.html',
    styleUrl: './competencia-form-page.component.scss',
})
export class CompetenciaFormPageComponent implements OnInit {
    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private fb = inject(FormBuilder);
    private competenciasService = inject(CompetenciasService);
    private toast = inject(ToastService);

    mode: CompetenciaFormMode = 'create';
    competenciaId?: number;
    competencia?: Competencia;
    loadingData = false;
    saving = false;

    form: FormGroup;

    readonly niveles = NIVELES;
    readonly estados = ESTADOS;

    constructor() {
        this.form = this.fb.group({
            nombre: ['', Validators.required],
            fecha_inicio: [null, Validators.required],
            fecha_fin: [null, Validators.required],
            nivel_dificultad: [null, Validators.required],
            estado: [null, Validators.required],
            max_participantes: [1, [Validators.required, Validators.min(1)]],
        });
    }

    ngOnInit(): void {
        this.competenciaId = this.route.snapshot.paramMap.get('id')
            ? Number(this.route.snapshot.paramMap.get('id'))
            : undefined;
        this.mode = this.competenciaId ? 'edit' : 'create';

        if (this.mode === 'edit' && this.competenciaId) {
            this.loadCompetencia();
        } else {
            this.resetFormForCreate();
        }
    }

    get pageTitle(): string {
        return this.mode === 'create'
            ? 'Nueva Competencia'
            : `Editar Competencia${this.competencia?.nombre ? ` - ${this.competencia.nombre}` : ''}`;
    }

    get isValid(): boolean {
        return this.form.valid && !this.hasDateValidationError();
    }

    get saveLabel(): string {
        if (this.saving) {
            return this.mode === 'create' ? 'Creando...' : 'Guardando...';
        }
        return this.mode === 'create' ? 'Crear competencia' : 'Guardar cambios';
    }

    get saveIcon(): string {
        return this.mode === 'create' ? 'pi pi-plus' : 'pi pi-save';
    }

    isInvalid(fieldName: string): boolean {
        const control = this.form.get(fieldName);
        return !!(
            control &&
            control.invalid &&
            (control.dirty || control.touched)
        );
    }

    hasDateValidationError(): boolean {
        const inicio = this.form.get('fecha_inicio')?.value;
        const fin = this.form.get('fecha_fin')?.value;
        if (!inicio || !fin) return false;

        return new Date(fin) <= new Date(inicio);
    }

    save(): void {
        if (this.form.invalid || this.hasDateValidationError()) {
            this.form.markAllAsTouched();
            return;
        }

        this.saving = true;

        const formValues = this.form.getRawValue();
        const payload: CreateCompetenciaDto | UpdateCompetenciaDto = {
            nombre: formValues.nombre,
            fecha_inicio: formValues.fecha_inicio
                ? this.formatDate(formValues.fecha_inicio)
                : '',
            fecha_fin: formValues.fecha_fin
                ? this.formatDate(formValues.fecha_fin)
                : '',
            nivel_dificultad: formValues.nivel_dificultad,
            estado: formValues.estado,
            max_participantes: formValues.max_participantes ?? 1,
        };

        const obs =
            this.mode === 'create'
                ? this.competenciasService.create(payload as CreateCompetenciaDto)
                : this.competenciasService.update(
                      this.competenciaId!,
                      payload as UpdateCompetenciaDto,
                  );

        obs.pipe(finalize(() => (this.saving = false))).subscribe({
            next: () => {
                this.toast.success(
                    'Éxito',
                    this.mode === 'create'
                        ? 'Competencia creada correctamente'
                        : 'Competencia actualizada correctamente',
                );
                this.goBack();
            },
            error: () => {
                this.toast.error(
                    'Error',
                    this.mode === 'create'
                        ? 'No se pudo crear la competencia'
                        : 'No se pudo actualizar la competencia',
                );
            },
        });
    }

    cancel(): void {
        this.goBack();
    }

    private loadCompetencia(): void {
        this.loadingData = true;
        this.competenciasService
            .getById(this.competenciaId!)
            .pipe(finalize(() => (this.loadingData = false)))
            .subscribe({
                next: (res) => {
                    this.competencia = res.competencia;
                    this.form.patchValue({
                        nombre: res.competencia.nombre,
                        fecha_inicio: res.competencia.fecha_inicio
                            ? new Date(res.competencia.fecha_inicio)
                            : null,
                        fecha_fin: res.competencia.fecha_fin
                            ? new Date(res.competencia.fecha_fin)
                            : null,
                        nivel_dificultad: res.competencia.nivel_dificultad,
                        estado: res.competencia.estado,
                        max_participantes: res.competencia.max_participantes,
                    });
                },
                error: () => {
                    this.toast.error('No se pudo cargar la competencia');
                    this.goBack();
                },
            });
    }

    private resetFormForCreate(): void {
        this.form.reset({
            nombre: '',
            fecha_inicio: null,
            fecha_fin: null,
            nivel_dificultad: null,
            estado: null,
            max_participantes: 1,
        });
    }

    private goBack(): void {
        this.router.navigate(['/admin/competencias']);
    }

    private formatDate(date: Date): string {
        const d = new Date(date);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        const hours = String(d.getHours()).padStart(2, '0');
        const minutes = String(d.getMinutes()).padStart(2, '0');
        const seconds = String(d.getSeconds()).padStart(2, '0');
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    }
}
