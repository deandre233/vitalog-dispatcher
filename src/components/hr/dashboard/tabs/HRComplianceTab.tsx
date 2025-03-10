
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { AlertTriangle, CheckCircle2, FileCheck2 } from "lucide-react";

interface ComplianceDataProps {
  upToDate: number;
  expiringWithin30Days: number;
  expired: number;
  completionRate: number;
}

export function HRComplianceTab({ 
  data = { upToDate: 28, expiringWithin30Days: 5, expired: 2, completionRate: 92 } 
}: { data?: ComplianceDataProps }) {
  return (
    <Card className="bg-gradient-to-br from-white to-green-50 border border-green-100">
      <CardHeader>
        <CardTitle className="flex items-center">
          <CheckCircle2 className="mr-2 h-5 w-5 text-green-600" />
          Compliance Overview
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-4">
            <div className="bg-white rounded-lg p-4 border border-green-100">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium">Current Compliance Rate</p>
                  <h3 className="text-2xl font-bold text-green-600">{data.completionRate}%</h3>
                </div>
                <FileCheck2 className="h-10 w-10 text-green-200" />
              </div>
              <div className="mt-2 bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-green-600 h-2.5 rounded-full" 
                  style={{ width: `${data.completionRate}%` }}
                ></div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-4 border border-amber-100">
              <div className="flex justify-between">
                <div>
                  <p className="text-sm font-medium">Expiring Within 30 Days</p>
                  <h3 className="text-2xl font-bold text-amber-500">{data.expiringWithin30Days}</h3>
                </div>
                <AlertTriangle className="h-10 w-10 text-amber-200" />
              </div>
              <Button variant="outline" size="sm" className="mt-2 w-full">Review</Button>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="bg-white rounded-lg p-4 border border-blue-100">
              <div className="flex justify-between">
                <div>
                  <p className="text-sm font-medium">Up to Date</p>
                  <h3 className="text-2xl font-bold text-blue-600">{data.upToDate}</h3>
                </div>
                <CheckCircle2 className="h-10 w-10 text-blue-200" />
              </div>
              <p className="text-xs text-muted-foreground mt-2">Employees with all certifications current</p>
            </div>
            
            <div className="bg-white rounded-lg p-4 border border-red-100">
              <div className="flex justify-between">
                <div>
                  <p className="text-sm font-medium">Expired</p>
                  <h3 className="text-2xl font-bold text-red-600">{data.expired}</h3>
                </div>
                <AlertTriangle className="h-10 w-10 text-red-200" />
              </div>
              <Button variant="outline" size="sm" className="mt-2 w-full text-red-600 border-red-200 hover:bg-red-50">
                Urgent Review
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
