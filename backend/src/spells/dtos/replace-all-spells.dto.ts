import { IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateSpellDto } from './create-spell.dto';

export class ReplaceAllSpellsDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateSpellDto)
  spells: CreateSpellDto[];
}
