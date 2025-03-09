
import { AlertTriangle } from "lucide-react";

interface DispatchWarningsProps {
  warnings?: string;
}

export function DispatchWarnings({ warnings }: DispatchWarningsProps) {
  if (!warnings) return null;
  
  return (
    <div className="flex items-center gap-2 text-yellow-600 bg-yellow-50 p-2 rounded">
      <AlertTriangle className="h-4 w-4" />
      <span className="text-sm">{warnings}</span>
    </div>
  );
}
