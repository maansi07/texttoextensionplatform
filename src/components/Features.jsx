import "./Features.css";
import { motion, useReducedMotion } from 'framer-motion';

const FEATURES = [
  {
    icon: "⚡",
    title: "AI-Powered Generation",
    desc: "Describe your extension in plain English. Gemini 2.0 Flash understands intent and generates complete, working code instantly.",
    tag: "Core",
  },
  {
    icon: "🌐",
    title: "Multi-Browser Support",
    desc: "Generate extensions for Chrome MV3, Firefox WebExtensions, and Microsoft Edge — all from a single prompt.",
    tag: "Compatibility",
  },
  {
    icon: "📦",
    title: "Instant .zip Download",
    desc: "Get a ready-to-install .zip package containing manifest, scripts, and popup UI — load it directly in your browser.",
    tag: "Output",
  },
  {
    icon: "🔒",
    title: "Security-First Code",
    desc: "Generated extensions follow CSP best practices, minimal permissions, and secure messaging patterns.",
    tag: "Security",
  },
  {
    icon: "🚀",
    title: "Node.js Backend",
    desc: "Express REST API with Gemini AI integration, archiver zip packaging, and in-memory extension store.",
    tag: "Backend",
  },
  {
    icon: "🎨",
    title: "No Code Required",
    desc: "Built for everyone — developers and non-technical users alike. If you can describe it, Extensio.ai can build it.",
    tag: "Accessibility",
  },
];


export default function Features() {
  const reduce = useReducedMotion();
  const item = {
    hidden: { opacity: 0, y: 18 },
    show: (i) => ({ opacity: 1, y: 0, transition: { delay: reduce ? 0 : i * 0.08, duration: reduce ? 0 : 0.45, ease: 'easeOut' } })
  };

  return (
    <section className="features">
      <div className="features-inner">
        <div className="features-header">
          <span className="tag tag-green">Platform Features</span>
          <h2 className="features-title">Everything you need to ship</h2>
        </div>

        <div className="features-grid">
          {FEATURES.map((f, idx) => (
            <motion.div
              key={f.title}
              className="feature-card"
              variants={item}
              custom={idx}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.15 }}
            >
              <div className="feature-icon">{f.icon}</div>
              <div className="feature-content">
                <div className="feature-top">
                  <h3 className="feature-name">{f.title}</h3>
                  <span className="tag tag-purple" style={{ fontSize: "0.7rem" }}>{f.tag}</span>
                </div>
                <p className="feature-desc">{f.desc}</p>
              </div>
            </motion.div>
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
