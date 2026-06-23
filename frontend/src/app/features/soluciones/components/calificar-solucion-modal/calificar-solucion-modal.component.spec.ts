import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalificarSolucionModalComponent } from './calificar-solucion-modal.component';
import { AdminSolucion, EstadoSolucion } from '../../models/solucion.model';
import { ApiService } from '@/core/services/http/api.service';
import { MockApiService } from '@testing/mock-api.service';

describe('CalificarSolucionModalComponent', () => {
    let component: CalificarSolucionModalComponent;
    let fixture: ComponentFixture<CalificarSolucionModalComponent>;
    let api: MockApiService;

    const solucionMock: AdminSolucion = {
        id: 1,
        respuesta: 'print(2+2)',
        lenguaje_programacion: 'Python',
        estado: 'Pendiente',
        resultado_validacion: false,
        problema_id: 10,
        problema_titulo: 'Suma',
        problema_dificultad: 'Facil',
        problema_descripcion: 'Sumar dos numeros',
        problema_formato_entrada: 'a b',
        problema_formato_salida: 'a+b',
        problema_ejemplo_entrada: '2 3',
        problema_ejemplo_salida: '5',
        competencia_id: 1,
        competencia_nombre: 'Olimpiada 2026',
        usuario_id: 7,
        usuario_nombre_usuario: 'juanp',
        usuario_nombre: 'Juan',
        usuario_apellido: 'Perez',
        created_at: '2026-01-15T10:30:00Z',
        updated_at: '2026-01-15T10:30:00Z',
    };

    beforeEach(async () => {
        api = new MockApiService();
        await TestBed.configureTestingModule({
            imports: [CalificarSolucionModalComponent],
            providers: [{ provide: ApiService, useValue: api }],
        }).compileComponents();

        fixture = TestBed.createComponent(CalificarSolucionModalComponent);
        component = fixture.componentInstance;
        component.solucion = solucionMock;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should display name when persona is present', () => {
        expect(component.displayName(solucionMock)).toBe('Juan Perez');
    });

    it('should fallback to username when persona is missing', () => {
        const sinPersona: AdminSolucion = {
            ...solucionMock,
            usuario_nombre: null,
            usuario_apellido: null,
        };
        expect(component.displayName(sinPersona)).toBe('@juanp');
    });

    it('should emit "En revisión" without confirm', () => {
        const emit = jest.fn();
        component.calificarEmit.subscribe(emit);

        component.calificar('En revisión');

        expect(emit).toHaveBeenCalledWith({
            estado: 'En revisión',
            resultado_validacion: undefined,
        });
    });

    it('should emit "Correcto" with resultado_validacion=true by default', () => {
        const emit = jest.fn();
        component.calificarEmit.subscribe(emit);

        component.calificar('Correcto');

        expect(emit).toHaveBeenCalledWith({
            estado: 'Correcto',
            resultado_validacion: undefined,
        });
        expect(component.selectedEstado).toBe<EstadoSolucion>('Correcto');
    });

    it('should emit "Incorrecto" with resultado_validacion=false when previous state was not Correcto', () => {
        jest.spyOn(window, 'confirm').mockReturnValue(true);
        const emit = jest.fn();
        component.calificarEmit.subscribe(emit);

        component.onIncorrecto();

        expect(emit).toHaveBeenCalledWith({
            estado: 'Incorrecto',
            resultado_validacion: false,
        });
    });

    it('should ask confirmation when downgrading Correcto → Incorrecto', () => {
        const confirm = jest.spyOn(window, 'confirm').mockReturnValue(false);
        const emit = jest.fn();
        component.calificarEmit.subscribe(emit);

        component.solucion = { ...solucionMock, estado: 'Correcto' };
        component.onIncorrecto();

        expect(confirm).toHaveBeenCalled();
        expect(emit).not.toHaveBeenCalled();
    });

    it('should not emit if user cancels confirm', () => {
        jest.spyOn(window, 'confirm').mockReturnValue(false);
        const emit = jest.fn();
        component.calificarEmit.subscribe(emit);

        component.solucion = { ...solucionMock, estado: 'Correcto' };
        component.onIncorrecto();

        expect(emit).not.toHaveBeenCalled();
    });

    it('should close and emit visibleChange=false', () => {
        const emit = jest.fn();
        component.visibleChange.subscribe(emit);

        component.close();

        expect(component.visible).toBe(false);
        expect(emit).toHaveBeenCalledWith(false);
    });

    it('should map estado to severity', () => {
        expect(component.estadoSeverity('Correcto')).toBe('success');
        expect(component.estadoSeverity('Incorrecto')).toBe('danger');
        expect(component.estadoSeverity('Pendiente')).toBe('info');
        expect(component.estadoSeverity('En revisión')).toBe('warn');
    });

    it('should reset selectedEstado when becoming visible', () => {
        component.selectedEstado = 'Correcto';
        component.visible = true;
        component.ngOnChanges({
            visible: {
                previousValue: false,
                currentValue: true,
                firstChange: false,
                isFirstChange: () => false,
            },
        });
        expect(component.selectedEstado).toBeNull();
    });

    it('should copy respuesta to clipboard', async () => {
        const writeText = jest.fn().mockResolvedValue(undefined);
        Object.defineProperty(navigator, 'clipboard', {
            value: { writeText },
            configurable: true,
        });

        await component.copiarRespuesta();
        expect(writeText).toHaveBeenCalledWith('print(2+2)');
    });

    describe('Sugerir con IA', () => {
        it('should POST to /soluciones/:id/sugerir-calificacion and set sugerencia', (done) => {
            api.when('POST', 'soluciones/1/sugerir-calificacion', {
                sugerencia: {
                    estado: 'Correcto',
                    confianza: 0.92,
                    justificacion: 'Resuelve el problema correctamente.',
                },
                message: 'ok',
            });

            component.sugerir();

            setTimeout(() => {
                const sug = component.sugerencia();
                expect(sug).toEqual({
                    estado: 'Correcto',
                    confianza: 0.92,
                    justificacion: 'Resuelve el problema correctamente.',
                });
                expect(component.sugiriendo()).toBe(false);
                expect(api.requests[0].url).toBe(
                    'POST soluciones/1/sugerir-calificacion',
                );
                done();
            }, 0);
        });

        it('should emit sugerirError on failure', (done) => {
            api.whenError(
                'POST',
                'soluciones/1/sugerir-calificacion',
                new Error('502'),
            );
            const emit = jest.fn();
            component.sugerirError.subscribe(emit);

            component.sugerir();

            setTimeout(() => {
                expect(emit).toHaveBeenCalled();
                expect(component.sugerencia()).toBeNull();
                expect(component.sugiriendo()).toBe(false);
                done();
            }, 0);
        });

        it('should not suggest if already sugiriendo', () => {
            component.sugiriendo.set(true);
            component.sugerir();
            expect(api.requests.find((r) => r.method === 'POST')).toBeUndefined();
        });

        it('should not suggest if no solucion', () => {
            component.solucion = null;
            component.sugerir();
            expect(api.requests.find((r) => r.method === 'POST')).toBeUndefined();
        });

        it('should aplicarSugerencia emit calificar for Correcto', () => {
            component.sugerencia.set({
                estado: 'Correcto',
                confianza: 0.9,
                justificacion: 'ok',
            });
            const emit = jest.fn();
            component.calificarEmit.subscribe(emit);

            component.aplicarSugerencia();

            expect(emit).toHaveBeenCalledWith({
                estado: 'Correcto',
                resultado_validacion: undefined,
            });
        });

        it('should aplicarSugerencia for En revisión without confirm', () => {
            component.sugerencia.set({
                estado: 'En revisión',
                confianza: 0.5,
                justificacion: 'duda',
            });
            const emit = jest.fn();
            component.calificarEmit.subscribe(emit);

            component.aplicarSugerencia();

            expect(emit).toHaveBeenCalledWith({
                estado: 'En revisión',
                resultado_validacion: undefined,
            });
        });

        it('should aplicarSugerencia for Incorrecto trigger confirm when previously Correcto', () => {
            jest.spyOn(window, 'confirm').mockReturnValue(true);
            component.solucion = { ...solucionMock, estado: 'Correcto' };
            component.sugerencia.set({
                estado: 'Incorrecto',
                confianza: 0.8,
                justificacion: 'mal',
            });
            const emit = jest.fn();
            component.calificarEmit.subscribe(emit);

            component.aplicarSugerencia();

            expect(emit).toHaveBeenCalledWith({
                estado: 'Incorrecto',
                resultado_validacion: false,
            });
        });

        it('should descartarSugerencia clear signal', () => {
            component.sugerencia.set({
                estado: 'Correcto',
                confianza: 0.5,
                justificacion: 'x',
            });
            component.descartarSugerencia();
            expect(component.sugerencia()).toBeNull();
        });

        it('should format confianza as percentage', () => {
            const sug = { estado: 'Correcto' as const, confianza: 0.85, justificacion: 'x' };
            expect(component.confianzaPorcentaje(sug)).toBe(85);
            expect(component.formatConfianza(sug)).toBe('85%');
        });

        it('should reset sugerencia when becoming visible', () => {
            component.sugerencia.set({
                estado: 'Correcto',
                confianza: 0.9,
                justificacion: 'x',
            });
            component.sugiriendo.set(true);
            component.visible = true;
            component.ngOnChanges({
                visible: {
                    previousValue: false,
                    currentValue: true,
                    firstChange: false,
                    isFirstChange: () => false,
                },
            });
            expect(component.sugerencia()).toBeNull();
            expect(component.sugiriendo()).toBe(false);
        });
    });
});
