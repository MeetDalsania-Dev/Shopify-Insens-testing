import { insensTheme, InsensTheme } from "@/src/shared/theme";
import { create } from "zustand";

interface ThemeState {
  theme: InsensTheme;
  setTheme: (theme: InsensTheme) => void;
}

export const useInsensThemeStore = create<ThemeState>((set) => ({
  theme: insensTheme,
  setTheme: (theme) => set({ theme }),
}));
