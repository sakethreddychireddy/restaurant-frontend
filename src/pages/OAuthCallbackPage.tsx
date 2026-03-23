import { useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import toast from "react-hot-toast";
import type { User } from "@/types";

const AUTH_API = import.meta.env.VITE_AUTH_API_URL;

export const OAuthCallbackPage = () => {
  const [params] = useSearchParams();
  const { setAuth } = useAuthStore();
  const navigate = useNavigate();
  const called = useRef(false); // prevent double call in StrictMode

  useEffect(() => {
    if (called.current) return;
    called.current = true;

    const code = params.get("code");
    const error = params.get("error");

    // handle error redirect from backend
    if (error) {
      toast.error("Sign in failed. Please try again.");
      navigate("/login", { replace: true });
      return;
    }

    if (!code) {
      toast.error("Sign in failed. Please try again.");
      navigate("/login", { replace: true });
      return;
    }

    // exchange one-time code for JWT
    const exchangeCode = async () => {
      try {
        const res = await fetch(
          `${AUTH_API}/api/auth/oauth/token?code=${code}`,
        );

        if (!res.ok) {
          throw new Error("Code exchange failed");
        }

        const json = await res.json();
        const data = json.data; // unwrap ApiResponse wrapper

        const user: User = {
          id: data.userId,
          name: data.name,
          email: data.email,
          role: data.role?.toLowerCase() === "admin" ? "Admin" : "Customer",
        };

        setAuth(user, data.token, data.refreshToken);
        toast.success(`Welcome, ${data.name}! 👋`);
        navigate(user.role === "Admin" ? "/admin" : "/menu", { replace: true });
      } catch {
        toast.error("Sign in failed. Please try again.");
        navigate("/login", { replace: true });
      }
    };

    exchangeCode();
  }, [params, setAuth, navigate]);

  return (
    <div className="min-h-screen bg-cream-50 flex items-center justify-center">
      <div className="text-center animate-fade-up">
        <div className="w-16 h-16 bg-gradient-to-br from-terra-400 to-terra-600 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse-soft shadow-terra">
          <span className="text-2xl">🍽️</span>
        </div>
        <p className="text-warm-400 font-body text-sm">Signing you in...</p>
        <p className="text-warm-300 font-body text-xs mt-2">Please wait...</p>
      </div>
    </div>
  );
};
