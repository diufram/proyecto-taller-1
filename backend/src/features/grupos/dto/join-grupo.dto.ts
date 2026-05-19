import { IsInt, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class JoinGrupoDto {
  @ApiProperty({ example: 1, description: 'ID del grupo al que desea unirse' })
  @IsInt()
  @Min(1)
  grupo_id!: number;
}