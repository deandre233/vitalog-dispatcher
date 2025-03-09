
import { AlertTriangle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";

interface DispatchAlertProps {
  unassignedCount: number;
  assignedCount: number;
}

export function DispatchAlert({ unassignedCount, assignedCount }: DispatchAlertProps) {
  return (
    <Alert className="mb-4 glass-panel border-purple-500/40 bg-purple-950/40 shadow-md shadow-purple-500/20">
      <AlertTriangle className="h-5 w-5 text-purple-300" />
      <AlertDescription className="text-white flex items-center justify-between w-full">
        <span className="text-purple-100 font-medium">
          {unassignedCount} dispatches waiting for assignment. 
          {assignedCount > 0 && ` ${assignedCount} active transports progressing normally.`}
        </span>
        <div className="flex gap-2">
          {unassignedCount > 0 && (
            <Badge className="bg-red-800/80 text-red-100 hover:bg-red-700/90 font-bold border border-red-500/40 px-3 py-1">
              {unassignedCount} Unassigned
            </Badge>
          )}
          {assignedCount > 0 && (
            <Badge className="bg-green-800/80 text-green-100 hover:bg-green-700/90 font-bold border border-green-500/40 px-3 py-1">
              {assignedCount} Active
            </Badge>
          )}
        </div>
      </AlertDescription>
    </Alert>
  );
}
