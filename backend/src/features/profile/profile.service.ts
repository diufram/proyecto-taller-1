import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { compare } from 'bcryptjs';
import { ProfileRepository } from './profile.repository';
import { ChangePasswordDto } from './dto/change-password.dto';

@Injectable()
export class ProfileService {
  constructor(private readonly profileRepository: ProfileRepository) {}

  async getProfile(usuarioId: number) {
    const persona =
      await this.profileRepository.findPersonaByUsuarioId(usuarioId);
    const usuario = await this.profileRepository.findUsuarioById(usuarioId);

    if (!usuario) {
      throw new NotFoundException('Usuario no encontrado');
    }

    return {
      person_id: persona?.id ?? null,
      first_name: persona?.nombre ?? '',
      last_name: persona?.apellido ?? '',
      photo: usuario.foto,
      user_id: usuario.id,
      email: usuario.correo_electronico,
    };
  }

  async changePassword(usuarioId: number, dto: ChangePasswordDto) {
    const usuario = await this.profileRepository.findUsuarioById(usuarioId);
    if (!usuario) {
      throw new NotFoundException('Usuario no encontrado');
    }

    const passwordValid = await compare(
      dto.current_password,
      usuario.contrasena,
    );
    if (!passwordValid) {
      throw new UnauthorizedException('Contraseña actual incorrecta');
    }

    const { hash } = await import('bcryptjs');
    const newPasswordHash = await hash(dto.new_password, 10);
    await this.profileRepository.updatePassword(usuarioId, newPasswordHash);

    return { message: 'Contraseña actualizada exitosamente' };
  }
}
