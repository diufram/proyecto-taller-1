import { IsInt, Min, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateGrupoDto {
  @ApiProperty({ example: 1, description: 'ID de la competencia' })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  competencia_id!: number;

  @ApiProperty({ example: 'Los Magníficos', description: 'Nombre del grupo' })
  @IsString()
  nombre!: string;
}