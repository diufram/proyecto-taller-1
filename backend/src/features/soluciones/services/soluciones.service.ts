import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EstadoSolucion } from '../../../database/entities/solucion.entity';
import {
  Problema,
  Dificultad,
} from '../../../database/entities/problema.entity';
import { Inscripcion } from '../../../database/entities/inscripcion.entity';
import { Usuario, Rol } from '../../../database/entities/usuario.entity';
import { JwtPayload } from '../../auth/interfaces/jwt-payload.interface';
import { CreateSolucionDto } from '../dto/create-solucion.dto';
import { QuerySolucionesDto } from '../dto/query-soluciones.dto';
import { UpdateSolucionEstadoDto } from '../dto/update-solucion-estado.dto';
import { SugerirCalificacionDto } from '../dto/sugerir-calificacion.dto';
import { SolucionesRepository } from '../repositories/soluciones.repository';
import { SolucionesAiService } from './soluciones-ai.service';

const PUNTOS_POR_DIFICULTAD: Record<Dificultad, number> = {
  [Dificultad.FACIL]: 10,
  [Dificultad.MEDIO]: 20,
  [Dificultad.DIFICIL]: 30,
};

@Injectable()
export class SolucionesService {
  constructor(
    private readonly solucionesRepository: SolucionesRepository,
    private readonly solucionesAiService: SolucionesAiService,
    @InjectRepository(Problema)
    private readonly problemaRepository: Repository<Problema>,
    @InjectRepository(Inscripcion)
    private readonly inscripcionRepository: Repository<Inscripcion>,
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
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

    const result = await this.solucionesRepository.buscarPorId(solucion.id);

    return {
      solucion: this.serializarSolucion(result),
      message: 'Solucion enviada correctamente.',
    };
  }

  async findAll(query: QuerySolucionesDto) {
    const page = query.page ?? 1;
    const limit = Math.min(query.limit ?? 10, 100);

    const { items, total } = await this.solucionesRepository.listarTodas({
      page,
      limit,
      estado: query.estado,
      problema_id: query.problema_id,
      competencia_id: query.competencia_id,
      lenguaje_programacion: query.lenguaje_programacion,
      search: query.search,
    });

    return {
      items: items.map((s) => this.serializarSolucion(s)),
      meta: {
        total,
        page,
        limit,
        total_pages: Math.ceil(total / limit),
      },
    };
  }

  async findAllByUser(user: JwtPayload, query: QuerySolucionesDto) {
    const page = query.page ?? 1;
    const limit = Math.min(query.limit ?? 10, 100);

    const [soluciones, total] =
      await this.solucionesRepository.listarPorUsuario(user.sub, page, limit);

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
    const result = await this.solucionesRepository.buscarPorId(id);

    if (!result) {
      throw new NotFoundException('Solucion no encontrada.');
    }

    const { solucion } = result;
    if (solucion.usuario.id !== user.sub && user.rol !== 'admin') {
      throw new NotFoundException('Solucion no encontrada.');
    }

    return {
      solucion: this.serializarSolucion(result),
    };
  }

  async updateEstado(
    id: number,
    user: JwtPayload,
    dto: UpdateSolucionEstadoDto,
  ) {
    if (user.rol !== Rol.ADMIN) {
      throw new ForbiddenException(
        'Solo un administrador puede calificar soluciones.',
      );
    }

    const result = await this.solucionesRepository.buscarPorId(id);

    if (!result) {
      throw new NotFoundException('Solucion no encontrada.');
    }

    const { solucion } = result;
    const estadoAnterior = solucion.estado;
    const estadoNuevo = dto.estado;

    const problema = await this.problemaRepository.findOne({
      where: { id: solucion.problema.id },
    });

    if (!problema) {
      throw new NotFoundException('Problema no encontrado.');
    }

    const puntosProblema = PUNTOS_POR_DIFICULTAD[problema.dificultad] ?? 0;

    const delta = this.calcularDeltaPuntos(
      estadoAnterior,
      estadoNuevo,
      puntosProblema,
    );

    if (delta !== 0) {
      await this.ajustarPuntosUsuario(solucion.usuario.id, delta);
    }

    const resultadoValidacion =
      dto.resultado_validacion ?? estadoNuevo === EstadoSolucion.CORRECTO;

    const actualizada = await this.solucionesRepository.actualizar(solucion, {
      estado: estadoNuevo,
      resultado_validacion: resultadoValidacion,
    });

    return {
      solucion: this.serializarSolucion({
        solucion: actualizada,
        persona_nombre: result.persona_nombre,
        persona_apellido: result.persona_apellido,
      }),
      delta_puntos: delta,
      message: 'Estado de la solucion actualizado correctamente.',
    };
  }

