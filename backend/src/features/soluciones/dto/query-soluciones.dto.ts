import { Type } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  EstadoSolucion,
  Lenguaje,
} from '../../../database/entities/solucion.entity';

export class QuerySolucionesDto {
  @ApiPropertyOptional({ example: 1 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ example: 10 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 10;

  @ApiPropertyOptional({ enum: EstadoSolucion })
  @IsOptional()
  @IsEnum(EstadoSolucion)
  estado?: EstadoSolucion;

  @ApiPropertyOptional({ example: 1 })
  @Type(() => Number)
  @IsOptional()
  @IsInt()
  problema_id?: number;

  @ApiPropertyOptional({ example: 1 })
  @Type(() => Number)
  @IsOptional()
  @IsInt()
  competencia_id?: number;

  @ApiPropertyOptional({ enum: Lenguaje })
  @IsOptional()
  @IsEnum(Lenguaje)
  lenguaje_programacion?: Lenguaje;

  @ApiPropertyOptional({ example: 'juanp' })
  @IsOptional()
  @IsString()
  search?: string;
}
