import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ example: 'matias.dev' })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  nombre_usuario!: string;

  @ApiProperty({ example: 'matias@correo.com' })
  @IsEmail()
  correo_electronico!: string;

  @ApiProperty({ example: 'Password123' })
  @IsString()
  @MinLength(8)
  contrasena!: string;
}
