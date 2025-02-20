import { AlertTriangle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface AIInsightsPanelProps {
  insights: string[];
  error?: string;
}

export function AIInsightsPanel({ insights, error }: AIInsightsPanelProps) {
  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-2">
      <h4 className="font-medium">AI Insights:</h4>
      <ul className="list-disc list-inside space-y-1">
        {insights.map((insight, index) => (
          <li key={index} className="text-sm text-gray-600">
            {insight}
          </li>
        ))}
      </ul>
    </div>
  );
}