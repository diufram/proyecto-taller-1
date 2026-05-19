import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Grupo } from '../../database/entities/grupo.entity';
import { Competencia, Tipo } from '../../database/entities/competencia.entity';
import { Inscripcion } from '../../database/entities/inscripcion.entity';
import { CreateGrupoDto } from './dto/create-grupo.dto';
import { JoinGrupoDto } from './dto/join-grupo.dto';
import { JwtPayload } from '../auth/interfaces/jwt-payload.interface';

@Injectable()
export class GruposService {
  constructor(
    @InjectRepository(Grupo)
    private readonly grupoRepository: Repository<Grupo>,
    @InjectRepository(Competencia)
    private readonly competenciaRepository: Repository<Competencia>,
    @InjectRepository(Inscripcion)
    private readonly inscripcionRepository: Repository<Inscripcion>,
  ) {}

  async create(user: JwtPayload, dto: CreateGrupoDto) {
    const competencia = await this.competenciaRepository.findOne({
      where: { id: dto.competencia_id },
      relations: { grupos: true },
    });

    if (!competencia) {
      throw new NotFoundException('Competencia no encontrada.');
    }

    if (competencia.tipo !== Tipo.GRUPAL) {
      throw new BadRequestException('Solo se pueden crear grupos en competencias grupales.');
    }

    if (competencia.estado !== 'Abierta') {
      throw new BadRequestException('La competencia no está abierta para inscripciones.');
    }

    const yaInscrito = await this.inscripcionRepository.findOne({
      where: { usuario: { id: user.sub }, competencia: { id: competencia.id } },
    });

    if (yaInscrito) {
      throw new BadRequestException('Ya estás inscrito en esta competencia.');
    }

    const grupoExistente = await this.grupoRepository.findOne({
      where: { nombre: dto.nombre, competencia: { id: competencia.id } },
    });

    if (grupoExistente) {
      throw new ConflictException('Ya existe un grupo con ese nombre en esta competencia.');
    }

    const grupo = this.grupoRepository.create({
      nombre: dto.nombre,
      competencia: { id: competencia.id },
    });
    const savedGrupo = await this.grupoRepository.save(grupo);

    const inscripcion = this.inscripcionRepository.create({
      fecha_inscripcion: new Date(),
      usuario: { id: user.sub },
      competencia: { id: competencia.id },
      grupo: { id: savedGrupo.id },
    });
    await this.inscripcionRepository.save(inscripcion);

    return {
      grupo: {
        id: savedGrupo.id,
        nombre: savedGrupo.nombre,
        competencia_id: competencia.id,
        competidores_actuales: 1,
        max_participantes: competencia.max_participantes,
      },
      message: 'Grupo creado e inscripción realizada correctamente.',
    };
  }

  async findByCompetencia(competenciaId: number) {
    const grupos = await this.grupoRepository.find({
      where: { competencia: { id: competenciaId } },
      relations: { inscripciones: true },
    });

    const competencia = await this.competenciaRepository.findOne({
      where: { id: competenciaId },
    });

    if (!competencia) {
      throw new NotFoundException('Competencia no encontrada.');
    }

    const gruposConSlots = grupos.map((grupo) => ({
      id: grupo.id,
      nombre: grupo.nombre,
      competidores_actuales: grupo.inscripciones.length,
      slots_disponibles: Math.max(0, competencia.max_participantes - grupo.inscripciones.length),
      max_participantes: competencia.max_participantes,
    }));

    return { grupos: gruposConSlots };
  }

  async join(user: JwtPayload, dto: JoinGrupoDto) {
    const grupo = await this.grupoRepository.findOne({
      where: { id: dto.grupo_id },
      relations: { inscripciones: true, competencia: true },
    });

    if (!grupo) {
      throw new NotFoundException('Grupo no encontrado.');
    }

    if (grupo.competencia.estado !== 'Abierta') {
      throw new BadRequestException('La competencia no está abierta para inscripciones.');
    }

    const yaInscrito = await this.inscripcionRepository.findOne({
      where: { usuario: { id: user.sub }, competencia: { id: grupo.competencia.id } },
    });

    if (yaInscrito) {
      throw new BadRequestException('Ya estás inscrito en esta competencia.');
    }

    if (grupo.inscripciones.length >= grupo.competencia.max_participantes) {
      throw new BadRequestException('El grupo está lleno.');
    }

    const inscripcion = this.inscripcionRepository.create({
      fecha_inscripcion: new Date(),
      usuario: { id: user.sub },
      competencia: { id: grupo.competencia.id },
      grupo: { id: grupo.id },
    });
    await this.inscripcionRepository.save(inscripcion);

    return {
      grupo: {
        id: grupo.id,
        nombre: grupo.nombre,
        competidores_actuales: grupo.inscripciones.length + 1,
        max_participantes: grupo.competencia.max_participantes,
      },
      message: 'Te has unido al grupo correctamente.',
    };
  }

  async leave(user: JwtPayload, grupoId: number) {
    const grupo = await this.grupoRepository.findOne({
      where: { id: grupoId },
      relations: { inscripciones: true },
    });

    if (!grupo) {
      throw new NotFoundException('Grupo no encontrado.');
    }

    const inscripcion = await this.inscripcionRepository.findOne({
      where: { usuario: { id: user.sub }, grupo: { id: grupoId } },
    });

    if (!inscripcion) {
      throw new BadRequestException('No estás inscrito en este grupo.');
    }

    await this.inscripcionRepository.remove(inscripcion);

    if (grupo.inscripciones.length <= 1) {
      await this.grupoRepository.remove(grupo);
      return { message: 'Has salido del grupo. El grupo ha sido eliminado porque quedó vacío.' };
    }

    return { message: 'Has salido del grupo correctamente.' };
  }
}