import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'debug', 'verbose'],
  });

  // ─── Global pipes ─────────────────────────────────────
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  // ─── Global filters ──────────────────────────────────
  app.useGlobalFilters(new HttpExceptionFilter());

  // ─── Global interceptors ─────────────────────────────
  app.useGlobalInterceptors(new LoggingInterceptor());

  // ─── CORS ─────────────────────────────────────────────
  app.enableCors({
    origin: process.env.CORS_ORIGIN || '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  // ─── Swagger Configuration ────────────────────────────
  const config = new DocumentBuilder()
    .setTitle('Codelave API')
    .setDescription(
      'Managed code execution infrastructure platform — ' +
        'secure isolated sandbox environments for running AI-generated code inside Docker containers.',
    )
    .setVersion('1.0.0')
    .addTag('auth', 'Authentication & API key management')
    .addTag('sandbox', 'Sandbox lifecycle management')
    .addTag('execution', 'Code execution inside sandboxes')
    .addTag('files', 'File upload/download to sandboxes')
    .addTag('usage', 'Usage tracking & limits')
    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      description: 'JWT token for dashboard routes',
    })
    .addApiKey(
      {
        type: 'apiKey',
        name: 'X-API-Key',
        in: 'header',
        description: 'API key for SDK routes',
      },
      'api-key',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      docExpansion: 'list',
      filter: true,
    },
  });

  // ─── Start server ─────────────────────────────────────
  const port = process.env.PORT ?? 3000;
  await app.listen(port);

  logger.log(`🚀 Codelave API running on: http://localhost:${port}`);
  logger.log(`📚 Swagger docs available at: http://localhost:${port}/api`);
  logger.log(`🔌 WebSocket endpoint: ws://localhost:${port}/ws/execute`);
}

bootstrap();
