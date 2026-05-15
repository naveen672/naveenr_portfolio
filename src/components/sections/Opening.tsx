import { useEffect, useState } from 'react';
import { Sparkles, Zap, Download } from 'lucide-react';
import { SplineScene } from '@/components/ui/splite';

const typingPhrases = [
  "I build for the web",
  "Freelancer",
  "Full Stack Developer",
  "Tech Enthusiast",
  "AI Developer"
];

export function Opening() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const currentPhrase = typingPhrases[currentPhraseIndex];
    const typingSpeed = isDeleting ? 50 : 100;
    const pauseTime = 2000;

    if (!isDeleting && displayText === currentPhrase) {
      const timeout = setTimeout(() => setIsDeleting(true), pauseTime);
      return () => clearTimeout(timeout);
    }

    if (isDeleting && displayText === '') {
      setIsDeleting(false);
      setCurrentPhraseIndex((prev) => (prev + 1) % typingPhrases.length);
      return;
    }

    const timeout = setTimeout(() => {
      setDisplayText(prev => 
        isDeleting 
          ? prev.slice(0, -1) 
          : currentPhrase.slice(0, prev.length + 1)
      );
    }, typingSpeed);

    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, currentPhraseIndex]);
  return <section className="min-h-screen flex flex-col justify-center px-4 sm:px-6 md:px-12 lg:px-24 pt-20 md:pt-0 relative overflow-hidden bg-black/[0.96]">
      {/* Spline 3D Background */}
      <div className="absolute inset-0 w-full h-full z-0 opacity-40">
        <SplineScene
          scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
          className="w-full h-full"
        />
      </div>

      <div className="max-w-6xl 2xl:max-w-[1400px] mx-auto w-full relative z-10">
        {/* Badge */}
        <div className="overflow-hidden mb-6 md:mb-8">
          
        </div>

        {/* Main headline */}
        <div className="overflow-hidden">
          <h1 className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl 2xl:text-display font-display transition-all duration-1000 ease-smooth ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-full'}`} style={{
          transitionDelay: '150ms'
        }}>
            Hi, I'm <span className="gradient-text">​Naveen</span>
            <br />
            <span className="text-muted-foreground">
              {displayText}
              <span className="inline-block w-[3px] h-[0.9em] bg-primary ml-1 animate-pulse" />
            </span>
          </h1>
        </div>

        {/* Description */}
        <div className="overflow-hidden mt-6 md:mt-8 max-w-2xl">
          <p className={`text-base sm:text-lg md:text-subheading text-muted-foreground font-light transition-all duration-700 ease-smooth ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-full'}`} style={{
          transitionDelay: '400ms'
        }}>
            Full-stack developer passionate about clean code, beautiful interfaces, 
            and solving complex problems. Currently exploring AI, distributed systems, 
            and the future of computing.
          </p>
        </div>

        {/* Tech badges */}
        <div className={`mt-6 md:mt-10 flex flex-wrap gap-2 md:gap-3 transition-all duration-700 ease-smooth ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{
        transitionDelay: '600ms'
      }}>
          {['React', 'TypeScript', 'Node.js', 'Python', 'AWS'].map((tech, i) => <span key={tech} className="px-3 py-2 md:px-4 md:py-2.5 text-xs md:text-caption font-mono font-medium liquid-glass-badge transition-all duration-300 cursor-default hover:scale-105" style={{
          animationDelay: `${600 + i * 100}ms`
        }}>
              {tech}
            </span>)}
        </div>

        {/* CTAs */}
        <div className={`mt-8 md:mt-12 flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3 md:gap-4 transition-all duration-700 ease-smooth ${isLoaded ? 'opacity-100' : 'opacity-0'}`} style={{
        transitionDelay: '800ms'
      }}>
          <a href="#work" className="inline-flex items-center justify-center gap-2 md:gap-3 px-5 py-3 md:px-6 md:py-3.5 liquid-glass-primary rounded-2xl font-medium text-sm md:text-base" onClick={e => {
          e.preventDefault();
          document.querySelector('#work')?.scrollIntoView({
            behavior: 'smooth'
          });
        }}>
            <Zap className="w-4 h-4 md:w-5 md:h-5" />
            <span>View my work</span>
          </a>

          <a href="#contact" className="inline-flex items-center justify-center gap-2 md:gap-3 px-5 py-3 md:px-6 md:py-3.5 liquid-glass-button rounded-2xl font-medium transition-all duration-300 text-sm md:text-base" onClick={e => {
          e.preventDefault();
          document.querySelector('#contact')?.scrollIntoView({
            behavior: 'smooth'
          });
        }}>
            <Sparkles className="w-4 h-4 md:w-5 md:h-5 text-primary" />
            <span>Get in touch</span>
          </a>

          <a 
            href="/Naveen_resume.pdf" 
            download="Naveen_Resume.pdf"
            className="inline-flex items-center justify-center gap-2 md:gap-3 px-5 py-3 md:px-6 md:py-3.5 liquid-glass-button rounded-2xl font-medium transition-all duration-300 text-sm md:text-base hover:scale-105"
          >
            <Download className="w-4 h-4 md:w-5 md:h-5 text-primary" />
            <span>Download Resume</span>
          </a>
        </div>
      </div>
    </section>;
}