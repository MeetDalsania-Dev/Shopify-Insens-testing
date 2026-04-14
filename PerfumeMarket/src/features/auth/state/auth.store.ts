import * as SecureStore from "expo-secure-store";
import { create } from "zustand";
import { StrapiUser } from "../types/auth.types";

const JWT_KEY = "insens_jwt";

interface AuthState {
  user: StrapiUser | null;
  jwt: string | null;
  isAuthenticated: boolean;
  isHydrated: boolean;

  // Actions
  setAuth: (user: StrapiUser, jwt: string) => Promise<void>;
  setUser: (user: StrapiUser) => void;
  setRole: (role: "visitor" | "seller") => void;
  logout: () => Promise<void>;
  hydrate: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  jwt: null,
  isAuthenticated: false,
  isHydrated: false,

  setAuth: async (user, jwt) => {
    await SecureStore.setItemAsync(JWT_KEY, jwt);
    set({ user, jwt, isAuthenticated: true });
  },

  setUser: (user) => set({ user }),

  // Called after role selection — updates local store only
  // API call is done in useSelectRole hook
  setRole: (role) => {
    const user = get().user;
    if (!user) return;
    set({ user: { ...user, roleType: role } });
  },

  logout: async () => {
    await SecureStore.deleteItemAsync(JWT_KEY);
    set({ user: null, jwt: null, isAuthenticated: false });
  },

  // Called on app boot — rehydrate JWT from secure storage
  hydrate: async () => {
    try {
      const jwt = await SecureStore.getItemAsync(JWT_KEY);
      if (jwt) {
        set({ jwt, isAuthenticated: true });
      }
    } finally {
      set({ isHydrated: true });
    }
  },
}));
