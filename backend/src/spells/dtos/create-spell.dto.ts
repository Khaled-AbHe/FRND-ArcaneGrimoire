import {
  IsBoolean,
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { SpellLevel } from '../enums/spell-level.enum';
import { MagicSchool } from '../enums/magic-school.enum';
import { ComponentsDto } from './components.dto';
import { SpellTypeDto } from './spell-type.dto';
import { OutputTypeDto } from './output-type.dto';

export class CreateSpellDto {
  @IsString()
  @MinLength(1)
  @MaxLength(128)
  name: string;

  @IsOptional()
  @IsEnum(SpellLevel)
  level?: SpellLevel;

  @IsOptional()
  @IsEnum(MagicSchool)
  school?: MagicSchool;

  @IsOptional()
  @IsString()
  castTime?: string;

  @IsOptional()
  @IsString()
  range?: string;

  @IsOptional()
  @IsString()
  duration?: string;

  @IsOptional()
  @IsBoolean()
  concentration?: boolean;

  @IsOptional()
  @IsBoolean()
  ritual?: boolean;

  @IsOptional()
  @ValidateNested()
  @Type(() => ComponentsDto)
  components?: ComponentsDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => SpellTypeDto)
  spellType?: SpellTypeDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => OutputTypeDto)
  outputType?: OutputTypeDto;

  @IsOptional()
  @IsString()
  @MaxLength(4000)
  notes?: string;
}
