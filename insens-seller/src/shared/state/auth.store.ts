/**
 * Auth store — stores derived UI state only.
 * Sensitive tokens are never persisted here; NextAuth session handles that.
 */

import { create } from "zustand";
import type { ShopStatus } from "@/shared/types/common.types";

interface AuthState {
  shopStatus: ShopStatus | null;
  setShopStatus: (status: ShopStatus | null) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  shopStatus: null,
  setShopStatus: (status) => set({ shopStatus: status }),
}));
