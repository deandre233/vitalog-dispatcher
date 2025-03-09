
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
          glass-panel transition-all duration-300 font-medium text-md
          ${activeView === "active" 
            ? "bg-purple-800/80 text-purple-50 hover:bg-purple-700/90 border-purple-600/40 shadow-md shadow-purple-500/30" 
            : "bg-purple-900/30 text-purple-200 hover:bg-purple-800/40 border-purple-700/20"}
        `}
      >
        Active Dispatches
      </Button>
      <Button
        variant={activeView === "scheduled" ? "default" : "outline"}
        onClick={() => setActiveView("scheduled")}
        className={`
          glass-panel transition-all duration-300 font-medium text-md
          ${activeView === "scheduled" 
            ? "bg-blue-800/80 text-blue-50 hover:bg-blue-700/90 border-blue-600/40 shadow-md shadow-blue-500/30" 
            : "bg-blue-900/30 text-blue-200 hover:bg-blue-800/40 border-blue-700/20"}
        `}
      >
        Scheduled Transport
      </Button>
    </div>
  );
}
