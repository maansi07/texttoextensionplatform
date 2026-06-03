import { useState } from "react";
import "./ThemeToggle.css";

export default function ThemeToggle() {
  const [dark, setDark] = useState(true);

  const toggle = () => {
    setDark(!dark);
    document.documentElement.setAttribute(
      'data-theme',
      dark ? 'light' : 'dark'
    );
  };

  return (
    <button className="theme-toggle" onClick={toggle} title="Toggle theme">
      {dark ? "☀️" : "🌙"}
    </button>
  );
}
Create src/components/ThemeToggle.css:
css.theme-toggle {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 6px 10px;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.2s;
}

.theme-toggle:hover {
  border-color: var(--accent-cyan);
}
