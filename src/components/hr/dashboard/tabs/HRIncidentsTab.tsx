
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle } from "lucide-react";

export function HRIncidentsTab() {
  return (
    <Card className="bg-gradient-to-br from-white to-red-50 border border-red-100">
      <CardHeader>
        <CardTitle className="flex items-center">
          <AlertTriangle className="mr-2 h-5 w-5 text-red-600" />
          Incident Management
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="p-3 bg-white rounded-lg border border-red-100">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">Vehicle Incident #IN-2023-42</p>
                <p className="text-xs text-muted-foreground">Reported by J. Smith, Jun 12, 2023</p>
              </div>
              <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">In Progress</Badge>
            </div>
            <p className="text-sm mt-2">Minor damage to rear bumper during parking maneuver.</p>
            <div className="flex justify-end mt-2">
              <Button variant="ghost" size="sm" className="text-xs">View Details</Button>
            </div>
          </div>
          
          <div className="p-3 bg-white rounded-lg border border-red-100">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">Workplace Injury #IN-2023-39</p>
                <p className="text-xs text-muted-foreground">Reported by M. Johnson, Jun 8, 2023</p>
              </div>
              <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Resolved</Badge>
            </div>
            <p className="text-sm mt-2">Minor back strain while lifting equipment. No lost time.</p>
            <div className="flex justify-end mt-2">
              <Button variant="ghost" size="sm" className="text-xs">View Details</Button>
            </div>
          </div>
          
          <Button variant="outline" className="w-full">
            View All Incidents
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
