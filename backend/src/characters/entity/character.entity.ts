import { User } from '../../users/entities/user.entity';
import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  ManyToOne,
} from 'typeorm';

@Entity('characters')
export class Character {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'simple-json', default: '[]' })
  levels: object[];

  @Column({ type: 'simple-json', default: '[]' })
  prepared: number[];

  @Column({ type: 'simple-json', default: '{}' })
  pact: object;

  @Column({ type: 'simple-json', default: '{}' })
  globals: object;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  ///////////////////

  @ManyToOne(() => User, (user) => user.characters)
  user: User;
}
