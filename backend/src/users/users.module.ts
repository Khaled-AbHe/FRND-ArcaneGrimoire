import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './controllers/users/users.controller';
import { UsersService } from './services/users/users.service';
import { User } from './entities/user.entity';
import { AuthService } from './services/auth/auth.service';
import { AuthentificationController } from './controllers/authentification/authentification.controller';
import { SpellsModule } from '../spells/spells.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    forwardRef(() => SpellsModule), // breaks the circular dep with SpellsModule
  ],
  controllers: [UsersController, AuthentificationController],
  providers: [UsersService, AuthService],
  exports: [UsersService],
})
export class UsersModule {}
