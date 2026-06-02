import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CharactersModule } from './characters/characters.module';
import { DbModule } from './db/db.module';
import { SpellsModule } from './spells/spells.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DbModule,
    UsersModule,
    SpellsModule,
    CharactersModule,
  ],
})
export class AppModule {}
