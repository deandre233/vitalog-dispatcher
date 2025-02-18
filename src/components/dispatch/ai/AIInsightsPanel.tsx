
import { Card } from "@/components/ui/card";
import { Brain, TrendingUp, AlertTriangle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface AIInsightsPanelProps {
  insights: {
    recommendation: string;
    confidence: number;
    impact: "high" | "medium" | "low";
    timeEstimate: string;
  }[];
}

export function AIInsightsPanel({ insights }: AIInsightsPanelProps) {
  return (
    <Card className="p-4 bg-black/5 backdrop-blur-lg border-none">
      <div className="flex items-center gap-2 mb-4">
        <Brain className="w-5 h-5 text-purple-500" />
        <h3 className="text-lg font-semibold">AI Dispatch Insights</h3>
      </div>
      
      <div className="space-y-4">
        {insights.map((insight, index) => (
          <Card key={index} className="p-3 bg-white/50 backdrop-blur border-none hover:bg-white/60 transition-all">
            <div className="flex items-start gap-3">
              {insight.impact === "high" && <AlertTriangle className="w-5 h-5 text-red-500 shrink-0" />}
              {insight.impact === "medium" && <TrendingUp className="w-5 h-5 text-yellow-500 shrink-0" />}
              {insight.impact === "low" && <Clock className="w-5 h-5 text-blue-500 shrink-0" />}
              
              <div className="flex-1">
                <p className="text-sm text-gray-700">{insight.recommendation}</p>
                <div className="flex items-center gap-4 mt-2">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <div className="flex items-center gap-1">
                          <div className="h-2 w-16 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-purple-500" 
                              style={{ width: `${insight.confidence}%` }}
                            />
                          </div>
                          <span className="text-xs text-gray-500">{insight.confidence}%</span>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>AI Confidence Score</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  
                  <span className="text-xs text-gray-500">Est. Time: {insight.timeEstimate}</span>
                </div>
              </div>
              
              <Button variant="ghost" size="sm" className="shrink-0">
                Apply
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </Card>
  );
}
