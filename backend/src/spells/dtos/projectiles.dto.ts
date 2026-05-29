import { IsInt, IsOptional, Min, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class ProjectileUpcastDto {
  @IsInt()
  @Min(1)
  count: number;

  @IsInt()
  @Min(1)
  everyNLevels: number;

  @IsInt()
  @Min(1)
  aboveLevel: number;
}

export class ProjectilesDto {
  @IsInt()
  @Min(1)
  baseCount: number;

  @IsOptional()
  @ValidateNested()
  @Type(() => ProjectileUpcastDto)
  upcast?: ProjectileUpcastDto;
}
