import "./Header.css";
import { motion, useReducedMotion } from 'framer-motion';
import { Home, Wand2, LayoutTemplate, LayoutDashboard } from 'lucide-react';
import NavHeader from "./ui/nav-header";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Header({ activeTab, setActiveTab }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const badge = user ? (user.plan === "pro" ? {
    text: "Pro",
    color: "#fbbf24",
    border: "rgba(251, 191, 36, 0.3)",
    bg: "rgba(251, 191, 36, 0.1)"
  } : user.plan === "builder" ? {
    text: "Builder",
    color: "#22d3ee",
    border: "rgba(34, 211, 238, 0.3)",
    bg: "rgba(34, 211, 238, 0.1)"
  } : {
    text: "Starter",
    color: "#a78bfa",
    border: "rgba(167, 139, 250, 0.3)",
    bg: "rgba(167, 139, 250, 0.1)"
  }) : null;

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const navLinks = [
    { id: "home", label: "Home", icon: Home },
    { id: "generator", label: "Generator", icon: Wand2 },
    { id: "templates", label: "Templates", icon: LayoutTemplate },
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  ];

  const reduce = useReducedMotion();

  return (
    <header className="header">
      <div className="header-inner">
        <div className="logo" onClick={() => setActiveTab("home")}>
          <div className="logo-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path
                d="M13 2L3 14H12L11 22L21 10H12L13 2Z"
                fill="url(#logoGrad)"
              />
              <defs>
                <linearGradient id="logoGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#00e5ff" />
                  <stop offset="100%" stopColor="#7c3aed" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <span className="logo-text">
            Extensio<span className="logo-accent">.ai</span>
          </span>
        </div>

        <div className="hidden md:block">
          <NavHeader activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>

        <div className="header-actions">
          <span className="nav-version">v1.0.0</span>

          <button
            className="btn btn-primary"
            style={{ padding: "8px 18px", fontSize: "0.8rem" }}
            onClick={() => setActiveTab("generator")}
          >
            Launch Builder
          </button>

          {user ? (
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div 
                onClick={() => navigate("/pricing")}
                style={{ 
                  cursor: "pointer",
                  fontSize: "0.72rem",
                  fontWeight: "700",
                  padding: "4px 10px",
                  borderRadius: "9999px",
                  backgroundColor: badge?.bg,
                  border: `1px solid ${badge?.border}`,
                  color: badge?.color,
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  transition: "all 0.2s ease"
                }}
                title="Manage Subscription"
              >
                {badge?.text}
              </div>
              <div 
                style={{ 
                  display: "flex", 
                  alignItems: "center", 
                  justifyContent: "center", 
                  width: "32px", 
                  height: "32px", 
                  borderRadius: "50%", 
                  background: "linear-gradient(135deg, #00e5ff, #7c3aed)", 
                  color: "#000", 
                  fontWeight: "bold",
                  fontSize: "0.85rem",
                  fontFamily: "var(--font-mono)"
                }}
                title={user.email}
              >
                {(user.name || user.email)[0].toUpperCase()}
              </div>
              <button
                className="btn-outline-auth"
                style={{ padding: "6px 14px", fontSize: "0.75rem" }}
                onClick={handleLogout}
              >
                Sign Out
              </button>
            </div>
          ) : (
            <button
              className="btn-outline-auth"
              onClick={() => navigate("/login")}
            >
              Sign In
            </button>
          )}
        </div>
      </div>
    </header>
  );
}