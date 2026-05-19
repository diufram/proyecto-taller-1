import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './features/auth/auth.module';
import { CompetenciasModule } from './features/competencias/competencias.module';
import { ProfileModule } from './features/profile/profile.module';
import { GruposModule } from './features/grupos/grupos.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    AuthModule,
    CompetenciasModule,
    ProfileModule,
    GruposModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
