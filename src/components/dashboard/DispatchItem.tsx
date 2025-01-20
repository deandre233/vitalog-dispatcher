import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Clock, 
  AlertTriangle, 
  ArrowRight, 
  MapPin, 
  User,
  CalendarClock
} from "lucide-react";

interface DispatchItemProps {
  id: string;
  activationTime: string;
  patient: {
    id: string;
    name: string;
    condition?: string;
  };
  serviceType: string;
  origin: string;
  destination: string;
  status: string;
  priority: string;
  assignedTo: string;
  aiRecommendations: {
    route: string;
    crew: string;
    billing: string;
    insights?: string[];
    trafficStatus?: {
      congestionLevel: "low" | "medium" | "high";
      estimatedDelay: number;
      alternateRouteAvailable: boolean;
    };
  };
  eta?: string;
  progress?: number;
  elapsedTime?: string;
}

export function DispatchItem({
  id,
  activationTime,
  patient,
  serviceType,
  origin,
  destination,
  status,
  priority,
  assignedTo,
  aiRecommendations,
  eta,
  progress,
  elapsedTime,
}: DispatchItemProps) {
  const navigate = useNavigate();

  const handlePatientClick = () => {
    navigate(`/patient/${encodeURIComponent(patient.name)}`);
  };

  const handleDispatchClick = () => {
    navigate(`/dispatch/${id}`);
  };

  return (
    <Card className="p-4">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Badge variant={priority === "high" ? "destructive" : "default"}>
              {priority.toUpperCase()}
            </Badge>
            <Badge variant="outline">{serviceType}</Badge>
            {status === "En Route" && (
              <Badge variant="secondary">
                <Clock className="w-3 h-3 mr-1" />
                {elapsedTime}
              </Badge>
            )}
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-gray-500" />
              <button 
                onClick={handlePatientClick}
                className="text-blue-600 hover:underline font-medium"
              >
                {patient.name}
              </button>
            </div>
            {patient.condition && (
              <p className="text-sm text-gray-600">{patient.condition}</p>
            )}
          </div>
        </div>
        <Button variant="ghost" size="sm" onClick={handleDispatchClick}>
          View Details <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-4">
        <div className="flex items-start gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
              <MapPin className="w-4 h-4" /> Origin
            </div>
            <p className="font-medium">{origin}</p>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
              <MapPin className="w-4 h-4" /> Destination
            </div>
            <p className="font-medium">{destination}</p>
          </div>
        </div>

        {progress !== undefined && progress > 0 && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress</span>
              <span>{progress}%</span>
            </div>
            <Progress value={progress} />
          </div>
        )}

        {aiRecommendations.trafficStatus && (
          <div className="flex items-center gap-2 text-sm">
            <AlertTriangle className={`w-4 h-4 ${
              aiRecommendations.trafficStatus.congestionLevel === "high" 
                ? "text-red-500" 
                : aiRecommendations.trafficStatus.congestionLevel === "medium"
                ? "text-yellow-500"
                : "text-green-500"
            }`} />
            <span>
              Traffic: {aiRecommendations.trafficStatus.congestionLevel.toUpperCase()}
              {aiRecommendations.trafficStatus.estimatedDelay > 0 && 
                ` (${aiRecommendations.trafficStatus.estimatedDelay} min delay)`
              }
            </span>
          </div>
        )}

        <div className="flex justify-between items-center text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <CalendarClock className="w-4 h-4" />
            <span>Activated: {new Date(activationTime).toLocaleTimeString()}</span>
          </div>
          {eta && (
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>ETA: {eta}</span>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}