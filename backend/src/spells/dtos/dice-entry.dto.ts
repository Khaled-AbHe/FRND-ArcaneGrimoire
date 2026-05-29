import { IsBoolean, IsEnum, IsInt, IsOptional, Min } from 'class-validator';
import { DiceType } from '../enums/dice-type.enum';
import { OutputType } from '../enums/output-type.enum';

export class DiceEntryDto {
  @IsInt()
  @Min(0)
  count: number;

  @IsEnum(DiceType)
  die: DiceType;

  @IsEnum(OutputType)
  type: OutputType;

  @IsOptional()
  @IsBoolean()
  addCastingMod?: boolean;

  @IsOptional()
  @IsInt()
  flatBonus?: number;
}
