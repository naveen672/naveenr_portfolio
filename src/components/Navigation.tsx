import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Terminal, Menu, X } from 'lucide-react';
import { SkyToggle } from '@/components/ui/sky-toggle';

const navItems = [
  { label: 'Stack', href: '#stack' },
  { label: 'Work', href: '#work' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' },
];

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  // Tone follows whatever is under the bar: sections mark themselves with data-nav-tone="dark".
  const [tone, setTone] = useState<'light' | 'dark'>('light');
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    let frame = 0;
    const handleScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        setIsScrolled(window.scrollY > 80);

        const probe = 32;
        const dark = [...document.querySelectorAll<HTMLElement>('[data-nav-tone="dark"]')].some((el) => {
          const r = el.getBoundingClientRect();
          return r.top <= probe && r.bottom > probe;
        });
        setTone(dark ? 'dark' : 'light');

        const line = window.innerHeight * 0.4;
        const current = navItems.find(({ href }) => {
          const r = document.querySelector(href)?.getBoundingClientRect();
          return r && r.top <= line && r.bottom > line;
        });
        setActive(current?.href ?? null);
      });
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    if (!isMobileMenuOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setIsMobileMenuOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isMobileMenuOpen]);

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* ================= NAVBAR ================= */}
      <nav
        className={cn(
          'fixed top-0 left-0 right-0 z-[10000] w-full transition-all duration-500 ease-smooth',
          'backdrop-blur-xl backdrop-saturate-150',
          // `dark` scopes dark tokens to the bar while it sits over a dark section
          tone === 'dark' && 'dark',
          isScrolled
            ? cn('py-3 border-b', tone === 'dark' ? 'bg-[#07080b]/70 border-white/10' : 'bg-background/75 border-border/60')
            : 'py-6 border-b border-transparent',
          'text-foreground'
        )}
      >
        <div className="max-w-6xl 2xl:max-w-[1400px] mx-auto px-6 md:px-12 flex justify-between items-center">
          
          {/* Logo */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            aria-label="Naveen R — back to top"
            className="flex items-center gap-2 group rounded-2xl p-1.5 -m-1.5"
          >
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-primary/30">
              <Terminal className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-display font-semibold text-lg hidden sm:block">
              dev<span className="text-primary">.</span>
            </span>
          </button>

          {/* ================= Desktop Nav ================= */}
          <div className="hidden md:flex items-center gap-2">
            <ul className="flex items-center gap-1">
              {navItems.map((item) => (
                <li key={item.label}>
                  <button
                    onClick={() => scrollToSection(item.href)}
                    aria-current={active === item.href ? 'location' : undefined}
                    className={cn(
                      'relative isolate rounded-full px-4 py-2 text-sm font-medium transition-colors duration-300',
                      active === item.href ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
                    )}
                  >
                    {active === item.href && (
                      <motion.span
                        layoutId="nav-active"
                        className="absolute inset-0 -z-10 rounded-full bg-foreground/[0.08]"
                        transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                      />
                    )}
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>

            {/* Theme Toggle */}
            <SkyToggle />
          </div>

          {/* ================= Mobile Buttons ================= */}
          <div className="flex items-center gap-3 md:hidden">
            <SkyToggle />

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-menu"
              className="p-2.5 rounded-xl liquid-glass-button"
            >
              {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </nav>

      {/* ================= Mobile Menu ================= */}
      <div
        id="mobile-menu"
        // Keep the closed menu out of the tab order (React 18 needs the string form of `inert`)
        {...(!isMobileMenuOpen && { inert: '' })}
        className={cn(
          'fixed inset-0 z-40 md:hidden transition-all duration-500',
          isMobileMenuOpen
            ? 'opacity-100 pointer-events-auto'
            : 'opacity-0 pointer-events-none'
        )}
      >
        <div
          className="absolute inset-0 backdrop-blur-2xl backdrop-saturate-150 supports-[backdrop-filter]:bg-background/10 bg-background/35"
          onClick={() => setIsMobileMenuOpen(false)}
        />

        <div className="absolute inset-x-0 top-24 p-6">
          <div className="p-3 rounded-3xl liquid-glass-card border border-border/20">
            <ul className="flex flex-col gap-3">
            {navItems.map((item, i) => (
              <li
                key={item.label}
                className={cn(
                  'transition-all duration-500',
                  isMobileMenuOpen
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-4'
                )}
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                <button
                  onClick={() => scrollToSection(item.href)}
                  className={cn(
                    'w-full text-left px-5 py-4 rounded-2xl',
                    'text-xl font-display font-semibold',
                    'transition-all duration-300',
                    'liquid-glass-card ring-1 ring-border/10 border border-border/15',
                    'hover:scale-[1.01] active:scale-[0.99]',
                    'hover:text-primary'
                  )}
                >
                  {item.label}
                </button>
              </li>
            ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
