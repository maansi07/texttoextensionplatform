import "./CTA.css";
import { motion, useReducedMotion } from 'framer-motion';

export default function CTA({ setActiveTab }) {
  const reduce = useReducedMotion();

  return (
    <section className="cta">
      <div className="cta-inner glass-panel">
        <h2 className="cta-title">Stop writing boilerplate. Start building features.</h2>
        <p className="cta-subtitle">
          Join thousands of developers turning ideas into browser extensions instantly.
        </p>
        <motion.button
          className="btn btn-primary cta-btn"
          whileHover={reduce ? {} : { scale: 1.05, filter: 'brightness(1.1)' }}
          whileTap={reduce ? {} : { scale: 0.95 }}
          onClick={() => setActiveTab("generator")}
        >
          Generate Extension Now
        </motion.button>
      </div>
    </section>
  );
}
