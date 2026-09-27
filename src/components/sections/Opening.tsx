import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from 'framer-motion';
import { ArrowRight, Download } from 'lucide-react';
import { measureWord, zoomTransform, type WordLayout } from '@/lib/word-zoom';

const typingPhrases = [
  'I build for the web',
  'Full Stack Developer',
  'SRE & DevOps Engineer',
  'AI Developer',
  'Freelancer',
];

const WORD = 'NAVEEN';
const EASE_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1];

function useTypingPhrase() {
  const [index, setIndex] = useState(0);
  const [text, setText] = useState('');
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const phrase = typingPhrases[index];
    if (!deleting && text === phrase) {
      const t = setTimeout(() => setDeleting(true), 2000);
      return () => clearTimeout(t);
    }
    if (deleting && text === '') {
      setDeleting(false);
      setIndex((i) => (i + 1) % typingPhrases.length);
      return;
    }
    const t = setTimeout(
      () => setText((prev) => (deleting ? prev.slice(0, -1) : phrase.slice(0, prev.length + 1))),
      deleting ? 45 : 90
    );
    return () => clearTimeout(t);
  }, [text, deleting, index]);

  return text;
}

function HeroActions() {
  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <a
        href="#contact"
        onClick={(e) => {
          e.preventDefault();
          document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
        }}
        className="hero-cta group inline-flex items-center justify-center gap-2 rounded-full px-6 py-3.5 font-medium transition-transform duration-300 hover:-translate-y-0.5"
      >
        Get in touch
        <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden />
      </a>
      <a
        href="/Naveen_resume.pdf"
        download="Naveen_R_Resume.pdf"
        className="hero-cta-secondary inline-flex items-center justify-center gap-2 rounded-full px-6 py-3.5 font-medium backdrop-blur-md transition-colors duration-300"
      >
        <Download className="w-4 h-4" aria-hidden />
        Download Resume
      </a>
    </div>
  );
}

/** The world on the other side of the letters: day sky, or a starry night in dark mode. */
function Sky({ drift }: { drift?: MotionValue<string> }) {
  return (
    <div className="hero-world absolute inset-0 overflow-hidden" aria-hidden>
      <div className="hero-stars absolute inset-0" />
      <div className="hero-sun absolute" />
      <motion.div className="absolute inset-x-[-10%] bottom-[-6%] h-[62%]" style={drift ? { y: drift } : undefined}>
        <img src="/hero/clouds.webp" alt="" className="hero-cloud-band hero-cloud-a absolute inset-0 h-full w-full object-cover object-bottom" />
        <img src="/hero/clouds.webp" alt="" className="hero-cloud-band hero-cloud-b absolute inset-0 h-full w-full object-cover object-bottom opacity-80" />
      </motion.div>
    </div>
  );
}

