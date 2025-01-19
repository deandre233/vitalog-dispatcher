import { MapPin, Clock, Ambulance, User, Building } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { recommendCrew } from "@/utils/crewRecommendation";

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
  eta,
}: DispatchItemProps) {
  // Mock coordinates for demonstration
  const mockDispatch = {
    id,
    origin: { lat: 33.7720, lng: -84.3960 },
    destination: { lat: 33.7890, lng: -84.3920 },
    serviceType,
  };

  const recommendedCrew = recommendCrew(mockDispatch);
  const crewRecommendation = recommendedCrew
    ? `Recommended: ${recommendedCrew.name} (${recommendedCrew.distance.toFixed(2)}km away)`
    : "No crew available";

  return (
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
  );
}