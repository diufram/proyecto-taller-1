import {
    ChangeDetectionStrategy,
    Component,
    OnInit,
    inject,
    signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
    FormBuilder,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { SelectModule } from 'primeng/select';
import { TagModule } from 'primeng/tag';
import { TextareaModule } from 'primeng/textarea';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { SkeletonModule } from 'primeng/skeleton';
import { DividerModule } from 'primeng/divider';

import { ToastService } from '@/core/services/toast.service';
import { ProblemasService } from '@/features/problemas/services/problemas.service';
import { Problema } from '@/features/problemas/models/problema.model';
import { SolucionesService } from '@/features/soluciones/services/soluciones.service';
import {
    CreateSolucionDto,
    ESTADO_SOLUCION_LABELS,
    ESTADO_SOLUCION_SEVERITY,
    LENGUAJES,
    Lenguaje,
    Solucion,
    EstadoSolucion,
} from '@/features/soluciones/models/solucion.model';

interface LenguajeOption {
    label: string;
    value: Lenguaje;
}

@Component({
    selector: 'app-resolver-problema-page',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        ButtonModule,
        CardModule,
        SelectModule,
        TagModule,
        TextareaModule,
        ToastModule,
        ToolbarModule,
        SkeletonModule,
        DividerModule,
    ],
    templateUrl: './resolver-problema-page.component.html',
    styleUrl: './resolver-problema-page.component.scss',
})
export class ResolverProblemaPageComponent implements OnInit {
    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private fb = inject(FormBuilder);
    private problemasService = inject(ProblemasService);
    private solucionesService = inject(SolucionesService);
    private toast = inject(ToastService);

    competenciaId!: number;
    problemaId!: number;

    problema = signal<Problema | null>(null);
    miSolucion = signal<Solucion | null>(null);
    loadingProblema = signal(false);
    loadingSolucion = signal(false);
    submitting = signal(false);

    readonly lenguajes: LenguajeOption[] = LENGUAJES.map((l) => ({
        label: l,
        value: l,
    }));

    form!: FormGroup;

    ngOnInit(): void {
        this.competenciaId = Number(this.route.snapshot.paramMap.get('id'));
        this.problemaId = Number(
            this.route.snapshot.paramMap.get('problemaId'),
        );

        this.form = this.fb.group({
            lenguaje_programacion: [null, Validators.required],
            respuesta: ['', [Validators.required, Validators.minLength(1)]],
        });

        if (this.problemaId) {
            this.loadProblema();
            this.loadMiSolucion();
        }
    }

    loadProblema(): void {
        this.loadingProblema.set(true);
        this.problemasService.getById(this.problemaId).subscribe({
            next: (res) => {
                this.problema.set(res.problema);
                this.loadingProblema.set(false);
            },
            error: () => {
                this.toast.error('No se pudo cargar el problema');
                this.loadingProblema.set(false);
            },
        });
    }

    loadMiSolucion(): void {
        this.loadingSolucion.set(true);
        this.solucionesService
            .misSoluciones({ page: 1, limit: 100 })
            .subscribe({
                next: (res) => {
                    const encontrada = res.items.find(
                        (s) => s.problema_id === this.problemaId,
                    );
                    this.miSolucion.set(encontrada ?? null);
                    this.loadingSolucion.set(false);
                },
                error: () => {
                    this.miSolucion.set(null);
                    this.loadingSolucion.set(false);
                },
            });
    }

    enviar(): void {
        if (this.form.invalid || this.submitting() || this.miSolucion()) {
            this.form.markAllAsTouched();
            return;
        }

        this.submitting.set(true);
        const dto: CreateSolucionDto = {
            problema_id: this.problemaId,
            respuesta: this.form.value.respuesta.trim(),
            lenguaje_programacion: this.form.value.lenguaje_programacion,
        };

        this.solucionesService.create(dto).subscribe({
            next: (res) => {
                this.toast.success(res.message);
                this.miSolucion.set(res.solucion);
                this.submitting.set(false);
            },
            error: (err) => {
                this.toast.error(err);
                this.submitting.set(false);
            },
        });
    }

    volver(): void {
        this.router.navigate([
            '/user/competencias',
            this.competenciaId,
            'problemas',
        ]);
    }

    getDificultadSeverity(
        dificultad: Problema['dificultad'],
    ): 'success' | 'warn' | 'danger' {
        switch (dificultad) {
            case 'Facil':
                return 'success';
            case 'Medio':
                return 'warn';
            case 'Dificil':
                return 'danger';
        }
    }

    getDificultadLabel(dificultad: Problema['dificultad']): string {
        switch (dificultad) {
            case 'Facil':
                return 'Fácil';
            case 'Medio':
                return 'Medio';
            case 'Dificil':
                return 'Difícil';
        }
    }

    estadoLabel(estado: EstadoSolucion): string {
        return ESTADO_SOLUCION_LABELS[estado];
    }

    estadoSeverity(estado: EstadoSolucion): 'info' | 'success' | 'danger' | 'warn' {
        return ESTADO_SOLUCION_SEVERITY[estado];
    }

    yaEnvio(): boolean {
        return this.miSolucion() !== null;
    }
}
