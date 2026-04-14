import http from "@/shared/lib/http";
import type { Shop, UpdateShopPayload } from "@/features/shop/types/shop.types";

const shopApi = {
  /** shopId is injected from session inside the hooks — never from URL params */
  getMyShop: (shopId: string): Promise<Shop> =>
    http.get(`/api/v1/shops/${shopId}`),

  updateMyShop: (shopId: string, payload: UpdateShopPayload): Promise<Shop> =>
    http.patch(`/api/v1/shops/${shopId}`, payload),
};

export default shopApi;
