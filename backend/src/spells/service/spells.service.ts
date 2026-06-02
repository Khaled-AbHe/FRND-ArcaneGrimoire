import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { asc, eq, sql } from 'drizzle-orm';
import { DRIZZLE } from '../../db/db.module';
import type { DrizzleClient } from '../../db/index';
import { spells, Spell, User } from '../../db/schema';
import { CreateSpellDto } from '../dtos/create-spell.dto';
import { UpdateSpellDto } from '../dtos/update-spell.dto';
import { ReplaceAllSpellsDto } from '../dtos/replace-all-spells.dto';
import { SpellTemplateDto } from '../dtos/spell-template.dto';
import {
  FULL_CASTER_SLOTS,
  HALF_CASTER_SLOTS,
  WARLOCK_PACT,
  ARCANUM_UNLOCKS,
} from '../../constants/game.constants';

export interface TemplateResult {
  casterType: string;
  charLevel: number;
  levels: Array<{ id: string; label: string; total: number; used: number }>;
  pact: {
    enabled: boolean;
    slots: number;
    slotLevel: number;
    used: number;
    arcana: Array<{ level: number; spellId: null; used: boolean }>;
  } | null;
}

// JSON columns are stored as text — these helpers parse/stringify them
function parseSpell(row: Spell) {
  const parse = (v: unknown) => {
    if (typeof v === 'string') {
      try {
        return JSON.parse(v);
      } catch {
        return v;
      }
    }
    return v;
  };
  return {
    ...row,
    components: parse(row.components),
    spellType: parse(row.spellType),
    outputType: parse(row.outputType),
  };
}

function serializeSpellDto(dto: CreateSpellDto | UpdateSpellDto) {
  const out: Record<string, unknown> = { ...dto };
  if (dto.components !== undefined)
    out.components = JSON.stringify(dto.components);
  if (dto.spellType !== undefined)
    out.spellType = JSON.stringify(dto.spellType);
  if (dto.outputType !== undefined)
    out.outputType = JSON.stringify(dto.outputType);
  return out;
}

@Injectable()
export class SpellsService {
  constructor(@Inject(DRIZZLE) private db: DrizzleClient) {}

  // ── User-scoped queries ───────────────────────────────────────────────────

  async findAllForUser(userId: number) {
    const rows = await this.db
      .select()
      .from(spells)
      .where(eq(spells.userId, userId))
      .orderBy(
        asc(
          sql`CASE WHEN ${spells.level} = 'cantrip' THEN 0 ELSE CAST(${spells.level} AS INTEGER) END`,
        ),
      );
    return rows.map(parseSpell);
  }

  async findSpellByIdForUser(id: number, userId: number) {
    const result = await this.db.select().from(spells).where(eq(spells.id, id));
    const spell = result[0];
    if (!spell || spell.userId !== userId) {
      throw new NotFoundException(`Spell ${id} not found`);
    }
    return parseSpell(spell);
  }

  async createForUser(dto: CreateSpellDto, user: User) {
    const result = await this.db
      .insert(spells)
      .values({ ...serializeSpellDto(dto), userId: user.userId } as any)
      .returning();
    return parseSpell(result[0]);
  }

  async updateForUser(id: number, dto: UpdateSpellDto, userId: number) {
    await this.findSpellByIdForUser(id, userId);
    const result = await this.db
      .update(spells)
      .set({
        ...serializeSpellDto(dto),
        updatedAt: new Date().toISOString(),
      } as any)
      .where(eq(spells.id, id))
      .returning();
    return parseSpell(result[0]);
  }

  async removeForUser(id: number, userId: number): Promise<void> {
    await this.findSpellByIdForUser(id, userId);
    await this.db.delete(spells).where(eq(spells.id, id));
  }

  async replaceAllForUser(dto: ReplaceAllSpellsDto, user: User) {
    await this.db.delete(spells).where(eq(spells.userId, user.userId));
    const rows = dto.spells.map((s) => ({
      ...serializeSpellDto(s),
      userId: user.userId,
    }));
    const result = await this.db
      .insert(spells)
      .values(rows as any)
      .returning();
    return result.map(parseSpell);
  }

  // ── Admin-scoped queries ──────────────────────────────────────────────────

  async findAllForTargetUser(targetUserId: number) {
    const rows = await this.db
      .select()
      .from(spells)
      .where(eq(spells.userId, targetUserId))
      .orderBy(
        asc(
          sql`CASE WHEN ${spells.level} = 'cantrip' THEN 0 ELSE CAST(${spells.level} AS INTEGER) END`,
        ),
      );
    return rows.map(parseSpell);
  }

  async createForTargetUser(dto: CreateSpellDto, targetUser: User) {
    const result = await this.db
      .insert(spells)
      .values({ ...serializeSpellDto(dto), userId: targetUser.userId } as any)
      .returning();
    return parseSpell(result[0]);
  }

  // ── Template generation ───────────────────────────────────────────────────

  getTemplate(dto: SpellTemplateDto): TemplateResult {
    const { casterType, charLevel } = dto;
    const rowIndex = charLevel - 1;

    if (casterType === 'warlock') {
      return this.buildWarlockTemplate(charLevel, rowIndex);
    }

    const table = casterType === 'full' ? FULL_CASTER_SLOTS : HALF_CASTER_SLOTS;
    const slotRow = table[rowIndex] ?? table[table.length - 1];

    const levels = slotRow
      .map((total, i) => ({
        id: `level_${i + 1}`,
        label: `Level ${i + 1}`,
        total,
        used: 0,
      }))
      .filter((row) => row.total > 0);

    return { casterType, charLevel, levels, pact: null };
  }

  private buildWarlockTemplate(
    charLevel: number,
    rowIndex: number,
  ): TemplateResult {
    const pactRow =
      WARLOCK_PACT[rowIndex] ?? WARLOCK_PACT[WARLOCK_PACT.length - 1];

    const arcana = ARCANUM_UNLOCKS.filter((u) => charLevel >= u.charLevel).map(
      (u) => ({ level: u.spellLevel, spellId: null, used: false }),
    );

    return {
      casterType: 'warlock',
      charLevel,
      levels: [],
      pact: {
        enabled: true,
        slots: pactRow.slots,
        slotLevel: pactRow.slotLevel,
        used: 0,
        arcana,
      },
    };
  }
}
