import { useEffect, useState } from 'react';
import { afterPaint } from '../lib/after-paint';

/**
 * Holds the WebGL canvas back until the document has loaded and the main
 * thread is idle.
 *
 * Parsing three.js and initialising a WebGL context during load competes with
 * the hero headline for the main thread: Lighthouse measured a 3.4s largest
 * contentful paint with the canvas mounted on first render. The object is the
 * second thing the page needs, not the first.
 */
export function useDeferredMount(enabled: boolean): boolean {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!enabled) {
      setReady(false);
      return;
    }
    return afterPaint(() => setReady(true), 1_500);
  }, [enabled]);

  return ready;
}
