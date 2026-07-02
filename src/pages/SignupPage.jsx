import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "./LoginPage.css";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setError("Please fill in all fields");
      return;
    }
    setError("");
    setLoading(true);
    try {
      await register(name, email, password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Failed to create account. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h2 className="auth-title">Create account</h2>
        <p className="auth-sub">Join Extensio.ai for free</p>

        {error && <div style={{ color: "#ef4444", fontSize: "0.85rem", fontFamily: "var(--font-mono)", background: "rgba(239, 68, 68, 0.1)", padding: "10px", borderRadius: "8px", border: "1px solid rgba(239, 68, 68, 0.2)" }}>{error}</div>}

        <input 
          className="auth-input" 
          type="text" 
          placeholder="Full Name" 
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input 
          className="auth-input" 
          type="email" 
          placeholder="Email" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input 
          className="auth-input" 
          type="password" 
          placeholder="Password" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button className="auth-btn" type="submit" disabled={loading}>
          {loading ? "Creating Account..." : "Create Account"}
        </button>
        <p className="auth-link">
          Already have an account? <span onClick={() => navigate("/login")}>Sign in</span>
        </p>
      </form>
    </div>
  );
}