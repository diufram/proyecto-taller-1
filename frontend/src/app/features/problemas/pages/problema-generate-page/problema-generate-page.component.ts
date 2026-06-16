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
import { finalize, forkJoin } from 'rxjs';

import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { InputNumberModule } from 'primeng/inputnumber';
import { SelectModule } from 'primeng/select';
import { TagModule } from 'primeng/tag';
import { CheckboxModule } from 'primeng/checkbox';
import { DividerModule } from 'primeng/divider';
import { TooltipModule } from 'primeng/tooltip';
import { ToastModule } from 'primeng/toast';
import { MessageModule } from 'primeng/message';
import { ToolbarModule } from 'primeng/toolbar';

import { ToastService } from '@/core/services/toast.service';
import { ProblemasService } from '../../services/problemas.service';
import { Dificultad, DIFICULTAD_LABELS } from '../../models/problema.model';
import {
    ProblemGeneratorService,
    GeneratedProblem,
    NivelCompetencia,
    TipoCompetencia,
} from '../../services/problem-generator.service';

@Component({
    selector: 'app-problema-generate-page',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        ButtonModule,
        InputTextModule,
        TextareaModule,
        InputNumberModule,
        SelectModule,
        TagModule,
        CheckboxModule,
        DividerModule,
        TooltipModule,
        ToastModule,
        MessageModule,
        ToolbarModule,
    ],
    templateUrl: './problema-generate-page.component.html',
    styleUrl: './problema-generate-page.component.scss',
})
export class ProblemaGeneratePageComponent implements OnInit {
    private fb = inject(FormBuilder);
    private generator = inject(ProblemGeneratorService);
    private problemasService = inject(ProblemasService);
    private toast = inject(ToastService);
    private route = inject(ActivatedRoute);
    private router = inject(Router);

    competenciaId!: number;
    competenciaNombre: string = '';
    competenciaDescripcion: string = '';
    nivelDificultad: NivelCompetencia = 'Intermedio';
    tipo: TipoCompetencia = 'Individual';

    step: 'form' = 'form';
    form: FormGroup;

    generating = false;
    saving = false;
    generated: GeneratedProblem[] = [];
    selectedIndexes = new Set<number>();

    readonly MIN_COUNT = 1;
    readonly MAX_COUNT = 5;

    readonly dificultadOptions: {
        label: string;
        value: Dificultad;
    }[] = [
        { label: DIFICULTAD_LABELS.Facil, value: 'Facil' },
        { label: DIFICULTAD_LABELS.Medio, value: 'Medio' },
        { label: DIFICULTAD_LABELS.Dificil, value: 'Dificil' },
    ];

    readonly placeholderExamples: string[] = [
        '3 problemas de sumas para principiantes',
        'Problemas de fibonacci y factorial',
        '1 problema difícil de palindromos',
        'Problemas de arrays y strings',
    ];

    constructor() {
        this.form = this.fb.group({
            prompt: ['', [Validators.required, Validators.minLength(5)]],
            cantidad: [
                2,
                [
                    Validators.required,
                    Validators.min(this.MIN_COUNT),
                    Validators.max(this.MAX_COUNT),
                ],
            ],
            dificultad: ['Facil'],
        });
    }

    ngOnInit(): void {
        this.competenciaId = Number(
            this.route.snapshot.paramMap.get('competenciaId'),
        );
        this.competenciaNombre =
            history.state?.competenciaNombre ??
            `Competencia #${this.competenciaId}`;
        this.competenciaDescripcion =
            history.state?.competenciaDescripcion ?? '';
        this.nivelDificultad =
            (history.state?.nivelDificultad as NivelCompetencia) ??
            'Intermedio';
        this.tipo = (history.state?.tipo as TipoCompetencia) ?? 'Individual';
    }

    get promptInvalid(): boolean {
        const c = this.form.get('prompt');
        return !!(c && c.invalid && (c.dirty || c.touched));
    }

    get canGenerate(): boolean {
        return this.form.valid && !this.generating;
    }

    get selectedCount(): number {
        return this.selectedIndexes.size;
    }

    get canSave(): boolean {
        return this.selectedCount > 0 && !this.saving;
    }

    get promptHint(): string {
        const keywords = [
            'suma',
            'factorial',
            'par',
            'fibonacci',
            'palindromo',
            'primo',
            'maximo',
            'minimo',
            'string',
            'array',
        ];
        return `Keywords reconocidas: ${keywords.join(', ')}`;
    }

    getDificultadLabel(dificultad: Dificultad): string {
        return DIFICULTAD_LABELS[dificultad];
    }

    getDificultadSeverity(dificultad: Dificultad): 'success' | 'warn' | 'danger' {
        switch (dificultad) {
            case 'Facil':
                return 'success';
            case 'Medio':
                return 'warn';
            case 'Dificil':
                return 'danger';
        }
    }

    isSelected(index: number): boolean {
        return this.selectedIndexes.has(index);
    }

    toggleSelection(index: number): void {
        if (this.selectedIndexes.has(index)) {
            this.selectedIndexes.delete(index);
        } else {
            this.selectedIndexes.add(index);
        }
    }

    selectAll(): void {
        this.selectedIndexes = new Set(
            this.generated.map((_, i) => i),
        );
    }

    deselectAll(): void {
        this.selectedIndexes.clear();
    }

    useExample(example: string): void {
        this.form.get('prompt')?.setValue(example);
    }

    onGenerate(): void {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }

        this.generating = true;
        this.generated = [];
        this.selectedIndexes.clear();

        const { prompt, cantidad, dificultad } = this.form.value;

        this.generator
            .generate({
                prompt,
                cantidad,
                dificultad,
                competenciaNombre: this.competenciaNombre,
                competenciaDescripcion: this.competenciaDescripcion,
                nivelDificultad: this.nivelDificultad,
                tipo: this.tipo,
            })
            .pipe(finalize(() => (this.generating = false)))
            .subscribe({
                next: (problems) => {
                    this.generated = problems;
                    this.selectedIndexes = new Set(problems.map((_, i) => i));
                },
                error: () => {
                    this.toast.error('No se pudieron generar los problemas');
                },
            });
    }

    saveSelected(): void {
        if (!this.competenciaId || this.selectedCount === 0) return;

        this.saving = true;

        const toSave = this.generated.filter((_, i) =>
            this.selectedIndexes.has(i),
        );

        forkJoin(
            toSave.map((p) =>
                this.problemasService.create(this.competenciaId!, {
                    titulo: p.titulo,
                    descripcion: p.descripcion,
                    dificultad: p.dificultad,
                    formato_entrada: p.formato_entrada,
                    formato_salida: p.formato_salida,
                    ejemplo_entrada: p.ejemplo_entrada,
                    ejemplo_salida: p.ejemplo_salida,
                }),
            ),
        ).subscribe({
            next: (results) => {
                this.saving = false;
                this.toast.success(
                    'Éxito',
                    `${results.length} problema(s) creado(s) correctamente.`,
                );
                this.goBack();
            },
            error: (err) => {
                this.saving = false;
                this.toast.error(
                    err?.message ??
                        'Ocurrió un error al guardar algunos problemas.',
                );
            },
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
}
