import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface ParallaxOrbProps {
  className?: string;
  variant?: 'primary' | 'secondary';
  speed?: number;
  style?: React.CSSProperties;
}

export function ParallaxOrb({ className, variant = 'primary', speed = 0.05, style }: ParallaxOrbProps) {
  const [offset, setOffset] = useState({ y: 0, x: 0, rotate: 0 });

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setOffset({
        y: scrollY * speed,
        x: Math.sin(scrollY * 0.002) * 20 * speed * 10,
        rotate: Math.sin(scrollY * 0.001) * 5
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [speed]);

  return (
    <div
      className={cn(
        'ios-orb',
        variant === 'primary' ? 'ios-orb-primary' : 'ios-orb-secondary',
        className
      )}
      style={{
        ...style,
        transform: `translate3d(${offset.x}px, ${offset.y}px, 0) rotate(${offset.rotate}deg)`,
        transition: 'transform 0.1s ease-out'
      }}
    />
  );
}
