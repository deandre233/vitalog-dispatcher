import { Card } from "@/components/ui/card";
import { useAIEmployeeAnalysis } from "@/hooks/useAIEmployeeAnalysis";
import { Progress } from "@/components/ui/progress";
import { Brain, TrendingUp, Award, BookOpen } from "lucide-react";
import type { AIAnalysisResult } from "@/types/dispatch";

interface EmployeeAIInsightsProps {
  employeeId: string;
}

export function EmployeeAIInsights({ employeeId }: EmployeeAIInsightsProps) {
  const { analysis, isLoading } = useAIEmployeeAnalysis(employeeId);

  if (isLoading || !analysis) {
    return <div>Loading AI insights...</div>;
  }

  return (
    <Card className="p-6 space-y-6">
      <div className="flex items-center gap-2">
        <Brain className="h-5 w-5 text-medical-secondary" />
        <h3 className="text-lg font-semibold">AI Performance Insights</h3>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm text-muted-foreground">Efficiency Score</label>
          <Progress value={analysis.efficiency_score} className="h-2" />
          <span className="text-sm">{Math.round(analysis.efficiency_score)}%</span>
        </div>

        <div className="space-y-2">
          <label className="text-sm text-muted-foreground">Communication</label>
          <Progress value={analysis.communication_score} className="h-2" />
          <span className="text-sm">{Math.round(analysis.communication_score)}%</span>
        </div>

        <div className="space-y-2">
          <label className="text-sm text-muted-foreground">Teamwork</label>
          <Progress value={analysis.teamwork_score} className="h-2" />
          <span className="text-sm">{Math.round(analysis.teamwork_score)}%</span>
        </div>

        <div className="space-y-2">
          <label className="text-sm text-muted-foreground">Technical Skills</label>
          <Progress value={analysis.technical_skills} className="h-2" />
          <span className="text-sm">{Math.round(analysis.technical_skills)}%</span>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-medical-secondary" />
          <h4 className="font-medium">Growth Opportunities</h4>
        </div>
        <ul className="list-disc list-inside space-y-1 text-sm">
          {analysis.growth_opportunities.map((opportunity, index) => (
            <li key={index}>{opportunity}</li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <BookOpen className="h-4 w-4 text-medical-secondary" />
          <h4 className="font-medium">Training Needs</h4>
        </div>
        <ul className="list-disc list-inside space-y-1 text-sm">
          {analysis.training_needs.map((need, index) => (
            <li key={index}>{need}</li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <Award className="h-4 w-4 text-medical-secondary" />
          <h4 className="font-medium">Performance Insights</h4>
        </div>
        <p className="text-sm text-muted-foreground">{analysis.performance_insights}</p>
      </div>
    </Card>
  );
}