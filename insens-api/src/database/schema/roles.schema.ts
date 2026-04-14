import { pgTable, bigserial, varchar, uuid, primaryKey } from 'drizzle-orm/pg-core';
import { users } from './users.schema';

export const roles = pgTable('roles', {
  id:   bigserial('id', { mode: 'number' }).primaryKey(),
  code: varchar('code', { length: 50 }).unique().notNull(),
  // codes: super_admin | admin | vendor_owner | vendor_staff | customer
});

export const userRoles = pgTable('user_roles', {
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  roleId: bigserial('role_id', { mode: 'number' }).notNull().references(() => roles.id, { onDelete: 'cascade' }),
}, (t) => ({
  pk: primaryKey({ columns: [t.userId, t.roleId] }),
}));

export type Role     = typeof roles.$inferSelect;
export type UserRole = typeof userRoles.$inferSelect;
