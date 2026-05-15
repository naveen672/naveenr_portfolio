import { RevealSection } from '@/components/RevealSection';
import { ParallaxOrb } from '@/components/ParallaxOrb';
import { 
  Code2, 
  Database, 
  Cloud, 
  Cpu,
  Globe,
  Terminal,
  Layers,
  Sparkles
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface TechCategory {
  title: string;
  icon: LucideIcon;
  items: string[];
  color: string;
}

const techCategories: TechCategory[] = [
  {
    title: 'Languages',
    icon: Code2,
    items: ['TypeScript', 'Python', 'Go', 'Rust'],
    color: 'bg-primary',
  },
  {
    title: 'Frontend',
    icon: Globe,
    items: ['React', 'Next.js', 'Tailwind', 'Framer Motion'],
    color: 'bg-primary',
  },
  {
    title: 'Backend',
    icon: Terminal,
    items: ['Node.js', 'FastAPI', 'GraphQL', 'tRPC'],
    color: 'bg-accent',
  },
  {
    title: 'Database',
    icon: Database,
    items: ['PostgreSQL', 'Redis', 'MongoDB', 'Prisma'],
    color: 'bg-accent',
  },
  {
    title: 'Cloud',
    icon: Cloud,
    items: ['AWS', 'Vercel', 'Docker', 'Kubernetes'],
    color: 'bg-primary',
  },
  {
    title: 'AI/ML',
    icon: Cpu,
    items: ['OpenAI', 'LangChain', 'PyTorch', 'Hugging Face'],
    color: 'bg-accent',
  },
];

export function TechStack() {
  return (
    <section id="stack" className="py-16 md:py-section px-4 sm:px-6 md:px-12 lg:px-24 relative overflow-hidden">
      {/* iOS 26 Orbs with Parallax */}
      <div className="absolute inset-0 pointer-events-none">
        <ParallaxOrb variant="secondary" speed={0.06} className="w-[200px] h-[200px] md:w-[350px] md:h-[350px] top-20 right-[-50px] md:right-[-100px]" />
        <ParallaxOrb variant="primary" speed={0.04} className="w-[150px] h-[150px] md:w-[250px] md:h-[250px] bottom-40 left-[-30px] md:left-[-50px] hidden sm:block" style={{ animationDelay: '3s' }} />
      </div>
      
      <div className="max-w-6xl 2xl:max-w-[1400px] mx-auto relative">
        <RevealSection>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 liquid-glass-badge mb-4 md:mb-6">
            <Layers className="w-3.5 h-3.5 md:w-4 md:h-4 text-primary" />
            <span className="text-xs md:text-caption font-medium text-primary">Tech Stack</span>
          </div>
        </RevealSection>

        <RevealSection delay={100}>
          <h2 className="text-2xl sm:text-3xl md:text-heading font-display mb-3 md:mb-4">
            Tools I <span className="gradient-text">love</span> using
          </h2>
        </RevealSection>

        <RevealSection delay={150}>
          <p className="text-sm md:text-body text-muted-foreground mb-8 md:mb-block max-w-xl">
            Always exploring new technologies. Here's my current toolkit for building 
            fast, scalable, and maintainable systems.
          </p>
        </RevealSection>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
          {techCategories.map((category, index) => (
            <RevealSection key={category.title} delay={200 + index * 50}>
              <div className="group p-4 md:p-5 rounded-2xl md:rounded-3xl liquid-glass-card relative overflow-hidden">
                <div className="relative">
                  <div className="flex items-center gap-2.5 md:gap-3 mb-3 md:mb-4">
                    <div className={`w-8 h-8 md:w-10 md:h-10 rounded-xl md:rounded-2xl ${category.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                      <category.icon className="w-4 h-4 md:w-5 md:h-5 text-primary-foreground" />
                    </div>
                    <h3 className="font-display font-semibold text-sm md:text-base">{category.title}</h3>
                  </div>
                  <div className="flex flex-wrap gap-1.5 md:gap-2">
                    {category.items.map((item) => (
                      <span
                        key={item}
                        className="px-2.5 py-1 md:px-3 md:py-1.5 text-[10px] md:text-xs font-mono font-medium liquid-glass-badge rounded-lg hover:text-foreground transition-colors duration-200"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </RevealSection>
          ))}
        </div>

        {/* Currently exploring */}
        <RevealSection delay={500}>
          <div className="mt-8 md:mt-12 p-1 rounded-2xl md:rounded-3xl liquid-glass">
            <div className="flex flex-col sm:flex-row items-start gap-3 md:gap-4 p-4 md:p-6">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-primary flex items-center justify-center shrink-0 shadow-lg">
                <Sparkles className="w-5 h-5 md:w-6 md:h-6 text-primary-foreground" />
              </div>
              <div>
                <p className="font-display font-semibold mb-1.5 md:mb-2 text-sm md:text-base">Currently exploring</p>
                <p className="text-sm md:text-body text-muted-foreground">
                  Building local-first applications with CRDTs, experimenting with LLM agents, 
                  and diving deep into systems programming with Rust.
                </p>
              </div>
            </div>
          </div>
        </RevealSection>
      </div>
    </section>
  );
}
