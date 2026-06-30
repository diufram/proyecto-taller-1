import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Persona } from '../../database/entities/persona.entity';
import { Usuario } from '../../database/entities/usuario.entity';

@Injectable()
export class ProfileRepository {
  constructor(
    @InjectRepository(Persona)
    private readonly personaRepository: Repository<Persona>,
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
  ) {}

  async findPersonaByUsuarioId(usuarioId: number): Promise<Persona | null> {
    return this.personaRepository.findOne({
      where: { usuario: { id: usuarioId } },
      relations: ['usuario'],
    });
  }

  async findUsuarioById(id: number): Promise<Usuario | null> {
    return this.usuarioRepository.findOne({ where: { id } });
  }

  async updatePassword(usuarioId: number, passwordHash: string): Promise<void> {
    await this.usuarioRepository.update(usuarioId, {
      contrasena: passwordHash,
    });
  }
}
