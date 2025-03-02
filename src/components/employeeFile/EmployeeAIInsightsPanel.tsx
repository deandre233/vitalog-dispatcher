
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RefreshCw, Lightbulb, Trophy, AlertTriangle } from "lucide-react";
import { useAIEmployeeAnalysis } from "@/hooks/useAIEmployeeAnalysis";
import type { AIAnalysisResult } from "@/types/dispatch";

interface EmployeeAIInsightsPanelProps {
  employeeId: string;
  analysis?: AIAnalysisResult;
}

export const EmployeeAIInsightsPanel: React.FC<EmployeeAIInsightsPanelProps> = ({
  employeeId,
  analysis
}) => {
  const handleRegenerateAnalysis = () => {
    // This would trigger a new analysis in a real implementation
    console.log("Regenerating analysis for employee", employeeId);
  };

  return (
    <Card className="mt-6">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl flex items-center">
            <Lightbulb className="h-5 w-5 mr-2 text-amber-500" />
            AI Insights & Recommendations
          </CardTitle>
          <Button size="sm" variant="outline" onClick={handleRegenerateAnalysis}>
            <RefreshCw className="h-4 w-4 mr-2" /> Refresh Analysis
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-700">Strengths</h3>
            <div className="bg-green-50 p-4 rounded-md">
              <div className="flex items-start gap-2">
                <Trophy className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-gray-900">Demonstrates excellent patient care and attention to detail.</p>
                  <p className="text-sm text-gray-600 mt-1">Based on patient feedback and incident reports.</p>
                </div>
              </div>
            </div>
            <div className="bg-green-50 p-4 rounded-md">
              <div className="flex items-start gap-2">
                <Trophy className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-gray-900">Consistently arrives on time and completes shifts without issues.</p>
                  <p className="text-sm text-gray-600 mt-1">Based on 98% on-time arrival rate over the past 6 months.</p>
                </div>
              </div>
            </div>
            
            <h3 className="font-semibold text-gray-700 mt-6">Training Recommendations</h3>
            <div className="space-y-2">
              {analysis?.training_needs?.map((training, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Recommended</Badge>
                  <span>{training}</span>
                </div>
              ))}
              {(!analysis?.training_needs || analysis.training_needs.length === 0) && (
                <p className="text-gray-500 italic">No specific training needs identified at this time.</p>
              )}
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-700">Areas for Improvement</h3>
            <div className="bg-amber-50 p-4 rounded-md">
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-gray-900">Documentation could be more thorough on complex cases.</p>
                  <p className="text-sm text-gray-600 mt-1">Based on QA reports from the last quarter.</p>
                </div>
              </div>
            </div>
            
            <h3 className="font-semibold text-gray-700 mt-6">Performance Insights</h3>
            <div className="bg-gray-50 p-4 rounded-md">
              <p className="text-gray-700">{analysis?.performance_insights || "No performance insights available at this time."}</p>
            </div>
            
            <h3 className="font-semibold text-gray-700 mt-6">Growth Opportunities</h3>
            <div className="space-y-2">
              {analysis?.growth_opportunities?.map((opportunity, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">Opportunity</Badge>
                  <span>{opportunity}</span>
                </div>
              ))}
              {(!analysis?.growth_opportunities || analysis.growth_opportunities.length === 0) && (
                <p className="text-gray-500 italic">No specific growth opportunities identified at this time.</p>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
