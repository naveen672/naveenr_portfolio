import { useState, useEffect } from 'react';
import { SplashScreen } from '@/components/SplashScreen';
import { Navigation } from '@/components/Navigation';
import { Opening } from '@/components/sections/Opening';
import { Work } from '@/components/sections/Work';
import { Skills } from '@/components/sections/Skills';
import { About } from '@/components/sections/About';
import { ContactPortal } from '@/components/sections/ContactPortal';
import { Contact } from '@/components/sections/Contact';
import { Footer } from '@/components/sections/Footer';
import { FloatingConsultButton } from '@/components/ui/floating-consult-button';
import { Agentation } from 'agentation';
import ReactLenis from 'lenis/react';
import naveenImage from '@/assets/about/portrait.webp';

const Index = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [contentVisible, setContentVisible] = useState(false);
  const [showFloatingButton, setShowFloatingButton] = useState(false);

  const handleSplashComplete = () => {
    setShowSplash(false);
    setTimeout(() => setContentVisible(true), 100);
  };

  useEffect(() => {
    const handleScroll = () => {
      // Show after the hero; hide from the HELLO portal on, where it would be redundant
      // and would cover the portal, the form and the footer controls.
      const stackTop = document.getElementById('stack')?.getBoundingClientRect().top ?? Infinity;
      const pastHero = stackTop < window.innerHeight * 0.5;
      const contactTop = document.getElementById('hello')?.getBoundingClientRect().top ?? Infinity;
      setShowFloatingButton(pastHero && contactTop > window.innerHeight * 0.6);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <ReactLenis root>
      {showSplash && <SplashScreen onComplete={handleSplashComplete} />}
      
      <div 
        className={`min-h-screen bg-background text-foreground transition-opacity duration-700 ${
          contentVisible ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <Navigation />
        <main>
          <Opening />
          <Skills />
          <Work />
          <About />
          <ContactPortal />
          <Contact />
        </main>
        <Footer />
        
        {/* Floating Consult Button */}
        {contentVisible && showFloatingButton && (
          <FloatingConsultButton
            imageSrc={naveenImage}
            revolvingText="GET IN TOUCH · LET'S CONNECT · FREE CONSULTATION · "
            revolvingSpeed={14}
            popupHeading="Let's Talk"
            popupDescription="Schedule a free 30-minute consultation to discuss your project. I'd love to hear about your ideas and help bring them to life."
            popupBadgeText="Free"
            ctaButtonText="Schedule a Call"
            ctaButtonAction={() => {
              // Scroll to contact section
              document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
            }}
          />
        )}
      </div>
      
      {/* Agentation - Visual feedback for AI agents (dev only) */}
      {import.meta.env.DEV && <Agentation />}
    </ReactLenis>
  );
};

export default Index;
