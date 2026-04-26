import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { RefreshToken } from '../../database/entities/refresh-token.entity';
import { Usuario } from '../../database/entities/usuario.entity';

@Injectable()
export class AuthRepository {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
    @InjectRepository(RefreshToken)
    private readonly refreshTokenRepository: Repository<RefreshToken>,
  ) {}

  async crearUsuario(data: Partial<Usuario>): Promise<Usuario> {
    const usuario = this.usuarioRepository.create(data);
    return this.usuarioRepository.save(usuario);
  }

  async buscarUsuarioPorCorreo(correo: string): Promise<Usuario | null> {
    return this.usuarioRepository.findOne({
      where: { correo_electronico: correo },
    });
  }

  async buscarUsuarioPorId(id: number): Promise<Usuario | null> {
    return this.usuarioRepository.findOne({ where: { id } });
  }

  async guardarRefreshToken(
    usuarioId: number,
    tokenHash: string,
    expiraEn: Date,
  ): Promise<RefreshToken> {
    const refreshToken = this.refreshTokenRepository.create({
      usuario: { id: usuarioId },
      token_hash: tokenHash,
      expires_at: expiraEn,
    });

    return this.refreshTokenRepository.save(refreshToken);
  }

  async buscarRefreshTokenValido(
    usuarioId: number,
    tokenHash: string,
  ): Promise<RefreshToken | null> {
    return this.refreshTokenRepository.findOne({
      where: {
        usuario: { id: usuarioId },
        token_hash: tokenHash,
        revoked_at: IsNull(),
      },
      relations: ['usuario'],
    });
  }

  async revocarRefreshToken(id: number): Promise<void> {
    await this.refreshTokenRepository.update(id, {
      revoked_at: new Date(),
    });
  }
}
