import { MapPin, Clock, Ambulance, User, Building } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { recommendCrew, calculateDistance } from "@/utils/crewRecommendation";
import { useState, useEffect } from "react";
import { CrewAssignmentModal } from "./CrewAssignmentModal";

interface AIRecommendations {
  route: string;
  crew: string;
  billing: string;
}

interface DispatchItemProps {
  id: string;
  activationTime: string;
  assignedTo: string;
  patient: string;
  serviceType: string;
  origin: string;
  destination: string;
  status: string;
  priority: string;
  aiRecommendations: AIRecommendations;
  eta: string;
}

export function DispatchItem({
  id,
  activationTime,
  assignedTo,
  patient,
  serviceType,
  origin,
  destination,
  status,
  priority,
  aiRecommendations,
  eta: initialEta,
}: DispatchItemProps) {
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [eta, setEta] = useState(initialEta);
  const [assignedCrew, setAssignedCrew] = useState<number | null>(null);

  // Mock coordinates for demonstration
  const mockDispatch = {
    id: parseInt(id), // Convert string id to number
    origin: { lat: 33.7720, lng: -84.3960 },
    destination: { lat: 33.7890, lng: -84.3920 },
    serviceType,
  };

  const recommendedCrew = recommendCrew(mockDispatch);
  const crewRecommendation = recommendedCrew
    ? `Recommended: ${recommendedCrew.name} (${calculateDistance(recommendedCrew.location, mockDispatch.origin).toFixed(2)}km away)`
    : "No crew available";

  const handleCrewAssign = (crewId: number, estimatedMinutes: number) => {
    setAssignedCrew(crewId);
    setEta(`${estimatedMinutes} min`);
  };

  // Simulate real-time ETA updates
  useEffect(() => {
    if (assignedCrew && status === "En Route") {
      const interval = setInterval(() => {
        // This is a mock update - in a real application, you would fetch the actual ETA
        setEta((currentEta) => {
          const minutes = parseInt(currentEta);
          if (isNaN(minutes) || minutes <= 1) return "1 min";
          return `${minutes - 1} min`;
        });
      }, 60000); // Update every minute

      return () => clearInterval(interval);
    }
  }, [assignedCrew, status]);

  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center justify-between p-4 bg-white border rounded-lg hover:bg-medical-accent transition-colors">
              <div className="flex items-center gap-6">
                <div
                  className={`p-2 rounded-full ${
                    priority === "high"
                      ? "bg-red-100"
                      : priority === "medium"
                      ? "bg-yellow-100"
                      : "bg-green-100"
                  }`}
                >
                  <Ambulance
                    className={`w-5 h-5 ${
                      priority === "high"
                        ? "text-red-500"
                        : priority === "medium"
                        ? "text-yellow-500"
                        : "text-green-500"
                    }`}
                  />
                </div>
                <div className="space-y-1">
                  <div className="font-medium text-medical-primary">{id}</div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Clock className="w-4 h-4" />
                    <span>{activationTime}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <User className="w-4 h-4" />
                    <span>{assignedTo}</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="font-medium">{patient}</div>
                  <div className="text-sm text-gray-500">{serviceType}</div>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm">
                    <Building className="w-4 h-4 text-gray-500" />
                    <span>{origin}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="w-4 h-4 text-gray-500" />
                    <span>{destination}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-sm font-medium">ETA: {eta}</div>
                {status === "Pending" && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsAssignModalOpen(true)}
                  >
                    Assign Crew
                  </Button>
                )}
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    status === "En Route"
                      ? "bg-blue-100 text-blue-700"
                      : status === "Pending"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-green-100 text-green-700"
                  }`}
                >
                  {status}
                </span>
              </div>
            </div>
          </TooltipTrigger>
          <TooltipContent className="w-64">
            <div className="space-y-2">
              <p className="font-medium">AI Recommendations:</p>
              <p className="text-sm">Route: {aiRecommendations.route}</p>
              <p className="text-sm">Crew: {crewRecommendation}</p>
              <p className="text-sm">Billing: {aiRecommendations.billing}</p>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <CrewAssignmentModal
        isOpen={isAssignModalOpen}
        onClose={() => setIsAssignModalOpen(false)}
        dispatchId={id}
        serviceType={serviceType}
        origin={mockDispatch.origin}
        onAssign={handleCrewAssign}
      />
    </>
  );
}