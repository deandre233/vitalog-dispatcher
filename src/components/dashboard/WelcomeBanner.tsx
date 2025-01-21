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
    <div className="bg-gradient-to-br from-medical-accent to-white rounded-lg shadow-lg border border-medical-secondary/20 p-6 transition-all hover:shadow-xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-medical-primary">
            {getGreeting()}, Dispatcher
          </h1>
          <p className="mt-2 text-medical-primary/80">
            You have 12 active dispatches and 3 pending assignments
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button
            onClick={() => navigate("/dispatch/new")}
            className="bg-medical-secondary hover:bg-medical-secondary/90 text-white transition-colors"
            size="sm"
          >
            <Plus className="mr-2 h-4 w-4" />
            New Dispatch
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate("/dispatch")}
            className="border-medical-secondary text-medical-secondary hover:bg-medical-secondary/10 transition-colors"
            size="sm"
          >
            <Ambulance className="mr-2 h-4 w-4" />
            View Active
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate("/routes")}
            className="border-medical-secondary text-medical-secondary hover:bg-medical-secondary/10 transition-colors"
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