  async sugerirCalificacion(
    id: number,
    user: JwtPayload,
    dto: SugerirCalificacionDto,
  ) {
    if (user.rol !== Rol.ADMIN) {
      throw new ForbiddenException(
        'Solo un administrador puede pedir sugerencias de la IA.',
      );
    }

    const result = await this.solucionesRepository.buscarPorId(id);

    if (!result) {
      throw new NotFoundException('Solucion no encontrada.');
    }

    const { solucion } = result;
    const problema = solucion.problema;

    const sugerencia = await this.solucionesAiService.sugerir({
      problemaTitulo: problema.titulo,
      problemaFormatoEntrada: problema.formato_entrada,
      problemaFormatoSalida: problema.formato_salida,
      problemaEjemploEntrada: problema.ejemplo_entrada,
      problemaEjemploSalida: problema.ejemplo_salida,
      problemaDificultad: problema.dificultad,
      lenguaje: solucion.lenguaje_programacion,
      respuesta: solucion.respuesta,
      instruccionesExtra: dto.instrucciones_extra,
    });

    return {
      sugerencia,
      message:
        'Sugerencia generada. Revisá y aplicá manualmente si estás de acuerdo.',
    };
  }

  private calcularDeltaPuntos(
    anterior: EstadoSolucion,
    nuevo: EstadoSolucion,
    puntosProblema: number,
  ): number {
    const otorga = (estado: EstadoSolucion) =>
      estado === EstadoSolucion.CORRECTO ? puntosProblema : 0;

    return otorga(nuevo) - otorga(anterior);
  }

  private async ajustarPuntosUsuario(usuarioId: number, delta: number) {
    await this.usuarioRepository.increment(
      { id: usuarioId },
      'puntos_totales',
      delta,
    );
    await this.recomputarPosiciones();
  }

  private async recomputarPosiciones() {
    await this.usuarioRepository
      .createQueryBuilder()
      .update(Usuario)
      .set({ posicion_global: () => 'NULL' })
      .execute();

    const ranking = await this.usuarioRepository
      .createQueryBuilder('u')
      .select('u.id', 'id')
      .addSelect(
        'ROW_NUMBER() OVER (ORDER BY u.puntos_totales DESC, u.created_at ASC)',
        'pos',
      )
      .where('u.rol = :rol', { rol: 'user' })
      .getRawMany<{ id: number; pos: string }>();

    for (const r of ranking) {
      await this.usuarioRepository.update(
        { id: r.id },
        { posicion_global: parseInt(r.pos, 10) },
      );
    }
  }

  private serializarSolucion(input: any) {
    const wrapper = input?.solucion ? input : null;
    const solucion = wrapper ? input.solucion : input;
    const personaNombre = wrapper ? input.persona_nombre : null;
    const personaApellido = wrapper ? input.persona_apellido : null;

    return {
      id: solucion.id,
      respuesta: solucion.respuesta,
      lenguaje_programacion: solucion.lenguaje_programacion,
      estado: solucion.estado,
      resultado_validacion: solucion.resultado_validacion,
      problema_id: solucion.problema?.id,
      problema_titulo: solucion.problema?.titulo,
      problema_dificultad: solucion.problema?.dificultad,
      problema_formato_entrada: solucion.problema?.formato_entrada,
      problema_formato_salida: solucion.problema?.formato_salida,
      problema_ejemplo_entrada: solucion.problema?.ejemplo_entrada,
      problema_ejemplo_salida: solucion.problema?.ejemplo_salida,
      competencia_id: solucion.problema?.competencia?.id,
      competencia_nombre: solucion.problema?.competencia?.nombre,
      usuario_id: solucion.usuario?.id,
      usuario_email: solucion.usuario?.correo_electronico,
      usuario_nombre: personaNombre ?? null,
      usuario_apellido: personaApellido ?? null,
      created_at: solucion.createdAt,
      updated_at: solucion.updatedAt,
    };
  }
}
