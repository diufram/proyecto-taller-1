import { Entity, Column, ManyToOne } from 'typeorm';
import { Problema } from './problema.entity';
import { Usuario } from './usuario.entity';
import { BaseEntity } from '../../core/entities/base.entity';

export enum EstadoSolucion {
  PENDIENTE = 'Pendiente',
  CORRECTO = 'Correcto',
  INCORRECTO = 'Incorrecto',
  REVISION = 'En revisión',
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

  @ManyToOne(() => Problema, (p) => p.soluciones)
  problema!: Problema;

  @ManyToOne(() => Usuario)
  usuario!: Usuario;
}
