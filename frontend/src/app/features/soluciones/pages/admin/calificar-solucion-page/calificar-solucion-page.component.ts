import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { ButtonModule } from 'primeng/button';
import { ProgressBarModule } from 'primeng/progressbar';
import { SkeletonModule } from 'primeng/skeleton';
import { TagModule } from 'primeng/tag';
import { InputNumberModule } from 'primeng/inputnumber';
import { TextareaModule } from 'primeng/textarea';
import { ToastModule } from 'primeng/toast';

import {
    AdminSolucion,
    CalificarSolucionDto,
    CriterioEvaluacionSolucion,
    ESTADO_SOLUCION_LABELS,
    ESTADO_SOLUCION_SEVERITY,
    EstadoSolucion,
    RUBRICA_SOLUCION,
    SugerenciaIA,
} from '../../../models/solucion.model';
import { SolucionesAiService } from '../../../services/soluciones-ai.service';
import { CalificarResponse, SolucionesService } from '../../../services/soluciones.service';
import { ToastService } from '@/core/services/toast.service';

@Component({
    selector: 'app-calificar-solucion-page',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        CommonModule,
        FormsModule,
        ButtonModule,
        ProgressBarModule,
        SkeletonModule,
        TagModule,
        InputNumberModule,
        TextareaModule,
        ToastModule,
    ],
    templateUrl: './calificar-solucion-page.component.html',
    styleUrl: './calificar-solucion-page.component.scss',
})
export class CalificarSolucionPageComponent implements OnInit {
    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private solucionesService = inject(SolucionesService);
    private aiService = inject(SolucionesAiService);
    private toast = inject(ToastService);

    solucion = signal<AdminSolucion | null>(null);
    loading = signal(false);
    submitting = signal(false);
    sugiriendo = signal(false);
    sugerencia = signal<SugerenciaIA | null>(null);
    criteriosDraft = signal<CriterioEvaluacionSolucion[]>(this.emptyCriterios());
    selectedEstado = signal<EstadoSolucion | null>(null);

    competenciaId: number | null = null;
    problemaId: number | null = null;
    solucionId!: number;

    ngOnInit(): void {
        this.competenciaId = this.readParam('competenciaId');
        this.problemaId = this.readParam('problemaId');
        const sid = this.readParam('solucionId');

        if (!sid) {
            this.toast.error('Solución no encontrada');
            this.volver();
            return;
        }

        this.solucionId = sid;
        this.load();
    }

    load(): void {
        this.loading.set(true);
        this.solucionesService.getById(this.solucionId).subscribe({
            next: (res) => {
                this.solucion.set(res.solucion as AdminSolucion);
                this.criteriosDraft.set(
                    res.solucion.criterios_evaluacion?.length
                        ? res.solucion.criterios_evaluacion
                        : this.emptyCriterios(),
                );
                this.loading.set(false);
            },
            error: (err) => {
                this.loading.set(false);
                this.toast.error(err ?? 'No se pudo cargar la solución');
                this.volver();
            },
        });
    }

    volver(): void {
        if (this.competenciaId && this.problemaId) {
            this.router.navigate([
                '/admin/competencias/problemas',
                this.competenciaId,
                'problema',
                this.problemaId,
                'soluciones',
            ]);
            return;
        }

        if (this.competenciaId) {
            this.router.navigate([
                '/admin/competencias/problemas',
                this.competenciaId,
                'soluciones',
            ]);
            return;
        }

        this.router.navigate(['/admin/competencias']);
    }

