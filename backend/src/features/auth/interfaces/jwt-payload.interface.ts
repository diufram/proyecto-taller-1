import { Rol } from '../../../database/entities/usuario.entity';

export interface JwtPayload {
  sub: number;
  correo_electronico: string;
  rol: Rol;
}
