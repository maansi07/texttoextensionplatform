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
              <a href="#">Generator</a>
              <a href="#">Templates</a>
              <a href="#">Dashboard</a>
            </div>
            <div className="footer-col">
              <h4>Resources</h4>
              <a href="#">Documentation</a>
              <a href="#">API Reference</a>
              <a href="#">GitHub Repo</a>
            </div>
            <div className="footer-col">
              <h4>Company</h4>
              <a href="#">About</a>
              <a href="#">Blog</a>
              <a href="#">Contact</a>
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
