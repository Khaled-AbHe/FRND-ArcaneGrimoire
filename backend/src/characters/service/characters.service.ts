import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  attackBonus,
  cantripTierForLevel,
  spellSaveDC,
} from '../../constants/game.constants';
import { User } from '../../users/entities/user.entity';
import { CreateCharacterDto } from '../dtos/create-character.dto';
import { UpdateCharacterDto } from '../dtos/update-character.dto';
import { Character } from '../entity/character.entity';

@Injectable()
export class CharactersService {
  constructor(
    @InjectRepository(Character) private repo: Repository<Character>,
  ) {}

  async findAll(userId: number): Promise<Character[]> {
    return await this.repo.find({
      where: { user: { userId } },
      order: { createdAt: 'ASC' },
    });
  }

  async findCharacterById(id: number, userId: number): Promise<Character> {
    const char = await this.repo.findOne({
      where: { id, user: { userId } },
    });
    if (!char) {
      throw new NotFoundException(`Character ${id} not found`);
    }
    return char;
  }

  async create(dto: CreateCharacterDto, user: User): Promise<Character> {
    return await this.repo.save(this.repo.create({ ...dto, user }));
  }

  async update(
    id: number,
    dto: UpdateCharacterDto,
    userId: number,
  ): Promise<Character> {
    const char = await this.findCharacterById(id, userId);
    Object.assign(char, dto);
    return await this.repo.save(char);
  }

  async remove(id: number, userId: number): Promise<void> {
    const char = await this.findCharacterById(id, userId);
    await this.repo.remove(char);
  }

  async duplicate(
    srcId: number,
    destName: string,
    userId: number,
    user: User,
  ): Promise<Character> {
    const src = await this.findCharacterById(srcId, userId);
    const copy = this.repo.create({
      name: destName,
      levels: src.levels,
      prepared: src.prepared,
      pact: src.pact,
      globals: src.globals,
      user,
    });
    return await this.repo.save(copy);
  }

  // ── Computed stats ──────────────────────────────────────────────────────────

  async getComputedStats(
    id: number,
    userId: number,
  ): Promise<{
    spellSaveDC: number;
    attackBonus: number;
    cantripTier: number;
    spellMod: number;
  }> {
    const char = await this.findCharacterById(id, userId);
    const globals = char.globals as {
      mod?: number;
      prof?: number;
      charLevel?: number;
    };

    const mod = globals?.mod ?? 0;
    const prof = globals?.prof ?? 2;
    const charLevel = globals?.charLevel ?? 1;

    return {
      spellSaveDC: spellSaveDC(mod, prof),
      attackBonus: attackBonus(mod, prof),
      cantripTier: cantripTierForLevel(charLevel),
      spellMod: mod,
    };
  }

  // ── Rest endpoints ──────────────────────────────────────────────────────────

  /**
   * Short Rest — restores pact slots only.
   * Resets pact.used to 0; all regular spell level slots are untouched.
   */
  async shortRest(id: number, userId: number): Promise<Character> {
    const char = await this.findCharacterById(id, userId);

    const pact = char.pact as {
      enabled?: boolean;
      slots?: number;
      slotLevel?: number;
      used?: number;
      arcana?: unknown[];
    };

    char.pact = { ...pact, used: 0 };

    return await this.repo.save(char);
  }

  /**
   * Long Rest — restores all spell slot levels and resets all Mystic Arcanum uses.
   * Sets used = 0 on every level row, resets pact.used = 0,
   * and sets used = false on every arcana entry.
   */
  async longRest(id: number, userId: number): Promise<Character> {
    const char = await this.findCharacterById(id, userId);

    const levels =
      (char.levels as Array<{
        id: string;
        label: string;
        total: number;
        used: number;
      }>) ?? [];
    char.levels = levels.map((row) => ({ ...row, used: 0 }));

    const pact = char.pact as {
      enabled?: boolean;
      slots?: number;
      slotLevel?: number;
      used?: number;
      arcana?: Array<{ level: number; spellId: string | null; used: boolean }>;
    };

    char.pact = {
      ...pact,
      used: 0,
      arcana: (pact?.arcana ?? []).map((a) => ({ ...a, used: false })),
    };

    return await this.repo.save(char);
  }
}
