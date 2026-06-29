import {
  IsEnum,
  IsOptional,
  IsBoolean,
  IsNumber,
  Min,
  Max,
  IsString,
  IsArray,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { EstadoSolucion } from '../../../database/entities/solucion.entity';

export class UpdateSolucionEstadoDto {
  @ApiProperty({ enum: EstadoSolucion, example: EstadoSolucion.REVISADO })
  @IsEnum(EstadoSolucion)
  estado!: EstadoSolucion;

  @ApiProperty({ example: true, required: false, default: false })
  @IsOptional()
  @IsBoolean()
  resultado_validacion?: boolean;

  @ApiProperty({ example: 82, required: false, minimum: 0, maximum: 100 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  puntaje_total?: number;

  @ApiProperty({ example: 0.86, required: false, minimum: 0, maximum: 1 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(1)
  confianza_ia?: number;

  @ApiProperty({ example: 'La solución cumple el objetivo principal.', required: false })
  @IsOptional()
  @IsString()
  justificacion_ia?: string;

  @ApiProperty({ required: false, type: Array })
  @IsOptional()
  @IsArray()
  criterios_evaluacion?: unknown[];
}
