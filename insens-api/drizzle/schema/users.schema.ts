import { pgTable, uuid, varchar, boolean, timestamp, text } from 'drizzle-orm/pg-core';
import { userStatusEnum, authProviderEnum } from './enums';

export const users = pgTable('users', {
  id:               uuid('id').primaryKey().defaultRandom(),
  email:            varchar('email', { length: 255 }).unique(),
  phone:            varchar('phone', { length: 30 }).unique(),
  passwordHash:     text('password_hash'),
  authProvider:     authProviderEnum('auth_provider').notNull().default('local'),
  status:           userStatusEnum('status').notNull().default('pending_verification'),
  isEmailVerified:  boolean('is_email_verified').notNull().default(false),
  isPhoneVerified:  boolean('is_phone_verified').notNull().default(false),
  lastLoginAt:      timestamp('last_login_at', { withTimezone: true }),
  createdAt:        timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt:        timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

export const refreshTokens = pgTable('refresh_tokens', {
  id:          uuid('id').primaryKey().defaultRandom(),
  userId:      uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  tokenHash:   varchar('token_hash', { length: 500 }).notNull(),
  expiresAt:   timestamp('expires_at', { withTimezone: true }).notNull(),
  createdAt:   timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

export type User            = typeof users.$inferSelect;
export type NewUser         = typeof users.$inferInsert;
export type RefreshToken    = typeof refreshTokens.$inferSelect;
export type NewRefreshToken = typeof refreshTokens.$inferInsert;
