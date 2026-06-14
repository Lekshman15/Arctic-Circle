import { createFileRoute } from "@tanstack/react-router";
import { Phone, Mail, MapPin, Clock, MessageCircle } from "lucide-react";
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
          Questions about a product, your warranty, or need to schedule a service visit? We're happy to help.
        </p>
      </div>

      <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_1.1fr]">
        <div className="space-y-4">
          {[
            { icon: Phone, title: "Call us", body: "+91 98xxx 00000", sub: "Mon–Sat, 9am–8pm" },
            { icon: MessageCircle, title: "WhatsApp", body: "+91 98xxx 00000", sub: "Fastest for service queries" },
            { icon: Mail, title: "Email", body: "hello@arcticcircle.in", sub: "We reply within a day" },
            { icon: MapPin, title: "Showroom", body: "Shop No. 12, Main Road", sub: "Hyderabad, Telangana 500001" },
            { icon: Clock, title: "Hours", body: "Mon–Sat: 9am – 8pm", sub: "Sun: 10am – 4pm" },
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
