import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { DashboardService } from './dashboard.service';

describe('DashboardService', () => {
    let service: DashboardService;
    let httpMock: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [provideHttpClient(), provideHttpClientTesting()],
        });
        service = TestBed.inject(DashboardService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('getAdminStats hace GET /dashboard/admin y devuelve la data', (done) => {
        const mock = {
            summary: {
                totalCompetencias: 1,
                competenciasActivas: 1,
                totalProblemas: 2,
                totalUsuarios: 3,
                totalSoluciones: 4,
                tasaAcierto: 50,
            },
            competenciasPorEstado: {
                Abierta: 1,
                'En curso': 0,
                Finalizada: 0,
                Cancelada: 0,
            },
            problemasPorDificultad: { Facil: 2, Medio: 0, Dificil: 0 },
            solucionesPorEstado: {
                Pendiente: 0,
                Correcto: 4,
                Incorrecto: 0,
                'En revisión': 0,
            },
            topUsuarios: [],
            problemasMasDificiles: [],
            problemasSinActividad: [],
            competenciasRecientes: [],
            competenciaMasActiva: null,
        };

        service.getAdminStats().subscribe({
            next: (data) => {
                expect(data).toEqual(mock);
                done();
            },
            error: done.fail,
        });

        const req = httpMock.expectOne(
            (r) => r.url.endsWith('/dashboard/admin'),
        );
        expect(req.request.method).toBe('GET');
        req.flush({ status: 'success', data: mock });
    });
});