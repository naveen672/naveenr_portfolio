import { useEffect, useState } from 'react';
import { flushSync } from 'react-dom';

export function useTheme() {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('theme');
      if (stored) return stored === 'dark';
      return false; // Default to light mode
    }
    return false;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  /**
   * Switch theme. With an origin point (the toggle's centre) and View Transitions support,
   * the new theme grows out of that point as a circle, like the sun rising or setting.
   */
  const toggle = (origin?: { x: number; y: number }) => {
    const next = !isDark;
    const apply = () => {
      document.documentElement.classList.toggle('dark', next);
      flushSync(() => setIsDark(next));
    };

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!origin || reduceMotion || !('startViewTransition' in document)) {
      apply();
      return;
    }

    const { x, y } = origin;
    const radius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));
    const transition = document.startViewTransition(apply);
    transition.ready.then(() => {
      document.documentElement.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
        { duration: 750, easing: 'cubic-bezier(0.16, 1, 0.3, 1)', pseudoElement: '::view-transition-new(root)' }
      );
    });
  };

  return { isDark, toggle };
}
