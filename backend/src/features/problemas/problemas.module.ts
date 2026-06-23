import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AiModule } from '../../core/ai/ai.module';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Problema } from '../../database/entities/problema.entity';
import { Competencia } from '../../database/entities/competencia.entity';
import { ProblemasController } from './controllers/problemas.controller';
import { ProblemasService } from './services/problemas.service';
import { ProblemasAiService } from './services/problemas-ai.service';
import { ProblemasRepository } from './repositories/problemas.repository';

@Module({
  imports: [AiModule, TypeOrmModule.forFeature([Problema, Competencia])],
  controllers: [ProblemasController],
  providers: [
    ProblemasService,
    ProblemasAiService,
    ProblemasRepository,
    JwtAuthGuard,
    RolesGuard,
  ],
})
export class ProblemasModule {}
