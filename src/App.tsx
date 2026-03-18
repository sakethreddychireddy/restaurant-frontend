import { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { ProtectedRoute } from "@/components/layout/ProtectedRoute";
import { useAuthStore } from "@/store/authStore";

// ── Lazy load all pages ────────────────────────────────────────────
const LoginPage = lazy(() =>
  import("@/pages/LoginPage").then((m) => ({ default: m.LoginPage })),
);
const RegisterPage = lazy(() =>
  import("@/pages/RegisterPage").then((m) => ({ default: m.RegisterPage })),
);
const MenuPage = lazy(() =>
  import("@/pages/MenuPage").then((m) => ({ default: m.MenuPage })),
);
const CartPage = lazy(() =>
  import("@/pages/CartPage").then((m) => ({ default: m.CartPage })),
);
const OrdersPage = lazy(() =>
  import("@/pages/OrdersPage").then((m) => ({ default: m.OrdersPage })),
);
const OrderDetailPage = lazy(() =>
  import("@/pages/OrderDetailPage").then((m) => ({
    default: m.OrderDetailPage,
  })),
);
const AdminPage = lazy(() =>
  import("@/pages/AdminPage").then((m) => ({ default: m.AdminPage })),
);
const NotFoundPage = lazy(() =>
  import("@/pages/NotFoundPage").then((m) => ({ default: m.NotFoundPage })),
);
const OAuthCallbackPage = lazy(() =>
  import("@/pages/OAuthCallbackPage").then((m) => ({
    default: m.OAuthCallbackPage,
  })),
);

// ── Page loader ────────────────────────────────────────────────────
const PageLoader = () => (
  <div className="min-h-screen bg-cream-50 flex items-center justify-center">
    <div className="text-center animate-fade-up">
      <div className="w-16 h-16 bg-gradient-to-br from-terra-400 to-terra-600 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse-soft shadow-terra">
        <span className="text-2xl">🍽️</span>
      </div>
      <p className="text-warm-400 font-body text-sm">Loading...</p>
    </div>
  </div>
);

// ── Guest route ────────────────────────────────────────────────────
const GuestRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, user } = useAuthStore();
  if (isAuthenticated) {
    return (
      <Navigate to={user?.role === "Admin" ? "/admin" : "/menu"} replace />
    );
  }
  return <>{children}</>;
};

export const App = () => (
  <Layout>
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/" element={<Navigate to="/menu" replace />} />

        {/* Guest only */}
        <Route
          path="/login"
          element={
            <GuestRoute>
              <LoginPage />
            </GuestRoute>
          }
        />
        <Route
          path="/register"
          element={
            <GuestRoute>
              <RegisterPage />
            </GuestRoute>
          }
        />

        {/* Customer routes */}
        <Route path="/menu" element={<MenuPage />} />
        <Route
          path="/cart"
          element={
            <ProtectedRoute>
              <CartPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/orders"
          element={
            <ProtectedRoute>
              <OrdersPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/orders/:id"
          element={
            <ProtectedRoute>
              <OrderDetailPage />
            </ProtectedRoute>
          }
        />

        {/* Admin only */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute requireAdmin>
              <AdminPage />
            </ProtectedRoute>
          }
        />
        <Route path="/oauth/callback" element={<OAuthCallbackPage />} />

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  </Layout>
);
