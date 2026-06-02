import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { asc, eq } from 'drizzle-orm';
import { DRIZZLE } from '../../db/db.module';
import type { DrizzleClient } from '../../db/index';
import { characters, Character, User } from '../../db/schema';
import {
  attackBonus,
  cantripTierForLevel,
  spellSaveDC,
} from '../../constants/game.constants';
import { CreateCharacterDto } from '../dtos/create-character.dto';
import { UpdateCharacterDto } from '../dtos/update-character.dto';

function parseCharacter(row: Character) {
  const parse = (v: unknown) => {
    if (typeof v === 'string') {
      try { return JSON.parse(v); } catch { return v; }
    }
    return v;
  };
  return {
    ...row,
    levels: parse(row.levels),
    prepared: parse(row.prepared),
    pact: parse(row.pact),
    globals: parse(row.globals),
  };
}

@Injectable()
export class CharactersService {
  constructor(@Inject(DRIZZLE) private db: DrizzleClient) {}

  async findAll(userId: number) {
    const rows = await this.db
      .select()
      .from(characters)
      .where(eq(characters.userId, userId))
      .orderBy(asc(characters.createdAt));
    return rows.map(parseCharacter);
  }

  async findCharacterById(id: number, userId: number) {
    const result = await this.db
      .select()
      .from(characters)
      .where(eq(characters.id, id));
    const char = result[0];
    if (!char || char.userId !== userId) {
      throw new NotFoundException(`Character ${id} not found`);
    }
    return parseCharacter(char);
  }

  async create(dto: CreateCharacterDto, user: User) {
    const result = await this.db
      .insert(characters)
      .values({
        name: dto.name,
        levels: JSON.stringify((dto as any).levels ?? []),
        prepared: JSON.stringify((dto as any).prepared ?? []),
        pact: JSON.stringify((dto as any).pact ?? {}),
        globals: JSON.stringify((dto as any).globals ?? {}),
        userId: user.userId,
      })
      .returning();
    return parseCharacter(result[0]);
  }

  async update(id: number, dto: UpdateCharacterDto, userId: number) {
    await this.findCharacterById(id, userId);
    const patch: Record<string, unknown> = { updatedAt: new Date().toISOString() };
    for (const [k, v] of Object.entries(dto)) {
      patch[k] =
        typeof v === 'object' && v !== null ? JSON.stringify(v) : v;
    }
    const result = await this.db
      .update(characters)
      .set(patch as any)
      .where(eq(characters.id, id))
      .returning();
    return parseCharacter(result[0]);
  }

  async remove(id: number, userId: number): Promise<void> {
    await this.findCharacterById(id, userId);
    await this.db.delete(characters).where(eq(characters.id, id));
  }

  async duplicate(srcId: number, destName: string, userId: number, user: User) {
    const src = await this.findCharacterById(srcId, userId);
    const result = await this.db
      .insert(characters)
      .values({
        name: destName,
        levels: JSON.stringify(src.levels),
        prepared: JSON.stringify(src.prepared),
        pact: JSON.stringify(src.pact),
        globals: JSON.stringify(src.globals),
        userId: user.userId,
      })
      .returning();
    return parseCharacter(result[0]);
  }

  async getComputedStats(id: number, userId: number) {
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

  async shortRest(id: number, userId: number) {
    const char = await this.findCharacterById(id, userId);
    const pact = char.pact as { used?: number; [k: string]: unknown };
    const result = await this.db
      .update(characters)
      .set({ pact: JSON.stringify({ ...pact, used: 0 }), updatedAt: new Date().toISOString() })
      .where(eq(characters.id, id))
      .returning();
    return parseCharacter(result[0]);
  }

  async longRest(id: number, userId: number) {
    const char = await this.findCharacterById(id, userId);

    const levels = (
      char.levels as Array<{ id: string; label: string; total: number; used: number }>
    ).map((row) => ({ ...row, used: 0 }));

    const pact = char.pact as {
      used?: number;
      arcana?: Array<{ level: number; spellId: string | null; used: boolean }>;
      [k: string]: unknown;
    };

    const updatedPact = {
      ...pact,
      used: 0,
      arcana: (pact?.arcana ?? []).map((a) => ({ ...a, used: false })),
    };

    const result = await this.db
      .update(characters)
      .set({
        levels: JSON.stringify(levels),
        pact: JSON.stringify(updatedPact),
        updatedAt: new Date().toISOString(),
      })
      .where(eq(characters.id, id))
      .returning();
    return parseCharacter(result[0]);
  }
}