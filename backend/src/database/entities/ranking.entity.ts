import { Entity, Column, ManyToOne } from 'typeorm';
import { Usuario } from './usuario.entity';
import { Competencia } from './competencia.entity';
import { BaseEntity } from '../../core/entities/base.entity';

@Entity('rankings')
export class Ranking extends BaseEntity {
  @Column()
  posicion!: number;

  @Column()
  puntuacion!: number;

  @ManyToOne(() => Usuario)
  usuario!: Usuario;

  @ManyToOne(() => Competencia, (c) => c.rankings)
  competencia!: Competencia;
}
