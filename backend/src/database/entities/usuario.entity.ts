import { Entity, Column, OneToMany } from 'typeorm';
import { Inscripcion } from './inscripcion.entity';
import { RetroalimentacionProblema } from './retroalimentacion.entity';
import { BaseEntity } from '../../core/entities/base.entity';

export enum Rol {
  USER = 'user',
  ADMIN = 'admin',
}

@Entity('usuarios')
export class Usuario extends BaseEntity {
  @Column()
  nombre_usuario!: string;

  @Column({ unique: true })
  correo_electronico!: string;

  @Column()
  contrasena!: string;

  @Column({ type: 'enum', enum: Rol, default: Rol.USER })
  rol!: Rol;

  @Column({ name: 'esta_verificado', default: false })
  esta_verificado!: boolean;

  @Column({ nullable: true })
  foto?: string;

  @OneToMany(() => Inscripcion, (i) => i.usuario)
  inscripciones!: Inscripcion[];

  @OneToMany(() => RetroalimentacionProblema, (r) => r.usuario)
  retroalimentaciones!: RetroalimentacionProblema[];
}
