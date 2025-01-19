import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Brain, MapPin, Clock, AlertTriangle } from "lucide-react";
import { Link } from "react-router-dom";

interface DispatchItemProps {
  id: string;
  activationTime: string;
  patient: {
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
  eta: string;
  comments?: string;
  progress?: number;
  elapsedTime?: string;
  efficiency?: number;
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
  comments,
  progress,
  efficiency,
}: DispatchItemProps) {
  const priorityColor = {
    high: "destructive",
    medium: "default",
    low: "secondary",
  } as const;

  return (
    <Card className="p-4">
      <div className="flex justify-between items-start mb-4">
        <div className="space-y-1">
          <Link 
            to={`/dispatch/${id}`} 
            className="text-lg font-semibold text-medical-primary hover:text-medical-secondary transition-colors"
          >
            Dispatch #{id}
          </Link>
          <p className="text-sm text-gray-500">{patient.name}</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={priorityColor[priority as keyof typeof priorityColor]}>
            {priority}
          </Badge>
          {assignedTo !== "Unassigned" && (
            <Badge variant="outline">{assignedTo}</Badge>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-gray-500" />
          <span className="text-sm text-gray-600">{origin} to {destination}</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-gray-500" />
          <span className="text-sm text-gray-600">ETA: {eta}</span>
        </div>
      </div>

      {comments && (
        <div className="mt-2">
          <AlertTriangle className="h-4 w-4 text-yellow-500 inline" />
          <span className="text-sm text-gray-600">{comments}</span>
        </div>
      )}

      {progress !== undefined && (
        <Progress value={progress} className="mt-4" />
      )}
    </Card>
  );
}
