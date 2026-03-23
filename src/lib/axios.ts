import axios from "axios";
import { useAuthStore } from "../store/authStore";

let isRefreshing = false;
let failedQueue: {
  resolve: (value: string) => void;
  reject: (reason: unknown) => void;
}[] = [];

const processQueue = (error: unknown, token: string | null) => {
  failedQueue.forEach((p) => {
    if (error) p.reject(error);
    else p.resolve(token!);
  });
  failedQueue = [];
};

const createInstance = (baseURL: string) => {
  const instance = axios.create({ baseURL, timeout: 10000 });

  // ── Request — attach JWT ───────────────────────────────────
  instance.interceptors.request.use((config) => {
    const token = useAuthStore.getState().token;
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  });

  // ── Response — auto refresh on 401 ────────────────────────
  instance.interceptors.response.use(
    (res) => res,
    async (error) => {
      const original = error.config;

      if (error.response?.status === 401 && !original._retry) {
        original._retry = true;

        const { refreshToken, setToken, logout } = useAuthStore.getState();

        if (!refreshToken) {
          logout();
          return Promise.reject("Session expired. Please login again.");
        }

        if (isRefreshing) {
          // queue requests while refreshing
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          }).then((token) => {
            original.headers.Authorization = `Bearer ${token}`;
            return instance(original);
          });
        }

        isRefreshing = true;

        try {
          const res = await axios.post(
            `${import.meta.env.VITE_AUTH_API_URL}/api/auth/refresh`,
            { refreshToken },
          );

          const { token: newToken, refreshToken: newRefreshToken } =
            res.data.data;

          // update store
          setToken(newToken);
          useAuthStore.setState({ refreshToken: newRefreshToken });

          // update auth header
          original.headers.Authorization = `Bearer ${newToken}`;

          processQueue(null, newToken);
          return instance(original);
        } catch (refreshError) {
          processQueue(refreshError, null);
          logout();
          return Promise.reject("Session expired. Please login again.");
        } finally {
          isRefreshing = false;
        }
      }

      return Promise.reject(
        error.response?.data?.message ||
          error.message ||
          "Something went wrong",
      );
    },
  );

  return instance;
};

export const authApi = createInstance(
  import.meta.env.VITE_AUTH_API_URL || "http://localhost:5270",
);
export const menuApi = createInstance(
  import.meta.env.VITE_MENU_API_URL || "http://localhost:5271",
);
export const orderApi = createInstance(
  import.meta.env.VITE_ORDER_API_URL || "http://localhost:5272",
);
