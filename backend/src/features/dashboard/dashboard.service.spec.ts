import { DashboardService } from './dashboard.service';
import {
    Competencia,
    Estado,
} from '../../database/entities/competencia.entity';
import {
    Dificultad,
    Problema,
} from '../../database/entities/problema.entity';
import {
    EstadoSolucion,
    Solucion,
} from '../../database/entities/solucion.entity';
import { Rol, Usuario } from '../../database/entities/usuario.entity';

type AnyQB = any;

const createQueryBuilderMock = (rows: AnyQB[] = []) => {
    const qb: AnyQB = {
        select: jest.fn().mockReturnThis(),
        addSelect: jest.fn().mockReturnThis(),
        groupBy: jest.fn().mockReturnThis(),
        addGroupBy: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        addOrderBy: jest.fn().mockReturnThis(),
        leftJoin: jest.fn().mockReturnThis(),
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        innerJoin: jest.fn().mockReturnThis(),
        having: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getRawMany: jest.fn().mockResolvedValue(rows),
        getManyAndCount: jest.fn().mockResolvedValue([rows, rows.length]),
        getMany: jest.fn().mockResolvedValue(rows),
        getCount: jest.fn().mockResolvedValue(rows.length),
    };
    return qb;
};

const buildRepo = (defaultRows: AnyQB[] = []): AnyQB => ({
    count: jest.fn().mockResolvedValue(defaultRows.length),
    createQueryBuilder: jest.fn().mockImplementation(() =>
        createQueryBuilderMock(defaultRows),
    ),
    find: jest.fn().mockResolvedValue(defaultRows),
    findOne: jest.fn().mockResolvedValue(defaultRows[0] ?? null),
    save: jest.fn().mockImplementation((data) =>
        Promise.resolve({ id: 1, ...data }),
    ),
    create: jest.fn().mockImplementation((data) => data),
});

describe('DashboardService', () => {
    let service: DashboardService;
    let competenciaRepo: AnyQB;
    let problemaRepo: AnyQB;
    let solucionRepo: AnyQB;
    let usuarioRepo: AnyQB;

    beforeEach(() => {
        competenciaRepo = buildRepo();
        problemaRepo = buildRepo();
        solucionRepo = buildRepo();
        usuarioRepo = buildRepo();

        service = new DashboardService(
            competenciaRepo,
            problemaRepo,
            solucionRepo,
            usuarioRepo,
        );
    });

    it('calcula la tasa de acierto con un decimal', async () => {
        solucionRepo.count
            .mockResolvedValueOnce(10) // totalSoluciones
            .mockResolvedValueOnce(7); // solucionesCorrectas

        const stats = await service.getAdminStats();

        expect(stats.summary.tasaAcierto).toBe(70);
    });

    it('devuelve tasa de acierto 0 cuando no hay soluciones', async () => {
        solucionRepo.count
            .mockResolvedValueOnce(0)
            .mockResolvedValueOnce(0);

        const stats = await service.getAdminStats();

        expect(stats.summary.tasaAcierto).toBe(0);
        expect(stats.summary.totalSoluciones).toBe(0);
    });

    it('construye competenciasPorEstado con todos los estados en cero cuando no hay datos', async () => {
        const stats = await service.getAdminStats();

        expect(stats.competenciasPorEstado).toEqual({
            [Estado.ABIERTA]: 0,
            [Estado.EN_CURSO]: 0,
            [Estado.FINALIZADA]: 0,
            [Estado.CANCELADA]: 0,
        });
        expect(stats.problemasPorDificultad).toEqual({
            [Dificultad.FACIL]: 0,
            [Dificultad.MEDIO]: 0,
            [Dificultad.DIFICIL]: 0,
        });
        expect(stats.solucionesPorEstado).toEqual({
            [EstadoSolucion.PENDIENTE]: 0,
            [EstadoSolucion.REVISION]: 0,
            [EstadoSolucion.REVISADO]: 0,
        });
    });

    it('obtiene totalCompetencias y totalProblemas desde count()', async () => {
        competenciaRepo.count.mockResolvedValue(5);
        problemaRepo.count.mockResolvedValue(12);

        const stats = await service.getAdminStats();

        expect(stats.summary.totalCompetencias).toBe(5);
        expect(stats.summary.totalProblemas).toBe(12);
    });
});
