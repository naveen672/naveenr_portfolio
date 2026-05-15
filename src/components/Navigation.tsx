import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Terminal, Menu, X } from 'lucide-react';
import { SkyToggle } from '@/components/ui/sky-toggle';

const navItems = [
  { label: 'Work', href: '#work' },
  { label: 'Stack', href: '#stack' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' },
];

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 80);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
          // Ultra-glass: heavy blur + saturation, very transparent surface
          'backdrop-blur-[48px] backdrop-saturate-[220%]',
          // If backdrop-filter is supported, go extremely transparent; otherwise use a safer fallback
          'supports-[backdrop-filter]:bg-background/6 bg-background/40',
          'border-b border-border/12 ring-1 ring-border/10',
          isScrolled
            ? 'py-3 shadow-sm supports-[backdrop-filter]:bg-background/4'
            : 'py-6'
        )}
      >
        <div className="max-w-6xl 2xl:max-w-[1400px] mx-auto px-6 md:px-12 flex justify-between items-center">
          
          {/* Logo */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center gap-2 group glass-ripple rounded-2xl p-1.5 -m-1.5"
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
                    className="glass-nav-link text-caption font-medium transition-colors"
                  >
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
              className="p-2.5 rounded-xl liquid-glass-button"
            >
              {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </nav>

      {/* ================= Mobile Menu ================= */}
      <div
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
