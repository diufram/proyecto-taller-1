import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString, Min } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Dificultad } from '../../../database/entities/problema.entity';

export class QueryProblemasDto {
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

  @ApiPropertyOptional({
    example: 'suma',
    description: 'Busca por titulo o descripcion (case insensitive)',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ enum: Dificultad, example: Dificultad.FACIL })
  @IsOptional()
  @IsEnum(Dificultad)
  dificultad?: Dificultad;
}
