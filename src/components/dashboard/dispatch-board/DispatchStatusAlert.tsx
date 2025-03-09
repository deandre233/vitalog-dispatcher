
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

interface DispatchStatusAlertProps {
  unassignedCount: number;
  assignedCount: number;
}

export function DispatchStatusAlert({ unassignedCount, assignedCount }: DispatchStatusAlertProps) {
  return (
    <Alert className="mb-4 bg-medical-highlight border-medical-secondary/20">
      <AlertTriangle className="h-4 w-4 text-medical-secondary" />
      <AlertDescription className="text-medical-primary">
        {unassignedCount} dispatches waiting for assignment. 
        {assignedCount > 0 && ` ${assignedCount} active transports progressing normally.`}
      </AlertDescription>
    </Alert>
  );
}
