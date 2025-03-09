
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
    color: "bg-gray-500 hover:bg-gray-600",
    progressColor: "bg-gray-500",
    shadow: "shadow-gray-200"
  },
  { 
    id: "enroute", 
    label: "En Route", 
    icon: Car, 
    color: "bg-blue-500 hover:bg-blue-600",
    progressColor: "bg-blue-500",
    shadow: "shadow-blue-200"
  },
  { 
    id: "onscene", 
    label: "On Scene", 
    icon: MapPin, 
    color: "bg-green-500 hover:bg-green-600",
    progressColor: "bg-green-500",
    shadow: "shadow-green-200"
  },
  { 
    id: "transporting", 
    label: "Transporting", 
    icon: Ambulance, 
    color: "bg-orange-500 hover:bg-orange-600",
    progressColor: "bg-orange-500",
    shadow: "shadow-orange-200"
  },
  { 
    id: "destination", 
    label: "At Destination", 
    icon: Flag, 
    color: "bg-yellow-500 hover:bg-yellow-600",
    progressColor: "bg-yellow-500",
    shadow: "shadow-yellow-200"
  },
  { 
    id: "available", 
    label: "Available", 
    icon: CheckCircle, 
    color: "bg-emerald-500 hover:bg-emerald-600",
    progressColor: "bg-emerald-500",
    shadow: "shadow-emerald-200"
  },
  { 
    id: "canceled", 
    label: "Canceled", 
    icon: XCircle, 
    color: "bg-red-500 hover:bg-red-600",
    progressColor: "bg-red-500",
    shadow: "shadow-red-200"
  },
] as const;

export function DispatchStatusBar({ currentStatus, onStatusChange }: DispatchStatusBarProps) {
  const getStatusIndex = (status: DispatchStatus) => {
    return statusConfig.findIndex(s => s.id === status);
  };

  return (
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
  );
}
