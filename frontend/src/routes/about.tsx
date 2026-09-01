import { createFileRoute, Link } from "@tanstack/react-router";
import { Snowflake, Users, Wrench, Award, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Arctic Circle — Since 1993" },
      { name: "description", content: "Learn about Arctic Circle, established in 1993 and built on decades of AC sales and service experience." },
      { property: "og:title", content: "About Arctic Circle" },
      { property: "og:description", content: "Over three decades of trusted AC sales and service." },
    ],
  }),
  component: About,
});

function About() {
  return (
    <div>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 hero-gradient opacity-95" />
        <div className="relative mx-auto max-w-4xl px-4 py-20 text-center text-white sm:px-6 lg:px-8 lg:py-28">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-medium backdrop-blur">
            <Snowflake className="h-3.5 w-3.5" /> Established in 1993
          </span>
          <h1 className="mt-5 font-display text-4xl font-semibold tracking-tight sm:text-5xl">
            Over three decades of keeping Chennai comfortable.
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-white/85">
            Arctic Circle is built on experience, honest advice and dependable after-sales support for air conditioners and stabilizers.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <h2 className="font-display text-2xl font-semibold sm:text-3xl">Our story</h2>
            <div className="mt-5 space-y-4 text-muted-foreground">
              <p>
                Arctic Circle was established in 1993 by B N Sridhar, an experienced professional in the air-conditioning field with more than 35 years of industry experience. Before starting Arctic Circle, he worked with Voltas as an AC technician assistant, gaining valuable hands-on knowledge of installation, maintenance and repair.
              </p>
              <p>
                Since then, Arctic Circle has grown through the trust of its customers and has served more than 25,000 customers in total. We continue to provide dependable sales and service with the same commitment to quality and customer satisfaction.
              </p>
              <p>
                Today, our focus remains simple: help customers choose the right AC or stabilizer, provide professional service, and be available when they need us. Our experience allows us to offer practical recommendations based on the customer's needs rather than simply selling a product.
              </p>
              <p>
                We also offer second-hand ACs for customers looking for more economical cooling solutions, subject to availability.
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-8 shadow-card-soft">
            <h3 className="font-display text-lg font-semibold">What we stand for</h3>
            <ul className="mt-5 space-y-5 text-sm">
              {[
                { icon: Award, title: "Experience you can trust", body: "More than three decades of practical experience in the air-conditioning field." },
                { icon: Wrench, title: "Reliable service", body: "Professional AC service backed by hands-on technical knowledge and customer support." },
                { icon: Users, title: "Customer-first approach", body: "Clear guidance, honest recommendations and a long-term relationship with every customer." },
              ].map((v) => (
                <li key={v.title} className="flex gap-3">
                  <div className="grid h-9 w-9 shrink-0 place-items-center rounded-md bg-accent text-deep">
                    <v.icon className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="font-semibold">{v.title}</div>
                    <div className="text-muted-foreground">{v.body}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-16 grid gap-4 sm:grid-cols-3">
          {[["1993", "Established"], ["25,000+", "Customers served"], ["35+", "Years of industry experience"]].map(([n, l]) => (
            <div key={l} className="rounded-xl border border-border bg-card p-6 text-center shadow-card-soft">
              <div className="font-display text-3xl font-semibold text-deep">{n}</div>
              <div className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">{l}</div>
            </div>
          ))}
        </div>

        <div className="mt-16 rounded-2xl hero-gradient p-10 text-white">
          <div className="grid items-center gap-6 lg:grid-cols-[1fr_auto]">
            <div>
              <h3 className="font-display text-2xl font-semibold">Come visit our showroom.</h3>
              <p className="mt-2 max-w-2xl text-white/85">Visit us at K. K. Nagar, Chennai to discuss your AC, stabilizer or second-hand AC requirements.</p>
            </div>
            <Link to="/contact" className="inline-flex items-center gap-2 rounded-md bg-white px-5 py-3 text-sm font-semibold text-deep">
              Contact us <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
