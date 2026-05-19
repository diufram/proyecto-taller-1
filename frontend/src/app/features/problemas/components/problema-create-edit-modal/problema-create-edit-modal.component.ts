import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { SelectModule } from 'primeng/select';
import { DialogModule } from 'primeng/dialog';
import { MessageModule } from 'primeng/message';
import { FloatLabelModule } from 'primeng/floatlabel';

import { ProblemasService } from '../../services/problemas.service';
import { Problema, CreateProblemaDto, UpdateProblemaDto, DIFICULTADES, Dificultad } from '../../models/problema.model';

export type ProblemaModalMode = 'create' | 'edit';

@Component({
    selector: 'app-problema-create-edit-modal',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        ButtonModule,
        InputTextModule,
        TextareaModule,
        SelectModule,
        DialogModule,
        MessageModule,
        FloatLabelModule,
    ],
    templateUrl: './problema-create-edit-modal.component.html',
})
export class ProblemaCreateEditModalComponent implements OnChanges {
    private problemasService = inject(ProblemasService);
    private fb = inject(FormBuilder);

    @Input() visible = false;
    @Input() mode: ProblemaModalMode = 'create';
    @Input() competenciaId?: number;
    @Input() data?: Problema;
    @Output() visibleChange = new EventEmitter<boolean>();
    @Output() onSaved = new EventEmitter<void>();

    form: FormGroup;

    saving = false;
    dificultades = DIFICULTADES;

    constructor() {
        this.form = this.fb.group({
            titulo: ['', Validators.required],
            descripcion: ['', Validators.required],
            dificultad: [null, Validators.required],
            formato_entrada: ['', Validators.required],
            formato_salida: ['', Validators.required],
            ejemplo_entrada: ['', Validators.required],
            ejemplo_salida: ['', Validators.required],
        });
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['visible'] && this.visible) {
            this.resetState();
        }
    }

    get modalTitle(): string {
        return this.mode === 'create' ? 'Nuevo Problema' : `Editar: ${this.data?.titulo}`;
    }

    resetState(): void {
        this.saving = false;
        if (this.mode === 'create') {
            this.form.reset({
                titulo: '',
                descripcion: '',
                dificultad: null,
                formato_entrada: '',
                formato_salida: '',
                ejemplo_entrada: '',
                ejemplo_salida: '',
            });
        } else if (this.data) {
            this.form.patchValue({
                titulo: this.data.titulo,
                descripcion: this.data.descripcion,
                dificultad: this.data.dificultad,
                formato_entrada: this.data.formato_entrada,
                formato_salida: this.data.formato_salida,
                ejemplo_entrada: this.data.ejemplo_entrada,
                ejemplo_salida: this.data.ejemplo_salida,
            });
        }
    }

    isInvalid(fieldName: string): boolean {
        const control = this.form.get(fieldName);
        return !!(control && control.invalid && (control.dirty || control.touched));
    }

    save(): void {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }

        this.saving = true;

        const payload: CreateProblemaDto | UpdateProblemaDto = this.form.value;

        const obs = this.mode === 'create'
            ? this.problemasService.create(this.competenciaId!, payload as CreateProblemaDto)
            : this.problemasService.update(this.data!.id, payload as UpdateProblemaDto);

        obs.subscribe({
            next: (res) => {
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
}