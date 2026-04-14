import http from "@/shared/lib/http";
import type { CreateShopPayload } from "@/features/onboarding/types/onboarding.types";

const onboardingApi = {
  createShop: (payload: CreateShopPayload) =>
    http.post("/api/v1/shops", payload),
};

export default onboardingApi;
