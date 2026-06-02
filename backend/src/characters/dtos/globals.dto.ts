import { IsInt, Min, Max, IsBoolean } from 'class-validator';

export class GlobalsDto {
  @IsInt()
  @Min(-5)
  @Max(10)
  mod: number;

  @IsInt()
  @Min(2)
  @Max(9)
  prof: number;

  @IsInt()
  @Min(1)
  @Max(20)
  charLevel: number;

  @IsBoolean()
  highMagic: boolean;
}
