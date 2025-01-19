import { Package, Car, MapPin, Ambulance, Flag, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type DispatchStatus = "dispatch" | "enroute" | "onscene" | "transporting" | "destination" | "available";

interface DispatchStatusBarProps {
  currentStatus: DispatchStatus;
  onStatusChange: (status: DispatchStatus) => void;
}

const statusConfig = [
  { id: "dispatch", label: "Dispatch", icon: Package, color: "bg-gray-500 hover:bg-gray-600" },
  { id: "enroute", label: "En Route", icon: Car, color: "bg-yellow-500 hover:bg-yellow-600" },
  { id: "onscene", label: "On Scene", icon: MapPin, color: "bg-green-500 hover:bg-green-600" },
  { id: "transporting", label: "Transporting", icon: Ambulance, color: "bg-blue-500 hover:bg-blue-600" },
  { id: "destination", label: "At Destination", icon: Flag, color: "bg-orange-500 hover:bg-orange-600" },
  { id: "available", label: "Available", icon: CheckCircle, color: "bg-emerald-500 hover:bg-emerald-600" },
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
                isActive && status.color,
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
                    (isActive || isPast) ? status.color.split(' ')[0] : "bg-gray-200"
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