import { AlertTriangle, Brain, TrendingUp, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AIInsight } from "@/types/service-queue";
import { cn } from "@/lib/utils";

interface AIInsightsPanelProps {
  insights: AIInsight[];
  error?: string;
  className?: string;
}

export function AIInsightsPanel({ insights, error, className }: AIInsightsPanelProps) {
  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  const getInsightIcon = (type: AIInsight['type']) => {
    switch (type) {
      case 'optimization':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'prediction':
        return <Brain className="h-4 w-4 text-blue-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.9) return 'text-green-600';
    if (confidence >= 0.7) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center gap-2 mb-2">
        <Brain className="h-5 w-5 text-blue-500" />
        <h4 className="font-medium text-lg">AI Insights</h4>
      </div>
      <div className="space-y-3">
        {insights.map((insight, index) => (
          <div
            key={index}
            className="p-3 rounded-lg bg-white/50 backdrop-blur-sm border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-start gap-3">
              {getInsightIcon(insight.type)}
              <div className="flex-1">
                <p className="text-sm text-gray-700">{insight.message}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className={cn(
                    "text-xs font-medium",
                    getConfidenceColor(insight.confidence)
                  )}>
                    {Math.round(insight.confidence * 100)}% confidence
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                    {insight.impact} impact
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}