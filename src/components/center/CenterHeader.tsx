
import { Building2, Brain } from "lucide-react";

export function CenterHeader() {
  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-2">
        <Building2 className="h-6 w-6 text-medical-primary" />
        <h1 className="text-2xl font-bold text-medical-primary">Medical Centers</h1>
      </div>
      <div className="flex items-center gap-2">
        <Brain className="h-5 w-5 text-blue-500" />
        <span className="text-sm text-gray-600">AI-Powered Insights Active</span>
      </div>
    </div>
  );
}
