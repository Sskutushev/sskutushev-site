import { useEffect, useRef, useState } from 'react';

export function useSceneVisibility(): {
  container: React.RefObject<HTMLDivElement | null>;
  visible: boolean;
} {
  const container = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = container.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry?.isIntersecting ?? false),
      {
        rootMargin: '120px',
      },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return { container, visible };
}
