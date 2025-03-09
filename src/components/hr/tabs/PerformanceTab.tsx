
import { useParams } from "react-router-dom";
import { PerformanceRankings } from "@/components/performance/PerformanceRankings";
import { useEmployeeDetails } from "@/hooks/useEmployeeDetails";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Award } from "lucide-react";

export function PerformanceTab() {
  const { employeeId } = useParams<{ employeeId: string }>();
  const { employee } = useEmployeeDetails(employeeId);
  
  const employeeName = `${employee?.first_name || ''} ${employee?.last_name || ''}`;

  return (
    <div className="space-y-8 pb-10">
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <Award className="h-6 w-6 text-primary" />
            <CardTitle>Performance Overview: {employeeName}</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="pt-0 pb-2">
          <p className="text-muted-foreground">
            Comprehensive performance metrics and rankings based on AI analysis of work history, timeliness, and protocol adherence.
          </p>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 gap-6">
        <PerformanceRankings />
      </div>
    </div>
  );
}
