import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AiModule } from '../../core/ai/ai.module';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Solucion } from '../../database/entities/solucion.entity';
import { Problema } from '../../database/entities/problema.entity';
import { Inscripcion } from '../../database/entities/inscripcion.entity';
import { Usuario } from '../../database/entities/usuario.entity';
import { SolucionesController } from './controllers/soluciones.controller';
import { SolucionesService } from './services/soluciones.service';
import { SolucionesRepository } from './repositories/soluciones.repository';
import { SolucionesAiService } from './services/soluciones-ai.service';

@Module({
  imports: [
    AiModule,
    TypeOrmModule.forFeature([Solucion, Problema, Inscripcion, Usuario]),
  ],
  controllers: [SolucionesController],
  providers: [
    SolucionesService,
    SolucionesRepository,
    SolucionesAiService,
    JwtAuthGuard,
    RolesGuard,
  ],
})
export class SolucionesModule {}
