import { IsEnum, IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { EstadoSolucion } from '../../../database/entities/solucion.entity';

export class UpdateSolucionEstadoDto {
  @ApiProperty({ enum: EstadoSolucion, example: EstadoSolucion.CORRECTO })
  @IsEnum(EstadoSolucion)
  estado!: EstadoSolucion;

  @ApiProperty({ example: true, required: false, default: false })
  @IsOptional()
  @IsBoolean()
  resultado_validacion?: boolean;
}
