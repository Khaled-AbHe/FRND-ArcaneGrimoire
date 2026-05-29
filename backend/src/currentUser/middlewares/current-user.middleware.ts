import { Injectable, NestMiddleware } from '@nestjs/common';
import { UsersService } from '../../users/services/users/users.service';

@Injectable()
export class CurrentUserMiddleware implements NestMiddleware {
  constructor(private usersService: UsersService) {}

  async use(req: any, res: any, next: () => void) {
    const { userId } = req.session;
    if (!userId) {
      console.log("User doesn't exist - Middleware");
    } else {
      req.currUser = await this.usersService.findOneUser(userId);
    }
    next();
  }
}
