import { useState } from "react";
import { motion, useReducedMotion } from 'framer-motion';
import "./ThemeToggle.css";

export default function ThemeToggle() {
  const [dark, setDark] = useState(true);
  const reduce = useReducedMotion();

  const toggle = () => {
    setDark(!dark);
    document.documentElement.setAttribute(
      'data-theme',
      dark ? 'light' : 'dark'
    );
  };

  return (
    <button className="theme-toggle" onClick={toggle} title="Toggle theme">
      <motion.span
        key={dark ? 'sun' : 'moon'}
        initial={{ opacity: 0, rotate: -20 }}
        animate={{ opacity: 1, rotate: 0 }}
        exit={{ opacity: 0, rotate: 20 }}
        transition={{ duration: reduce ? 0 : 0.18 }}
        style={{ display: 'inline-block' }}
      >
        {dark ? "☀️" : "🌙"}
      </motion.span>
    </button>
  );
}
