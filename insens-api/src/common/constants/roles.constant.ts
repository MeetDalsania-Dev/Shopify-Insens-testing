export const UserRole = {
  INSENS_ADMIN: 'INSENS_ADMIN',
  SHOP_OWNER:   'SHOP_OWNER',
  BUYER:        'BUYER',
} as const;

export type UserRole = (typeof UserRole)[keyof typeof UserRole];
