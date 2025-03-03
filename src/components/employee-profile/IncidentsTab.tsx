
import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, BarChart2 } from "lucide-react";

export const IncidentsTab: React.FC = () => {
  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-6">Incidents</h2>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Incident Records</h3>
          <Button>
            <AlertTriangle className="mr-2 h-4 w-4" />
            Report New Incident
          </Button>
        </div>
        
        <div className="bg-muted/40 rounded-md p-4 text-center">
          <p className="text-muted-foreground">No incidents reported for this employee.</p>
        </div>
        
        <div className="mt-4 space-y-4">
          <h3 className="text-lg font-medium">AI Safety Analysis</h3>
          <Card className="bg-green-50 p-4 border-green-200">
            <div className="flex items-start">
              <div className="bg-green-100 p-2 rounded-full mr-4">
                <BarChart2 className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <h4 className="font-medium text-green-800">Low Risk Profile</h4>
                <p className="text-sm text-green-700 mt-1">This employee has maintained an excellent safety record with no incidents over the past 24 months.</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </Card>
  );
};
