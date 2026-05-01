import { Entity, Column, OneToOne, JoinColumn } from 'typeorm';
import { Usuario } from './usuario.entity';
import { BaseEntity } from '../../core/entities/base.entity';

@Entity('personas')
export class Persona extends BaseEntity {
  @Column()
  nombre!: string;

  @Column()
  apellido!: string;

  @Column({ nullable: true })
  celular?: string;

  @OneToOne(() => Usuario)
  @JoinColumn()
  usuario!: Usuario;
}
