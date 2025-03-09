
import { Button } from "@/components/ui/button";

interface ViewToggleProps {
  activeView: "active" | "scheduled";
  setActiveView: (view: "active" | "scheduled") => void;
}

export function ViewToggle({ activeView, setActiveView }: ViewToggleProps) {
  return (
    <div className="flex gap-2">
      <Button
        variant={activeView === "active" ? "default" : "outline"}
        onClick={() => setActiveView("active")}
        className={`
          transition-all duration-300 font-medium text-md
          ${activeView === "active" 
            ? "purple-glass hover-glow text-shadow-sm" 
            : "glass-panel hover:bg-purple-800/40"}
        `}
      >
        Active Dispatches
      </Button>
      <Button
        variant={activeView === "scheduled" ? "default" : "outline"}
        onClick={() => setActiveView("scheduled")}
        className={`
          transition-all duration-300 font-medium text-md
          ${activeView === "scheduled" 
            ? "blue-glass hover-glow text-shadow-sm" 
            : "glass-panel hover:bg-blue-800/40"}
        `}
      >
        Scheduled Transport
      </Button>
    </div>
  );
}
