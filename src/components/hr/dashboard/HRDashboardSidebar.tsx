
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  User, FileText, Calendar, FileSpreadsheet, Users
} from "lucide-react";

export function HRDashboardSidebar() {
  return (
    <div className="space-y-6">
      <TopPerformersCard />
      <ScheduleOverviewCard />
      <DocumentsStatusCard />
    </div>
  );
}

function TopPerformersCard() {
  return (
    <Card className="bg-gradient-to-br from-white to-purple-50 border border-purple-100">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Users className="mr-2 h-5 w-5 text-purple-600" />
          Top Performers
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center p-2 hover:bg-purple-50 rounded-md transition-colors">
              <div className="w-8 h-8 bg-purple-200 rounded-full flex items-center justify-center mr-3">
                <User className="h-4 w-4 text-purple-700" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-sm">Employee Name</p>
                <p className="text-xs text-muted-foreground">Department</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-purple-600">98%</p>
                <p className="text-xs text-muted-foreground">Rating</p>
              </div>
            </div>
          ))}
        </div>
        <Button variant="outline" className="w-full mt-4 text-purple-700 border-purple-200 hover:bg-purple-50">
          View All Employees
        </Button>
      </CardContent>
    </Card>
  );
}

function ScheduleOverviewCard() {
  return (
    <Card className="bg-gradient-to-br from-white to-green-50 border border-green-100">
      <CardHeader>
        <CardTitle className="flex items-center">
          <FileText className="mr-2 h-5 w-5 text-green-600" />
          Schedule Overview
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="p-2 border-l-4 border-blue-500 bg-blue-50 rounded-r-md">
            <p className="font-medium text-sm">Team Meeting</p>
            <p className="text-xs text-muted-foreground">Today, 2:00 PM</p>
          </div>
          <div className="p-2 border-l-4 border-green-500 bg-green-50 rounded-r-md">
            <p className="font-medium text-sm">Training Session</p>
            <p className="text-xs text-muted-foreground">Tomorrow, 10:00 AM</p>
          </div>
          <div className="p-2 border-l-4 border-amber-500 bg-amber-50 rounded-r-md">
            <p className="font-medium text-sm">Performance Reviews</p>
            <p className="text-xs text-muted-foreground">Friday, 11:00 AM</p>
          </div>
        </div>
        <Button variant="outline" className="w-full mt-4 text-green-700 border-green-200 hover:bg-green-50">
          View Full Schedule
        </Button>
      </CardContent>
    </Card>
  );
}

function DocumentsStatusCard() {
  return (
    <Card className="bg-gradient-to-br from-white to-blue-50 border border-blue-100">
      <CardHeader>
        <CardTitle className="flex items-center">
          <FileSpreadsheet className="mr-2 h-5 w-5 text-blue-600" />
          HR Documents Status
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="bg-white p-3 rounded-lg border border-blue-100">
            <div className="flex justify-between items-center">
              <p className="font-medium text-sm">Benefits Enrollment</p>
              <Badge className="bg-amber-100 text-amber-800">5 Pending</Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Deadline: June 30</p>
          </div>
          
          <div className="bg-white p-3 rounded-lg border border-blue-100">
            <div className="flex justify-between items-center">
              <p className="font-medium text-sm">Annual Reviews</p>
              <Badge className="bg-green-100 text-green-800">Up to date</Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Next batch due July 15</p>
          </div>
          
          <div className="bg-white p-3 rounded-lg border border-blue-100">
            <div className="flex justify-between items-center">
              <p className="font-medium text-sm">Policy Updates</p>
              <Badge className="bg-red-100 text-red-800">Action Required</Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Safety protocols update pending</p>
          </div>
        </div>
        
        <Button variant="outline" className="w-full mt-4 text-blue-700 border-blue-200 hover:bg-blue-50">
          Document Repository
        </Button>
      </CardContent>
    </Card>
  );
}
