import { useState, useMemo } from "react";
import "./TemplatesPage.css";
import { motion, AnimatePresence } from 'framer-motion';
import { Search } from 'lucide-react';

const CATEGORIES = ['All', 'Productivity', 'Privacy', 'Dev Tools', 'Fun', 'Accessibility', 'Security'];

const TEMPLATES = [
  { name: "Dark Mode Toggle", desc: "Add dark mode to any site with a single click.", icon: "🌙", category: "Accessibility", badge: "🔥 Trending", usage: "★ 4.9", prompt: "A dark mode toggle extension that works on any website by inverting colors or applying a dark theme." },
  { name: "Ad Blocker", desc: "Block obtrusive ads and trackers seamlessly.", icon: "🚫", category: "Privacy", usage: "uses: 12.4k", prompt: "An ad blocker extension that blocks network requests to known ad and tracker domains." },
  { name: "Tab Manager", desc: "Group and organize your messy browser tabs.", icon: "📑", category: "Productivity", badge: "✨ New", usage: "★ 4.7", prompt: "A tab manager extension that groups tabs by domain and allows closing multiple tabs at once." },
  { name: "Color Picker", desc: "Pick any hex color directly from your screen.", icon: "🎨", category: "Dev Tools", usage: "uses: 8.2k", prompt: "A color picker eyedropper tool extension that lets users click anywhere on the page to copy the hex color code." },
  { name: "Reading Timer", desc: "Estimate how long an article takes to read.", icon: "⏱️", category: "Productivity", usage: "uses: 3.1k", prompt: "An extension that calculates and displays the estimated reading time of the current webpage." },
  { name: "Password Checker", desc: "Visualize password strength while typing.", icon: "🔒", category: "Security", usage: "★ 4.8", prompt: "An extension that automatically adds a visual password strength meter below password input fields." },
  { name: "Quote of the Day", desc: "Get inspired with a new quote on every new tab.", icon: "💭", category: "Fun", usage: "uses: 4.5k", prompt: "A new tab override extension that displays a beautiful daily inspirational quote." },
  { name: "Screenshot Tool", desc: "Capture full page or partial screenshots easily.", icon: "📸", category: "Dev Tools", badge: "🔥 Trending", usage: "uses: 9.8k", prompt: "An extension that can take a full-page screenshot of the current website and save it as an image." },
  { name: "Clipboard History", desc: "Keep track of your recent copied text snippets.", icon: "📋", category: "Productivity", usage: "★ 4.6", prompt: "An extension that saves a history of text copied to the clipboard and lets you quickly re-copy older items." },
  { name: "Cookie Cleaner", desc: "One-click clear for site data and cookies.", icon: "🍪", category: "Privacy", usage: "uses: 6.7k", prompt: "A privacy extension that clears cookies and local storage for the current domain with one click." },
  { name: "Pomodoro Timer", desc: "Stay focused with a built-in 25-minute timer.", icon: "🍅", category: "Productivity", badge: "✨ New", usage: "uses: 1.1k", prompt: "A Pomodoro timer extension with a popup UI showing a countdown timer (25 min work, 5 min break)." },
  { name: "Confetti Click", desc: "Celebrate every click with virtual confetti.", icon: "🎉", category: "Fun", usage: "★ 4.5", prompt: "A fun extension that triggers a colorful confetti animation on the screen every time the user clicks." },
];

export default function TemplatesPage({ setActiveTab, setPrompt }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredTemplates = useMemo(() => {
    return TEMPLATES.filter((t) => {
      const matchesSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            t.desc.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = activeCategory === 'All' || t.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, activeCategory]);

  return (
    <section className="templates-page">
      <div className="templates-header-wrap">
        <div className="templates-header">
          <h2 className="templates-title">Starter Templates</h2>
          <p className="templates-sub">Pick a template to get started instantly</p>
          
          <div className="templates-search-container">
            <Search className="search-icon" size={18} />
            <input 
              type="text" 
              className="templates-search-input"
              placeholder="Search templates..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="templates-inner">
        <div className="templates-filters">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              className={`filter-pill ${activeCategory === cat ? 'active' : ''} cat-${cat.replace(/\s+/g, '-').toLowerCase()}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {filteredTemplates.length > 0 ? (
          <motion.div className="templates-grid" layout>
            <AnimatePresence>
              {filteredTemplates.map((t, idx) => {
                const catClass = `cat-${t.category.replace(/\s+/g, '-').toLowerCase()}`;
                return (
                  <motion.div 
                    key={t.name} 
                    className={`template-card ${catClass}`}
                    layout
                    initial={{ opacity: 0, y: 15, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                    transition={{ duration: 0.35, delay: idx * 0.04 }}
                  >
                    <div className="template-card-top">
                      <div className="icon-badge-row">
                        <span className="template-icon">{t.icon}</span>
                        {t.badge && <span className="template-badge">{t.badge}</span>}
                      </div>
                      <h3 className="template-name">{t.name}</h3>
                      <p className="template-desc">{t.desc}</p>
                    </div>
                    
                    <div className="template-card-bottom">
                      <div className="template-meta">
                        <span className="template-category">{t.category}</span>
                        <span className="template-usage">{t.usage}</span>
                      </div>
                      <button
                        className="template-use-btn"
                        onClick={() => { 
                          setPrompt(t.prompt); 
                          setActiveTab("generator"); 
                        }}
                      >
                        Use Template
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        ) : (
          <motion.div 
            className="templates-empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="empty-illustration">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                <line x1="11" y1="8" x2="11" y2="14"></line>
                <line x1="8" y1="11" x2="14" y2="11"></line>
              </svg>
            </div>
            <p className="empty-text">No templates match — try another category.</p>
            <button className="btn btn-secondary" onClick={() => { setSearchQuery(""); setActiveCategory("All"); }}>
              Clear Filters
            </button>
          </motion.div>
        )}
      </div>
    </section>
  );
}