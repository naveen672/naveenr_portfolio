import { ReactNode } from 'react';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { cn } from '@/lib/utils';

interface RevealSectionProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  glassEffect?: boolean;
}

export function RevealSection({ children, className, delay = 0, glassEffect = false }: RevealSectionProps) {
  const { ref, isVisible } = useScrollReveal(0.1);

  return (
    <div
      ref={ref}
      className={cn(
        'reveal',
        isVisible && 'visible',
        glassEffect && 'glass-reveal',
        className
      )}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}
