import { RankingService } from './ranking.service';

type Trend = 'up' | 'down' | 'stable';

const buildService = () => {
    const usuarioRepository = { findOne: jest.fn(), createQueryBuilder: jest.fn(), count: jest.fn() };
    const solucionRepository = { count: jest.fn() };
    const inscripcionRepository = { count: jest.fn() };

    const service = Object.create(RankingService.prototype) as any;
    service.usuarioRepository = usuarioRepository;
    service.solucionRepository = solucionRepository;
    service.inscripcionRepository = inscripcionRepository;

    return { service, usuarioRepository, solucionRepository, inscripcionRepository };
};

describe('RankingService.computeTrend', () => {
    it('devuelve stable si no hay posición almacenada', () => {
        const { service } = buildService();
        const trend: Trend = (service as any).computeTrend(null, 5);
        expect(trend).toBe('stable');
    });

    it('devuelve up cuando la posición actual es mejor (menor)', () => {
        const { service } = buildService();
        const trend = (service as any).computeTrend(5, 2);
        expect(trend).toBe('up');
    });

    it('devuelve down cuando la posición actual es peor (mayor)', () => {
        const { service } = buildService();
        const trend = (service as any).computeTrend(3, 7);
        expect(trend).toBe('down');
    });

    it('devuelve stable cuando la posición es la misma', () => {
        const { service } = buildService();
        const trend = (service as any).computeTrend(4, 4);
        expect(trend).toBe('stable');
    });
});

describe('RankingService.capitalize', () => {
    it('capitaliza la primera letra de cada palabra', () => {
        const { service } = buildService();
        expect((service as any).capitalize('juan pérez')).toBe('Juan Pérez');
    });

    it('devuelve string vacío si recibe vacío', () => {
        const { service } = buildService();
        expect((service as any).capitalize('')).toBe('');
    });
});