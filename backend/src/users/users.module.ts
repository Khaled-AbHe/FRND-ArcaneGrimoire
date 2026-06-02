import { forwardRef, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UsersController } from './controllers/users/users.controller';
import { UsersService } from './services/users/users.service';
import { AuthService } from './services/auth/auth.service';
import { AuthentificationController } from './controllers/authentification/authentification.controller';
import { SpellsModule } from '../spells/spells.module';
import { JwtStrategy } from '../currentUser/strategies/jwt.strategy';

@Module({
  imports: [
    forwardRef(() => SpellsModule),
    PassportModule,
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: process.env.JWT_SECRET ?? 'fallback-secret',
        signOptions: { expiresIn: '7d' },
      }),
    }),
  ],
  controllers: [UsersController, AuthentificationController],
  providers: [UsersService, AuthService, JwtStrategy],
  exports: [UsersService],
})
export class UsersModule {}
