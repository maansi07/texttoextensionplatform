import { useState, useEffect, useRef } from "react";
import "./Generator.css";
import { Search, FileCode, Code, Layout, FileArchive, CheckCircle, Download, Sparkles, Undo2, Loader2, ChevronDown, Eye, EyeOff, Minimize2, Maximize2, SpellCheck, Target, AlignLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import SuccessModal from './SuccessModal';
import PopupPreview from './PopupPreview';
import Prism from 'prismjs';
import 'prismjs/themes/prism-tomorrow.css';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-markup';
import 'prismjs/components/prism-css';

const TYPEWRITER_PLACEHOLDERS = [
  'A dark mode toggle for any website with a floating button...',
  'A tab manager that groups open tabs by domain...',
  'A YouTube ad skipper that auto-clicks the skip button...',
  'A password strength checker with a visual meter...',
  'A reading time estimator shown on every article...',
  'A color picker eyedropper tool for any webpage...',
  'A focus mode that blocks distracting websites...',
  'A screenshot tool with annotation support...',
];

const QUICK_EXAMPLES = [
  'Dark mode toggle for any website with a floating button',
  'Tab manager that groups tabs by domain',
  'YouTube ad skipper with auto-click',
  'Password strength checker with visual meter',
  'Reading time estimator for articles',
  'Color picker eyedropper tool',
  'Focus mode that blocks distracting websites',
  'Screenshot tool with annotation support',
];

const icons = {
  Sparkles,
  Minimize2,
  Maximize2,
  SpellCheck,
  Target,
  AlignLeft
};

const ENHANCE_OPTIONS = [
  { id: 'enhance', label: 'Enhance', description: 'Rewrite as a detailed technical spec', icon: 'Sparkles' },
  { id: 'shorten', label: 'Shorten', description: 'Make it more concise', icon: 'Minimize2' },
  { id: 'lengthen', label: 'Lengthen', description: 'Add more detail and context', icon: 'Maximize2' },
  { id: 'fix', label: 'Fix grammar', description: 'Correct spelling and grammar', icon: 'SpellCheck' },
  { id: 'specific', label: 'Make specific', description: 'Add concrete technical requirements', icon: 'Target' },
  { id: 'simplify', label: 'Simplify', description: 'Use plainer language', icon: 'AlignLeft' },
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
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const categoryRef = useRef(null);
  const [viewMode, setViewMode] = useState("preview");
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

  const [showModal, setShowModal] = useState(false);
  const [downloadDone, setDownloadDone] = useState(false);
  const [showToast, setShowToast] = useState(false);

  // Typewriter & Enhance states
  const [placeholderText, setPlaceholderText] = useState('');
  const [phraseIndex, setPhraseIndex]         = useState(0);
  const [charIndex, setCharIndex]             = useState(0);
  const [isDeleting, setIsDeleting]           = useState(false);
  const [isPaused, setIsPaused]               = useState(false);
  const [isFocused, setIsFocused]             = useState(false);
  
  const [showEnhanceMenu, setShowEnhanceMenu] = useState(false);
  const [isEnhancing, setIsEnhancing]         = useState(false);
  const [prevPrompt, setPrevPrompt]           = useState('');
  const enhanceRef = useRef(null);
  const textareaRef = useRef(null);
  const [enhancedToast, setEnhancedToast] = useState(false);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (enhanceRef.current && !enhanceRef.current.contains(e.target)) {
        setShowEnhanceMenu(false);
      }
      if (categoryRef.current && !categoryRef.current.contains(e.target)) {
        setIsCategoryOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    // Don't run if the user has typed something
    if (prompt.trim()) {
      setPlaceholderText('');
      return;
    }

    if (isPaused) return;

    const currentPhrase = TYPEWRITER_PLACEHOLDERS[phraseIndex];

    const timeout = setTimeout(() => {
      if (!isDeleting) {
        // Typing forward
        if (charIndex < currentPhrase.length) {
          setPlaceholderText(currentPhrase.slice(0, charIndex + 1));
          setCharIndex(c => c + 1);
        } else {
          // Finished typing — pause before deleting
          setIsPaused(true);
          setTimeout(() => {
            setIsPaused(false);
            setIsDeleting(true);
          }, 1800); // hold the complete phrase for 1.8s
        }
      } else {
        // Deleting
        if (charIndex > 0) {
          setPlaceholderText(currentPhrase.slice(0, charIndex - 1));
          setCharIndex(c => c - 1);
        } else {
          // Finished deleting — move to next phrase
          setIsDeleting(false);
          setPhraseIndex(i => (i + 1) % TYPEWRITER_PLACEHOLDERS.length);
        }
      }
    }, isDeleting ? 18 : 38); // delete faster than type

    return () => clearTimeout(timeout);
  }, [prompt, charIndex, isDeleting, isPaused, phraseIndex]);

  function handleChipClick(text) {
    setPrompt(text);
    textareaRef.current?.focus();
  }

  async function handleEnhance(mode) {
    if (!prompt.trim()) return;
    setShowEnhanceMenu(false);
    setIsEnhancing(true);
    setPrevPrompt(prompt); // save for undo

    const systemPrompts = {
      enhance:  `You are a Chrome extension prompt engineer. Rewrite the following into a detailed technical specification for a browser extension, including specific features, UI elements, and behavior. Return ONLY the rewritten prompt, no preamble.`,
      shorten:  `Condense the given browser extension description into a single clear, direct, and actionable sentence. Remove filler words, redundant phrases, and non-essential details. The result should be punchy and focused purely on the core functionality. Return ONLY the shortened text.`,
      lengthen: `Expand the following browser extension description with more detail: what it does, how it behaves, what the UI looks like, and any edge cases. Return ONLY the expanded text.`,
      fix:      `Fix all spelling and grammar errors in the following text. Return ONLY the corrected text, no changes to meaning.`,
      specific: `Transform the given browser extension description into a highly specific and technical extension specification. Include explicit details such as exact DOM selectors, API methods (e.g., chrome.runtime, chrome.storage), UI components needed (e.g., sidebar, injected button, background worker), and clear state logic. Ensure the output is concrete and ready for development. Return ONLY the updated description.`,
      simplify: `Rewrite the following in simple, plain language that a non-technical user could understand. Return ONLY the simplified text.`,
    };

    try {
      const res = await fetch('/api/enhance-prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: prompt,
          systemPrompt: systemPrompts[mode],
        }),
      });
      
      let data;
      try {
        data = await res.json();
      } catch (e) {
        throw new Error(`Server returned ${res.status}`);
      }

      if (!res.ok) {
        throw new Error(data.error || 'Enhancement failed');
      }

      setPrompt(data.enhanced || prompt);
    } catch (err) {
      console.error('Enhance failed:', err);
      // If we failed, you might want to show a toast, but for now we just revert or leave it.
    } finally {
      setIsEnhancing(false);
    }
  }

  useEffect(() => {
    let interval;
    if (isStreaming && stepIndex < STEPS.length - 1) {
      interval = setInterval(() => {
        setStepIndex(prev => Math.min(prev + 1, STEPS.length - 2));
      }, 4000);
    }
    return () => clearInterval(interval);
  }, [isStreaming, stepIndex]);

  // Trigger Prism syntax highlighting when file or content changes
  useEffect(() => {
    if (generated && generated.files) {
      Prism.highlightAll();
    }
  }, [activeFile, generated]);

  const getLanguageClass = (filename) => {
    if (!filename) return 'language-javascript';
    if (filename.endsWith('.js')) return 'language-javascript';
    if (filename.endsWith('.json')) return 'language-json';
    if (filename.endsWith('.html')) return 'language-markup';
    if (filename.endsWith('.css')) return 'language-css';
    return 'language-javascript';
  };

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

                // Save to History (LocalStorage)
                try {
                  const newEntry = {
                    id: crypto.randomUUID(),
                    name: parsed.name || 'Untitled Extension',
                    prompt: prompt,
                    browser: browser,
                    category: category,
                    files: parsed.files ? Object.entries(parsed.files).map(([name, content]) => ({ name, content })) : [],
                    createdAt: new Date().toISOString(),
                    downloads: 0,
                  };
                  const existing = JSON.parse(localStorage.getItem('extensio_extensions') || '[]');
                  localStorage.setItem('extensio_extensions', JSON.stringify([newEntry, ...existing]));
                } catch (saveError) {
                  console.error('Failed to save to history:', saveError);
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
      
      setDownloadDone(true);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
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
          <span className="tag tag-purple gen-badge" style={{ border: '1px solid rgba(124, 58, 237, 0.4)', background: 'transparent' }}>AI Generator</span>
          <h2 className="gen-title" style={{ 
            fontSize: 'clamp(28px, 4vw, 44px)', 
            fontWeight: 700, 
            fontFamily: 'var(--font-display)', 
            letterSpacing: '-0.02em', 
            background: 'linear-gradient(135deg, #2dd4bf 0%, #7c3aed 100%)', 
            WebkitBackgroundClip: 'text', 
            WebkitTextFillColor: 'transparent', 
            backgroundClip: 'text', 
            marginBottom: '10px' 
          }}>Extension Builder</h2>
          <p className="gen-desc" style={{ 
            fontSize: 'clamp(14px, 1.6vw, 17px)', 
            color: 'rgba(255,255,255,0.5)', 
            fontWeight: 400, 
            maxWidth: '560px', 
            margin: '0 auto 32px' 
          }}>
            Describe your extension and we'll generate the complete source code.
          </p>
        </div>

        <div className="gen-layout">
          {/* LEFT: Input Panel */}
          <div className="gen-input-panel" style={{ background: 'transparent', border: 'none', padding: 0, boxShadow: 'none' }}>
            <div className="textarea-wrapper">
              <textarea
                ref={textareaRef}
                className={`gen-textarea ${prompt.length > 1000 ? 'over-limit' : ''}`}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
              />
              {!prompt && (
                <div className={`typewriter-overlay ${isFocused ? 'typing' : ''}`} aria-hidden="true">
                  <span className="typewriter-text">{placeholderText}</span>
                  <span className="typewriter-cursor" />
                </div>
              )}
              
              <div className="textarea-footer" style={{ marginTop: '12px' }}>
                <div className="enhance-actions">
                  <div className="enhance-wrapper" ref={enhanceRef}>
                    <button
                      className="enhance-btn"
                      onClick={() => setShowEnhanceMenu(prev => !prev)}
                      disabled={!prompt.trim() || isEnhancing}
                    >
                      {isEnhancing ? <Loader2 size={12} className="spinning" /> : <Sparkles size={12} />}
                      {isEnhancing ? 'Enhancing...' : 'Enhance'}
                      {!isEnhancing && <ChevronDown size={11} />}
                    </button>

                    {showEnhanceMenu && (
                      <motion.div
                        className="enhance-menu"
                        initial={{ opacity: 0, y: -6, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -6, scale: 0.97 }}
                        transition={{ duration: 0.15 }}
                      >
                        {ENHANCE_OPTIONS.map(opt => {
                          const Icon = icons[opt.icon];
                          return (
                            <button
                              key={opt.id}
                              className="enhance-option"
                              onClick={() => handleEnhance(opt.id)}
                            >
                              <div className="enhance-option-icon">
                                <Icon size={13} />
                              </div>
                              <div>
                                <p className="enhance-option-label">{opt.label}</p>
                                <p className="enhance-option-desc">{opt.description}</p>
                              </div>
                            </button>
                          );
                        })}
                      </motion.div>
                    )}
                  </div>
                  {prevPrompt && (
                    <button
                      className="undo-btn"
                      onClick={() => {
                        setPrompt(prevPrompt);
                        setPrevPrompt('');
                      }}
                    >
                      <Undo2 size={12} />
                      Undo
                    </button>
                  )}
                </div>

                <div className="char-counter-container">
                  <span className={`char-counter ${prompt.length > 1000 ? 'error' : prompt.length > 800 ? 'warn' : ''}`}>
                    {prompt.length} / 1000
                  </span>
                </div>
              </div>
            </div>

            <div className="input-row" style={{ marginTop: '24px' }}>
              <div className="input-group">
                <label className="input-label" style={{ fontSize: '11px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.08em' }}>BROWSER</label>
                <div className="btn-group">
                  {['Chrome', 'Firefox', 'Edge'].map((b) => (
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
                <label className="input-label" style={{ fontSize: '11px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.08em' }}>CATEGORY</label>
                <div className="select-wrapper" ref={categoryRef}>
                  <div
                    className="gen-select"
                    onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                    style={{ userSelect: 'none', display: 'flex', alignItems: 'center' }}
                  >
                    {category}
                  </div>
                  <ChevronDown className="select-icon" size={14} color="rgba(255,255,255,0.45)" />
                  
                  {isCategoryOpen && (
                    <div className="custom-select-dropdown">
                      {CATEGORIES.map((c) => (
                        <div
                          key={c}
                          className={`custom-select-option ${category === c ? 'selected' : ''}`}
                          onClick={() => {
                            setCategory(c);
                            setIsCategoryOpen(false);
                          }}
                        >
                          {c}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="quick-examples">
              <span className="quick-examples-label">Try:</span>
              <div className="quick-examples-chips">
                {QUICK_EXAMPLES.map(example => (
                  <button
                    key={example}
                    className="example-chip"
                    onClick={() => handleChipClick(example)}
                  >
                    {example}
                  </button>
                ))}
              </div>
            </div>

            <button
              className={`btn btn-primary gen-btn ${isGenerating ? "loading" : ""}`}
              style={{ marginTop: '32px', width: '100%', padding: '13px 20px', fontSize: '14px', fontWeight: 600, borderRadius: '10px' }}
              onClick={handleGenerate}
              disabled={isGenerating || !prompt.trim()}
            >
              {isGenerating ? (
                <>
                  <span className="spinner"></span>
                  Generating...
                </>
              ) : (
                <>
                  Generate Extension
                </>
              )}
            </button>
          </div>

          {/* RIGHT: Output Panel */}
          <div className="gen-output-panel">
            {!generated && !isGenerating && !error && (
              <div className="gen-empty-state" style={{ padding: '80px 40px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <div className="empty-icon-wrap" style={{ opacity: 0.12 }}>
                  <FileCode size={36} color="#fff" />
                </div>
                <h3 className="empty-title" style={{ fontSize: '15px', color: 'rgba(255,255,255,0.25)', marginTop: '16px', fontWeight: 400 }}>Your extension code will appear here</h3>
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
                <div className="preview-code-switch">
                  <button className={viewMode === 'preview' ? 'active' : ''} onClick={() => setViewMode('preview')}>Preview</button>
                  <button className={viewMode === 'code' ? 'active' : ''} onClick={() => setViewMode('code')}>Code</button>
                </div>
                
                {viewMode === 'preview' ? (
                  <div style={{ marginBottom: '20px' }}>
                    <PopupPreview
                      extensionName={generated.name}
                      browser={browser}
                      demoSpec={generated.demoSpec}
                    />
                  </div>
                ) : (
                  <>
                    <motion.div
                      className="success-banner"
                      initial={{ opacity: 0, y: -12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.35, ease: 'easeOut' }}
                    >
                      <div className="success-banner-left">
                        <div className="success-icon-wrap">
                          <CheckCircle size={18} color="#2dd4bf" />
                        </div>
                        <div>
                          <p className="success-title">Extension ready</p>
                          <p className="success-sub">manifest.json · content.js · popup.html</p>
                        </div>
                      </div>
                      <button className="download-btn" onClick={() => setShowModal(true)}>
                        <Download size={15} />
                        Download .zip
                      </button>
                    </motion.div>

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
                <div className="code-viewer-container">
                  <div className="code-line-numbers">
                    {generated.files && generated.files[activeFile]
                      ? generated.files[activeFile].split('\n').map((_, i) => (
                          <div key={i} className="line-number">{i + 1}</div>
                        ))
                      : null}
                  </div>
                  <pre className="code-block">
                    <code className={getLanguageClass(activeFile)}>
                      {generated.files ? generated.files[activeFile] : ""}
                    </code>
                  </pre>
                </div>
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
              </>
            )}
              </div>
            )}
          </div>
        </div>
      </div>

      {showModal && (
        <SuccessModal
          extensionName={generated?.name}
          selectedBrowser={browser}
          onDownload={handleDownloadZip}
          downloadDone={downloadDone}
          onClose={() => setShowModal(false)}
        />
      )}

      {showToast && (
        <div className="toast">
          <CheckCircle size={14} color="#2dd4bf" />
          {generated?.name || 'extension'}.zip downloaded
        </div>
      )}
    </section>
  );
}