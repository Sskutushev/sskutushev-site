import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { useEffect, useState } from 'react';

const signals = ['DOMAIN INVARIANTS', 'DATA HONESTY', 'FAIL-CLOSED FLOWS', 'PRODUCTION OWNERSHIP'];

export function RotatingSignal(): React.JSX.Element {
  const [index, setIndex] = useState(0);
  const reduced = useReducedMotion();
  const signal = signals[index] ?? signals[0];

  useEffect(() => {
    if (reduced) return;
    const timer = window.setInterval(
      () => setIndex((current) => (current + 1) % signals.length),
      2400,
    );
    return () => window.clearInterval(timer);
  }, [reduced]);

  return (
    <div className="rotating-signal" aria-label={signals.join(', ')}>
      <span>FOCUS /</span>
      <AnimatePresence mode="wait">
        <motion.strong
          aria-hidden
          key={signal}
          initial={reduced ? false : { opacity: 0, y: 12, filter: 'blur(6px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          {...(reduced ? {} : { exit: { opacity: 0, y: -12, filter: 'blur(6px)' } })}
          transition={{ duration: 0.35 }}
        >
          {signal}
        </motion.strong>
      </AnimatePresence>
      <i aria-hidden />
    </div>
  );
}
