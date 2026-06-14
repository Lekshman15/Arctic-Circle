import { createFileRoute, Link } from "@tanstack/react-router";
import { Snowflake, Users, Wrench, Award, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Arctic Circle — Cooling Experts" },
      { name: "description", content: "Arctic Circle has been selling and servicing home appliances for 17 years. Meet the team and our promise." },
      { property: "og:title", content: "About Arctic Circle" },
      { property: "og:description", content: "17 years of trusted sales and service for home appliances." },
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
            <Snowflake className="h-3.5 w-3.5" /> Since 2008
          </span>
          <h1 className="mt-5 font-display text-4xl font-semibold tracking-tight sm:text-5xl">
            We've been keeping homes cool for 17 years.
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-white/85">
            Arctic Circle started as a small AC repair shop and grew into a trusted destination for buying and servicing
            appliances. We sell only what we'd put in our own homes — and we stand behind every install with in-house service.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <h2 className="font-display text-2xl font-semibold sm:text-3xl">Our story</h2>
            <div className="mt-5 space-y-4 text-muted-foreground">
              <p>
                Founded in 2008, Arctic Circle began with a single bay and one technician — fixing window ACs for the neighborhood.
                Word spread, and a few years later we opened a showroom stocking top-brand cooling appliances.
              </p>
              <p>
                Today we run a sales floor, a 6-member service team, and a fleet of vans covering the entire city.
                Every appliance we sell is installed by our own team, so the same hands that fitted it can service it later.
              </p>
              <p>
                We don't believe in fast-talking sales — we believe in matching the right appliance to the right home and being
                a phone call away when it needs care.
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-8 shadow-card-soft">
            <h3 className="font-display text-lg font-semibold">What we stand for</h3>
            <ul className="mt-5 space-y-5 text-sm">
              {[
                { icon: Award, title: "Genuine products only", body: "Authorized dealers for every brand we stock — full warranty, original spares." },
                { icon: Wrench, title: "Service is in-house", body: "No outsourced calls. Our technicians are on payroll and trained on every model we sell." },
                { icon: Users, title: "Customer-first pricing", body: "Honest quotes. Visit charge waived when you proceed with a repair." },
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

        <div className="mt-16 grid gap-4 sm:grid-cols-4">
          {[["17+", "Years in business"], ["12,000+", "Appliances installed"], ["6", "In-house technicians"], ["4.8★", "Avg. customer rating"]].map(([n, l]) => (
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
              <p className="mt-2 max-w-2xl text-white/85">Touch the appliances, talk to the team, and walk out with the right one for your home.</p>
            </div>
            <Link to="/contact" className="inline-flex items-center gap-2 rounded-md bg-white px-5 py-3 text-sm font-semibold text-deep">
              Get directions <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
