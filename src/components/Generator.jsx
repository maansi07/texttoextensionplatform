import { useState } from "react";
import "./Generator.css";

const EXAMPLE_PROMPTS = [
  "Dark mode toggle for any website with a floating button",
  "Tab manager that groups tabs by domain",
  "YouTube ad skipper with auto-click",
  "Password strength checker with visual meter",
  "Reading time estimator for articles",
  "Color picker eyedropper tool",
];

const BROWSERS = ["Chrome", "Firefox", "Edge"];
const CATEGORIES = ["Productivity", "Accessibility", "Developer Tools", "Media", "Privacy"];

const MOCK_OUTPUT = {
  "manifest.json": `{
  "manifest_version": 3,
  "name": "Dark Mode Toggle",
  "version": "1.0.0",
  "description": "Toggle dark mode on any website instantly",
  "permissions": ["activeTab", "storage"],
  "action": {
    "default_popup": "popup.html",
    "default_icon": "icons/icon48.png"
  },
  "content_scripts": [{
    "matches": ["<all_urls>"],
    "js": ["content.js"]
  }]
}`,
  "popup.html": `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Dark Mode Toggle</title>
  <link rel="stylesheet" href="popup.css">
</head>
<body>
  <div class="container">
    <h2>Dark Mode Toggle</h2>
    <label class="switch">
      <input type="checkbox" id="darkToggle">
      <span class="slider"></span>
    </label>
    <p id="status">Status: Off</p>
  </div>
  <script src="popup.js"></script>
</body>
</html>`,
  "content.js": `// Content Script - Injected into all pages
(function() {
  'use strict';
  
  function applyDarkMode(enabled) {
    if (enabled) {
      document.documentElement.style.filter = 
        'invert(1) hue-rotate(180deg)';
      document.documentElement.style.background = '#000';
    } else {
      document.documentElement.style.filter = '';
      document.documentElement.style.background = '';
    }
  }

  chrome.storage.sync.get(['darkMode'], (result) => {
    applyDarkMode(result.darkMode || false);
  });

  chrome.runtime.onMessage.addListener((msg) => {
    if (msg.type === 'TOGGLE_DARK') {
      applyDarkMode(msg.enabled);
    }
  });
})();`,
  "popup.js": `const toggle = document.getElementById('darkToggle');
const status = document.getElementById('status');

chrome.storage.sync.get(['darkMode'], (result) => {
  toggle.checked = result.darkMode || false;
  status.textContent = \`Status: \${toggle.checked ? 'On' : 'Off'}\`;
});

toggle.addEventListener('change', () => {
  const enabled = toggle.checked;
  chrome.storage.sync.set({ darkMode: enabled });
  status.textContent = \`Status: \${enabled ? 'On' : 'Off'}\`;
  
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, {
      type: 'TOGGLE_DARK',
      enabled: enabled
    });
  });
});`,
};

export default function Generator() {
  const [prompt, setPrompt] = useState("");
  const [browser, setBrowser] = useState("Chrome");
  const [category, setCategory] = useState("Productivity");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generated, setGenerated] = useState(null);
  const [activeFile, setActiveFile] = useState("manifest.json");
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    setGenerated(null);
    await new Promise((r) => setTimeout(r, 2200));
    setIsGenerating(false);
    setGenerated(MOCK_OUTPUT);
    setActiveFile("manifest.json");
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(MOCK_OUTPUT[activeFile]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="generator">
      <div className="generator-inner">
        <div className="gen-header">
          <span className="tag tag-purple">⚡ AI Generator</span>
          <h2 className="gen-title">Extension Builder</h2>
          <p className="gen-desc">Describe your extension and we'll generate the complete source code.</p>
        </div>

        <div className="gen-layout">
          {/* LEFT: Input Panel */}
          <div className="gen-input-panel">
            <div className="input-group">
              <label className="input-label">Describe your extension</label>
              <textarea
                className="gen-textarea"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g. A dark mode toggle that works on any website with a floating button..."
                rows={5}
              />
            </div>

            <div className="input-row">
              <div className="input-group">
                <label className="input-label">Target Browser</label>
                <div className="btn-group">
                  {BROWSERS.map((b) => (
                    <button
                      key={b}
                      className={`btn-group-item ${browser === b ? "active" : ""}`}
                      onClick={() => setBrowser(b)}
                    >
                      {b}
                    </button>
                  ))}
                </div>
              </div>

              <div className="input-group">
                <label className="input-label">Category</label>
                <select
                  className="gen-select"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="examples-section">
              <p className="input-label">Quick examples</p>
              <div className="example-chips">
                {EXAMPLE_PROMPTS.map((ex) => (
                  <button key={ex} className="example-chip" onClick={() => setPrompt(ex)}>
                    {ex}
                  </button>
                ))}
              </div>
            </div>

            <button
              className={`btn btn-primary gen-btn ${isGenerating ? "loading" : ""}`}
              onClick={handleGenerate}
              disabled={isGenerating || !prompt.trim()}
            >
              {isGenerating ? (
                <>
                  <span className="spinner"></span>
                  Generating Extension...
                </>
              ) : (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
                  </svg>
                  Generate Extension
                </>
              )}
            </button>
          </div>

          {/* RIGHT: Output Panel */}
          <div className="gen-output-panel">
            {!generated && !isGenerating && (
              <div className="output-empty">
                <div className="empty-icon">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="1">
                    <rect x="3" y="3" width="18" height="18" rx="2"/>
                    <path d="M9 9h6M9 12h6M9 15h4"/>
                  </svg>
                </div>
                <p className="empty-title">Your extension code will appear here</p>
                <p className="empty-sub">Enter a prompt and click Generate</p>
              </div>
            )}

            {isGenerating && (
              <div className="output-loading">
                <div className="loading-steps">
                  {["Parsing requirements...", "Selecting manifest version...", "Generating content scripts...", "Building popup UI...", "Finalizing package..."].map(
                    (step, i) => (
                      <div key={step} className="loading-step" style={{ animationDelay: `${i * 0.4}s` }}>
                        <span className="step-spinner"></span>
                        <span>{step}</span>
                      </div>
                    )
                  )}
                </div>
              </div>
            )}

            {generated && (
              <div className="output-code">
                <div className="code-tabs">
                  {Object.keys(generated).map((file) => (
                    <button
                      key={file}
                      className={`code-tab ${activeFile === file ? "active" : ""}`}
                      onClick={() => setActiveFile(file)}
                    >
                      {file}
                    </button>
                  ))}
                </div>
                <div className="code-actions">
                  <span className="tag tag-green" style={{ fontSize: "0.7rem" }}>✓ Generated</span>
                  <button className="btn btn-secondary copy-btn" onClick={handleCopy} style={{ padding: "6px 14px", fontSize: "0.75rem" }}>
                    {copied ? "✓ Copied!" : "Copy"}
                  </button>
                </div>
                <pre className="code-block">
                  <code>{generated[activeFile]}</code>
                </pre>
                <div className="output-footer">
                  <button className="btn btn-primary" style={{ width: "100%" }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/>
                    </svg>
                    Download Extension Package (.zip)
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
