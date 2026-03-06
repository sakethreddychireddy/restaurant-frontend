import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { authService } from "@/services/authService";
import { useAuthStore } from "@/store/authStore";
import type { LoginRequest, RegisterRequest, User } from "@/types";

export const useLogin = () => {
  const { setAuth } = useAuthStore();
  const navigate = useNavigate();
  return useMutation({
    mutationFn: (data: LoginRequest) => authService.login(data),
    onSuccess: (data) => {
      const user: User = {
        id: data.userId,
        name: data.name,
        email: data.email,
        role: data.role as "Customer" | "Admin",
      };
      setAuth(user, data.token);
      toast.success(`Welcome back, ${data.name}! 👋`);

      // ─── Redirect based on role ───────────────────────────────────────
      if (data.role === "Admin") {
        navigate("/admin");
      } else {
        navigate("/menu");
      }
    },
    onError: (err: string) => toast.error(err || "Invalid email or password"),
  });
};

export const useRegister = () => {
  const { setAuth } = useAuthStore();
  const navigate = useNavigate();
  return useMutation({
    mutationFn: (data: RegisterRequest) => authService.register(data),
    onSuccess: (data) => {
      // Register always creates Customer — no admin registration from UI
      const user: User = {
        id: data.userId,
        name: data.name,
        email: data.email,
        role: "Customer",
      };
      setAuth(user, data.token);
      toast.success("Welcome to Savoria! 🎉");
      navigate("/menu");
    },
    onError: (err: string) => toast.error(err || "Registration failed"),
  });
};

export const useLogout = () => {
  const { logout } = useAuthStore();
  const navigate = useNavigate();
  return () => {
    logout();
    navigate("/login");
    toast.success("Logged out successfully");
  };
};
