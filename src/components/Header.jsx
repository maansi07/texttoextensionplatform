import "./Header.css";
import { motion, useReducedMotion } from 'framer-motion';
import { Home, Wand2, LayoutTemplate, LayoutDashboard } from 'lucide-react';

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

        <nav className="nav-tabs">
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <button
                key={link.id}
                className={`nav-tab ${activeTab === link.id ? "active" : ""}`}
                onClick={() => setActiveTab(link.id)}
              >
                {!reduce && activeTab === link.id && (
                  <motion.div
                    layoutId="nav-pill"
                    className="nav-pill-bg"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                {reduce && activeTab === link.id && (
                  <div className="nav-pill-bg" />
                )}
                <span className="nav-tab-label">
                  <Icon size={16} />
                  {link.label}
                </span>
              </button>
            );
          })}
        </nav>

        <div className="header-actions">
          <div className="status-badge">
            <span className="status-dot"></span>
            <span>v1.0.0</span>
          </div>

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