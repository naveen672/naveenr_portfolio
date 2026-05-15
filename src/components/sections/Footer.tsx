import { Terminal, ArrowUp } from 'lucide-react';

export function Footer() {
  return (
    <footer className="py-8 md:py-12 px-4 sm:px-6 md:px-12 lg:px-24 border-t border-border/50 relative overflow-hidden">
      {/* Subtle glass background */}
      <div className="absolute inset-0 liquid-glass opacity-30 pointer-events-none" />
      
      <div className="max-w-6xl 2xl:max-w-[1400px] mx-auto flex flex-col md:flex-row justify-between items-center gap-4 md:gap-6 relative z-10">
        <div className="flex items-center gap-2 md:gap-3 px-3 py-2 rounded-xl liquid-glass-badge">
          <div className="w-7 h-7 md:w-8 md:h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
            <Terminal className="w-3.5 h-3.5 md:w-4 md:h-4 text-white" />
          </div>
          <span className="text-xs md:text-caption text-muted-foreground font-mono">© 2025 - 2026</span>
        </div>

        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="group flex items-center gap-1.5 md:gap-2 px-4 py-2.5 md:px-5 md:py-3 rounded-xl md:rounded-2xl liquid-glass-button"
        >
          <ArrowUp className="w-3.5 h-3.5 md:w-4 md:h-4 group-hover:text-primary transition-colors group-hover:-translate-y-0.5 duration-300" />
          <span className="text-xs md:text-caption font-medium group-hover:text-primary transition-colors">Back to top</span>
        </button>
      </div>
    </footer>
  );
}
