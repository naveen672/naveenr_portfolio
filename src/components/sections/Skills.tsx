import { useEffect, useMemo, useRef, useState } from 'react';
import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  type MotionValue,
} from 'framer-motion';
import type { IconType } from 'react-icons';
import {
  SiPython, SiOpenjdk, SiReact, SiNodedotjs, SiMongodb, SiMysql, SiPostgresql, SiKubernetes,
  SiPhp, SiJavascript, SiHtml5, SiAndroidstudio, SiDocker, SiFigma, SiLinux, SiNginx, SiGraphql,
} from 'react-icons/si';
import { FaAws } from 'react-icons/fa';
import { TbApi } from 'react-icons/tb';

interface Skill {
  name: string;
  icon: IconType;
  /** Brand color for the tile; glyph is white unless `dark` is set. */
  bg: string;
  dark?: boolean;
}

const S = {
  python: { name: 'Python', icon: SiPython, bg: '#3776AB' },
  java: { name: 'Java', icon: SiOpenjdk, bg: '#E76F00' },
  php: { name: 'PHP', icon: SiPhp, bg: '#777BB4' },
  js: { name: 'JavaScript', icon: SiJavascript, bg: '#F7DF1E', dark: true },
  react: { name: 'React', icon: SiReact, bg: '#149ECA' },
  html: { name: 'HTML & CSS', icon: SiHtml5, bg: '#E34F26' },
  android: { name: 'Android Studio', icon: SiAndroidstudio, bg: '#3DDC84', dark: true },
  figma: { name: 'Figma', icon: SiFigma, bg: '#F24E1E' },
  node: { name: 'Node.js', icon: SiNodedotjs, bg: '#5FA04E' },
  rest: { name: 'REST APIs', icon: TbApi, bg: '#475569' },
  graphql: { name: 'GraphQL', icon: SiGraphql, bg: '#E10098' },
  mysql: { name: 'MySQL', icon: SiMysql, bg: '#4479A1' },
  postgres: { name: 'PostgreSQL', icon: SiPostgresql, bg: '#4169E1' },
  mongo: { name: 'MongoDB', icon: SiMongodb, bg: '#47A248' },
  aws: { name: 'AWS', icon: FaAws, bg: '#232F3E' },
  docker: { name: 'Docker', icon: SiDocker, bg: '#2496ED' },
  k8s: { name: 'Kubernetes', icon: SiKubernetes, bg: '#326CE5' },
  linux: { name: 'Linux', icon: SiLinux, bg: '#FCC624', dark: true },
  nginx: { name: 'Nginx', icon: SiNginx, bg: '#009639' },
} satisfies Record<string, Skill>;

const groups: { title: string; skills: Skill[] }[] = [
  { title: 'Languages', skills: [S.python, S.java, S.js, S.php] },
  { title: 'Frontend & mobile', skills: [S.react, S.html, S.android, S.figma] },
  { title: 'Backend & data', skills: [S.node, S.rest, S.graphql, S.mysql, S.postgres, S.mongo] },
  { title: 'Cloud & DevOps', skills: [S.aws, S.docker, S.k8s, S.linux, S.nginx] },
];

const EASE_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1];

// One colour and orbital speed per ring (inner rings travel faster, like real orbits)
const RINGS = [
  { color: '#22d3ee', speed: 0.34, radius: 0.36 },
  { color: '#a78bfa', speed: 0.24, radius: 0.56 },
  { color: '#34d399', speed: 0.17, radius: 0.78 },
  { color: '#f59e0b', speed: 0.12, radius: 1 },
];

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

function SkillTile({ skill, size }: { skill: Skill; size: number }) {
  const Icon = skill.icon;
  return (
    <span
      className="flex shrink-0 items-center justify-center rounded-[28%] shadow-[0_8px_20px_-8px_rgba(0,0,0,0.45)]"
      style={{ width: size, height: size, backgroundColor: skill.bg, color: skill.dark ? '#111' : '#fff' }}
    >
      <Icon style={{ width: size * 0.5, height: size * 0.5 }} aria-hidden />
    </span>
  );
}

