import { forwardRef, Module } from '@nestjs/common';
import { UsersController } from './controllers/users/users.controller';
import { UsersService } from './services/users/users.service';
import { AuthService } from './services/auth/auth.service';
import { AuthentificationController } from './controllers/authentification/authentification.controller';
import { SpellsModule } from '../spells/spells.module';

@Module({
  imports: [forwardRef(() => SpellsModule)],
  controllers: [UsersController, AuthentificationController],
  providers: [UsersService, AuthService],
  exports: [UsersService],
})
export class UsersModule {}
