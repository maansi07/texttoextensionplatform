import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MousePointer2 } from 'lucide-react';
import './PopupPreview.css';

function PreviewSkeleton() {
  return (
    <div className="popup-preview-frame">
      <div className="browser-chrome-bar skeleton-pulse">
        <span className="dot" style={{ background: 'rgba(255,255,255,0.1)' }} />
        <span className="dot" style={{ background: 'rgba(255,255,255,0.1)' }} />
        <span className="dot" style={{ background: 'rgba(255,255,255,0.1)' }} />
        <div className="fake-url-bar" style={{ background: 'rgba(255,255,255,0.05)' }}></div>
      </div>
      <div className="mock-page-container skeleton-pulse" style={{ padding: '28px', opacity: 0.5 }}>
        <div className="mock-page-title-bar" style={{ background: 'rgba(255,255,255,0.05)' }} />
        <div className="mock-code-line" style={{ width: '80%', height: '24px', background: 'rgba(255,255,255,0.05)', marginBottom: '16px' }} />
        <div className="mock-page-paragraph" style={{ background: 'rgba(255,255,255,0.03)' }} />
        <div className="mock-page-paragraph" style={{ background: 'rgba(255,255,255,0.03)' }} />
        <div className="mock-page-paragraph short" style={{ background: 'rgba(255,255,255,0.03)' }} />
      </div>
    </div>
  );
}

export default function PopupPreview({ extensionName, browser, demoSpec }) {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const [demoStep, setDemoStep] = useState('idle');

  useEffect(() => {
    if (prefersReducedMotion) return;

    let mounted = true;
    
    const runDemo = async () => {
      while (mounted) {
        setDemoStep('idle');
        await new Promise(r => setTimeout(r, 1200));
        
        if (!mounted) break;
        setDemoStep('moving');
        await new Promise(r => setTimeout(r, 400));
        
        if (!mounted) break;
        setDemoStep('clicking');
        await new Promise(r => setTimeout(r, 150));
        
        if (!mounted) break;
        setDemoStep('open');
        await new Promise(r => setTimeout(r, 2000));
        
        if (!mounted) break;
        setDemoStep('effect');
        await new Promise(r => setTimeout(r, 1500));
        
        if (!mounted) break;
        setDemoStep('closing');
        await new Promise(r => setTimeout(r, 500));
      }
    };

    runDemo();

    return () => {
      mounted = false;
    };
  }, [prefersReducedMotion]);

  const getUrl = () => {
    if (browser === 'Firefox') return 'about:addons';
    if (browser === 'Edge') return 'edge://extensions';
    return 'chrome://extensions';
  };

  if (!demoSpec) {
    return <PreviewSkeleton />;
  }

  const { pageType, pageContent, interaction } = demoSpec;
  const elements = interaction?.popupElements || [
    { type: 'toggle', label: 'Enabled' }
  ];

  const renderMockPage = () => {
    const blocks = Array(pageContent?.bodyBlocks || 3).fill(0);
    
    if (pageType === 'code-editor') {
      return (
        <div className="mock-page mock-page-code">
          {blocks.map((_, i) => (
            <div key={i} className="mock-code-line" style={{ width: `${80 - (i * 15)}%` }} />
          ))}
        </div>
      );
    }
    
    return (
      <div className={`mock-page mock-page-${pageType}`}>
        <div className="mock-page-title-bar" />
        {pageContent?.headline && <h2 className="mock-page-headline">{pageContent.headline}</h2>}
        {pageContent?.meta && <div className="mock-page-meta">{pageContent.meta}</div>}
        {blocks.map((_, i) => (
          <div key={i} className={`mock-page-paragraph ${i === blocks.length - 1 ? 'short' : ''}`} />
        ))}
        
        <motion.div
          className="effect-toast"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: demoStep === 'effect' ? 1 : 0, y: demoStep === 'effect' ? 0 : 10 }}
          transition={{ duration: 0.3 }}
        >
          {interaction?.effectOnPage || 'Changes applied'}
        </motion.div>
      </div>
    );
  };

  const cursorVariants = {
    idle: { x: '40%', y: '150px', scale: 1 },
    moving: { x: 'calc(100% - 35px)', y: '45px', scale: 1 },
    clicking: { x: 'calc(100% - 35px)', y: '45px', scale: 0.85 },
    open: { x: 'calc(100% - 35px)', y: '45px', scale: 1 },
    effect: { x: 'calc(100% - 35px)', y: '45px', scale: 1 },
    closing: { x: '40%', y: '150px', scale: 1 }
  };

  const isPopupOpen = prefersReducedMotion || demoStep === 'open' || demoStep === 'effect';

  return (
    <div className="popup-preview-frame">
      <div className="browser-chrome-bar">
        <span className="dot dot-red" />
        <span className="dot dot-yellow" />
        <span className="dot dot-green" />
        <div className="fake-url-bar">{getUrl()}</div>
      </div>

      <div className="mock-page-container">
        {renderMockPage()}
      </div>

      <div className="popup-anchor-row" style={{ zIndex: 10, position: 'relative' }}>
        <div className={`ext-icon-dot ${demoStep === 'clicking' ? 'clicked' : ''}`} />
      </div>

      <motion.div
        className="popup-window"
        initial={{ opacity: 0, y: -8, scale: 0.96 }}
        animate={{ opacity: isPopupOpen ? 1 : 0, y: isPopupOpen ? 0 : -8, scale: isPopupOpen ? 1 : 0.96 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        style={{ zIndex: 15, position: 'relative', pointerEvents: isPopupOpen ? 'auto' : 'none' }}
      >
        <div className="popup-window-header">{interaction?.popupTitle || extensionName}</div>
        <div className="popup-window-body">
          {elements.map((el, i) => {
            if (el.type === 'button') {
              return <button key={i} className="mock-btn">{el.label}</button>;
            }
            if (el.type === 'toggle') {
              return (
                <div key={i} className="mock-toggle-row">
                  <span>{el.label}</span>
                  <div className={`mock-toggle ${el.defaultOn !== false ? 'on' : 'off'}`}>
                    <div className="mock-toggle-thumb" />
                  </div>
                </div>
              );
            }
            if (el.type === 'text') {
              return <div key={i} className="mock-text">{el.content}</div>;
            }
            if (el.type === 'input') {
              return <div key={i} className="mock-input">{el.placeholder}</div>;
            }
            return null;
          })}
        </div>
      </motion.div>

      {!prefersReducedMotion && (
        <motion.div
          className="mock-cursor"
          variants={cursorVariants}
          animate={demoStep}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
        >
          <MousePointer2 size={18} className="text-white drop-shadow" />
        </motion.div>
      )}
    </div>
  );
}
