import type { ShopStatus } from "@/shared/types/common.types";

export interface SellerStats {
  shopStatus:     ShopStatus | null;
  totalProducts:  number;
  activeProducts: number;
  totalStock:     number;
}
