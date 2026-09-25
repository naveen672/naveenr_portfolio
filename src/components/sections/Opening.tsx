import { useEffect, useRef, useState } from 'react';
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'framer-motion';
import { ArrowRight, Download } from 'lucide-react';
import { TextRepel } from '@/components/ui/text-repel';

const typingPhrases = [
  'I build for the web',
  'Full Stack Developer',
  'SRE & DevOps Engineer',
  'AI Developer',
  'Freelancer',
];

// Cloud frames, keyed to alpha from clouds_animation.mp4. f_01 = sky mostly open, f_36 = fully covered.
const FRAME_COUNT = 36;
const frameSrc = (i: number) => `/hero/clouds/f_${String(i).padStart(2, '0')}.webp`;

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

/** Draws the cloud frame for a 0..1 "parted" amount onto a canvas, cover-fitted. */
function useCloudCanvas(canvasRef: React.RefObject<HTMLCanvasElement>, enabled: boolean) {
  const frames = useRef<HTMLImageElement[]>([]);
  const current = useRef(0); // 0 = fully covered

  const draw = (parted: number) => {
    current.current = parted;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    // parted 0 -> frame 36 (covered), parted 1 -> frame 1 (open)
    const idx = Math.round((1 - parted) * (FRAME_COUNT - 1));
    let img = frames.current[idx];
    // Fall back to the nearest loaded frame while the sequence streams in
    for (let d = 1; (!img || !img.complete || !img.naturalWidth) && d < FRAME_COUNT; d++) {
      img = frames.current[idx + d] ?? frames.current[idx - d];
    }
    if (!img || !img.naturalWidth) return;

    const { width: cw, height: ch } = canvas;
    const scale = Math.max(cw / img.naturalWidth, ch / img.naturalHeight);
    const w = img.naturalWidth * scale;
    const h = img.naturalHeight * scale;
    ctx.clearRect(0, 0, cw, ch);
    ctx.drawImage(img, (cw - w) / 2, (ch - h) / 2, w, h);
  };

  useEffect(() => {
    if (!enabled) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.round(canvas.clientWidth * dpr);
      canvas.height = Math.round(canvas.clientHeight * dpr);
      draw(current.current);
    };

    // Load the covered frame first so the opening state paints immediately.
    const order = [FRAME_COUNT - 1, ...Array.from({ length: FRAME_COUNT - 1 }, (_, i) => FRAME_COUNT - 2 - i)];
    order.forEach((i) => {
      const img = new Image();
      img.decoding = 'async';
      img.src = frameSrc(i + 1);
      img.onload = () => {
        if (Math.round((1 - current.current) * (FRAME_COUNT - 1)) === i) draw(current.current);
      };
      frames.current[i] = img;
    });

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    return () => ro.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled]);

  return draw;
}

function HeroActions({ onDark = true }: { onDark?: boolean }) {
  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <a
        href="#contact"
        onClick={(e) => {
          e.preventDefault();
          document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
        }}
        className={
          onDark
            ? 'group inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3.5 font-medium text-neutral-950 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.6)] transition-transform duration-300 hover:-translate-y-0.5'
            : 'group inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3.5 font-medium text-primary-foreground transition-transform duration-300 hover:-translate-y-0.5'
        }
      >
        Get in touch
        <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden />
      </a>
      <a
        href="/Naveen_resume.pdf"
        download="Naveen_Resume.pdf"
        className={
          onDark
            ? 'inline-flex items-center justify-center gap-2 rounded-full border border-white/35 bg-white/10 px-6 py-3.5 font-medium text-white backdrop-blur-md transition-colors duration-300 hover:bg-white/20'
            : 'inline-flex items-center justify-center gap-2 rounded-full border border-border px-6 py-3.5 font-medium transition-colors duration-300 hover:bg-muted'
        }
      >
        <Download className="w-4 h-4" aria-hidden />
        Download Resume
      </a>
    </div>
  );
}

