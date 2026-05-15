import { Button } from "@/components/ui/button";

/**
 * Demo component to test the offline detector
 * Usage: Add this component to any page and click the button to simulate offline state
 */
export function OfflineDetectorDemo() {
  const simulateOffline = () => {
    // Dispatch offline event to test the OfflineDetector
    window.dispatchEvent(new Event('offline'));
    
    // Auto re-enable after 5 seconds for demo purposes
    setTimeout(() => {
      window.dispatchEvent(new Event('online'));
    }, 5000);
  };

  return (
    <div className="fixed bottom-4 left-4 z-50">
      <Button
        variant="outline"
        onClick={simulateOffline}
        className="shadow-lg"
      >
        Test Offline Mode (5s)
      </Button>
    </div>
  );
}
