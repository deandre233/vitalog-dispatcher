
import { Brain, TrendingUp, Clock } from "lucide-react";

interface AIRecommendations {
  insights?: string[];
  trafficStatus?: {
    congestionLevel: "low" | "medium" | "high";
    estimatedDelay: number;
    alternateRouteAvailable: boolean;
  };
}

interface AIInsightsDisplayProps {
  aiRecommendations: AIRecommendations;
}

export function AIInsightsDisplay({ aiRecommendations }: AIInsightsDisplayProps) {
  if (!aiRecommendations.insights || aiRecommendations.insights.length === 0) return null;
  
  const getInsightIcon = (insight: string) => {
    if (insight.toLowerCase().includes("traffic")) return <TrendingUp className="h-4 w-4 text-emerald-500" />;
    if (insight.toLowerCase().includes("eta") || insight.toLowerCase().includes("time")) return <Clock className="h-4 w-4 text-blue-500" />;
    return <Brain className="h-4 w-4 text-indigo-500" />;
  };
  
  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50/60 p-4 rounded-md border border-blue-100">
      <div className="flex items-center gap-2 mb-3">
        <Brain className="h-5 w-5 text-blue-600" />
        <h4 className="font-medium text-blue-800">AI Insights</h4>
      </div>
      
      <div className="space-y-2">
        {aiRecommendations.insights.map((insight, index) => (
          <div 
            key={index} 
            className="flex items-start gap-3 p-2 bg-white/80 rounded-md border border-blue-50"
          >
            <div className="mt-0.5 flex-shrink-0">
              {getInsightIcon(insight)}
            </div>
            <span className="text-sm text-gray-700">
              {insight}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
