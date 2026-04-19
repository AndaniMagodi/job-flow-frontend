import { useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const navItems = [
  { to: "/", label: "Dashboard" },
  { to: "/applications", label: "Applications" },
  { to: "/applications/new", label: "Add Application" },
];

export default function Layout() {
  const location = useLocation();
  const { logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-10 bg-[#0f0f0f]">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-indigo-500" />
            <span className="text-sm font-semibold text-white">JobFlow</span>
          </div>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const active = location.pathname === item.to;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`rounded-md px-3 py-1.5 text-sm transition ${
                    active
                      ? "bg-[#1f1f1f] text-white"
                      : "text-[#888] hover:text-[#ccc]"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
            <button
              onClick={logout}
              className="ml-2 rounded-md px-3 py-1.5 text-sm text-[#555] hover:text-[#888] transition"
            >
              Sign out
            </button>
          </nav>

          {/* Mobile hamburger */}
          <button
            className="md:hidden flex flex-col gap-1 p-2"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <span className="block h-0.5 w-5 bg-white" />
            <span className="block h-0.5 w-5 bg-white" />
            <span className="block h-0.5 w-5 bg-white" />
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-[#1f1f1f] px-4 py-3 space-y-1">
            {navItems.map((item) => {
              const active = location.pathname === item.to;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setMenuOpen(false)}
                  className={`block rounded-md px-3 py-2 text-sm transition ${
                    active
                      ? "bg-[#1f1f1f] text-white"
                      : "text-[#888] hover:text-[#ccc]"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
            <button
              onClick={logout}
              className="block w-full text-left rounded-md px-3 py-2 text-sm text-[#555]"
            >
              Sign out
            </button>
          </div>
        )}
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}