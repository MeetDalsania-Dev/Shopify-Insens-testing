import { pgTable, uuid, varchar, text, date, boolean, timestamp } from 'drizzle-orm/pg-core';
import { users } from './users.schema';
import { addressTypeEnum } from './enums';

export const userProfiles = pgTable('user_profiles', {
  userId:            uuid('user_id').primaryKey().references(() => users.id, { onDelete: 'cascade' }),
  firstName:         varchar('first_name', { length: 100 }),
  lastName:          varchar('last_name', { length: 100 }),
  displayName:       varchar('display_name', { length: 100 }),
  avatarUrl:         text('avatar_url'),
  dateOfBirth:       date('date_of_birth'),
  gender:            varchar('gender', { length: 20 }),
  preferredLanguage: varchar('preferred_language', { length: 10 }),
  createdAt:         timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt:         timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

export const addresses = pgTable('addresses', {
  id:          uuid('id').primaryKey().defaultRandom(),
  userId:      uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  type:        addressTypeEnum('type').notNull(),
  fullName:    varchar('full_name', { length: 150 }).notNull(),
  phone:       varchar('phone', { length: 30 }),
  line1:       varchar('line1', { length: 255 }).notNull(),
  line2:       varchar('line2', { length: 255 }),
  city:        varchar('city', { length: 100 }).notNull(),
  state:       varchar('state', { length: 100 }),
  postalCode:  varchar('postal_code', { length: 20 }),
  countryCode: varchar('country_code', { length: 2 }).notNull(),
  isDefault:   boolean('is_default').notNull().default(false),
  createdAt:   timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

export type UserProfile = typeof userProfiles.$inferSelect;
export type Address     = typeof addresses.$inferSelect;
