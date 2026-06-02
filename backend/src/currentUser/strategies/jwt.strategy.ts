import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from '../../users/services/users/users.service';
import { Request } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private usersService: UsersService) {
    super({
      // Read JWT from the httpOnly cookie instead of the Authorization header
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => req?.cookies?.token ?? null,
      ]),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET ?? 'fallback-secret',
    });
  }

  async validate(payload: { sub: number }) {
    return this.usersService.findOneUser(payload.sub);
  }
}
