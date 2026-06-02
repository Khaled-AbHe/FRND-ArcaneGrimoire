import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';

const cookieSession = require('cookie-session');

const server = express();

async function bootstrap() {
  const app = await NestFactory.create(AppModule, new ExpressAdapter(server));

  app.use(
    cookieSession({
      keys: [process.env.SESSION_SECRET ?? 'mySecretKey'],
      // Secure must be true on Vercel (HTTPS), but false for local development
      secure: process.env.NODE_ENV === 'production',
      // 'none' allows cross-site cookies between your frontend and backend domains
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    }),
  );

  app.enableCors({
    origin: process.env.CORS_ORIGIN ?? 'http://localhost:5173',
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.setGlobalPrefix('api');
  await app.init();
}

// Bootstrap immediately for Vercel's runtime environment
bootstrap();

// Export the Express server directly as the default export
export default server;
