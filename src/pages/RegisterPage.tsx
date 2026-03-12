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
        </div>
      </div>
    </div>
  );
};
