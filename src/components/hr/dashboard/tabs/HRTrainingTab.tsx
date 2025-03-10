
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GraduationCap } from "lucide-react";

export function HRTrainingTab() {
  return (
    <Card className="bg-gradient-to-br from-white to-purple-50 border border-purple-100">
      <CardHeader>
        <CardTitle className="flex items-center">
          <GraduationCap className="mr-2 h-5 w-5 text-purple-600" />
          Training Progress
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="bg-white p-3 rounded-lg border border-purple-100">
            <div className="flex justify-between items-center">
              <p className="font-medium">Q2 Safety Training</p>
              <Badge className="bg-green-100 text-green-800">85% Complete</Badge>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
              <div className="bg-green-600 h-2.5 rounded-full" style={{ width: '85%' }}></div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">4 employees still need to complete</p>
          </div>
          
          <div className="bg-white p-3 rounded-lg border border-purple-100">
            <div className="flex justify-between items-center">
              <p className="font-medium">New Protocol Training</p>
              <Badge className="bg-amber-100 text-amber-800">61% Complete</Badge>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
              <div className="bg-amber-500 h-2.5 rounded-full" style={{ width: '61%' }}></div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Due in 7 days</p>
          </div>
          
          <div className="bg-white p-3 rounded-lg border border-purple-100">
            <div className="flex justify-between items-center">
              <p className="font-medium">Defensive Driving Course</p>
              <Badge className="bg-blue-100 text-blue-800">Upcoming</Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Scheduled for July 15-22</p>
            <div className="flex justify-end mt-2">
              <Button variant="outline" size="sm" className="text-xs">Send Reminder</Button>
            </div>
          </div>
          
          <Button variant="outline" className="w-full">Training Calendar</Button>
        </div>
      </CardContent>
    </Card>
  );
}
