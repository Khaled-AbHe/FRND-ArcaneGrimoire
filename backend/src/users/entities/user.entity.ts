import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Exclude } from 'class-transformer';
import { UserType } from '../enums/users.enum';
import { Character } from '../../characters/entity/character.entity';
import { Spell } from '../../spells/entity/spell.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  userId: number;

  @Column()
  userType: UserType;

  @Column()
  username: string;

  @Column()
  email: string;

  @Exclude()
  @Column()
  password: string;

  // Links

  @OneToMany(() => Character, (char) => char.user)
  characters: Character[];

  @OneToMany(() => Spell, (spell) => spell.user)
  spells: Spell[];

  // User settings

  @Column()
  enableHighMagic: boolean;

  @Column()
  darkMode: boolean;
}
