import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, CheckCircle, FileCode, Copy } from 'lucide-react';
import './SuccessModal.css';

const INSTALL_STEPS = [
  {
    number: '1',
    title: 'Open Chrome Extensions',
    description: 'Type this in your address bar and press Enter:',
    code: 'chrome://extensions',
    extra: 'Then toggle on Developer mode (top-right switch).',
    icon: 'chrome',
  },
  {
    number: '2',
    title: 'Unzip the file',
    description: 'Extract the downloaded .zip to a folder on your desktop.',
    code: null,
    extra: 'You should see manifest.json inside the extracted folder.',
    icon: 'folder',
  },
  {
    number: '3',
    title: 'Load unpacked',
    description: 'Click "Load unpacked" and select the extracted folder.',
    code: null,
    extra: 'Your extension icon will appear in the Chrome toolbar instantly.',
    icon: 'puzzle',
  },
];

function InstallSteps({ downloadDone }) {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="install-steps">
      {INSTALL_STEPS.map((step, idx) => {
        const isDimmed = !downloadDone && idx > 0;
        return (
          <motion.div
            key={step.number}
            className="step-row"
            initial={{ opacity: 0.5 }}
            animate={{ opacity: isDimmed ? 0.3 : 1 }}
            transition={{ duration: 0.4 }}
          >
            <div className="step-left">
              <div className="step-num">{step.number}</div>
              {idx < INSTALL_STEPS.length - 1 && <div className="step-connector" />}
            </div>
            <div className="step-content">
              <p className="step-title">{step.title}</p>
              <p className="step-desc">{step.description}</p>
              {step.code && (
                <div 
                  className="step-code" 
                  onClick={() => handleCopy(step.code)}
                  role="button"
                  aria-label="Copy URL"
                  tabIndex={0}
                >
                  {step.code}
                  <Copy size={12} style={{marginLeft: '4px'}}/>
                  {copied && <span style={{fontSize: '10px', marginLeft: '4px'}}>Copied!</span>}
                </div>
              )}
              <p className="step-extra">{step.extra}</p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

export default function SuccessModal({ extensionName, onDownload, downloadDone, onClose }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <AnimatePresence>
      <motion.div 
        className="modal-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />

      <motion.div
        className="success-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ type: 'spring', stiffness: 320, damping: 28 }}
      >
        {/* Left panel — download */}
        <div className="modal-left">
          <div className="modal-extension-card">
            <div className="ext-icon">⚡</div>
            <div>
              <p id="modal-title" className="ext-name">{extensionName || 'Your Extension'}</p>
              <p className="ext-meta">Chrome MV3 · Ready to install</p>
            </div>
          </div>

          <div className="file-list">
            {['manifest.json', 'content.js', 'popup.html'].map(f => (
              <div className="file-row" key={f}>
                <FileCode size={14} color="rgba(255,255,255,0.4)" />
                <span>{f}</span>
                <span className="file-check">✓</span>
              </div>
            ))}
          </div>

          <button
            className={`modal-download-btn ${downloadDone ? 'done' : ''}`}
            onClick={onDownload}
          >
            {downloadDone ? (
              <><CheckCircle size={16} /> Downloaded</>
            ) : (
              <><Download size={16} /> Download .zip</>
            )}
          </button>

          {downloadDone && (
            <motion.p
              className="download-hint"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              Now follow the steps on the right →
            </motion.p>
          )}
        </div>

        {/* Divider */}
        <div className="modal-divider" />

        {/* Right panel — install guide */}
        <div className="modal-right">
          <p className="install-title">Install in Chrome</p>
          <p className="install-sub">3 steps · takes under a minute</p>
          <InstallSteps downloadDone={downloadDone} />
        </div>
        
        <button className="modal-close" onClick={onClose} aria-label="Close modal">
          ×
        </button>
      </motion.div>
    </AnimatePresence>
  );
}
