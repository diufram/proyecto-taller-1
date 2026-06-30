import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { MessageService } from 'primeng/api';

import { ApiService } from '@/core/services/http/api.service';
import { MockApiService } from '@testing/mock-api.service';
import { MockRouter } from '@testing/mock-router';
import { AdminSolucion, EstadoSolucion } from '../../../models/solucion.model';
import { CalificarSolucionPageComponent } from './calificar-solucion-page.component';

describe('CalificarSolucionPageComponent', () => {
    let component: CalificarSolucionPageComponent;
    let fixture: ComponentFixture<CalificarSolucionPageComponent>;
    let api: MockApiService;
    let router: MockRouter;

    const solucionMock = (estado: EstadoSolucion = 'Pendiente'): AdminSolucion => ({
        id: 1,
        respuesta: 'print(1)',
        lenguaje_programacion: 'Python',
        estado,
        resultado_validacion: false,
        puntaje_total: 0,
        problema_id: 3,
        problema_titulo: 'Suma',
        problema_dificultad: 'Facil',
        problema_formato_entrada: 'a b',
        problema_formato_salida: 'a + b',
        competencia_id: 2,
        competencia_nombre: 'Olimpiada',
        usuario_id: 10,
        usuario_email: 'juan@example.com',
        usuario_nombre: 'Juan',
        usuario_apellido: 'Perez',
        created_at: '2026-01-01T00:00:00Z',
        updated_at: '2026-01-01T00:00:00Z',
    });

    beforeEach(async () => {
        router = new MockRouter();
        api = new MockApiService();
        api.when('GET', 'soluciones/1', { solucion: solucionMock() });

        await TestBed.configureTestingModule({
            imports: [CalificarSolucionPageComponent],
            providers: [
                { provide: ApiService, useValue: api },
                { provide: Router, useValue: router },
                MessageService,
                {
                    provide: ActivatedRoute,
                    useValue: {
                        snapshot: {
                            paramMap: convertToParamMap({
                                competenciaId: '2',
                                problemaId: '3',
                                solucionId: '1',
                            }),
                        },
                        parent: null,
                    },
                },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(CalificarSolucionPageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create and load solution', () => {
        expect(component).toBeTruthy();
        expect(component.solucion()?.id).toBe(1);

        const req = api.requests.find((r) => r.method === 'GET');
        expect(req?.url).toBe('GET soluciones/1');
    });

    it('should PATCH /soluciones/:id/estado on calificar', () => {
        api.when('PATCH', 'soluciones/1/estado', {
            solucion: solucionMock('Revisado'),
            delta_puntos: 10,
            message: 'ok',
        });

        component.calificar('Revisado');

        const patch = api.requests.find(
            (r) => r.method === 'PATCH' && r.url === 'PATCH soluciones/1/estado',
        );
        expect(patch).toBeDefined();
        expect(patch?.body).toEqual(
            expect.objectContaining({
                estado: 'Revisado',
                resultado_validacion: true,
                puntaje_total: 0,
            }),
        );
        expect(component.solucion()?.estado).toBe('Revisado');
    });

    it('should send evaluation criteria when saving after AI suggestion', () => {
        const criterios = [
            {
                criterio: 'Correctitud',
                peso: 40,
                tipo: 'Obligatorio' as const,
                puntaje: 38,
                comentario: 'Resuelve los casos principales.',
            },
        ];
        component.sugerencia.set({
            estado: 'Revisado',
            confianza: 0.9,
            puntaje_total: 38,
            justificacion: 'Buena solución.',
            criterios,
        });
        component.criteriosDraft.set(criterios);
        api.when('PATCH', 'soluciones/1/estado', {
            solucion: { ...solucionMock('Revisado'), puntaje_total: 38, criterios_evaluacion: criterios },
            delta_puntos: 10,
            message: 'ok',
        });

        component.calificar('Revisado');

        const patch = api.requests.find(
            (r) => r.method === 'PATCH' && r.url === 'PATCH soluciones/1/estado',
        );
        expect(patch?.body).toEqual({
            estado: 'Revisado',
            resultado_validacion: true,
            puntaje_total: 38,
            confianza_ia: 0.9,
            justificacion_ia: 'Buena solución.',
            criterios_evaluacion: criterios,
        });
    });

    it('should return to problem solutions list', () => {
        component.volver();

        expect(router.navigations.at(-1)?.commands).toEqual([
            '/admin/competencias/problemas',
            2,
            'problema',
            3,
            'soluciones',
        ]);
    });
});
