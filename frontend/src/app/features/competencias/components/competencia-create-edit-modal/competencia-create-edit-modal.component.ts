import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { SelectModule } from 'primeng/select';
import { InputNumberModule } from 'primeng/inputnumber';
import { DatePickerModule } from 'primeng/datepicker';
import { MessageModule } from 'primeng/message';
import { FloatLabelModule } from 'primeng/floatlabel';
import { DialogModule } from 'primeng/dialog';

import { CompetenciasService } from '../../services/competencias.service';
import { Competencia, CreateCompetenciaDto, UpdateCompetenciaDto, NIVELES, ESTADOS, TIPOS } from '../../models/competencia.model';

export type ModalMode = 'create' | 'edit';

@Component({
    selector: 'app-competencia-create-edit-modal',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        ButtonModule,
        InputTextModule,
        TextareaModule,
        SelectModule,
        InputNumberModule,
        DatePickerModule,
        MessageModule,
        FloatLabelModule,
        DialogModule,
    ],
    templateUrl: './competencia-create-edit-modal.component.html',
})
export class CompetenciaCreateEditModalComponent implements OnChanges {
    private competenciasService = inject(CompetenciasService);
    private fb = inject(FormBuilder);

    @Input() visible = false;
    @Input() mode: ModalMode = 'create';
    @Input() data?: Competencia;
    @Output() visibleChange = new EventEmitter<boolean>();
    @Output() onSaved = new EventEmitter<void>();

    form: FormGroup;

    saving = false;

    niveles = NIVELES;
    estados = ESTADOS;
    tipos = TIPOS;

    constructor() {
        this.form = this.fb.group({
            nombre: ['', Validators.required],
            descripcion: ['', Validators.required],
            fecha_inicio: [null, Validators.required],
            fecha_fin: [null, Validators.required],
            nivel_dificultad: [null, Validators.required],
            estado: [null, Validators.required],
            tipo: [null, Validators.required],
            max_participantes: [1, [Validators.required, Validators.min(1)]],
        });
    }

    get isGrupal(): boolean {
        return this.form.get('tipo')?.value === 'Grupal';
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['visible'] && this.visible) {
            this.resetState();
        }
    }

    ngOnInit(): void {
        this.form.get('tipo')?.valueChanges.subscribe((tipo) => {
            if (tipo === 'Individual') {
                this.form.patchValue({ max_participantes: 1 });
                this.form.get('max_participantes')?.disable();
            } else {
                this.form.get('max_participantes')?.enable();
            }
        });
    }

    get modalTitle(): string {
        return this.mode === 'create' ? 'Nueva Competencia' : `Editar: ${this.data?.nombre}`;
    }

    get readonly(): boolean {
        return false;
    }

resetState(): void {
        this.saving = false;
        if (this.mode === 'create') {
            this.form.reset({
                nombre: '',
                descripcion: '',
                fecha_inicio: null,
                fecha_fin: null,
                nivel_dificultad: null,
                estado: null,
                tipo: null,
                max_participantes: 1,
            });
            this.form.get('max_participantes')?.disable();
        } else if (this.data) {
            const isGrupal = this.data.tipo === 'Grupal';
            this.form.patchValue({
                nombre: this.data.nombre,
                descripcion: this.data.descripcion,
                fecha_inicio: this.data.fecha_inicio ? new Date(this.data.fecha_inicio) : null,
                fecha_fin: this.data.fecha_fin ? new Date(this.data.fecha_fin) : null,
                nivel_dificultad: this.data.nivel_dificultad,
                estado: this.data.estado,
                tipo: this.data.tipo,
                max_participantes: this.data.max_participantes,
            });
            if (isGrupal) {
                this.form.get('max_participantes')?.enable();
            } else {
                this.form.get('max_participantes')?.disable();
            }
        }
    }

    isInvalid(fieldName: string): boolean {
        const control = this.form.get(fieldName);
        return !!(control && control.invalid && (control.dirty || control.touched));
    }

    hasDateValidationError(): boolean {
        const inicio = this.form.get('fecha_inicio')?.value;
        const fin = this.form.get('fecha_fin')?.value;
        if (inicio && fin) {
            const start = new Date(inicio);
            const end = new Date(fin);
            return end <= start;
        }
        return false;
    }

    save(): void {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }

        if (this.hasDateValidationError()) {
            return;
        }

        this.saving = true;

        const formValues = this.form.getRawValue();
        const payload: CreateCompetenciaDto | UpdateCompetenciaDto = {
            nombre: formValues.nombre,
            descripcion: formValues.descripcion || '',
            fecha_inicio: formValues.fecha_inicio ? this.formatDate(formValues.fecha_inicio) : '',
            fecha_fin: formValues.fecha_fin ? this.formatDate(formValues.fecha_fin) : '',
            nivel_dificultad: formValues.nivel_dificultad,
            estado: formValues.estado,
            tipo: formValues.tipo,
            max_participantes: formValues.max_participantes ?? 1,
        };

        const obs = this.mode === 'create'
            ? this.competenciasService.create(payload as CreateCompetenciaDto)
            : this.competenciasService.update(this.data!.id, payload as UpdateCompetenciaDto);

        obs.subscribe({
            next: () => {
                this.saving = false;
                this.onSaved.emit();
                this.close();
            },
            error: () => {
                this.saving = false;
            },
        });
    }

    close(): void {
        this.visible = false;
        this.visibleChange.emit(false);
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