import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

interface FloatingConsultButtonProps {
  // Button appearance
  buttonSize?: number; // Diameter in pixels (default: 160 for lg, 128 for mobile)
  imageSize?: number; // Center image diameter in pixels (default: 96 for lg, 80 for mobile)
  imageSrc?: string;
  imageAlt?: string;
  
  // Revolving text
  revolvingText?: string;
  revolvingSpeed?: number; // Duration in seconds for one rotation (default: 10)
  
  // Popup content
  popupHeading?: string;
  popupDescription?: string;
  popupBadgeText?: string;
  ctaButtonText?: string;
  ctaButtonAction?: () => void;
  
  // Positioning
  position?: {
    bottom?: string;
    right?: string;
    left?: string;
    top?: string;
  };
}

export const FloatingConsultButton = ({
  buttonSize,
  imageSize,
  imageSrc = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
  imageAlt = "Consultant",
  revolvingText = "FREE 30 MINUTES - CONSULT - ",
  revolvingSpeed = 10,
  popupHeading = "30-minutes call",
  popupDescription = "This will be a brief, free call with one of Bricks Studio's design and development producers to discuss your project and determine if we're a good fit.",
  popupBadgeText = "Free",
  ctaButtonText = "Book a call",
  ctaButtonAction = () => console.log("CTA clicked"),
  position = { bottom: "2rem", right: "2rem" },
}: FloatingConsultButtonProps): JSX.Element => {
  const [isOpen, setIsOpen] = useState(false);
  
  // Responsive sizes with defaults
  const lgButtonSize = buttonSize || 160;
  const smButtonSize = buttonSize ? buttonSize * 0.8 : 128;
  const lgImageSize = imageSize || 96;
  const smImageSize = imageSize ? imageSize * 0.833 : 80;

  return (
    <>
      {/* Backdrop with Blur */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Popup Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="fixed bottom-48 right-8 z-50 bg-white rounded-2xl shadow-2xl p-5 lg:p-6 max-w-sm w-[calc(100vw-4rem)]"
          >
            {/* Close Button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute -top-12 -right-2 text-white hover:text-gray-300 transition-colors"
            >
              <svg
                width="40"
                height="40"
                viewBox="0 0 40 40"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <line x1="10" y1="10" x2="30" y2="30" />
                <line x1="30" y1="10" x2="10" y2="30" />
              </svg>
            </button>

            <div className="space-y-4">
              {/* Header */}
              <div className="flex items-start justify-between">
                <h3 className="text-2xl lg:text-3xl font-bold text-black leading-tight">
                  {popupHeading}
                </h3>
                <span className="text-black px-3 py-1.5 border-2 border-black rounded-full text-xs font-medium">
                  {popupBadgeText}
                </span>
              </div>

              {/* Description */}
              <p className="text-sm text-gray-600 leading-relaxed">
                {popupDescription}
              </p>

              {/* CTA Buttons */}
              <div className="space-y-2">
                <Button 
                  className="w-full bg-black hover:bg-gray-900 text-white px-6 py-3 rounded-full font-medium text-sm"
                  onClick={() => {
                    ctaButtonAction();
                    setIsOpen(false);
                  }}
                >
                  {ctaButtonText}
                </Button>
                
                <Button 
                  className="w-full bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-full font-medium text-sm flex items-center justify-center gap-2"
                  onClick={() => {
                    window.open('https://www.youtube.com/@TechVibeKA', '_blank');
                    setIsOpen(false);
                  }}
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                  Subscribe my YouTube
                </Button>
                
                <Button 
                  className="w-full bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 hover:from-purple-700 hover:via-pink-700 hover:to-orange-600 text-white px-6 py-3 rounded-full font-medium text-sm flex items-center justify-center gap-2"
                  onClick={() => {
                    window.open('https://www.instagram.com/techvibe.ka?igsh=engzaDVscDFrcWQ0&utm_source=qr', '_blank');
                    setIsOpen(false);
                  }}
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                  Follow on Instagram
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Button */}
      <div 
        className="fixed z-50"
        style={position}
      >
        <motion.div
          className="relative cursor-pointer group"
          style={{
            width: `${smButtonSize}px`,
            height: `${smButtonSize}px`,
          }}
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.3 }}
          onClick={() => setIsOpen(!isOpen)}
        >
          {/* Rotating Text */}
          <motion.div
            className="absolute inset-0"
            animate={{ rotate: 360 }}
            transition={{
              duration: revolvingSpeed,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            <svg
              viewBox="0 0 200 200"
              className="w-full h-full"
            >
              <defs>
                <path
                  id="circlePath"
                  d="M 100, 100 m -75, 0 a 75,75 0 1,1 150,0 a 75,75 0 1,1 -150,0"
                />
              </defs>
              <text className="text-[20.4px] fill-gray-600 font-medium uppercase tracking-wider">
                <textPath href="#circlePath" startOffset="0%">
                  {revolvingText}
                </textPath>
              </text>
            </svg>
          </motion.div>

          {/* Center Image/Circle */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div 
              className="rounded-full overflow-hidden bg-gray-900 shadow-lg group-hover:shadow-xl transition-shadow"
              style={{
                width: `${smImageSize}px`,
                height: `${smImageSize}px`,
              }}
            >
              <img
                src={imageSrc}
                alt={imageAlt}
                className="w-full h-full object-cover"
                onError={(e) => {
                  // Fallback if image doesn't exist
                  e.currentTarget.style.display = 'none';
                  const parent = e.currentTarget.parentElement;
                  if (parent) {
                    parent.innerHTML = '<div class="w-full h-full bg-gradient-to-br from-red-500 to-orange-500"></div>';
                  }
                }}
              />
            </div>
          </div>
        </motion.div>
        
        {/* Responsive sizing for larger screens */}
        <style>{`
          @media (min-width: 1024px) {
            .relative.cursor-pointer.group {
              width: ${lgButtonSize}px !important;
              height: ${lgButtonSize}px !important;
            }
            .relative.cursor-pointer.group .rounded-full.overflow-hidden {
              width: ${lgImageSize}px !important;
              height: ${lgImageSize}px !important;
            }
          }
        `}</style>
      </div>
    </>
  );
};
