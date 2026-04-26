import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { Competencia } from '../../database/entities/competencia.entity';
import { CompetenciasRepository } from './competencias.repository';
import { CreateCompetenciaDto } from './dto/create-competencia.dto';
import { QueryCompetenciasDto } from './dto/query-competencias.dto';
import { UpdateCompetenciaDto } from './dto/update-competencia.dto';

@Injectable()
export class CompetenciasService {
  constructor(
    private readonly competenciasRepository: CompetenciasRepository,
  ) {}

  async create(dto: CreateCompetenciaDto) {
    this.validarRangoFechas(dto.fecha_inicio, dto.fecha_fin);

    const competencia = await this.competenciasRepository.crear(dto);

    return {
      competencia: this.serializarCompetencia(competencia),
      message: 'Competencia creada exitosamente.',
    };
  }

  async findAll(query: QueryCompetenciasDto) {
    const page = query.page ?? 1;
    const limit = Math.min(query.limit ?? 10, 100);

    const [competencias, total] = await this.competenciasRepository.listar({
      page,
      limit,
      busqueda: query.busqueda,
      estado: query.estado,
      nivel_dificultad: query.nivel_dificultad,
      tipo: query.tipo,
    });

    return {
      items: competencias.map((competencia) =>
        this.serializarCompetencia(competencia),
      ),
      meta: {
        total,
        page,
        limit,
        total_pages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: number) {
    const competencia = await this.competenciasRepository.buscarPorId(id);
    if (!competencia) {
      throw new NotFoundException('Competencia no encontrada.');
    }

    return {
      competencia: this.serializarCompetencia(competencia),
    };
  }

  async update(id: number, dto: UpdateCompetenciaDto) {
    const competencia = await this.competenciasRepository.buscarPorId(id);
    if (!competencia) {
      throw new NotFoundException('Competencia no encontrada.');
    }

    const fechaInicio = dto.fecha_inicio ?? competencia.fecha_inicio;
    const fechaFin = dto.fecha_fin ?? competencia.fecha_fin;
    this.validarRangoFechas(fechaInicio, fechaFin);

    const actualizada = await this.competenciasRepository.actualizar(
      competencia,
      dto,
    );

    return {
      competencia: this.serializarCompetencia(actualizada),
      message: 'Competencia actualizada exitosamente.',
    };
  }

  async remove(id: number) {
    const competencia = await this.competenciasRepository.buscarPorId(id);
    if (!competencia) {
      throw new NotFoundException('Competencia no encontrada.');
    }

    await this.competenciasRepository.eliminar(id);

    return {
      message: 'Competencia eliminada exitosamente.',
    };
  }

  private validarRangoFechas(fechaInicio: Date, fechaFin: Date): void {
    if (fechaFin <= fechaInicio) {
      throw new UnprocessableEntityException(
        'La fecha_fin debe ser posterior a fecha_inicio.',
      );
    }
  }

  private serializarCompetencia(competencia: Competencia) {
    return {
      id: competencia.id,
      nombre: competencia.nombre,
      descripcion: competencia.descripcion,
      fecha_inicio: competencia.fecha_inicio,
      fecha_fin: competencia.fecha_fin,
      nivel_dificultad: competencia.nivel_dificultad,
      estado: competencia.estado,
      tipo: competencia.tipo,
      max_participantes: competencia.max_participantes,
      created_at: competencia.createdAt,
      updated_at: competencia.updatedAt,
    };
  }
}
