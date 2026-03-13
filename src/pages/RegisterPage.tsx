import { useState } from "react";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useRegister } from "@/hooks/useAuth";

export const RegisterPage = () => {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const { mutate: register, isPending } = useRegister();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    setError("");
    register(form);
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left — Visual */}
      <div className="hidden lg:flex hero-warm grain relative overflow-hidden flex-col items-center justify-center p-12">
        <div className="relative z-10 text-center animate-fade-up">
          <div className="w-20 h-20 bg-white/10 backdrop-blur rounded-3xl flex items-center justify-center mx-auto mb-8 border border-white/20">
            <span className="text-4xl">✨</span>
          </div>
          <h1 className="font-display text-5xl font-700 text-white mb-4 leading-tight">
            Join the
            <br />
            Mithila family
          </h1>
          <p className="text-cream-300 text-lg max-w-sm mx-auto leading-relaxed">
            Discover handcrafted meals made with the finest ingredients,
            delivered to your door.
          </p>
          <div className="mt-12 space-y-4 max-w-xs mx-auto text-left">
            {[
              { icon: "🌿", text: "Fresh, organic ingredients" },
              { icon: "👨‍🍳", text: "Crafted by expert chefs" },
              { icon: "🚀", text: "Fast, warm delivery" },
            ].map((item, i) => (
              <div
                key={i}
                className={`flex items-center gap-3 animate-fade-up-d${i + 1}`}
              >
                <div className="w-10 h-10 bg-white/10 backdrop-blur rounded-xl flex items-center justify-center border border-white/10 flex-shrink-0">
                  <span>{item.icon}</span>
                </div>
                <p className="text-cream-200 font-body text-sm">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="absolute top-20 right-20 w-64 h-64 bg-terra-400/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-10 w-48 h-48 bg-cream-400/10 rounded-full blur-3xl" />
      </div>

      {/* Right — Form */}
      <div className="flex items-center justify-center p-8 bg-cream-50">
        <div className="w-full max-w-md animate-fade-up">
          <div className="lg:hidden flex items-center gap-2.5 mb-8">
            <div className="w-9 h-9 bg-gradient-to-br from-terra-400 to-terra-600 rounded-xl flex items-center justify-center">
              <span className="text-lg">🍽️</span>
            </div>
            <span className="font-display font-700 text-xl text-charcoal">
              Mithila
            </span>
          </div>

          <h2 className="font-display text-4xl font-700 text-charcoal mb-2">
            Create account
          </h2>
          <p className="text-warm-500 mb-8 font-body">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-terra-500 font-700 hover:underline"
            >
              Sign in
            </Link>
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              id="name"
              label="Full Name"
              type="text"
              required
              placeholder="John Doe"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <Input
              id="email"
              label="Email address"
              type="email"
              required
              placeholder="you@example.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
            <Input
              id="password"
              label="Password"
              type="password"
              required
              placeholder="Min. 6 characters"
              value={form.password}
              error={error}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
            <Button
              type="submit"
              size="lg"
              loading={isPending}
              className="w-full mt-2"
            >
              Create My Account
            </Button>
          </form>
          {/* ── OAuth ───────────────────────────────────────────── */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-cream-200" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-cream-50 px-4 text-sm text-warm-400 font-body">
                or continue with
              </span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <a
              href={`${import.meta.env.VITE_APP_URL}/api/auth/google`}
              className="flex items-center justify-center gap-2.5 px-4 py-3 bg-white border border-cream-200 rounded-2xl text-sm font-body font-semibold text-charcoal hover:bg-cream-50 transition-all shadow-warm-sm hover:shadow-warm-md"
            >
              <svg
                className="w-5 h-5"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                ></path>
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                ></path>
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                ></path>
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                ></path>
              </svg>
              Google
            </a>
            <a
              href={`${import.meta.env.VITE_APP_URL}/api/auth/github`}
              className="flex items-center justify-center gap-2.5 px-4 py-3 bg-white border border-cream-200 rounded-2xl text-sm font-body font-semibold text-charcoal hover:bg-cream-50 transition-all shadow-warm-sm hover:shadow-warm-md"
            >
              <svg
                className="w-5 h-5"
                viewBox="0 0 24 24"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"></path>
              </svg>
              GitHub
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
