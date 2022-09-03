import { ValidationPipe, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

/**
 * We're creating a new NestJS application, configuring validation pipes, creating a swagger document,
 * and telling the app to listen on port 3000
 */
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  /* Enabling versioning for the API. */
  app.enableVersioning({
    type: VersioningType.URI,
  });
  /* Configuring validation pipes */
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );
  /* Creating a swagger document. */
  const config = new DocumentBuilder()
    .setTitle('Easy Story API')
    .setDescription('The cats API description')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);
  /* Telling the app to listen on port 3000. */
  await app.listen(3000);
}
bootstrap();
