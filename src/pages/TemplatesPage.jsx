import "./TemplatesPage.css";

const TEMPLATES = [
  { name: "Dark Mode Toggle", desc: "Add dark mode to any site", icon: "🌙", category: "Accessibility" },
  { name: "Tab Manager", desc: "Group and manage browser tabs", icon: "📑", category: "Productivity" },
  { name: "Ad Blocker", desc: "Block ads on any website", icon: "🚫", category: "Privacy" },
  { name: "Color Picker", desc: "Pick any color from screen", icon: "🎨", category: "Developer Tools" },
  { name: "Reading Timer", desc: "Estimate article reading time", icon: "⏱️", category: "Productivity" },
  { name: "Password Checker", desc: "Check password strength visually", icon: "🔒", category: "Security" },
];

export default function TemplatesPage({ setActiveTab, setPrompt }) {
  return (
    <section className="templates-page">
      <div className="templates-inner">
        <div className="templates-header">
          <h2 className="templates-title">Starter Templates</h2>
          <p className="templates-sub">Pick a template to get started instantly</p>
        </div>
        <div className="templates-grid">
          {TEMPLATES.map((t) => (
            <div key={t.name} className="template-card">
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
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}