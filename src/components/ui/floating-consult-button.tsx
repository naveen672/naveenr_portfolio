import { useEffect, useId, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FloatingConsultButtonProps {
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
}

// Circumference of the r=75 text path in the 200x200 viewBox.
const CIRCLE_LENGTH = 2 * Math.PI * 75;

export const FloatingConsultButton = ({
  imageSrc = "/naveen-r.jpg",
  imageAlt = "",
  revolvingText = "FREE 30 MINUTES - CONSULT - ",
  revolvingSpeed = 10,
  popupHeading = "30-minutes call",
  popupDescription = "A brief, free call to discuss your project.",
  popupBadgeText = "Free",
  ctaButtonText = "Book a call",
  ctaButtonAction = () => {},
}: FloatingConsultButtonProps): JSX.Element => {
  const [isOpen, setIsOpen] = useState(false);
  const reduceMotion = useReducedMotion();
  const pathId = useId();
  const dialogId = useId();

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setIsOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen]);

  const openLink = (url: string) => {
    window.open(url, "_blank", "noopener,noreferrer");
    setIsOpen(false);
  };

  return (
    <>
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

      <div className="fixed z-50 bottom-4 right-4 md:bottom-8 md:right-8 flex flex-col items-end gap-3">
        <AnimatePresence>
          {isOpen && (
            <motion.div
              id={dialogId}
              role="dialog"
              aria-label={popupHeading}
              initial={{ opacity: 0, scale: 0.92, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 16 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              style={{ transformOrigin: "bottom right" }}
              className="relative bg-card text-card-foreground border border-border rounded-2xl shadow-[0_24px_48px_-12px_rgba(0,0,0,0.25)] p-5 lg:p-6 w-[min(22rem,calc(100vw-2rem))]"
            >
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label="Close"
                className="absolute top-3 right-3 p-1.5 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="space-y-4">
                <div className="flex items-center gap-3 pr-8">
                  <h3 className="text-2xl font-display font-semibold leading-tight">{popupHeading}</h3>
                  <span className="px-2.5 py-1 border border-foreground/80 rounded-full text-xs font-medium">
                    {popupBadgeText}
                  </span>
                </div>

                <p className="text-sm text-muted-foreground leading-relaxed">{popupDescription}</p>

                <div className="space-y-2">
                  <Button
                    className="w-full rounded-full"
                    onClick={() => {
                      ctaButtonAction();
                      setIsOpen(false);
                    }}
                  >
                    {ctaButtonText}
                  </Button>

                  <Button
                    className="w-full bg-[#FF0000] hover:bg-[#d90000] text-white rounded-full gap-2"
                    onClick={() => openLink("https://www.youtube.com/@TechVibeKA")}
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                    </svg>
                    Subscribe on YouTube
                  </Button>

                  <Button
                    className="w-full bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 hover:brightness-110 text-white rounded-full gap-2"
                    onClick={() => openLink("https://www.instagram.com/techvibe.ka?igsh=engzaDVscDFrcWQ0&utm_source=qr")}
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                    Follow on Instagram
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          type="button"
          onClick={() => setIsOpen((o) => !o)}
          aria-expanded={isOpen}
          aria-controls={dialogId}
          aria-label={isOpen ? "Close contact options" : "Open contact options"}
          className="relative group rounded-full w-24 h-24 lg:w-36 lg:h-36 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="absolute inset-0"
            animate={reduceMotion ? undefined : { rotate: 360 }}
            transition={{ duration: revolvingSpeed, repeat: Infinity, ease: "linear" }}
            aria-hidden
          >
            <svg viewBox="0 0 200 200" className="w-full h-full">
              <defs>
                <path id={pathId} d="M 100, 100 m -75, 0 a 75,75 0 1,1 150,0 a 75,75 0 1,1 -150,0" />
              </defs>
              {/* textLength fits the phrase to exactly one lap so it never overlaps itself */}
              <text
                className="fill-muted-foreground font-medium uppercase"
                fontSize="17"
                textLength={CIRCLE_LENGTH - 2}
                lengthAdjust="spacing"
              >
                <textPath href={`#${pathId}`} startOffset="0%">
                  {revolvingText}
                </textPath>
              </text>
            </svg>
          </motion.div>

          <span className="absolute inset-0 flex items-center justify-center">
            <span className="rounded-full overflow-hidden bg-foreground shadow-[0_8px_20px_-6px_rgba(0,0,0,0.4)] group-hover:shadow-[0_12px_28px_-6px_rgba(0,0,0,0.45)] transition-shadow w-14 h-14 lg:w-[5.5rem] lg:h-[5.5rem]">
              <img src={imageSrc} alt={imageAlt} className="w-full h-full object-cover" />
            </span>
          </span>
        </motion.button>
      </div>
    </>
  );
};
