import { UnprocessableEntityException } from '@nestjs/common';
import { CompetenciasService } from './competencias.service';

describe('CompetenciasService', () => {
    let service: CompetenciasService;
    let repo: jest.Mocked<any>;

    beforeEach(() => {
        repo = {
            crear: jest.fn(),
            listar: jest.fn(),
            buscarPorId: jest.fn(),
            actualizar: jest.fn(),
            eliminar: jest.fn(),
        };
        service = new CompetenciasService(repo);
    });

    it('create valida que fecha_fin sea posterior a fecha_inicio', async () => {
        await expect(
            service.create({
                nombre: 'X',
                fecha_inicio: '2026-07-10 10:00:00' as any,
                fecha_fin: '2026-07-01 10:00:00' as any,
                nivel_dificultad: 'Principiante' as any,
                estado: 'Abierta' as any,
                max_participantes: 1,
            }),
        ).rejects.toBeInstanceOf(UnprocessableEntityException);
    });

    it('create llama al repositorio con el dto recibido', async () => {
        repo.crear.mockResolvedValue({ id: 7 });

        await service.create({
            nombre: 'Test',
            fecha_inicio: '2026-07-01 10:00:00' as any,
            fecha_fin: '2026-07-10 10:00:00' as any,
            nivel_dificultad: 'Principiante' as any,
            estado: 'Abierta' as any,
            max_participantes: 30,
        });

        expect(repo.crear).toHaveBeenCalledWith(
            expect.objectContaining({
                nombre: 'Test',
                max_participantes: 30,
            }),
        );
    });

    it('findOne lanza NotFoundException si no existe', async () => {
        const { NotFoundException } = await import('@nestjs/common');
        repo.buscarPorId.mockResolvedValue(null);

        await expect(service.findOne(1)).rejects.toBeInstanceOf(
            NotFoundException,
        );
    });
});