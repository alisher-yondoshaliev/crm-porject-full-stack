import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api/v1');

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  const config = new DocumentBuilder()
    .setTitle('CRM API')
    .addServer('http://localhost:3001', 'Local environment')
    .addServer('http://207.154.218.70', 'Production environment')
    .setDescription('This is API documentation for the CRM project')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('Auth qismi', 'Kirish va ro\'yxatdan o\'tish tizimi')
    .addTag('Courses', 'Kurslar bilan ishlash')
    .build();

  const document = SwaggerModule.createDocument(app, config, {
    operationIdFactory: (controllerKey: string, methodKey: string) => methodKey,
  });

  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
