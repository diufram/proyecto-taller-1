import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Grupo } from '../../database/entities/grupo.entity';
import { Competencia } from '../../database/entities/competencia.entity';
import { Inscripcion } from '../../database/entities/inscripcion.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GruposController } from './grupos.controller';
import { GruposService } from './grupos.service';

@Module({
  imports: [TypeOrmModule.forFeature([Grupo, Competencia, Inscripcion])],
  controllers: [GruposController],
  providers: [GruposService, JwtAuthGuard],
})
export class GruposModule {}