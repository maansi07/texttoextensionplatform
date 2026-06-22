import { useState, useEffect } from "react";
import "./Generator.css";
import { Search, FileCode, Code, Layout, FileArchive } from 'lucide-react';

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

const STEPS = [
  { id: 'analyze',   label: 'Analyzing your prompt',      icon: Search },
  { id: 'manifest',  label: 'Writing manifest.json',       icon: FileCode },
  { id: 'scripts',   label: 'Building content scripts',    icon: Code },
  { id: 'popup',     label: 'Creating popup UI',           icon: Layout },
  { id: 'zip',       label: 'Packaging extension',         icon: FileArchive },
];

export default function Generator({ prompt, setPrompt }) {
  const [browser, setBrowser] = useState("Chrome");
  const [category, setCategory] = useState("Productivity");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generated, setGenerated] = useState(null);
  const [activeFile, setActiveFile] = useState("manifest.json");
  const [copied, setCopied] = useState(false);
  
  // Streaming state
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamedCode, setStreamedCode] = useState('');
  const [currentStep, setCurrentStep] = useState(null);
  const [stepIndex, setStepIndex] = useState(0);
  const [error, setError] = useState(null);
  
  const [downloadLoading, setDownloadLoading] = useState(false);
  const [downloadError, setDownloadError] = useState(null);

  useEffect(() => {
    let interval;
    if (isStreaming && stepIndex < STEPS.length - 1) {
      interval = setInterval(() => {
        setStepIndex(prev => Math.min(prev + 1, STEPS.length - 2));
      }, 4000);
    }
    return () => clearInterval(interval);
  }, [isStreaming, stepIndex]);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    setIsStreaming(true);
    setGenerated(null);
    setStreamedCode('');
    setStepIndex(0);
    setCurrentStep('analyze');
    setError(null);

    try {
      const response = await fetch('/api/extensions/generate/stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, browser, category }),
      });

      if (!response.ok) {
        throw new Error('Failed to connect to stream');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullText = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const text = decoder.decode(value);
        const lines = text.split('\n').filter(l => l.startsWith('data: '));
        
        for (const line of lines) {
          const dataStr = line.replace('data: ', '').trim();
          if (!dataStr) continue;
          
          try {
            const data = JSON.parse(dataStr);
            if (data.type === 'chunk') {
              setStreamedCode(prev => prev + data.text);
              fullText += data.text;
            } else if (data.type === 'done') {
              setStepIndex(STEPS.length - 1); // move to packaging
              setCurrentStep('done');
              
              // Parse the JSON
              // We need to extract json from the markdown or raw string
              let cleaned = fullText.trim();
              const startIdx = cleaned.indexOf('{');
              const endIdx = cleaned.lastIndexOf('}');
              if (startIdx !== -1 && endIdx !== -1 && endIdx > startIdx) {
                cleaned = cleaned.substring(startIdx, endIdx + 1);
                const parsed = JSON.parse(cleaned);
                setGenerated(parsed);
                if (parsed.files) {
                  setActiveFile(Object.keys(parsed.files)[0]);
                }
              } else {
                throw new Error("No valid JSON found in generated output.");
              }
            } else if (data.type === 'error') {
              setError(data.message);
            }
          } catch (e) {
            console.error("Error parsing stream chunk:", e);
          }
        }
      }
    } catch (err) {
      setError(err.message);
      console.error(err);
    } finally {
      setIsGenerating(false);
      setIsStreaming(false);
    }
  };

  const handleCopy = () => {
    if (!generated || !generated.files) return;
    navigator.clipboard.writeText(generated.files[activeFile]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadZip = async () => {
    if (!generated || !generated.files) return;
    setDownloadLoading(true);
    setDownloadError(null);
    try {
      const resp = await fetch(`/api/extensions/generate/zip`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ files: generated.files, name: generated.name })
      });
      
      if (!resp.ok) {
        const err = await resp.json().catch(() => ({}));
        throw new Error(err.details || err.error || 'Download failed');
      }
      
      const blob = await resp.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${generated.name || 'Extension'}.zip`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      setDownloadError(err.message);
    } finally {
      setDownloadLoading(false);
    }
  };

  return (
    <section className="generator">
      <div className="generator-inner">
        <div className="gen-header">
          <span className="tag tag-purple">⚡ AI Generator</span>
          <h2 className="gen-title">Extension Builder</h2>
          <p className="gen-desc">
            Describe your extension and we'll generate the complete source code.
          </p>
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
                placeholder="e.g. A dark mode toggle that works on any website..."
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
                  <button
                    key={ex}
                    className="example-chip"
                    onClick={() => setPrompt(ex)}
                  >
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
                  <svg width="16" height="16" viewBox="0 0 24 24"
                    fill="none" stroke="currentColor" strokeWidth="2">
                    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
                  </svg>
                  Generate Extension
                </>
              )}
            </button>
          </div>

          {/* RIGHT: Output Panel */}
          <div className="gen-output-panel">
            {!generated && !isGenerating && !error && (
              <div className="output-empty">
                <div className="empty-icon">
                  <svg width="48" height="48" viewBox="0 0 24 24"
                    fill="none" stroke="var(--text-muted)" strokeWidth="1">
                    <rect x="3" y="3" width="18" height="18" rx="2"/>
                    <path d="M9 9h6M9 12h6M9 15h4"/>
                  </svg>
                </div>
                <p className="empty-title">Your extension code will appear here</p>
                <p className="empty-sub">Enter a prompt and click Generate</p>
              </div>
            )}

            {error && (
              <div className="output-empty">
                <div className="empty-icon" style={{ color: 'var(--accent-error)' }}>
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="8" x2="12" y2="12"></line>
                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                  </svg>
                </div>
                <p className="empty-title" style={{ color: 'var(--accent-error)' }}>Generation Failed</p>
                <p className="empty-sub">{error}</p>
                <button className="btn btn-secondary" style={{ marginTop: '16px' }} onClick={handleGenerate}>
                  Try Again
                </button>
              </div>
            )}

            {isGenerating && !error && (
              <div className="output-loading" style={{ justifyContent: 'flex-start', paddingTop: '24px' }}>
                <div className="progress-stepper">
                  {STEPS.map((step, idx) => {
                    const isDone = currentStep === 'done' || idx < stepIndex;
                    const isActive = idx === stepIndex && currentStep !== 'done';
                    const isPending = idx > stepIndex;
                    const Icon = step.icon;

                    let rowClass = 'step-row ';
                    if (isDone) rowClass += 'done';
                    else if (isActive) rowClass += 'active';
                    else rowClass += 'pending';

                    return (
                      <div key={step.id} className={rowClass}>
                        <div className="step-icon-wrap">
                          {isDone ? (
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2dd4bf" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                          ) : (
                            <Icon size={16} color={isActive ? "#2dd4bf" : "currentColor"} />
                          )}
                        </div>
                        <span style={{ color: isActive ? '#fff' : 'inherit', fontWeight: isActive ? 600 : 400 }}>
                          {step.label}
                        </span>
                        {isActive && <div className="active-pulse"></div>}
                      </div>
                    );
                  })}
                  
                  <div className="progress-bar-track">
                    <div 
                      className="progress-bar-fill" 
                      style={{ width: `${(stepIndex / (STEPS.length - 1)) * 100}%` }}
                    ></div>
                  </div>

                  <div className="stream-preview" ref={(el) => { if (el) el.scrollTop = el.scrollHeight; }}>
                    {streamedCode}
                  </div>
                </div>
              </div>
            )}

            {generated && currentStep === 'done' && !error && (
              <div className="output-code">
                <div className="code-tabs">
                  {generated.files && Object.keys(generated.files).map((file) => (
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
                  <span className="tag tag-green" style={{ fontSize: "0.7rem", display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    Extension generated — ready to download
                  </span>
                  <button
                    className="btn btn-secondary copy-btn"
                    onClick={handleCopy}
                    style={{ padding: "6px 14px", fontSize: "0.75rem" }}
                  >
                    {copied ? "✓ Copied!" : "Copy"}
                  </button>
                </div>
                <pre className="code-block">
                  <code>{generated.files && generated.files[activeFile]}</code>
                </pre>
                <div className="output-footer">
                  <button
                    className="btn btn-primary"
                    style={{ width: "100%" }}
                    onClick={handleDownloadZip}
                    disabled={downloadLoading || !generated}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" strokeWidth="2">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4
                        M7 10l5 5 5-5M12 15V3"/>
                    </svg>
                    Download Extension Package (.zip)
                  </button>
                  {downloadLoading && <div style={{marginTop:8, textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.9rem'}}>Preparing download…</div>}
                  {downloadError && <div style={{marginTop:8, textAlign: 'center', color:'var(--accent-error)', fontSize: '0.9rem'}}>Download error: {downloadError}</div>}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}