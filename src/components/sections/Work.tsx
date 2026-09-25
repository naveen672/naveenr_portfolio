import { useEffect, useRef, useState } from 'react';
import {
  AnimatePresence,
  motion,
  useMotionTemplate,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import jsspImage from '@/assets/work/jssp.webp';
import jsswpImage from '@/assets/work/jsswp.webp';
import jsspnImage from '@/assets/work/jsspn.webp';
import tinyImage from '@/assets/work/tiny.webp';

interface Project {
  name: string;
  place: string;
  summary: string;
  stack: string[];
  accent: string;
  src: string;
  href: string;
  host: string;
}

const projects: Project[] = [
  {
    name: 'JSS Polytechnic',
    place: 'Mysuru',
    summary:
      'The official website for JSS Polytechnic, Mysuru: academics, facilities, student support, training, placements and more.',
    stack: ['HTML', 'CSS', 'JavaScript', 'PHP', 'MySQL'],
    accent: '#3B82F6',
    src: jsspImage,
    href: 'https://www.jsspolytechnicmysuru.ac.in/',
    host: 'jsspolytechnicmysuru.ac.in',
  },
  {
    name: "JSS Women's Polytechnic",
    place: 'Mysuru',
    summary:
      'A modern, responsive and user-friendly official website for JSS Polytechnic for Women, Mysuru.',
    stack: ['HTML', 'CSS', 'JavaScript', 'PHP', 'MySQL'],
    accent: '#A855F7',
    src: jsswpImage,
    href: 'https://jsspwmys.ac.in/',
    host: 'jsspwmys.ac.in',
  },
  {
    name: 'JSS Polytechnic',
    place: 'Nanjangud',
    summary:
      'The official website for JSS Polytechnic, Nanjangud: academics, departments, facilities, placements and news.',
    stack: ['HTML', 'CSS', 'JavaScript', 'PHP'],
    accent: '#F97316',
    src: jsspnImage,
    href: 'https://jsspn.org/',
    host: 'jsspn.org',
  },
  {
    name: 'Tiny Prism Labs',
    place: 'Edge intelligence',
    summary:
      'A clean, modern website showcasing Tiny Prism Labs’ AI-powered edge solutions, services, case studies and innovations.',
    stack: ['HTML', 'CSS', 'JavaScript', 'PHP', 'MySQL'],
    accent: '#22D3EE',
    src: tinyImage,
    href: 'https://www.tinyprismlabs.com/',
    host: 'tinyprismlabs.com',
  },
];

const N = projects.length;
const EASE_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1];

function useIsDesktop() {
  const query = '(min-width: 1024px)';
  const [matches, setMatches] = useState(() => typeof window !== 'undefined' && window.matchMedia(query).matches);
  useEffect(() => {
    const mql = window.matchMedia(query);
    const onChange = () => setMatches(mql.matches);
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, []);
  return matches;
}

function VisitLink({ project }: { project: Project }) {
  return (
    <a
      href={project.href}
      target="_blank"
      rel="noopener noreferrer"
      className="group inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-medium text-neutral-950 transition-transform duration-300 hover:-translate-y-0.5"
    >
      Visit live site
      <ArrowUpRight
        className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
        aria-hidden
      />
      <span className="sr-only">: {project.host} (opens in a new tab)</span>
    </a>
  );
}

function ProjectDetails({ project, stagger = true }: { project: Project; stagger?: boolean }) {
  const item = {
    hidden: { opacity: 0, y: 22 },
    show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE_OUT } },
  };
  return (
    <motion.div
      initial="hidden"
      animate="show"
      exit={{ opacity: 0, y: -14, transition: { duration: 0.22, ease: 'easeIn' } }}
      variants={{ show: { transition: { staggerChildren: stagger ? 0.06 : 0 } } }}
    >
      <motion.p variants={item} className="text-sm font-medium" style={{ color: project.accent }}>
        {project.place}
      </motion.p>
      <motion.h3
        variants={item}
        className="mt-2 font-display text-[clamp(2.25rem,4.2vw,4rem)] font-medium leading-[1.02] tracking-[-0.035em] text-white text-balance"
      >
        {project.name}
      </motion.h3>
      <motion.p variants={item} className="mt-5 max-w-md text-base md:text-lg leading-relaxed text-white/65 text-pretty">
        {project.summary}
      </motion.p>
      <motion.ul variants={item} className="mt-6 flex flex-wrap gap-2" aria-label="Built with">
        {project.stack.map((tech) => (
          <li key={tech} className="rounded-full border border-white/12 bg-white/[0.04] px-3 py-1 text-xs text-white/70">
            {tech}
          </li>
        ))}
      </motion.ul>
      <motion.div variants={item} className="mt-8">
        <VisitLink project={project} />
      </motion.div>
    </motion.div>
  );
}

