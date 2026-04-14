export type UserRole = 'BUYER' | 'SHOP_OWNER' | 'INSENS_ADMIN';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  firstName: string | null;
  lastName: string | null;
  avatarUrl: string | null;
  isActive: boolean;
  createdAt: string;
}
