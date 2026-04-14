export const UserRole = {
  SUPER_ADMIN:      'super_admin',
  ADMIN:            'admin',
  VENDOR_OWNER:     'vendor_owner',
  VENDOR_STAFF:     'vendor_staff',
  CUSTOMER:         'customer',
} as const;

export type UserRole = (typeof UserRole)[keyof typeof UserRole];
