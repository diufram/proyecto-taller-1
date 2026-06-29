import { Entity, Column, ManyToOne } from 'typeorm';
import { Problema } from './problema.entity';
import { Usuario } from './usuario.entity';
import { BaseEntity } from '../../core/entities/base.entity';

export type TipoCriterioEvaluacion = 'Obligatorio' | 'Objetivo';

export interface CriterioEvaluacionSolucion {
  criterio: string;
  peso: number;
  tipo: TipoCriterioEvaluacion;
  puntaje: number;
  comentario: string;
}

export enum EstadoSolucion {
  PENDIENTE = 'Pendiente',
  REVISION = 'En revisión',
  REVISADO = 'Revisado',
}

export enum Lenguaje {
  PYTHON = 'Python',
  JAVA = 'Java',
  C = 'C',
  JAVASCRIPT = 'JavaScript',
  PSEUDOCODIGO = 'Pseudocodigo',
  OTRO = 'Otro',
}

@Entity('soluciones')
export class Solucion extends BaseEntity {
  @Column('text')
  respuesta!: string;

  @Column({ type: 'enum', enum: EstadoSolucion })
  estado!: EstadoSolucion;

  @Column({ type: 'enum', enum: Lenguaje })
  lenguaje_programacion!: Lenguaje;

  @Column({ default: false })
  resultado_validacion!: boolean;

  @Column({ type: 'integer', default: 0 })
  puntaje_total!: number;

  @Column({ type: 'float', nullable: true })
  confianza_ia?: number | null;

  @Column({ type: 'text', nullable: true })
  justificacion_ia?: string | null;

  @Column({ type: 'jsonb', nullable: true })
  criterios_evaluacion?: CriterioEvaluacionSolucion[] | null;

  @ManyToOne(() => Problema, (p) => p.soluciones)
  problema!: Problema;

  @ManyToOne(() => Usuario)
  usuario!: Usuario;
}
