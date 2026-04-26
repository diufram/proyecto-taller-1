import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString, Min } from 'class-validator';
import {
  Estado,
  Nivel,
  Tipo,
} from '../../../database/entities/competencia.entity';

export class QueryCompetenciasDto {
  @ApiPropertyOptional({ example: 1, default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @ApiPropertyOptional({ example: 10, default: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number;

  @ApiPropertyOptional({ example: 'algoritmos' })
  @IsOptional()
  @IsString()
  busqueda?: string;

  @ApiPropertyOptional({ enum: Estado })
  @IsOptional()
  @IsEnum(Estado)
  estado?: Estado;

  @ApiPropertyOptional({ enum: Nivel })
  @IsOptional()
  @IsEnum(Nivel)
  nivel_dificultad?: Nivel;

  @ApiPropertyOptional({ enum: Tipo })
  @IsOptional()
  @IsEnum(Tipo)
  tipo?: Tipo;
}
