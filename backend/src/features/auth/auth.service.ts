import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { createHash } from 'crypto';
import { compare, hash } from 'bcryptjs';
import { Usuario } from '../../database/entities/usuario.entity';
import { AuthRepository } from './auth.repository';
import { LoginDto } from './dto/login.dto';
import { LogoutDto } from './dto/logout.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';

type TokensResponse = {
  access_token: string;
  refresh_token: string;
};

@Injectable()
export class AuthService {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async register(dto: RegisterDto) {
    const existente = await this.authRepository.buscarUsuarioPorCorreo(
      dto.correo_electronico,
    );
    if (existente) {
      throw new ConflictException('El correo electronico ya esta registrado.');
    }

    const passwordHash = await hash(dto.contrasena, 10);
    const usuario = await this.authRepository.crearUsuario({
      nombre_usuario: dto.nombre_usuario,
      correo_electronico: dto.correo_electronico,
      contrasena: passwordHash,
    });

    await this.authRepository.crearPersona({
      nombre: dto.nombre,
      apellido: dto.apellido,
      celular: dto.celular,
      usuario,
    });

    const tokens = await this.generarTokens(usuario);
    return {
      usuario: this.serializarUsuario(usuario),
      ...tokens,
      message: 'Usuario registrado exitosamente.',
    };
  }

  async login(dto: LoginDto) {
    const usuario = await this.authRepository.buscarUsuarioPorCorreo(
      dto.correo_electronico,
    );
    if (!usuario) {
      throw new UnauthorizedException('Credenciales invalidas.');
    }

    const passwordValida = await compare(dto.contrasena, usuario.contrasena);
    if (!passwordValida) {
      throw new UnauthorizedException('Credenciales invalidas.');
    }

    const tokens = await this.generarTokens(usuario);
    return {
      usuario: this.serializarUsuario(usuario),
      ...tokens,
      message: 'Inicio de sesion exitoso.',
    };
  }

  async refresh(dto: RefreshTokenDto) {
    const payload = await this.verificarRefreshToken(dto.refresh_token);
    const refreshTokenHash = this.hashToken(dto.refresh_token);
    const tokenGuardado = await this.authRepository.buscarRefreshTokenValido(
      payload.sub,
      refreshTokenHash,
    );

    if (!tokenGuardado || tokenGuardado.expires_at <= new Date()) {
      throw new UnauthorizedException('Refresh token invalido o expirado.');
    }

    await this.authRepository.revocarRefreshToken(tokenGuardado.id);

    const usuario =
      tokenGuardado.usuario ||
      (await this.authRepository.buscarUsuarioPorId(payload.sub));
    if (!usuario) {
      throw new UnauthorizedException('Usuario no encontrado.');
    }

    const tokens = await this.generarTokens(usuario);
    return {
      usuario: this.serializarUsuario(usuario),
      ...tokens,
      message: 'Tokens renovados exitosamente.',
    };
  }

  async logout(dto: LogoutDto) {
    const payload = await this.verificarRefreshToken(dto.refresh_token);
    const refreshTokenHash = this.hashToken(dto.refresh_token);
    const tokenGuardado = await this.authRepository.buscarRefreshTokenValido(
      payload.sub,
      refreshTokenHash,
    );

    if (!tokenGuardado) {
      throw new UnauthorizedException('Refresh token invalido o expirado.');
    }

    await this.authRepository.revocarRefreshToken(tokenGuardado.id);

    return {
      message: 'Sesion cerrada exitosamente.',
    };
  }

  async me(user: JwtPayload) {
    const usuario = await this.authRepository.buscarUsuarioPorId(user.sub);
    if (!usuario) {
      throw new UnauthorizedException('Usuario no encontrado.');
    }

    return {
      usuario: this.serializarUsuario(usuario),
    };
  }

  private async generarTokens(usuario: Usuario): Promise<TokensResponse> {
    const payload: JwtPayload = {
      sub: usuario.id,
      correo_electronico: usuario.correo_electronico,
      rol: usuario.rol,
    };

    const accessExpiresIn = this.parseDurationToSeconds(
      this.configService.get<string>('JWT_ACCESS_EXPIRES_IN') || '15m',
      15 * 60,
    );
    const refreshExpiresIn = this.parseDurationToSeconds(
      this.configService.get<string>('JWT_REFRESH_EXPIRES_IN') || '7d',
      7 * 24 * 60 * 60,
    );

    const accessToken = await this.jwtService.signAsync(payload, {
      secret:
        this.configService.get<string>('JWT_ACCESS_SECRET') ||
        'dev_access_secret_change_me',
      expiresIn: accessExpiresIn,
    });

    const refreshToken = await this.jwtService.signAsync(payload, {
      secret:
        this.configService.get<string>('JWT_REFRESH_SECRET') ||
        'dev_refresh_secret_change_me',
      expiresIn: refreshExpiresIn,
    });

    const expiresAt = new Date(Date.now() + refreshExpiresIn * 1000);

    await this.authRepository.guardarRefreshToken(
      usuario.id,
      this.hashToken(refreshToken),
      expiresAt,
    );

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  private async verificarRefreshToken(token: string): Promise<JwtPayload> {
    try {
      return await this.jwtService.verifyAsync<JwtPayload>(token, {
        secret:
          this.configService.get<string>('JWT_REFRESH_SECRET') ||
          'dev_refresh_secret_change_me',
      });
    } catch {
      throw new UnauthorizedException('Refresh token invalido o expirado.');
    }
  }

  private hashToken(token: string): string {
    return createHash('sha256').update(token).digest('hex');
  }

  private parseDurationToSeconds(duration: string, fallback: number): number {
    if (/^\d+$/.test(duration)) {
      return Number.parseInt(duration, 10);
    }

    if (duration.endsWith('s')) {
      return Number.parseInt(duration.replace('s', ''), 10);
    }

    if (duration.endsWith('m')) {
      return Number.parseInt(duration.replace('m', ''), 10) * 60;
    }

    if (duration.endsWith('h')) {
      return Number.parseInt(duration.replace('h', ''), 10) * 60 * 60;
    }

    if (duration.endsWith('d')) {
      return Number.parseInt(duration.replace('d', ''), 10) * 24 * 60 * 60;
    }

    return fallback;
  }

  private serializarUsuario(usuario: Usuario) {
    return {
      id: usuario.id,
      nombre_usuario: usuario.nombre_usuario,
      correo_electronico: usuario.correo_electronico,
      rol: usuario.rol,
      created_at: usuario.createdAt,
      updated_at: usuario.updatedAt,
    };
  }
}
