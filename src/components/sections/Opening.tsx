import { useEffect, useState } from 'react';
import { Sparkles, Download } from 'lucide-react';
import { SplineScene } from "@/components/ui/splite";

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
  return <section className="min-h-screen flex flex-col justify-center px-4 sm:px-6 md:px-12 lg:px-24 pt-20 md:pt-0 relative overflow-hidden bg-gradient-to-br from-background via-background to-primary/5">
      <div className="max-w-6xl 2xl:max-w-[1400px] mx-auto w-full relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start lg:items-center">
          {/* Left Column - Content */}
          <div>
            {/* Badge */}
            <div className="overflow-hidden mb-6 md:mb-8">
              
            </div>

            {/* Main headline */}
            <div className="overflow-hidden">
              <h1 className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display transition-all duration-1000 ease-smooth ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-full'}`} style={{
              transitionDelay: '150ms'
            }}>
                Hi, I'm <span className="gradient-text">​Naveen</span>
              </h1>
              <h2 className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display text-muted-foreground mt-2 transition-all duration-1000 ease-smooth ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-full'}`} style={{
              transitionDelay: '300ms'
            }}>
                {displayText}
                <span className="inline-block w-[3px] h-[0.9em] bg-primary ml-1 animate-pulse" />
              </h2>
            </div>

            {/* Description */}
            <div className="overflow-hidden mt-6 md:mt-8">
              <p className={`text-base sm:text-lg md:text-subheading text-muted-foreground font-light transition-all duration-700 ease-smooth ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-full'}`} style={{
              transitionDelay: '400ms'
            }}>
                Full-stack developer passionate about clean code, beautiful interfaces, 
                and solving complex problems. Currently exploring AI, distributed systems, 
                and the future of computing.
              </p>
            </div>

            {/* CTAs */}
            <div className={`mt-8 md:mt-12 flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3 md:gap-4 transition-all duration-700 ease-smooth ${isLoaded ? 'opacity-100' : 'opacity-0'}`} style={{
            transitionDelay: '600ms'
          }}>
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

          {/* Right Column - 3D Robot */}
          <div className={`relative h-[450px] lg:h-[600px] transition-all duration-700 ease-smooth ${isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`} style={{
            transitionDelay: '1000ms'
          }}>
            <div className="w-full h-full rounded-3xl overflow-hidden relative">
              <SplineScene 
                scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
                className="w-full h-full"
              />
            </div>
          </div>
        </div>
      </div>
    </section>;
}