import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import {
    HttpTestingController,
    provideHttpClientTesting,
} from '@angular/common/http/testing';
import { ProblemGeneratorService } from './problem-generator.service';

describe('ProblemGeneratorService', () => {
    let service: ProblemGeneratorService;
    let httpMock: HttpTestingController;

    const baseOpts = {
        competenciaNombre: 'Compex Test',
        competenciaDescripcion: 'Competencia de prueba',
        nivelDificultad: 'Intermedio' as const,
        tipo: 'Individual' as const,
    };

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [provideHttpClient(), provideHttpClientTesting()],
        });
        service = TestBed.inject(ProblemGeneratorService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('hace POST al backend para generar problemas con IA', () => {
        service
            .generate({
                ...baseOpts,
                prompt: 'Genera 2 problemas de suma',
                cantidad: 2,
                dificultad: 'Facil',
            })
            .subscribe((result) => {
                expect(result).toEqual([
                    {
                        titulo: 'Suma simple',
                        descripcion: 'Sumar dos enteros.',
                        dificultad: 'Facil',
                        formato_entrada: 'Dos enteros separados por espacio.',
                        formato_salida: 'La suma de ambos enteros.',
                        ejemplo_entrada: '1 2',
                        ejemplo_salida: '3',
                        sourceKeyword: 'ia',
                    },
                ]);
            });

        const req = httpMock.expectOne((r) =>
            r.url.endsWith('/problemas/generar-ia'),
        );
        expect(req.request.method).toBe('POST');
        expect(req.request.body).toEqual({
            prompt: [
                'Genera 2 problemas de suma',
                'Competencia: Compex Test',
                'Descripción de competencia: Competencia de prueba',
                'Nivel: Intermedio',
                'Tipo: Individual',
            ].join('\n'),
            cantidad: 2,
            dificultad: 'Facil',
            tema: 'Genera 2 problemas de suma',
            nivel: 'Intermedio',
        });

        req.flush({
            status: 'success',
            data: {
                problemas: [
                    {
                        titulo: 'Suma simple',
                        descripcion: 'Sumar dos enteros.',
                        dificultad: 'Facil',
                        formato_entrada: 'Dos enteros separados por espacio.',
                        formato_salida: 'La suma de ambos enteros.',
                        ejemplo_entrada: '1 2',
                        ejemplo_salida: '3',
                    },
                ],
            },
            message: 'Problemas generados correctamente.',
        });
    });

    it('omite dificultad cuando no se selecciona una fija', () => {
        service
            .generate({
                ...baseOpts,
                prompt: 'Problemas de arrays',
                cantidad: 1,
                dificultad: null,
            })
            .subscribe();

        const req = httpMock.expectOne((r) =>
            r.url.endsWith('/problemas/generar-ia'),
        );
        expect(req.request.body.dificultad).toBeUndefined();

        req.flush({
            status: 'success',
            data: { problemas: [] },
        });
    });
});
