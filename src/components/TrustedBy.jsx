import "./TrustedBy.css";
import { motion, useReducedMotion } from 'framer-motion';

export default function TrustedBy() {
  const reduce = useReducedMotion();

  const companies = [
    "ACME Corp", "Globex", "Initech", "Soylent", "Umbrella", "Massive Dynamic"
  ];

  return (
    <section className="trusted-by">
      <div className="trusted-by-inner">
        <p className="tb-subtitle">Trusted by developers at</p>
        <div className="tb-logos">
          {companies.map((company, i) => (
            <motion.div 
              key={company} 
              className="tb-logo"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: reduce ? 0 : i * 0.1, duration: 0.4 }}
              viewport={{ once: true }}
            >
              {company}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
