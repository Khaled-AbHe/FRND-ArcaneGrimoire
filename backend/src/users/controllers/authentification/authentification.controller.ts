import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import type { Response } from 'express';
import { CurrentUser } from '../../../currentUser/decorators/current-user.decorator';
import { AuthGuard } from '../../../currentUser/guards/auth.guard';
import { ChangePasswordDto } from '../../dtos/change-password.dto';
import { CreateUserDto } from '../../dtos/create-user.dto';
import { SignInUserDto } from '../../dtos/signin-user.dto';
import type { User } from '../../../db/schema';
import { AuthService } from '../../services/auth/auth.service';

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: (process.env.NODE_ENV === 'production' ? 'none' : 'lax') as 'none' | 'lax',
  maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
};

@Controller('auth')
export class AuthentificationController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  async signUp(
    @Body() body: CreateUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const user = await this.authService.signUp(body);
    res.cookie('token', this.authService.createToken(user), COOKIE_OPTIONS);
    return user;
  }

  @Post('/signupadmin')
  async signUpAdmin(
    @Body() body: CreateUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const user = await this.authService.signUpAdmin(body);
    res.cookie('token', this.authService.createToken(user), COOKIE_OPTIONS);
    return user;
  }

  @Post('/signin')
  async signIn(
    @Body() body: SignInUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const user = await this.authService.signIn(body.email, body.password);
    res.cookie('token', this.authService.createToken(user), COOKIE_OPTIONS);
    return user;
  }

  @UseGuards(AuthGuard)
  @Post('/signout')
  signOut(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('token', COOKIE_OPTIONS);
    return { message: 'Signed out' };
  }

  @UseGuards(AuthGuard)
  @Get('/whoami')
  whoAmI(@CurrentUser() user: User) {
    return user;
  }

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