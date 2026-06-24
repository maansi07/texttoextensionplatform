import "./Features.css";
import { motion, useReducedMotion } from 'framer-motion';
import SpotlightCard from './ui/SpotlightCard';

import { Cpu, Globe, Download, ShieldCheck, Layers, MousePointerClick } from 'lucide-react';

const FEATURES = [
  {
    icon: Cpu,
    title: 'AI-Powered Generation',
    body: 'Describe your extension in plain English. The model understands intent and writes production-ready manifest, scripts, and popup UI.',
  },
  {
    icon: Globe,
    title: 'Multi-Browser Output',
    body: 'Chrome MV3, Firefox WebExtensions, and Microsoft Edge — all from a single prompt, with correct manifests for each target.',
  },
  {
    icon: Download,
    title: 'Instant .zip Download',
    body: 'Get a ready-to-install package the moment generation completes. Load unpacked in Chrome Developer Mode in under a minute.',
  },
  {
    icon: ShieldCheck,
    title: 'Secure by Default',
    body: 'Every extension follows CSP best practices, uses minimal permissions, and avoids broad host access unless the prompt requires it.',
  },
  {
    icon: Layers,
    title: 'Full Stack Output',
    body: 'Not just manifest.json — the generator produces content scripts, background workers, popup HTML, and injected CSS together.',
  },
  {
    icon: MousePointerClick,
    title: 'No Code Required',
    body: 'Built for developers and non-technical users alike. If you can describe what you want, Extensio.ai can ship it.',
  },
];


export default function Features() {
  const reduce = useReducedMotion();
  const item = {
    hidden: { opacity: 0, y: 18 },
    show: (i) => ({ opacity: 1, y: 0, transition: { delay: reduce ? 0 : i * 0.08, duration: reduce ? 0 : 0.45, ease: 'easeOut' } })
  };

  return (
    <section id="features" className="features">
      <div className="features-inner">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          <div className="features-header">
            <h2 className="features-title">Everything in the stack.</h2>
            <p className="features-subtext">From prompt to installed extension in under 30 seconds.</p>
          </div>

          <div className="features-grid">
            {FEATURES.map((f, idx) => {
              const Icon = f.icon;
              return (
                <SpotlightCard key={f.title} className="feature-card">
                  <div className="feature-icon"><Icon size={20} /></div>
                  <div className="feature-content">
                    <h3 className="feature-name">{f.title}</h3>
                    <p className="feature-desc">{f.body}</p>
                  </div>
                </SpotlightCard>
              );
            })}
          </div>
        </motion.div>

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
