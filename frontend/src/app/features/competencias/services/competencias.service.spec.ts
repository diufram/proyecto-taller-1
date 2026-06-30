import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { CompetenciasService } from './competencias.service';

describe('CompetenciasService', () => {
    let service: CompetenciasService;
    let httpMock: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [provideHttpClient(), provideHttpClientTesting()],
        });
        service = TestBed.inject(CompetenciasService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('getAll arma GET /competencias con query params', () => {
        service.getAll({ page: 2, limit: 8 }).subscribe();

        const req = httpMock.expectOne(
            (r) =>
                r.url.endsWith('/competencias') &&
                r.params.get('page') === '2' &&
                r.params.get('limit') === '8',
        );
        expect(req.request.method).toBe('GET');
        req.flush({ items: [], meta: { total: 0, page: 2, limit: 8, total_pages: 0 } });
    });

    it('create hace POST /competencias con el body recibido', () => {
        const dto = {
            nombre: 'Compex',
            fecha_inicio: '2026-07-01 10:00:00',
            fecha_fin: '2026-07-10 18:00:00',
            nivel_dificultad: 'Principiante' as const,
            estado: 'Abierta' as const,
            max_participantes: 50,
        };
        service.create(dto).subscribe();

        const req = httpMock.expectOne((r) => r.url.endsWith('/competencias'));
        expect(req.request.method).toBe('POST');
        expect(req.request.body).toEqual(dto);
        req.flush({ competencia: { id: 1, ...dto, created_at: '', updated_at: '' }, message: 'ok' });
    });
});