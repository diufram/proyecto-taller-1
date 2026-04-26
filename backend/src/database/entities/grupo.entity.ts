import { Entity, Column, OneToMany } from 'typeorm';
import { Inscripcion } from './inscripcion.entity';
import { BaseEntity } from '../../core/entities/base.entity';

@Entity('grupos')
export class Grupo extends BaseEntity {
  @Column()
  nombre!: string;

  @OneToMany(() => Inscripcion, (inscripcion) => inscripcion.grupo)
  inscripciones!: Inscripcion[];
}
