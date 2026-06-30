import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ProblemasService } from './problemas.service';

describe('ProblemasService', () => {
    let service: ProblemasService;
    let httpMock: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [provideHttpClient(), provideHttpClientTesting()],
        });
        service = TestBed.inject(ProblemasService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('create hace POST /competencias/:id/problemas con el body recibido', () => {
        const dto = {
            titulo: 'Suma simple',
            dificultad: 'Facil' as const,
            formato_entrada: 'dos enteros',
            formato_salida: 'la suma',
            ejemplo_entrada: '1 2',
            ejemplo_salida: '3',
        };
        service.create(7, dto).subscribe();

        const req = httpMock.expectOne(
            (r) => r.url.endsWith('/competencias/7/problemas'),
        );
        expect(req.request.method).toBe('POST');
        expect(req.request.body).toEqual(dto);
        req.flush({ problema: { id: 1, ...dto, competencia: { id: 7 } }, message: 'ok' });
    });

    it('getByCompetencia arma GET con search y dificultad', () => {
        service
            .getByCompetencia(3, { search: 'suma', dificultad: 'Facil' })
            .subscribe();

        const req = httpMock.expectOne(
            (r) =>
                r.url.endsWith('/competencias/3/problemas') &&
                r.params.get('search') === 'suma' &&
                r.params.get('dificultad') === 'Facil',
        );
        expect(req.request.method).toBe('GET');
        req.flush({ items: [], meta: { total: 0, page: 1, limit: 100, total_pages: 0 } });
    });
});