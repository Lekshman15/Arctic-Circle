import { createFileRoute } from "@tanstack/react-router";
import { Phone, Mail, MapPin, MessageCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact Arctic Circle" },
      { name: "description", content: "Reach Arctic Circle for sales, service or showroom directions." },
      { property: "og:title", content: "Contact Arctic Circle" },
      { property: "og:description", content: "Call, email or visit our showroom." },
    ],
  }),
  component: Contact,
});

function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Message sent — we'll get back to you within a day.");
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="max-w-2xl">
        <h1 className="font-display text-4xl font-semibold tracking-tight sm:text-5xl">Let's talk.</h1>
        <p className="mt-3 text-muted-foreground">
          Questions about an AC, stabilizer, second-hand AC availability, or a service request? We're happy to help.
        </p>
      </div>

      <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_1.1fr]">
        <div className="space-y-4">
          {[
            { icon: Phone, title: "Call us", body: "+91 98412 88528 / +91 89251 83042", sub: "Sales & service enquiries" },
            { icon: MessageCircle, title: "WhatsApp", body: "+91 98412 88528", sub: "Sales, service & second-hand AC enquiries" },
            { icon: Mail, title: "Email", body: "sridhararctic@gmail.com", sub: "For sales, service and product enquiries" },
            { icon: MapPin, title: "Showroom", body: "61/32, Ponnambalam Salai, K. K. Nagar, Chennai - 600078", sub: "Visit us for ACs and stabilizers" },
          ].map((c) => (
            <div key={c.title} className="flex items-start gap-4 rounded-xl border border-border bg-card p-5 shadow-card-soft">
              <div className="grid h-11 w-11 shrink-0 place-items-center rounded-lg hero-gradient text-white">
                <c.icon className="h-5 w-5" />
              </div>
              <div>
                <div className="text-xs uppercase tracking-wider text-muted-foreground">{c.title}</div>
                <div className="mt-0.5 text-base font-semibold">{c.body}</div>
                <div className="text-xs text-muted-foreground">{c.sub}</div>
              </div>
            </div>
          ))}
          <div className="grid gap-2 sm:grid-cols-2">
            <a href="tel:+919841288528" className="inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-card px-4 py-2.5 text-sm font-medium hover:bg-secondary">
              <Phone className="h-4 w-4" /> Call +91 98412 88528
            </a>
            <a href="https://wa.me/919841288528" className="inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-card px-4 py-2.5 text-sm font-medium hover:bg-secondary" target="_blank" rel="noreferrer">
              <MessageCircle className="h-4 w-4" /> WhatsApp us
            </a>
          </div>
        </div>

        <form onSubmit={submit} className="rounded-2xl border border-border bg-card p-6 shadow-card-soft">
          <h2 className="font-display text-xl font-semibold">Send a message</h2>
          <p className="mt-1 text-sm text-muted-foreground">Prefer email? Drop us a quick note.</p>

          <div className="mt-6 space-y-4">
            <label className="block">
              <span className="mb-1.5 block text-xs font-medium">Name</span>
              <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input" />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-xs font-medium">Email</span>
              <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="input" />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-xs font-medium">Message</span>
              <textarea required value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="input min-h-[120px]" />
            </label>
            <button className="w-full rounded-md hero-gradient px-5 py-3 text-sm font-semibold text-white">Send message</button>
          </div>
        </form>
      </div>

      <style>{`
        .input { width:100%; border-radius:0.5rem; border:1px solid var(--color-border); background: var(--color-card); padding:0.625rem 0.75rem; font-size:0.875rem; outline:none; }
        .input:focus { border-color: var(--color-ring); box-shadow: 0 0 0 3px color-mix(in oklab, var(--color-ring) 20%, transparent); }
      `}</style>
    </div>
  );
}