/** One photo in the stack; each later photo rises over the previous with a curtain wipe. */
function StageImage({ project, index, p }: { project: Project; index: number; p: MotionValue<number> }) {
  const enter = index / N;
  const top = useTransform(p, [enter - 0.1, enter + 0.02], [index === 0 ? 0 : 100, 0], { clamp: true });
  const clip = useMotionTemplate`inset(${top}% 0% 0% 0%)`;
  // Slow push-in across the photo's time on stage
  const scale = useTransform(p, [Math.max(0, enter - 0.1), Math.min(1, enter + 1 / N)], [1.14, 1]);

  return (
    <motion.a
      href={project.href}
      target="_blank"
      rel="noopener noreferrer"
      tabIndex={-1}
      aria-hidden
      className="absolute inset-0 block overflow-hidden"
      style={{ clipPath: clip }}
    >
      <motion.img
        src={project.src}
        alt=""
        className="h-full w-full object-cover"
        style={{ scale }}
        draggable={false}
        loading={index === 0 ? 'eager' : 'lazy'}
      />
    </motion.a>
  );
}

function Rail({
  active,
  local,
  onJump,
}: {
  active: number;
  local: MotionValue<number>;
  onJump: (i: number) => void;
}) {
  return (
    <ol className="flex flex-col gap-1" aria-label="Projects">
      {projects.map((project, i) => (
        <li key={project.href}>
          <button
            type="button"
            onClick={() => onJump(i)}
            aria-current={i === active ? 'true' : undefined}
            className="group flex w-full items-center gap-4 py-1.5 text-left"
          >
            <span className="relative h-px w-10 overflow-hidden bg-white/15">
              {i === active && (
                <motion.span
                  className="absolute inset-0 origin-left"
                  style={{ scaleX: local, backgroundColor: project.accent }}
                />
              )}
              {i < active && <span className="absolute inset-0 bg-white/50" />}
            </span>
            <span
              className={`text-sm transition-colors duration-300 ${
                i === active ? 'text-white' : 'text-white/40 group-hover:text-white/70'
              }`}
            >
              {project.name}
              {project.name.startsWith('JSS Polytechnic') && `, ${project.place}`}
            </span>
          </button>
        </li>
      ))}
    </ol>
  );
}

