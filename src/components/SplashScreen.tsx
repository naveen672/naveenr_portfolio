import Preloader from "@/components/ui/preloader";

interface SplashScreenProps {
  onComplete: () => void;
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
  return <Preloader onComplete={onComplete} />;
}
