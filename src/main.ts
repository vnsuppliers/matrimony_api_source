import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DataSource } from 'typeorm';
import * as express from 'express';
import { join } from 'path';

// ADD THESE IMPORTS (Swagger)
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use('/uploads', express.static(join(process.cwd(), 'uploads')));

  // React whitelist
  app.enableCors({
    origin: [
      // Users dashboard
      'https://vivahajodi.appwrite.network/',
      // 'http://localhost:8080',
      // 'http://172.171.1.219:8080',

      // Admin dashboard -> nextjs
      'https://vivaha-admin-gamma.vercel.app',
      // 'http://localhost:3000',

      // Admin dashboard(Inactive)
      'http://localhost:5173',
    ],
    credentials: true,
  });

  //  whitelist validation (removes unwanted fields)
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: false,
      transform: true,
    }),
  );

  // DB connection log
  // const dataSource = app.get(DataSource);
  // if (dataSource.isInitialized) {
  //   console.log('Database connected successfully');
  // }

  // ================= SWAGGER START =================
  const config = new DocumentBuilder()
    .setTitle('Matrimony API')
    .setDescription('API documentation')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  // ================= SWAGGER END =================

  const port = process.env.PORT ?? 3001;
  await app.listen(port);
  //console.log(`Server running on http://localhost:${port}`);
}
bootstrap();
