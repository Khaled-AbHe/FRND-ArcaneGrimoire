import { IsString, MinLength, MaxLength } from 'class-validator';

export class DuplicateCharacterDto {
  @IsString()
  @MinLength(1)
  @MaxLength(64)
  name: string;
}
