import {
  IsArray,
  IsIn,
  IsOptional,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { DiceEntryDto } from './dice-entry.dto';
import { ProjectilesDto } from './projectiles.dto';
import { ScalingThresholdDto } from './scaling-threshold.dto';
import { UpcastEntryDto } from './upcast-entry.dto';

class UpcastDto {
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpcastEntryDto)
  dice?: UpcastEntryDto[];
}

export class OutputTypeDto {
  @IsIn(['leveled', 'cantrip', 'utility'])
  kind: 'leveled' | 'cantrip' | 'utility';

  /** Required for leveled and cantrip */
  @ValidateIf((o) => o.kind !== 'utility')
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DiceEntryDto)
  dice?: DiceEntryDto[];

  /** Only for leveled */
  @ValidateIf((o) => o.kind === 'leveled')
  @IsOptional()
  @ValidateNested()
  @Type(() => ProjectilesDto)
  projectiles?: ProjectilesDto;

  /** Only for leveled */
  @ValidateIf((o) => o.kind === 'leveled')
  @IsOptional()
  @ValidateNested()
  @Type(() => UpcastDto)
  upcast?: UpcastDto;

  /** Required for cantrip */
  @ValidateIf((o) => o.kind === 'cantrip')
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ScalingThresholdDto)
  scaling?: ScalingThresholdDto[];
}
