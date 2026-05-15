import { useEffect, useState } from 'react';
import { WifiOff } from 'lucide-react';

export function OfflineDetector() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-background/95 backdrop-blur-sm flex items-center justify-center">
      <div className="container mx-auto px-4">
        <div className="flex justify-center">
          <div className="w-full sm:w-10/12 md:w-8/12 text-center">
            <div className="flex justify-center mb-8">
              <div className="w-32 h-32 rounded-full bg-muted flex items-center justify-center">
                <WifiOff className="w-16 h-16 text-muted-foreground" />
              </div>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-display font-bold mb-4">
              No Internet Connection
            </h1>
            
            <p className="text-lg text-muted-foreground mb-8 max-w-md mx-auto">
              Please check your internet connection and try again. The page will automatically reload when you're back online.
            </p>

            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <div className="w-2 h-2 rounded-full bg-destructive animate-pulse" />
              <span>Offline</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
