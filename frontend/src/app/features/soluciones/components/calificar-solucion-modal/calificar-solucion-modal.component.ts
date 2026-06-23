import {
    ChangeDetectionStrategy,
    Component,
    EventEmitter,
    Input,
    OnChanges,
    Output,
    SimpleChanges,
    inject,
    signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';

import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { ProgressBarModule } from 'primeng/progressbar';
import { TagModule } from 'primeng/tag';

import {
    AdminSolucion,
    ESTADO_SOLUCION_LABELS,
    ESTADO_SOLUCION_SEVERITY,
    EstadoSolucion,
    SugerenciaIA,
} from '../../models/solucion.model';
import { SolucionesAiService } from '../../services/soluciones-ai.service';

export interface CalificarEvent {
    estado: EstadoSolucion;
    resultado_validacion?: boolean;
}

@Component({
    selector: 'app-calificar-solucion-modal',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        CommonModule,
        ButtonModule,
        DialogModule,
        ProgressBarModule,
        TagModule,
    ],
    template: `
        <p-dialog
            [(visible)]="visible"
            header="Calificar solución"
            [modal]="true"
            [style]="{ width: '50rem' }"
            [closable]="true"
            [closeOnEscape]="true"
            (onHide)="close()"
        >
            @if (solucion) {
                <div class="flex flex-col gap-4 p-2">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div class="info-block">
                            <span class="label">Estudiante</span>
                            <div class="info-value">
                                <span class="font-bold">
                                    {{ displayName(solucion) }}
                                </span>
                                <span class="text-color-secondary ml-1">
                                    &#64;{{ solucion.usuario_nombre_usuario }}
                                </span>
                            </div>
                        </div>

                        <div class="info-block">
                            <span class="label">Competencia</span>
                            <div class="info-value">
                                {{ solucion.competencia_nombre || '—' }}
                            </div>
                        </div>

                        <div class="info-block md:col-span-2">
                            <span class="label">Problema</span>
                            <div class="info-value">
                                {{ solucion.problema_titulo }}
                            </div>
                            @if (solucion.problema_descripcion) {
                                <p class="text-color-secondary text-sm mt-1 mb-0">
                                    {{ solucion.problema_descripcion }}
                                </p>
                            }
                        </div>

                        <div class="info-block">
                            <span class="label">Lenguaje</span>
                            <div>
                                <p-tag
                                    [value]="solucion.lenguaje_programacion"
                                    severity="info"
                                ></p-tag>
                            </div>
                        </div>

                        <div class="info-block">
                            <span class="label">Enviado</span>
                            <div class="info-value">
                                {{ solucion.created_at | date: 'dd/MM/yyyy HH:mm' }}
                            </div>
                        </div>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                        @if (solucion.problema_formato_entrada) {
                            <div class="info-block">
                                <span class="label">Formato de entrada</span>
                                <p class="info-value mb-0">
                                    {{ solucion.problema_formato_entrada }}
                                </p>
                            </div>
                        }
                        @if (solucion.problema_formato_salida) {
                            <div class="info-block">
                                <span class="label">Formato de salida</span>
                                <p class="info-value mb-0">
                                    {{ solucion.problema_formato_salida }}
                                </p>
                            </div>
                        }
                        @if (solucion.problema_ejemplo_entrada) {
                            <div class="info-block">
                                <span class="label">Ejemplo de entrada</span>
                                <pre class="code-block">{{ solucion.problema_ejemplo_entrada }}</pre>
                            </div>
                        }
                        @if (solucion.problema_ejemplo_salida) {
                            <div class="info-block">
                                <span class="label">Ejemplo de salida</span>
                                <pre class="code-block">{{ solucion.problema_ejemplo_salida }}</pre>
                            </div>
                        }
                    </div>

                    <div class="info-block">
                        <div class="flex items-center justify-between mb-2">
                            <span class="label mb-0">Respuesta del estudiante</span>
                            <p-button
                                icon="pi pi-copy"
                                label="Copiar"
                                severity="secondary"
                                [text]="true"
                                [size]="'small'"
                                (onClick)="copiarRespuesta()"
                            ></p-button>
                        </div>
                        <pre class="code-block respuesta">{{ solucion.respuesta }}</pre>
                    </div>

                    <div class="info-block current-status">
                        <span class="label">Estado actual</span>
                        <p-tag
                            [value]="estadoLabel(solucion.estado)"
                            [severity]="estadoSeverity(solucion.estado)"
                        ></p-tag>
                    </div>

                    @if (sugerencia(); as sug) {
                        <div class="sugerencia-panel" data-testid="sugerencia-panel">
                            <div class="sugerencia-header">
                                <i class="pi pi-sparkles"></i>
                                <span class="sugerencia-title">Sugerencia de la IA</span>
                            </div>
                            <div class="sugerencia-body">
                                <div class="sugerencia-row">
                                    <span class="label">Estado sugerido</span>
                                    <p-tag
                                        [value]="estadoLabel(sug.estado)"
                                        [severity]="estadoSeverity(sug.estado)"
                                    ></p-tag>
                                </div>
                                <div class="sugerencia-row">
                                    <span class="label">Confianza</span>
                                    <div class="confianza-wrap">
                                        <p-progressbar
                                            [value]="confianzaPorcentaje(sug)"
                                            [showValue]="false"
                                            styleClass="confianza-bar"
                                        ></p-progressbar>
                                        <span class="confianza-text">
                                            {{ formatConfianza(sug) }}
                                        </span>
                                    </div>
                                </div>
                                <div class="sugerencia-row">
                                    <span class="label">Justificación</span>
                                    <p class="sugerencia-justificacion mb-0">
                                        {{ sug.justificacion }}
                                    </p>
                                </div>
                            </div>
                            <div class="sugerencia-actions">
                                <p-button
                                    label="Descartar"
                                    icon="pi pi-times"
                                    severity="secondary"
                                    [text]="true"
                                    [size]="'small'"
                                    (onClick)="descartarSugerencia()"
                                ></p-button>
                                <p-button
                                    label="Aplicar sugerencia"
                                    icon="pi pi-check"
                                    severity="info"
                                    [outlined]="true"
                                    [size]="'small'"
                                    [loading]="submitting"
                                    [disabled]="submitting"
                                    (onClick)="aplicarSugerencia()"
                                ></p-button>
                            </div>
                        </div>
                    }
                </div>
            }

            <ng-template pTemplate="footer">
                <div class="flex flex-wrap justify-end gap-2 w-full">
                    <p-button
                        label="Sugerir con IA"
                        icon="pi pi-sparkles"
                        severity="info"
                        [outlined]="true"
                        [loading]="sugiriendo()"
                        [disabled]="sugiriendo() || submitting || !!sugerencia()"
                        (onClick)="sugerir()"
                    ></p-button>
                    <p-button
                        label="En revisión"
                        icon="pi pi-eye"
                        severity="warn"
                        [outlined]="true"
                        [loading]="submitting && selectedEstado === 'En revisión'"
                        [disabled]="submitting"
                        (onClick)="calificar('En revisión')"
                    ></p-button>
                    <p-button
                        label="Incorrecto"
                        icon="pi pi-times"
                        severity="danger"
                        [loading]="submitting && selectedEstado === 'Incorrecto'"
                        [disabled]="submitting"
                        (onClick)="onIncorrecto()"
                    ></p-button>
                    <p-button
                        label="Correcto"
                        icon="pi pi-check"
                        severity="success"
                        [loading]="submitting && selectedEstado === 'Correcto'"
                        [disabled]="submitting"
                        (onClick)="calificar('Correcto')"
                    ></p-button>
                </div>
            </ng-template>
        </p-dialog>
    `,
    styles: [
        `
            :host ::ng-deep {
                .label {
                    display: block;
                    font-size: 0.7rem;
                    text-transform: uppercase;
                    letter-spacing: 0.08em;
                    color: var(--text-color-secondary);
                    font-weight: 600;
                    margin-bottom: 0.35rem;
                }

                .info-block {
                    background: var(--surface-ground);
                    border-radius: 10px;
                    padding: 0.6rem 0.8rem;
                }

                .info-value {
                    color: var(--text-color);
                    font-size: 0.92rem;
                    line-height: 1.45;
                    white-space: pre-wrap;
                }

                .code-block {
                    margin: 0;
                    padding: 0.7rem 0.9rem;
                    background: var(--surface-100);
                    border: 1px solid var(--surface-border);
                    border-radius: 8px;
                    font-family: 'JetBrains Mono', 'Fira Code', Menlo, Consolas,
                        monospace;
                    font-size: 0.82rem;
                    color: var(--text-color);
                    white-space: pre-wrap;
                    word-break: break-word;
                    overflow-x: auto;
                    max-height: 280px;
                    overflow-y: auto;
                }

                .respuesta {
                    max-height: 320px;
                }

                .current-status {
                    display: flex;
                    align-items: center;
                    gap: 0.6rem;
                }

                .current-status .label {
                    margin-bottom: 0;
                }

                .sugerencia-panel {
                    background: var(--surface-50);
                    border: 1px solid var(--primary-color);
                    border-radius: 12px;
                    padding: 0.9rem 1rem;
                    display: flex;
                    flex-direction: column;
                    gap: 0.8rem;
                }

                .sugerencia-header {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    color: var(--primary-color);
                }

                .sugerencia-header i {
                    font-size: 1.05rem;
                }

                .sugerencia-title {
                    font-weight: 700;
                    font-size: 0.95rem;
                }

                .sugerencia-body {
                    display: flex;
                    flex-direction: column;
                    gap: 0.6rem;
                }

                .sugerencia-row {
                    display: flex;
                    flex-direction: column;
                    gap: 0.3rem;
                }

                .confianza-wrap {
                    display: flex;
                    align-items: center;
                    gap: 0.7rem;
                }

                .confianza-bar {
                    flex: 1;
                }

                .confianza-text {
                    font-weight: 600;
                    font-size: 0.88rem;
                    color: var(--text-color);
                    min-width: 3.5rem;
                    text-align: right;
                }

                .sugerencia-justificacion {
                    font-size: 0.88rem;
                    color: var(--text-color);
                    line-height: 1.45;
                    background: var(--surface-card);
                    border-radius: 8px;
                    padding: 0.6rem 0.8rem;
                }

                .sugerencia-actions {
                    display: flex;
                    justify-content: flex-end;
                    gap: 0.5rem;
                }
            }
        `,
    ],
})
export class CalificarSolucionModalComponent implements OnChanges {
    private aiService = inject(SolucionesAiService);

