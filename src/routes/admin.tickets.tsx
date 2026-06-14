import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { TICKETS, type Ticket } from "@/lib/mock-data";
import { Wrench, CheckCircle2, Clock, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth-context";

export const Route = createFileRoute("/admin/tickets")({
  head: () => ({ meta: [{ title: "Service Tickets — Arctic Circle Admin" }] }),
  component: AdminTickets,
});

type SimpleTicket = Omit<Ticket, "status"> & { status: "Open" | "Completed" };

function AdminTickets() {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) navigate({ to: "/login" });
    else if (user.role !== "admin") navigate({ to: "/" });
  }, [user, navigate]);

  const initTickets: SimpleTicket[] = TICKETS.map((t) => ({
    ...t,
    status: t.status === "Completed" ? "Completed" : "Open",
  }));

  const [tickets, setTickets] = useState<SimpleTicket[]>(initTickets);

  if (!user || user.role !== "admin") return null;

  const open = tickets.filter((t) => t.status === "Open");
  const completed = tickets.filter((t) => t.status === "Completed");

  const markDone = (id: string) => {
    setTickets((cur) => cur.map((t) => (t.id === id ? { ...t, status: "Completed" } : t)));
    toast.success(`Ticket ${id} marked as completed`);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex items-center gap-3">
        <Link to="/admin" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Dashboard
        </Link>
      </div>

      <div className="mt-4 flex items-center gap-3">
        <Wrench className="h-6 w-6 text-primary" />
        <h1 className="font-display text-3xl font-semibold tracking-tight">Service Tickets</h1>
      </div>
      <p className="mt-1 text-sm text-muted-foreground">{open.length} open · {completed.length} completed</p>

      <div className="mt-8 space-y-8">
        <Section title="Open" count={open.length} accent="amber">
          {open.length === 0 ? (
            <EmptyState message="No open tickets — all done!" />
          ) : (
            <div className="grid gap-4">
              {open.map((t) => <TicketCard key={t.id} ticket={t} onComplete={markDone} />)}
            </div>
          )}
        </Section>

        <Section title="Completed" count={completed.length} accent="emerald">
          {completed.length === 0 ? (
            <EmptyState message="No completed tickets yet." />
          ) : (
            <div className="grid gap-4">
              {completed.map((t) => <TicketCard key={t.id} ticket={t} />)}
            </div>
          )}
        </Section>
      </div>
    </div>
  );
}

function Section({ title, count, accent, children }: { title: string; count: number; accent: "amber" | "emerald"; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-3 flex items-center gap-2">
        <span className={`h-2 w-2 rounded-full ${accent === "amber" ? "bg-amber-400" : "bg-emerald-400"}`} />
        <h3 className="text-sm font-semibold">{title}</h3>
        <span className="rounded-full bg-secondary px-2 py-0.5 text-xs text-muted-foreground">{count}</span>
      </div>
      {children}
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="rounded-xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
      <CheckCircle2 className="mx-auto mb-2 h-6 w-6 text-muted-foreground/40" />
      {message}
    </div>
  );
}

function TicketCard({ ticket, onComplete }: { ticket: SimpleTicket; onComplete?: (id: string) => void }) {
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-card-soft">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-display text-sm font-semibold">{ticket.id}</span>
            <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ${
              ticket.status === "Completed" ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
            }`}>{ticket.status}</span>
          </div>
          <div className="mt-1 text-base font-medium">
            {ticket.customer} <span className="text-muted-foreground">· {ticket.machine}</span>
          </div>
          <div className="mt-0.5 text-xs text-muted-foreground">{ticket.phone} · {ticket.address}</div>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Clock className="h-3.5 w-3.5" /> {ticket.raisedAt}
        </div>
      </div>
      <p className="mt-3 rounded-md bg-secondary/40 p-3 text-sm">{ticket.issue}</p>
      {onComplete && ticket.status !== "Completed" && (
        <div className="mt-4">
          <button
            onClick={() => onComplete(ticket.id)}
            className="rounded-md hero-gradient px-4 py-2 text-xs font-semibold text-white"
          >
            Mark completed
          </button>
        </div>
      )}
      {ticket.status === "Completed" && (
        <div className="mt-3 flex items-center gap-1.5 text-xs text-emerald-600">
          <CheckCircle2 className="h-4 w-4" /> Completed
        </div>
      )}
    </div>
  );
}