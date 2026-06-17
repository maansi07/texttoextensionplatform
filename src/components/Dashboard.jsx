import "./Dashboard.css";
import { useState, useEffect } from "react";

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

export default function Dashboard() {
  const [extensions, setExtensions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  // Browser filter state — filters table rows by selected browser
  const [browserFilter, setBrowserFilter] = useState("All");

  useEffect(() => {
    fetch('/api/extensions')
      .then(res => res.json())
      .then(data => {
        setExtensions(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    await fetch(`/api/extensions/${id}`, { method: 'DELETE' });
    setExtensions(prev => prev.filter(ext => ext.id !== id));
  };

  const filtered = extensions.filter(ext => {
    const matchSearch =
      ext.name?.toLowerCase().includes(search.toLowerCase()) ||
      ext.description?.toLowerCase().includes(search.toLowerCase());
    const matchBrowser =
      browserFilter === "All" || ext.browser === browserFilter;
    return matchSearch && matchBrowser;
  });

  return (
    <section className="dashboard">
      <div className="dashboard-inner">
        <div className="dash-header">
          <div>
            <span className="tag tag-cyan">My Extensions</span>
            <h2 className="dash-title">Generated Extensions</h2>
            <p className="dash-desc">All extensions built with Extensio.ai</p>
          </div>
          <div className="dash-stats-row">
            {[
              { label: "Total Generated", value: extensions.length || "0" },
              { label: "Browsers", value: "3" },
              { label: "Status", value: "Live" },
            ].map((s) => (
              <div key={s.label} className="dash-stat">
                <span className="dash-stat-val">{s.value}</span>
                <span className="dash-stat-label">{s.label}</span>
              </div>
            ))}
          </div>
        </div>

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

        <div className="ext-table">
          <div className="table-header">
            <span>Extension</span>
            <span>Browser</span>
            <span>Category</span>
            <span>Created</span>
            <span>Status</span>
            <span>Actions</span>
          </div>

          {loading && (
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
          )}

          {!loading && extensions.length === 0 && (
            <div className="table-row">
              <p style={{ color: "var(--text-muted)", padding: "20px" }}>
                No extensions generated yet. Go to Generator to create one!
              </p>
            </div>
          )}

          {filtered.map((ext) => (
            <div key={ext.id} className="table-row">
              <div className="ext-name-cell">
                <div className="ext-icon">{ext.name ? ext.name[0] : "E"}</div>
                <div>
                  <div className="ext-name">{ext.name}</div>
                  <div className="ext-desc">{ext.description}</div>
                </div>
              </div>
              <div className="cell">
                <span>{BROWSER_ICONS[ext.browser]} {ext.browser}</span>
              </div>
              <div className="cell">
                <span className="tag tag-purple" style={{ fontSize: "0.7rem" }}>
                  {ext.category}
                </span>
              </div>
              <div className="cell date-cell">
                {new Date(ext.createdAt).toLocaleDateString()}
              </div>
              <div className="cell">
                <span
                    className={`tag ${STATUS_COLORS[ext.status] || "tag-cyan"}`}
                  style={{ fontSize: "0.7rem" }}
                >
                  {ext.status}
                </span>
              </div>
              <div className="cell actions-cell">
                <button
                  className="action-btn"
                  onClick={() =>
                      window.open(`/api/extensions/${ext.id}/download`)
                  }
                >
                  ↓ Download
                </button>
                <button
                  className="action-btn action-btn-dl"
                  onClick={() => handleDelete(ext.id)}
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}