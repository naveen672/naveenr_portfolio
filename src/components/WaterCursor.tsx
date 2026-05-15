import { useEffect, useState, useCallback, useRef } from 'react';

interface Ripple {
  id: number;
  x: number;
  y: number;
  timestamp: number;
  isSplash?: boolean;
}

interface SplashDroplet {
  id: number;
  x: number;
  y: number;
  angle: number;
  distance: number;
  timestamp: number;
}

const WaterCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const [splashDroplets, setSplashDroplets] = useState<SplashDroplet[]>([]);
  const [isVisible, setIsVisible] = useState(false);
  const rippleIdRef = useRef(0);
  const dropletIdRef = useRef(0);
  const lastRippleTime = useRef(0);

  const createRipple = useCallback((x: number, y: number, isSplash = false) => {
    const now = Date.now();
    // Throttle regular ripples to every 80ms for performance
    if (!isSplash && now - lastRippleTime.current < 80) return;
    if (!isSplash) lastRippleTime.current = now;

    const newRipple: Ripple = {
      id: rippleIdRef.current++,
      x,
      y,
      timestamp: now,
      isSplash,
    };

    setRipples((prev) => [...prev.slice(-15), newRipple]);
  }, []);

  const createSplash = useCallback((x: number, y: number) => {
    const now = Date.now();
    // Create main splash ripple
    createRipple(x, y, true);

    // Create droplets that fly outward
    const dropletCount = 8 + Math.floor(Math.random() * 4);
    const newDroplets: SplashDroplet[] = [];

    for (let i = 0; i < dropletCount; i++) {
      const angle = (i / dropletCount) * Math.PI * 2 + (Math.random() - 0.5) * 0.5;
      const distance = 40 + Math.random() * 60;
      
      newDroplets.push({
        id: dropletIdRef.current++,
        x,
        y,
        angle,
        distance,
        timestamp: now,
      });
    }

    setSplashDroplets((prev) => [...prev.slice(-30), ...newDroplets]);
  }, [createRipple]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      setIsVisible(true);
      createRipple(e.clientX, e.clientY);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const handleMouseEnter = () => {
      setIsVisible(true);
    };

    const handleClick = (e: MouseEvent) => {
      createSplash(e.clientX, e.clientY);
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);
    window.addEventListener('click', handleClick);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      window.removeEventListener('click', handleClick);
    };
  }, [createRipple, createSplash]);

  // Clean up old ripples and droplets
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      setRipples((prev) => prev.filter((r) => now - r.timestamp < (r.isSplash ? 1200 : 1000)));
      setSplashDroplets((prev) => prev.filter((d) => now - d.timestamp < 600));
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden">
      {/* Ripple trails */}
      {ripples.map((ripple) => {
        const duration = ripple.isSplash ? 1200 : 1000;
        const age = Date.now() - ripple.timestamp;
        const progress = Math.min(age / duration, 1);
        const baseScale = ripple.isSplash ? 2 : 1;
        const maxScale = ripple.isSplash ? 8 : 4;
        const scale = baseScale + progress * (maxScale - baseScale);
        const opacity = 1 - progress;
        const size = ripple.isSplash ? 40 : 20;

        return (
          <div
            key={ripple.id}
            className="absolute rounded-full"
            style={{
              left: ripple.x,
              top: ripple.y,
              width: size,
              height: size,
              transform: `translate(-50%, -50%) scale(${scale})`,
              opacity: opacity * (ripple.isSplash ? 0.6 : 0.4),
              background: ripple.isSplash
                ? `radial-gradient(circle, 
                    hsla(var(--primary), 0.4) 0%, 
                    hsla(var(--primary), 0.2) 30%,
                    hsla(var(--primary), 0.1) 50%, 
                    transparent 70%
                  )`
                : `radial-gradient(circle, 
                    hsla(var(--primary), 0.3) 0%, 
                    hsla(var(--primary), 0.1) 40%, 
                    transparent 70%
                  )`,
              boxShadow: ripple.isSplash
                ? `
                    0 0 ${20 * scale}px hsla(var(--primary), ${0.3 * opacity}),
                    0 0 ${40 * scale}px hsla(var(--primary), ${0.15 * opacity}),
                    inset 0 0 ${10 * scale}px hsla(var(--primary), ${0.2 * opacity})
                  `
                : `
                    0 0 ${10 * scale}px hsla(var(--primary), ${0.2 * opacity}),
                    inset 0 0 ${5 * scale}px hsla(var(--primary), ${0.1 * opacity})
                  `,
              transition: 'none',
            }}
          />
        );
      })}

      {/* Splash droplets */}
      {splashDroplets.map((droplet) => {
        const age = Date.now() - droplet.timestamp;
        const progress = Math.min(age / 600, 1);
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const gravity = progress * progress * 30;
        
        const currentX = droplet.x + Math.cos(droplet.angle) * droplet.distance * easeOut;
        const currentY = droplet.y + Math.sin(droplet.angle) * droplet.distance * easeOut + gravity;
        const opacity = 1 - progress;
        const scale = 1 - progress * 0.5;

        return (
          <div
            key={droplet.id}
            className="absolute rounded-full"
            style={{
              left: currentX,
              top: currentY,
              width: 6,
              height: 6,
              transform: `translate(-50%, -50%) scale(${scale})`,
              opacity: opacity * 0.8,
              background: `radial-gradient(circle at 30% 30%, 
                hsla(var(--primary), 0.9) 0%, 
                hsla(var(--primary), 0.5) 50%, 
                hsla(var(--primary), 0.2) 100%
              )`,
              boxShadow: `
                0 1px 4px hsla(var(--primary), 0.4),
                0 0 8px hsla(var(--primary), 0.2),
                inset 0 1px 2px hsla(0, 0%, 100%, 0.5)
              `,
            }}
          />
        );
      })}

      {/* Water droplet cursor */}
      <div
        className="absolute transition-opacity duration-200"
        style={{
          left: position.x,
          top: position.y,
          opacity: isVisible ? 1 : 0,
          transform: 'translate(-50%, -50%)',
        }}
      >
        {/* Outer glow */}
        <div
          className="absolute rounded-full animate-pulse"
          style={{
            width: 40,
            height: 40,
            left: -20,
            top: -20,
            background: `radial-gradient(circle, 
              hsla(var(--primary), 0.15) 0%, 
              transparent 70%
            )`,
          }}
        />

        {/* Main droplet */}
        <div
          className="relative"
          style={{
            width: 16,
            height: 16,
            transform: 'translate(-50%, -50%)',
          }}
        >
          {/* Droplet shape */}
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background: `
                radial-gradient(circle at 30% 30%, 
                  hsla(var(--primary), 0.8) 0%, 
                  hsla(var(--primary), 0.4) 50%, 
                  hsla(var(--primary), 0.2) 100%
                )
              `,
              boxShadow: `
                0 2px 8px hsla(var(--primary), 0.4),
                0 0 20px hsla(var(--primary), 0.2),
                inset 0 -2px 4px hsla(var(--primary), 0.3),
                inset 0 2px 4px hsla(0, 0%, 100%, 0.4)
              `,
              backdropFilter: 'blur(2px)',
            }}
          />

          {/* Highlight reflection */}
          <div
            className="absolute rounded-full"
            style={{
              width: 6,
              height: 6,
              left: 2,
              top: 2,
              background: `radial-gradient(circle, 
                hsla(0, 0%, 100%, 0.8) 0%, 
                hsla(0, 0%, 100%, 0.2) 50%, 
                transparent 100%
              )`,
            }}
          />

          {/* Secondary highlight */}
          <div
            className="absolute rounded-full"
            style={{
              width: 3,
              height: 3,
              right: 3,
              bottom: 4,
              background: `radial-gradient(circle, 
                hsla(0, 0%, 100%, 0.5) 0%, 
                transparent 100%
              )`,
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default WaterCursor;
