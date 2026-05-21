import { IsInt, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class JoinGrupoDto {
  @ApiProperty({ example: 1, description: 'ID del grupo al que desea unirse' })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  grupo_id!: number;
}