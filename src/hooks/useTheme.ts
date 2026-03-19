import { useEffect } from "react";
import { useThemeStore } from "@/store/themeStore";
import { useAuthStore } from "@/store/authStore";
import { THEME_VARIABLES } from "@/lib/themes";

export const useTheme = () => {
  const { user } = useAuthStore();
  const { getTheme, setTheme } = useThemeStore();
  const userId = user?.id ?? "guest";
  const theme = getTheme(userId);

  useEffect(() => {
    const vars = THEME_VARIABLES[theme];
    const root = document.documentElement;
    Object.entries(vars).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });
    root.setAttribute("data-theme", theme);
  }, [theme]);

  return {
    theme,
    setTheme: (t: typeof theme) => setTheme(userId, t),
  };
};
