import "./Dashboard.css";

const EXTENSIONS = [
  { name: "Dark Mode Pro", desc: "Universal dark mode for any website", browser: "Chrome", category: "Accessibility", files: 5, date: "2024-01-15", status: "Published" },
  { name: "Tab Grouper", desc: "Auto-group browser tabs by domain", browser: "Chrome", category: "Productivity", files: 7, date: "2024-01-14", status: "Draft" },
  { name: "ReadTimer", desc: "Reading time estimator for articles", browser: "Firefox", category: "Productivity", files: 4, date: "2024-01-12", status: "Published" },
  { name: "ColorPick", desc: "Screen color picker eyedropper tool", browser: "Edge", category: "Developer Tools", files: 6, date: "2024-01-10", status: "Published" },
  { name: "AdSweeper", desc: "YouTube ad auto-skip extension", browser: "Chrome", category: "Media", files: 5, date: "2024-01-08", status: "Draft" },
  { name: "PassStrength", desc: "Password strength visual indicator", browser: "Chrome", category: "Privacy", files: 4, date: "2024-01-06", status: "Published" },
];

const STATUS_COLORS = {
  Published: "tag-green",
  Draft: "tag-purple",
};

const BROWSER_ICONS = {
  Chrome: "🔵",
  Firefox: "🦊",
  Edge: "🔷",
};

export default function Dashboard() {
  return (
    <section className="dashboard">
      <div className="dashboard-inner">
        <div className="dash-header">
          <div>
            <span className="tag tag-cyan">My Extensions</span>
            <h2 className="dash-title">Generated Extensions</h2>
            <p className="dash-desc">All extensions you've built with ExtGen</p>
          </div>
          <div className="dash-stats-row">
            {[
              { label: "Total Generated", value: "6" },
              { label: "Published", value: "4" },
              { label: "Browsers", value: "3" },
            ].map((s) => (
              <div key={s.label} className="dash-stat">
                <span className="dash-stat-val">{s.value}</span>
                <span className="dash-stat-label">{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="ext-table">
          <div className="table-header">
            <span>Extension</span>
            <span>Browser</span>
            <span>Category</span>
            <span>Files</span>
            <span>Created</span>
            <span>Status</span>
            <span>Actions</span>
          </div>

          {EXTENSIONS.map((ext) => (
            <div key={ext.name} className="table-row">
              <div className="ext-name-cell">
                <div className="ext-icon">{ext.name[0]}</div>
                <div>
                  <div className="ext-name">{ext.name}</div>
                  <div className="ext-desc">{ext.desc}</div>
                </div>
              </div>
              <div className="cell">
                <span>{BROWSER_ICONS[ext.browser]} {ext.browser}</span>
              </div>
              <div className="cell">
                <span className="tag tag-purple" style={{ fontSize: "0.7rem" }}>{ext.category}</span>
              </div>
              <div className="cell">
                <span className="files-count">{ext.files} files</span>
              </div>
              <div className="cell date-cell">{ext.date}</div>
              <div className="cell">
                <span className={`tag ${STATUS_COLORS[ext.status]}`} style={{ fontSize: "0.7rem" }}>
                  {ext.status}
                </span>
              </div>
              <div className="cell actions-cell">
                <button className="action-btn">View</button>
                <button className="action-btn action-btn-dl">↓</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
