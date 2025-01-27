import { Brain, AlertTriangle, CheckCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { AIAnalysisResult } from "@/utils/aiAnalysis";

interface AIInsightPanelProps {
  analysis: AIAnalysisResult;
  className?: string;
}

export function AIInsightPanel({ analysis, className }: AIInsightPanelProps) {
  const confidenceColor = analysis.confidence > 0.8 ? "text-green-500" : 
                         analysis.confidence > 0.6 ? "text-yellow-500" : 
                         "text-red-500";

  return (
    <Card className={`p-4 space-y-4 bg-white/10 backdrop-blur-md border-medical-secondary/20 ${className}`}>
      <div className="flex items-center gap-2">
        <Brain className="h-5 w-5 text-medical-primary" />
        <h3 className="font-semibold text-lg">AI Insights</h3>
        <Badge variant="outline" className={`ml-auto ${confidenceColor}`}>
          {Math.round(analysis.confidence * 100)}% confidence
        </Badge>
      </div>

      {analysis.warnings.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-medium text-yellow-500 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            Warnings
          </h4>
          <ul className="space-y-1">
            {analysis.warnings.map((warning, index) => (
              <li key={index} className="text-sm text-yellow-600">
                {warning}
              </li>
            ))}
          </ul>
        </div>
      )}

      {analysis.suggestions.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-medium text-green-500 flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            Suggestions
          </h4>
          <ul className="space-y-1">
            {analysis.suggestions.map((suggestion, index) => (
              <li key={index} className="text-sm text-green-600">
                {suggestion}
              </li>
            ))}
          </ul>
        </div>
      )}

      {analysis.prediction && (
        <div className="mt-4 p-3 bg-medical-primary/5 rounded-lg">
          <p className="text-sm text-medical-primary">{analysis.prediction}</p>
        </div>
      )}
    </Card>
  );
}