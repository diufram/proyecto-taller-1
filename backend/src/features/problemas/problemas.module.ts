import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Problema } from '@entities/problema.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Problema])],
  controllers: [],
  providers: [JwtAuthGuard, RolesGuard],
})
export class ProblemasModule {}
