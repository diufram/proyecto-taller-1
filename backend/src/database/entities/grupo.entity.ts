import { Entity, Column, ManyToOne, OneToMany } from 'typeorm';
import { Inscripcion } from './inscripcion.entity';
import { Competencia } from './competencia.entity';
import { BaseEntity } from '../../core/entities/base.entity';

@Entity('grupos')
export class Grupo extends BaseEntity {
  @Column()
  nombre!: string;

  @ManyToOne(() => Competencia, (c) => c.grupos)
  competencia!: Competencia;

  @OneToMany(() => Inscripcion, (inscripcion) => inscripcion.grupo)
  inscripciones!: Inscripcion[];
}