export function Opening() {
  const reduceMotion = useReducedMotion();
  const stageRef = useRef<HTMLElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const zoomRef = useRef<SVGGElement>(null);
  const [layout, setLayout] = useState<WordLayout | null>(null);
  const role = useTypingPhrase();

  const { scrollYProgress } = useScroll({ target: stageRef, offset: ['start start', 'end end'] });
  // Plain motion value: transforms taken straight from scrollYProgress get accelerated onto a native
  // ScrollTimeline that measures the whole page rather than this stage.
  const p = useMotionValue(0);

  const maskOpacity = useTransform(p, [0.58, 0.66], [1, 0]);
  const introOpacity = useTransform(p, [0, 0.08], [1, 0]);
  const worldScale = useTransform(p, [0, 0.7], [1.3, 1]);
  const cloudDrift = useTransform(p, [0.3, 1], ['0%', '12%']);
  const contentOpacity = useTransform(p, [0.57, 0.74], [0, 1]);
  const contentY = useTransform(p, [0.57, 0.78], [40, 0]);
  const contentPointer = useTransform(contentOpacity, (v) => (v > 0.6 ? 'auto' : 'none'));

  // Exponential zoom so every scroll step feels like the same speed of travel
  const applyZoom = (v: number) => {
    const g = zoomRef.current;
    if (!g || !layout) return;
    g.setAttribute('transform', zoomTransform(layout, v, 0.04, 0.52));
  };

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    p.set(v);
    // Dark stage until we are through the letters
    if (stageRef.current) stageRef.current.dataset.navTone = v < 0.55 ? 'dark' : 'light';
  });
  useMotionValueEvent(p, 'change', applyZoom);
  useLayoutEffect(() => applyZoom(p.get()));

  useEffect(() => {
    if (reduceMotion) return;
    const el = viewportRef.current;
    if (!el) return;
    let cancelled = false;
    const update = () =>
      measureWord(WORD, 1, el.clientWidth, el.clientHeight)
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

  const content = (
    <div className="mx-auto w-full max-w-6xl 2xl:max-w-[1400px] px-5 sm:px-6 md:px-12">
      <h1 className="hero-ink font-display font-medium text-[clamp(2.75rem,8vw,6.5rem)] leading-[0.95] tracking-[-0.045em]">
        Hi, I'm Naveen R.
      </h1>
      <p className="hero-ink-soft mt-3 md:mt-4 min-h-[1.2em] font-display text-[clamp(1.5rem,4vw,3rem)] font-medium leading-[1.1] tracking-[-0.03em]">
        {role}
        <span className="ml-1 inline-block h-[0.85em] w-[3px] translate-y-[0.08em] bg-primary animate-pulse" aria-hidden />
      </p>
      <p className="hero-ink-soft mt-5 max-w-xl text-base md:text-lg leading-relaxed text-pretty">
        Full-stack developer passionate about clean code, beautiful interfaces, and solving complex problems.
        Currently exploring AI, distributed systems, and the future of computing.
      </p>
      <div className="mt-8">
        <HeroActions />
      </div>
    </div>
  );

  if (reduceMotion) {
    return (
      <section ref={stageRef} className="relative flex h-[100svh] min-h-[600px] items-center overflow-hidden">
        <Sky />
        <div className="relative z-10 w-full">{content}</div>
      </section>
    );
  }

  return (
    <section ref={stageRef} data-nav-tone="dark" className="relative h-[260vh]" aria-label="Introduction">
      <div ref={viewportRef} className="sticky top-0 h-[100svh] overflow-hidden bg-[#07080b]">
        {/* The world beyond the letters */}
        <motion.div className="absolute inset-0" style={{ scale: worldScale }}>
          <Sky drift={cloudDrift} />
        </motion.div>

        {/* Arrival */}
        <motion.div
          className="absolute inset-0 z-10 flex items-center"
          style={{ opacity: contentOpacity, y: contentY, pointerEvents: contentPointer }}
        >
          {content}
        </motion.div>

        {/* The dark stage with NAVEEN cut out of it */}
        <motion.div className="absolute inset-0 z-20 pointer-events-none" style={{ opacity: maskOpacity }}>
          {layout && (
            <motion.svg
              width={layout.w}
              height={layout.h}
              className="absolute inset-0"
              aria-hidden
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.4, ease: EASE_OUT, delay: 0.15 }}
            >
              <defs>
                <mask id="hero-name-mask" maskUnits="userSpaceOnUse" x="0" y="0" width={layout.w} height={layout.h}>
                  <rect width={layout.w} height={layout.h} fill="white" />
                  <g ref={zoomRef}>
                    <path d={layout.d} fill="black" />
                  </g>
                </mask>
              </defs>
              <rect width={layout.w} height={layout.h} fill="#07080b" mask="url(#hero-name-mask)" />
            </motion.svg>
          )}
        </motion.div>

        {/* Opening captions on the dark stage */}
        <motion.p
          className="absolute inset-x-0 z-30 px-5 text-center text-sm md:text-base tracking-[0.02em] text-white/60 pointer-events-none"
          style={{ opacity: introOpacity, top: layout ? layout.baseline + layout.fontSize * 0.18 : '70%' }}
        >
          Full-stack · SRE · DevOps engineer · Mysore / Bangalore
        </motion.p>
        <motion.div
          className="absolute inset-x-0 bottom-8 z-30 flex flex-col items-center gap-3 text-white/60 pointer-events-none"
          style={{ opacity: introOpacity }}
          aria-hidden
        >
          <span className="whitespace-nowrap text-[11px] font-medium uppercase tracking-[0.25em]">Scroll to fly in</span>
          <span className="hero-cue-track relative h-10 w-px overflow-hidden">
            <span className="absolute inset-x-0 top-0 h-1/2 bg-current animate-hero-cue" />
          </span>
        </motion.div>
      </div>
    </section>
  );
}
