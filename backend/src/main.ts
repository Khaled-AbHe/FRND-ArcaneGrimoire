import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';
import cookieParser from 'cookie-parser';

const server = express();

let isReady = false;
const readyPromise: Promise<void> = (async () => {
  const app = await NestFactory.create(AppModule, new ExpressAdapter(server));

  app.use(cookieParser());

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
  isReady = true;
})();

// Vercel serverless handler — waits for bootstrap before handling requests
export default async function handler(req: any, res: any) {
  if (!isReady) await readyPromise;
  server(req, res);
}

// Local dev
if (require.main === module) {
  readyPromise.then(() => {
    const port = process.env.PORT ?? 3001;
    server.listen(port, () => {
      console.log(
        `Spell Slot Manager API running on http://localhost:${port}/api`,
      );
    });
  });
}
