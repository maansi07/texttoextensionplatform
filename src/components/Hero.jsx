import "./Hero.css";

export default function Hero({ setActiveTab }) {
  return (
    <section className="hero">
      <div className="hero-bg">
        <div className="hero-orb hero-orb-1"></div>
        <div className="hero-orb hero-orb-2"></div>
        <div className="hero-grid"></div>
      </div>

      <div className="hero-inner">
        <div className="hero-badge">
          <span className="tag tag-cyan">
            <span>⚡</span> Developer Platform — Beta
          </span>
        </div>

        <h1 className="hero-title">
  No-Code
  <br />
  <span className="hero-title-gradient">Extension Factory</span>
</h1>

<p className="hero-subtitle">
  Describe your browser extension in plain English.
  Extensio.ai generates production-ready Chrome, Firefox,
  and Edge extensions — complete with manifest, scripts,
  and popup UI. Download and install in seconds.
</p>

        <div className="hero-terminal">
          <div className="terminal-bar">
            <div className="terminal-dots">
              <span></span><span></span><span></span>
            </div>
            <span className="terminal-title">ExtGen CLI</span>
          </div>
          <div className="terminal-body">
            <div className="terminal-line">
              <span className="term-prompt">$</span>
              <span className="term-cmd"> extgen create</span>
              <span className="term-string"> "dark mode toggle for any website"</span>
            </div>
            <div className="terminal-line term-output">
              <span className="term-success">✓</span> Analyzing requirements...
            </div>
            <div className="terminal-line term-output">
              <span className="term-success">✓</span> Generating manifest.json
            </div>
            <div className="terminal-line term-output">
              <span className="term-success">✓</span> Creating content_script.js + popup.html
            </div>
            <div className="terminal-line term-output">
              <span className="term-cyan">→</span> Extension ready in <span className="term-highlight">./dark-mode-toggle/</span>
            </div>
          </div>
        </div>

        <div className="hero-actions">
          <button className="btn btn-primary" onClick={() => setActiveTab("generator")}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="5 3 19 12 5 21 5 3"/>
            </svg>
            Start Building
          </button>
          <button className="btn btn-secondary" onClick={() => setActiveTab("dashboard")}>
            View Examples
          </button>
        </div>

        <div className="hero-stats">
          {[
            { value: "500+", label: "Extensions Generated" },
            { value: "3", label: "Browsers Supported" },
            { value: "< 30s", label: "Generation Time" },
          ].map((stat) => (
            <div key={stat.label} className="stat-item">
              <span className="stat-value">{stat.value}</span>
              <span className="stat-label">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
