export type ShopStatus = 'PENDING' | 'APPROVED' | 'SUSPENDED';

export interface Shop {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  address: string | null;
  city: string | null;
  logoUrl: string | null;
  status: ShopStatus;
  createdAt: string;
  owner: {
    id: string;
    email: string;
    firstName: string | null;
    lastName: string | null;
  };
}

export interface ShopProduct {
  id: string;
  name: string;
  price: number;
  stock: number;
  isActive: boolean;
  category: { id: string; name: string } | null;
  createdAt: string;
}
