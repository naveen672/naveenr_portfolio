import { useState, useEffect } from 'react';
import { SplashScreen } from '@/components/SplashScreen';
import { Navigation } from '@/components/Navigation';
import { Opening } from '@/components/sections/Opening';
import { Work } from '@/components/sections/Work';
import { Skills } from '@/components/sections/Skills';
import { About } from '@/components/sections/About';
import { Founder } from '@/components/sections/Founder';
import { Contact } from '@/components/sections/Contact';
import { Footer } from '@/components/sections/Footer';
import { FloatingConsultButton } from '@/components/ui/floating-consult-button';
import { Agentation } from 'agentation';
import naveenImage from '@/assets/naveen.jpeg';

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
      // Show floating button after scrolling past hero section (approximately 100vh)
      const scrollPosition = window.scrollY;
      const heroHeight = window.innerHeight;
      
      if (scrollPosition > heroHeight * 0.8) {
        setShowFloatingButton(true);
      } else {
        setShowFloatingButton(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
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
          <Founder />
          <Contact />
        </main>
        <Footer />
        
        {/* Floating Consult Button */}
        {contentVisible && showFloatingButton && (
          <FloatingConsultButton
            imageSrc={naveenImage}
            revolvingText="GET IN TOUCH - LET'S CONNECT - FREE CONSULTATION - "
            revolvingSpeed={8}
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
    </>
  );
};

export default Index;
