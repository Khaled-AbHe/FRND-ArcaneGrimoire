import {
  IsString,
  IsOptional,
  IsArray,
  ValidateNested,
  MinLength,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';
import { GlobalsDto } from './globals.dto';
import { LevelDto } from './level.dto';
import { PactDto } from './pact.dto';

export class CreateCharacterDto {
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
