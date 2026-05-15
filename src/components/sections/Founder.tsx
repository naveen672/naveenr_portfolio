import { RevealSection } from '@/components/RevealSection';
import { ParallaxOrb } from '@/components/ParallaxOrb';
import { BriefcaseBusiness } from 'lucide-react';
import brandLogo from '@/assets/logo.jpeg';

export function Founder() {
  return (
    <section id="founder" className="py-16 md:py-section px-4 sm:px-6 md:px-12 lg:px-24 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <ParallaxOrb
          variant="primary"
          speed={0.04}
          className="w-[220px] h-[220px] md:w-[360px] md:h-[360px] top-[-60px] md:top-[-100px] left-[-60px] md:left-[-100px]"
          style={{ animationDelay: '1s' }}
        />
      </div>

      <div className="max-w-6xl 2xl:max-w-[1400px] mx-auto relative">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-16 items-start">
          <div className="lg:col-span-5">
            <RevealSection>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 liquid-glass-badge mb-4 md:mb-6">
                <BriefcaseBusiness className="w-3.5 h-3.5 md:w-4 md:h-4 text-primary" />
                <span className="text-xs md:text-caption font-medium text-primary">Founder</span>
              </div>
            </RevealSection>

            <RevealSection delay={100}>
              <h2 className="text-2xl sm:text-3xl md:text-heading font-display mb-4 md:mb-6">
                Infinite Horizon <span className="gradient-text">Enterprises</span>
              </h2>
            </RevealSection>

            <RevealSection delay={150}>
              <div className="p-4 md:p-5 rounded-2xl md:rounded-3xl liquid-glass-card">
                <p className="text-xs md:text-caption text-muted-foreground mb-2 font-mono">Founder &amp; Lead Engineer</p>

                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 md:w-28 md:h-28 rounded-2xl md:rounded-3xl overflow-hidden border border-border/40 bg-black/10 flex items-center justify-center shrink-0">
                    <img src={brandLogo} alt="Infinite Horizon Enterprises" className="w-full h-full object-cover" loading="lazy" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm md:text-body font-semibold">Infinite Horizon Enterprises</p>
                    <p className="text-xs md:text-caption text-muted-foreground">Founder · Technical Architect · Educator</p>
                  </div>
                </div>
              </div>
            </RevealSection>
          </div>

          <div className="lg:col-span-7 space-y-4 md:space-y-6">
            <RevealSection delay={200}>
              <p className="text-sm md:text-body text-muted-foreground leading-relaxed">
                Infinite Horizon Enterprises is my initiative focused on building modern websites, scalable web applications, and providing technical training. Through this venture, I’ve worked with colleges, startups, and organizations—delivering production-ready solutions and mentoring over 1,500+ students across multiple states.
              </p>
            </RevealSection>

            <RevealSection delay={300}>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { value: '4+', label: 'Years of Experience' },
                  { value: '50+', label: 'Projects Delivered' },
                  { value: '1500+', label: 'Students Trained' },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="p-4 md:p-5 rounded-2xl md:rounded-3xl liquid-glass-card text-center"
                  >
                    <span className="text-2xl md:text-4xl font-display font-bold gradient-text">{stat.value}</span>
                    <p className="text-[10px] md:text-xs text-muted-foreground mt-1 font-medium">{stat.label}</p>
                  </div>
                ))}
              </div>
            </RevealSection>
          </div>
        </div>
      </div>
    </section>
  );
}
