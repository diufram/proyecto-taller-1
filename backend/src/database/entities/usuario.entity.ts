import { Entity, Column, OneToMany } from 'typeorm';
import { Inscripcion } from './inscripcion.entity';
import { BaseEntity } from '../../core/entities/base.entity';

export enum Rol {
  ESTUDIANTE = 'estudiante',
  ADMIN = 'admin',
}

@Entity('usuarios')
export class Usuario extends BaseEntity {
  @Column({ unique: true })
  correo_electronico!: string;

  @Column()
  contrasena!: string;

  @Column({ type: 'enum', enum: Rol, default: Rol.ESTUDIANTE })
  rol!: Rol;

  @Column({ nullable: true })
  foto?: string;

  @Column({ name: 'puntos_totales', type: 'integer', default: 0 })
  puntos_totales!: number;

  @Column({ name: 'posicion_global', type: 'integer', nullable: true })
  posicion_global?: number;

  @OneToMany(() => Inscripcion, (i) => i.usuario)
  inscripciones!: Inscripcion[];
}
