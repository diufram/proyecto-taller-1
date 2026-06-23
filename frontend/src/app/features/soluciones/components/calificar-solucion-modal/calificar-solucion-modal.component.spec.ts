import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalificarSolucionModalComponent } from './calificar-solucion-modal.component';
import { AdminSolucion, EstadoSolucion } from '../../models/solucion.model';

describe('CalificarSolucionModalComponent', () => {
    let component: CalificarSolucionModalComponent;
    let fixture: ComponentFixture<CalificarSolucionModalComponent>;

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
        await TestBed.configureTestingModule({
            imports: [CalificarSolucionModalComponent],
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
});
