import {
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { DRIZZLE } from '../../../db/db.module';
import type { DrizzleClient } from '../../../db/index';
import { users, User } from '../../../db/schema';
import { UserType } from '../../enums/users.enum';

@Injectable()
export class UsersService {
  constructor(@Inject(DRIZZLE) private db: DrizzleClient) {}

  async createUser(data: {
    userType: UserType;
    username: string;
    email: string;
    password: string;
  }): Promise<User> {
    const result = await this.db
      .insert(users)
      .values({ ...data, enableHighMagic: false, darkMode: true })
      .returning();
    return result[0];
  }

  async updateUser(
    currentUser: User,
    targetUserId: number,
    attrs: Partial<User>,
  ): Promise<User> {
    this.canManipulate(currentUser, targetUserId);
    const result = await this.db
      .update(users)
      .set(attrs)
      .where(eq(users.userId, targetUserId))
      .returning();
    return result[0];
  }

  async deleteUserById(currentUser: User, targetUserId: number): Promise<void> {
    this.canManipulate(currentUser, targetUserId);
    await this.db.delete(users).where(eq(users.userId, targetUserId));
  }

  async findAllUsers(): Promise<User[]> {
    return await this.db.select().from(users);
  }

  async findUserById(userId: number): Promise<User> {
    const result = await this.db
      .select()
      .from(users)
      .where(eq(users.userId, userId));
    if (!result[0]) {
      throw new NotFoundException("User doesn't exist.");
    }
    return result[0];
  }

  async findUserByEmail(email: string): Promise<User | null> {
    const result = await this.db
      .select()
      .from(users)
      .where(eq(users.email, email));
    return result[0] ?? null;
  }

  async findOneUser(userId: number): Promise<User | null> {
    const result = await this.db
      .select()
      .from(users)
      .where(eq(users.userId, userId));
    return result[0] ?? null;
  }

  canManipulate(user: User, userId: number): true {
    if (user.userId !== userId && user.userType !== UserType.ADMIN) {
      throw new ForbiddenException("You can't manipulate this account.");
    }
    return true;
  }
}
