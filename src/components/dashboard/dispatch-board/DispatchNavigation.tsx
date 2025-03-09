
import { Button } from "@/components/ui/button";

interface DispatchNavigationProps {
  activeView: "active" | "scheduled";
  setActiveView: (view: "active" | "scheduled") => void;
}

export function DispatchNavigation({ activeView, setActiveView }: DispatchNavigationProps) {
  return (
    <div className="flex gap-2">
      <Button
        variant={activeView === "active" ? "default" : "outline"}
        onClick={() => setActiveView("active")}
        className="bg-medical-secondary text-white hover:bg-medical-secondary/90"
      >
        Active Dispatches
      </Button>
      <Button
        variant={activeView === "scheduled" ? "default" : "outline"}
        onClick={() => setActiveView("scheduled")}
        className="border-medical-secondary text-medical-secondary hover:bg-medical-secondary/10"
      >
        Scheduled Transport
      </Button>
    </div>
  );
}
