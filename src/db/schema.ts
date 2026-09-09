import { relations } from 'drizzle-orm';
import {
  index,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
  pgEnum,
  unique,
} from 'drizzle-orm/pg-core';

export const passwordResetType = pgEnum('password_reset_type', [
  'code',
  'reset_token',
]);

export const usersTable = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: varchar('email').unique().notNull(),
  name: varchar('name').notNull(),
  verifiedAt: timestamp('verified_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export const accountsTable = pgTable(
  'accounts',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    providerId: text('provider_id').notNull(),
    accountId: text('account_id').notNull(),
    password: text('password'),
    userId: uuid('user_id')
      .references(() => usersTable.id, { onDelete: 'cascade' })
      .notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    unique('account_provider_id_account_id_unique').on(
      table.accountId,
      table.providerId,
    ),
    unique('account_provider_id_user_id_unique').on(
      table.providerId,
      table.userId,
    ),
  ],
);

export const sessionsTable = pgTable(
  'sessions',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id')
      .references(() => usersTable.id, { onDelete: 'cascade' })
      .notNull(),
    token: text('token').notNull().unique(),
    userAgent: text('user_agent'),
    ipAddress: text('ip_address'),
    expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [index('session_user_id_idx').on(table.userId)],
);

export const verificationsTable = pgTable('verifications', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id')
    .unique()
    .notNull()
    .references(() => usersTable.id, { onDelete: 'cascade' }),
  token: text('token').notNull().unique(),
  expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const passwordResetsTable = pgTable('password_resets', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id')
    .unique()
    .notNull()
    .references(() => usersTable.id, { onDelete: 'cascade' }),
  tokenHash: text('token_hash').notNull().unique(),
  type: passwordResetType('type').notNull(),
  expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
});

// Relations
export const userRelations = relations(usersTable, ({ one, many }) => ({
  sessions: many(sessionsTable),
  verification: one(verificationsTable),
  passwordReset: one(passwordResetsTable),
  accounts: many(accountsTable),
}));

export const sessionRelations = relations(sessionsTable, ({ one }) => ({
  user: one(usersTable, {
    fields: [sessionsTable.userId],
    references: [usersTable.id],
  }),
}));

export const verificationRelations = relations(
  verificationsTable,
  ({ one }) => ({
    user: one(usersTable, {
      fields: [verificationsTable.userId],
      references: [usersTable.id],
    }),
  }),
);

export const passwordResetRelations = relations(
  passwordResetsTable,
  ({ one }) => ({
    user: one(usersTable, {
      fields: [passwordResetsTable.userId],
      references: [usersTable.id],
    }),
  }),
);
export const accountRelations = relations(accountsTable, ({ one }) => ({
  user: one(usersTable, {
    fields: [accountsTable.userId],
    references: [usersTable.id],
  }),
}));
