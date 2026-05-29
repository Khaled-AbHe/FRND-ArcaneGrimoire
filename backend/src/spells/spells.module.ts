import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SpellsController } from './controller/spells.controller';
import { Spell } from './entity/spell.entity';
import { SpellsService } from './service/spells.service';
import { PresetSpellsService } from './service/preset-spells.service';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Spell]),
    forwardRef(() => UsersModule), // breaks the circular dep with UsersModule
  ],
  providers: [SpellsService, PresetSpellsService],
  controllers: [SpellsController],
  exports: [PresetSpellsService],
})
export class SpellsModule {}
