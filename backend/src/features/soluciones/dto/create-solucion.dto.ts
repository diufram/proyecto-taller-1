import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Lenguaje } from '../../../database/entities/solucion.entity';

export class CreateSolucionDto {
  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  problema_id!: number;

  @ApiProperty({ example: 'print("Hello World")' })
  @IsString()
  @IsNotEmpty()
  respuesta!: string;

  @ApiProperty({ enum: Lenguaje, example: Lenguaje.PYTHON })
  @IsEnum(Lenguaje)
  lenguaje_programacion!: Lenguaje;
}
