import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { compare } from 'bcryptjs';
import { ProfileRepository } from './profile.repository';
import { UpdateUsernameDto } from './dto/update-username.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { CheckUsernameDto } from './dto/check-username.dto';

@Injectable()
export class ProfileService {
  constructor(private readonly profileRepository: ProfileRepository) {}

  async getProfile(usuarioId: number) {
    const persona = await this.profileRepository.findPersonaByUsuarioId(usuarioId);
    if (!persona) {
      throw new NotFoundException('Perfil no encontrado');
    }

    const usuario = persona.usuario;

    return {
      person_id: persona.id,
      first_name: persona.nombre,
      last_name: persona.apellido,
      photo: usuario.foto,
      user_id: usuario.id,
      email: usuario.correo_electronico,
      username: usuario.nombre_usuario,
      is_verified: usuario.esta_verificado,
    };
  }

  async updateUsername(usuarioId: number, dto: UpdateUsernameDto) {
    const taken = await this.profileRepository.isUsernameTaken(dto.username, usuarioId);
    if (taken) {
      throw new ConflictException('El nombre de usuario ya esta en uso');
    }

    const usuario = await this.profileRepository.findUsuarioById(usuarioId);
    if (!usuario) {
      throw new NotFoundException('Usuario no encontrado');
    }

    const passwordValid = await compare(dto.current_password, usuario.contrasena);
    if (!passwordValid) {
      throw new UnauthorizedException('Contraseña incorrecta');
    }

    const updated = await this.profileRepository.updateUsername(usuarioId, dto.username);

    const persona = await this.profileRepository.findPersonaByUsuarioId(usuarioId);

    return {
      person_id: persona!.id,
      first_name: persona!.nombre,
      last_name: persona!.apellido,
      photo: updated.foto,
      user_id: updated.id,
      email: updated.correo_electronico,
      username: updated.nombre_usuario,
      is_verified: updated.esta_verificado,
    };
  }

  async changePassword(usuarioId: number, dto: ChangePasswordDto) {
    const usuario = await this.profileRepository.findUsuarioById(usuarioId);
    if (!usuario) {
      throw new NotFoundException('Usuario no encontrado');
    }

    const passwordValid = await compare(dto.current_password, usuario.contrasena);
    if (!passwordValid) {
      throw new UnauthorizedException('Contraseña actual incorrecta');
    }

    const { hash } = await import('bcryptjs');
    const newPasswordHash = await hash(dto.new_password, 10);
    await this.profileRepository.updatePassword(usuarioId, newPasswordHash);

    return { message: 'Contraseña actualizada exitosamente' };
  }

  async checkUsername(dto: CheckUsernameDto) {
    const taken = await this.profileRepository.isUsernameTaken(dto.username);
    return {
      available: !taken,
      message: taken ? 'El nombre de usuario ya esta en uso' : undefined,
    };
  }
}