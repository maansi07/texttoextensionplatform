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
