import { useState } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  Bell,
  Bookmark,
  Briefcase,
  LayoutDashboard,
  Menu,
  Search,
  Signal,
  SignalLow,
  X,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useDataSaver } from "../context/DataSaverContext";

const navItems = [
  { to: "/jobs", label: "Find jobs", icon: Search },
  { to: "/saved", label: "Saved", icon: Bookmark },
  { to: "/alerts", label: "Alerts", icon: Bell },
  { to: "/applications", label: "My applications", icon: Briefcase },
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
];

export default function Layout() {
  const { logout } = useAuth();
  const { dataSaver, setDataSaver } = useDataSaver();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  function handleSignOut() {
    logout();
    navigate("/login");
  }

  return (
    <div className="min-h-screen bg-[var(--surface)]">
      <header className="sticky top-0 z-20 border-b border-[var(--border)] bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-5">
          <div className="flex items-center gap-8">
            <Link to="/jobs" className="flex items-center gap-2.5 no-underline">
              <span
                aria-hidden
                className="grid h-8 w-8 place-items-center rounded-lg bg-[var(--primary)] text-[15px] font-bold text-white"
              >
                J
              </span>
              <span className="text-[17px] font-semibold tracking-[-0.02em] text-[var(--foreground)]">
                JobFlow
              </span>
              <span className="hidden rounded-full bg-[var(--primary-soft)] px-2 py-0.5 text-[11px] font-medium text-[var(--accent-foreground)] sm:inline">
                South Africa
              </span>
            </Link>

            <nav className="hidden items-center gap-1 md:flex">
              {navItems.map(({ to, label, icon: Icon }) => (
                <NavLink
                  key={to}
                  to={to}
                  className={({ isActive }) =>
                    [
                      "flex items-center gap-1.5 rounded-lg px-3 py-2 text-[13.5px] font-medium no-underline transition-colors",
                      isActive
                        ? "bg-[var(--primary-soft)] text-[var(--accent-foreground)]"
                        : "text-[var(--muted-foreground)] hover:bg-[var(--muted)] hover:text-[var(--foreground)]",
                    ].join(" ")
                  }
                >
                  <Icon size={15} strokeWidth={2} />
                  {label}
                </NavLink>
              ))}
            </nav>
          </div>

          <div className="hidden items-center gap-2 md:flex">
            <button
              onClick={() => setDataSaver(!dataSaver)}
              title={
                dataSaver
                  ? "Data-light mode is on — fewer results, no webfont download"
                  : "Turn on data-light mode to use less mobile data"
              }
              aria-pressed={dataSaver}
              className={[
                "flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-[12.5px] font-medium transition-colors",
                dataSaver
                  ? "bg-[var(--success-soft)] text-[var(--success)]"
                  : "text-[var(--muted-foreground)] hover:bg-[var(--muted)]",
              ].join(" ")}
            >
              {dataSaver ? <SignalLow size={15} /> : <Signal size={15} />}
              {dataSaver ? "Data-light" : "Data"}
            </button>
            <button
              onClick={() => navigate("/applications/new")}
              className="rounded-lg border border-[var(--input)] bg-white px-3.5 py-2 text-[13px] font-medium text-[var(--foreground)] transition-colors hover:bg-[var(--muted)]"
            >
              Log application
            </button>
            <button
              onClick={handleSignOut}
              className="rounded-lg px-3 py-2 text-[13px] font-medium text-[var(--muted-foreground)] transition-colors hover:text-[var(--foreground)]"
            >
              Sign out
            </button>
          </div>

          <button
            className="rounded-lg p-2 text-[var(--foreground)] md:hidden"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {menuOpen && (
          <nav className="border-t border-[var(--border)] bg-white px-3 py-2 md:hidden">
            {navItems.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  [
                    "flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium no-underline",
                    isActive
                      ? "bg-[var(--primary-soft)] text-[var(--accent-foreground)]"
                      : "text-[var(--muted-foreground)]",
                  ].join(" ")
                }
              >
                <Icon size={16} />
                {label}
              </NavLink>
            ))}
            <div className="my-2 h-px bg-[var(--border)]" />
            <button
              onClick={() => setDataSaver(!dataSaver)}
              className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-[var(--foreground)]"
            >
              {dataSaver ? (
                <SignalLow size={16} className="text-[var(--success)]" />
              ) : (
                <Signal size={16} className="text-[var(--muted-foreground)]" />
              )}
              Data-light mode
              <span className="ml-auto text-[12px] text-[var(--muted-foreground)]">
                {dataSaver ? "On" : "Off"}
              </span>
            </button>
            <button
              onClick={() => {
                navigate("/applications/new");
                setMenuOpen(false);
              }}
              className="w-full rounded-lg px-3 py-2.5 text-left text-sm font-medium text-[var(--primary)]"
            >
              Log application
            </button>
            <button
              onClick={handleSignOut}
              className="w-full rounded-lg px-3 py-2.5 text-left text-sm font-medium text-[var(--muted-foreground)]"
            >
              Sign out
            </button>
          </nav>
        )}
      </header>

      <main className="mx-auto w-full max-w-6xl px-5 py-8">
        <Outlet />
      </main>
    </div>
  );
}
