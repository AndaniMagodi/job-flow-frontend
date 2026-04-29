import { useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const navItems = [
  { to: "/", label: "Dashboard" },
  { to: "/applications", label: "Applications" },
];

export default function Layout() {
  const location = useLocation();
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen" style={{ background: "#111", fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', system-ui, sans-serif" }}>
      <header className="sticky top-0 z-10" style={{ background: "#111", borderBottom: "1px solid #1e1e1e", height: 56, display: "flex", alignItems: "center" }}>
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-5">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#6366f1" }} />
              <span style={{ color: "#fff", fontSize: 15, fontWeight: 600, letterSpacing: "-0.3px" }}>
                JobFlow
              </span>
            </div>
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => {
                const active = location.pathname === item.to;
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    style={{
                      color: active ? "#fff" : "#555",
                      background: active ? "#1e1e1e" : "transparent",
                      fontSize: 13,
                      padding: "6px 12px",
                      borderRadius: 8,
                      textDecoration: "none",
                      transition: "color 0.15s",
                    }}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="hidden md:flex items-center gap-2">
            <button
              onClick={() => navigate("/applications/new")}
              style={{ background: "#6366f1", color: "#fff", fontSize: 12, fontWeight: 600, padding: "8px 16px", borderRadius: 20, border: "none", cursor: "pointer", letterSpacing: "0.2px" }}
            >
              + Log application
            </button>
            <button
              onClick={logout}
              style={{ background: "transparent", color: "#555", fontSize: 12, padding: "8px 12px", border: "1px solid #2a2a2a", borderRadius: 8, cursor: "pointer" }}
            >
              Sign out
            </button>
          </div>

          <button
            className="md:hidden"
            onClick={() => setMenuOpen(!menuOpen)}
            style={{ background: "none", border: "none", cursor: "pointer", padding: 8 }}
          >
            <div style={{ width: 20, height: 1, background: "#fff", marginBottom: 5 }} />
            <div style={{ width: 20, height: 1, background: "#fff", marginBottom: 5 }} />
            <div style={{ width: 20, height: 1, background: "#fff" }} />
          </button>
        </div>
      </header>

      {menuOpen && (
        <div style={{ background: "#111", borderBottom: "1px solid #1e1e1e", padding: "12px 20px" }}>
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setMenuOpen(false)}
              style={{ display: "block", color: "#888", fontSize: 13, padding: "8px 12px", textDecoration: "none" }}
            >
              {item.label}
            </Link>
          ))}
          <button
            onClick={() => { navigate("/applications/new"); setMenuOpen(false); }}
            style={{ display: "block", width: "100%", textAlign: "left", color: "#6366f1", fontSize: 13, padding: "8px 12px", background: "none", border: "none", cursor: "pointer" }}
          >
            + Log application
          </button>
          <button
            onClick={logout}
            style={{ display: "block", width: "100%", textAlign: "left", color: "#555", fontSize: 13, padding: "8px 12px", background: "none", border: "none", cursor: "pointer" }}
          >
            Sign out
          </button>
        </div>
      )}

      <main className="mx-auto max-w-5xl px-5 py-7">
        <Outlet />
      </main>
    </div>
  );
}