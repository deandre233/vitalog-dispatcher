import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Plus, Ambulance, ClipboardList } from "lucide-react";

export function WelcomeBanner() {
  const navigate = useNavigate();
  const currentHour = new Date().getHours();
  
  const getGreeting = () => {
    if (currentHour < 12) return "Good morning";
    if (currentHour < 18) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="relative">
      <div className="px-6 py-8 sm:px-8 sm:py-12 bg-gradient-to-br from-medical-accent/30 via-white to-medical-highlight/20 rounded-lg border border-medical-secondary/20 shadow-sm">
        <div className="space-y-2 mb-6">
          <h1 className="text-2xl font-semibold text-medical-primary sm:text-3xl">
            {getGreeting()}, Dispatcher
          </h1>
          <p className="text-medical-secondary/80">
            Here's what's happening with your dispatches today.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button
            onClick={() => navigate("/book-dispatch")}
            className="bg-medical-secondary hover:bg-medical-secondary/90 text-white transition-all duration-300 hover:shadow-glow"
            size="sm"
          >
            <Plus className="mr-2 h-4 w-4" />
            Book New Dispatch
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate("/dispatch")}
            className="border-medical-secondary text-medical-secondary hover:bg-medical-secondary/10"
            size="sm"
          >
            <Ambulance className="mr-2 h-4 w-4" />
            Dispatch Control
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate("/dispatch/closed")}
            className="border-medical-secondary text-medical-secondary hover:bg-medical-secondary/10"
            size="sm"
          >
            <ClipboardList className="mr-2 h-4 w-4" />
            View Closed
          </Button>
        </div>
      </div>
    </div>
  );
}