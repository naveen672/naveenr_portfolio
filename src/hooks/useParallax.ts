import { useEffect, useState } from 'react';

export function useParallax(speed: number = 0.1) {
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setOffset(window.scrollY * speed);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [speed]);

  return offset;
}

export function useElementParallax(speed: number = 0.05) {
  const [transform, setTransform] = useState({ x: 0, y: 0, rotate: 0 });

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setTransform({
        x: Math.sin(scrollY * 0.002) * 10 * speed * 100,
        y: scrollY * speed,
        rotate: Math.sin(scrollY * 0.001) * 2 * speed * 100
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [speed]);

  return transform;
}
