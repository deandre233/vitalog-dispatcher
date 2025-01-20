import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, CheckCircle, XCircle, TrendingUp, Shield } from "lucide-react";
import type { InsuranceAnalysis } from "@/hooks/useInsuranceAnalysis";
import { cn } from "@/lib/utils";

interface InsuranceAnalysisCardProps {
  analysis: InsuranceAnalysis;
  className?: string;
}

export function InsuranceAnalysisCard({ analysis, className }: InsuranceAnalysisCardProps) {
  const getValidationIcon = () => {
    switch (analysis.validation.status) {
      case 'valid':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'incomplete':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'invalid':
        return <XCircle className="h-5 w-5 text-red-500" />;
    }
  };

  const getValidationColor = () => {
    switch (analysis.validation.status) {
      case 'valid':
        return 'bg-green-50 border-green-200';
      case 'incomplete':
        return 'bg-yellow-50 border-yellow-200';
      case 'invalid':
        return 'bg-red-50 border-red-200';
    }
  };

  return (
    <Card className={cn("p-6", className)}>
      <div className="space-y-6">
        <div className={cn("p-4 rounded-lg border", getValidationColor())}>
          <div className="flex items-center gap-2 mb-2">
            {getValidationIcon()}
            <h3 className="font-semibold capitalize">
              Insurance Status: {analysis.validation.status}
            </h3>
          </div>
          {analysis.validation.issues.length > 0 && (
            <ul className="list-disc list-inside space-y-1">
              {analysis.validation.issues.map((issue, i) => (
                <li key={i} className="text-sm text-gray-600">{issue}</li>
              ))}
            </ul>
          )}
        </div>

        {analysis.suggestions.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-blue-500" />
              Suggestions
            </h4>
            <ul className="space-y-1">
              {analysis.suggestions.map((suggestion, i) => (
                <li key={i} className="text-sm text-gray-600">{suggestion}</li>
              ))}
            </ul>
          </div>
        )}

        {analysis.coverage_gaps.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-yellow-500" />
              Coverage Gaps
            </h4>
            <ul className="space-y-1">
              {analysis.coverage_gaps.map((gap, i) => (
                <li key={i} className="text-sm text-gray-600">{gap}</li>
              ))}
            </ul>
          </div>
        )}

        {analysis.optimization.recommendations.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-500" />
              Optimization Recommendations
            </h4>
            <div className="space-y-2">
              <ul className="space-y-1">
                {analysis.optimization.recommendations.map((rec, i) => (
                  <li key={i} className="text-sm text-gray-600">{rec}</li>
                ))}
              </ul>
              {analysis.optimization.potential_savings && (
                <Badge variant="outline" className="bg-green-50">
                  Potential Savings: {analysis.optimization.potential_savings}
                </Badge>
              )}
            </div>
          </div>
        )}

        {analysis.compliance.flags.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium flex items-center gap-2">
              <Shield className="h-4 w-4 text-purple-500" />
              Compliance Flags
            </h4>
            <ul className="space-y-1">
              {analysis.compliance.flags.map((flag, i) => (
                <li key={i} className="text-sm text-gray-600">{flag}</li>
              ))}
            </ul>
            {analysis.compliance.required_actions.length > 0 && (
              <div className="mt-2">
                <h5 className="text-sm font-medium mb-1">Required Actions:</h5>
                <ul className="list-disc list-inside space-y-1">
                  {analysis.compliance.required_actions.map((action, i) => (
                    <li key={i} className="text-sm text-gray-600">{action}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}