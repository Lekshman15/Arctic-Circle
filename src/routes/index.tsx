import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Wrench, ShieldCheck, Truck, Star, Snowflake } from "lucide-react";
import { PRODUCTS } from "@/lib/mock-data";
import { ProductImage } from "@/components/product-image";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Arctic Circle — Trusted ACs, Appliances & Service" },
      { name: "description", content: "Shop ACs, refrigerators, washing machines & stabilizers. Book expert service in minutes — Arctic Circle." },
      { property: "og:title", content: "Arctic Circle — Trusted Cooling & Service" },
      { property: "og:description", content: "Shop top-brand appliances and book expert service in minutes." },
    ],
  }),
  component: Home,
});

function Home() {
  const featured = PRODUCTS.slice(0, 4);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 hero-gradient" />
        <div className="absolute inset-0 frost-gradient opacity-60" />
        <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-28">
          <div className="text-white">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-medium backdrop-blur">
              <Snowflake className="h-3.5 w-3.5" /> Beat the heat — summer offers live
            </span>
            <h1 className="mt-5 font-display text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
              Cooling appliances & expert service, in one place.
            </h1>
            <p className="mt-5 max-w-xl text-base text-white/85 sm:text-lg">
              Arctic Circle has powered comfortable homes for 17 years. Buy top-brand ACs, fridges and washers — and book trusted servicing with one tap.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/sales"
                className="inline-flex items-center gap-2 rounded-md bg-white px-5 py-3 text-sm font-semibold text-deep shadow-elev-soft hover:bg-white/95"
              >
                Shop appliances <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/services"
                className="inline-flex items-center gap-2 rounded-md border border-white/30 bg-white/10 px-5 py-3 text-sm font-semibold text-white backdrop-blur hover:bg-white/20"
              >
                Book a service <Wrench className="h-4 w-4" />
              </Link>
            </div>

            <dl className="mt-10 grid max-w-md grid-cols-3 gap-6 text-white">
              <div>
                <dt className="text-xs uppercase tracking-wider text-white/70">Years</dt>
                <dd className="mt-1 text-2xl font-semibold">17+</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wider text-white/70">Installs</dt>
                <dd className="mt-1 text-2xl font-semibold">12k+</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wider text-white/70">Rating</dt>
                <dd className="mt-1 text-2xl font-semibold">4.8★</dd>
              </div>
            </dl>
          </div>

          {/* Hero card stack */}
          <div className="relative hidden lg:block">
            <div className="absolute right-0 top-4 w-80 rotate-3 rounded-2xl bg-white p-4 shadow-elev-soft">
              <ProductImage product={featured[0]} size="md" />
              <div className="mt-3">
                <div className="text-sm font-semibold">{featured[0].name}</div>
                <div className="mt-1 text-xs text-muted-foreground">{featured[0].brand} · {featured[0].capacity}</div>
                <div className="mt-2 text-base font-semibold text-deep">₹{featured[0].price.toLocaleString("en-IN")}</div>
              </div>
            </div>
            <div className="absolute -left-2 top-40 w-72 -rotate-6 rounded-2xl bg-white p-4 shadow-elev-soft">
              <ProductImage product={featured[3]} size="sm" />
              <div className="mt-3">
                <div className="text-sm font-semibold">{featured[3].name}</div>
                <div className="mt-1 text-xs text-muted-foreground">{featured[3].brand}</div>
              </div>
            </div>
            <div className="absolute right-10 bottom-0 w-64 rotate-1 rounded-2xl bg-white p-3 shadow-elev-soft">
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-full hero-gradient text-white">
                  <Wrench className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-sm font-semibold">Service in 24h</div>
                  <div className="text-xs text-muted-foreground">Avg. response time</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Value props */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: ShieldCheck, title: "Authorized stock", body: "Genuine units with full brand warranty." },
            { icon: Truck, title: "Free installation", body: "On all ACs & large appliances within city." },
            { icon: Wrench, title: "In-house service", body: "Trained technicians, original spares." },
            { icon: Star, title: "Loved locally", body: "4.8★ rating from 2,000+ customers." },
          ].map((v) => (
            <div key={v.title} className="rounded-xl border border-border bg-card p-5 shadow-card-soft">
              <div className="grid h-10 w-10 place-items-center rounded-md bg-accent text-deep">
                <v.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-3 text-sm font-semibold">{v.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{v.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured */}
      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">Featured this week</h2>
            <p className="mt-1 text-sm text-muted-foreground">Best-selling appliances at our shop.</p>
          </div>
          <Link to="/sales" className="hidden text-sm font-medium text-primary hover:underline sm:inline">View all →</Link>
        </div>

        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((p) => (
            <Link key={p.id} to="/sales/$productId" params={{ productId: p.id }} className="group rounded-xl border border-border bg-card p-3 shadow-card-soft transition hover:-translate-y-0.5 hover:shadow-elev-soft">
              <ProductImage product={p} size="md" />
              <div className="mt-3 px-1">
                <div className="text-xs text-muted-foreground">{p.brand}</div>
                <div className="line-clamp-2 text-sm font-medium group-hover:text-primary">{p.name}</div>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-base font-semibold text-deep">₹{p.price.toLocaleString("en-IN")}</span>
                  <span className="text-xs text-muted-foreground line-through">₹{p.mrp.toLocaleString("en-IN")}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-2xl hero-gradient p-10 text-white shadow-elev-soft">
          <div className="grid items-center gap-6 lg:grid-cols-2">
            <div>
              <h3 className="font-display text-2xl font-semibold sm:text-3xl">Appliance acting up? We've got you.</h3>
              <p className="mt-2 max-w-lg text-white/85">From weak cooling to noisy drums — raise a ticket in under a minute. Our technician will reach you the same day.</p>
            </div>
            <div className="flex flex-wrap gap-3 lg:justify-end">
              <Link to="/services" className="inline-flex items-center gap-2 rounded-md bg-white px-5 py-3 text-sm font-semibold text-deep">
                Raise a request <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/contact" className="inline-flex items-center gap-2 rounded-md border border-white/30 px-5 py-3 text-sm font-semibold text-white hover:bg-white/10">
                Call us
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
