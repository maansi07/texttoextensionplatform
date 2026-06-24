import React, { useState, useEffect } from 'react';
import "./TrustedBy.css";
import { motion, useReducedMotion } from 'framer-motion';

function useOrbitAngle(startAngle, speed) {
  const [angle, setAngle] = useState(startAngle);
  useEffect(() => {
    let raf;
    const tick = () => {
      setAngle((a) => (a + speed) % 360);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [speed]);
  return angle;
}

function OrbitingLogo({ company, index, total, reduce }) {
  const speed = reduce ? 0 : 0.3;
  const angle = useOrbitAngle((360 / total) * index, speed);

  const normalizedAngle = angle % 360;

  // 180 is the center point. 
  // Map 0-360 to x position from 500px (right) to -500px (left)
  const x = ((180 - normalizedAngle) / 180) * 600;

  const distanceFromCenter = Math.abs(180 - normalizedAngle);
  // Opacity: 1 at center, fades to 0 as it moves away
  const opacity = reduce ? 0.55 : Math.max(0, 1 - (distanceFromCenter / 120));

  return (
    <motion.span
      style={{ transform: `translate(calc(-50% + ${x}px), -50%)`, opacity }}
      className="trusted-by-name"
    >
      {company}
    </motion.span>
  );
}

export default function TrustedBy() {
  const reduce = useReducedMotion();

  const companies = [
    "ACME Corp", "Globex", "Initech", "Soylent", "Umbrella", "Massive Dynamic"
  ];

  return (
    <section className="trusted-by">
      <div className="trusted-by-inner">
        <p className="tb-subtitle">Trusted by developers at</p>
        <div className="tb-logos-orbit">
          {companies.map((company, i) => (
            <OrbitingLogo
              key={company}
              company={company}
              index={i}
              total={companies.length}
              reduce={reduce}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
