/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { API_CORS, API_PORT } from './app/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  console.log( 'API_CORS', API_CORS )
  const app = await NestFactory.create( AppModule, {
    cors: API_CORS,
    bufferLogs: true,
  } )
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);

  const config = new DocumentBuilder()
    .setTitle( 'rka-DOC backend' )
    .setDescription(
      'API для работы с документами (хранение, создание, согласование)',
    )
    .setVersion( '1.0' )
    .build()
  const document = SwaggerModule.createDocument( app, config )
  SwaggerModule.setup( globalPrefix, app, document )

  await app.listen( API_PORT )


  Logger.log(
    `🚀 Application is running on: http://localhost:${API_PORT}/${globalPrefix}`
  );
}

bootstrap();
