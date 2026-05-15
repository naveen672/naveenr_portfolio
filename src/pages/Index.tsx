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
import WaterCursor from '@/components/WaterCursor';
import { FloatingConsultButton } from '@/components/ui/floating-consult-button';

const Index = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [contentVisible, setContentVisible] = useState(false);

  const handleSplashComplete = () => {
    setShowSplash(false);
    setTimeout(() => setContentVisible(true), 100);
  };

  return (
    <>
      <WaterCursor />
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
        {contentVisible && (
          <FloatingConsultButton
            imageSrc="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop"
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
    </>
  );
};

export default Index;
