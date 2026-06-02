import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger, VersioningType } from '@nestjs/common';
import { AppModule } from './app.module';
import { RpcCustomExceptionFilter } from './common/exceptions/rpc-custom-exception.filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { PrismaClientExceptionFilter } from './database/infrastructure/prisma/filters/prisma-client-exception.filter';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');

  app.enableVersioning({
    type: VersioningType.URI, // Configura el versionamiento a través de la URL (/v1/, /v2/)
    defaultVersion: '1', // 🎯 Hace que toda la app sea 'v1' por defecto de forma automática
  });

  // 1. Filtro global de excepciones personalizadas de tu plan
  app.useGlobalFilters(new RpcCustomExceptionFilter());

  // 🔌 Necesitamos el HttpAdapterHost de NestJS para que el filtro base de errores sepa cómo responder (Express/Fastify)
  const { httpAdapter } = app.get(HttpAdapterHost);

  // 🚀 Aplicamos el filtro de Prisma de forma global
  app.useGlobalFilters(new PrismaClientExceptionFilter(httpAdapter));

  // 2. Validación global estricta para los DTOs (como PaginationDto)
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true, // 💡 Clave para que los tipos del PaginationDto se transformen solos
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Products example')
    .setDescription('The products API description')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT', // Opcional, ayuda a documentar el formato
        name: 'JWT',
        description: 'Ingrese su token JWT sin la palabra Bearer',
        in: 'header',
      },
      'JWT-auth', // 🆔 Este es el nombre clave para asociar el esquema con los controladores
    )
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, documentFactory);

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  logger.log(`Application is running on: http://localhost:${port}`);
}
void bootstrap();
