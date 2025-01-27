import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Brain, TrendingUp, AlertTriangle } from "lucide-react";

interface PartnerInsight {
  type: "recommendation" | "alert" | "trend";
  message: string;
  priority: "low" | "medium" | "high";
}

export const PartnerInsights = () => {
  const [insights, setInsights] = useState<PartnerInsight[]>([]);

  useEffect(() => {
    // In a real application, this would fetch from an AI service
    setInsights([
      {
        type: "recommendation",
        message: "Consider expanding partnership with high-performing partners in the Atlanta region",
        priority: "high",
      },
      {
        type: "alert",
        message: "3 partners have contracts expiring in the next 30 days",
        priority: "medium",
      },
      {
        type: "trend",
        message: "Partner satisfaction scores have improved by 15% this quarter",
        priority: "low",
      },
    ]);
  }, []);

  const getIcon = (type: PartnerInsight["type"]) => {
    switch (type) {
      case "recommendation":
        return <Brain className="h-5 w-5 text-blue-500" />;
      case "alert":
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case "trend":
        return <TrendingUp className="h-5 w-5 text-green-500" />;
    }
  };

  return (
    <Card className="p-4 space-y-4">
      <h3 className="text-lg font-semibold">AI Insights</h3>
      <div className="space-y-3">
        {insights.map((insight, index) => (
          <div
            key={index}
            className="flex items-start space-x-3 p-3 rounded-lg bg-gray-50"
          >
            {getIcon(insight.type)}
            <p className="text-sm text-gray-600">{insight.message}</p>
          </div>
        ))}
      </div>
    </Card>
  );
};