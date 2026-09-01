import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, ShieldCheck, Star, Truck, Wrench, Heart, ShoppingCart } from "lucide-react";
import { productsApi, ordersApi, ApiError, type Product } from "@/lib/api";
import { ProductImage } from "@/components/product-image";
import { useAuth } from "@/lib/auth-context";
import { toast } from "sonner";

export const Route = createFileRoute("/sales/$productId")({
  loader: async ({ params }) => {
    try {
      return await productsApi.get(params.productId);
    } catch (err) {
      if (err instanceof ApiError && err.status === 404) throw notFound();
      throw err;
    }
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.brand} ${loaderData.modelName} — Arctic Circle` },
          { property: "og:title", content: `${loaderData.brand} ${loaderData.modelName} — Arctic Circle` },
        ]
      : [{ title: "Product — Arctic Circle" }],
  }),
  notFoundComponent: () => (
    <div className="mx-auto max-w-3xl px-4 py-20 text-center">
      <h1 className="font-display text-2xl font-semibold">Product not found</h1>
      <p className="mt-2 text-muted-foreground">It might have been removed from the catalog.</p>
      <Link to="/sales" className="mt-6 inline-flex items-center gap-2 text-primary hover:underline">
        <ArrowLeft className="h-4 w-4" /> Back to shop
      </Link>
    </div>
  ),
  component: ProductDetail,
});

const typeLabel = (t: Product["type"]) => t === "WINDOW" ? "Window AC" : t === "STABILIZER" ? "Stabilizer" : "Split AC";

function ProductDetail() {
  const product = Route.useLoaderData();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [related, setRelated] = useState<Product[]>([]);
  const [placingOrder, setPlacingOrder] = useState(false);

  useEffect(() => {
    let cancelled = false;
    productsApi
      .list({ type: product.type })
      .then((all) => {
        if (!cancelled) setRelated(all.filter((p) => p.id !== product.id).slice(0, 3));
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [product.id, product.type]);

  const buyNow = async () => {
    if (!user) {
      toast("Please log in to place an order.");
      navigate({ to: "/login" });
      return;
    }
    setPlacingOrder(true);
    try {
      await ordersApi.place(product.id);
      toast.success("Order placed! Track it from your profile.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not place order.");
    } finally {
      setPlacingOrder(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <nav className="mb-4 flex items-center gap-2 text-xs text-muted-foreground">
        <Link to="/" className="hover:text-foreground">Home</Link><span>/</span>
        <Link to="/sales" className="hover:text-foreground">Sales</Link><span>/</span>
        <span>{typeLabel(product.type)}</span><span>/</span>
        <span className="text-foreground">{product.brand} {product.modelName}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr]">
        {/* Gallery */}
        <div>
          <ProductImage product={product} size="lg" />
          <div className="mt-3 grid grid-cols-4 gap-2">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="cursor-pointer rounded-md border border-border p-1 hover:border-primary">
                <ProductImage product={product} size="sm" />
              </div>
            ))}
          </div>
        </div>

        {/* Buy box */}
        <div>
          <div className="text-xs uppercase tracking-wider text-muted-foreground">{product.brand}</div>
          <h1 className="mt-1 font-display text-2xl font-semibold leading-tight sm:text-3xl">{product.modelName}</h1>

          <div className="mt-3 flex items-center gap-3 text-sm">
            <span className="inline-flex items-center gap-1 rounded bg-emerald-600/10 px-2 py-0.5 font-medium text-emerald-700">
              {product.starRating} <Star className="h-3.5 w-3.5 fill-current" />
            </span>
            {product.type !== "STABILIZER" && (
              <>
                <span className="text-muted-foreground">·</span>
                <span className="text-muted-foreground">{product.tonnage} Ton</span>
              </>
            )}
            <span className="text-muted-foreground">·</span>
            <span className="text-muted-foreground">{typeLabel(product.type)}</span>
          </div>

          <div className="mt-5 flex items-end gap-3">
            <span className="font-display text-3xl font-semibold text-deep">₹{product.price.toLocaleString("en-IN")}</span>
          </div>
          <div className="text-xs text-muted-foreground">Inclusive of all taxes · Free installation</div>

          <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
            {product.type === "STABILIZER"
              ? `${product.brand} ${typeLabel(product.type).toLowerCase()} for dependable voltage protection.`
              : `${product.tonnage} Ton ${typeLabel(product.type).toLowerCase()} from ${product.brand}, rated ${product.starRating} star for energy efficiency.`}
            {" "}Backed by reliable product support and professional service.
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            <button
              onClick={() => toast.success("Added to cart")}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-md border border-primary bg-card px-5 py-3 text-sm font-semibold text-primary hover:bg-secondary"
            >
              <ShoppingCart className="h-4 w-4" /> Add to cart
            </button>
            <button
              onClick={buyNow}
              disabled={placingOrder}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-md hero-gradient px-5 py-3 text-sm font-semibold text-white disabled:opacity-60"
            >
              {placingOrder ? "Placing order…" : "Buy now"}
            </button>
            <button
              onClick={() => toast("Saved to wishlist")}
              className="inline-flex items-center justify-center rounded-md border border-border bg-card px-3 py-3 text-muted-foreground hover:text-foreground"
              aria-label="Save"
            >
              <Heart className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-6 grid gap-3 rounded-xl border border-border bg-secondary/40 p-4 sm:grid-cols-3">
            <Trust icon={Truck} title="Free delivery" body="Within 48 hours" />
            <Trust icon={Wrench} title="Free install" body="By certified tech" />
            <Trust icon={ShieldCheck} title="Brand warranty" body="Full coverage" />
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="font-display text-xl font-semibold">Customers also viewed</h2>
          <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((p) => (
              <Link key={p.id} to="/sales/$productId" params={{ productId: p.id }} className="group rounded-xl border border-border bg-card p-3 shadow-card-soft hover:shadow-elev-soft">
                <ProductImage product={p} />
                <div className="mt-3 px-1">
                  <div className="text-xs text-muted-foreground">{p.brand}</div>
                  <div className="line-clamp-2 text-sm font-medium group-hover:text-primary">{p.modelName}</div>
                  <div className="mt-1 text-sm font-semibold text-deep">₹{p.price.toLocaleString("en-IN")}</div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function Trust({ icon: Icon, title, body }: { icon: React.ComponentType<{ className?: string }>; title: string; body: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="grid h-9 w-9 place-items-center rounded-md bg-card text-primary">
        <Icon className="h-4 w-4" />
      </div>
      <div>
        <div className="text-sm font-semibold">{title}</div>
        <div className="text-xs text-muted-foreground">{body}</div>
      </div>
    </div>
  );
}
