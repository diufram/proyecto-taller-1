import { Type } from 'class-transformer';
import {
  IsDate,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsString,
  Min,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Estado, Nivel } from '../../../database/entities/competencia.entity';

export class CreateCompetenciaDto {
  @ApiProperty({ example: 'Torneo Regional de Algoritmos' })
  @IsString()
  @IsNotEmpty()
  nombre!: string;

  @ApiProperty({ example: '2026-06-01T10:00:00.000Z' })
  @Type(() => Date)
  @IsDate()
  fecha_inicio!: Date;

  @ApiProperty({ example: '2026-06-10T18:00:00.000Z' })
  @Type(() => Date)
  @IsDate()
  fecha_fin!: Date;

  @ApiProperty({ enum: Nivel, example: Nivel.INTERMEDIO })
  @IsEnum(Nivel)
  nivel_dificultad!: Nivel;

  @ApiProperty({ enum: Estado, example: Estado.ABIERTA })
  @IsEnum(Estado)
  estado!: Estado;

  @ApiProperty({ example: 100 })
  @IsInt()
  @Min(1)
  max_participantes!: number;
}
