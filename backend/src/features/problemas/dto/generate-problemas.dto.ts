import { Type } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Dificultad } from '../../../database/entities/problema.entity';

export class GenerateProblemasDto {
  @ApiProperty({
    example: 'Genera problemas de arrays y strings para principiantes',
  })
  @IsString()
  @IsNotEmpty()
  prompt!: string;

  @ApiPropertyOptional({ example: 3, minimum: 1, maximum: 5 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(5)
  cantidad?: number = 3;

  @ApiPropertyOptional({ enum: Dificultad, example: Dificultad.FACIL })
  @IsOptional()
  @IsEnum(Dificultad)
  dificultad?: Dificultad;

  @ApiPropertyOptional({ example: 'arrays y strings' })
  @IsOptional()
  @IsString()
  tema?: string;

  @ApiPropertyOptional({ example: 'principiante' })
  @IsOptional()
  @IsString()
  nivel?: string;
}
