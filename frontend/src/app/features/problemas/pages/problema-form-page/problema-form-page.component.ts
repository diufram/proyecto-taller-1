import {
    Component,
    OnInit,
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
import { ActivatedRoute, Router } from '@angular/router';
import { finalize } from 'rxjs';

import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { SelectModule } from 'primeng/select';
import { ToastModule } from 'primeng/toast';
import { MessageModule } from 'primeng/message';
import { FloatLabelModule } from 'primeng/floatlabel';
import { DividerModule } from 'primeng/divider';
import { TooltipModule } from 'primeng/tooltip';
import { SkeletonModule } from 'primeng/skeleton';
import { ToolbarModule } from 'primeng/toolbar';

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

export type ProblemaFormMode = 'create' | 'edit';

@Component({
    selector: 'app-problema-form-page',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        ButtonModule,
        InputTextModule,
        TextareaModule,
        SelectModule,
        ToastModule,
        MessageModule,
        FloatLabelModule,
        DividerModule,
        TooltipModule,
        SkeletonModule,
        ToolbarModule,
    ],
    templateUrl: './problema-form-page.component.html',
    styleUrl: './problema-form-page.component.scss',
})
export class ProblemaFormPageComponent implements OnInit {
    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private problemasService = inject(ProblemasService);
    private toast = inject(ToastService);
    private fb = inject(FormBuilder);

    mode: ProblemaFormMode = 'create';
    competenciaId!: number;
    competenciaNombre: string = '';
    problemaId?: number;
    existingProblema?: Problema;
    loadingData = false;

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

    ngOnInit(): void {
        this.competenciaId = Number(
            this.route.snapshot.paramMap.get('competenciaId'),
        );
        this.problemaId = this.route.snapshot.paramMap.get('problemaId')
            ? Number(this.route.snapshot.paramMap.get('problemaId'))
            : undefined;
        this.mode = this.problemaId ? 'edit' : 'create';

        this.competenciaNombre =
            history.state?.competenciaNombre ??
            `Competencia #${this.competenciaId}`;

        if (this.mode === 'edit' && this.problemaId) {
            this.loadProblema();
        } else {
            this.resetFormForCreate();
        }
    }

    get pageTitle(): string {
        return this.mode === 'create'
            ? 'Nuevo Problema'
            : `Editar Problema`;
    }

    get isValid(): boolean {
        return this.form.valid;
    }

    get saveLabel(): string {
        if (this.saving) {
            return this.mode === 'create' ? 'Creando...' : 'Guardando...';
        }
        return this.mode === 'create' ? 'Crear problema' : 'Guardar cambios';
    }

    get saveIcon(): string {
        return this.mode === 'create' ? 'pi pi-plus' : 'pi pi-save';
    }

    charCount(field: string): number {
        const value = this.form.get(field)?.value;
        return typeof value === 'string' ? value.length : 0;
    }

    isInvalid(fieldName: string): boolean {
        const control = this.form.get(fieldName);
        return !!(
            control &&
            control.invalid &&
            (control.dirty || control.touched)
        );
    }

    getDificultadLabel(dificultad: Dificultad): string {
        return DIFICULTAD_LABELS[dificultad];
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
                      this.competenciaId,
                      payload as CreateProblemaDto,
                  )
                : this.problemasService.update(
                      this.problemaId!,
                      payload as UpdateProblemaDto,
                  );

        obs.pipe(finalize(() => (this.saving = false))).subscribe({
            next: () => {
                this.toast.success(
                    'Éxito',
                    this.mode === 'create'
                        ? 'Problema creado correctamente'
                        : 'Problema actualizado correctamente',
                );
                this.goBack();
            },
            error: () => {},
        });
    }

    cancel(): void {
        this.goBack();
    }

    goBack(): void {
        this.router.navigate(
            ['/admin/competencias/problemas', this.competenciaId],
            {
                state: {
                    competenciaNombre: this.competenciaNombre,
                },
            },
        );
    }

    private loadProblema(): void {
        this.loadingData = true;
        this.problemasService.getById(this.problemaId!).subscribe({
            next: (res) => {
                this.existingProblema = res.problema;
                this.form.patchValue({
                    titulo: res.problema.titulo,
                    descripcion: res.problema.descripcion,
                    dificultad: res.problema.dificultad,
                    formato_entrada: res.problema.formato_entrada,
                    formato_salida: res.problema.formato_salida,
                    ejemplo_entrada: res.problema.ejemplo_entrada,
                    ejemplo_salida: res.problema.ejemplo_salida,
                });
                this.loadingData = false;
            },
            error: () => {
                this.toast.error('No se pudo cargar el problema');
                this.loadingData = false;
                this.goBack();
            },
        });
    }

    private resetFormForCreate(): void {
        this.form.reset({
            titulo: '',
            descripcion: '',
            dificultad: null,
            formato_entrada: '',
            formato_salida: '',
            ejemplo_entrada: '',
            ejemplo_salida: '',
        });
    }
}
