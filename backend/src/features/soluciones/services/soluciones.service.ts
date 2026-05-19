import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Solucion, EstadoSolucion } from '../../../database/entities/solucion.entity';
import { Problema } from '../../../database/entities/problema.entity';
import { Inscripcion } from '../../../database/entities/inscripcion.entity';
import { JwtPayload } from '../../auth/interfaces/jwt-payload.interface';
import { CreateSolucionDto } from '../dto/create-solucion.dto';
import { QuerySolucionesDto } from '../dto/query-soluciones.dto';
import { SolucionesRepository } from '../repositories/soluciones.repository';

@Injectable()
export class SolucionesService {
  constructor(
    private readonly solucionesRepository: SolucionesRepository,
    @InjectRepository(Problema)
    private readonly problemaRepository: Repository<Problema>,
    @InjectRepository(Inscripcion)
    private readonly inscripcionRepository: Repository<Inscripcion>,
  ) {}

  async create(user: JwtPayload, dto: CreateSolucionDto) {
    const problema = await this.problemaRepository.findOne({
      where: { id: dto.problema_id },
      relations: ['competencia'],
    });

    if (!problema) {
      throw new NotFoundException('Problema no encontrado.');
    }

    const inscripcion = await this.inscripcionRepository.findOne({
      where: {
        usuario: { id: user.sub },
        competencia: { id: problema.competencia.id },
      },
    });

    if (!inscripcion) {
      throw new BadRequestException(
        'Debes estar inscrito en la competencia para enviar una solucion.',
      );
    }

    const yaEnvio = await this.solucionesRepository.existeSolucionPrevia(
      user.sub,
      dto.problema_id,
    );

    if (yaEnvio) {
      throw new BadRequestException(
        'Ya has enviado una solucion para este problema.',
      );
    }

    const solucion = await this.solucionesRepository.crear({
      respuesta: dto.respuesta,
      lenguaje_programacion: dto.lenguaje_programacion,
      estado: EstadoSolucion.PENDIENTE,
      resultado_validacion: false,
      problema: { id: dto.problema_id } as Problema,
      usuario: { id: user.sub } as any,
    });

    return {
      solucion: this.serializarSolucion(solucion),
      message: 'Solucion enviada correctamente.',
    };
  }

  async findAllByUser(user: JwtPayload, query: QuerySolucionesDto) {
    const page = query.page ?? 1;
    const limit = Math.min(query.limit ?? 10, 100);

    const [soluciones, total] = await this.solucionesRepository.listarPorUsuario(
      user.sub,
      page,
      limit,
    );

    return {
      items: soluciones.map((s) => this.serializarSolucion(s)),
      meta: {
        total,
        page,
        limit,
        total_pages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: number, user: JwtPayload) {
    const solucion = await this.solucionesRepository.buscarPorId(id);

    if (!solucion) {
      throw new NotFoundException('Solucion no encontrada.');
    }

    if (solucion.usuario.id !== user.sub && user.rol !== 'admin') {
      throw new NotFoundException('Solucion no encontrada.');
    }

    return {
      solucion: this.serializarSolucion(solucion),
    };
  }

  private serializarSolucion(solucion: any) {
    return {
      id: solucion.id,
      respuesta: solucion.respuesta,
      lenguaje_programacion: solucion.lenguaje_programacion,
      estado: solucion.estado,
      resultado_validacion: solucion.resultado_validacion,
      problema_id: solucion.problema?.id,
      problema_titulo: solucion.problema?.titulo,
      competencia_id: solucion.problema?.competencia?.id,
      created_at: solucion.createdAt,
      updated_at: solucion.updatedAt,
    };
  }
}