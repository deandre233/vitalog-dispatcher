
import { Package, Car, MapPin, Ambulance, Flag, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export type DispatchStatus = "dispatch" | "enroute" | "onscene" | "transporting" | "destination" | "available" | "canceled";

interface DispatchStatusBarProps {
  currentStatus: DispatchStatus;
  onStatusChange: (status: DispatchStatus) => void;
}

const statusConfig = [
  { 
    id: "dispatch", 
    label: "Dispatch", 
    icon: Package, 
    color: "bg-blue-500 hover:bg-blue-600",
    progressColor: "bg-blue-500",
    shadow: "shadow-blue-200",
    description: "Initial dispatch assigned"
  },
  { 
    id: "enroute", 
    label: "En Route", 
    icon: Car, 
    color: "bg-indigo-500 hover:bg-indigo-600",
    progressColor: "bg-indigo-500",
    shadow: "shadow-indigo-200",
    description: "Crew traveling to pickup"
  },
  { 
    id: "onscene", 
    label: "On Scene", 
    icon: MapPin, 
    color: "bg-violet-500 hover:bg-violet-600",
    progressColor: "bg-violet-500",
    shadow: "shadow-violet-200",
    description: "Arrived at pickup location"
  },
  { 
    id: "transporting", 
    label: "Transporting", 
    icon: Ambulance, 
    color: "bg-orange-500 hover:bg-orange-600",
    progressColor: "bg-orange-500",
    shadow: "shadow-orange-200",
    description: "Patient in transport"
  },
  { 
    id: "destination", 
    label: "At Destination", 
    icon: Flag, 
    color: "bg-yellow-500 hover:bg-yellow-600",
    progressColor: "bg-yellow-500",
    shadow: "shadow-yellow-200",
    description: "Arrived at destination"
  },
  { 
    id: "available", 
    label: "Available", 
    icon: CheckCircle, 
    color: "bg-emerald-500 hover:bg-emerald-600",
    progressColor: "bg-emerald-500",
    shadow: "shadow-emerald-200",
    description: "Transport completed"
  },
  { 
    id: "canceled", 
    label: "Canceled", 
    icon: XCircle, 
    color: "bg-red-500 hover:bg-red-600",
    progressColor: "bg-red-500",
    shadow: "shadow-red-200",
    description: "Transport canceled"
  },
] as const;

export function DispatchStatusBar({ currentStatus, onStatusChange }: DispatchStatusBarProps) {
  const getStatusIndex = (status: DispatchStatus) => {
    return statusConfig.findIndex(s => s.id === status);
  };

  const currentStatusData = statusConfig.find(s => s.id === currentStatus);

  return (
    <Card className="border border-gray-200 shadow-sm">
      <CardHeader className="pb-2 pt-4 px-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full animate-pulse ${currentStatusData?.progressColor}`}></div>
            <h3 className="font-medium text-gray-800 text-sm">
              Current Status: <span className="font-semibold text-blue-700">{currentStatusData?.label}</span>
            </h3>
          </div>
          <div className="text-xs text-gray-500">{currentStatusData?.description}</div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-3 pb-4 px-4">
        <div className="flex flex-wrap gap-1.5 items-center justify-center">
          {statusConfig.map((status) => {
            const isActive = currentStatus === status.id;
            const isPast = getStatusIndex(currentStatus) > getStatusIndex(status.id as DispatchStatus);
            const Icon = status.icon;
            
            return (
              <Button
                key={status.id}
                variant={isActive ? "default" : isPast ? "secondary" : "outline"}
                size="sm"
                onClick={() => onStatusChange(status.id as DispatchStatus)}
                className={cn(
                  "transition-all duration-300 min-w-24 h-8",
                  isActive && `${status.color} ${status.shadow} shadow-md`,
                  isPast && "bg-gray-100 text-gray-700"
                )}
              >
                <Icon className={`w-3.5 h-3.5 mr-1 ${isActive ? "animate-pulse" : ""}`} />
                {status.label}
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
