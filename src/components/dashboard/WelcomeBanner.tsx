import { Button } from "@/components/ui/button";
import { Plus, Ambulance, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function WelcomeBanner() {
  const navigate = useNavigate();
  const currentTime = new Date();
  const hour = currentTime.getHours();

  const getGreeting = () => {
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="futuristic-panel p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold text-medical-primary">
            {getGreeting()}, Dispatcher
          </h1>
          <p className="text-medical-primary/80">
            You have 12 active dispatches and 3 pending assignments
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
            className="border-medical-secondary text-medical-secondary hover:bg-medical-secondary/10 transition-all duration-300"
            size="sm"
          >
            <Ambulance className="mr-2 h-4 w-4" />
            Dispatch Control
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate("/routes")}
            className="border-medical-secondary text-medical-secondary hover:bg-medical-secondary/10 transition-all duration-300"
            size="sm"
          >
            <MapPin className="mr-2 h-4 w-4" />
            Manage Routes
          </Button>
        </div>
      </div>
    </div>
  );
}