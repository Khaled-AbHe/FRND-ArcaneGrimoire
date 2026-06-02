import { sql } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { UserType } from '../users/enums/users.enum';

// ── Users ────────────────────────────────────────────────────────────────────

export const users = sqliteTable('users', {
  userId: integer('user_id').primaryKey({ autoIncrement: true }),
  userType: text('user_type').$type<UserType>().notNull(),
  username: text('username').notNull(),
  email: text('email').notNull(),
  password: text('password').notNull(),
  enableHighMagic: integer('enable_high_magic', { mode: 'boolean' })
    .notNull()
    .default(false),
  darkMode: integer('dark_mode', { mode: 'boolean' }).notNull().default(true),
});

// ── Spells ───────────────────────────────────────────────────────────────────

export const spells = sqliteTable('spells', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: integer('user_id')
    .notNull()
    .references(() => users.userId, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  level: text('level').notNull().default('1'),
  school: text('school'),
  castTime: text('cast_time'),
  range: text('range'),
  duration: text('duration'),
  concentration: integer('concentration', { mode: 'boolean' })
    .notNull()
    .default(false),
  ritual: integer('ritual', { mode: 'boolean' }).notNull().default(false),
  // JSON columns stored as text
  components: text('components')
    .notNull()
    .default('{"verbal":false,"somatic":false}'),
  spellType: text('spell_type').notNull().default('{"kind":"utility"}'),
  outputType: text('output_type').notNull().default('{"kind":"utility"}'),
  notes: text('notes'),
  createdAt: text('created_at')
    .notNull()
    .default(sql`(datetime('now'))`),
  updatedAt: text('updated_at')
    .notNull()
    .default(sql`(datetime('now'))`),
});

// ── Characters ───────────────────────────────────────────────────────────────

export const characters = sqliteTable('characters', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: integer('user_id')
    .notNull()
    .references(() => users.userId, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  levels: text('levels').notNull().default('[]'),
  prepared: text('prepared').notNull().default('[]'),
  pact: text('pact').notNull().default('{}'),
  globals: text('globals').notNull().default('{}'),
  createdAt: text('created_at')
    .notNull()
    .default(sql`(datetime('now'))`),
  updatedAt: text('updated_at')
    .notNull()
    .default(sql`(datetime('now'))`),
});

// ── Inferred types ───────────────────────────────────────────────────────────

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Spell = typeof spells.$inferSelect;
export type NewSpell = typeof spells.$inferInsert;
export type Character = typeof characters.$inferSelect;
export type NewCharacter = typeof characters.$inferInsert;
