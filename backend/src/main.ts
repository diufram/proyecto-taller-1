import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './core/filters/http-exception.filter';
import { TransformInterceptor } from './core/interceptors/transform.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalInterceptors(new TransformInterceptor());
  const configService = app.get(ConfigService);
  app.enableCors({
    origin:
      configService.get<string>('ALLOWED_ORIGIN') || 'http://localhost:4200',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  const port = configService.get<number>('PORT') || 3000;

  await app.listen(port);

  console.log(`🚀 Backend iniciado en: http://localhost:${port}`);
}
bootstrap();
