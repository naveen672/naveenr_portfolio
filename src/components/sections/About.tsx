import { RevealSection } from '@/components/RevealSection';
import { ParallaxOrb } from '@/components/ParallaxOrb';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Coffee, Book, Headphones, MapPin, Briefcase, Heart, User, Server } from 'lucide-react';
import synamediaLogo from '@/assets/synamedia-logo.png';
import awardImage from '@/assets/award.jpeg';

export function About() {
  return (
    <section id="about" className="py-16 md:py-section px-4 sm:px-6 md:px-12 lg:px-24 relative overflow-hidden">
      {/* iOS 26 Orbs with Parallax */}
      <div className="absolute inset-0 pointer-events-none">
        <ParallaxOrb variant="secondary" speed={0.05} className="w-[250px] h-[250px] md:w-[400px] md:h-[400px] bottom-[-50px] md:bottom-[-100px] right-[-50px] md:right-[-100px]" style={{ animationDelay: '2s' }} />
      </div>
      <div className="max-w-6xl 2xl:max-w-[1400px] mx-auto">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-16">
          <div className="lg:col-span-5">
            <RevealSection>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 liquid-glass-badge mb-4 md:mb-6">
                <User className="w-3.5 h-3.5 md:w-4 md:h-4 text-primary" />
                <span className="text-xs md:text-caption font-medium text-primary">About Me</span>
              </div>
            </RevealSection>
            
            <RevealSection delay={100}>
              <h2 className="text-2xl sm:text-3xl md:text-heading font-display mb-4 md:mb-6">
                A bit about <span className="gradient-text">me</span>
              </h2>
            </RevealSection>

            {/* Current Role */}
            <RevealSection delay={150}>
              <div className="p-4 md:p-5 rounded-2xl md:rounded-3xl liquid-glass-card mb-4 md:mb-6">
                <p className="text-xs md:text-caption text-muted-foreground mb-2 font-mono">Currently working at</p>
                <div className="flex items-center gap-4">
                  <div className="w-24 h-24 md:w-32 md:h-32 rounded-2xl md:rounded-3xl overflow-hidden flex items-center justify-center">
                    <img src={synamediaLogo} alt="Synamedia" className="w-full h-full object-contain" />
                  </div>
                  <div>
                    <p className="text-sm md:text-body font-semibold">Synamedia</p>
                    <p className="text-xs md:text-caption text-muted-foreground">SRE / DevOps / AI / Automation Engineer</p>
                  </div>
                </div>
              </div>
            </RevealSection>

            {/* Quick facts */}
            <RevealSection delay={200}>
              <div className="space-y-3 md:space-y-4">
                {[
                  {
                    icon: Server,
                    text: 'Large-scale, high-availability media/streaming systems (observability, automation, reliability).',
                  },
                  { icon: MapPin, text: 'India' },
                  { icon: Briefcase, text: '4+ years building software' },
                  { icon: Heart, text: 'Open source contributor' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 text-muted-foreground group">
                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl md:rounded-2xl liquid-glass-button flex items-center justify-center">
                      <item.icon className="w-3.5 h-3.5 md:w-4 md:h-4 text-primary" />
                    </div>
                    <span className={i === 0 ? 'text-xs md:text-caption leading-snug' : 'text-sm md:text-body'}>
                      {item.text}
                    </span>
                  </div>
                ))}
              </div>
            </RevealSection>

            {/* Stats with liquid animation */}
            <RevealSection delay={300}>
              <div className="grid grid-cols-3 gap-3 mt-6 md:mt-8">
                {[
                  { value: '4+', label: 'Years Experience' },
                  { value: '50+', label: 'Projects' },
                  { value: '100+', label: 'Clients' },
                ].map((stat, i) => (
                  <div 
                    key={i} 
                    className="group relative p-4 md:p-5 rounded-2xl md:rounded-3xl liquid-glass-card text-center overflow-hidden transition-all duration-500 hover:scale-105"
                  >
                    {/* Liquid blob animation */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-primary/20 rounded-full blur-2xl animate-pulse" style={{ animationDuration: '3s' }} />
                      <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-secondary/20 rounded-full blur-2xl animate-pulse" style={{ animationDuration: '2.5s', animationDelay: '0.5s' }} />
                    </div>
                    <div className="relative z-10">
                      <span className="text-2xl md:text-4xl font-display font-bold gradient-text">{stat.value}</span>
                      <p className="text-[10px] md:text-xs text-muted-foreground mt-1 font-medium">{stat.label}</p>
                    </div>
                  </div>
                ))}
              </div>
            </RevealSection>
          </div>

          <div className="lg:col-span-7 space-y-4 md:space-y-6">
            <RevealSection delay={200}>
              <p className="text-sm md:text-body text-muted-foreground leading-relaxed">
                I’m a software engineer and technical consultant who loves turning complex problems into simple, scalable solutions. I started coding early, and over the years, I’ve worked across DevOps, automation, and full-stack systems—building tools that improve reliability, performance, and developer productivity.
              </p>
            </RevealSection>

            {/* Award (compact) */}
            <RevealSection delay={250}>
              <Dialog>
                <DialogTrigger asChild>
                  <button
                    type="button"
                    className="group w-full text-left p-4 md:p-5 rounded-2xl md:rounded-3xl liquid-glass-card transition-transform duration-300 hover:scale-[1.01]"
                    aria-label="View award"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-28 md:w-32 aspect-[4/3] rounded-xl md:rounded-2xl overflow-hidden border border-border/40 shrink-0">
                        <img
                          src={awardImage}
                          alt="Synamedia award"
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs md:text-caption text-muted-foreground font-mono">Award</p>
                        <p className="text-sm md:text-body font-semibold leading-tight truncate">Synamedia recognition</p>
                        <p className="text-xs md:text-caption text-muted-foreground">Tap to preview</p>
                      </div>
                    </div>
                  </button>
                </DialogTrigger>

                <DialogContent className="max-w-3xl overflow-hidden">
                  <DialogHeader>
                    <DialogTitle>Award</DialogTitle>
                    <DialogDescription>Synamedia recognition</DialogDescription>
                  </DialogHeader>
                  <div className="rounded-2xl overflow-hidden border border-border/40 bg-black/10">
                    <img
                      src={awardImage}
                      alt="Synamedia award"
                      className="w-full max-h-[70vh] object-contain"
                      loading="lazy"
                    />
                  </div>
                </DialogContent>
              </Dialog>
            </RevealSection>

            <RevealSection delay={300}>
              <p className="text-sm md:text-body text-muted-foreground leading-relaxed">
                Today, I focus on designing systems that are not just functional, but resilient, efficient, and future-ready.
              </p>
            </RevealSection>

            <RevealSection delay={400}>
              <p className="text-sm md:text-body text-muted-foreground leading-relaxed">
                I believe great software is built at the intersection of strong engineering fundamentals and real human needs. Whether it’s optimizing infrastructure, automating workflows, or improving user experience, I approach every challenge with curiosity and ownership.
                <br />
                <br />
                I enjoy working on distributed systems, cloud-native architectures, and automation pipelines that make teams faster and systems more reliable.
              </p>
            </RevealSection>

            {/* Interests */}
            <RevealSection delay={500}>
              <div className="pt-4 md:pt-6 border-t border-border">
                <p className="text-xs md:text-caption text-muted-foreground mb-3 md:mb-4 font-mono">Outside of code</p>
                <div className="flex flex-wrap gap-2 md:gap-3">
                  {[
                    { icon: Coffee, text: 'Coffee enthusiast' },
                    { icon: Book, text: 'Sci-fi reader' },
                    { icon: Headphones, text: 'Lo-fi beats' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-1.5 md:gap-2 px-3 py-2 md:px-4 md:py-2.5 liquid-glass-badge">
                      <item.icon className="w-3.5 h-3.5 md:w-4 md:h-4 text-primary" />
                      <span className="text-xs md:text-caption font-medium">{item.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </RevealSection>

            <RevealSection delay={600}>
              <div className="p-4 md:p-5 rounded-2xl md:rounded-3xl liquid-glass-card">
                <div className="flex items-center gap-3">
                  <span className="relative flex h-2.5 w-2.5 md:h-3 md:w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 md:h-3 md:w-3 bg-green-500" />
                  </span>
                  <p className="text-sm md:text-body font-semibold">
                    Available for interesting projects, consulting, and collaborations
                  </p>
                </div>
              </div>
            </RevealSection>
          </div>
        </div>
      </div>
    </section>
  );
}
