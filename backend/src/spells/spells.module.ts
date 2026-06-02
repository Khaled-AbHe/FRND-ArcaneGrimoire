import { forwardRef, Module } from '@nestjs/common';
import { SpellsController } from './controller/spells.controller';
import { SpellsService } from './service/spells.service';
import { PresetSpellsService } from './service/preset-spells.service';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [forwardRef(() => UsersModule)],
  providers: [SpellsService, PresetSpellsService],
  controllers: [SpellsController],
  exports: [PresetSpellsService],
})
export class SpellsModule {}
