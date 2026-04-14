export const ShopStatus = {
  PENDING:   'PENDING',
  APPROVED:  'APPROVED',
  SUSPENDED: 'SUSPENDED',
} as const;

export type ShopStatus = (typeof ShopStatus)[keyof typeof ShopStatus];