    @Input() visible = false;
    @Input() solucion: AdminSolucion | null = null;
    @Input() submitting = false;
    @Output() visibleChange = new EventEmitter<boolean>();
    @Output() calificarEmit = new EventEmitter<CalificarEvent>();
    @Output() sugerirError = new EventEmitter<unknown>();

    selectedEstado: EstadoSolucion | null = null;
    sugerencia = signal<SugerenciaIA | null>(null);
    sugiriendo = signal(false);

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['visible'] && this.visible) {
            this.selectedEstado = null;
            this.sugerencia.set(null);
            this.sugiriendo.set(false);
        }
    }

    close(): void {
        this.visible = false;
        this.visibleChange.emit(false);
    }

    calificar(estado: EstadoSolucion, resultado_validacion?: boolean): void {
        this.selectedEstado = estado;
        this.calificarEmit.emit({ estado, resultado_validacion });
    }

    onIncorrecto(): void {
        if (
            this.solucion?.estado === 'Correcto' &&
            !window.confirm(
                'Esta solución ya estaba como Correcta. Al marcarla como Incorrecta se restarán los puntos otorgados al estudiante. ¿Desea continuar?',
            )
        ) {
            return;
        }
        this.calificar('Incorrecto', false);
    }

    sugerir(): void {
        if (!this.solucion || this.sugiriendo()) return;
        this.sugiriendo.set(true);
        this.aiService.sugerir(this.solucion.id).subscribe({
            next: (res) => {
                this.sugerencia.set(res.sugerencia);
                this.sugiriendo.set(false);
            },
            error: (err) => {
                this.sugiriendo.set(false);
                this.sugerirError.emit(err);
            },
        });
    }

    aplicarSugerencia(): void {
        const sug = this.sugerencia();
        if (!sug) return;
        if (sug.estado === 'Incorrecto') {
            this.onIncorrecto();
        } else {
            this.calificar(sug.estado);
        }
    }

    descartarSugerencia(): void {
        this.sugerencia.set(null);
    }

    async copiarRespuesta(): Promise<void> {
        if (!this.solucion?.respuesta) return;
        try {
            await navigator.clipboard.writeText(this.solucion.respuesta);
        } catch {
            // fallback noop
        }
    }

    displayName(s: AdminSolucion): string {
        const nombre = s.usuario_nombre?.trim();
        const apellido = s.usuario_apellido?.trim();
        if (nombre || apellido) {
            return `${nombre ?? ''} ${apellido ?? ''}`.trim();
        }
        return `@${s.usuario_nombre_usuario}`;
    }

    estadoLabel(estado: EstadoSolucion): string {
        return ESTADO_SOLUCION_LABELS[estado];
    }

    estadoSeverity(
        estado: EstadoSolucion,
    ): 'info' | 'success' | 'danger' | 'warn' {
        return ESTADO_SOLUCION_SEVERITY[estado];
    }

    confianzaPorcentaje(sug: SugerenciaIA): number {
        return Math.round(sug.confianza * 100);
    }

    formatConfianza(sug: SugerenciaIA): string {
        return `${this.confianzaPorcentaje(sug)}%`;
    }
}
