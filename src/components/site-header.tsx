import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import { Snowflake, ShoppingCart, Wrench, User, Menu, X, LogOut, ChevronDown, LayoutDashboard, Package, Ticket } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth-context";

const customerNavItems = [
  { to: "/sales", label: "Sales", icon: ShoppingCart },
  { to: "/services", label: "Services", icon: Wrench },
  { to: "/about", label: "About", icon: Snowflake },
  { to: "/contact", label: "Contact", icon: User },
];

const adminNavItems = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { to: "/admin/orders", label: "Orders", icon: Package },
  { to: "/admin/tickets", label: "Tickets", icon: Ticket },
];

export function SiteHeader() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [open, setOpen] = useState(false);
  const [dropOpen, setDropOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const dropRef = useRef<HTMLDivElement>(null);

  const isAdmin = user?.role === "admin";
  const navItems = isAdmin ? adminNavItems : customerNavItems;

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropRef.current && !dropRef.current.contains(e.target as Node)) {
        setDropOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleLogout = () => {
    logout();
    setDropOpen(false);
    setOpen(false);
    navigate({ to: "/" });
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link to={isAdmin ? "/admin" : "/"} className="flex items-center gap-2 group">
          <span className="grid h-9 w-9 place-items-center rounded-lg hero-gradient text-white shadow-elev-soft transition-transform group-hover:scale-105">
            <Snowflake className="h-5 w-5" />
          </span>
          <div className="leading-tight">
            <div className="font-display text-lg font-semibold tracking-tight">Arctic Circle</div>
            <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              {isAdmin ? "Admin Panel" : "Cooling · Service"}
            </div>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((it) => {
            const active = pathname === it.to || (it.to !== "/admin" && pathname.startsWith(it.to + "/"));
            return (
              <Link
                key={it.to}
                to={it.to}
                className={cn(
                  "rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  active
                    ? "bg-secondary text-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/60",
                )}
              >
                {it.label}
              </Link>
            );
          })}
        </nav>

        {/* Right side */}
        <div className="hidden md:flex items-center gap-2">
          {user ? (
            <div className="relative" ref={dropRef}>
              <button
                onClick={() => setDropOpen((v) => !v)}
                className="inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-3 py-1.5 text-sm font-medium hover:bg-secondary"
              >
                <div className="grid h-6 w-6 place-items-center rounded-full hero-gradient text-white text-xs font-semibold">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="max-w-[100px] truncate">{user.name.split(" ")[0]}</span>
                <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
              </button>
              {dropOpen && (
                <div className="absolute right-0 mt-1.5 w-48 rounded-xl border border-border bg-card py-1.5 shadow-elev-soft">
                  <div className="border-b border-border px-4 pb-2 pt-1">
                    <div className="text-xs font-medium truncate">{user.name}</div>
                    <div className="text-[11px] text-muted-foreground truncate">{user.email}</div>
                  </div>
                  {user.role === "customer" && (
                    <Link
                      to="/profile"
                      onClick={() => setDropOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-secondary"
                    >
                      <User className="h-3.5 w-3.5 text-muted-foreground" /> My profile
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2 px-4 py-2 text-sm text-destructive hover:bg-secondary"
                  >
                    <LogOut className="h-3.5 w-3.5" /> Log out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/login" className="rounded-md px-3 py-1.5 text-sm font-medium text-foreground hover:bg-secondary">
                Log in
              </Link>
              <Link to="/signup" className="rounded-md hero-gradient px-3.5 py-1.5 text-sm font-medium text-white shadow-card-soft hover:opacity-95">
                Sign up
              </Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setOpen((v) => !v)}
          className="md:hidden inline-flex h-9 w-9 items-center justify-center rounded-md border border-border"
          aria-label="Toggle menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-border bg-background">
          <div className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-3">
            {navItems.map((it) => (
              <Link
                key={it.to}
                to={it.to}
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-secondary"
              >
                <it.icon className="h-4 w-4 text-muted-foreground" />
                {it.label}
              </Link>
            ))}
            <div className="my-2 h-px bg-border" />
            {user ? (
              <>
                <div className="px-3 py-1.5">
                  <div className="text-xs font-medium">{user.name}</div>
                  <div className="text-[11px] text-muted-foreground">{user.email}</div>
                </div>
                {user.role === "customer" && (
                  <Link to="/profile" onClick={() => setOpen(false)} className="flex items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-secondary">
                    <User className="h-4 w-4 text-muted-foreground" /> My profile
                  </Link>
                )}
                <button onClick={handleLogout} className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-destructive hover:bg-secondary">
                  <LogOut className="h-4 w-4" /> Log out
                </button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setOpen(false)} className="rounded-md px-3 py-2 text-sm hover:bg-secondary">Log in</Link>
                <Link to="/signup" onClick={() => setOpen(false)} className="rounded-md hero-gradient px-3 py-2 text-sm font-medium text-white">Sign up</Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
