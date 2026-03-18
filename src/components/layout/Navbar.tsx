import { Link, useLocation } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { useCartStore } from "@/store/cartStore";
import { useLogout } from "@/hooks/useAuth";
import { cn } from "@/utils/cn";
import logo from "../assets/download.svg";

export const Navbar = () => {
  const { user, isAuthenticated } = useAuthStore();
  const totalItems = useCartStore((s) => s.totalItems());
  const logout = useLogout();
  const { pathname } = useLocation();

  const navLink = (to: string, label: string) => (
    <Link
      to={to}
      className={cn(
        "px-4 py-2 rounded-xl text-sm font-body font-600 transition-all duration-200",
        pathname === to
          ? "bg-terra-50 text-terra-600"
          : "text-warm-700 hover:bg-cream-100 hover:text-charcoal",
      )}
    >
      {label}
    </Link>
  );

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-cream-50/90 backdrop-blur-xl border-b border-cream-200 shadow-warm-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link
          to={isAuthenticated && user?.role === "Admin" ? "/admin" : "/menu"}
          className="flex items-center gap-2.5 group"
        >
          <div className="w-9 h-9 bg-gradient-to-br from-terra-400 to-terra-600 rounded-xl flex items-center justify-center shadow-terra group-hover:scale-105 transition-transform duration-200">
            {/* <span className="text-lg">🍽️</span> */}
            <img
              src={logo}
              alt="Mithila Logo"
              className="w-full h-full object-contain"
            />
          </div>
          <span className="font-display font-700 text-xl text-charcoal tracking-wide">
            Mithila
          </span>
        </Link>

        <nav className="flex items-center gap-1">
          {isAuthenticated ? (
            <>
              {user?.role === "Customer" && (
                <>
                  {navLink("/menu", "Menu")}
                  {navLink("/orders", "My Orders")}
                  <Link
                    to="/cart"
                    className={cn(
                      "relative flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-body font-600 transition-all duration-200",
                      pathname === "/cart"
                        ? "bg-terra-50 text-terra-600"
                        : "text-warm-700 hover:bg-cream-100 hover:text-charcoal",
                    )}
                  >
                    🛒 Cart
                    {totalItems > 0 && (
                      <span className="absolute -top-1 -right-1 bg-terra-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-body font-700 shadow-terra">
                        {totalItems}
                      </span>
                    )}
                  </Link>
                </>
              )}

              {user?.role === "Admin" && navLink("/admin", "Dashboard")}

              <div className="ml-3 pl-3 border-l border-cream-200 flex items-center gap-2.5">
                <div className="hidden sm:block text-right">
                  <p className="text-sm font-body font-700 text-charcoal leading-none">
                    {user?.name}
                  </p>
                  <p className="text-xs text-warm-500 capitalize mt-0.5">
                    {user?.role}
                  </p>
                </div>
                <button
                  onClick={logout}
                  className="p-2 rounded-xl text-warm-400 hover:text-terra-500 hover:bg-terra-50 transition-all duration-200"
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
              {navLink("/login", "Sign In")}
              <Link
                to="/register"
                className="ml-2 px-5 py-2 bg-terra-500 hover:bg-terra-600 text-white rounded-2xl text-sm font-body font-700 transition-all duration-200 shadow-terra hover:shadow-lg active:scale-95"
              >
                Get Started
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};
