import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';

export class SugerirCalificacionDto {
  @ApiPropertyOptional({
    example:
      'Considerá que el problema pide validar entrada con dos enteros positivos.',
    description:
      'Instrucciones o contexto adicional que el admin quiere que la IA tenga en cuenta al evaluar.',
    maxLength: 1000,
  })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  instrucciones_extra?: string;
}
