// soft-auth.guard.ts
import { Injectable } from '@nestjs/common';
import { AuthGuard as PassportAuthGuard } from '@nestjs/passport';

@Injectable()
export class SoftAuthGuard extends PassportAuthGuard('jwt') {
  // Override handleRequest so it never throws a 401 error
  handleRequest(err, user, info) {
    if (err || !user) {
      return null;
    }
    return user;
  }
}
