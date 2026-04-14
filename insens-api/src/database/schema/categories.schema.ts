import { pgTable, uuid, varchar, timestamp } from 'drizzle-orm/pg-core';

export const categories = pgTable('categories', {
  id:        uuid('id').primaryKey().defaultRandom(),
  name:      varchar('name', { length: 100 }).notNull().unique(),
  slug:      varchar('slug', { length: 100 }).notNull().unique(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export type Category    = typeof categories.$inferSelect;
export type NewCategory = typeof categories.$inferInsert;
