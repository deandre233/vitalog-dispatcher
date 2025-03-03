
import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

export const DamageTab: React.FC = () => {
  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-6">Damage Reports</h2>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Vehicle & Equipment Damage</h3>
          <Button>
            <AlertTriangle className="mr-2 h-4 w-4" />
            Report Damage
          </Button>
        </div>
        
        <div className="bg-muted/40 rounded-md p-4 text-center">
          <p className="text-muted-foreground">No damage reports filed for this employee.</p>
        </div>
        
        <div className="mt-6">
          <h3 className="text-lg font-medium mb-4">Safety Record</h3>
          <div className="grid grid-cols-3 gap-4">
            <Card className="p-4">
              <h4 className="text-sm font-medium text-muted-foreground mb-2">Accident-Free Days</h4>
              <div className="text-2xl font-bold">365</div>
            </Card>
            
            <Card className="p-4">
              <h4 className="text-sm font-medium text-muted-foreground mb-2">Vehicle Incidents</h4>
              <div className="text-2xl font-bold">0</div>
            </Card>
            
            <Card className="p-4">
              <h4 className="text-sm font-medium text-muted-foreground mb-2">Equipment Damage</h4>
              <div className="text-2xl font-bold">0</div>
            </Card>
          </div>
        </div>
      </div>
    </Card>
  );
};
