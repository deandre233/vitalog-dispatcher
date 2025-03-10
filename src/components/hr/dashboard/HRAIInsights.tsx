
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SparklesIcon, ArrowRight, AlertTriangle, Lightbulb, TrendingUp } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface AIInsight {
  id: string;
  title: string;
  description: string;
  type: 'info' | 'warning' | 'recommendation';
  confidence: number;
}

export function HRAIInsights() {
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // In a real app, fetch from API
    setTimeout(() => {
      setInsights([
        {
          id: '1',
          title: 'Certification Expiry Alert',
          description: '3 EMTs have certifications expiring in the next 30 days',
          type: 'warning',
          confidence: 0.98
        },
        {
          id: '2',
          title: 'Overtime Optimization',
          description: 'Current schedule has potential overtime conflicts for 2 employees',
          type: 'recommendation',
          confidence: 0.85
        },
        {
          id: '3',
          title: 'Staffing Prediction',
          description: 'Based on historical data, next Monday may require additional staff',
          type: 'info',
          confidence: 0.72
        }
      ]);
      setIsLoading(false);
    }, 1000);
  }, []);

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-amber-500" />;
      case 'recommendation':
        return <Lightbulb className="h-4 w-4 text-blue-500" />;
      case 'info':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      default:
        return <Lightbulb className="h-4 w-4" />;
    }
  };

  const handleInsightAction = (insight: AIInsight) => {
    toast({
      title: "AI Insight Action",
      description: `Taking action on: ${insight.title}`,
    });
  };

  return (
    <Card className="bg-gradient-to-br from-indigo-50 to-violet-50 border-indigo-100">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center text-indigo-800">
          <SparklesIcon className="mr-2 h-5 w-5 text-indigo-600" />
          AI Insights
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            <div className="h-20 bg-white/50 animate-pulse rounded"></div>
            <div className="h-20 bg-white/50 animate-pulse rounded"></div>
          </div>
        ) : (
          <div className="space-y-3">
            {insights.map((insight) => (
              <Card key={insight.id} className="bg-white/80 shadow-sm">
                <CardContent className="p-3">
                  <div className="flex items-start gap-2">
                    <div className="p-1.5 rounded-full bg-indigo-50">
                      {getInsightIcon(insight.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-sm">{insight.title}</h4>
                        <Badge 
                          variant="outline" 
                          className={
                            insight.confidence > 0.9 ? "bg-green-50 text-green-700" :
                            insight.confidence > 0.7 ? "bg-blue-50 text-blue-700" :
                            "bg-amber-50 text-amber-700"
                          }
                        >
                          {Math.round(insight.confidence * 100)}% confidence
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">{insight.description}</p>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="mt-2 h-7 text-xs"
                        onClick={() => handleInsightAction(insight)}
                      >
                        Take Action <ArrowRight className="ml-1 h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
