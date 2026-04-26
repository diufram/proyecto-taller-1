import { Entity, Column, OneToMany } from 'typeorm';
import { Problema } from './problema.entity';
import { Inscripcion } from './inscripcion.entity';
import { Ranking } from './ranking.entity';
import { BaseEntity } from '../../core/entities/base.entity';

export enum Nivel {
  PRINCIPIANTE = 'Principiante',
  INTERMEDIO = 'Intermedio',
  AVANZADO = 'Avanzado',
}

export enum Estado {
  ABIERTA = 'Abierta',
  EN_CURSO = 'En curso',
  FINALIZADA = 'Finalizada',
  CANCELADA = 'Cancelada',
}

export enum Tipo {
  INDIVIDUAL = 'Individual',
  GRUPAL = 'Grupal',
}

@Entity('competencias')
export class Competencia extends BaseEntity {
  @Column()
  nombre!: string;

  @Column('text')
  descripcion!: string;

  @Column({ type: 'timestamp' })
  fecha_inicio!: Date;

  @Column({ type: 'timestamp' })
  fecha_fin!: Date;

  @Column({ type: 'enum', enum: Nivel })
  nivel_dificultad!: Nivel;

  @Column({ type: 'enum', enum: Estado })
  estado!: Estado;

  @Column({ type: 'enum', enum: Tipo })
  tipo!: Tipo;

  @Column({ default: 0 })
  max_participantes!: number;

  @OneToMany(() => Problema, (p) => p.competencia)
  problemas!: Problema[];

  @OneToMany(() => Inscripcion, (i) => i.competencia)
  inscripciones!: Inscripcion[];

  @OneToMany(() => Ranking, (r) => r.competencia)
  rankings!: Ranking[];
}
