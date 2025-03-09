
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { MetricCardProps } from "../types/performanceTypes";

export function MetricCard({ metric, getScoreColor }: MetricCardProps) {
  const getTrendBadge = (trend: string) => {
    if (trend.includes("Improved")) {
      return <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300 ml-2">{trend}</Badge>;
    } else if (trend.includes("Declined")) {
      return <Badge variant="destructive" className="ml-2">{trend}</Badge>;
    } else {
      return <Badge variant="outline" className="ml-2">{trend}</Badge>;
    }
  };

  return (
    <div className="flex-1 bg-accent/40 rounded-lg p-6">
      <div className="flex items-center gap-3 mb-4">
        {metric.icon}
        <h3 className="text-xl font-semibold">{metric.category}</h3>
      </div>
      
      <div className="space-y-6">
        <div>
          <div className="flex justify-between mb-2">
            <span className="font-medium">Performance Score</span>
            <span className={`font-bold ${getScoreColor(metric.score)}`}>{metric.score}/100</span>
          </div>
          <Progress value={metric.score} className="h-2.5" />
        </div>
        
        <div className="grid grid-cols-1 gap-4">
          <div className="bg-background rounded-md p-4">
            <h4 className="font-medium mb-2">Performance Trend</h4>
            <div className="flex items-center">
              <span className="text-muted-foreground">{metric.trend}</span>
            </div>
          </div>
          
          <div className="bg-background rounded-md p-4">
            <h4 className="font-medium mb-2">Department Comparison</h4>
            <div className="flex items-center space-x-2">
              <span className="text-muted-foreground">Department Average:</span>
              <span className={getScoreColor(metric.departmentAvg)}>{metric.departmentAvg}/100</span>
              <span className="text-muted-foreground mx-2">|</span>
              <span className="text-muted-foreground">Your Performance:</span>
              <span className={`font-semibold ${getScoreColor(metric.score)}`}>
                {metric.score > metric.departmentAvg 
                  ? `${metric.score - metric.departmentAvg}% above avg` 
                  : `${metric.departmentAvg - metric.score}% below avg`}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
