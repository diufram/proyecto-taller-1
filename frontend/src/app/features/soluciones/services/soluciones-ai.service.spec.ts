import { TestBed } from '@angular/core/testing';
import { ApiService } from '@/core/services/http/api.service';
import { MockApiService } from '@testing/mock-api.service';
import { SolucionesAiService } from './soluciones-ai.service';
import { SugerenciaIA } from '../models/solucion.model';

describe('SolucionesAiService', () => {
    let service: SolucionesAiService;
    let api: MockApiService;

    beforeEach(() => {
        api = new MockApiService();
        TestBed.configureTestingModule({
            providers: [
                SolucionesAiService,
                { provide: ApiService, useValue: api },
            ],
        });
        service = TestBed.inject(SolucionesAiService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    describe('sugerir', () => {
        it('should POST to /soluciones/:id/sugerir-calificacion', (done) => {
            const sugerencia: SugerenciaIA = {
                estado: 'Revisado',
                confianza: 0.9,
                puntaje_total: 90,
                justificacion: 'La respuesta resuelve el problema.',
                criterios: [],
            };
            const mockResponse = {
                sugerencia,
                message: 'Sugerencia generada.',
            };

            api.when(
                'POST',
                'soluciones/5/sugerir-calificacion',
                mockResponse,
            );

            service.sugerir(5, { instrucciones_extra: 'Validar con 2 enteros' }).subscribe((res) => {
                expect(res).toEqual(mockResponse);
                expect(api.requests[0].url).toBe(
                    'POST soluciones/5/sugerir-calificacion',
                );
                expect(api.requests[0].body).toEqual({
                    instrucciones_extra: 'Validar con 2 enteros',
                });
                done();
            });
        });

        it('should POST with empty body when no instructions', (done) => {
            const mockResponse = {
                sugerencia: {
                    estado: 'En revisión',
                    confianza: 0.6,
                    puntaje_total: 35,
                    justificacion: 'Falla en un caso borde.',
                    criterios: [],
                },
                message: 'ok',
            };
            api.when(
                'POST',
                'soluciones/1/sugerir-calificacion',
                mockResponse,
            );

            service.sugerir(1).subscribe(() => {
                expect(api.requests[0].body).toEqual({});
                done();
            });
        });
    });
});
