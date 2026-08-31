/**
 * Runs work once the document has loaded and the main thread is idle, and
 * returns a function that cancels it.
 *
 * Everything the first screen does not need goes through here: the scene, the
 * capability probe, smooth scrolling, the metrics reporter. A request issued
 * before the first paint lands in the browser's critical path whether or not
 * the code needs it then, and each extra wave costs a round trip on a slow
 * connection.
 *
 * The timeout bounds the wait — a permanently busy main thread must not mean
 * the work never happens.
 */
export function afterPaint(run: () => void, timeout = 1_000): () => void {
  let handle = 0;
  let timer = 0;
  let cancelled = false;

  const invoke = (): void => {
    if (!cancelled) run();
  };

  const schedule = (): void => {
    if (cancelled) return;
    if (typeof window.requestIdleCallback === 'function') {
      handle = window.requestIdleCallback(invoke, { timeout });
    } else {
      timer = window.setTimeout(invoke, 0);
    }
  };

  if (document.readyState === 'complete') schedule();
  else window.addEventListener('load', schedule, { once: true });

  return () => {
    cancelled = true;
    window.removeEventListener('load', schedule);
    if (handle && typeof window.cancelIdleCallback === 'function')
      window.cancelIdleCallback(handle);
    if (timer) window.clearTimeout(timer);
  };
}
