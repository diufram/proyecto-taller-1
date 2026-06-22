import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ProblemasRepository } from './problemas.repository';
import {
    Dificultad,
    Problema,
} from '../../../database/entities/problema.entity';

describe('ProblemasRepository', () => {
    let repo: ProblemasRepository;
    let innerRepo: jest.Mocked<any>;

    const build = () => {
        innerRepo = {
            create: jest.fn().mockImplementation((d) => d),
            save: jest.fn().mockImplementation((d) =>
                Promise.resolve({ id: 1, ...d }),
            ),
            findOne: jest.fn(),
            softDelete: jest.fn().mockResolvedValue(undefined),
            count: jest.fn(),
            createQueryBuilder: jest.fn(),
            manager: {
                query: jest.fn(),
            },
        };
    };

    beforeEach(async () => {
        build();
        const moduleRef = await Test.createTestingModule({
            providers: [
                ProblemasRepository,
                {
                    provide: getRepositoryToken(Problema),
                    useValue: innerRepo,
                },
            ],
        }).compile();

        repo = moduleRef.get(ProblemasRepository);
    });

    describe('contarPorDificultad', () => {
        it('devuelve el Record con ceros cuando no hay filas', async () => {
            const qb = {
                select: jest.fn().mockReturnThis(),
                addSelect: jest.fn().mockReturnThis(),
                groupBy: jest.fn().mockReturnThis(),
                where: jest.fn().mockReturnThis(),
                getRawMany: jest
                    .fn()
                    .mockResolvedValue([] as Array<{
                        dificultad: Dificultad;
                        total: string;
                    }>),
            };
            innerRepo.createQueryBuilder.mockReturnValue(qb);

            const result = await repo.contarPorDificultad(5);

            expect(result).toEqual({
                [Dificultad.FACIL]: 0,
                [Dificultad.MEDIO]: 0,
                [Dificultad.DIFICIL]: 0,
            });
        });

        it('mapea correctamente el total por dificultad', async () => {
            const qb = {
                select: jest.fn().mockReturnThis(),
                addSelect: jest.fn().mockReturnThis(),
                groupBy: jest.fn().mockReturnThis(),
                where: jest.fn().mockReturnThis(),
                getRawMany: jest.fn().mockResolvedValue([
                    { dificultad: Dificultad.FACIL, total: '5' },
                    { dificultad: Dificultad.DIFICIL, total: '2' },
                ]),
            };
            innerRepo.createQueryBuilder.mockReturnValue(qb);

            const result = await repo.contarPorDificultad(1);

            expect(result).toEqual({
                [Dificultad.FACIL]: 5,
                [Dificultad.MEDIO]: 0,
                [Dificultad.DIFICIL]: 2,
            });
        });
    });
});