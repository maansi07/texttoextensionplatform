import { useState, useEffect, useRef } from "react";
import "./Hero.css";
import { motion, useReducedMotion, useInView } from 'framer-motion';
import { FileCode, Code, Layout } from 'lucide-react';
import CountUp from './CountUp';

export default function Hero({ setActiveTab }) {
  const reduce = useReducedMotion();
  const [typedCommand, setTypedCommand] = useState("");
  const [showOutput, setShowOutput] = useState(false);
  
  const statsRef = useRef(null);
  const statsInView = useInView(statsRef, { once: true, margin: "-50px" });

  useEffect(() => {
    let isMounted = true;
    let timeout;
    
    const runTerminalSequence = async () => {
      const fullCmd = ' "dark mode toggle for any website"';
      setTypedCommand("");
      setShowOutput(false);
      
      // Wait before starting to type
      await new Promise(r => timeout = setTimeout(r, 1000));
      if (!isMounted) return;

      for (let i = 0; i <= fullCmd.length; i++) {
        if (!isMounted) return;
        setTypedCommand(fullCmd.substring(0, i));
        await new Promise(r => timeout = setTimeout(r, Math.random() * 30 + 40));
      }

      await new Promise(r => timeout = setTimeout(r, 300));
      if (!isMounted) return;
      setShowOutput(true);

      // Wait before resetting loop
      await new Promise(r => timeout = setTimeout(r, 4500));
      if (isMounted) {
        runTerminalSequence();
      }
    };

    runTerminalSequence();
    return () => {
      isMounted = false;
      clearTimeout(timeout);
    };
  }, []);

  const container = {
    hidden: {},
    show: { transition: { staggerChildren: reduce ? 0 : 0.09 } }
  };
  const item = {
    hidden: { opacity: 0, y: 14 },
    show: { opacity: 1, y: 0, transition: { duration: reduce ? 0 : 0.45, ease: 'easeOut' } }
  };
  
  const terminalOutputVariants = {
    hidden: { opacity: 0, y: 5 },
    show: { opacity: 1, y: 0, transition: { duration: 0.3 } }
  };

  const terminalContainerVariants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.8, delayChildren: 0.2 } }
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
            <span className="hero-title-light">No-Code</span>
            <br />
            <span className="hero-title-gradient">Extension Factory</span>
          </motion.h1>

          <motion.div className="hero-content-wrapper" variants={item}>
            <p className="hero-subtitle">
              Describe your browser extension in plain English.
              Extensio.ai generates production-ready code in seconds.
            </p>
            <div className="hero-chips">
              <span className="hero-chip"><FileCode size={14} /> Manifest</span>
              <span className="hero-chip"><Code size={14} /> Scripts</span>
              <span className="hero-chip"><Layout size={14} /> Popup UI</span>
            </div>
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
                <span className="term-string">{typedCommand}</span>
                <span className="term-cursor">█</span>
              </div>
              
              {showOutput && (
                <motion.div 
                  initial="hidden" 
                  animate="show" 
                  variants={terminalContainerVariants}
                >
                  <motion.div className="terminal-line term-output" variants={terminalOutputVariants}>
                    <span className="term-success">✓</span> Analyzing requirements...
                  </motion.div>
                  <motion.div className="terminal-line term-output" variants={terminalOutputVariants}>
                    <span className="term-success">✓</span> Generating manifest.json
                  </motion.div>
                  <motion.div className="terminal-line term-output" variants={terminalOutputVariants}>
                    <span className="term-success">✓</span> Creating content_script.js + popup.html
                  </motion.div>
                  <motion.div className="terminal-line term-output" variants={terminalOutputVariants}>
                    <span className="term-cyan">→</span> Extension ready in <span className="term-highlight">./dark-mode-toggle/</span>
                    <span className="term-cursor blink">█</span>
                  </motion.div>
                </motion.div>
              )}
            </div>
          </motion.div>

          <div className="hero-actions">
            <div className="btn-glow-wrapper">
              <motion.button
                className="btn btn-primary btn-glow"
                variants={item}
                whileHover={
                  reduce
                    ? {}
                    : { scale: 1.03, filter: 'brightness(1.06)', transition: { duration: 0.16 } }
                }
                whileTap={reduce ? {} : { scale: 0.97, transition: { duration: 0.12 } }}
                onClick={() => setActiveTab("generator") }
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polygon points="5 3 19 12 5 21 5 3"/>
                </svg>
                Start Building
              </motion.button>
            </div>
            <motion.button
              className="btn btn-secondary btn-lift"
              variants={item}
              whileHover={reduce ? {} : { scale: 1.03, y: -1, filter: 'brightness(1.06)', boxShadow: '0 4px 12px rgba(124,58,237,0.15)', transition: { duration: 0.16 } }}
              whileTap={reduce ? {} : { scale: 0.97, transition: { duration: 0.12 } }}
              onClick={() => setActiveTab("dashboard") }
            >
              View Examples
            </motion.button>
          </div>

          <motion.div className="hero-stats" variants={item} ref={statsRef}>
            {[
              { value: 500, suffix: '+', label: "Extensions Generated" },
              { value: 3, suffix: '', label: "Browsers Supported" },
              { value: 30, suffix: 's', label: "Generation Time" },
            ].map((stat) => (
              <div key={stat.label} className="stat-item">
                <span className="stat-value">
                  {statsInView ? <CountUp end={stat.value} suffix={stat.suffix} /> : '0' + stat.suffix}
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
