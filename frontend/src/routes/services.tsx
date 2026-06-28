import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Wrench, Upload, X, AirVent, Refrigerator, WashingMachine, Plug, CheckCircle2, LogIn } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth-context";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Book a Service — Arctic Circle" },
      { name: "description", content: "Raise a service request for ACs, fridges, washing machines and stabilizers. Same-day technician visits." },
      { property: "og:title", content: "Book a Service — Arctic Circle" },
      { property: "og:description", content: "Same-day technicians for ACs, fridges, washers and stabilizers." },
    ],
  }),
  component: Services,
});

const machines = [
  { value: "AC", label: "Air Conditioner", icon: AirVent },
  { value: "Refrigerator", label: "Refrigerator", icon: Refrigerator },
  { value: "Washing Machine", label: "Washing Machine", icon: WashingMachine },
  { value: "Stabilizer", label: "Stabilizer", icon: Plug },
];

type Errors = Partial<Record<"address" | "machine" | "timing", string>>;

function Services() {
  const { user } = useAuth();

  // Address pre-filled from profile, editable for this ticket
  const [address, setAddress] = useState(user?.address ?? "");
  const [machine, setMachine] = useState("");
  const [description, setDescription] = useState("");
  const [timing, setTiming] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [errors, setErrors] = useState<Errors>({});
  const [done, setDone] = useState<string | null>(null);

  // Sync address if user logs in mid-session
  useEffect(() => {
    if (user?.address && !address) setAddress(user.address);
  }, [user]);

  const onFiles = (list: FileList | null) => {
    if (!list) return;
    setFiles([...files, ...Array.from(list)].slice(0, 5));
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const er: Errors = {};
    if (!address.trim()) er.address = "Service address is required";
    if (!machine) er.machine = "Select a machine type";
    if (!timing.trim()) er.timing = "Please enter your preferred visit time";
    setErrors(er);
    if (Object.keys(er).length) return;
    const ticket = `SR-${Math.floor(2000 + Math.random() * 1000)}`;
    setDone(ticket);
    toast.success(`Service request ${ticket} created`);
  };

  const resetForm = () => {
    setDone(null);
    setAddress(user?.address ?? "");
    setMachine("");
    setDescription("");
    setTiming("");
    setFiles([]);
    setErrors({});
  };

  // Not logged in — show prompt
  if (!user) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 sm:px-6 lg:px-8 text-center">
        <div className="rounded-2xl border border-border bg-card p-10 shadow-card-soft">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-accent text-deep">
            <LogIn className="h-7 w-7" />
          </div>
          <h2 className="mt-5 font-display text-2xl font-semibold">Log in to raise a ticket</h2>
          <p className="mt-2 text-muted-foreground">
            We need your contact details to schedule a technician visit. Log in or sign up — it takes under a minute.
          </p>
          <div className="mt-7 flex justify-center gap-3">
            <Link
              to="/login"
              className="inline-flex items-center gap-2 rounded-md hero-gradient px-5 py-2.5 text-sm font-semibold text-white"
            >
              Log in
            </Link>
            <Link
              to="/signup"
              className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-5 py-2.5 text-sm font-semibold hover:bg-secondary"
            >
              Sign up
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (done) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-border bg-card p-10 text-center shadow-card-soft">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-emerald-100 text-emerald-700">
            <CheckCircle2 className="h-7 w-7" />
          </div>
          <h1 className="mt-5 font-display text-2xl font-semibold">Request received!</h1>
          <p className="mt-2 text-muted-foreground">
            Your ticket <span className="font-semibold text-foreground">{done}</span> is created.
            Our technician will call <span className="font-semibold text-foreground">{user.phone || "you"}</span> within 2 hours to confirm the visit.
          </p>
          <button
            onClick={resetForm}
            className="mt-6 rounded-md hero-gradient px-5 py-2.5 text-sm font-semibold text-white"
          >
            Raise another request
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr]">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full bg-accent px-3 py-1 text-xs font-medium text-deep">
            <Wrench className="h-3.5 w-3.5" /> Same-day service
          </span>
          <h1 className="mt-4 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
            Tell us what's wrong — we'll send a technician.
          </h1>
          <p className="mt-3 max-w-xl text-muted-foreground">
            Repairs for ACs, refrigerators, washing machines and stabilizers. Genuine spares and 30-day service warranty on every job.
          </p>

          {/* Customer info read-only */}
          <div className="mt-6 rounded-xl bg-secondary/50 border border-border px-4 py-3 text-sm">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-medium">{user.name}</span>
                {user.phone && <span className="ml-2 text-muted-foreground">· {user.phone}</span>}
              </div>
              <Link to="/profile" className="text-xs text-primary hover:underline">Edit profile →</Link>
            </div>
          </div>

          <form onSubmit={submit} className="mt-5 rounded-2xl border border-border bg-card p-6 shadow-card-soft">
            <div className="grid gap-5">
              <Field label="Machine type" required error={errors.machine}>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {machines.map((m) => {
                    const active = machine === m.value;
                    return (
                      <button
                        type="button"
                        key={m.value}
                        onClick={() => setMachine(m.value)}
                        className={`flex flex-col items-center gap-1.5 rounded-lg border p-3 text-xs font-medium transition ${
                          active ? "border-primary bg-secondary text-primary" : "border-border hover:border-primary/40"
                        }`}
                      >
                        <m.icon className="h-5 w-5" />
                        {m.label}
                      </button>
                    );
                  })}
                </div>
              </Field>

              <Field label="Describe the issue">
                <textarea
                  className="input min-h-[100px]"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="E.g. cooling has dropped, water leaks from base, makes a buzzing sound…"
                />
              </Field>

              <Field label="Service address" required error={errors.address}>
                <textarea
                  className="input min-h-[80px]"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Flat / building, street, area, city, PIN"
                />
                {user.address && address !== user.address && (
                  <button
                    type="button"
                    onClick={() => setAddress(user.address)}
                    className="mt-1 text-xs text-primary hover:underline"
                  >
                    Reset to saved address
                  </button>
                )}
              </Field>

              <Field label="Preferred visit timing" required error={errors.timing}>
                <input
                  className="input"
                  value={timing}
                  onChange={(e) => setTiming(e.target.value)}
                  placeholder="E.g. tomorrow morning, weekdays after 5 PM…"
                />
              </Field>

              <Field label="Attach photos or videos (optional)">
                <label className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-border bg-secondary/40 px-4 py-6 text-sm text-muted-foreground hover:bg-secondary/70">
                  <Upload className="h-4 w-4" />
                  Click to upload (up to 5 files)
                  <input type="file" multiple accept="image/*,video/*" className="hidden" onChange={(e) => onFiles(e.target.files)} />
                </label>
                {files.length > 0 && (
                  <ul className="mt-3 space-y-1.5">
                    {files.map((f, i) => (
                      <li key={i} className="flex items-center justify-between rounded-md bg-secondary px-3 py-1.5 text-xs">
                        <span className="truncate">{f.name}</span>
                        <button type="button" onClick={() => setFiles(files.filter((_, x) => x !== i))} aria-label="Remove">
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </Field>
            </div>

            <div className="mt-6 flex items-center justify-between">
              <p className="text-xs text-muted-foreground">By submitting, you agree to be contacted by Arctic Circle.</p>
              <button type="submit" className="rounded-md hero-gradient px-6 py-3 text-sm font-semibold text-white shadow-elev-soft">
                Raise request
              </button>
            </div>
          </form>
        </div>

        {/* Side info */}
        <aside className="lg:pt-20">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-card-soft">
            <h3 className="font-display text-lg font-semibold">How it works</h3>
            <ol className="mt-4 space-y-4 text-sm">
              {[
                ["Raise a ticket", "Fill the form — takes under a minute."],
                ["Confirmation call", "We call within 2 hours to schedule."],
                ["Technician visit", "Diagnosis + fix in one visit where possible."],
                ["Pay only after fix", "30-day service warranty included."],
              ].map(([t, b], i) => (
                <li key={t} className="flex gap-3">
                  <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full hero-gradient text-xs font-semibold text-white">
                    {i + 1}
                  </span>
                  <div>
                    <div className="font-medium">{t}</div>
                    <div className="text-muted-foreground">{b}</div>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <div className="mt-4 rounded-2xl bg-secondary/60 p-5 text-sm">
            <div className="font-semibold">Visit charge</div>
            <p className="mt-1 text-muted-foreground">₹299, waived off if you proceed with the repair.</p>
          </div>
        </aside>
      </div>

      <style>{`
        .input { width:100%; border-radius:0.5rem; border:1px solid var(--color-border); background:var(--color-card); padding:0.625rem 0.75rem; font-size:0.875rem; outline:none; }
        .input:focus { border-color:var(--color-ring); box-shadow:0 0 0 3px color-mix(in oklab,var(--color-ring) 20%,transparent); }
      `}</style>
    </div>
  );
}

function Field({
  label,
  required,
  error,
  children,
  className,
}: {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={`block ${className ?? ""}`}>
      <span className="mb-1.5 block text-xs font-medium text-foreground">
        {label} {required && <span className="text-destructive">*</span>}
      </span>
      {children}
      {error && <span className="mt-1 block text-xs text-destructive">{error}</span>}
    </label>
  );
}