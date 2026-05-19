import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import {
  Competencia,
  Estado,
} from '../../database/entities/competencia.entity';
import { Inscripcion } from '../../database/entities/inscripcion.entity';
import { JwtPayload } from '../auth/interfaces/jwt-payload.interface';
import { CreateInscripcionDto } from './dto/create-inscripcion.dto';

@Injectable()
export class InscripcionesService {
  constructor(
    @InjectRepository(Inscripcion)
    private readonly inscripcionRepository: Repository<Inscripcion>,
    @InjectRepository(Competencia)
    private readonly competenciaRepository: Repository<Competencia>,
  ) {}

  async create(user: JwtPayload, dto: CreateInscripcionDto) {
    const competencia = await this.competenciaRepository.findOne({
      where: { id: dto.competencia_id },
      relations: { inscripciones: true },
    });

    if (!competencia) {
      throw new NotFoundException('Competencia no encontrada.');
    }

    if (competencia.estado !== Estado.ABIERTA) {
      throw new BadRequestException(
        'Solo se puede inscribir en competencias abiertas.',
      );
    }

    const existente = await this.inscripcionRepository.findOne({
      where: {
        usuario: { id: user.sub },
        competencia: { id: competencia.id },
      },
      relations: { usuario: true, competencia: true },
    });

    if (existente) {
      throw new BadRequestException('Ya está inscrito en esta competencia.');
    }

    const totalInscritos = await this.inscripcionRepository.count({
      where: {
        competencia: { id: competencia.id },
      },
    });

    if (totalInscritos >= competencia.max_participantes) {
      throw new BadRequestException('La competencia alcanzó el cupo máximo.');
    }

    const inscripcionData: DeepPartial<Inscripcion> = {
      fecha_inscripcion: new Date(),
      usuario: { id: user.sub },
      competencia: { id: competencia.id },
    };

    const inscripcion = this.inscripcionRepository.create(inscripcionData);

    const saved = await this.inscripcionRepository.save(inscripcion);

    return {
      inscripcion: {
        id: saved.id,
        competencia_id: competencia.id,
        fecha_inscripcion: saved.fecha_inscripcion,
      },
      message: 'Inscripción realizada correctamente.',
    };
  }

  async my(user: JwtPayload) {
    const inscripciones = await this.inscripcionRepository.find({
      where: { usuario: { id: user.sub } },
      relations: { competencia: true, grupo: true },
      order: { createdAt: 'DESC' },
    });

    return {
      inscripciones: inscripciones.map((inscripcion) => ({
        id: inscripcion.id,
        competencia_id: inscripcion.competencia.id,
        competencia_nombre: inscripcion.competencia.nombre,
        competencia_tipo: inscripcion.competencia.tipo,
        fecha_inscripcion: inscripcion.fecha_inscripcion,
        grupo: inscripcion.grupo
          ? {
              id: inscripcion.grupo.id,
              nombre: inscripcion.grupo.nombre,
            }
          : null,
      })),
    };
  }
}