function Heading({ animateIn }: { animateIn: boolean }) {
  return (
    <>
      <motion.h2
        initial={animateIn ? { opacity: 0, y: 30 } : false}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-15% 0px' }}
        transition={{ duration: 1, ease: EASE_OUT }}
        className="font-display text-[clamp(2.75rem,5.6vw,5.75rem)] font-medium leading-[0.95] whitespace-nowrap tracking-[-0.045em]"
      >
        The <span className="gradient-text">stack.</span>
      </motion.h2>
      <motion.p
        initial={animateIn ? { opacity: 0, y: 20 } : false}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-15% 0px' }}
        transition={{ duration: 1, ease: EASE_OUT, delay: 0.1 }}
        className="mt-3 md:mt-5 max-w-md text-base md:text-xl text-muted-foreground text-pretty"
      >
        The tools I reach for, from the first commit to production.
      </motion.p>
    </>
  );
}

/** The readable version of the system: every skill by category. Hovering a category lights its ring. */
function Legend({ onHighlight }: { onHighlight: (ring: number | null) => void }) {
  return (
    <ul className="grid grid-cols-2 lg:grid-cols-1 gap-x-5 gap-y-3 lg:gap-y-5" onMouseLeave={() => onHighlight(null)}>
      {groups.map((group, i) => (
        <li key={group.title} onMouseEnter={() => onHighlight(i)} className="cursor-default">
          <p className="flex items-center gap-2 text-sm font-medium">
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: RINGS[i].color }} aria-hidden />
            {group.title}
          </p>
          <p className="mt-1 text-xs md:text-sm leading-relaxed text-muted-foreground">
            {group.skills.map((s) => s.name).join(' · ')}
          </p>
        </li>
      ))}
    </ul>
  );
}

/**
 * Skills orbit a glowing core on four tilted rings. Positions are projected by hand every frame
 * (orthographic, with depth driving size, brightness and stacking) so logos pass in front of and
 * behind the core. Scroll progress tilts the system from nearly edge-on to nearly top-down.
 */
function SolarSystem({
  p,
  still,
  highlight,
}: {
  p: MotionValue<number>;
  still: boolean;
  highlight: React.MutableRefObject<number | null>;
}) {
  const boxRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<(HTMLDivElement | null)[]>([]);
  const ringRefs = useRef<(SVGEllipseElement | null)[]>([]);
  const coreRef = useRef<HTMLDivElement>(null);
  const paused = useRef(new Set<number>());
  const phase = useRef(RINGS.map((_, i) => i * 0.9));
  const [size, setSize] = useState({ w: 0, h: 0 });

  const nodes = useMemo(
    () =>
      groups.flatMap((group, ring) =>
        group.skills.map((skill, k) => ({ skill, ring, base: (k / group.skills.length) * Math.PI * 2 }))
      ),
    []
  );

  useEffect(() => {
    const el = boxRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setSize({ w: el.clientWidth, h: el.clientHeight }));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const box = boxRef.current;
    if (!box || !size.w) return;

    const draw = () => {
      const v = still ? 0.8 : p.get();
      const t = clamp01(v / 0.7);
      const eased = 1 - Math.pow(1 - t, 3);
      const tilt = ((76 - 54 * eased) * Math.PI) / 180; // 76deg (edge-on) to 22deg (almost top-down)
      const cosA = Math.cos(tilt);
      const sinA = Math.sin(tilt);
      const boost = still ? 0 : v * Math.PI * 1.1; // scrolling winds the orbits forward
      const cx = size.w / 2;
      const cy = size.h / 2;
      // Largest radius whose ellipse still fits the box at the final tilt
      const R = Math.min(size.w * 0.46, (size.h * 0.46) / Math.cos((22 * Math.PI) / 180));
      const hl = highlight.current;

      RINGS.forEach((ring, i) => {
        const el = ringRefs.current[i];
        if (!el) return;
        const r = R * ring.radius;
        el.setAttribute('cx', String(cx));
        el.setAttribute('cy', String(cy));
        el.setAttribute('rx', String(r));
        el.setAttribute('ry', String(r * cosA));
        el.style.opacity = hl === null ? '0.55' : hl === i ? '1' : '0.15';
      });

      nodes.forEach((n, j) => {
        const el = nodeRefs.current[j];
        if (!el) return;
        const r = R * RINGS[n.ring].radius;
        const theta = n.base + phase.current[n.ring] + boost * (1 - n.ring * 0.18);
        const x = r * Math.cos(theta);
        const planeY = r * Math.sin(theta);
        const depth = (planeY * sinA) / R; // -1 far side, +1 near side
        const scale = 1 + depth * 0.22;
        const dim = hl !== null && hl !== n.ring ? 0.18 : 1;
        el.style.transform = `translate3d(${cx + x}px, ${cy + planeY * cosA}px, 0) translate(-50%, -50%) scale(${scale})`;
        el.style.opacity = String((0.5 + 0.5 * ((depth + 1) / 2)) * dim);
        el.style.zIndex = String(depth >= 0 ? 20 : 5);
      });

      if (coreRef.current) {
        coreRef.current.style.transform = `translate3d(${cx}px, ${cy}px, 0) translate(-50%, -50%)`;
      }
    };

    if (still) {
      draw();
      return;
    }

    let frame = 0;
    let last = performance.now();
    let visible = false;
    const loop = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      RINGS.forEach((ring, i) => {
        if (!paused.current.has(i)) phase.current[i] += ring.speed * dt;
      });
      draw();
      frame = visible ? requestAnimationFrame(loop) : 0;
    };
    // Only orbit while the system is on screen
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible && !frame) {
        last = performance.now();
        frame = requestAnimationFrame(loop);
      }
    });
    io.observe(box);
    draw();
    return () => {
      io.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [size, still, p, nodes, highlight]);

  const tileSize = size.w < 500 ? 34 : 46;

  return (
    <div ref={boxRef} className="relative h-full w-full" aria-hidden>
      <svg className="absolute inset-0 h-full w-full overflow-visible">
        {RINGS.map((ring, i) => (
          <ellipse
            key={i}
            ref={(el) => (ringRefs.current[i] = el)}
            fill="none"
            stroke={ring.color}
            strokeWidth={1.25}
            strokeDasharray={i % 2 ? '2 6' : undefined}
            className="transition-opacity duration-300"
          />
        ))}
      </svg>

      <div ref={coreRef} className="absolute left-0 top-0 z-10">
        <div className="solar-core relative flex h-20 w-20 md:h-24 md:w-24 items-center justify-center rounded-full font-display text-xl md:text-2xl font-semibold text-white">
          NR
        </div>
      </div>

      {nodes.map((n, j) => (
        <div
          key={n.skill.name}
          ref={(el) => (nodeRefs.current[j] = el)}
          className="group absolute left-0 top-0 will-change-transform transition-opacity duration-300"
          onMouseEnter={() => paused.current.add(n.ring)}
          onMouseLeave={() => paused.current.delete(n.ring)}
        >
          <div className="transition-transform duration-300 ease-out group-hover:scale-125">
            <SkillTile skill={n.skill} size={tileSize} />
          </div>
          <span className="pointer-events-none absolute left-1/2 top-full mt-2 -translate-x-1/2 whitespace-nowrap rounded-full bg-foreground px-2.5 py-1 text-xs font-medium text-background opacity-0 transition-opacity duration-200 group-hover:opacity-100">
            {n.skill.name}
          </span>
        </div>
      ))}
    </div>
  );
}

