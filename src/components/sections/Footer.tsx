import { ArrowUp } from 'lucide-react';
import { Signature } from '@/components/ui/signature';
import { VisitorCount } from '@/components/VisitorCount';

const links = [
  { label: 'Stack', href: '#stack' },
  { label: 'Work', href: '#work' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' },
];

export function Footer() {
  return (
    // Continues the dark finale that Contact opens.
    <footer data-nav-tone="dark" className="dark relative bg-[#07080b] text-foreground px-5 sm:px-8 md:px-12 pb-10">
      <div className="mx-auto max-w-6xl 2xl:max-w-[1400px] border-t border-white/10 pt-12">
        <div className="flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
          <div className="text-white">
            <Signature text="Naveen" fontSize={72} duration={2.2} delay={0.1} inView once className="max-w-full h-auto" />
            <p className="mt-2 text-sm text-muted-foreground">Engineer, builder and creator.</p>
          </div>

          <nav aria-label="Footer">
            <ul className="flex flex-wrap gap-x-8 gap-y-3">
              {links.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    onClick={(e) => {
                      e.preventDefault();
                      document.querySelector(l.href)?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-between gap-4 text-sm text-muted-foreground">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-6">
            <p>© 2025–2026 Naveen R</p>
            <VisitorCount />
          </div>
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="group inline-flex items-center gap-2 rounded-full px-4 py-2 ring-1 ring-white/10 transition-colors hover:bg-white/10 hover:text-foreground"
          >
            <ArrowUp className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5" aria-hidden />
            Back to top
          </button>
        </div>
      </div>
    </footer>
  );
}
