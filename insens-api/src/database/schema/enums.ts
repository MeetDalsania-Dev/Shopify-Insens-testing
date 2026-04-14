import { pgEnum } from 'drizzle-orm/pg-core';

export const userRoleEnum = pgEnum('user_role', [
  'INSENS_ADMIN',
  'SHOP_OWNER',
  'BUYER',
]);

export const shopStatusEnum = pgEnum('shop_status', [
  'PENDING',
  'APPROVED',
  'SUSPENDED',
]);
