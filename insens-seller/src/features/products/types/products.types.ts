export interface Category {
  id:   string;
  name: string;
  slug: string;
}

export interface Product {
  id:          string;
  shopId:      string;
  categoryId:  string | null;
  category:    Category | null;
  name:        string;
  description: string | null;
  price:       string;
  stock:       number;
  images:      string[];
  isActive:    boolean;
  createdAt:   string;
  updatedAt:   string;
}

export interface CreateProductPayload {
  name:        string;
  description?: string;
  price:       number;
  stock:       number;
  categoryId?: string;
  images?:     string[];
}

export type UpdateProductPayload = Partial<CreateProductPayload & { isActive: boolean }>;
