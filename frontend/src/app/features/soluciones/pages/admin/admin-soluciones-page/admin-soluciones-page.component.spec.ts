import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { MessageService } from 'primeng/api';

import { AdminSolucionesPageComponent } from './admin-soluciones-page.component';
import { ApiService } from '@/core/services/http/api.service';
import { MockApiService } from '@testing/mock-api.service';
import { MockRouter } from '@testing/mock-router';
import { AdminSolucion, EstadoSolucion } from '../../models/solucion.model';

describe('AdminSolucionesPageComponent', () => {
    let component: AdminSolucionesPageComponent;
    let fixture: ComponentFixture<AdminSolucionesPageComponent>;
    let api: MockApiService;
    let router: MockRouter;

    const solucionMock = (id: number, estado: EstadoSolucion): AdminSolucion => ({
        id,
        respuesta: 'print(1)',
        lenguaje_programacion: 'Python',
        estado,
        resultado_validacion: false,
        puntaje_total: 0,
        problema_id: 1,
        problema_titulo: 'Suma',
        problema_dificultad: 'Facil',
        competencia_id: 1,
        competencia_nombre: 'Olimpiada',
        usuario_id: 10,
        usuario_email: 'juan@example.com',
        usuario_nombre: 'Juan',
        usuario_apellido: 'Perez',
        created_at: '2026-01-01T00:00:00Z',
        updated_at: '2026-01-01T00:00:00Z',
    });

    const listResponse = (items: AdminSolucion[], total: number) => ({
        items,
        meta: { total, page: 1, limit: 8, total_pages: Math.ceil(total / 8) },
    });

    beforeEach(async () => {
        router = new MockRouter();
        api = new MockApiService();
        api.when('GET', 'soluciones', listResponse([solucionMock(1, 'Pendiente')], 1));
        api.when('GET', 'competencias/1', { competencia: { id: 1, nombre: 'Olimpiada' } as any });
        api.when('GET', 'problemas/1', { problema: { id: 1, titulo: 'Suma' } as any });

        await TestBed.configureTestingModule({
            imports: [
                FormsModule,
                ReactiveFormsModule,
                AdminSolucionesPageComponent,
            ],
            providers: [
                { provide: ApiService, useValue: api },
                { provide: Router, useValue: router },
                MessageService,
                {
                    provide: ActivatedRoute,
                    useValue: {
                        snapshot: {
                            paramMap: convertToParamMap({}),
                        },
                    },
                },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(AdminSolucionesPageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should load initial list without filters', () => {
        const req = api.requests.find((r) => r.method === 'GET');
        expect(req).toBeDefined();
        expect(req?.url).toBe('GET soluciones');
        expect(req?.params).toEqual({
            page: 1,
            limit: 8,
        });
    });

    it('should display name with persona', () => {
        expect(component.displayName(solucionMock(1, 'Pendiente'))).toBe('Juan Perez');
    });

    it('should fallback to email when persona missing', () => {
        const s = { ...solucionMock(1, 'Pendiente'), usuario_nombre: null, usuario_apellido: null };
        expect(component.displayName(s)).toBe('juan@example.com');
    });

    it('should navigate to grading page with target', () => {
        const s = solucionMock(2, 'Pendiente');
        component.competenciaId = 1;
        component.problemaId = 3;

        component.openCalificar(s);

        expect(router.navigations.at(-1)?.commands).toEqual([
            '/admin/competencias/problemas',
            1,
            'problema',
            3,
            'soluciones',
            2,
            'calificar',
        ]);
    });

    it('should map estado to severity', () => {
        expect(component.estadoSeverity('Revisado')).toBe('success');
        expect(component.estadoSeverity('Pendiente')).toBe('info');
        expect(component.estadoSeverity('En revisión')).toBe('warn');
    });

    it('should detect active filters when search is set', () => {
        component.currentSearch = 'juan';
        expect(component.hasActiveFilters).toBe(true);
    });

    it('should detect active filters when estado is set', () => {
        component.currentEstado = 'Revisado';
        expect(component.hasActiveFilters).toBe(true);
    });

    it('should detect active filters when lenguaje is set', () => {
        component.currentLenguaje = 'Python';
        expect(component.hasActiveFilters).toBe(true);
    });

    it('should reset to no filters on clearFilters', () => {
        component.currentSearch = 'juan';
        component.currentEstado = 'Revisado';
        component.currentLenguaje = 'Python';

        component.clearFilters();

        expect(component.currentSearch).toBe('');
        expect(component.currentEstado).toBeNull();
        expect(component.currentLenguaje).toBeNull();
    });

    it('should not have active filters by default', () => {
        expect(component.hasActiveFilters).toBe(false);
    });

    it('should send search param on debounced search input', (done) => {
        api.when('GET', 'soluciones', listResponse([], 0));

        const input = document.createElement('input');
        input.value = 'juan';
        const event = { target: input } as unknown as Event;

        component.onSearchInput(event);

        setTimeout(() => {
            const reqsWithSearch = api.requests.filter(
                (r) => r.method === 'GET' && r.params?.['search'] === 'juan',
            );
            expect(reqsWithSearch.length).toBeGreaterThan(0);
            done();
        }, 400);
    });
});
