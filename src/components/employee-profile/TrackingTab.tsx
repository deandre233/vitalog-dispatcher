
import React from "react";
import { Card } from "@/components/ui/card";
import { MapPin, Compass, Clock } from "lucide-react";

export const TrackingTab: React.FC = () => {
  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-6">Employee Tracking</h2>
      <div className="space-y-6">
        <div className="bg-muted/20 p-4 rounded-md text-center">
          <p className="text-muted-foreground">Location tracking information will appear here</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-4">
            <div className="flex items-center space-x-2 mb-2">
              <MapPin className="h-4 w-4 text-blue-500" />
              <h3 className="font-medium">Last Known Location</h3>
            </div>
            <p className="text-sm text-muted-foreground">Not available</p>
          </Card>
          
          <Card className="p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Compass className="h-4 w-4 text-green-500" />
              <h3 className="font-medium">Distance Today</h3>
            </div>
            <p className="text-sm text-muted-foreground">Not available</p>
          </Card>
          
          <Card className="p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Clock className="h-4 w-4 text-amber-500" />
              <h3 className="font-medium">Last Updated</h3>
            </div>
            <p className="text-sm text-muted-foreground">Not available</p>
          </Card>
        </div>
      </div>
    </Card>
  );
};
