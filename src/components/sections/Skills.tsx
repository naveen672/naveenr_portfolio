import { motion, useReducedMotion } from 'framer-motion';
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

function SkillRow({ skill }: { skill: Skill }) {
  const Icon = skill.icon;
  return (
    <li className="group flex items-center gap-3 py-2.5">
      <span
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] shadow-[0_4px_10px_-4px_rgba(0,0,0,0.35)] transition-transform duration-300 ease-out group-hover:-translate-y-0.5 group-hover:scale-105"
        style={{ backgroundColor: skill.bg, color: skill.dark ? '#111' : '#fff' }}
      >
        <Icon className="h-[18px] w-[18px]" aria-hidden />
      </span>
      <span className="text-base font-medium">{skill.name}</span>
    </li>
  );
}

export function Skills() {
  const reduceMotion = useReducedMotion();
  return (
    <section id="stack" className="relative py-28 md:py-40 px-5 sm:px-8 md:px-12">
      <div className="mx-auto max-w-6xl 2xl:max-w-[1400px]">
        <motion.h2
          initial={reduceMotion ? false : { opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-15% 0px' }}
          transition={{ duration: 1, ease: EASE_OUT }}
          className="font-display text-[clamp(2.75rem,8vw,7rem)] font-medium leading-[0.95] tracking-[-0.045em]"
        >
          The <span className="gradient-text">stack.</span>
        </motion.h2>
        <motion.p
          initial={reduceMotion ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-15% 0px' }}
          transition={{ duration: 1, ease: EASE_OUT, delay: 0.1 }}
          className="mt-6 max-w-xl text-lg md:text-xl text-muted-foreground text-pretty"
        >
          The tools I reach for, from the first commit to production.
        </motion.p>

        <div className="mt-14 md:mt-20 grid grid-cols-2 lg:grid-cols-4 gap-x-6 sm:gap-x-10 gap-y-12">
          {groups.map((group, g) => (
            <motion.div
              key={group.title}
              initial={reduceMotion ? false : { opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-10% 0px' }}
              transition={{ duration: 0.9, ease: EASE_OUT, delay: g * 0.08 }}
            >
              <h3 className="border-b border-border pb-3 text-sm font-medium text-muted-foreground">{group.title}</h3>
              <ul className="mt-2">
                {group.skills.map((skill) => (
                  <SkillRow key={skill.name} skill={skill} />
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
