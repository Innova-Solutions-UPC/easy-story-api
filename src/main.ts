import { ValidationPipe, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import helmet from 'helmet';
import { AppModule } from './app.module';

/**
 * We're creating a new NestJS application, configuring validation pipes, creating a swagger document,
 * and telling the app to listen on port 3000
 */
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  /* Apply helmet middlewares */
  app.use(helmet());
  /* Enabling versioning for the API. */
  app.enableVersioning({
    type: VersioningType.URI,
  });
  /* Enabling CORS for the application. */
  app.enableCors({
    origin: ['http://127.0.0.1:5173', 'https://master.d15cj9b33gfb5p.amplifyapp.com', 'https://master.d1h1qx0ccllowj.amplifyapp.com'],
    methods: 'GET,HEAD,PATCH,POST,DELETE,OPTIONS',
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
    .setTitle('Easy Story REST API')
    .setDescription('REST API made with NestJS')
    .setVersion('1.0')
    .setContact('Marco Manrique Acha', 'https://github.com/MarcoMnrq/', '')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);
  /* Telling the app to listen on port 3000. */
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
