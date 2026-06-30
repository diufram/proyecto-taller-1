import { TestBed } from '@angular/core/testing';
import { ApiService } from '@/core/services/http/api.service';
import { MockApiService } from '@testing/mock-api.service';
import { SolucionesService } from './soluciones.service';

describe('SolucionesService', () => {
    let service: SolucionesService;
    let api: MockApiService;

    beforeEach(() => {
        api = new MockApiService();
        TestBed.configureTestingModule({
            providers: [
                SolucionesService,
                { provide: ApiService, useValue: api },
            ],
        });
        service = TestBed.inject(SolucionesService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    describe('create', () => {
        it('should POST to /soluciones with the dto', (done) => {
            const dto = {
                problema_id: 1,
                respuesta: 'print(1)',
                lenguaje_programacion: 'Python' as const,
            };
            const mockResponse = {
                solucion: {
                    id: 1,
                    respuesta: 'print(1)',
                    lenguaje_programacion: 'Python' as const,
                    estado: 'Pendiente' as const,
                    resultado_validacion: false,
                    puntaje_total: 0,
                    problema_id: 1,
                    problema_titulo: 'Suma',
                    problema_dificultad: 'Facil',
                    competencia_id: 1,
                    created_at: '2026-01-01T00:00:00Z',
                    updated_at: '2026-01-01T00:00:00Z',
                },
                message: 'Solucion enviada correctamente.',
            };

            api.when('POST', 'soluciones', mockResponse);

            service.create(dto).subscribe((res) => {
                expect(res).toEqual(mockResponse);
                expect(api.requests[0].url).toBe('POST soluciones');
                expect(api.requests[0].body).toEqual(dto);
                done();
            });
        });
    });

    describe('misSoluciones', () => {
        it('should GET /soluciones/me with params', (done) => {
            const mockResponse = {
                items: [],
                meta: { total: 0, page: 1, limit: 10, total_pages: 0 },
            };
            api.when('GET', 'soluciones/me', mockResponse);

            service.misSoluciones({ page: 1, limit: 10 }).subscribe((res) => {
                expect(res).toEqual(mockResponse);
                expect(api.requests[0].url).toBe('GET soluciones/me');
                expect(api.requests[0].params).toEqual({ page: 1, limit: 10 });
                done();
            });
        });
    });

    describe('getById', () => {
        it('should GET /soluciones/:id', (done) => {
            const mockResponse = {
                solucion: {
                    id: 5,
                    respuesta: 'x = 1',
                    lenguaje_programacion: 'Python' as const,
                    estado: 'Revisado' as const,
                    resultado_validacion: true,
                    puntaje_total: 100,
                    problema_id: 2,
                    problema_titulo: 'P',
                    problema_dificultad: 'Facil',
                    competencia_id: 1,
                    created_at: '2026-01-01T00:00:00Z',
                    updated_at: '2026-01-01T00:00:00Z',
                },
            };
            api.when('GET', 'soluciones/5', mockResponse);

            service.getById(5).subscribe((res) => {
                expect(res).toEqual(mockResponse);
                expect(api.requests[0].url).toBe('GET soluciones/5');
                done();
            });
        });
    });

    describe('getAllAdmin', () => {
        it('should GET /soluciones with filters', (done) => {
            const mockResponse = {
                items: [
                    {
                        id: 1,
                        respuesta: 'print(1)',
                        lenguaje_programacion: 'Python' as const,
                        estado: 'Pendiente' as const,
                        resultado_validacion: false,
                        puntaje_total: 0,
                        problema_id: 1,
                        problema_titulo: 'Suma',
                        problema_dificultad: 'Facil',
                        competencia_id: 1,
                        usuario_id: 10,
                        usuario_email: 'juan@example.com',
                        usuario_nombre: 'Juan',
                        usuario_apellido: 'Perez',
                        created_at: '2026-01-01T00:00:00Z',
                        updated_at: '2026-01-01T00:00:00Z',
                    },
                ],
                meta: { total: 1, page: 1, limit: 10, total_pages: 1 },
            };
            api.when('GET', 'soluciones', mockResponse);

            service
                .getAllAdmin({
                    page: 1,
                    limit: 10,
                    estado: 'Pendiente',
                    search: 'juan',
                })
                .subscribe((res) => {
                    expect(res).toEqual(mockResponse);
                    expect(api.requests[0].url).toBe('GET soluciones');
                    expect(api.requests[0].params).toEqual({
                        page: 1,
                        limit: 10,
                        estado: 'Pendiente',
                        search: 'juan',
                    });
                    done();
                });
        });

        it('should GET /soluciones without params', (done) => {
            api.when('GET', 'soluciones', {
                items: [],
                meta: { total: 0, page: 1, limit: 10, total_pages: 0 },
            });

            service.getAllAdmin().subscribe(() => {
                expect(api.requests[0].url).toBe('GET soluciones');
                expect(api.requests[0].params).toBeUndefined();
                done();
            });
        });
    });

    describe('calificar', () => {
        it('should PATCH /soluciones/:id/estado', (done) => {
            const dto = { estado: 'Revisado' as const };
            const mockResponse = {
                solucion: {
                    id: 1,
                    respuesta: 'print(1)',
                    lenguaje_programacion: 'Python' as const,
                    estado: 'Revisado' as const,
                    resultado_validacion: true,
                    puntaje_total: 100,
                    problema_id: 1,
                    problema_titulo: 'Suma',
                    problema_dificultad: 'Facil',
                    competencia_id: 1,
                    usuario_id: 10,
                    usuario_email: 'juan@example.com',
                    created_at: '2026-01-01T00:00:00Z',
                    updated_at: '2026-01-01T00:00:00Z',
                },
                delta_puntos: 10,
                message: 'ok',
            };
            api.when('PATCH', 'soluciones/1/estado', mockResponse);

            service.calificar(1, dto).subscribe((res) => {
                expect(res).toEqual(mockResponse);
                expect(api.requests[0].url).toBe('PATCH soluciones/1/estado');
                expect(api.requests[0].body).toEqual(dto);
                done();
            });
        });
    });
});
