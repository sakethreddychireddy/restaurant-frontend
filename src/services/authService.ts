import { authApi } from "@/lib/axios";
import type {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  SendOtpRequest,
  SendOtpResponse,
  VerifyOtpRequest,
} from "@/types";

export const authService = {
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const res = await authApi.post("/api/auth/login", data);
    return res.data.data;
  },

  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const res = await authApi.post("/api/auth/register", data);
    return res.data.data;
  },

  // ── OTP ──────────────────────────────────────────────────────
  sendOtp: async (data: SendOtpRequest): Promise<SendOtpResponse> => {
    const res = await authApi.post("/api/auth/send-otp", data);
    return res.data.data;
  },

  verifyOtp: async (data: VerifyOtpRequest): Promise<AuthResponse> => {
    const res = await authApi.post("/api/auth/verify-otp", data);
    return res.data.data;
  },
  // Add these two methods
  logout: async (refreshToken: string): Promise<void> => {
    await authApi.post("/api/auth/logout", { refreshToken });
  },

  refresh: async (refreshToken: string): Promise<AuthResponse> => {
    const res = await authApi.post("/api/auth/refresh", { refreshToken });
    return res.data.data;
  },
};
