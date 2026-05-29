import {
  IsEnum,
  IsIn,
  IsInt,
  IsOptional,
  Max,
  Min,
  ValidateIf,
} from 'class-validator';
import { AttackType } from '../enums/attack-type.enum';
import { SaveAbility } from '../enums/save-ability.enum';

export class SpellTypeDto {
  @IsIn(['attack', 'save', 'utility'])
  kind: 'attack' | 'save' | 'utility';

  /** Required when kind === 'attack' */
  @ValidateIf((o) => o.kind === 'attack')
  @IsEnum(AttackType)
  attackType?: AttackType;

  /** Optional crit range override when kind === 'attack' */
  @ValidateIf((o) => o.kind === 'attack')
  @IsOptional()
  @IsInt()
  @Min(2)
  @Max(20)
  critRange?: number;

  /** Required when kind === 'save' */
  @ValidateIf((o) => o.kind === 'save')
  @IsEnum(SaveAbility)
  saveAbility?: SaveAbility;
}
