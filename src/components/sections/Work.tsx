import { RevealSection } from '@/components/RevealSection';
import { ParallaxOrb } from '@/components/ParallaxOrb';
import { ExternalLink, Github, Rocket, Brain, Gamepad2, ArrowUpRight, GraduationCap, School, BookOpen } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface Project {
  id: number;
  title: string;
  description: string;
  tech: string[];
  role: string;
  year: string;
  icon: LucideIcon;
  color: string;
  link?: string;
}

const projects: Project[] = [
  {
    id: 1,
    title: 'JSS Polytechnic Mysuru',
    description: 'Official website for JSS Polytechnic Mysuru - featuring courses, admissions, and campus information',
    tech: ['React', 'TypeScript', 'Tailwind CSS', 'Node.js'],
    role: 'Full Stack Developer',
    year: '2025',
    icon: GraduationCap,
    color: 'bg-primary',
    link: 'https://www.jsspolytechnicmysuru.ac.in/',
  },
  {
    id: 2,
    title: 'JSS Polytechnic for Women Mysuru',
    description: 'Official website for JSS Polytechnic for Women - featuring courses, admissions, and campus information',
    tech: ['React', 'TypeScript', 'Tailwind CSS', 'CMS'],
    role: 'Full Stack Developer',
    year: '2025',
    icon: School,
    color: 'bg-accent',
    link: 'https://jsspwmys.ac.in/',
  },
  {
    id: 3,
    title: 'JSS Polytechnic Nanjangud',
    description: 'Complete polytechnic college website with academic programs, events calendar, and student portal',
    tech: ['React', 'TypeScript', 'Tailwind CSS', 'Firebase'],
    role: 'Full Stack Developer',
    year: '2025',
    icon: BookOpen,
    color: 'bg-primary',
    link: 'https://jsspn.org/',
  },
];

export function Work() {
  return (
    <section id="work" className="py-16 md:py-section px-4 sm:px-6 md:px-12 lg:px-24 relative overflow-hidden">
      {/* iOS 26 Orbs with Parallax */}
      <div className="absolute inset-0 pointer-events-none">
        <ParallaxOrb variant="primary" speed={0.07} className="w-[200px] h-[200px] md:w-[300px] md:h-[300px] top-40 left-[-50px] md:left-[-100px]" style={{ animationDelay: '1s' }} />
      </div>
      <div className="max-w-6xl 2xl:max-w-[1400px] mx-auto">
        <RevealSection>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-full liquid-glass-badge mb-4 md:mb-6">
            <span className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-xs md:text-caption font-medium text-primary">Featured Projects</span>
          </div>
        </RevealSection>

        <RevealSection delay={100}>
          <h2 className="text-2xl sm:text-3xl md:text-heading font-display mb-3 md:mb-4">
            Things I've <span className="gradient-text">shipped</span>
          </h2>
        </RevealSection>

        <RevealSection delay={150}>
          <p className="text-sm md:text-body text-muted-foreground mb-8 md:mb-block max-w-xl">
            A selection of projects I've worked on recently. Each one taught me something new.
          </p>
        </RevealSection>

        <div className="space-y-4 md:space-y-6">
          {projects.map((project, index) => (
            <RevealSection key={project.id} delay={200 + index * 100}>
              <article className="group relative p-4 sm:p-5 md:p-6 lg:p-8 rounded-2xl md:rounded-3xl liquid-glass-card overflow-hidden">
                <div className="relative flex flex-col sm:flex-row sm:items-start gap-4 md:gap-6">
                  {/* Icon */}
                  <div className="shrink-0">
                    <div className={`w-12 h-12 md:w-14 md:h-14 rounded-xl md:rounded-2xl ${project.color} flex items-center justify-center group-hover:scale-110 transition-all duration-500 shadow-lg`}>
                      <project.icon className="w-6 h-6 md:w-7 md:h-7 text-primary-foreground" />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3 md:gap-4 mb-2 md:mb-3">
                      <h3 className="text-lg md:text-xl font-display font-semibold group-hover:text-primary transition-colors duration-300">
                        {project.title}
                      </h3>
                      <div className="flex gap-1.5 md:gap-2 shrink-0">
                        {project.link && (
                          <a 
                            href={project.link} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="p-2 md:p-2.5 rounded-lg md:rounded-xl liquid-glass-button group/btn"
                          >
                            <ExternalLink className="w-3.5 h-3.5 md:w-4 md:h-4 group-hover/btn:text-primary transition-colors" />
                          </a>
                        )}
                      </div>
                    </div>

                    <p className="text-sm md:text-body text-muted-foreground mb-4 md:mb-5">
                      {project.description}
                    </p>

                    {/* Tech stack */}
                    <div className="flex flex-wrap gap-1.5 md:gap-2 mb-4 md:mb-5">
                      {project.tech.map((t) => (
                        <span
                          key={t}
                          className="px-2.5 py-1 md:px-3 md:py-1.5 text-[10px] md:text-xs font-mono font-medium liquid-glass-badge rounded-lg"
                        >
                          {t}
                        </span>
                      ))}
                    </div>

                    {/* Meta */}
                    <div className="flex items-center gap-3 md:gap-4 text-xs md:text-caption text-muted-foreground">
                      <span className="font-medium">{project.role}</span>
                      <span className="w-1 h-1 rounded-full bg-border" />
                      <span>{project.year}</span>
                    </div>
                  </div>
                </div>

                {/* Hover arrow */}
                <ArrowUpRight className="absolute bottom-4 right-4 md:bottom-6 md:right-6 w-4 h-4 md:w-5 md:h-5 text-primary opacity-0 translate-x-2 -translate-y-2 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 transition-all duration-300" />
              </article>
            </RevealSection>
          ))}
        </div>
      </div>
    </section>
  );
}