    calificar(estado: EstadoSolucion): void {
        const solucion = this.solucion();
        if (!solucion || this.submitting()) return;

        this.selectedEstado.set(estado);
        const sug = this.sugerencia();
        const dto: CalificarSolucionDto = {
            estado,
            resultado_validacion: estado === 'Revisado',
            puntaje_total: this.puntajeVisible(),
            criterios_evaluacion: this.criteriosDraft(),
        };
        if (sug) {
            dto.confianza_ia = sug.confianza;
            dto.justificacion_ia = sug.justificacion;
        }

        this.submitting.set(true);
        this.solucionesService.calificar(solucion.id, dto).subscribe({
            next: (res: CalificarResponse) => {
                this.submitting.set(false);
                this.selectedEstado.set(null);
                this.sugerencia.set(null);
                this.solucion.set(res.solucion);
                this.criteriosDraft.set(
                    res.solucion.criterios_evaluacion?.length
                        ? res.solucion.criterios_evaluacion
                        : this.emptyCriterios(),
                );

                const deltaTxt = res.delta_puntos > 0 ? `+${res.delta_puntos}` : `${res.delta_puntos}`;
                this.toast.success(`${res.message} (${deltaTxt} puntos)`);
            },
            error: (err) => {
                this.submitting.set(false);
                this.selectedEstado.set(null);
                this.toast.error(err);
            },
        });
    }

    sugerir(): void {
        const solucion = this.solucion();
        if (!solucion || this.sugiriendo()) return;

        this.sugiriendo.set(true);
        this.aiService.sugerir(solucion.id).subscribe({
            next: (res) => {
                this.sugerencia.set(res.sugerencia);
                this.criteriosDraft.set(res.sugerencia.criterios);
                this.sugiriendo.set(false);
            },
            error: (err) => {
                this.sugiriendo.set(false);
                this.toast.error(err ?? 'No se pudo generar la sugerencia');
            },
        });
    }

    criteriosVisibles(): CriterioEvaluacionSolucion[] {
        return this.criteriosDraft();
    }

    puntajeVisible(): number {
        return this.criteriosDraft().reduce((sum, c) => sum + (Number(c.puntaje) || 0), 0);
    }

    updatePuntaje(index: number, value: number | null): void {
        this.criteriosDraft.update((criterios) =>
            criterios.map((c, i) =>
                i === index
                    ? { ...c, puntaje: Math.max(0, Math.min(c.peso, Number(value) || 0)) }
                    : c,
            ),
        );
    }

    updateComentario(index: number, value: string): void {
        this.criteriosDraft.update((criterios) =>
            criterios.map((c, i) => (i === index ? { ...c, comentario: value } : c)),
        );
    }

    descartarSugerencia(): void {
        this.sugerencia.set(null);
    }

    async copiarRespuesta(): Promise<void> {
        const respuesta = this.solucion()?.respuesta;
        if (!respuesta) return;
        try {
            await navigator.clipboard.writeText(respuesta);
            this.toast.success('Respuesta copiada');
        } catch {
            this.toast.error('No se pudo copiar la respuesta');
        }
    }

    displayName(s: AdminSolucion): string {
        const nombre = s.usuario_nombre?.trim();
        const apellido = s.usuario_apellido?.trim();
        if (nombre || apellido) {
            return `${nombre ?? ''} ${apellido ?? ''}`.trim();
        }
        return s.usuario_email;
    }

    estadoLabel(estado: EstadoSolucion): string {
        return ESTADO_SOLUCION_LABELS[estado];
    }

    estadoSeverity(estado: EstadoSolucion): 'info' | 'success' | 'danger' | 'warn' {
        return ESTADO_SOLUCION_SEVERITY[estado];
    }

    confianzaPorcentaje(sug: SugerenciaIA): number {
        return Math.round(sug.confianza * 100);
    }

    formatConfianza(sug: SugerenciaIA): string {
        return `${this.confianzaPorcentaje(sug)}%`;
    }

    private readParam(name: string): number | null {
        let current: ActivatedRoute | null = this.route;
        while (current) {
            const value = current.snapshot.paramMap.get(name);
            if (value) return Number(value);
            current = current.parent;
        }
        return null;
    }

    private emptyCriterios(): CriterioEvaluacionSolucion[] {
        return RUBRICA_SOLUCION.map((c) => ({ ...c, puntaje: 0, comentario: '' }));
    }
}
