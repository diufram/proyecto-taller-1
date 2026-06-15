import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Usuario } from '../../database/entities/usuario.entity';
import { Solucion } from '../../database/entities/solucion.entity';
import { Inscripcion } from '../../database/entities/inscripcion.entity';
import { Persona } from '../../database/entities/persona.entity';
import { RankingController } from './ranking.controller';
import { RankingService } from './ranking.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Usuario, Solucion, Inscripcion, Persona]),
  ],
  controllers: [RankingController],
  providers: [RankingService],
})
export class RankingModule {}
