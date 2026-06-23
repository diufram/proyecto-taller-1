import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';

import { ResolverProblemaPageComponent } from './resolver-problema-page.component';
import { ApiService } from '@/core/services/http/api.service';
import { MockApiService } from '@testing/mock-api.service';
import { MockRouter } from '@testing/mock-router';

describe('ResolverProblemaPageComponent', () => {
    let component: ResolverProblemaPageComponent;
    let fixture: ComponentFixture<ResolverProblemaPageComponent>;
    let api: MockApiService;
    let router: MockRouter;

    const problemaMock = {
        problema: {
            id: 1,
            titulo: 'Suma simple',
            descripcion: 'Sumar dos numeros',
            dificultad: 'Facil' as const,
            formato_entrada: 'a b',
            formato_salida: 'a+b',
            ejemplo_entrada: '2 3',
            ejemplo_salida: '5',
            competencia_id: 10,
            total_soluciones: 0,
            soluciones_correctas: 0,
            created_at: '2026-01-01T00:00:00Z',
            updated_at: '2026-01-01T00:00:00Z',
        },
    };

    beforeEach(async () => {
        router = new MockRouter();
        api = new MockApiService();

        api.when('GET', 'problemas/1', problemaMock);
        api.when('GET', 'soluciones/me', {
            items: [],
            meta: { total: 0, page: 1, limit: 100, total_pages: 0 },
        });

        await TestBed.configureTestingModule({
            imports: [ReactiveFormsModule, ResolverProblemaPageComponent],
            providers: [
                { provide: ApiService, useValue: api },
                { provide: Router, useValue: router },
                MessageService,
                {
                    provide: ActivatedRoute,
                    useValue: {
                        snapshot: {
                            paramMap: convertToParamMap({
                                id: '10',
                                problemaId: '1',
                            }),
                        },
                    },
                },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(ResolverProblemaPageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should read ids from route params', () => {
        expect(component.competenciaId).toBe(10);
        expect(component.problemaId).toBe(1);
    });

    it('should load problema', () => {
        api.when('GET', 'problemas/1', problemaMock);
        component.loadProblema();
        expect(component.problema()?.id).toBe(1);
        expect(component.problema()?.titulo).toBe('Suma simple');
    });

    it('should detect when user already submitted', () => {
        const envioMock = {
            items: [
                {
                    id: 1,
                    respuesta: 'print(5)',
                    lenguaje_programacion: 'Python' as const,
                    estado: 'Pendiente' as const,
                    resultado_validacion: false,
                    problema_id: 1,
                    problema_titulo: 'Suma simple',
                    problema_dificultad: 'Facil',
                    competencia_id: 10,
                    created_at: '2026-01-01T00:00:00Z',
                    updated_at: '2026-01-01T00:00:00Z',
                },
            ],
            meta: { total: 1, page: 1, limit: 100, total_pages: 1 },
        };

        api.when('GET', 'soluciones/me', envioMock);
        component.loadMiSolucion();
        expect(component.yaEnvio()).toBe(true);
        expect(component.miSolucion()?.problema_id).toBe(1);
    });

    it('should not allow submit when form is invalid', () => {
        component.enviar();
        expect(api.requests.find((r) => r.method === 'POST')).toBeUndefined();
    });

    it('should send POST /soluciones on valid submit', () => {
        const postMock = {
            solucion: {
                id: 1,
                respuesta: 'print(5)',
                lenguaje_programacion: 'Python' as const,
                estado: 'Pendiente' as const,
                resultado_validacion: false,
                problema_id: 1,
                problema_titulo: 'Suma simple',
                problema_dificultad: 'Facil',
                competencia_id: 10,
                created_at: '2026-01-01T00:00:00Z',
                updated_at: '2026-01-01T00:00:00Z',
            },
            message: 'ok',
        };
        api.when('POST', 'soluciones', postMock);

        component.form.patchValue({
            lenguaje_programacion: 'Python',
            respuesta: 'print(5)',
        });

        component.enviar();

        const postCall = api.requests.find((r) => r.method === 'POST');
        expect(postCall).toBeDefined();
        expect(postCall?.url).toBe('POST soluciones');
        expect(postCall?.body).toEqual({
            problema_id: 1,
            respuesta: 'print(5)',
            lenguaje_programacion: 'Python',
        });
    });

    it('should not submit if user already has a solution', () => {
        const envioMock = {
            items: [
                {
                    id: 99,
                    respuesta: 'x',
                    lenguaje_programacion: 'Python' as const,
                    estado: 'Correcto' as const,
                    resultado_validacion: true,
                    problema_id: 1,
                    problema_titulo: 'Suma simple',
                    problema_dificultad: 'Facil',
                    competencia_id: 10,
                    created_at: '2026-01-01T00:00:00Z',
                    updated_at: '2026-01-01T00:00:00Z',
                },
            ],
            meta: { total: 1, page: 1, limit: 100, total_pages: 1 },
        };
        api.when('GET', 'soluciones/me', envioMock);
        component.loadMiSolucion();

        component.form.patchValue({
            lenguaje_programacion: 'Python',
            respuesta: 'otra',
        });
        component.enviar();

        expect(api.requests.find((r) => r.method === 'POST')).toBeUndefined();
    });

    it('should navigate back on volver()', () => {
        component.volver();
        expect(router.navigations.length).toBe(1);
        expect(router.navigations[0].commands).toEqual([
            '/user/competencias',
            10,
            'problemas',
        ]);
    });

    it('should map estado to severity', () => {
        expect(component.estadoSeverity('Correcto')).toBe('success');
        expect(component.estadoSeverity('Incorrecto')).toBe('danger');
        expect(component.estadoSeverity('Pendiente')).toBe('info');
        expect(component.estadoSeverity('En revisión')).toBe('warn');
    });

    it('should handle error loading miSolucion gracefully', () => {
        api.whenError('GET', 'soluciones/me', new Error('boom'));
        component.loadMiSolucion();
        expect(component.miSolucion()).toBeNull();
        expect(component.yaEnvio()).toBe(false);
    });
});
