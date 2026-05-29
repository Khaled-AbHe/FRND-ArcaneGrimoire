import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

const cookieSession = require('cookie-session');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(
    cookieSession({
      keys: ['mySecretKey'], // Usually the key comes from a seperate file, not hard coded
    }),
  );

  app.enableCors({ origin: 'http://localhost:5173' });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // this gets rid of what isnt in the object parameter
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.setGlobalPrefix('api');

  await app.listen(process.env.PORT ?? 3001);
  console.log('Spell Slot Manager API running on http://localhost:3001/api');
}
bootstrap();
