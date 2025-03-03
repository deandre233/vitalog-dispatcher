
import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { HeartPulse } from "lucide-react";

export const ImmunizationsTab: React.FC = () => {
  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-6">Immunization Records</h2>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Vaccination Status</h3>
          <Button>Add Vaccination Record</Button>
        </div>
        
        <div className="grid grid-cols-1 gap-4">
          <div className="border rounded-md p-4">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-medium">COVID-19 Vaccination</h4>
                <p className="text-sm text-muted-foreground">Date: Mar 15, 2022 • Booster: Nov 10, 2022</p>
              </div>
              <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Up to Date</Badge>
            </div>
          </div>
          
          <div className="border rounded-md p-4">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-medium">Hepatitis B Series</h4>
                <p className="text-sm text-muted-foreground">Completed: Jan 20, 2020</p>
              </div>
              <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Complete</Badge>
            </div>
          </div>
          
          <div className="border rounded-md p-4">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-medium">Tetanus/Tdap</h4>
                <p className="text-sm text-muted-foreground">Date: Sep 5, 2019</p>
              </div>
              <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">Update Due</Badge>
            </div>
          </div>
        </div>
        
        <Separator />
        
        <div className="mt-6">
          <h3 className="text-lg font-medium mb-4">Health Compliance Status</h3>
          <Card className="bg-green-50 p-4 border-green-200">
            <div className="flex items-start">
              <div className="bg-green-100 p-2 rounded-full mr-4">
                <HeartPulse className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <h4 className="font-medium text-green-800">98% Compliant</h4>
                <p className="text-sm text-green-700 mt-1">Your immunization record is nearly complete. Please update your Tetanus/Tdap vaccination to achieve full compliance.</p>
              </div>
            </div>
          </Card>
        </div>
        
        <div className="mt-6">
          <h3 className="text-lg font-medium mb-4">TB Testing History</h3>
          <div className="space-y-4">
            <div className="bg-muted/20 p-4 rounded-md">
              <h4 className="font-medium">Annual TB Test</h4>
              <p className="text-sm">Date: February 15, 2023 • Result: Negative</p>
            </div>
            
            <div className="bg-muted/20 p-4 rounded-md">
              <h4 className="font-medium">Annual TB Test</h4>
              <p className="text-sm">Date: February 10, 2022 • Result: Negative</p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
