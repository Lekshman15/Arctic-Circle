import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { ordersApi, type OrderSummary } from "@/lib/api";
import { Package, CheckCircle2, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth-context";
import { Link } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/orders")({
  head: () => ({ meta: [{ title: "Orders — Arctic Circle Admin" }] }),
  component: AdminOrders,
});

function AdminOrders() {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) navigate({ to: "/login" });
    else if (user.role !== "admin") navigate({ to: "/" });
  }, [user, navigate]);

  const [orders, setOrders] = useState<OrderSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);

  useEffect(() => {
    if (!user || user.role !== "admin") return;
    let cancelled = false;
    ordersApi
      .getAll()
      .then((data) => {
        if (!cancelled) setOrders(data);
      })
      .catch(() => {
        if (!cancelled) toast.error("Couldn't load orders from the server.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [user]);

  if (!user || user.role !== "admin") return null;

  const pending = orders.filter((o) => o.status === "PLACED");
  const delivered = orders.filter((o) => o.status === "DELIVERED");

  const markDelivered = async (id: string) => {
    setBusyId(id);
    try {
      const updated = await ordersApi.markDelivered(id);
      setOrders((cur) => cur.map((o) => (o.id === id ? updated : o)));
      toast.success(`Order marked as delivered`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not update the order.");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex items-center gap-3">
        <Link to="/admin" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Dashboard
        </Link>
      </div>

      <div className="mt-4 flex items-center gap-3">
        <Package className="h-6 w-6 text-primary" />
        <h1 className="font-display text-3xl font-semibold tracking-tight">Orders</h1>
      </div>
      <p className="mt-1 text-sm text-muted-foreground">{pending.length} pending · {delivered.length} delivered</p>

      {loading ? (
        <div className="mt-8 rounded-xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
          Loading orders…
        </div>
      ) : (
        <div className="mt-8 space-y-8">
          <Section title="Pending" count={pending.length} accent="amber">
            {pending.length === 0 ? (
              <EmptyState message="No pending orders — all caught up!" />
            ) : (
              <OrdersTable orders={pending} onDeliver={markDelivered} busyId={busyId} />
            )}
          </Section>

          <Section title="Delivered" count={delivered.length} accent="emerald">
            {delivered.length === 0 ? (
              <EmptyState message="No delivered orders yet." />
            ) : (
              <OrdersTable orders={delivered} />
            )}
          </Section>
        </div>
      )}
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

function OrdersTable({ orders, onDeliver, busyId }: { orders: OrderSummary[]; onDeliver?: (id: string) => void; busyId?: string | null }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-border bg-card shadow-card-soft">
      <table className="w-full text-sm">
        <thead className="bg-secondary/60 text-left text-xs uppercase tracking-wider text-muted-foreground">
          <tr>
            <Th>Order ID</Th><Th>Customer</Th><Th>Product</Th><Th>Total</Th><Th>Date</Th><Th>Status</Th>
            {onDeliver && <Th>Action</Th>}
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {orders.map((o) => (
            <tr key={o.id} className="hover:bg-secondary/30">
              <Td className="font-medium">{o.id.slice(0, 8)}</Td>
              <Td>{o.customer.name}</Td>
              <Td className="max-w-[200px] truncate">{o.product.brand} {o.product.modelName}</Td>
              <Td>₹{o.product.price.toLocaleString("en-IN")}</Td>
              <Td className="text-muted-foreground">{new Date(o.createdAt).toLocaleDateString("en-IN")}</Td>
              <Td>
                <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ${
                  o.status === "DELIVERED" ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
                }`}>{o.status === "DELIVERED" ? "Delivered" : "Placed"}</span>
              </Td>
              {onDeliver && (
                <Td>
                  <button
                    onClick={() => onDeliver(o.id)}
                    disabled={busyId === o.id}
                    className="rounded-md hero-gradient px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-60"
                  >
                    {busyId === o.id ? "Updating…" : "Mark delivered"}
                  </button>
                </Td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const Th = ({ children }: { children: React.ReactNode }) => <th className="px-4 py-3 font-medium">{children}</th>;
const Td = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <td className={`px-4 py-3 align-middle ${className ?? ""}`}>{children}</td>
);