function Stage() {
  const stageRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const { scrollYProgress } = useScroll({ target: stageRef, offset: ['start start', 'end end'] });

  // Plain motion value (see Opening): keeps transforms off the page-wide native ScrollTimeline.
  const p = useMotionValue(0);
  const local = useMotionValue(0);
  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    p.set(v);
    const i = Math.min(N - 1, Math.max(0, Math.floor((v + 0.02) * N)));
    setActive(i);
    local.set(Math.min(1, Math.max(0, v * N - i)));
  });

  const jump = (i: number) => {
    const el = stageRef.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY;
    const travel = el.offsetHeight - window.innerHeight;
    window.scrollTo({ top: top + travel * ((i + 0.08) / N), behavior: 'smooth' });
  };

  const project = projects[active];

  return (
    <div ref={stageRef} className="relative" style={{ height: `${N * 90 + 100}vh` }}>
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        {/* Ambient light in the active project's colour */}
        {projects.map((pr, i) => (
          <div
            key={pr.href}
            aria-hidden
            className="pointer-events-none absolute right-[-10%] top-1/2 h-[80vh] w-[70vw] -translate-y-1/2 rounded-full blur-[120px] transition-opacity duration-1000"
            style={{
              background: `radial-gradient(closest-side, ${pr.accent}, transparent)`,
              opacity: i === active ? 0.28 : 0,
            }}
          />
        ))}

        <div className="relative mx-auto grid w-full max-w-6xl 2xl:max-w-[1400px] grid-cols-12 items-center gap-12 px-12">
          <div className="col-span-5 flex min-h-[560px] flex-col justify-between py-4">
            <div className="relative">
              <AnimatePresence mode="wait">
                <ProjectDetails key={active} project={project} />
              </AnimatePresence>
            </div>
            <Rail active={active} local={local} onJump={jump} />
          </div>

          <div className="col-span-7">
            <div
              className="relative aspect-[4/3] w-full overflow-hidden rounded-[28px] ring-1 ring-white/10 transition-shadow duration-1000"
              style={{ boxShadow: `0 50px 120px -40px ${project.accent}66, 0 30px 60px -30px rgba(0,0,0,0.8)` }}
            >
              {projects.map((pr, i) => (
                <StageImage key={pr.href} project={pr} index={i} p={p} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/** Phones, tablets and reduced motion: the same story as a calm vertical sequence. */
function Sequence() {
  const reduceMotion = useReducedMotion();
  return (
    <ol className="mx-auto flex max-w-2xl flex-col gap-20 px-5 sm:px-8 pb-24">
      {projects.map((project) => (
        <motion.li
          key={project.href}
          initial={reduceMotion ? false : { opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-15% 0px' }}
          transition={{ duration: 0.9, ease: EASE_OUT }}
        >
          <a
            href={project.href}
            target="_blank"
            rel="noopener noreferrer"
            tabIndex={-1}
            aria-hidden
            className="relative block aspect-[4/3] overflow-hidden rounded-3xl ring-1 ring-white/10"
            style={{ boxShadow: `0 40px 80px -40px ${project.accent}80` }}
          >
            <img src={project.src} alt="" className="h-full w-full object-cover" loading="lazy" />
          </a>
          <div className="mt-8">
            <ProjectDetails project={project} stagger={false} />
          </div>
        </motion.li>
      ))}
    </ol>
  );
}

export function Work() {
  const isDesktop = useIsDesktop();
  const reduceMotion = useReducedMotion();

  return (
    <section id="work" data-nav-tone="dark" className="relative bg-[#07080b] text-white">
      <div className="mx-auto max-w-6xl 2xl:max-w-[1400px] px-5 sm:px-8 md:px-12 pt-28 md:pt-40 pb-16 md:pb-8">
        <motion.h2
          initial={reduceMotion ? false : { opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-20% 0px' }}
          transition={{ duration: 1, ease: EASE_OUT }}
          className="font-display text-[clamp(2.75rem,8vw,7rem)] font-medium leading-[0.95] tracking-[-0.045em] text-balance"
        >
          Things I've <span className="gradient-text">shipped.</span>
        </motion.h2>
        <motion.p
          initial={reduceMotion ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-20% 0px' }}
          transition={{ duration: 1, ease: EASE_OUT, delay: 0.1 }}
          className="mt-6 max-w-xl text-lg md:text-xl text-white/60 text-pretty"
        >
          Live websites I designed, built and still maintain, for colleges and an edge-AI company.
        </motion.p>
      </div>

      {isDesktop && !reduceMotion ? <Stage /> : <Sequence />}
    </section>
  );
}
