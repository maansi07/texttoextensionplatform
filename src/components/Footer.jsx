import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <span className="logo-text" style={{ fontFamily: "var(--font-display)", fontWeight: 800 }}>
            ExtGen<span style={{ color: "var(--accent-cyan)" }}>.dev</span>
          </span>
          <p className="footer-tagline">Text-to-Extension Developer Platform</p>
        </div>
        <div className="footer-links">
          {["Docs", "GitHub", "API Reference", "Changelog"].map((link) => (
            <a key={link} href="#" className="footer-link">{link}</a>
          ))}
        </div>
        <p className="footer-copy">© 2026 ExtGen. Built for Zaalima internship project.</p>
      </div>
    </footer>
  );
}
