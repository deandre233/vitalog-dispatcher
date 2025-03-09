
interface AIRecommendations {
  insights?: string[];
}

interface AIInsightsDisplayProps {
  aiRecommendations: AIRecommendations;
}

export function AIInsightsDisplay({ aiRecommendations }: AIInsightsDisplayProps) {
  if (!aiRecommendations.insights || aiRecommendations.insights.length === 0) return null;
  
  return (
    <div className="bg-blue-50 p-3 rounded-md">
      <h4 className="font-medium text-blue-900 mb-1">AI Insights:</h4>
      <ul className="list-disc list-inside space-y-1">
        {aiRecommendations.insights.map((insight, index) => (
          <li key={index} className="text-sm text-blue-800">
            {insight}
          </li>
        ))}
      </ul>
    </div>
  );
}
