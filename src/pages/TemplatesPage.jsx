import "./TemplatesPage.css";
import { motion, useReducedMotion } from 'framer-motion';

const TEMPLATES = [
  { name: "Dark Mode Toggle", desc: "Add dark mode to any site", icon: "🌙", category: "Accessibility" },
  { name: "Tab Manager", desc: "Group and manage browser tabs", icon: "📑", category: "Productivity" },
  { name: "Ad Blocker", desc: "Block ads on any website", icon: "🚫", category: "Privacy" },
  { name: "Color Picker", desc: "Pick any color from screen", icon: "🎨", category: "Developer Tools" },
  { name: "Reading Timer", desc: "Estimate article reading time", icon: "⏱️", category: "Productivity" },
  { name: "Password Checker", desc: "Check password strength visually", icon: "🔒", category: "Security" },
];

export default function TemplatesPage({ setActiveTab, setPrompt }) {
  const reduce = useReducedMotion();
  const card = {
    hidden: { opacity: 0, y: 14 },
    show: (i) => ({ opacity: 1, y: 0, transition: { delay: reduce ? 0 : i * 0.06, duration: reduce ? 0 : 0.42 } })
  };

  return (
    <section className="templates-page">
      <div className="templates-inner">
        <div className="templates-header">
          <h2 className="templates-title">Starter Templates</h2>
          <p className="templates-sub">Pick a template to get started instantly</p>
        </div>
        <div className="templates-grid">
          {TEMPLATES.map((t, idx) => (
            <motion.div key={t.name} className="template-card" initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.15 }} variants={card} custom={idx}>
              <span className="template-icon">{t.icon}</span>
              <h3 className="template-name">{t.name}</h3>
              <p className="template-desc">{t.desc}</p>
              <span className="template-category">{t.category}</span>
              <button
                className="template-use-btn"
                onClick={() => { setPrompt(t.desc); setActiveTab("generator"); }}
              >
                Use Template
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}