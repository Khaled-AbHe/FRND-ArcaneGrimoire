import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsInt,
  Min,
  Max,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { ArcanaDto } from './arcana.dto';

export class PactDto {
  @IsBoolean()
  enabled: boolean;

  /** Number of pact slots (1–5 per RAW, allow up to 12 for homebrew) */
  @IsInt()
  @Min(0)
  @Max(12)
  slots: number;

  /** The level all pact slots operate at (1–9) */
  @IsInt()
  @Min(1)
  @Max(9)
  slotLevel: number;

  /** Pact slots currently expended */
  @IsInt()
  @Min(0)
  @Max(12)
  used: number;

  /** Mystic Arcanum entries (one per unlocked arcanum level) */
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ArcanaDto)
  arcana: ArcanaDto[];
}
