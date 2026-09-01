import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Search, SlidersHorizontal, Star, X } from "lucide-react";
import { productsApi, type Product, type ProductType } from "@/lib/api";
import { ProductImage } from "@/components/product-image";

export const Route = createFileRoute("/sales/")({
  head: () => ({
    meta: [
      { title: "Shop ACs & Appliances — Arctic Circle" },
      { name: "description", content: "Browse top-brand air conditioners with filters & best prices." },
      { property: "og:title", content: "Shop Appliances — Arctic Circle" },
      { property: "og:description", content: "Top brands, best prices, free installation." },
    ],
  }),
  loader: () => productsApi.list(),
  component: Sales,
});

type Sort = "popular" | "price-asc" | "price-desc" | "rating" | "tonnage-asc" | "tonnage-desc";

const TYPES: ProductType[] = ["SPLIT", "WINDOW", "STABILIZER"];
const typeLabel = (t: ProductType) => t === "SPLIT" ? "Split AC" : t === "WINDOW" ? "Window AC" : "Stabilizer";

function Sales() {
  const initialProducts = Route.useLoaderData();
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState("");

  const [q, setQ] = useState("");
  const [types, setTypes] = useState<ProductType[]>([]);
  const [brands, setBrands] = useState<string[]>([]);
  const [maxPrice, setMaxPrice] = useState<number>(100000);
  const [sort, setSort] = useState<Sort>("popular");
  const [filtersOpen, setFiltersOpen] = useState(false);

  // Re-fetch if the loader ran with stale data (e.g. client navigation)
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    productsApi
      .list()
      .then((data) => {
        if (!cancelled) setProducts(data);
      })
      .catch(() => {
        if (!cancelled) setLoadError("Couldn't load products from the server. Is the API running?");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const brandOptions = useMemo(() => Array.from(new Set(products.map((p) => p.brand))).sort(), [products]);

  const filtered = useMemo(() => {
    let r = products.filter((p) => {
      const name = `${p.brand} ${p.modelName}`;
      if (q && !name.toLowerCase().includes(q.toLowerCase())) return false;
      if (types.length && !types.includes(p.type)) return false;
      if (brands.length && !brands.includes(p.brand)) return false;
      if (p.price > maxPrice) return false;
      return true;
    });
    switch (sort) {
      case "price-asc": r = [...r].sort((a, b) => a.price - b.price); break;
      case "price-desc": r = [...r].sort((a, b) => b.price - a.price); break;
      case "rating": r = [...r].sort((a, b) => b.starRating - a.starRating); break;
      case "tonnage-asc": r = [...r].sort((a, b) => {
        if (a.type === "STABILIZER" && b.type !== "STABILIZER") return 1;
        if (a.type !== "STABILIZER" && b.type === "STABILIZER") return -1;
        return a.tonnage - b.tonnage;
      }); break;
      case "tonnage-desc": r = [...r].sort((a, b) => {
        if (a.type === "STABILIZER" && b.type !== "STABILIZER") return 1;
        if (a.type !== "STABILIZER" && b.type === "STABILIZER") return -1;
        return b.tonnage - a.tonnage;
      }); break;
    }
    return r;
  }, [products, q, types, brands, maxPrice, sort]);

  const toggle = <T,>(list: T[], setter: (v: T[]) => void, v: T) => {
    setter(list.includes(v) ? list.filter((x) => x !== v) : [...list, v]);
  };

  const clearAll = () => { setTypes([]); setBrands([]); setMaxPrice(100000); setQ(""); };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-7">
        <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">ACs & Stabilizers</h1>
        <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
          Air conditioners from O-General, Mitsubishi Electric, Daikin, Voltas, Carrier, Blue Star, Panasonic and Hitachi.
          Stabilizers are available from Vortex and V-Guard. ACs are available from 0.5 to 3 tons.
        </p>
      </div>

      {/* Search bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search for AC, stabilizer or brand…"
            className="w-full rounded-lg border border-border bg-card py-2.5 pl-10 pr-3 text-sm shadow-card-soft focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/30"
          />
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFiltersOpen(true)}
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2.5 text-sm font-medium lg:hidden"
          >
            <SlidersHorizontal className="h-4 w-4" /> Filters
          </button>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as Sort)}
            className="rounded-lg border border-border bg-card px-3 py-2.5 text-sm"
          >
            <option value="popular">Sort: Popular</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating">Avg. Rating</option>
            <option value="tonnage-asc">Tonnage: Low to High</option>
            <option value="tonnage-desc">Tonnage: High to Low</option>
          </select>
        </div>
      </div>

      {loadError && (
        <div className="mt-4 rounded-md bg-destructive/10 px-3 py-2 text-xs text-destructive">{loadError}</div>
      )}

      <div className="mt-6 grid gap-6 lg:grid-cols-[260px_1fr]">
        {/* Sidebar filters */}
        <aside className={
          filtersOpen
            ? "fixed inset-0 z-50 bg-background/95 p-4 overflow-auto"
            : "hidden lg:block"
        }>
          <div className="flex items-center justify-between lg:hidden mb-4">
            <span className="font-semibold">Filters</span>
            <button onClick={() => setFiltersOpen(false)} aria-label="Close"><X className="h-5 w-5" /></button>
          </div>

          <FilterGroup title="Type">
            {TYPES.map((t) => (
              <Check key={t} label={typeLabel(t)} checked={types.includes(t)} onChange={() => toggle(types, setTypes, t)} />
            ))}
          </FilterGroup>

          <FilterGroup title="Brand">
            {brandOptions.map((b) => (
              <Check key={b} label={b} checked={brands.includes(b)} onChange={() => toggle(brands, setBrands, b)} />
            ))}
          </FilterGroup>

          <FilterGroup title="Max price">
            <input
              type="range"
              min={1000}
              max={100000}
              step={500}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-[var(--primary)]"
            />
            <div className="mt-1 text-xs text-muted-foreground">Up to ₹{maxPrice.toLocaleString("en-IN")}</div>
          </FilterGroup>

          <button onClick={clearAll} className="mt-4 text-xs font-medium text-primary hover:underline">Clear all filters</button>
        </aside>

        {/* Right column: banner + results, kept together so grid auto-placement
            doesn't shove the results section back under the sidebar column */}
        <div className="flex flex-col gap-6">
          {/* Second-hand AC enquiry */}
          <div className="rounded-xl border border-primary/20 bg-secondary/50 p-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="font-display text-lg font-semibold">Looking for a second-hand AC?</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  We also sell 2nd-hand ACs. Contact us to enquire about current availability.
                </p>
              </div>
              <Link
                to="/contact"
                className="inline-flex shrink-0 items-center justify-center rounded-md hero-gradient px-5 py-2.5 text-sm font-semibold text-white"
              >
                Enquire now
              </Link>
            </div>
          </div>

          {/* Results */}
          <section>
            <div className="mb-3 text-sm text-muted-foreground">
              Showing <span className="text-foreground font-medium">{filtered.length}</span> of {products.length} products
            </div>

            {loading && products.length === 0 ? (
              <div className="rounded-xl border border-dashed p-12 text-center text-sm text-muted-foreground">
                Loading products…
              </div>
            ) : filtered.length === 0 ? (
              <div className="rounded-xl border border-dashed p-12 text-center text-sm text-muted-foreground">
                No products match these filters.
              </div>
            ) : (
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {filtered.map((p) => <ProductCard key={p.id} product={p} />)}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border-b border-border pb-4 mb-4 last:border-0">
      <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{title}</h4>
      <div className="space-y-1.5">{children}</div>
    </div>
  );
}

function Check({ label, checked, onChange }: { label: string; checked: boolean; onChange: () => void }) {
  return (
    <label className="flex cursor-pointer items-center gap-2 text-sm">
      <input type="checkbox" checked={checked} onChange={onChange} className="h-4 w-4 rounded border-border accent-[var(--primary)]" />
      <span>{label}</span>
    </label>
  );
}

function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      to="/sales/$productId"
      params={{ productId: product.id }}
      className="group flex flex-col rounded-xl border border-border bg-card p-3 shadow-card-soft transition hover:-translate-y-0.5 hover:shadow-elev-soft"
    >
      <ProductImage product={product} />
      <div className="mt-3 flex-1 px-1">
        <div className="text-xs text-muted-foreground">{product.brand}</div>
        <div className="line-clamp-2 text-sm font-medium group-hover:text-primary">{product.modelName}</div>
        <div className="mt-1.5 flex items-center gap-1.5 text-xs">
          <span className="inline-flex items-center gap-0.5 rounded bg-emerald-600/10 px-1.5 py-0.5 font-medium text-emerald-700">
            {product.starRating} <Star className="h-3 w-3 fill-current" />
          </span>
          <span className="text-muted-foreground">{product.tonnage} Ton</span>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-base font-semibold text-deep">₹{product.price.toLocaleString("en-IN")}</span>
        </div>
      </div>
    </Link>
  );
}