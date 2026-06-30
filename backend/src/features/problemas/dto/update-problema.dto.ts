import { PartialType } from '@nestjs/swagger';
import { CreateProblemaDto } from './create-problema.dto';

export class UpdateProblemaDto extends PartialType(CreateProblemaDto) {}
