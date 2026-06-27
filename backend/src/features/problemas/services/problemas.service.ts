import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { ProblemasRepository } from '../repositories/problemas.repository';
import { CreateProblemaDto } from '../dto/create-problema.dto';
import { QueryProblemasDto } from '../dto/query-problemas.dto';
import { UpdateProblemaDto } from '../dto/update-problema.dto';
import {
  Competencia,
  Estado,
} from '../../../database/entities/competencia.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ProblemasService {
  constructor(
    private readonly problemasRepository: ProblemasRepository,
    @InjectRepository(Competencia)
    private readonly competenciaRepository: Repository<Competencia>,
  ) {}

  async create(dto: CreateProblemaDto, competenciaId: number) {
    const competencia = await this.competenciaRepository.findOne({
      where: { id: competenciaId },
    });

    if (!competencia) {
      throw new NotFoundException('Competencia no encontrada.');
    }

    this.validarEstadoCompetencia(competencia, 'crear');

    const tituloTrim = dto.titulo.trim();
    const existente =
      await this.problemasRepository.buscarPorTituloEnCompetencia(
        tituloTrim,
        competenciaId,
      );
    if (existente) {
      throw new ConflictException(
        `Ya existe un problema con el titulo "${tituloTrim}" en esta competencia.`,
      );
    }

    const problema = await this.problemasRepository.crear({
      titulo: tituloTrim,
      dificultad: dto.dificultad,
      formato_entrada: dto.formato_entrada.trim(),
      formato_salida: dto.formato_salida.trim(),
      ejemplo_entrada: dto.ejemplo_entrada,
      ejemplo_salida: dto.ejemplo_salida,
      competencia,
    });

    return {
      problema: this.serializarProblema(problema, {
        total: 0,
        correctas: 0,
      }),
      message: 'Problema creado exitosamente.',
    };
  }

  async findAllPorCompetencia(competenciaId: number, query: QueryProblemasDto) {
    const page = query.page ?? 1;
    const limit = Math.min(query.limit ?? 100, 100);

    const [problemas, total] =
      await this.problemasRepository.listarPorCompetencia(competenciaId, query);

    const statsPorProblema =
      await this.problemasRepository.contarSolucionesPorProblema(
        problemas.map((p) => p.id),
      );

    const statsPorDificultad =
      await this.problemasRepository.contarPorDificultad(competenciaId);

    const items = problemas.map((p) => {
      const stats = statsPorProblema.get(p.id) ?? { total: 0, correctas: 0 };
      return this.serializarProblema(p, stats);
    });

    return {
      items,
      meta: {
        total,
        page,
        limit,
        total_pages: Math.ceil(total / limit),
      },
      stats: {
        total,
        por_dificultad: statsPorDificultad,
      },
    };
  }

  async findOne(id: number) {
    const problema = await this.problemasRepository.buscarPorId(id);
    if (!problema) {
      throw new NotFoundException('Problema no encontrado.');
    }

    const statsPorProblema =
      await this.problemasRepository.contarSolucionesPorProblema([problema.id]);
    const stats = statsPorProblema.get(problema.id) ?? {
      total: 0,
      correctas: 0,
    };

    return {
      problema: this.serializarProblema(problema, stats),
    };
  }

  async update(id: number, dto: UpdateProblemaDto) {
    const problema = await this.problemasRepository.buscarPorId(id);
    if (!problema) {
      throw new NotFoundException('Problema no encontrado.');
    }

    this.validarEstadoCompetencia(problema.competencia, 'actualizar');

    if (dto.titulo) {
      const tituloTrim = dto.titulo.trim();
      const existente =
        await this.problemasRepository.buscarPorTituloEnCompetencia(
          tituloTrim,
          problema.competencia.id,
          id,
        );
      if (existente) {
        throw new ConflictException(
          `Ya existe otro problema con el titulo "${tituloTrim}" en esta competencia.`,
        );
      }
      dto.titulo = tituloTrim;
    }

    const actualizada = await this.problemasRepository.actualizar(
      problema,
      dto,
    );

    const statsPorProblema =
      await this.problemasRepository.contarSolucionesPorProblema([
        actualizada.id,
      ]);
    const stats = statsPorProblema.get(actualizada.id) ?? {
      total: 0,
      correctas: 0,
    };

    return {
      problema: this.serializarProblema(actualizada, stats),
      message: 'Problema actualizado exitosamente.',
    };
  }

  async remove(id: number) {
    const problema = await this.problemasRepository.buscarPorId(id);
    if (!problema) {
      throw new NotFoundException('Problema no encontrado.');
    }

    this.validarEstadoCompetencia(problema.competencia, 'eliminar');

    const statsPorProblema =
      await this.problemasRepository.contarSolucionesPorProblema([problema.id]);
    const stats = statsPorProblema.get(problema.id) ?? {
      total: 0,
      correctas: 0,
    };

    if (stats.total > 0) {
      throw new BadRequestException(
        `No se puede eliminar el problema porque tiene ${stats.total} solucion(es) asociada(s). Resuelvalas o reasignelas primero.`,
      );
    }

    await this.problemasRepository.eliminar(id);

    return {
      message: 'Problema eliminado exitosamente.',
    };
  }

  private validarEstadoCompetencia(
    competencia: Competencia,
    accion: 'crear' | 'actualizar' | 'eliminar',
  ): void {
    if (
      competencia.estado === Estado.FINALIZADA ||
      competencia.estado === Estado.CANCELADA
    ) {
      throw new UnprocessableEntityException(
        `No se puede ${accion} un problema porque la competencia está ${competencia.estado.toLowerCase()}.`,
      );
    }
  }

  private serializarProblema(
    problema: any,
    stats: { total: number; correctas: number },
  ) {
    return {
      id: problema.id,
      titulo: problema.titulo,
      dificultad: problema.dificultad,
      formato_entrada: problema.formato_entrada,
      formato_salida: problema.formato_salida,
      ejemplo_entrada: problema.ejemplo_entrada,
      ejemplo_salida: problema.ejemplo_salida,
      competencia_id: problema.competencia?.id,
      total_soluciones: stats.total,
      soluciones_correctas: stats.correctas,
      created_at: problema.createdAt,
      updated_at: problema.updatedAt,
    };
  }
}
