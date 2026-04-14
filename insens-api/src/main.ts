import 'reflect-metadata';
import { NestFactory }   from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule }               from './app.module';
import { globalValidationPipe }    from './core/pipes/validation.pipe';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({ logger: true }),
    {
      logger:['log', 'error', 'warn', 'debug', 'verbose' ]
    }
  );

  const config = app.get(ConfigService);
  const port   = config.get<number>('app.port', 3000);
  const origins = config.get<string[]>('app.corsOrigins', []);

  // ── CORS ───────────────────────────────────────────────────────────────────
  app.enableCors({
    origin:      origins.length ? origins : '*',
    credentials: true,
  });

  // ── Global prefix ──────────────────────────────────────────────────────────
  app.setGlobalPrefix('api/v1');

  // ── Validation ─────────────────────────────────────────────────────────────
  app.useGlobalPipes(globalValidationPipe);

  // ── Swagger / OpenAPI ──────────────────────────────────────────────────────
  if (config.get<string>('app.nodeEnv') !== 'production') {
    const swaggerConfig = new DocumentBuilder()
      .setTitle('Insens API')
      .setDescription('Insens Perfume Marketplace — REST API v1')
      .setVersion('1.0')
      .addBearerAuth()
      .build();

    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('api/docs', app, document);

    console.log(`📖 Swagger UI available at http://localhost:${port}/api/docs`);
  }

  await app.listen(port, '0.0.0.0');
  console.log(`🚀 Insens API running on http://localhost:${port}/api/v1`);
}

bootstrap();
