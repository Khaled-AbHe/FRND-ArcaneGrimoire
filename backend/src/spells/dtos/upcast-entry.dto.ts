import { IsEnum, IsInt, IsOptional, Max, Min } from 'class-validator';
import { DiceType } from '../enums/dice-type.enum';
import { OutputType } from '../enums/output-type.enum';

export class UpcastEntryDto {
  @IsInt()
  @Min(0)
  count: number;

  @IsEnum(DiceType)
  die: DiceType;

  @IsEnum(OutputType)
  type: OutputType;

  @IsInt()
  @Min(1)
  everyNLevels: number;

  @IsInt()
  @Min(1)
  @Max(12)
  aboveLevel: number;

  @IsOptional()
  @IsInt()
  flatBonus?: number;
}
