import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, Instagram, Maximize2, Youtube } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import synamediaLogo from '@/assets/synamedia-logo.png';
import awardImage from '@/assets/about/award.webp';
import portrait from '@/assets/about/portrait.webp';
import iheLogo from '@/assets/about/ihe-logo.webp';

const EASE_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1];

const figures = [
  { value: '4+', label: 'Years building software' },
  { value: '50+', label: 'Projects delivered' },
  { value: '100+', label: 'Clients' },
  { value: '1,500+', label: 'Students trained' },
];

const tile =
  'relative overflow-hidden rounded-[28px] bg-card ring-1 ring-border/70 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_12px_32px_-16px_rgba(0,0,0,0.12)]';

export function About() {
  const reduceMotion = useReducedMotion();
  const reveal = (i: number) =>
    reduceMotion
      ? {}
      : {
          initial: { opacity: 0, y: 36 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true, margin: '-10% 0px' },
          transition: { duration: 0.9, ease: EASE_OUT, delay: i * 0.07 },
        };

  return (
    <section id="about" className="relative py-28 md:py-40 px-5 sm:px-8 md:px-12">
      <div className="mx-auto max-w-6xl 2xl:max-w-[1400px]">
        <motion.h2
          {...reveal(0)}
          className="font-display text-[clamp(2.75rem,8vw,7rem)] font-medium leading-[0.95] tracking-[-0.045em] text-balance"
        >
          A bit about <span className="gradient-text">me.</span>
        </motion.h2>
        <motion.p {...reveal(1)} className="mt-6 max-w-2xl text-lg md:text-xl leading-relaxed text-muted-foreground text-pretty">
          I’m a software engineer and technical consultant who loves turning complex problems into simple, scalable
          solutions, across DevOps, automation and full-stack systems.
        </motion.p>

        <div className="mt-14 md:mt-20 grid grid-cols-1 md:grid-cols-6 lg:grid-cols-12 gap-4">
          {/* Portrait */}
          <motion.figure {...reveal(0)} className={cn(tile, 'md:col-span-3 lg:col-span-4 lg:row-span-2 min-h-[420px] bg-black')}>
            <img
              src={portrait}
              alt="Naveen R"
              className="absolute inset-0 h-full w-full object-cover object-top"
              loading="lazy"
            />
            <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-6 pt-20 text-white">
              <p className="font-display text-2xl font-medium tracking-[-0.02em]">Naveen R</p>
              <p className="mt-1 text-sm text-white/70">Mysore / Bangalore, India</p>
            </figcaption>
          </motion.figure>

          {/* Current role */}
          <motion.div {...reveal(1)} className={cn(tile, 'md:col-span-3 lg:col-span-5 bg-black text-white p-7 flex flex-col justify-between min-h-[260px]')}>
            <img
              src={synamediaLogo}
              alt=""
              aria-hidden
              className="pointer-events-none absolute inset-x-0 top-0 h-[58%] w-full object-cover object-center opacity-90 [mask-image:linear-gradient(to_bottom,black_55%,transparent)]"
              loading="lazy"
            />
            <p className="relative sr-only">Currently at Synamedia</p>
            <div className="relative mt-auto pt-28">
              <p className="text-sm text-white/60">Currently at Synamedia</p>
              <p className="mt-1 font-display text-2xl md:text-3xl font-medium leading-tight tracking-[-0.02em]">
                SRE, DevOps, AI &amp; Automation Engineer
              </p>
              <p className="mt-3 max-w-md text-sm leading-relaxed text-white/70">
                Large-scale, high-availability media and streaming systems: observability, automation and reliability.
              </p>
            </div>
          </motion.div>

          {/* Award */}
          <Dialog>
            <DialogTrigger asChild>
              <motion.button
                {...reveal(2)}
                type="button"
                className={cn(tile, 'group md:col-span-6 lg:col-span-3 lg:row-span-2 min-h-[420px] bg-black text-left')}
                aria-label="View the India Site Excellence Recognition award"
              >
                <img
                  src={awardImage}
                  alt=""
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                  loading="lazy"
                />
                <span className="absolute right-4 bottom-4 rounded-full bg-black/40 p-2 text-white backdrop-blur-md">
                  <Maximize2 className="h-4 w-4" aria-hidden />
                </span>
                <span className="absolute inset-x-0 top-0 block bg-gradient-to-b from-black/80 via-black/40 to-transparent p-6 pb-24 pr-14 text-white">
                  <span className="block text-sm text-white/65">Award · Synamedia</span>
                  <span className="mt-1 block font-display text-xl font-medium leading-snug tracking-[-0.01em]">
                    India Site Excellence Recognition
                  </span>
                </span>
              </motion.button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl overflow-hidden p-0">
              <DialogTitle className="sr-only">India Site Excellence Recognition</DialogTitle>
              <DialogDescription className="sr-only">Award from Synamedia to Naveen R</DialogDescription>
              <img src={awardImage} alt="Synamedia India Site Excellence Recognition award for Naveen R" className="max-h-[85vh] w-full object-contain bg-black" />
            </DialogContent>
          </Dialog>

          {/* Figures */}
          <motion.div {...reveal(3)} className={cn(tile, 'md:col-span-6 lg:col-span-5 p-7')}>
            <dl className="grid grid-cols-2 gap-x-6 gap-y-7">
              {figures.map((f) => (
                <div key={f.label}>
                  <dt className="sr-only">{f.label}</dt>
                  <dd>
                    <span className="block font-display text-4xl md:text-5xl font-medium tracking-[-0.04em] tabular-nums">
                      {f.value}
                    </span>
                    <span className="mt-1 block text-sm text-muted-foreground" aria-hidden>
                      {f.label}
                    </span>
                  </dd>
                </div>
              ))}
            </dl>
          </motion.div>

          {/* Founder */}
          <motion.div {...reveal(4)} className={cn(tile, 'md:col-span-6 lg:col-span-7 p-7 md:p-8 flex flex-col sm:flex-row gap-6 sm:items-center')}>
            <img
              src={iheLogo}
              alt="Infinite Horizon Enterprises logo"
              className="h-28 w-28 shrink-0 rounded-2xl bg-white object-contain p-2 ring-1 ring-border/60"
              loading="lazy"
            />
            <div>
              <p className="text-sm text-muted-foreground">Founder &amp; Lead Engineer · Since 2022</p>
              <p className="mt-1 font-display text-2xl md:text-3xl font-medium tracking-[-0.02em]">Infinite Horizon Enterprises</p>
              <p className="mt-3 text-sm md:text-base leading-relaxed text-muted-foreground text-pretty">
                Modern websites, scalable web applications and technical training. Production-ready work for colleges,
                startups and organisations, and mentoring for over 1,500 students across multiple states.
              </p>
            </div>
          </motion.div>

          {/* Belief */}
          <motion.blockquote {...reveal(5)} className={cn(tile, 'md:col-span-6 lg:col-span-5 p-7 md:p-8 flex flex-col justify-between gap-6')}>
            <p className="font-display text-2xl md:text-[1.75rem] font-medium leading-snug tracking-[-0.02em] text-balance">
              “Great software is built where strong engineering fundamentals meet real human needs.”
            </p>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Distributed systems, cloud-native architecture and automation pipelines that make teams faster and systems
              more reliable.
            </p>
          </motion.blockquote>

          {/* Outside of code */}
          <motion.div {...reveal(6)} className={cn(tile, 'md:col-span-3 lg:col-span-5 p-7')}>
            <p className="text-sm text-muted-foreground">Outside of code</p>
            <p className="mt-1 font-display text-2xl font-medium tracking-[-0.02em]">YouTuber &amp; AI video creator</p>
            <div className="mt-5 flex flex-wrap gap-2">
              <a
                href="https://www.youtube.com/@TechVibeKA"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-[#FF0000] px-4 py-2 text-sm font-medium text-white transition-transform duration-300 hover:-translate-y-0.5"
              >
                <Youtube className="h-4 w-4" aria-hidden /> TechVibeKA
              </a>
              <a
                href="https://www.instagram.com/techvibe.ka?igsh=engzaDVscDFrcWQ0&utm_source=qr"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-medium transition-colors duration-300 hover:bg-muted"
              >
                <Instagram className="h-4 w-4" aria-hidden /> techvibe.ka
              </a>
              <span className="inline-flex items-center rounded-full border border-border px-4 py-2 text-sm text-muted-foreground">
                Open source contributor
              </span>
            </div>
          </motion.div>

          {/* Availability */}
          <motion.a
            {...reveal(7)}
            href="#contact"
            onClick={(e) => {
              e.preventDefault();
              document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className={cn(tile, 'group md:col-span-3 lg:col-span-7 p-7 flex flex-col justify-between gap-6 bg-foreground text-background ring-0')}
          >
            <span className="inline-flex items-center gap-2 text-sm opacity-70">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-green-500" />
              </span>
              Available now
            </span>
            <span className="flex items-end justify-between gap-6">
              <span className="font-display text-2xl md:text-3xl font-medium leading-tight tracking-[-0.02em] text-balance">
                Open to interesting projects, consulting and collaborations.
              </span>
              <span className="shrink-0 rounded-full bg-background/10 p-3 transition-transform duration-300 group-hover:translate-x-1">
                <ArrowRight className="h-5 w-5" aria-hidden />
              </span>
            </span>
          </motion.a>
        </div>
      </div>
    </section>
  );
}

