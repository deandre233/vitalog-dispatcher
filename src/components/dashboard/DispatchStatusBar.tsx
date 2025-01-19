import { Package, Car, MapPin, Ambulance, Flag, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type DispatchStatus = "dispatch" | "enroute" | "onscene" | "transporting" | "destination" | "available";

interface DispatchStatusBarProps {
  currentStatus: DispatchStatus;
  onStatusChange: (status: DispatchStatus) => void;
}

const statusConfig = [
  { id: "dispatch", label: "Dispatch", icon: Package },
  { id: "enroute", label: "En Route", icon: Car },
  { id: "onscene", label: "On Scene", icon: MapPin },
  { id: "transporting", label: "Transporting", icon: Ambulance },
  { id: "destination", label: "At Destination", icon: Flag },
  { id: "available", label: "Available", icon: CheckCircle },
] as const;

export function DispatchStatusBar({ currentStatus, onStatusChange }: DispatchStatusBarProps) {
  const getStatusIndex = (status: DispatchStatus) => {
    return statusConfig.findIndex(s => s.id === status);
  };

  return (
    <div className="flex items-center justify-between w-full gap-2 p-2">
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
                "w-full transition-all",
                isActive && "bg-blue-500 hover:bg-blue-600",
                isPast && "bg-gray-200 text-gray-700"
              )}
              onClick={() => onStatusChange(status.id as DispatchStatus)}
            >
              <Icon className="w-4 h-4 mr-1" />
              {status.label}
            </Button>
            {status.id !== "available" && (
              <div className="w-full h-1 bg-gray-200">
                <div 
                  className={cn(
                    "h-full transition-all",
                    (isActive || isPast) ? "bg-blue-500" : "bg-gray-200"
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