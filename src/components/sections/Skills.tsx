import { RevealSection } from '@/components/RevealSection';
import { Code2 } from 'lucide-react';
import { useMemo } from 'react';

interface Skill {
  name: string;
  icon: string;
  color: string;
}

function SkillCard({ skill }: { skill: Skill }) {
  return (
    <div className="flex-shrink-0 group">
      <div className="flex items-center gap-3 px-5 py-3 rounded-2xl liquid-glass-card cursor-default">
        <div
          className={`w-10 h-10 rounded-xl bg-gradient-to-br ${skill.color} flex items-center justify-center text-lg font-bold text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}
        >
          {skill.icon}
        </div>
        <span className="font-medium text-sm whitespace-nowrap">{skill.name}</span>
      </div>
    </div>
  );
}

export function Skills() {
  const skills = useMemo<Skill[]>(
    () => [
      { name: 'Python', icon: '🐍', color: 'from-yellow-400 to-blue-500' },
      { name: 'Java', icon: '☕', color: 'from-red-500 to-orange-600' },
      { name: 'React JS', icon: '⚛️', color: 'from-cyan-400 to-blue-500' },
      { name: 'Node.js', icon: '🟢', color: 'from-green-500 to-green-700' },
      { name: 'AWS', icon: '☁️', color: 'from-orange-400 to-yellow-500' },
      { name: 'MongoDB', icon: '🍃', color: 'from-green-400 to-green-600' },
      { name: 'MySQL', icon: '🐬', color: 'from-blue-500 to-orange-500' },
      { name: 'PostgreSQL', icon: '🐘', color: 'from-blue-400 to-indigo-600' },
      { name: 'Kubernetes', icon: '☸️', color: 'from-blue-500 to-indigo-600' },
      { name: 'PHP', icon: 'PHP', color: 'from-indigo-500 to-purple-700' },
      { name: 'HTML / CSS / JS', icon: 'JS', color: 'from-yellow-400 to-yellow-600' },
      { name: 'Android Studio', icon: '🤖', color: 'from-green-400 to-emerald-600' },
      { name: 'Docker', icon: '🐳', color: 'from-blue-400 to-cyan-500' },
      { name: 'Figma', icon: '🎨', color: 'from-purple-500 to-pink-500' },
      { name: 'Linux', icon: '🐧', color: 'from-yellow-500 to-black' },
      { name: 'Nginx', icon: '🌐', color: 'from-green-500 to-green-700' },
      { name: 'GraphQL', icon: '◈', color: 'from-pink-500 to-purple-600' },
      { name: 'REST API', icon: 'API', color: 'from-slate-500 to-slate-700' },
    ],
    []
  );

  // Duplicate for seamless loop (match the old behavior)
  const duplicatedSkills = useMemo(() => [...skills, ...skills], [skills]);

  return (
    <section id="stack" className="py-12 md:py-20 relative overflow-hidden">
      <div className="max-w-6xl 2xl:max-w-[1400px] mx-auto px-4 sm:px-6 md:px-12 lg:px-24 mb-8">
        <RevealSection>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 liquid-glass-badge mb-4 md:mb-6">
            <Code2 className="w-3.5 h-3.5 md:w-4 md:h-4 text-primary" />
            <span className="text-xs md:text-caption font-medium text-primary">Skills & Technologies</span>
          </div>
        </RevealSection>

        <RevealSection delay={100}>
          <h2 className="text-2xl sm:text-3xl md:text-heading font-display mb-3 md:mb-4">
            Technologies I <span className="gradient-text">work with</span>
          </h2>
        </RevealSection>

        <RevealSection delay={150}>
          <p className="text-sm md:text-body text-muted-foreground max-w-xl">
            A focused set of tools I use regularly.
          </p>
        </RevealSection>
      </div>

      {/* Scrolling container - Row 1 (left to right) */}
      <div className="relative mb-4">
        {/* Gradient masks */}
        <div className="absolute left-0 top-0 bottom-0 w-20 md:w-40 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-20 md:w-40 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

        <div className="flex gap-4 animate-scroll-left">
          {duplicatedSkills.map((skill, index) => (
            <SkillCard key={`row1-${skill.name}-${index}`} skill={skill} />
          ))}
        </div>
      </div>

      {/* Scrolling container - Row 2 (right to left) */}
      <div className="relative">
        {/* Gradient masks */}
        <div className="absolute left-0 top-0 bottom-0 w-20 md:w-40 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-20 md:w-40 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

        <div className="flex gap-4 animate-scroll-right">
          {[...duplicatedSkills].reverse().map((skill, index) => (
            <SkillCard key={`row2-${skill.name}-${index}`} skill={skill} />
          ))}
        </div>
      </div>
    </section>
  );
}