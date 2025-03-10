
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CircleCheck, AlertTriangle, Brain, Zap, TrendingUp, FileSpreadsheet } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { AIRecommendation } from "@/types/ai";

export function HRAIRecommendations() {
  const [isLoading, setIsLoading] = useState(true);
  const [recommendations, setRecommendations] = useState<AIRecommendation[]>([]);

  useEffect(() => {
    // Simulate loading AI recommendations
    const timer = setTimeout(() => {
      setRecommendations([
        {
          recommendation: "3 employees need certification renewal in the next 30 days",
          confidence: 0.98,
          source: "certification_tracking",
          context: "EMT-B, Paramedic certifications expiring soon",
          timestamp: new Date().toISOString()
        },
        {
          recommendation: "Staffing shortage predicted for next weekend based on historical patterns",
          confidence: 0.87,
          source: "shift_analysis",
          context: "Weekend shifts historically understaffed by 15%",
          timestamp: new Date().toISOString()
        },
        {
          recommendation: "Employee training completion rate decreased by 12% this month",
          confidence: 0.91,
          source: "training_metrics",
          context: "Compliance risk identified",
          timestamp: new Date().toISOString()
        }
      ]);
      setIsLoading(false);
    }, 1200);

    return () => clearTimeout(timer);
  }, []);

  const handleRecommendationAction = (index: number) => {
    toast({
      title: "Action taken",
      description: `You've acknowledged the recommendation: ${recommendations[index].recommendation}`,
    });
  };

  return (
    <Card className="bg-gradient-to-br from-white to-indigo-50 border border-indigo-100">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center">
          <Brain className="mr-2 h-5 w-5 text-indigo-600" />
          AI Insights & Recommendations
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        ) : (
          <div className="space-y-3">
            {recommendations.map((rec, index) => (
              <div key={index} className="flex items-start p-2 bg-white rounded-md border border-indigo-100 shadow-sm">
                <div className={`p-2 rounded-full mr-3 ${rec.confidence > 0.9 ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                  {rec.confidence > 0.9 ? <CircleCheck className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <p className="font-medium text-sm">{rec.recommendation}</p>
                    <Badge variant="outline" className="ml-2 text-xs">
                      {Math.round(rec.confidence * 100)}% confidence
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{rec.context}</p>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="ml-2 text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50"
                  onClick={() => handleRecommendationAction(index)}
                >
                  Act
                </Button>
              </div>
            ))}
            <Button variant="outline" className="w-full mt-2 text-indigo-700 border-indigo-200 hover:bg-indigo-50">
              View All Insights
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
