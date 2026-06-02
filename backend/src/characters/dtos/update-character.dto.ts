import { Type } from 'class-transformer';
import {
  IsArray,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { GlobalsDto } from './globals.dto';
import { LevelDto } from './level.dto';
import { PactDto } from './pact.dto';

/**
 * All fields are optional on update.
 * The frontend debounces auto-saves and sends only changed fields.
 * PartialType re-applies all validators from CreateCharacterDto
 * while marking every property @IsOptional().
 */
export class UpdateCharacterDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(64)
  name: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => LevelDto)
  levels?: LevelDto[];

  @IsOptional()
  @IsArray()
  prepared?: number[];

  @IsOptional()
  @ValidateNested()
  @Type(() => PactDto)
  pact?: PactDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => GlobalsDto)
  globals?: GlobalsDto;
}
