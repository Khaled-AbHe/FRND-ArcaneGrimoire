import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CharactersController } from './controller/characters.controller';
import { Character } from './entity/character.entity';
import { CharactersService } from './service/characters.service';

@Module({
  imports: [TypeOrmModule.forFeature([Character])],
  providers: [CharactersService],
  controllers: [CharactersController],
})
export class CharactersModule {}
