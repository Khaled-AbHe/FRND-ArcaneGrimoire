import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CharactersModule } from './characters/characters.module';
import { CurrentUserMiddleware } from './currentUser/middlewares/current-user.middleware';
import { SpellsModule } from './spells/spells.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'spellslot.sqlite',
      autoLoadEntities: true,
      synchronize: true, // Usually, you keep this at False so you dont mess with an established database
      dropSchema: false, // This clears the db each time you run it if set to 'true'. !!!! RUNNING YOUR PROGAM WITH 'npm run start:dev' IS NOT RECOMMENDED WITH THIS ON!!!
    }),
    UsersModule,
    SpellsModule,
    CharactersModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CurrentUserMiddleware).forRoutes('*');
  }
}
