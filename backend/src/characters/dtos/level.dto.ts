import { IsString, IsInt, Min, Max } from 'class-validator';

export class LevelDto {
  /** Frontend-assigned ID string, e.g. "level_3" */
  @IsString()
  id: string;

  /** Display label, e.g. "Level 3" or "Cantrip" */
  @IsString()
  label: string;

  /** Total slots available at this level (0–12) */
  @IsInt()
  @Min(0)
  @Max(12)
  total: number;

  /** Slots currently expended (0–total) */
  @IsInt()
  @Min(0)
  @Max(12)
  used: number;
}
