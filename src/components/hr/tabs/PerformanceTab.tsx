
import { useParams } from "react-router-dom";
import { useEmployeeDetails } from "@/hooks/useEmployeeDetails";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Award } from "lucide-react";
import { SingleEmployeePerformance } from "@/components/performance/SingleEmployeePerformance";

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
            Comprehensive performance metrics and AI analysis of work history, timeliness, and protocol adherence.
          </p>
        </CardContent>
      </Card>
      
      <div className="space-y-6">
        <SingleEmployeePerformance employeeId={employeeId || ''} employeeName={employeeName} />
      </div>
    </div>
  );
}
