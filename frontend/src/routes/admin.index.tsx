import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { Package, Wrench, CheckCircle2, TrendingUp, ShieldCheck, ArrowRight } from "lucide-react";
import { ORDERS, TICKETS } from "@/lib/mock-data";
import { useAuth } from "@/lib/auth-context";

export const Route = createFileRoute("/admin/")({
  head: () => ({ meta: [{ title: "Admin Dashboard — Arctic Circle" }] }),
  component: AdminDashboard,
});

function AdminDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) navigate({ to: "/login" });
    else if (user.role !== "admin") navigate({ to: "/" });
  }, [user, navigate]);

  if (!user || user.role !== "admin") return null;

  const pendingOrders = ORDERS.filter((o) => o.status !== "Completed").length;
  const deliveredOrders = ORDERS.filter((o) => o.status === "Completed").length;
  const openTickets = TICKETS.filter((t) => t.status !== "Completed").length;
  const closedTickets = TICKETS.filter((t) => t.status === "Completed").length;

  const stats = [
    { icon: Package, label: "Pending orders", value: pendingOrders, color: "text-amber-600" },
    { icon: CheckCircle2, label: "Delivered orders", value: deliveredOrders, color: "text-emerald-600" },
    { icon: Wrench, label: "Open tickets", value: openTickets, color: "text-indigo-600" },
    { icon: TrendingUp, label: "Tickets closed", value: closedTickets, color: "text-emerald-600" },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div>
        <span className="inline-flex items-center gap-2 rounded-full bg-accent px-3 py-1 text-xs font-medium text-deep">
          <ShieldCheck className="h-3.5 w-3.5" /> Admin dashboard
        </span>
        <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight sm:text-4xl">Welcome back, Arctic.</h1>
        <p className="mt-1 text-sm text-muted-foreground">Here's what needs your attention today.</p>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-xl border border-border bg-card p-5 shadow-card-soft">
            <div className="flex items-center justify-between">
              <div className="grid h-10 w-10 place-items-center rounded-md hero-gradient text-white">
                <s.icon className="h-5 w-5" />
              </div>
              <div className="text-xs uppercase tracking-wider text-muted-foreground">{s.label}</div>
            </div>
            <div className={`mt-4 font-display text-3xl font-semibold ${s.color}`}>{s.value}</div>
          </div>
        ))}
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        <Link to="/admin/orders" className="group flex items-center justify-between rounded-xl border border-border bg-card p-6 shadow-card-soft hover:shadow-elev-soft transition-shadow">
          <div>
            <div className="flex items-center gap-2">
              <Package className="h-5 w-5 text-primary" />
              <h3 className="font-display text-lg font-semibold">Orders</h3>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">{pendingOrders} pending · {deliveredOrders} delivered</p>
          </div>
          <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors" />
        </Link>

        <Link to="/admin/tickets" className="group flex items-center justify-between rounded-xl border border-border bg-card p-6 shadow-card-soft hover:shadow-elev-soft transition-shadow">
          <div>
            <div className="flex items-center gap-2">
              <Wrench className="h-5 w-5 text-primary" />
              <h3 className="font-display text-lg font-semibold">Service Tickets</h3>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">{openTickets} open · {closedTickets} completed</p>
          </div>
          <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors" />
        </Link>
      </div>
    </div>
  );
}