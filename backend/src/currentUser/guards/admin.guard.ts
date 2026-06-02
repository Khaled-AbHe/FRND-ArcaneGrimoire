import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { UserType } from '../../users/enums/users.enum';

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    return req.user?.userType === UserType.ADMIN;
  }
}
