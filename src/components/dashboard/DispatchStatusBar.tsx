
import { Package, Car, MapPin, Ambulance, Flag, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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
    <div className="space-y-4">
      {/* Current status indicator */}
      <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-3 rounded-lg border border-blue-100">
        <div className="flex items-center gap-2 mb-2">
          <div className={`w-3 h-3 rounded-full animate-pulse ${currentStatusData?.progressColor}`}></div>
          <h3 className="font-medium text-gray-800">Current Status: <span className="font-semibold text-blue-700">{currentStatusData?.label}</span></h3>
        </div>
        <p className="text-sm text-gray-600 ml-5">{currentStatusData?.description}</p>
      </div>

      {/* Status progression */}
      <div className="flex items-center justify-between w-full gap-2 p-4 bg-white rounded-lg shadow-sm">
        {statusConfig.map((status) => {
          const isActive = currentStatus === status.id;
          const isPast = getStatusIndex(currentStatus) > getStatusIndex(status.id as DispatchStatus);
          const Icon = status.icon;
          
          return (
            <div key={status.id} className="flex flex-col items-center gap-1 flex-1">
              <Button
                variant={isActive ? "default" : isPast ? "secondary" : "outline"}
                size="sm"
                className={cn(
                  "w-full transition-all duration-300",
                  isActive && `${status.color} ${status.shadow} shadow-md`,
                  isPast && "bg-gray-100 text-gray-700"
                )}
                onClick={() => onStatusChange(status.id as DispatchStatus)}
              >
                <Icon className={`w-4 h-4 mr-1 ${isActive ? "animate-pulse" : ""}`} />
                {status.label}
              </Button>
              {status.id !== "available" && status.id !== "canceled" && (
                <div className="w-full h-1 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className={cn(
                      "h-full transition-all duration-500 rounded-full",
                      (isActive || isPast) ? status.progressColor : "bg-gray-200"
                    )}
                    style={{
                      width: isPast ? "100%" : isActive ? "50%" : "0%"
                    }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
