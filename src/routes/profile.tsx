import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { User, MapPin, Phone, Lock, ChevronRight, CheckCircle2, ShieldCheck } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { toast } from "sonner";

export const Route = createFileRoute("/profile")({
  head: () => ({ meta: [{ title: "My Profile — Arctic Circle" }] }),
  component: Profile,
});

type Tab = "info" | "address" | "password";

function Profile() {
  const { user, updateProfile, changePassword, logout } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>("info");

  useEffect(() => {
    if (!user) navigate({ to: "/login" });
  }, [user, navigate]);

  if (!user) return null;

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="grid h-14 w-14 place-items-center rounded-full hero-gradient text-white text-xl font-bold shadow-elev-soft">
          {user.name.charAt(0).toUpperCase()}
        </div>
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-tight">{user.name}</h1>
          <p className="text-sm text-muted-foreground">{user.email}</p>
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[220px_1fr]">
        {/* Sidebar nav */}
        <nav className="flex flex-row gap-1 lg:flex-col">
          {([
            { id: "info", label: "Personal info", icon: User },
            { id: "address", label: "Address", icon: MapPin },
            { id: "password", label: "Change password", icon: Lock },
          ] as const).map((it) => (
            <button
              key={it.id}
              onClick={() => setTab(it.id)}
              className={`flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors text-left ${
                tab === it.id
                  ? "bg-secondary text-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
              }`}
            >
              <it.icon className="h-4 w-4 shrink-0" />
              <span className="hidden sm:inline lg:inline">{it.label}</span>
              <ChevronRight className="ml-auto h-3.5 w-3.5 hidden lg:block" />
            </button>
          ))}
        </nav>

        {/* Panel */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-card-soft">
          {tab === "info" && <InfoPanel user={user} />}
          {tab === "address" && <AddressPanel address={user.address} phone={user.phone} onSave={updateProfile} />}
          {tab === "password" && <PasswordPanel onSave={changePassword} />}
        </div>
      </div>
    </div>
  );
}

function InfoPanel({ user }: { user: NonNullable<ReturnType<typeof useAuth>["user"]> }) {
  return (
    <div>
      <h2 className="font-display text-lg font-semibold">Personal information</h2>
      <p className="mt-1 text-sm text-muted-foreground">Your account details as registered.</p>
      <dl className="mt-6 divide-y divide-border">
        {[
          ["Full name", user.name],
          ["Email address", user.email],
          ["Phone", user.phone || "—"],
          ["Address", user.address || "—"],
        ].map(([label, value]) => (
          <div key={label} className="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
            <dt className="text-sm font-medium text-muted-foreground">{label}</dt>
            <dd className="mt-1 text-sm text-foreground sm:col-span-2 sm:mt-0">{value}</dd>
          </div>
        ))}
      </dl>
      <p className="mt-4 text-xs text-muted-foreground">
        To update your name or email, please contact us at{" "}
        <Link to="/contact" className="text-primary hover:underline">our support page</Link>.
      </p>
    </div>
  );
}

function AddressPanel({
  address,
  phone,
  onSave,
}: {
  address: string;
  phone: string;
  onSave: (data: { address?: string; phone?: string }) => void;
}) {
  const [addr, setAddr] = useState(address);
  const [ph, setPh] = useState(phone);
  const [saved, setSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ address: addr, phone: ph });
    setSaved(true);
    toast.success("Profile updated.");
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2 className="font-display text-lg font-semibold">Address & contact</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        This address pre-fills your service ticket form.
      </p>
      <div className="mt-6 space-y-4">
        <label className="block">
          <span className="mb-1.5 block text-xs font-medium">
            <Phone className="inline h-3.5 w-3.5 mr-1 text-muted-foreground" />Phone number
          </span>
          <input
            className="input"
            value={ph}
            onChange={(e) => setPh(e.target.value)}
            placeholder="+91 98xxx xxxxx"
          />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-xs font-medium">
            <MapPin className="inline h-3.5 w-3.5 mr-1 text-muted-foreground" />Delivery / service address
          </span>
          <textarea
            className="input min-h-[100px]"
            value={addr}
            onChange={(e) => setAddr(e.target.value)}
            placeholder="Flat, building, street, area, city, PIN"
          />
        </label>
      </div>
      <div className="mt-6 flex items-center gap-3">
        <button
          type="submit"
          className="rounded-md hero-gradient px-5 py-2.5 text-sm font-semibold text-white"
        >
          Save changes
        </button>
        {saved && (
          <span className="flex items-center gap-1 text-xs text-emerald-600">
            <CheckCircle2 className="h-4 w-4" /> Saved
          </span>
        )}
      </div>
      <style>{`
        .input { width:100%; border-radius:0.5rem; border:1px solid var(--color-border); background: var(--color-background); padding:0.625rem 0.75rem; font-size:0.875rem; outline:none; }
        .input:focus { border-color: var(--color-ring); box-shadow: 0 0 0 3px color-mix(in oklab, var(--color-ring) 20%, transparent); }
      `}</style>
    </form>
  );
}

function PasswordPanel({
  onSave,
}: {
  onSave: (current: string, next: string) => { success: boolean; error?: string };
}) {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (next.length < 8) {
      setError("New password must be at least 8 characters.");
      return;
    }
    if (next !== confirm) {
      setError("New passwords don't match.");
      return;
    }
    const result = onSave(current, next);
    if (result.success) {
      setSaved(true);
      setCurrent("");
      setNext("");
      setConfirm("");
      toast.success("Password changed.");
      setTimeout(() => setSaved(false), 2500);
    } else {
      setError(result.error ?? "Failed to change password.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2 className="font-display text-lg font-semibold">Change password</h2>
      <p className="mt-1 text-sm text-muted-foreground">Choose a strong password you don't use elsewhere.</p>
      <div className="mt-6 space-y-4">
        {[
          { label: "Current password", value: current, setter: setCurrent, placeholder: "Your existing password" },
          { label: "New password", value: next, setter: setNext, placeholder: "At least 8 characters" },
          { label: "Confirm new password", value: confirm, setter: setConfirm, placeholder: "Repeat new password" },
        ].map(({ label, value, setter, placeholder }) => (
          <label key={label} className="block">
            <span className="mb-1.5 block text-xs font-medium">{label}</span>
            <input
              required
              type="password"
              className="input"
              value={value}
              onChange={(e) => setter(e.target.value)}
              placeholder={placeholder}
            />
          </label>
        ))}
      </div>

      {error && (
        <div className="mt-3 rounded-md bg-destructive/10 px-3 py-2 text-xs text-destructive">{error}</div>
      )}

      <div className="mt-6 flex items-center gap-3">
        <button type="submit" className="rounded-md hero-gradient px-5 py-2.5 text-sm font-semibold text-white">
          Update password
        </button>
        {saved && (
          <span className="flex items-center gap-1 text-xs text-emerald-600">
            <CheckCircle2 className="h-4 w-4" /> Updated
          </span>
        )}
      </div>
      <style>{`
        .input { width:100%; border-radius:0.5rem; border:1px solid var(--color-border); background: var(--color-background); padding:0.625rem 0.75rem; font-size:0.875rem; outline:none; }
        .input:focus { border-color: var(--color-ring); box-shadow: 0 0 0 3px color-mix(in oklab, var(--color-ring) 20%, transparent); }
      `}</style>
    </form>
  );
}