import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { PresetSpellsService } from '../../../spells/service/preset-spells.service';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';
import { CreateUserDto } from '../../dtos/create-user.dto';
import { UserType } from '../../enums/users.enum';
import { User } from '../../../db/schema';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private presetSpellsService: PresetSpellsService,
  ) {}

  async signUp(dto: CreateUserDto): Promise<User> {
    const existing = await this.usersService.findUserByEmail(dto.email);
    if (existing) throw new BadRequestException('Email already taken');

    const password = await this.encrypt(dto.password);
    const user = await this.usersService.createUser({
      userType: UserType.BASE,
      username: dto.username,
      email: dto.email,
      password,
    });

    await this.presetSpellsService.seedForNewUser(user);
    return user;
  }

  async signUpAdmin(dto: CreateUserDto): Promise<User> {
    const existing = await this.usersService.findUserByEmail(dto.email);
    if (existing) throw new BadRequestException('Email already taken');

    const password = await this.encrypt(dto.password);
    const user = await this.usersService.createUser({
      userType: UserType.ADMIN,
      username: dto.username,
      email: dto.email,
      password,
    });

    await this.presetSpellsService.seedForNewUser(user);
    return user;
  }

  async signIn(email: string, password: string): Promise<User> {
    const user = await this.usersService.findUserByEmail(email);
    if (!user) throw new NotFoundException('User not found');

    const [salt, storedHash] = user.password.split('.');
    const hash = (await scrypt(password, salt, 32)) as Buffer;
    if (hash.toString('hex') !== storedHash) {
      throw new BadRequestException('Incorrect Password');
    }

    return user;
  }

  async changePassword(
    currentUser: User,
    userId: number,
    password: string,
  ): Promise<User> {
    const encryptedPassword = await this.encrypt(password);
    return await this.usersService.updateUser(currentUser, userId, {
      password: encryptedPassword,
    });
  }

  async encrypt(password: string): Promise<string> {
    const salt = randomBytes(8).toString('hex');
    const hash = (await scrypt(password, salt, 32)) as Buffer;
    return salt + '.' + hash.toString('hex');
  }
}
