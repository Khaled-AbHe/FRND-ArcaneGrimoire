import { IsInt, Min, Max, IsBoolean } from 'class-validator';

export class GlobalsDto {
  /** Spellcasting ability modifier (−5 to +10 covers all realistic cases) */
  @IsInt()
  @Min(-5)
  @Max(10)
  mod: number;

  /** Proficiency bonus (2–6 covers levels 1–20) */
  @IsInt()
  @Min(2)
  @Max(6)
  prof: number;

  /** Character level used for cantrip scaling (1–20) */
  @IsInt()
  @Min(1)
  @Max(20)
  charLevel: number;

  /** Enables spell levels 10–12 (homebrew High Magic rule) */
  @IsBoolean()
  highMagic: boolean;
}
