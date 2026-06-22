import "./HowItWorks.css";
import { motion, useReducedMotion } from 'framer-motion';

export default function HowItWorks() {
  const reduce = useReducedMotion();
  const steps = [
    {
      number: "01",
      title: "Describe",
      desc: "Write what you want the extension to do in plain English. No coding required."
    },
    {
      number: "02",
      title: "Generate",
      desc: "Extensio.ai analyzes your request and writes the manifest, scripts, and UI."
    },
    {
      number: "03",
      title: "Review",
      desc: "Preview the generated code and test the extension directly in the builder."
    },
    {
      number: "04",
      title: "Download",
      desc: "Export as a ready-to-load ZIP file for Chrome, Firefox, or Edge."
    }
  ];

  const container = {
    hidden: {},
    show: { transition: { staggerChildren: reduce ? 0 : 0.1 } }
  };
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: reduce ? 0 : 0.5, ease: 'easeOut' } }
  };

  return (
    <section className="how-it-works">
      <div className="hiw-inner">
        <div className="hiw-header">
          <span className="tag tag-purple">Workflow</span>
          <h2 className="hiw-title">From Idea to Extension</h2>
        </div>
        <motion.div className="hiw-grid" variants={container} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-100px" }}>
          {steps.map((step) => (
            <motion.div key={step.number} className="hiw-card glass-panel" variants={item}>
              <div className="hiw-number">{step.number}</div>
              <h3 className="hiw-step-title">{step.title}</h3>
              <p className="hiw-step-desc">{step.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
