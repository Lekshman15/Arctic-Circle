import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Snowflake } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/lib/auth-context";

export const Route = createFileRoute("/signup")({
  head: () => ({ meta: [{ title: "Create account — Arctic Circle" }] }),
  component: Signup,
});

function Signup() {
  const [f, setF] = useState({ name: "", phone: "", address: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const upd = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setF({ ...f, [k]: e.target.value });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (f.password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    setLoading(true);
    const result = signup(f);
    setLoading(false);
    if (result.success) {
      navigate({ to: "/" });
    } else {
      setError(result.error ?? "Sign up failed.");
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
          <h1 className="mt-10 max-w-md font-display text-4xl font-semibold leading-tight">Join the Arctic Circle.</h1>
          <p className="mt-4 max-w-md text-white/85">
            Faster checkout, one-tap service requests, and order history in one place.
          </p>
          <ul className="mt-8 space-y-2 text-sm text-white/90">
            <li>· Track orders end-to-end</li>
            <li>· Save your address for quicker installs</li>
            <li>· Manage all service tickets in one inbox</li>
          </ul>
        </div>

        <div className="mx-auto w-full max-w-md rounded-2xl bg-card p-8 shadow-elev-soft">
          <h2 className="font-display text-2xl font-semibold">Create your account</h2>
          <p className="mt-1 text-sm text-muted-foreground">It takes less than a minute.</p>

          <form onSubmit={handleSubmit} className="mt-6 grid gap-4 sm:grid-cols-2">
            <Field label="Full name" className="sm:col-span-2">
              <input required className="input" value={f.name} onChange={upd("name")} placeholder="Ravi Kumar" />
            </Field>
            <Field label="Phone no.">
              <input required className="input" value={f.phone} onChange={upd("phone")} placeholder="+91 98xxx xxxxx" />
            </Field>
            <Field label="Email">
              <input required type="email" className="input" value={f.email} onChange={upd("email")} placeholder="you@email.com" />
            </Field>
            <Field label="Address" className="sm:col-span-2">
              <textarea
                required
                className="input min-h-[70px]"
                value={f.address}
                onChange={upd("address")}
                placeholder="Flat, street, area, city, PIN"
              />
            </Field>
            <Field label="Password" className="sm:col-span-2">
              <input
                required
                type="password"
                className="input"
                value={f.password}
                onChange={upd("password")}
                placeholder="At least 8 characters"
              />
            </Field>

            {error && (
              <div className="sm:col-span-2 rounded-md bg-destructive/10 px-3 py-2 text-xs text-destructive">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="sm:col-span-2 rounded-md hero-gradient px-5 py-3 text-sm font-semibold text-white disabled:opacity-60"
            >
              {loading ? "Creating account…" : "Create account"}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            Already have one? <Link to="/login" className="font-medium text-primary hover:underline">Log in</Link>
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

function Field({ label, children, className }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <label className={`block ${className ?? ""}`}>
      <span className="mb-1.5 block text-xs font-medium">{label}</span>
      {children}
    </label>
  );
}
