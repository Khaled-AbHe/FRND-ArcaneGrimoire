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

  return server;
}

// Serverless handler for Vercel
let appPromise: Promise<express.Express>;

export default async function handler(req: any, res: any) {
  if (!appPromise) appPromise = bootstrap();
  const app = await appPromise;
  app(req, res);
}

// Local dev — only runs when executed directly (not imported by Vercel)
if (require.main === module) {
  bootstrap().then((app) => {
    const port = process.env.PORT ?? 3001;
    app.listen(port, () => {
      console.log(
        `Spell Slot Manager API running on http://localhost:${port}/api`,
      );
    });
  });
}
