import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'framer-motion';
import { measureWord, zoomTransform, type WordLayout } from '@/lib/word-zoom';

const WORD = 'HELLO';
const EASE_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1];

function Heading() {
  return (
    <div className="mx-auto w-full max-w-6xl 2xl:max-w-[1400px] px-5 sm:px-8 md:px-12">
      <h2 className="font-display text-[clamp(3rem,10vw,9rem)] font-medium leading-[0.92] tracking-[-0.05em] text-white text-balance">
        Let’s build <span className="gradient-text">something.</span>
      </h2>
      <p className="mt-6 max-w-xl text-lg md:text-xl text-white/65 text-pretty">
        Always interested in hearing about new projects, collaborations, or just chatting about tech.
      </p>
    </div>
  );
}

/**
 * The bookend to the hero: the page ends on a clean stage with HELLO cut out of it, glowing with the
 * finale's night light. Scrolling flies through the H into the dark Contact finale.
 */
export function ContactPortal() {
  const reduceMotion = useReducedMotion();
  const stageRef = useRef<HTMLElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const zoomRef = useRef<SVGGElement>(null);
  const [layout, setLayout] = useState<WordLayout | null>(null);

  const { scrollYProgress } = useScroll({ target: stageRef, offset: ['start start', 'end end'] });
  // Plain motion value (see Opening): keeps these transforms off the page-wide native ScrollTimeline.
  const p = useMotionValue(0);

  const maskOpacity = useTransform(p, [0.54, 0.62], [1, 0]);
  const captionOpacity = useTransform(p, [0, 0.1], [1, 0]);
  const worldScale = useTransform(p, [0, 0.6], [1.35, 1]);
  const glowY = useTransform(p, [0.45, 1], ['0vh', '-38vh']);
  const glowOpacity = useTransform(p, [0.45, 0.9], [1, 0.45]);
  const headingOpacity = useTransform(p, [0.58, 0.76], [0, 1]);
  const headingY = useTransform(p, [0.58, 0.8], [40, 0]);

  const applyZoom = (v: number) => {
    if (zoomRef.current && layout) zoomRef.current.setAttribute('transform', zoomTransform(layout, v, 0.06, 0.5));
  };

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    p.set(v);
    // Light page until we are through the letters, then the dark finale
    if (stageRef.current) stageRef.current.dataset.navTone = v < 0.55 ? 'light' : 'dark';
  });
  useMotionValueEvent(p, 'change', applyZoom);
  useLayoutEffect(() => applyZoom(p.get()));

  useEffect(() => {
    if (reduceMotion) return;
    const el = viewportRef.current;
    if (!el) return;
    let cancelled = false;
    const update = () =>
      measureWord(WORD, 0, el.clientWidth, el.clientHeight)
        .then((l) => {
          if (!cancelled) setLayout(l);
        })
        .catch(() => undefined);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => {
      cancelled = true;
      ro.disconnect();
    };
  }, [reduceMotion]);

  if (reduceMotion) {
    return (
      <section data-nav-tone="dark" className="relative bg-[#07080b] pt-28 md:pt-40 pb-14">
        <Heading />
      </section>
    );
  }

  return (
    <section id="hello" ref={stageRef} data-nav-tone="light" className="relative h-[220vh]" aria-label="Say hello">
      <div ref={viewportRef} className="sticky top-0 h-[100svh] overflow-hidden bg-background">
        {/* The finale's night light, seen through the letters */}
        <motion.div className="absolute inset-0 overflow-hidden bg-[#07080b]" style={{ scale: worldScale }}>
          <motion.div
            aria-hidden
            className="portal-glow absolute -left-[20vw] -top-[10vh] h-[120vh] w-[140vw]"
            style={{ y: glowY, opacity: glowOpacity }}
          />
        </motion.div>

        {/* Landing: the finale's heading */}
        <motion.div
          className="absolute inset-0 z-10 flex items-center"
          style={{ opacity: headingOpacity, y: headingY }}
        >
          <Heading />
        </motion.div>

        {/* The page, with HELLO cut out of it */}
        <motion.div className="absolute inset-0 z-20 pointer-events-none" style={{ opacity: maskOpacity }}>
          {layout && (
            <svg width={layout.w} height={layout.h} className="absolute inset-0" aria-hidden>
              <defs>
                <mask id="portal-word-mask" maskUnits="userSpaceOnUse" x="0" y="0" width={layout.w} height={layout.h}>
                  <rect width={layout.w} height={layout.h} fill="white" />
                  <g ref={zoomRef}>
                    <path d={layout.d} fill="black" />
                  </g>
                </mask>
              </defs>
              <rect width={layout.w} height={layout.h} className="fill-background" mask="url(#portal-word-mask)" />
            </svg>
          )}
        </motion.div>

        {/* Captions on the stage */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: EASE_OUT }}
          className="absolute inset-x-0 z-30 px-5 text-center text-base md:text-lg text-muted-foreground pointer-events-none"
          style={{ top: layout ? layout.baseline - layout.fontSize * 0.95 : '28%' }}
        >
          <motion.span style={{ opacity: captionOpacity }} className="inline-block">
            Got a project in mind? Say
          </motion.span>
        </motion.p>
        <motion.div
          className="absolute inset-x-0 bottom-8 z-30 flex flex-col items-center gap-3 text-muted-foreground pointer-events-none"
          style={{ opacity: captionOpacity }}
          aria-hidden
        >
          <span className="whitespace-nowrap text-[11px] font-medium uppercase tracking-[0.25em]">Keep scrolling</span>
          <span className="hero-cue-track relative h-10 w-px overflow-hidden">
            <span className="absolute inset-x-0 top-0 h-1/2 bg-current animate-hero-cue" />
          </span>
        </motion.div>
      </div>
    </section>
  );
}
