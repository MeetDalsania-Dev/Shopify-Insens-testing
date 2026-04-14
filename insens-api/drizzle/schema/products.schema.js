import { pgTable, uuid, varchar, text, decimal, integer, boolean, timestamp } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { shops } from './shops.schema';
import { categories } from './categories.schema';
export const products = pgTable('products', {
    id: uuid('id').primaryKey().defaultRandom(),
    shopId: uuid('shop_id').notNull().references(() => shops.id, { onDelete: 'cascade' }),
    categoryId: uuid('category_id').references(() => categories.id, { onDelete: 'set null' }),
    name: varchar('name', { length: 255 }).notNull(),
    description: text('description'),
    price: decimal('price', { precision: 10, scale: 2 }).notNull(),
    stock: integer('stock').notNull().default(0),
    images: text('images').array().notNull().default(sql `'{}'`),
    isActive: boolean('is_active').notNull().default(true),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
});
