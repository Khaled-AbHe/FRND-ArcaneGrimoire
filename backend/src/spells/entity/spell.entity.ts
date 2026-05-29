import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  ManyToOne,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { MagicSchool } from '../enums/magic-school.enum';
import { SpellLevel } from '../enums/spell-level.enum';

@Entity('spells')
export class Spell {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ default: SpellLevel.One })
  level: SpellLevel;

  @Column({ nullable: true })
  school: MagicSchool;

  @Column({ nullable: true })
  castTime: string;

  @Column({ nullable: true })
  range: string;

  @Column({ nullable: true })
  duration: string;

  @Column({ default: false })
  concentration: boolean;

  @Column({ default: false })
  ritual: boolean;

  // { verbal: boolean; somatic: boolean; material?: string }
  @Column({ type: 'simple-json', default: '{"verbal":false,"somatic":false}' })
  components: object;

  // | { kind: 'attack'; attackType: AttackType; critRange?: number }
  // | { kind: 'save';   saveAbility: SaveAbility }
  // | { kind: 'utility' }
  @Column({ type: 'simple-json', default: '{"kind":"utility"}' })
  spellType: object;

  // | { kind: 'leveled'; dice: DiceEntry[]; projectiles?: Projectiles; upcast?: { dice: UpcastEntry[] } }
  // | { kind: 'cantrip'; dice: DiceEntry[]; scaling: ScalingThreshold[] }
  // | { kind: 'utility' }
  @Column({ type: 'simple-json', default: '{"kind":"utility"}' })
  outputType: object;

  @Column({ nullable: true, type: 'text' })
  notes: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  ///////////////////

  @ManyToOne(() => User, (user) => user.spells)
  user: User;
}
