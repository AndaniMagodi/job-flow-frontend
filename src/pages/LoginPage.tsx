import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      mode === "login"
        ? await login(email, password)
        : await register(email, password);
      navigate("/");
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 400, margin: "80px auto", padding: "0 1rem" }}>
      <h1>{mode === "login" ? "Sign in" : "Create account"}</h1>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 12 }}>
          <input type="email" placeholder="Email" value={email}
            onChange={e => setEmail(e.target.value)} required
            style={{ width: "100%", padding: "8px 12px" }} />
        </div>
        <div style={{ marginBottom: 12 }}>
          <input type="password" placeholder="Password" value={password}
            onChange={e => setPassword(e.target.value)} required
            style={{ width: "100%", padding: "8px 12px" }} />
        </div>
        {error && <p style={{ color: "red", fontSize: 13, marginBottom: 12 }}>{error}</p>}
        <button type="submit" disabled={loading} style={{ width: "100%" }}>
          {loading ? "Please wait..." : mode === "login" ? "Sign in" : "Register"}
        </button>
      </form>
      <p style={{ marginTop: 16, fontSize: 13, textAlign: "center" }}>
        {mode === "login" ? "No account? " : "Already have one? "}
        <button onClick={() => setMode(mode === "login" ? "register" : "login")}
          style={{ background: "none", border: "none", cursor: "pointer", textDecoration: "underline" }}>
          {mode === "login" ? "Register" : "Sign in"}
        </button>
      </p>
    </div>
  );
}