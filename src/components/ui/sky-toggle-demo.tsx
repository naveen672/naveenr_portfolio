import { SkyToggle } from "@/components/ui/sky-toggle";

/**
 * Demo component showing how to use the SkyToggle theme switcher
 * 
 * The SkyToggle automatically integrates with your existing theme system
 * via the useTheme hook. It shows:
 * - Sun during day (light mode)
 * - Moon during night (dark mode)
 * - Animated clouds that slide down when switching to dark mode
 * - Stars that appear in dark mode
 * - Smooth transitions between states
 */
export default function SkyToggleDemo() {
  return (
    <div className="flex items-center justify-center min-h-screen gap-8">
      <div className="text-center space-y-4">
        <h2 className="text-2xl font-display font-bold">Sky Theme Toggle</h2>
        <p className="text-muted-foreground">Click to switch between light and dark mode</p>
        <SkyToggle />
      </div>
    </div>
  );
}
