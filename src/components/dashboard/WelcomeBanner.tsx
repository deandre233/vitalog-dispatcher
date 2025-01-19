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
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            {getGreeting()}, Dispatcher
          </h1>
          <p className="mt-1 text-gray-600">
            You have 12 active dispatches and 3 pending assignments
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button
            onClick={() => navigate("/dispatch/new")}
            className="bg-medical-primary hover:bg-medical-primary/90"
          >
            <Plus className="mr-2 h-4 w-4" />
            New Dispatch
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate("/dispatch")}
            className="border-medical-primary text-medical-primary hover:bg-medical-primary/10"
          >
            <Ambulance className="mr-2 h-4 w-4" />
            View Active
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate("/routes")}
            className="border-medical-primary text-medical-primary hover:bg-medical-primary/10"
          >
            <MapPin className="mr-2 h-4 w-4" />
            Manage Routes
          </Button>
        </div>
      </div>
    </div>
  );
};