
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, Clock, TrendingUp } from "lucide-react";
import { useState, useEffect } from "react";

interface DispatchStatusAlertProps {
  unassignedCount: number;
  assignedCount: number;
}

export function DispatchStatusAlert({ unassignedCount, assignedCount }: DispatchStatusAlertProps) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isHighDemand, setIsHighDemand] = useState(false);
  
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
      
      // Simulate high demand periods (8-10 AM and 4-6 PM)
      const hour = new Date().getHours();
      setIsHighDemand((hour >= 8 && hour <= 10) || (hour >= 16 && hour <= 18));
    }, 60000);
    
    return () => clearInterval(timer);
  }, []);
  
  return (
    <div className="space-y-3">
      <Alert className="mb-2 bg-medical-highlight border-medical-secondary/20">
        <AlertTriangle className="h-4 w-4 text-medical-secondary" />
        <AlertDescription className="text-medical-primary flex items-center justify-between">
          <span>
            {unassignedCount} dispatches waiting for assignment. 
            {assignedCount > 0 && ` ${assignedCount} active transports progressing normally.`}
          </span>
          {isHighDemand && (
            <span className="flex items-center text-amber-600 text-sm font-medium">
              <TrendingUp className="h-3 w-3 mr-1" />
              High demand period
            </span>
          )}
        </AlertDescription>
      </Alert>
      
      <div className="flex items-center justify-between px-3 py-2 text-xs text-medical-primary/70 bg-medical-accent/10 rounded-md">
        <span className="flex items-center">
          <Clock className="h-3 w-3 mr-1" />
          System time: {currentTime.toLocaleTimeString()}
        </span>
        <span>
          Average dispatch response: {unassignedCount > 5 ? '12-15 min' : '8-10 min'}
        </span>
      </div>
    </div>
  );
}
