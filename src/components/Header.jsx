import "./Header.css";
import { motion, useReducedMotion } from 'framer-motion';
import { Home, Wand2, LayoutTemplate, LayoutDashboard } from 'lucide-react';
import NavHeader from "./ui/nav-header";

export default function Header({ activeTab, setActiveTab }) {
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
        </div>
      </div>
    </header>
  );
}