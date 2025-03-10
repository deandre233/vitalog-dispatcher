
import { AlertTriangle, AlertCircle } from "lucide-react";

interface DispatchWarningsProps {
  warnings?: string;
}

export function DispatchWarnings({ warnings }: DispatchWarningsProps) {
  if (!warnings) return null;
  
  const isHighSeverity = warnings.toLowerCase().includes("critical") || 
                          warnings.toLowerCase().includes("emergency") ||
                          warnings.toLowerCase().includes("urgent");
  
  return (
    <div className={`
      flex items-center gap-3 p-3 rounded-md
      ${isHighSeverity 
        ? "bg-red-50 border border-red-100 text-red-700" 
        : "bg-yellow-50 border border-yellow-100 text-yellow-700"}
    `}>
      {isHighSeverity 
        ? <AlertCircle className="h-5 w-5 text-red-500" /> 
        : <AlertTriangle className="h-5 w-5 text-yellow-500" />
      }
      <div>
        <div className="font-medium text-sm">
          {isHighSeverity ? "Critical Warning" : "Warning"}
        </div>
        <p className="text-sm mt-0.5">{warnings}</p>
      </div>
    </div>
  );
}
