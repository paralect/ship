import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { createSelectSchema } from 'drizzle-orm/zod';
import { z } from 'zod';

import { users } from '@/resources/users/users.schema';

export const inviteTokens = pgTable('invite_tokens', {
  id: uuid().defaultRandom().primaryKey(),

  email: text().notNull(),
  tokenHash: text().notNull(),

  invitedById: text().references(() => users.id),

  expiresAt: timestamp({ withTimezone: true }).notNull(),
  usedAt: timestamp({ withTimezone: true }),

  createdAt: timestamp({ withTimezone: true }).defaultNow(),
  updatedAt: timestamp({ withTimezone: true }).$onUpdate(() => new Date()),
});

export const inviteTokenSchema = createSelectSchema(inviteTokens);

export const inviteTokenInputSchema = z.object({
  email: z.string().email(),
});

export const inviteTokenValidateSchema = z.object({
  token: z.string().min(1),
});
