import "./Hero.css";
import { motion, useReducedMotion } from 'framer-motion';
import CountUp from './CountUp';

export default function Hero({ setActiveTab }) {
  const reduce = useReducedMotion();
  const container = {
    hidden: {},
    show: { transition: { staggerChildren: reduce ? 0 : 0.09 } }
  };
  const item = {
    hidden: { opacity: 0, y: 14 },
    show: { opacity: 1, y: 0, transition: { duration: reduce ? 0 : 0.45, ease: 'easeOut' } }
  };

  return (
    <section className="hero">
      <div className="hero-bg">
        <div className="hero-orb hero-orb-1"></div>
        <div className="hero-orb hero-orb-2"></div>
        <div className="hero-grid"></div>
      </div>

      <div className="hero-inner">

        <motion.div initial="hidden" animate="show" variants={container}>
        <div className="hero-badge">
          <motion.span className="tag tag-cyan" variants={item}>
            <span>⚡</span> Developer Platform — Beta
          </motion.span>
        </div>
          <motion.h1 className="hero-title" variants={item}>
            No-Code
            <br />
            <span className="hero-title-gradient">Extension Factory</span>
          </motion.h1>

          <motion.div className="glass-panel" variants={item}>
            <p className="hero-subtitle" style={{ margin: 0 }}>
              Describe your browser extension in plain English.
              Extensio.ai generates production-ready Chrome, Firefox,
              and Edge extensions — complete with manifest, scripts,
              and popup UI. Download and install in seconds.
            </p>
          </motion.div>

          <motion.div className="hero-terminal" variants={item}>
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
          </motion.div>

          <div className="hero-actions">
            <motion.button
              className="btn btn-primary"
              variants={item}
              whileHover={
                reduce
                  ? {}
                  : { scale: 1.03, filter: 'brightness(1.06) drop-shadow(0 8px 22px rgba(124,58,237,0.12))', transition: { duration: 0.16 } }
              }
              whileTap={reduce ? {} : { scale: 0.97, transition: { duration: 0.12 } }}
              onClick={() => setActiveTab("generator") }
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="5 3 19 12 5 21 5 3"/>
              </svg>
              Start Building
            </motion.button>
            <motion.button
              className="btn btn-secondary"
              variants={item}
              whileHover={reduce ? {} : { scale: 1.03, filter: 'brightness(1.06)', transition: { duration: 0.16 } }}
              whileTap={reduce ? {} : { scale: 0.97, transition: { duration: 0.12 } }}
              onClick={() => setActiveTab("dashboard") }
            >
              View Examples
            </motion.button>
          </div>

          <motion.div className="hero-stats" variants={item}>
            {[
              { value: 500, suffix: '+', label: "Extensions Generated" },
              { value: 3, suffix: '', label: "Browsers Supported" },
              { value: 30, suffix: 's', label: "Generation Time" },
            ].map((stat) => (
              <div key={stat.label} className="stat-item">
                <span className="stat-value">
                  <CountUp end={stat.value} suffix={stat.suffix} />
                </span>
                <span className="stat-label">{stat.label}</span>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
