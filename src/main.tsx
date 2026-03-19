import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import "./index.css";
import { App } from "./App";
import { useThemeStore } from "./store/themeStore";
import { THEME_VARIABLES } from "@/lib/themes";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, staleTime: 1000 * 60 * 2 },
    mutations: { retry: 0 },
  },
});
// Apply theme on app load
const savedThemes = useThemeStore.getState().themes;
const guestTheme = savedThemes["guest"] ?? "warm";
Object.entries(THEME_VARIABLES[guestTheme]).forEach(([key, value]) => {
  document.documentElement.style.setProperty(key, value);
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <App />
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              borderRadius: "12px",
              background: "#1c1917",
              color: "#fff",
              fontFamily: "DM Sans, sans-serif",
            },
            success: { iconTheme: { primary: "#f97316", secondary: "#fff" } },
          }}
        />
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>,
);
