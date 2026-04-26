import { PartialType } from '@nestjs/swagger';
import { CreateCompetenciaDto } from './create-competencia.dto';

export class UpdateCompetenciaDto extends PartialType(CreateCompetenciaDto) {}
