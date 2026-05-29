import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateSpellDto } from '../dtos/create-spell.dto';
import { UpdateSpellDto } from '../dtos/update-spell.dto';
import { ReplaceAllSpellsDto } from '../dtos/replace-all-spells.dto';
import { SpellTemplateDto } from '../dtos/spell-template.dto';
import { Spell } from '../entity/spell.entity';
import { User } from '../../users/entities/user.entity';
import {
  FULL_CASTER_SLOTS,
  HALF_CASTER_SLOTS,
  WARLOCK_PACT,
  ARCANUM_UNLOCKS,
} from '../../constants/game.constants';

export interface TemplateResult {
  casterType: string;
  charLevel: number;
  levels: Array<{
    id: string;
    label: string;
    total: number;
    used: number;
  }>;
  pact: {
    enabled: boolean;
    slots: number;
    slotLevel: number;
    used: number;
    arcana: Array<{ level: number; spellId: null; used: boolean }>;
  } | null;
}

@Injectable()
export class SpellsService {
  constructor(@InjectRepository(Spell) private spellsRepo: Repository<Spell>) {}

  // ── User-scoped queries ──────────────────────────────────────────────────────

  async findAllForUser(userId: number): Promise<Spell[]> {
    return await this.spellsRepo
      .createQueryBuilder('spell')
      .innerJoin('spell.user', 'user')
      .where('user.userId = :userId', { userId })
      .orderBy(
        `CASE 
        WHEN spell.level = 'cantrip' THEN 0 
        ELSE CAST(spell.level AS INTEGER) 
      END`,
        'ASC',
      )
      .getMany();
  }

  async findSpellByIdForUser(id: number, userId: number): Promise<Spell> {
    const spell = await this.spellsRepo.findOne({
      where: { id, user: { userId } },
    });
    if (!spell) {
      throw new NotFoundException(`Spell ${id} not found`);
    }
    return spell;
  }

  async createForUser(dto: CreateSpellDto, user: User): Promise<Spell> {
    const spell = this.spellsRepo.create({ ...dto, user });
    return await this.spellsRepo.save(spell);
  }

  async updateForUser(
    id: number,
    dto: UpdateSpellDto,
    userId: number,
  ): Promise<Spell> {
    const spell = await this.findSpellByIdForUser(id, userId);
    Object.assign(spell, dto);
    return await this.spellsRepo.save(spell);
  }

  async removeForUser(id: number, userId: number): Promise<void> {
    const spell = await this.findSpellByIdForUser(id, userId);
    await this.spellsRepo.remove(spell);
  }

  async replaceAllForUser(
    dto: ReplaceAllSpellsDto,
    user: User,
  ): Promise<Spell[]> {
    // Only delete spells belonging to this user
    const existing = await this.findAllForUser(user.userId);
    await this.spellsRepo.remove(existing);

    const entities = dto.spells.map((s) =>
      this.spellsRepo.create({ ...s, user }),
    );
    return await this.spellsRepo.save(entities);
  }

  // ── Admin-scoped queries ─────────────────────────────────────────────────────

  async findAllForTargetUser(targetUserId: number): Promise<Spell[]> {
    return await this.spellsRepo
      .createQueryBuilder('spell')
      .innerJoin('spell.user', 'user')
      .where('user.userId = :userId', { userId: targetUserId })
      .orderBy(
        `CASE 
        WHEN spell.level = 'cantrip' THEN 0 
        ELSE CAST(spell.level AS INTEGER) 
      END`,
        'ASC',
      )
      .getMany();
  }

  async createForTargetUser(
    dto: CreateSpellDto,
    targetUser: User,
  ): Promise<Spell> {
    const spell = this.spellsRepo.create({ ...dto, user: targetUser });
    return await this.spellsRepo.save(spell);
  }

  // ── Template generation ──────────────────────────────────────────────────────

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
      (u) => ({
        level: u.spellLevel,
        spellId: null,
        used: false,
      }),
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
