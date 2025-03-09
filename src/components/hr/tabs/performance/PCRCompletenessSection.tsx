
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useParams } from "react-router-dom";
import { useEmployeeDetails } from "@/hooks/useEmployeeDetails";

export function PCRCompletenessSection() {
  const { employeeId } = useParams<{ employeeId: string }>();
  const { employee } = useEmployeeDetails(employeeId);

  const employeeName = `${employee?.first_name || ''} ${employee?.last_name || ''}`;

  return (
    <Card className="mt-6">
      <CardHeader className="pb-3">
        <CardTitle>{employeeName}'s PCR completeness over time</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative h-[400px] w-full bg-white">
          <div className="absolute top-0 left-0 flex items-center gap-4 p-2">
            <div className="flex items-center gap-1">
              <span className="inline-block w-4 h-[2px] bg-blue-500"></span>
              <span className="text-sm text-gray-700">Vitals</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="inline-block w-4 h-[2px] bg-amber-500"></span>
              <span className="text-sm text-gray-700">Assessments</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="inline-block w-4 h-[2px] bg-red-500"></span>
              <span className="text-sm text-gray-700">Procedures</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="inline-block w-4 h-[2px] bg-blue-800"></span>
              <span className="text-sm text-gray-700">Followup</span>
            </div>
          </div>
          
          {/* Chart Placeholder - In real implementation this would be a recharts component */}
          <div className="mt-10 h-[320px] border border-gray-200 rounded-md relative bg-gray-50 px-4">
            {/* Y-axis labels */}
            <div className="absolute left-2 top-0 h-full flex flex-col justify-between text-xs text-gray-500">
              <span>120%</span>
              <span>100%</span>
              <span>80%</span>
              <span>60%</span>
              <span>40%</span>
              <span>20%</span>
              <span>0%</span>
            </div>
            
            {/* X-axis grid lines */}
            <div className="absolute top-0 left-10 right-0 h-full flex flex-col justify-between">
              <div className="border-b border-gray-200 w-full h-0"></div>
              <div className="border-b border-gray-200 w-full h-0"></div>
              <div className="border-b border-gray-200 w-full h-0"></div>
              <div className="border-b border-gray-200 w-full h-0"></div>
              <div className="border-b border-gray-200 w-full h-0"></div>
              <div className="border-b border-gray-200 w-full h-0"></div>
              <div className="border-b border-gray-200 w-full h-0"></div>
            </div>
            
            {/* Vertical grid lines */}
            <div className="absolute top-0 left-10 right-0 h-full flex justify-between">
              <div className="border-l border-gray-300 h-full"></div>
              <div className="border-l border-gray-300 h-full"></div>
              <div className="border-l border-gray-300 h-full"></div>
              <div className="border-l border-gray-300 h-full"></div>
            </div>
            
            {/* X-axis labels */}
            <div className="absolute bottom-0 left-10 right-0 flex justify-between text-xs text-gray-500">
              <span>11/25/2024</span>
              <span>12/23/2024</span>
              <span>1/20/2025</span>
              <span>2/17/2025</span>
            </div>
            
            {/* Chart title at the bottom */}
            <div className="absolute bottom-[-25px] left-0 right-0 text-center text-xs text-gray-500">
              Two-Week Interval Start Date
            </div>
            
            {/* Y-axis title */}
            <div className="absolute left-[-85px] top-1/2 transform -rotate-90 text-xs text-gray-500">
              Average Completeness
            </div>
            
            {/* Simulated chart lines */}
            <svg className="absolute top-10 left-10 right-0 h-[250px] w-[calc(100%-40px)]" viewBox="0 0 600 250" preserveAspectRatio="none">
              {/* Vitals line (blue) */}
              <path d="M0,10 L200,15 L400,12 L600,20" stroke="#3b82f6" strokeWidth="2" fill="none" />
              
              {/* Assessments line (amber) */}
              <path d="M0,15 L200,12 L400,20 L600,25" stroke="#f59e0b" strokeWidth="2" fill="none" />
              
              {/* Procedures line (red) */}
              <path d="M0,20 L200,30 L400,40 L600,35" stroke="#ef4444" strokeWidth="2" fill="none" />
              
              {/* Followup line (dark blue) */}
              <path d="M0,25 L200,20 L400,15 L600,20" stroke="#1e40af" strokeWidth="2" fill="none" />
            </svg>
          </div>
          
          <div className="mt-8 text-center">
            <Button variant="link" className="text-blue-600">
              Export {employeeName}'s list of PCR procedures performed
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