export function Skills() {
  const reduceMotion = useReducedMotion();
  const stageRef = useRef<HTMLElement>(null);
  const highlight = useRef<number | null>(null);
  const { scrollYProgress } = useScroll({ target: stageRef, offset: ['start start', 'end end'] });
  // Plain motion value (see Opening): keeps reads off the page-wide native ScrollTimeline.
  const p = useMotionValue(0);
  useMotionValueEvent(scrollYProgress, 'change', (v) => p.set(v));

  const still = !!reduceMotion;
  const setHighlight = (i: number | null) => (highlight.current = i);

  return (
    <section id="stack" ref={stageRef} className={still ? 'relative' : 'relative h-[220vh]'}>
      <div
        className={
          still
            ? 'relative px-5 sm:px-8 md:px-12 py-24'
            : 'sticky top-0 flex h-[100svh] items-center overflow-hidden px-5 sm:px-8 md:px-12'
        }
      >
        <div aria-hidden className="solar-space pointer-events-none absolute inset-0" />
        <div className="relative mx-auto grid h-full w-full max-w-6xl 2xl:max-w-[1400px] grid-rows-[auto_1fr_auto] lg:grid-rows-1 lg:grid-cols-12 items-center gap-4 lg:gap-10 pt-20 pb-6 lg:py-0">
          <div className="lg:col-span-5">
            <Heading animateIn={!still} />
            <div className="mt-8 hidden lg:block">
              <Legend onHighlight={setHighlight} />
            </div>
          </div>
          <div className="lg:col-span-7 h-full min-h-[300px] lg:h-[82vh]">
            <SolarSystem p={p} still={still} highlight={highlight} />
          </div>
          <div className="lg:hidden">
            <Legend onHighlight={setHighlight} />
          </div>
        </div>
      </div>
    </section>
  );
}
