import { useEffect } from 'react';

export function usePointerGlow(disabled: boolean): void {
  useEffect(() => {
    if (disabled) return;
    const update = (event: PointerEvent): void => {
      document.documentElement.style.setProperty('--pointer-x', `${event.clientX}px`);
      document.documentElement.style.setProperty('--pointer-y', `${event.clientY}px`);
    };
    window.addEventListener('pointermove', update, { passive: true });
    return () => window.removeEventListener('pointermove', update);
  }, [disabled]);
}
