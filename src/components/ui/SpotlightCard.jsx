import React, { useRef, useEffect } from 'react';
import './SpotlightCard.css';

export default function SpotlightCard({ children, className = "" }) {
  const cardRef = useRef(null);
  const [isHovered, setIsHovered] = React.useState(false);

  const handlePointerMove = (e) => {
    if (!cardRef.current) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const xp = e.clientX / window.innerWidth;
    const yp = e.clientY / window.innerHeight;

    cardRef.current.style.setProperty('--x', `${x}px`);
    cardRef.current.style.setProperty('--y', `${y}px`);
    cardRef.current.style.setProperty('--xp', xp);
    cardRef.current.style.setProperty('--yp', yp);
  };

  return (
    <div 
      ref={cardRef} 
      className={`spotlight-card ${className}`}
      onPointerMove={handlePointerMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        '--hover-opacity': isHovered ? 1 : 0
      }}
    >
      <div className="spotlight-card-inner-glow" />
      {children}
    </div>
  );
}
