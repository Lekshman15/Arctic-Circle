import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Snowflake, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/lib/auth-context";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Log in — Arctic Circle" }] }),
  component: Login,
});

function Login() {
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const result = login(email.trim(), pw);
    setLoading(false);
    if (result.success) {
      if (result.role === "admin") {
        navigate({ to: "/admin" });
      } else {
        navigate({ to: "/" });
      }
    } else {
      setError(result.error ?? "Login failed.");
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-4rem)]">
      <div className="absolute inset-0 hero-gradient opacity-90" />
      <div className="absolute inset-0 frost-gradient opacity-60" />
      <div className="relative mx-auto grid min-h-[calc(100vh-4rem)] max-w-6xl items-center px-4 py-12 sm:px-6 lg:grid-cols-2 lg:px-8">
        <div className="hidden text-white lg:block">
          <div className="flex items-center gap-2">
            <span className="grid h-10 w-10 place-items-center rounded-lg bg-white/15 backdrop-blur">
              <Snowflake className="h-5 w-5" />
            </span>
            <span className="font-display text-xl font-semibold">Arctic Circle</span>
          </div>
          <h1 className="mt-10 max-w-md font-display text-4xl font-semibold leading-tight">Welcome back.</h1>
          <p className="mt-4 max-w-md text-white/85">
            Log in to track your orders, manage service requests and re-order from your past purchases in one click.
          </p>
        </div>

        <div className="mx-auto w-full max-w-md rounded-2xl bg-card p-8 shadow-elev-soft">
          <h2 className="font-display text-2xl font-semibold">Log in</h2>
          <p className="mt-1 text-sm text-muted-foreground">Use your email to continue.</p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <label className="block">
              <span className="mb-1.5 block text-xs font-medium">Email</span>
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@email.com"
                className="input"
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-xs font-medium">Password</span>
              <div className="relative">
                <input
                  required
                  type={show ? "text" : "password"}
                  value={pw}
                  onChange={(e) => setPw(e.target.value)}
                  className="input pr-10"
                  placeholder="Your password"
                />
                <button
                  type="button"
                  onClick={() => setShow((s) => !s)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground"
                  aria-label="Toggle password"
                >
                  {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </label>

            {error && (
              <div className="rounded-md bg-destructive/10 px-3 py-2 text-xs text-destructive">
                {error}
              </div>
            )}

            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-1.5 text-muted-foreground">
                <input type="checkbox" className="h-3.5 w-3.5 accent-[var(--primary)]" /> Remember me
              </label>
              <a className="text-primary hover:underline" href="#">Forgot password?</a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-md hero-gradient px-5 py-3 text-sm font-semibold text-white disabled:opacity-60"
            >
              {loading ? "Logging in…" : "Log in"}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            New here? <Link to="/signup" className="font-medium text-primary hover:underline">Create an account</Link>
          </div>
        </div>
      </div>

      <style>{`
        .input { width:100%; border-radius:0.5rem; border:1px solid var(--color-border); background: var(--color-card); padding:0.625rem 0.75rem; font-size:0.875rem; outline:none; }
        .input:focus { border-color: var(--color-ring); box-shadow: 0 0 0 3px color-mix(in oklab, var(--color-ring) 20%, transparent); }
      `}</style>
    </div>
  );
}
