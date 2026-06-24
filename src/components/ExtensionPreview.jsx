import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, X, Lock, GripVertical, Move, Globe, AlertTriangle } from 'lucide-react';
import './ExtensionPreview.css';

function buildSrcdoc(popupHtml, popupJs, popupCss) {
  let html = popupHtml || '';

  if (popupCss && !html.includes('<style>')) {
    if (html.includes('</head>')) {
      html = html.replace('</head>', `<style>\n${popupCss}\n</style></head>`);
    } else {
      html = `<style>\n${popupCss}\n</style>\n` + html;
    }
  }

  if (popupJs && !html.includes('<script>')) {
    if (html.includes('</body>')) {
      html = html.replace('</body>', `<script>\n${popupJs}\n</script></body>`);
    } else {
      html += `\n<script>\n${popupJs}\n</script>`;
    }
  }

  const baseStyles = `
    <style>
      *, *::before, *::after { box-sizing: border-box; }
      body { margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; font-size: 14px; }
    </style>
  `;
  if (html.includes('<head>')) {
    html = html.replace('<head>', `<head>\n${baseStyles}`);
  } else {
    html = `<head>\n${baseStyles}\n</head>\n` + html;
  }

  return html;
}

export default function ExtensionPreview({
  popupHtml, popupJs, popupCss, extensionName, onClose, hasPopup
}) {
  const srcdoc = hasPopup ? buildSrcdoc(popupHtml, popupJs, popupCss) : '';
  const [position, setPosition] = useState({ x: null, y: null });
  const [iframeSize, setIframeSize] = useState({ w: 360, h: 500 });
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const dragRef = useRef(null);

  function handleRefresh() {
    setIsRefreshing(true);
    setRefreshKey(k => k + 1);
    setTimeout(() => setIsRefreshing(false), 600);
  }

  return (
    <motion.div
      className="ext-preview-wrapper"
      style={position.x !== null ? { left: position.x, top: position.y } : {}}
      initial={{ opacity: 0, scale: 0.92, y: 16 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.92, y: 16 }}
      transition={{ type: 'spring', stiffness: 340, damping: 26 }}
      drag
      dragMomentum={false}
      onDragEnd={(e, info) => {
        setPosition(prev => ({
          x: (prev.x ?? 0) + info.offset.x,
          y: (prev.y ?? 0) + info.offset.y,
        }));
      }}
    >
      <div className="ext-chrome-bar" ref={dragRef}>
        <div className="ext-chrome-identity">
          <div className="ext-chrome-icon">⚡</div>
          <span className="ext-chrome-name">{extensionName || 'Extension Preview'}</span>
        </div>
        <div className="ext-chrome-actions">
          {hasPopup && (
            <button className="chrome-action-btn" onClick={handleRefresh} title="Refresh preview">
              <RefreshCw size={13} className={isRefreshing ? 'spinning' : ''} />
            </button>
          )}
          <button className="chrome-action-btn" onClick={onClose} title="Close preview">
            <X size={13} />
          </button>
        </div>
      </div>

      {hasPopup ? (
        <>
          <div className="ext-chrome-addressbar">
            <div className="addressbar-lock"><Lock size={9} /></div>
            <span className="addressbar-url">chrome-extension://preview/popup.html</span>
          </div>
          
          {popupHtml && popupHtml.includes('chrome.') && (
            <div className="sandbox-warning">
              <AlertTriangle size={11} />
              Chrome APIs unavailable in preview — visual only
            </div>
          )}

          <div className="ext-iframe-wrap">
            <iframe
              key={refreshKey}
              srcDoc={srcdoc}
              title="Extension popup preview"
              sandbox="allow-scripts allow-forms allow-same-origin"
              className="ext-iframe"
              style={{ width: iframeSize.w, height: iframeSize.h }}
            />
          </div>

          <div
            className="resize-handle"
            onMouseDown={(e) => {
              e.preventDefault();
              const startX = e.clientX, startY = e.clientY;
              const startW = iframeSize.w, startH = iframeSize.h;
              function onMove(ev) {
                setIframeSize({
                  w: Math.max(240, startW + ev.clientX - startX),
                  h: Math.max(200, startH + ev.clientY - startY),
                });
              }
              function onUp() {
                window.removeEventListener('mousemove', onMove);
                window.removeEventListener('mouseup', onUp);
              }
              window.addEventListener('mousemove', onMove);
              window.addEventListener('mouseup', onUp);
            }}
            title="Drag to resize"
          >
            <GripVertical size={12} color="rgba(255,255,255,0.25)" />
          </div>

          <div className="size-badge">
            {iframeSize.w} × {iframeSize.h}
          </div>

          <div className="drag-hint">
            <Move size={10} /> Drag to move
          </div>
        </>
      ) : (
        <div className="no-popup-state">
          <Globe size={28} color="rgba(255,255,255,0.15)" />
          <p>This extension runs on the page</p>
          <span>No popup UI — it works automatically when you visit websites.<br />Install it to see it in action.</span>
        </div>
      )}
    </motion.div>
  );
}
