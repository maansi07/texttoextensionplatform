import { Link } from "react-router-dom";
import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-top">
          <div className="footer-brand">
            <span className="logo-text" style={{ fontFamily: "var(--font-display)", fontWeight: 800 }}>
              Extensio<span style={{ color: "var(--accent-cyan)" }}>.ai</span>
            </span>
            <p className="footer-tagline">
              The No-Code Browser Extension Factory.<br />
              Turn your ideas into working extensions instantly with AI.
            </p>
          </div>
          
          <div className="footer-links-grid">
            <div className="footer-col">
              <h4>Product</h4>
              <Link to="/generator">Generator</Link>
              <Link to="/templates">Templates</Link>
              <Link to="/dashboard">Dashboard</Link>
            </div>
            <div className="footer-col">
              <h4>Resources</h4>
              <a href="/docs">Documentation</a>
              <a href="/api-reference">API Reference</a>
              <a href="https://github.com/maansi07/texttoextensionplatform" target="_blank" rel="noopener noreferrer">GitHub Repo</a>
            </div>
            <div className="footer-col">
              <h4>Company</h4>
              <a href="/#hero">About</a>
              <a href="/#features">Features</a>
              <Link to="/contact">Contact</Link>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p className="footer-copy">© 2026 Extensio.ai. Built for Zaalima internship project.</p>
        </div>
      </div>
    </footer>
  );
}
