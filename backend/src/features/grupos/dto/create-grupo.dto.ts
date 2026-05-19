import { IsInt, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateGrupoDto {
  @ApiProperty({ example: 1, description: 'ID de la competencia' })
  @IsInt()
  @Min(1)
  competencia_id!: number;

  @ApiProperty({ example: 'Los Magníficos', description: 'Nombre del grupo' })
  nombre!: string;
}