import { useRef } from 'react';
import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
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

// Deterministic "random" so the scatter is identical on every visit and render
function seeded(n: number) {
  const x = Math.sin(n * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

const COUNT = groups.reduce((n, g) => n + g.skills.length, 0);
// Fly-in order shuffled across columns so the grid fills from everywhere at once
const ORDER = Array.from({ length: COUNT }, (_, i) => i).sort((a, b) => seeded(a + 7) - seeded(b + 7));

interface Scatter {
  x: number; // vw
  y: number; // vh
  z: number; // px, into the screen
  rx: number;
  ry: number;
  rz: number;
  start: number; // progress at which this tile launches
}

function scatterFor(index: number): Scatter {
  const r = (k: number) => seeded(index * 11 + k);
  return {
    x: (r(1) - 0.5) * 140,
    y: (r(2) - 0.5) * 110,
    z: -(900 + r(3) * 2600),
    rx: (r(4) - 0.5) * 160,
    ry: (r(5) - 0.5) * 200,
    rz: (r(6) - 0.5) * 120,
    start: 0.04 + (ORDER.indexOf(index) / (COUNT - 1)) * 0.42,
  };
}

const FLIGHT = 0.34; // share of the scroll each tile spends flying

function SkillTile({ skill }: { skill: Skill }) {
  const Icon = skill.icon;
  return (
    <>
      <span
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] shadow-[0_4px_10px_-4px_rgba(0,0,0,0.35)] transition-transform duration-300 ease-out group-hover:-translate-y-0.5 group-hover:scale-105"
        style={{ backgroundColor: skill.bg, color: skill.dark ? '#111' : '#fff' }}
      >
        <Icon className="h-[18px] w-[18px]" aria-hidden />
      </span>
      <span className="text-sm sm:text-base font-medium">{skill.name}</span>
    </>
  );
}

/** A tile that flies in from its scattered spot in deep space and lands in its slot. */
function FlyingRow({ skill, index, p }: { skill: Skill; index: number; p: MotionValue<number> }) {
  const sc = scatterFor(index);
  // Eased local progress: fast launch, soft landing
  const e = useTransform(p, (v) => {
    const t = Math.min(1, Math.max(0, (v - sc.start) / FLIGHT));
    return 1 - Math.pow(1 - t, 3);
  });
  const x = useTransform(e, (k) => `${sc.x * (1 - k)}vw`);
  const y = useTransform(e, (k) => `${sc.y * (1 - k)}vh`);
  const z = useTransform(e, (k) => sc.z * (1 - k));
  const rotateX = useTransform(e, (k) => sc.rx * (1 - k));
  const rotateY = useTransform(e, (k) => sc.ry * (1 - k));
  const rotateZ = useTransform(e, (k) => sc.rz * (1 - k));
  // Already visible as faint shapes drifting in the distance, brightening as they approach
  const opacity = useTransform(p, [0, sc.start, sc.start + FLIGHT * 0.5], [0.35, 0.5, 1]);

  return (
    <motion.li
      className="group flex items-center gap-3 py-1.5 sm:py-2.5 will-change-transform"
      style={{ x, y, z, rotateX, rotateY, rotateZ, opacity }}
    >
      <SkillTile skill={skill} />
    </motion.li>
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
        className="font-display text-[clamp(2.75rem,8vw,7rem)] font-medium leading-[0.95] tracking-[-0.045em]"
      >
        The <span className="gradient-text">stack.</span>
      </motion.h2>
      <motion.p
        initial={animateIn ? { opacity: 0, y: 20 } : false}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-15% 0px' }}
        transition={{ duration: 1, ease: EASE_OUT, delay: 0.1 }}
        className="mt-4 md:mt-6 max-w-xl text-lg md:text-xl text-muted-foreground text-pretty"
      >
        The tools I reach for, from the first commit to production.
      </motion.p>
    </>
  );
}

const gridClass = 'grid grid-cols-2 lg:grid-cols-4 gap-x-6 sm:gap-x-10 gap-y-6 sm:gap-y-12';

/** Reduced motion: the finished grid. */
function StaticStack() {
  return (
    <section id="stack" className="relative py-28 md:py-40 px-5 sm:px-8 md:px-12">
      <div className="mx-auto max-w-6xl 2xl:max-w-[1400px]">
        <Heading animateIn={false} />
        <div className={`mt-14 md:mt-20 ${gridClass}`}>
          {groups.map((group) => (
            <div key={group.title}>
              <h3 className="border-b border-border pb-3 text-sm font-medium text-muted-foreground">{group.title}</h3>
              <ul className="mt-2">
                {group.skills.map((skill) => (
                  <li key={skill.name} className="group flex items-center gap-3 py-2.5">
                    <SkillTile skill={skill} />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Skills() {
  const reduceMotion = useReducedMotion();
  const stageRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: stageRef, offset: ['start start', 'end end'] });
  // Plain motion value (see Opening): keeps transforms off the page-wide native ScrollTimeline.
  const p = useMotionValue(0);
  useMotionValueEvent(scrollYProgress, 'change', (v) => p.set(v));
  const labelsOpacity = useTransform(p, [0.62, 0.8], [0, 1]);
  const labelsY = useTransform(p, [0.62, 0.8], [12, 0]);

  if (reduceMotion) return <StaticStack />;

  let index = 0;
  return (
    <section id="stack" ref={stageRef} className="relative h-[280vh]">
      <div className="sticky top-0 flex h-[100svh] flex-col justify-center overflow-hidden px-5 sm:px-8 md:px-12">
        <div className="mx-auto w-full max-w-6xl 2xl:max-w-[1400px]">
          <Heading animateIn />
          <div className={`mt-8 md:mt-16 ${gridClass}`} style={{ perspective: 1100 }}>
            {groups.map((group) => (
              <div key={group.title} className="[transform-style:preserve-3d]">
                <motion.h3
                  className="border-b border-border pb-2 sm:pb-3 text-sm font-medium text-muted-foreground"
                  style={{ opacity: labelsOpacity, y: labelsY }}
                >
                  {group.title}
                </motion.h3>
                <ul className="mt-1 sm:mt-2 [transform-style:preserve-3d]">
                  {group.skills.map((skill) => (
                    <FlyingRow key={skill.name} skill={skill} index={index++} p={p} />
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
