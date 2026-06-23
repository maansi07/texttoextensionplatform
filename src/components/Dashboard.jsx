import "./Dashboard.css";
import { useState, useEffect } from "react";
import CountUp from './CountUp';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { Layers, Download, Globe, Clock, Sparkles, LayoutTemplate } from 'lucide-react';

const STATUS_COLORS = {
  Published: "tag-green",
  Draft: "tag-purple",
  Generated: "tag-cyan",
};

const BROWSER_ICONS = {
  Chrome: "🔵",
  Firefox: "🦊",
  Edge: "🔷",
};

function formatRelativeTime(isoString) {
  const diff = Date.now() - new Date(isoString).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1)   return 'Just now';
  if (mins < 60)  return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24)   return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

// --- StatCardsRow ---
function StatCardsRow({ extensions }) {
  const totalGen = extensions.length;
  const downloads = extensions.reduce((sum, e) => sum + (e.downloads || 0), 0);
  const browsersCount = [...new Set(extensions.map(e => e.browser))].join(' · ') || '—';
  
  const lastGen = extensions[0]?.createdAt
    ? formatRelativeTime(extensions[0].createdAt)
    : 'Never';

  const statCards = [
    { label: "Total Generated", value: totalGen, icon: Layers },
    { label: "Downloads", value: downloads, icon: Download },
    { label: "Browsers", value: browsersCount, icon: Globe, isString: true },
    { label: "Last Generated", value: lastGen, icon: Clock, isString: true },
  ];

  return (
    <div className="stat-cards-row">
      {statCards.map((s, idx) => {
        const Icon = s.icon;
        return (
          <div key={idx} className="stat-card">
            <div className="stat-icon-wrap">
              <Icon size={18} color="rgba(45, 212, 191, 0.7)" />
            </div>
            <div className="stat-content">
              <div className="stat-value">
                {s.isString ? s.value : <CountUp end={s.value} duration={0.8} />}
              </div>
              <div className="stat-label">{s.label}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// --- DashboardEmptyState ---
function DashboardEmptyState({ setActiveTab, setPrompt }) {
  const fadeUp = (delay = 0) => ({
    initial: { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4, delay, ease: 'easeOut' }
  });

  const handleQuickIdea = (idea) => {
    setPrompt(idea);
    setActiveTab("generator");
  };

  return (
    <motion.div 
      className="dashboard-empty-state"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
    >
      <motion.div {...fadeUp(0)} className="empty-illustration">
        <svg width="180" height="140" viewBox="0 0 180 140" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Browser window */}
          <rect x="20" y="30" width="140" height="95" rx="8" stroke="rgba(45,212,191,0.4)" strokeWidth="1.5" fill="rgba(45,212,191,0.04)"/>
          {/* Title bar */}
          <rect x="20" y="30" width="140" height="22" rx="8" fill="rgba(45,212,191,0.08)"/>
          <rect x="20" y="44" width="140" height="8" rx="0" fill="rgba(45,212,191,0.08)"/>
          {/* Traffic lights */}
          <circle cx="34" cy="41" r="3.5" fill="rgba(255,100,100,0.5)"/>
          <circle cx="45" cy="41" r="3.5" fill="rgba(255,180,50,0.5)"/>
          <circle cx="56" cy="41" r="3.5" fill="rgba(45,212,191,0.5)"/>
          {/* Puzzle piece body */}
          <rect x="70" y="55" width="40" height="40" rx="6" fill="rgba(124,58,237,0.15)" stroke="rgba(124,58,237,0.5)" strokeWidth="1.5"/>
          {/* Puzzle connector tab */}
          <rect x="85" y="48" width="10" height="10" rx="3" fill="rgba(124,58,237,0.2)" stroke="rgba(124,58,237,0.5)" strokeWidth="1.5"/>
          {/* Lightning bolt inside puzzle */}
          <path d="M87 63 L83 75 L89 73 L85 87 L97 71 L91 73 Z" fill="rgba(45,212,191,0.8)"/>
          {/* Sparkles */}
          <path d="M148 28 L149.5 24 L151 28 L155 29.5 L151 31 L149.5 35 L148 31 L144 29.5 Z" fill="rgba(45,212,191,0.6)"/>
          <path d="M25 118 L26 115 L27 118 L30 119 L27 120 L26 123 L25 120 L22 119 Z" fill="rgba(124,58,237,0.6)"/>
          <circle cx="158" cy="65" r="2.5" fill="rgba(45,212,191,0.4)"/>
          <circle cx="22" cy="75" r="2" fill="rgba(124,58,237,0.4)"/>
          <circle cx="155" cy="105" r="2" fill="rgba(45,212,191,0.3)"/>
        </svg>
      </motion.div>

      <motion.h3 {...fadeUp(0.08)} className="empty-headline">
        No extensions yet
      </motion.h3>

      <motion.p {...fadeUp(0.14)} className="empty-subtext">
        Describe what you want your extension to do and the AI will write the code, package it, and get it ready to install in seconds.
      </motion.p>

      <motion.div {...fadeUp(0.20)} className="empty-actions">
        <button className="btn btn-primary" onClick={() => setActiveTab("generator")}>
          <Sparkles size={16} />
          Build your first extension
        </button>
        <button className="btn empty-btn-secondary" onClick={() => setActiveTab("templates")}>
          <LayoutTemplate size={16} />
          Browse templates
        </button>
      </motion.div>

      <motion.div {...fadeUp(0.28)} className="empty-quick-ideas">
        <span className="ideas-label">Popular ideas</span>
        <div className="ideas-chips">
          {["Dark mode toggle", "Ad blocker", "Tab manager"].map(idea => (
            <button key={idea} className="idea-chip" onClick={() => handleQuickIdea(idea)}>
              {idea}
            </button>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}

// --- Main Dashboard ---
export default function Dashboard({ setActiveTab, setPrompt }) {
  const [extensions, setExtensions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [browserFilter, setBrowserFilter] = useState("All");

  useEffect(() => {
    const stored = localStorage.getItem('extensio_extensions');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setExtensions(Array.isArray(parsed) ? parsed : []);
      } catch {
        setExtensions([]);
      }
    }
    setLoading(false);
  }, []);

  function handleDelete(id) {
    const updated = extensions.filter(e => e.id !== id);
    setExtensions(updated);
    localStorage.setItem('extensio_extensions', JSON.stringify(updated));
  }

  const handleRedownload = (ext) => {
    // Basic redownload mockup if JSZip is not readily available here. 
    // Usually we would zip ext.files, but for now we'll trigger an alert or a generic download.
    alert(`Downloading ${ext.name}...`);
  };

  const filtered = extensions.filter(ext => {
    const matchSearch =
      ext.name?.toLowerCase().includes(search.toLowerCase()) ||
      ext.description?.toLowerCase().includes(search.toLowerCase());
    const matchBrowser =
      browserFilter === "All" || ext.browser === browserFilter;
    return matchSearch && matchBrowser;
  });

  const hasExtensions = extensions && extensions.length > 0;

  return (
    <section className="dashboard">
      <div className="dashboard-inner">
        <div className="dash-header">
          <div>
            <span className="tag tag-cyan">My Extensions</span>
            <h2 className="dash-title">Generated Extensions</h2>
            <p className="dash-desc">All extensions built with Extensio.ai</p>
          </div>
        </div>

        {/* Stat cards — ALWAYS rendered */}
        <StatCardsRow extensions={extensions} />

        {/* Search + filter — only if extensions exist */}
        {!loading && hasExtensions && (
          <>
            <div className="dash-search">
              <input
                className="search-input"
                type="text"
                placeholder="Search extensions..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>

            <div className="filter-row">
              {["All", "Chrome", "Firefox", "Edge"].map(b => (
                <button
                  key={b}
                  className={`filter-btn ${browserFilter === b ? "active" : ""}`}
                  onClick={() => setBrowserFilter(b)}
                >
                  {b}
                </button>
              ))}
            </div>
          </>
        )}

        <div className="ext-table-container">
          {loading ? (
            <div className="skeleton-wrapper">
              {[1, 2, 3].map(i => (
                <div key={i} className="skeleton-row">
                  <div className="skeleton-box wide"></div>
                  <div className="skeleton-box"></div>
                  <div className="skeleton-box"></div>
                  <div className="skeleton-box narrow"></div>
                </div>
              ))}
            </div>
          ) : hasExtensions ? (
            <div className="ext-table">
              <table>
                <thead>
                  <tr>
                    <th>Extension</th>
                    <th>Browser</th>
                    <th>Category</th>
                    <th>Created</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(ext => (
                    <tr key={ext.id}>
                      <td>
                        <div className="ext-name-cell">
                          <div className="ext-dot" style={{ width: 8, height: 8, borderRadius: '50%', background: '#2dd4bf', marginRight: 10, display: 'inline-block' }} />
                          {ext.name}
                        </div>
                      </td>
                      <td><span className="browser-badge">{BROWSER_ICONS[ext.browser] || ''} {ext.browser}</span></td>
                      <td>{ext.category}</td>
                      <td>{formatRelativeTime(ext.createdAt)}</td>
                      <td><span className="status-badge status-ready" style={{ color: '#2dd4bf', background: 'rgba(45,212,191,0.1)', padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem' }}>Ready</span></td>
                      <td>
                        <div className="action-btns" style={{ display: 'flex', gap: '8px' }}>
                          <button className="btn-secondary" style={{ padding: '4px 8px', fontSize: '0.8rem' }} onClick={() => handleRedownload(ext)}>Download</button>
                          <button className="btn-secondary" style={{ padding: '4px 8px', fontSize: '0.8rem', color: '#ef4444', borderColor: 'rgba(239,68,68,0.3)' }} onClick={() => handleDelete(ext.id)}>Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <DashboardEmptyState setActiveTab={setActiveTab} setPrompt={setPrompt} />
          )}
        </div>
      </div>
    </section>
  );
}