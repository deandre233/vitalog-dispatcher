
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserPlus, FileText, Clock, Award, Calendar, Users } from "lucide-react";

export function HRQuickActions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <Button variant="outline" className="h-auto py-4 justify-start">
            <UserPlus className="mr-2 h-5 w-5" />
            <div className="text-left">
              <div className="font-medium">New Employee</div>
              <div className="text-xs text-muted-foreground">Add to directory</div>
            </div>
          </Button>
          
          <Button variant="outline" className="h-auto py-4 justify-start">
            <FileText className="mr-2 h-5 w-5" />
            <div className="text-left">
              <div className="font-medium">HR Document</div>
              <div className="text-xs text-muted-foreground">Upload new form</div>
            </div>
          </Button>
          
          <Button variant="outline" className="h-auto py-4 justify-start">
            <Clock className="mr-2 h-5 w-5" />
            <div className="text-left">
              <div className="font-medium">Manual Clock-in</div>
              <div className="text-xs text-muted-foreground">Fix time records</div>
            </div>
          </Button>
          
          <Button variant="outline" className="h-auto py-4 justify-start">
            <Award className="mr-2 h-5 w-5" />
            <div className="text-left">
              <div className="font-medium">Certificate</div>
              <div className="text-xs text-muted-foreground">Add or update</div>
            </div>
          </Button>
          
          <Button variant="outline" className="h-auto py-4 justify-start">
            <Calendar className="mr-2 h-5 w-5" />
            <div className="text-left">
              <div className="font-medium">Schedule Change</div>
              <div className="text-xs text-muted-foreground">Modify shifts</div>
            </div>
          </Button>
          
          <Button variant="outline" className="h-auto py-4 justify-start">
            <Users className="mr-2 h-5 w-5" />
            <div className="text-left">
              <div className="font-medium">Employee Directory</div>
              <div className="text-xs text-muted-foreground">View all staff</div>
            </div>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
