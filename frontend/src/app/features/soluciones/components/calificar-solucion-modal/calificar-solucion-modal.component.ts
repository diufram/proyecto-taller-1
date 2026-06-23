import {
    ChangeDetectionStrategy,
    Component,
    EventEmitter,
    Input,
    OnChanges,
    Output,
    SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';

import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { TagModule } from 'primeng/tag';

import {
    AdminSolucion,
    ESTADO_SOLUCION_LABELS,
    ESTADO_SOLUCION_SEVERITY,
    EstadoSolucion,
} from '../../models/solucion.model';

export interface CalificarEvent {
    estado: EstadoSolucion;
    resultado_validacion?: boolean;
}

@Component({
    selector: 'app-calificar-solucion-modal',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [CommonModule, ButtonModule, DialogModule, TagModule],
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
                </div>
            }

            <ng-template pTemplate="footer">
                <div class="flex flex-wrap justify-end gap-2 w-full">
                    <p-button
                        label="En revisión"
                        icon="pi pi-eye"
                        severity="warn"
                        [outlined]="true"
                        [loading]="submitting"
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
            }
        `,
    ],
})
export class CalificarSolucionModalComponent implements OnChanges {
    @Input() visible = false;
    @Input() solucion: AdminSolucion | null = null;
    @Input() submitting = false;
    @Output() visibleChange = new EventEmitter<boolean>();
    @Output() calificarEmit = new EventEmitter<CalificarEvent>();

    selectedEstado: EstadoSolucion | null = null;

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['visible'] && this.visible) {
            this.selectedEstado = null;
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

    estadoSeverity(estado: EstadoSolucion): 'info' | 'success' | 'danger' | 'warn' {
        return ESTADO_SOLUCION_SEVERITY[estado];
    }
}
