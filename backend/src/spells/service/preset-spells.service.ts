import { Inject, Injectable } from '@nestjs/common';
import { DRIZZLE } from '../../db/db.module';
import type { DrizzleClient } from '../../db/index';
import { spells, User } from '../../db/schema';
import { PRESET_SPELLS } from '../preset-spells.constants';

@Injectable()
export class PresetSpellsService {
  constructor(@Inject(DRIZZLE) private db: DrizzleClient) {}

  async seedForNewUser(user: User): Promise<void> {
    const rows = PRESET_SPELLS.map((dto) => ({
      ...dto,
      components: JSON.stringify(
        dto.components ?? { verbal: false, somatic: false },
      ),
      spellType: JSON.stringify(dto.spellType ?? { kind: 'utility' }),
      outputType: JSON.stringify(dto.outputType ?? { kind: 'utility' }),
      userId: user.userId,
    }));
    await this.db.insert(spells).values(rows as any);
  }
}
