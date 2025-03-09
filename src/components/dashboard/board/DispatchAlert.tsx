
import { AlertTriangle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";

interface DispatchAlertProps {
  unassignedCount: number;
  assignedCount: number;
}

export function DispatchAlert({ unassignedCount, assignedCount }: DispatchAlertProps) {
  return (
    <Alert className="mb-4 glass-panel border-purple-500/30 bg-purple-950/30 shadow-sm shadow-purple-500/10">
      <AlertTriangle className="h-4 w-4 text-purple-300" />
      <AlertDescription className="text-white flex items-center justify-between w-full">
        <span className="text-purple-100">
          {unassignedCount} dispatches waiting for assignment. 
          {assignedCount > 0 && ` ${assignedCount} active transports progressing normally.`}
        </span>
        <div className="flex gap-2">
          {unassignedCount > 0 && (
            <Badge className="bg-red-800/60 text-red-100 hover:bg-red-700/70 font-medium">
              {unassignedCount} Unassigned
            </Badge>
          )}
          {assignedCount > 0 && (
            <Badge className="bg-green-800/60 text-green-100 hover:bg-green-700/70 font-medium">
              {assignedCount} Active
            </Badge>
          )}
        </div>
      </AlertDescription>
    </Alert>
  );
}
