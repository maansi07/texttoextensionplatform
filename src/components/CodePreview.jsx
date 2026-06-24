import "./CodePreview.css";
import { motion, useReducedMotion } from 'framer-motion';

export default function CodePreview() {
  const reduce = useReducedMotion();

  const codeSnippet = `{
  "manifest_version": 3,
  "name": "Dark Mode Toggle",
  "version": "1.0.0",
  "description": "Toggle dark mode on any website instantly.",
  "permissions": ["activeTab", "scripting"],
  "action": {
    "default_popup": "popup.html",
    "default_icon": "icon.png"
  },
  "background": {
    "service_worker": "background.js"
  }
}`;

  return (
    <section className="code-preview">
      <div className="code-preview-inner">
        <div className="cp-header">
          <span className="tag tag-cyan">Output</span>
          <h2 className="cp-title">Real, Working Code</h2>
          <p className="cp-subtitle">We generate standard Chrome Extension manifests and scripts. No proprietary lock-in.</p>
        </div>

        <motion.div 
          className="cp-window glass-panel"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: reduce ? 0 : 0.5 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <div className="cp-window-header">
            <div className="cp-window-dots">
              <span></span><span></span><span></span>
            </div>
            <div className="cp-window-tab">manifest.json</div>
          </div>
          <div className="cp-window-body">
            <pre><code>{codeSnippet}</code></pre>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
