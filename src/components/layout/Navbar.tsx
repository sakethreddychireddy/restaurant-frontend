import { Link, useLocation } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import { useCartStore } from "@/store/cartStore";
import { useLogout } from "@/hooks/useAuth";
import { useTheme } from "@/hooks/useTheme";
import { cn } from "@/utils/cn";
import logo from "@/assets/download.svg";

const THEME_EMOJIS = {
  warm: "🍂",
  dark: "🌙",
  fresh: "🌿",
};

export const Navbar = () => {
  const { user, isAuthenticated } = useAuthStore();
  const totalItems = useCartStore((s) => s.totalItems());
  const logout = useLogout();
  const { pathname } = useLocation();
  const { theme } = useTheme();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // initialize theme on mount
  useTheme();

  // close dropdown on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

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
    <header className="fixed top-0 left-0 right-0 z-40 bg-[var(--color-bg)]/90 backdrop-blur-xl border-b border-[var(--color-border)] shadow-warm-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link
          to={isAuthenticated && user?.role === "Admin" ? "/admin" : "/menu"}
          className="flex items-center gap-2.5 group"
        >
          <div className="w-9 h-9 bg-gradient-to-br from-terra-400 to-terra-600 rounded-xl flex items-center justify-center shadow-terra group-hover:scale-105 transition-transform duration-200">
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

              {/* Avatar + Dropdown */}
              <div
                className="ml-3 pl-3 border-l border-[var(--color-border)] relative"
                ref={dropdownRef}
              >
                <button
                  onClick={() => setDropdownOpen((v) => !v)}
                  className="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-[var(--color-surface)] transition-all duration-200"
                >
                  {/* Avatar */}
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-terra-400 to-terra-600 flex items-center justify-center text-white text-sm font-display font-700 shadow-terra">
                    {user?.name?.[0]?.toUpperCase() ?? "U"}
                  </div>
                  {/* Name + role */}
                  <div className="hidden sm:block text-left">
                    <p className="text-sm font-body font-700 text-charcoal leading-none">
                      {user?.name}
                    </p>
                    <p className="text-xs text-warm-500 capitalize mt-0.5 flex items-center gap-1">
                      {THEME_EMOJIS[theme]} {user?.role}
                    </p>
                  </div>
                  {/* Chevron */}
                  <svg
                    className={`w-4 h-4 text-warm-400 transition-transform duration-200 ${
                      dropdownOpen ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {/* Dropdown menu */}
                {dropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-52 bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-2xl shadow-warm-lg overflow-hidden animate-fade-up z-50">
                    {/* User info */}
                    <div className="px-4 py-3 border-b border-[var(--color-border)]">
                      <p className="text-sm font-700 text-charcoal truncate">
                        {user?.name}
                      </p>
                      <p className="text-xs text-warm-400 truncate mt-0.5">
                        {user?.email ?? ""}
                      </p>
                    </div>

                    {/* Profile link */}
                    {user?.role === "Customer" && (
                      <Link
                        to="/profile"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 text-sm font-body font-600 text-[var(--color-text)] hover:bg-[var(--color-surface)] transition-colors"
                      >
                        <span className="text-base">👤</span>
                        My Profile
                      </Link>
                    )}

                    {/* Theme indicator */}
                    <Link
                      to="/profile"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-sm font-body font-600 text-[var(--color-text)] hover:bg-[var(--color-surface)] transition-colors border-t border-[var(--color-border)]"
                    >
                      <span className="text-base">{THEME_EMOJIS[theme]}</span>
                      <span>
                        Theme
                        <span className="ml-1.5 text-xs text-[var(--color-primary)] font-700 capitalize">
                          {theme}
                        </span>
                      </span>
                    </Link>

                    {/* Logout */}
                    <button
                      onClick={() => {
                        setDropdownOpen(false);
                        logout();
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm font-body font-600 text-red-500 hover:bg-red-50 transition-colors border-t border-[var(--color-border)]"
                    >
                      <svg
                        className="w-4 h-4"
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
                      Sign Out
                    </button>
                  </div>
                )}
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
