import { Entity, Column, ManyToOne, OneToMany } from 'typeorm';
import { Competencia } from './competencia.entity';
import { Solucion } from './solucion.entity';
import { BaseEntity } from '../../core/entities/base.entity';

export enum Dificultad {
  FACIL = 'Facil',
  MEDIO = 'Medio',
  DIFICIL = 'Dificil',
}

@Entity('problemas')
export class Problema extends BaseEntity {
  @Column()
  titulo!: string;

  @Column('text')
  descripcion!: string;

  @Column({ type: 'enum', enum: Dificultad })
  dificultad!: Dificultad;

  @Column('text')
  formato_entrada!: string;

  @Column('text')
  formato_salida!: string;

  @Column('text')
  ejemplo_entrada!: string;

  @Column('text')
  ejemplo_salida!: string;

  @ManyToOne(() => Competencia, (c) => c.problemas)
  competencia!: Competencia;

  @OneToMany(() => Solucion, (s) => s.problema)
  soluciones!: Solucion[];
}
