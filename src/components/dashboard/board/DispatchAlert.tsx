
import { AlertTriangle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";

interface DispatchAlertProps {
  unassignedCount: number;
  assignedCount: number;
}

export function DispatchAlert({ unassignedCount, assignedCount }: DispatchAlertProps) {
  return (
    <Alert className="mb-4 glass-panel border-purple-500/20 bg-purple-950/30">
      <AlertTriangle className="h-4 w-4 text-purple-400" />
      <AlertDescription className="text-white flex items-center justify-between w-full">
        <span>
          {unassignedCount} dispatches waiting for assignment. 
          {assignedCount > 0 && ` ${assignedCount} active transports progressing normally.`}
        </span>
        <div className="flex gap-2">
          {unassignedCount > 0 && (
            <Badge className="bg-red-900/50 text-red-200 hover:bg-red-900/70">
              {unassignedCount} Unassigned
            </Badge>
          )}
          {assignedCount > 0 && (
            <Badge className="bg-green-900/50 text-green-200 hover:bg-green-900/70">
              {assignedCount} Active
            </Badge>
          )}
        </div>
      </AlertDescription>
    </Alert>
  );
}
