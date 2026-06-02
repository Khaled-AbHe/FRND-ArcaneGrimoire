import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createDrizzleClient, DrizzleClient } from './index';

export const DRIZZLE = Symbol('DRIZZLE');

@Global()
@Module({
  providers: [
    {
      provide: DRIZZLE,
      inject: [ConfigService],
      useFactory: (config: ConfigService): DrizzleClient => {
        const url = config.getOrThrow<string>('TURSO_DATABASE_URL');
        const authToken = config.getOrThrow<string>('TURSO_AUTH_TOKEN');
        return createDrizzleClient(url, authToken);
      },
    },
  ],
  exports: [DRIZZLE],
})
export class DbModule {}
