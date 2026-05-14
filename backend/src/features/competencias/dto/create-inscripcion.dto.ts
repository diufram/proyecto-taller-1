import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min } from 'class-validator';

export class CreateInscripcionDto {
  @ApiProperty({ example: 1, description: 'ID de la competencia' })
  @IsInt()
  @Min(1)
  competencia_id!: number;
}
