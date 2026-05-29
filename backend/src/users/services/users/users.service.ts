import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { User } from '../../entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserType } from '../../enums/users.enum';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private userRepo: Repository<User>) {}

  async createUser(data: {
    userType: UserType;
    username: string;
    email: string;
    password: string;
  }) {
    return await this.userRepo.save(
      this.userRepo.create({ ...data, enableHighMagic: false, darkMode: true }),
    );
  }

  async updateUser(
    currentUser: User,
    targetUserId: number,
    attrs: Partial<User>,
  ) {
    if (this.canManipulate(currentUser, targetUserId)) {
      const user = await this.findUserById(targetUserId);
      Object.assign(user, attrs);
      return await this.userRepo.save(user);
    }
  }

  async deleteUserById(currentUser: User, targetUserId: number) {
    if (this.canManipulate(currentUser, targetUserId)) {
      await this.userRepo.remove(await this.findUserById(targetUserId));
    }
  }

  async findAllUsers() {
    return await this.userRepo.find();
  }

  async findUserById(userId: number) {
    const user = await this.userRepo.findOneBy({ userId });
    if (!user) {
      throw new NotFoundException("User doesn't exist.");
    }
    return user;
  }

  async findUserByEmail(email: string) {
    return await this.userRepo.findOneBy({ email });
  }

  // Used for current user logic
  async findOneUser(userId: number) {
    return await this.userRepo.findOneBy({ userId });
  }

  canManipulate(user: User, userId: number) {
    if (user.userId !== userId && user.userType !== UserType.ADMIN) {
      throw new ForbiddenException("You can't manipulate this account.");
    }
    return true;
  }
}
