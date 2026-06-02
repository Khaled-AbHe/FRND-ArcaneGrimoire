import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Session,
  UseGuards,
} from '@nestjs/common';
import { CurrentUser } from '../../../currentUser/decorators/current-user.decorator';
import { AuthGuard } from '../../../currentUser/guards/auth.guard';
import { ChangePasswordDto } from '../../dtos/change-password.dto';
import { CreateUserDto } from '../../dtos/create-user.dto';
import { SignInUserDto } from '../../dtos/signin-user.dto';
import type { User } from '../../../db/schema';
import { AuthService } from '../../services/auth/auth.service';

@Controller('auth')
export class AuthentificationController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  async signUp(@Body() body: CreateUserDto, @Session() session: any) {
    const user = await this.authService.signUp(body);
    session.userId = user.userId;
    return user;
  }

  @Post('/signupadmin')
  signUpAdmin(@Body() body: CreateUserDto) {
    return this.authService.signUpAdmin(body);
  }

  @Post('/signin')
  async signIn(@Body() body: SignInUserDto, @Session() session: any) {
    const user = await this.authService.signIn(body.email, body.password);
    session.userId = user.userId;
    return user;
  }

  @UseGuards(AuthGuard)
  @Post('/signout')
  signOut(@Session() session: any) {
    session.userId = null;
  }

  @UseGuards(AuthGuard)
  @Get('/whoami')
  whoAmI(@CurrentUser() user: User) {
    return user;
  }

  // Password travels in the request body, never in the URL
  @UseGuards(AuthGuard)
  @Patch('/:id/changePassword')
  changePassword(
    @CurrentUser() user: User,
    @Param('id', ParseIntPipe) userId: number,
    @Body() body: ChangePasswordDto,
  ) {
    return this.authService.changePassword(user, userId, body.password);
  }
}
