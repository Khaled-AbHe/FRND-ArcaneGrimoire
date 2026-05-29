import { IsInt, IsOptional, Max, Min } from 'class-validator';

/**
 * Each threshold must define diceCount OR projCount — never both, never neither.
 * class-validator can't express XOR natively, so we validate this in the
 * parent DTO or service. Both fields are optional here to allow the union.
 */
export class ScalingThresholdDto {
  @IsInt()
  @Min(1)
  @Max(30)
  characterLevel: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  diceCount?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  projCount?: number;
}
