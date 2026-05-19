import { Type } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Dificultad } from '../../../database/entities/problema.entity';

export class CreateProblemaDto {
  @ApiProperty({ example: 'Suma de dos números' })
  @IsString()
  @IsNotEmpty()
  titulo!: string;

  @ApiProperty({ example: 'Dado dos numeros a y b, retorna la suma.' })
  @IsString()
  @IsNotEmpty()
  descripcion!: string;

  @ApiProperty({ enum: Dificultad, example: Dificultad.FACIL })
  @IsEnum(Dificultad)
  dificultad!: Dificultad;

  @ApiProperty({ example: 'Dos enteros a y b separados por espacio' })
  @IsString()
  @IsNotEmpty()
  formato_entrada!: string;

  @ApiProperty({ example: 'Un entero representando la suma' })
  @IsString()
  @IsNotEmpty()
  formato_salida!: string;

  @ApiProperty({ example: '3 5' })
  @IsString()
  @IsNotEmpty()
  ejemplo_entrada!: string;

  @ApiProperty({ example: '8' })
  @IsString()
  @IsNotEmpty()
  ejemplo_salida!: string;
}