import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, SlidersHorizontal, Star, X } from "lucide-react";
import { BRANDS, CATEGORIES, PRODUCTS, type Product } from "@/lib/mock-data";
import { ProductImage } from "@/components/product-image";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/sales/")({
  head: () => ({
    meta: [
      { title: "Shop ACs, Fridges & Appliances — Arctic Circle" },
      { name: "description", content: "Browse top-brand ACs, refrigerators, washing machines and stabilizers with filters & best prices." },
      { property: "og:title", content: "Shop Appliances — Arctic Circle" },
      { property: "og:description", content: "Top brands, best prices, free installation." },
    ],
  }),
  component: Sales,
});

type Sort = "popular" | "price-asc" | "price-desc" | "rating";

function Sales() {

  const [q, setQ] = useState("");
  const [cats, setCats] = useState<string[]>([]);
  const [brands, setBrands] = useState<string[]>([]);
  const [maxPrice, setMaxPrice] = useState<number>(100000);
  const [sort, setSort] = useState<Sort>("popular");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const filtered = useMemo(() => {
    let r = PRODUCTS.filter((p) => {
      if (q && !(`${p.name} ${p.brand} ${p.category}`.toLowerCase().includes(q.toLowerCase()))) return false;
      if (cats.length && !cats.includes(p.category)) return false;
      if (brands.length && !brands.includes(p.brand)) return false;
      if (p.price > maxPrice) return false;
      return true;
    });
    switch (sort) {
      case "price-asc": r = [...r].sort((a, b) => a.price - b.price); break;
      case "price-desc": r = [...r].sort((a, b) => b.price - a.price); break;
      case "rating": r = [...r].sort((a, b) => b.rating - a.rating); break;
    }
    return r;
  }, [q, cats, brands, maxPrice, sort]);

  const toggle = (list: string[], setter: (v: string[]) => void, v: string) => {
    setter(list.includes(v) ? list.filter((x) => x !== v) : [...list, v]);
  };

  const clearAll = () => { setCats([]); setBrands([]); setMaxPrice(100000); setQ(""); };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Search bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search for AC, fridge, brand…"
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
          </select>
        </div>
      </div>

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

          <FilterGroup title="Category">
            {CATEGORIES.map((c) => (
              <Check key={c} label={c} checked={cats.includes(c)} onChange={() => toggle(cats, setCats, c)} />
            ))}
          </FilterGroup>

          <FilterGroup title="Brand">
            {BRANDS.map((b) => (
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

        {/* Results */}
        <section>
          <div className="mb-3 text-sm text-muted-foreground">
            Showing <span className="text-foreground font-medium">{filtered.length}</span> of {PRODUCTS.length} products
          </div>

          {filtered.length === 0 ? (
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
  const off = Math.round(((product.mrp - product.price) / product.mrp) * 100);
  return (
    <Link
      to="/sales/$productId"
      params={{ productId: product.id }}
      className="group flex flex-col rounded-xl border border-border bg-card p-3 shadow-card-soft transition hover:-translate-y-0.5 hover:shadow-elev-soft"
    >
      <ProductImage product={product} />
      <div className="mt-3 flex-1 px-1">
        <div className="text-xs text-muted-foreground">{product.brand}</div>
        <div className="line-clamp-2 text-sm font-medium group-hover:text-primary">{product.name}</div>
        <div className="mt-1.5 flex items-center gap-1.5 text-xs">
          <span className="inline-flex items-center gap-0.5 rounded bg-emerald-600/10 px-1.5 py-0.5 font-medium text-emerald-700">
            {product.rating} <Star className="h-3 w-3 fill-current" />
          </span>
          <span className="text-muted-foreground">({product.reviews.toLocaleString("en-IN")})</span>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-base font-semibold text-deep">₹{product.price.toLocaleString("en-IN")}</span>
          <span className="text-xs text-muted-foreground line-through">₹{product.mrp.toLocaleString("en-IN")}</span>
          <span className="text-xs font-medium text-emerald-700">{off}% off</span>
        </div>
      </div>
    </Link>
  );
}