import "./Features.css";

const FEATURES = [
  {
    icon: "⚡",
    title: "AI-Powered Generation",
    desc: "Describe your extension in plain English. Our AI understands intent and generates complete, working code.",
    tag: "Core",
  },
  {
    icon: "🌐",
    title: "Multi-Browser Support",
    desc: "Generate extensions compatible with Chrome MV3, Firefox WebExtensions, and Microsoft Edge.",
    tag: "Compatibility",
  },
  {
    icon: "📁",
    title: "Complete Package",
    desc: "Get manifest.json, background scripts, content scripts, popup UI, and icons — all in one download.",
    tag: "Output",
  },
  {
    icon: "🔒",
    title: "Security-First Code",
    desc: "Generated extensions follow CSP best practices, minimal permissions, and secure messaging patterns.",
    tag: "Security",
  },
  {
    icon: "☕",
    title: "Java Backend API",
    desc: "Spring Boot REST API powering the generation engine — scalable, documented, and developer-friendly.",
    tag: "Backend",
  },
  {
    icon: "🚀",
    title: "One-Click Deploy",
    desc: "Export a production-ready .zip ready to upload directly to the Chrome Web Store or Firefox Add-ons.",
    tag: "Deploy",
  },
];

export default function Features() {
  return (
    <section className="features">
      <div className="features-inner">
        <div className="features-header">
          <span className="tag tag-green">Platform Features</span>
          <h2 className="features-title">Everything you need to ship</h2>
        </div>

        <div className="features-grid">
          {FEATURES.map((f) => (
            <div key={f.title} className="feature-card">
              <div className="feature-icon">{f.icon}</div>
              <div className="feature-content">
                <div className="feature-top">
                  <h3 className="feature-name">{f.title}</h3>
                  <span className="tag tag-purple" style={{ fontSize: "0.7rem" }}>{f.tag}</span>
                </div>
                <p className="feature-desc">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Java Backend section */}
        <div className="stack-banner">
          <div className="stack-text">
            <span className="tag tag-cyan">Tech Stack</span>
            <h3 className="stack-title">Built with React + Java Spring Boot</h3>
            <p className="stack-desc">
              Frontend built in React 18 with Vite. Backend powered by Java 17 + Spring Boot 3 REST API.
              HTML/CSS popup templates. Packaged and deployed via GitHub Actions.
            </p>
          </div>
          <div className="stack-badges">
            {["React 18", "Java 17", "Spring Boot 3", "Vite", "GitHub Actions", "REST API"].map((tech) => (
              <span key={tech} className="tech-badge">{tech}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
