
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
        className="glass-panel bg-purple-900/30 text-purple-200 hover:bg-purple-800/50 border-purple-600/20"
      >
        Active Dispatches
      </Button>
      <Button
        variant={activeView === "scheduled" ? "default" : "outline"}
        onClick={() => setActiveView("scheduled")}
        className="glass-panel bg-blue-900/20 text-blue-200 hover:bg-blue-800/40 border-blue-600/20"
      >
        Scheduled Transport
      </Button>
    </div>
  );
}
