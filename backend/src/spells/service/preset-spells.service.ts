import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Spell } from '../entity/spell.entity';
import { PRESET_SPELLS } from '../preset-spells.constants';

@Injectable()
export class PresetSpellsService {
  constructor(
    @InjectRepository(Spell) private spellsRepo: Repository<Spell>,
  ) {}

  /**
   * Seeds all preset spells into a newly created user's collection.
   * Called once during signup — any presets added or changed after
   * signup only affect future signups (or are pushed via admin routes).
   */
  async seedForNewUser(user: User): Promise<void> {
    const spells = PRESET_SPELLS.map((dto) =>
      this.spellsRepo.create({ ...dto, user }),
    );
    await this.spellsRepo.save(spells);
  }
}
