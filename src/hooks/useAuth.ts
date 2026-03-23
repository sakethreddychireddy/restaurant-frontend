import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { authService } from "@/services/authService";
import { useAuthStore } from "@/store/authStore";
import type {
  LoginRequest,
  RegisterRequest,
  SendOtpRequest,
  VerifyOtpRequest,
  User,
} from "@/types";

const toUser = (data: {
  userId: string;
  name: string;
  email: string;
  role: string;
}): User => ({
  id: data.userId,
  name: data.name,
  email: data.email,
  role: data.role?.toLowerCase() === "admin" ? "Admin" : "Customer",
});

const navigateByRole = (
  role: "Admin" | "Customer",
  navigate: ReturnType<typeof useNavigate>,
) => {
  navigate(role === "Admin" ? "/admin" : "/menu");
};

export const useLogin = () => {
  const { setAuth } = useAuthStore();
  const navigate = useNavigate();
  return useMutation({
    mutationFn: (data: LoginRequest) => authService.login(data),
    onSuccess: (data) => {
      const user = toUser(data);
      setAuth(user, data.token, data.refreshToken);
      toast.success(`Welcome back, ${data.name}!`);
      navigateByRole(user.role, navigate);
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
      const user = toUser(data);
      setAuth(user, data.token, data.refreshToken);
      toast.success("Welcome to Mithila!");
      navigate("/menu");
    },
    onError: (err: string) => toast.error(err || "Registration failed"),
  });
};

// ── OTP hooks ──────────────────────────────────────────────────
export const useSendOtp = () =>
  useMutation({
    mutationFn: (data: SendOtpRequest) => authService.sendOtp(data),
    onError: (err: string) => toast.error(err || "Failed to send OTP"),
  });

// Update useVerifyOtp to store refreshToken
export const useVerifyOtp = () => {
  const { setAuth } = useAuthStore();
  const navigate = useNavigate();
  return useMutation({
    mutationFn: (data: VerifyOtpRequest) => authService.verifyOtp(data),
    onSuccess: (data) => {
      const user = toUser(data);
      setAuth(user, data.token, data.refreshToken);
      toast.success(`Welcome, ${data.name}!`);
      navigateByRole(user.role, navigate);
    },
    onError: (err: string) => toast.error(err || "Invalid or expired OTP"),
  });
};

// Update useLogout to call backend
export const useLogout = () => {
  const { logout, refreshToken } = useAuthStore();
  const navigate = useNavigate();

  return async () => {
    try {
      if (refreshToken) {
        await authService.logout(refreshToken);
      }
    } catch {
      // ignore errors — logout anyway
    } finally {
      logout();
      navigate("/login");
      toast.success("Logged out successfully");
    }
  };
};
