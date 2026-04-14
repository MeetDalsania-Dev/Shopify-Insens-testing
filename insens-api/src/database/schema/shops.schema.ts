import { pgTable, uuid, varchar, text, timestamp } from 'drizzle-orm/pg-core';
import { shopStatusEnum } from './enums';
import { users } from './users.schema';

export const shops = pgTable('shops', {
  id:          uuid('id').primaryKey().defaultRandom(),
  ownerId:     uuid('owner_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  name:        varchar('name', { length: 255 }).notNull(),
  slug:        varchar('slug', { length: 255 }).notNull().unique(),
  description: text('description'),
  address:     text('address'),
  city:        varchar('city', { length: 100 }),
  logoUrl:     varchar('logo_url', { length: 500 }),
  status:      shopStatusEnum('status').notNull().default('PENDING'),
  createdAt:   timestamp('created_at').notNull().defaultNow(),
  updatedAt:   timestamp('updated_at').notNull().defaultNow(),
});

export type Shop    = typeof shops.$inferSelect;
export type NewShop = typeof shops.$inferInsert;
