import { motion, useReducedMotion } from 'motion/react';
import type { PropsWithChildren } from 'react';

export function Reveal({
  children,
  className,
}: PropsWithChildren<{ className?: string }>): React.JSX.Element {
  const reduced = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduced ? false : { opacity: 0, y: 42, filter: 'blur(10px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, amount: 0.16 }}
      transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}
