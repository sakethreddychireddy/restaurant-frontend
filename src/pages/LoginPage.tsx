import { useState } from "react";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useLogin } from "@/hooks/useAuth";

export const LoginPage = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const { mutate: login, isPending } = useLogin();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(form);
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left — Visual */}
      <div className="hidden lg:flex hero-warm grain relative overflow-hidden flex-col items-center justify-center p-12">
        <div className="relative z-10 text-center animate-fade-up">
          <div className="w-20 h-20 bg-white/10 backdrop-blur rounded-3xl flex items-center justify-center mx-auto mb-8 border border-white/20">
            <span className="text-4xl">🍽️</span>
          </div>
          <h1 className="font-display text-5xl font-700 text-white mb-4 leading-tight">
            Welcome back
            <br />
            to Mithila
          </h1>
          <p className="text-cream-300 text-lg max-w-sm mx-auto leading-relaxed">
            Where every meal is crafted with love and served with warmth.
          </p>
          <div className="mt-12 grid grid-cols-3 gap-6 max-w-xs mx-auto">
            {["🥗", "🍝", "🍮"].map((emoji, i) => (
              <div
                key={i}
                className={`w-16 h-16 bg-white/10 backdrop-blur rounded-2xl flex items-center justify-center border border-white/10 animate-fade-up-d${i + 1}`}
              >
                <span className="text-2xl">{emoji}</span>
              </div>
            ))}
          </div>
        </div>
        {/* Decorative circles */}
        <div className="absolute top-20 right-20 w-64 h-64 bg-terra-400/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-10 w-48 h-48 bg-cream-400/10 rounded-full blur-3xl" />
      </div>

      {/* Right — Form */}
      <div className="flex items-center justify-center p-8 bg-cream-50">
        <div className="w-full max-w-md animate-fade-up">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2.5 mb-8">
            <div className="w-9 h-9 bg-gradient-to-br from-terra-400 to-terra-600 rounded-xl flex items-center justify-center">
              <span className="text-lg">🍽️</span>
            </div>
            <span className="font-display font-700 text-xl text-charcoal">
              Mithila
            </span>
          </div>

          <h2 className="font-display text-4xl font-700 text-charcoal mb-2">
            Sign in
          </h2>
          <p className="text-warm-500 mb-8 font-body">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-terra-500 font-700 hover:underline"
            >
              Create one free
            </Link>
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
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
              placeholder="Your password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
            <Button
              type="submit"
              size="lg"
              loading={isPending}
              className="w-full mt-2"
            >
              Sign In to Mithila
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};
