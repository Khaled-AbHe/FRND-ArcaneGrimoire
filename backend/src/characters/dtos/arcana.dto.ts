import {
  IsInt,
  Min,
  Max,
  IsOptional,
  IsString,
  IsBoolean,
  IsNumber,
} from 'class-validator';

export class ArcanaDto {
  /** The slot level this arcanum occupies (6–9) */
  @IsInt()
  @Min(6)
  @Max(9)
  level: number;

  /** Spell ID from the shared spellbook, or null if unlinked */
  @IsOptional()
  @IsNumber()
  spellId: number | null;

  /** Whether this arcanum has been used this long rest */
  @IsBoolean()
  used: boolean;
}
