import { useEffect, useState } from 'react';

/**
 * Holds the WebGL canvas back until the document has loaded and the main thread
 * is idle.
 *
 * Parsing three.js and initialising a WebGL context during load competes with
 * the hero headline for the main thread: Lighthouse measured a 3.4s largest
 * contentful paint and a 0.59 performance score with the canvas mounted on
 * first render. The object is the second thing the page needs, not the first.
 */
export function useDeferredMount(enabled: boolean): boolean {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!enabled) {
      setReady(false);
      return;
    }

    let handle = 0;
    let timer = 0;
    const mount = (): void => setReady(true);
    const schedule = (): void => {
      // The timeout bounds the wait: a permanently busy main thread must not
      // mean the object never arrives.
      if (typeof window.requestIdleCallback === 'function') {
        handle = window.requestIdleCallback(mount, { timeout: 1_500 });
      } else {
        timer = window.setTimeout(mount, 300);
      }
    };

    if (document.readyState === 'complete') schedule();
    else window.addEventListener('load', schedule, { once: true });

    return () => {
      window.removeEventListener('load', schedule);
      if (handle && typeof window.cancelIdleCallback === 'function') {
        window.cancelIdleCallback(handle);
      }
      if (timer) window.clearTimeout(timer);
    };
  }, [enabled]);

  return ready;
}
