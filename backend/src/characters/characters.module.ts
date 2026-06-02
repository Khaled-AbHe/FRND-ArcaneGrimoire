import { Module } from '@nestjs/common';
import { CharactersController } from './controller/characters.controller';
import { CharactersService } from './service/characters.service';

@Module({
  providers: [CharactersService],
  controllers: [CharactersController],
})
export class CharactersModule {}
