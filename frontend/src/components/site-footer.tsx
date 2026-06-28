import { Link } from "@tanstack/react-router";
import { Snowflake, Phone, Mail, MapPin } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-secondary/40 mt-24">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-4 lg:px-8">
        <div>
          <div className="flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-md hero-gradient text-white">
              <Snowflake className="h-4 w-4" />
            </span>
            <span className="font-display text-base font-semibold">Arctic Circle</span>
          </div>
          <p className="mt-3 text-sm text-muted-foreground max-w-xs">
            Sales & expert service for ACs, refrigerators, washing machines and stabilizers — trusted since 2008.
          </p>
        </div>

        <div>
          <h4 className="text-sm font-semibold">Shop</h4>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li><Link to="/sales" className="hover:text-foreground">Air Conditioners</Link></li>
            <li><Link to="/sales" className="hover:text-foreground">Refrigerators</Link></li>
            <li><Link to="/sales" className="hover:text-foreground">Washing Machines</Link></li>
            <li><Link to="/sales" className="hover:text-foreground">Stabilizers</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold">Support</h4>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li><Link to="/services" className="hover:text-foreground">Raise a service request</Link></li>
            <li><Link to="/about" className="hover:text-foreground">About us</Link></li>
            <li><Link to="/contact" className="hover:text-foreground">Contact</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold">Reach us</h4>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2"><Phone className="h-4 w-4 mt-0.5" /> +91 98xxx 00000</li>
            <li className="flex items-start gap-2"><Mail className="h-4 w-4 mt-0.5" /> hello@arcticcircle.in</li>
            <li className="flex items-start gap-2"><MapPin className="h-4 w-4 mt-0.5" /> Shop No. 12, Main Road, India</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 text-xs text-muted-foreground sm:px-6 lg:px-8">
          <span>© {new Date().getFullYear()} Arctic Circle. All rights reserved.</span>
          <span>UI design draft — for client review</span>
        </div>
      </div>
    </footer>
  );
}
