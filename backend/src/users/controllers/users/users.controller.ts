import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Put,
  UseGuards,
} from '@nestjs/common';
import { CurrentUser } from '../../../currentUser/decorators/current-user.decorator';
import { AdminGuard } from '../../../currentUser/guards/admin.guard';
import { AuthGuard } from '../../../currentUser/guards/auth.guard';
import { Serialize } from '../../../interceptors/serialize.interceptor';
import { UpdateUserDto } from '../../dtos/update-user.dto';
import { UserDto } from '../../dtos/user.dto';
import { UsersService } from '../../services/users/users.service';
import type { User } from '../../../db/schema';

@Controller('users')
@UseGuards(AuthGuard)
export class UsersController {
  constructor(private usersService: UsersService) {}

  // Get own profile
  @Get('/me')
  getMe(@CurrentUser() currentUser: User) {
    return currentUser;
  }

  // Update own profile — no ID needed, uses session user
  @Put('/me')
  updateMe(@CurrentUser() currentUser: User, @Body() body: UpdateUserDto) {
    return this.usersService.updateUser(currentUser, currentUser.userId, body);
  }

  // Only the owner or an admin may update a user
  @Patch('/:id')
  updateUser(
    @Param('id', ParseIntPipe) userId: number,
    @Body() body: UpdateUserDto,
    @CurrentUser() currentUser: User,
  ) {
    return this.usersService.updateUser(currentUser, userId, body);
  }

  // Only the owner or an admin may delete a user
  @Delete('/:id')
  deleteUserById(
    @Param('id', ParseIntPipe) userId: number,
    @CurrentUser() currentUser: User,
  ) {
    return this.usersService.deleteUserById(currentUser, userId);
  }

  @UseGuards(AdminGuard)
  @Serialize(UserDto)
  @Get('/:id')
  findUserById(@Param('id', ParseIntPipe) userId: number) {
    return this.usersService.findUserById(userId);
  }

  @UseGuards(AdminGuard)
  @Get()
  findAllUsers() {
    return this.usersService.findAllUsers();
  }
}
