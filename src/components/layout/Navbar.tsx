import { Link, useLocation } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { useCartStore } from "@/store/cartStore";
import { useLogout } from "@/hooks/useAuth";
import { cn } from "@/utils/cn";

export const Navbar = () => {
  const { user, isAuthenticated } = useAuthStore();
  const totalItems = useCartStore((s) => s.totalItems());
  const logout = useLogout();
  const { pathname } = useLocation();

  const navLink = (to: string, label: string) => (
    <Link
      to={to}
      className={cn(
        "px-3 py-2 rounded-xl text-sm font-medium transition-all",
        pathname === to
          ? "bg-brand-50 text-brand-600"
          : "text-stone-600 hover:bg-stone-50",
      )}
    >
      {label}
    </Link>
  );

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-white/90 backdrop-blur-xl border-b border-stone-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link
          to={isAuthenticated && user?.role === "Admin" ? "/admin" : "/menu"}
          className="flex items-center gap-2.5 group"
        >
          <div className="w-9 h-9 bg-gradient-to-br from-brand-500 to-brand-600 rounded-xl flex items-center justify-center shadow-lg shadow-brand-200 group-hover:scale-105 transition-transform">
            <span className="text-white text-lg">🍽️</span>
          </div>
          <span className="font-display font-black text-xl text-stone-800">
            Savoria
          </span>
        </Link>

        <nav className="flex items-center gap-1">
          {isAuthenticated ? (
            <>
              {/* Customer Nav */}
              {user?.role === "Customer" && (
                <>
                  {navLink("/menu", "Menu")}
                  {navLink("/orders", "My Orders")}
                  <Link
                    to="/cart"
                    className={cn(
                      "relative flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-all",
                      pathname === "/cart"
                        ? "bg-brand-50 text-brand-600"
                        : "text-stone-600 hover:bg-stone-50",
                    )}
                  >
                    🛒 Cart
                    {totalItems > 0 && (
                      <span className="absolute -top-1 -right-1 bg-brand-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                        {totalItems}
                      </span>
                    )}
                  </Link>
                </>
              )}

              {/* Admin Nav */}
              {user?.role === "Admin" && <>{navLink("/admin", "Dashboard")}</>}

              {/* User info + Logout */}
              <div className="ml-3 pl-3 border-l border-stone-200 flex items-center gap-2">
                <div className="hidden sm:block text-right">
                  <p className="text-sm font-semibold text-stone-700">
                    {user?.name}
                  </p>
                  <p className="text-xs text-stone-400 capitalize">
                    {user?.role}
                  </p>
                </div>
                <button
                  onClick={logout}
                  className="p-2 rounded-xl text-stone-400 hover:text-red-500 hover:bg-red-50 transition-all"
                  title="Logout"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                </button>
              </div>
            </>
          ) : (
            <>
              {navLink("/login", "Login")}
              {/* Only show Sign Up for customers — no admin registration */}
              <Link
                to="/register"
                className="ml-2 px-4 py-2 bg-brand-500 hover:bg-brand-600 text-white rounded-xl text-sm font-semibold transition-all shadow-lg shadow-brand-200"
              >
                Sign Up
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};