export function Opening() {
  const reduceMotion = useReducedMotion();
  const stageRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const role = useTypingPhrase();
  const cinematic = !reduceMotion;

  const { scrollYProgress } = useScroll({ target: stageRef, offset: ['start start', 'end end'] });
  // Mirror progress into a plain motion value: transforms derived straight from scrollYProgress get
  // hardware-accelerated onto a native ScrollTimeline that measures the whole page, not this stage.
  const p = useMotionValue(0);
  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    p.set(v);
    // Tell the nav bar when the dark video owns the screen
    if (stageRef.current) stageRef.current.dataset.navTone = v > 0.6 ? 'dark' : 'light';
  });

  // Choreography (p = 0..1 across the pinned stage)
  const parted = useTransform(p, [0, 0.55], [0, 1], { clamp: true });
  const cloudScale = useTransform(p, [0.4, 0.8], [1, 1.9]);
  const cloudOpacity = useTransform(p, [0.5, 0.78], [1, 0]);

  const titleScale = useTransform(p, [0, 0.35], [1, 1.35]);
  const titleOpacity = useTransform(p, [0.12, 0.34], [1, 0]);
  const titleBlurPx = useTransform(p, [0.1, 0.34], [0, 14]);
  const titleFilter = useMotionTemplate`blur(${titleBlurPx}px)`;
  const cueOpacity = useTransform(p, [0, 0.06], [1, 0]);

  const inset = useTransform(p, [0.25, 0.72], [12, 0]);
  const radius = useTransform(p, [0.25, 0.72], [36, 0]);
  const videoClip = useMotionTemplate`inset(${inset}% ${inset}% ${inset}% ${inset}% round ${radius}px)`;
  const videoScale = useTransform(p, [0.2, 0.8], [1.18, 1]);
  const scrimOpacity = useTransform(p, [0.55, 0.85], [0, 1]);

  const contentOpacity = useTransform(p, [0.7, 0.88], [0, 1]);
  const contentY = useTransform(p, [0.7, 0.9], [40, 0]);
  const contentPointer = useTransform(contentOpacity, (v) => (v > 0.6 ? 'auto' : 'none'));

  const drawClouds = useCloudCanvas(canvasRef, cinematic);
  useMotionValueEvent(parted, 'change', (v) => drawClouds(v));

  // Sound: the intro starts over, with audio, the moment the clouds part. Browsers refuse unmuted
  // playback until the visitor has interacted with the page, so if that is refused the video keeps
  // playing muted and unmutes on the first click, tap or key press.
  const revealed = useRef(false);
  const audioWanted = useRef(false);
  useMotionValueEvent(p, 'change', (v) => {
    const video = videoRef.current;
    if (!video) return;
    if (v > 0.55 && !revealed.current) {
      revealed.current = true;
      audioWanted.current = true;
      if (!video.dataset.started) {
        video.dataset.started = '1';
        video.currentTime = 0;
      }
      video.muted = false;
      video.play().catch(() => {
        video.muted = true;
        video.play().catch(() => {});
      });
    } else if (v < 0.4 && revealed.current) {
      // Back under the clouds: go quiet
      revealed.current = false;
      audioWanted.current = false;
      video.muted = true;
    }
  });

  useEffect(() => {
    const unlock = () => {
      const video = videoRef.current;
      if (video && audioWanted.current && video.muted) {
        video.muted = false;
        video.play().catch(() => {});
      }
    };
    const events = ['pointerdown', 'keydown', 'touchend'] as const;
    events.forEach((e) => window.addEventListener(e, unlock, { passive: true }));
    return () => events.forEach((e) => window.removeEventListener(e, unlock));
  }, []);

  // Only decode video while the hero is on screen.
  useEffect(() => {
    const video = videoRef.current;
    const stage = stageRef.current;
    if (!video || !stage) return;
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) video.play().catch(() => {});
      else video.pause();
    });
    io.observe(stage);
    return () => io.disconnect();
  }, []);

  const video = (
    <video
      ref={videoRef}
      className="absolute inset-0 h-full w-full object-cover object-[50%_35%]"
      src="/hero/naveen-intro.mp4"
      poster="/hero/naveen-intro-poster.jpg"
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
      aria-hidden
    />
  );

  const content = (
    <div className="mx-auto w-full max-w-6xl 2xl:max-w-[1400px] px-5 sm:px-6 md:px-12 pb-10 md:pb-16">
      <p className="text-[clamp(1.75rem,5vw,4rem)] font-display font-medium leading-[1.05] tracking-[-0.03em] text-white min-h-[1.1em]">
        {role}
        <span className="ml-1 inline-block h-[0.85em] w-[3px] translate-y-[0.08em] bg-primary animate-pulse" aria-hidden />
      </p>
      <p className="mt-4 md:mt-5 max-w-xl text-base md:text-lg font-light leading-relaxed text-white/80 text-pretty">
        Full-stack developer passionate about clean code, beautiful interfaces, and solving complex problems.
        Currently exploring AI, distributed systems, and the future of computing.
      </p>
      <div className="mt-7 md:mt-9">
        <HeroActions />
      </div>
    </div>
  );

  // Reduced motion: the finished frame, no pinned choreography.
  if (!cinematic) {
    return (
      <section ref={stageRef} data-nav-tone="dark" className="relative h-[100svh] min-h-[560px] overflow-hidden bg-neutral-950">
        {video}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/10" />
        <div className="relative z-10 flex h-full flex-col justify-end">
          <h1 className="mx-auto w-full max-w-6xl 2xl:max-w-[1400px] px-5 sm:px-6 md:px-12 text-sm font-medium uppercase tracking-[0.2em] text-white/70">
            Hi, I'm Naveen
          </h1>
          {content}
        </div>
      </section>
    );
  }

  return (
    <section ref={stageRef} className="relative h-[280vh]" aria-label="Introduction">
      <div className="sticky top-0 h-[100svh] overflow-hidden hero-sky">
        {/* The world behind the clouds */}
        <motion.div
          className="absolute inset-0 overflow-hidden bg-neutral-950 will-change-[clip-path]"
          style={{ clipPath: videoClip }}
        >
          <motion.div className="absolute inset-0" style={{ scale: videoScale }}>
            {video}
          </motion.div>
          <motion.div
            className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/5"
            style={{ opacity: scrimOpacity }}
          />
        </motion.div>

        {/* Cloud layer */}
        <motion.canvas
          ref={canvasRef}
          className="hero-clouds absolute inset-0 h-full w-full pointer-events-none"
          style={{ scale: cloudScale, opacity: cloudOpacity }}
          aria-hidden
        />

        {/* Opening title, set on the clouds */}
        <motion.div
          className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center"
          style={{ scale: titleScale, opacity: titleOpacity, filter: titleFilter }}
        >
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: EASE_OUT, delay: 0.2 }}
            className="hero-title font-display font-medium leading-[0.95] tracking-[-0.045em] text-[clamp(3.25rem,12vw,10.5rem)]"
          >
            <TextRepel text="Hi, I'm Naveen" radius={160} strength={55} />
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.7 }}
            className="hero-subtitle mt-5 md:mt-6 max-w-md text-base md:text-xl font-light text-balance"
          >
            Engineer, builder and creator, somewhere above the clouds.
          </motion.p>
        </motion.div>

        {/* Scroll cue */}
        <motion.div
          className="hero-subtitle absolute inset-x-0 bottom-8 flex flex-col items-center gap-3"
          style={{ opacity: cueOpacity }}
          aria-hidden
        >
          <span className="whitespace-nowrap text-[11px] font-medium uppercase tracking-[0.25em]">Scroll to break through</span>
          <span className="hero-cue-track relative h-10 w-px overflow-hidden">
            <span className="absolute inset-x-0 top-0 h-1/2 bg-current animate-hero-cue" />
          </span>
        </motion.div>

        {/* The reveal */}
        <motion.div
          className="absolute inset-x-0 bottom-0 z-10"
          style={{ opacity: contentOpacity, y: contentY, pointerEvents: contentPointer }}
        >
          {content}
        </motion.div>
      </div>
    </section>
  );
}
