import http from "@/shared/lib/http";
import type { CreateShopPayload, CreatedShop } from "@/features/onboarding/types/onboarding.types";

const onboardingApi = {
  createShop: (payload: CreateShopPayload): Promise<CreatedShop> =>
    http.post("/api/v1/vendors", payload),
};

export default onboardingApi;
