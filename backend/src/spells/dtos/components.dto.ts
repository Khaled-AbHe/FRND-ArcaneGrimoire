import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class ComponentsDto {
  @IsBoolean()
  verbal: boolean;

  @IsBoolean()
  somatic: boolean;

  /** Presence implies material component; absence means none */
  @IsOptional()
  @IsString()
  material?: string;
}
