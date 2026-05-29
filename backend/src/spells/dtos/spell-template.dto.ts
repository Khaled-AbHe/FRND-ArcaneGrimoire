import { IsEnum, IsInt, Min, Max } from 'class-validator';
import type { CasterTemplate } from '../../constants/game.constants';

export class SpellTemplateDto {
  @IsEnum(['full', 'half', 'warlock'], {
    message: 'casterType must be one of: full, half, warlock',
  })
  casterType: CasterTemplate;

  /** Character level drives which row of the slot table to use (1–20 for templates) */
  @IsInt()
  @Min(1)
  @Max(20)
  charLevel: number;
}
