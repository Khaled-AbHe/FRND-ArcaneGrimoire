import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CurrentUser } from '../../../currentUser/decorators/current-user.decorator';
import { AuthGuard } from '@nestjs/passport';
import { ChangePasswordDto } from '../../dtos/change-password.dto';
import { CreateUserDto } from '../../dtos/create-user.dto';
import { SignInUserDto } from '../../dtos/signin-user.dto';
import type { User } from '../../../db/schema';
import { AuthService } from '../../services/auth/auth.service';

@Controller('auth')
export class AuthentificationController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  signUp(@Body() body: CreateUserDto) {
    return this.authService.signUp(body);
  }

  @Post('/signupadmin')
  signUpAdmin(@Body() body: CreateUserDto) {
    return this.authService.signUpAdmin(body);
  }

  @Post('/signin')
  signIn(@Body() body: SignInUserDto) {
    return this.authService.signIn(body.email, body.password);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('/signout')
  signOut() {
    // JWT is stateless — client discards the token
    return { message: 'Signed out' };
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/whoami')
  whoAmI(@CurrentUser() user: User) {
    return user;
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('/:id/changePassword')
  changePassword(
    @CurrentUser() user: User,
    @Param('id', ParseIntPipe) userId: number,
    @Body() body: ChangePasswordDto,
  ) {
    return this.authService.changePassword(user, userId, body.password);
  }
}
