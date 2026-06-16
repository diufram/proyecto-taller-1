import {
    Component,
    EventEmitter,
    Input,
    Output,
    OnChanges,
    SimpleChanges,
    inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
    FormsModule,
    ReactiveFormsModule,
    FormBuilder,
    FormGroup,
    Validators,
} from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { SelectModule } from 'primeng/select';
import { DialogModule } from 'primeng/dialog';
import { MessageModule } from 'primeng/message';
import { FloatLabelModule } from 'primeng/floatlabel';
import { DividerModule } from 'primeng/divider';
import { TooltipModule } from 'primeng/tooltip';

import { ToastService } from '@/core/services/toast.service';
import { ProblemasService } from '../../services/problemas.service';
import {
    Problema,
    CreateProblemaDto,
    UpdateProblemaDto,
    DIFICULTADES,
    DIFICULTAD_LABELS,
    Dificultad,
} from '../../models/problema.model';

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
        DividerModule,
        TooltipModule,
    ],
    templateUrl: './problema-create-edit-modal.component.html',
    styleUrl: './problema-create-edit-modal.component.scss',
})
export class ProblemaCreateEditModalComponent implements OnChanges {
    private problemasService = inject(ProblemasService);
    private fb = inject(FormBuilder);
    private toast = inject(ToastService);

    @Input() visible = false;
    @Input() mode: ProblemaModalMode = 'create';
    @Input() competenciaId?: number;
    @Input() data?: Problema;
    @Output() visibleChange = new EventEmitter<boolean>();
    @Output() onSaved = new EventEmitter<void>();

    form: FormGroup;

    saving = false;
    dificultades = DIFICULTADES;
    dificultadLabels = DIFICULTAD_LABELS;

    readonly MAX_TITULO = 120;
    readonly MAX_DESCRIPCION = 2000;
    readonly MAX_FORMATO = 500;
    readonly MAX_EJEMPLO = 1000;

    constructor() {
        this.form = this.fb.group({
            titulo: [
                '',
                [Validators.required, Validators.maxLength(this.MAX_TITULO)],
            ],
            descripcion: [
                '',
                [
                    Validators.required,
                    Validators.maxLength(this.MAX_DESCRIPCION),
                ],
            ],
            dificultad: [null, Validators.required],
            formato_entrada: [
                '',
                [Validators.required, Validators.maxLength(this.MAX_FORMATO)],
            ],
            formato_salida: [
                '',
                [Validators.required, Validators.maxLength(this.MAX_FORMATO)],
            ],
            ejemplo_entrada: [
                '',
                [Validators.required, Validators.maxLength(this.MAX_EJEMPLO)],
            ],
            ejemplo_salida: [
                '',
                [Validators.required, Validators.maxLength(this.MAX_EJEMPLO)],
            ],
        });
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['visible'] && this.visible) {
            this.resetState();
        }
    }

    get modalTitle(): string {
        return this.mode === 'create'
            ? 'Nuevo Problema'
            : `Editar: ${this.data?.titulo ?? ''}`;
    }

    get isValid(): boolean {
        return this.form.valid;
    }

    charCount(field: string): number {
        const value = this.form.get(field)?.value;
        return typeof value === 'string' ? value.length : 0;
    }

    getDificultadLabel(dificultad: Dificultad): string {
        return DIFICULTAD_LABELS[dificultad];
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
        return !!(
            control &&
            control.invalid &&
            (control.dirty || control.touched)
        );
    }

    copyToClipboard(text: string | null | undefined): void {
        if (!text) return;
        navigator.clipboard
            .writeText(text)
            .then(() =>
                this.toast.success(
                    'Copiado',
                    'Texto copiado al portapapeles',
                ),
            )
            .catch(() => this.toast.error('No se pudo copiar'));
    }

    fillExampleEntrada(): void {
        this.form
            .get('ejemplo_entrada')
            ?.setValue('3 5\n2 7\n10 20');
    }

    fillExampleSalida(): void {
        const entrada = this.form.get('ejemplo_entrada')?.value ?? '';
        const lineas = entrada
            .split('\n')
            .map((l: string) => l.trim())
            .filter((l: string) => l.length > 0)
            .map((l: string) => {
                const nums = l.split(/\s+/).map(Number);
                if (nums.length === 2 && nums.every((n) => !isNaN(n))) {
                    return String(nums[0] + nums[1]);
                }
                return '';
            })
            .filter((s: string) => s.length > 0)
            .join('\n');
        this.form.get('ejemplo_salida')?.setValue(lineas);
    }

    save(): void {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }

        this.saving = true;

        const payload: CreateProblemaDto | UpdateProblemaDto = this.form.value;

        const obs =
            this.mode === 'create'
                ? this.problemasService.create(
                      this.competenciaId!,
                      payload as CreateProblemaDto,
                  )
                : this.problemasService.update(
                      this.data!.id,
                      payload as UpdateProblemaDto,
                  );

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
}
