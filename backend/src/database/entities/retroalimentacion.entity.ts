import { Entity, Column, ManyToOne } from 'typeorm';
import { Usuario } from './usuario.entity';
import { Problema } from './problema.entity';
import { BaseEntity } from '../../core/entities/base.entity';

@Entity('retroalimentacion_problemas')
export class RetroalimentacionProblema extends BaseEntity {
  @Column('text')
  retroalimentacion!: string;

  @ManyToOne(() => Usuario, (u) => u.retroalimentaciones)
  usuario!: Usuario;

  @ManyToOne(() => Problema)
  problema!: Problema;
}
