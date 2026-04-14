import type { ShopStatus } from "@/shared/types/common.types";

export interface Shop {
  id:          string;
  ownerId:     string;
  name:        string;
  slug:        string;
  description: string | null;
  address:     string | null;
  city:        string | null;
  logoUrl:     string | null;
  status:      ShopStatus;
  createdAt:   string;
  updatedAt:   string;
}

export type UpdateShopPayload = Partial<{
  name:        string;
  description: string;
  address:     string;
  city:        string;
  logoUrl:     string;
}>;
