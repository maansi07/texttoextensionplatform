import { useEffect, useRef, useState } from 'react';

export default function CountUp({ end = 0, duration = 800, suffix = '' }) {
  const [value, setValue] = useState(0);
  const rafRef = useRef(null);
  const startRef = useRef(null);

  useEffect(() => {
    const start = performance.now();
    startRef.current = start;
    const from = 0;
    const to = Number(end) || 0;
    const anim = (t) => {
      const elapsed = t - startRef.current;
      const pct = Math.min(1, elapsed / duration);
      const eased = 1 - Math.pow(1 - pct, 3);
      const current = Math.round((from + (to - from) * eased) * 10) / 10;
      setValue(current);
      if (pct < 1) rafRef.current = requestAnimationFrame(anim);
    };
    rafRef.current = requestAnimationFrame(anim);
    return () => cancelAnimationFrame(rafRef.current);
  }, [end, duration]);

  return <>{value}{suffix}</>;
}
