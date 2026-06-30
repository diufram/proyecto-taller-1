import { Entity, Column, ManyToOne } from 'typeorm';
import { Usuario } from './usuario.entity';
import { Competencia } from './competencia.entity';
import { BaseEntity } from '../../core/entities/base.entity';

@Entity('inscripciones')
export class Inscripcion extends BaseEntity {
  @Column({ type: 'timestamp' })
  fecha_inscripcion!: Date;

  @ManyToOne(() => Usuario, (u) => u.inscripciones)
  usuario!: Usuario;

  @ManyToOne(() => Competencia, (c) => c.inscripciones)
  competencia!: Competencia;
}
