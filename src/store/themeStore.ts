import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Theme = "warm" | "dark" | "fresh";

interface ThemeStore {
  themes: Record<string, Theme>; // userId → theme
  getTheme: (userId: string) => Theme;
  setTheme: (userId: string, theme: Theme) => void;
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set, get) => ({
      themes: {},

      getTheme: (userId) => get().themes[userId] ?? "warm",

      setTheme: (userId, theme) =>
        set((state) => ({
          themes: { ...state.themes, [userId]: theme },
        })),
    }),
    { name: "theme-storage" },
  ),
);
