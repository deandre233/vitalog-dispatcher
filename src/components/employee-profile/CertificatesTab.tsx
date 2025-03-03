
import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export const CertificatesTab: React.FC = () => {
  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-6">Certificates & Training</h2>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Active Certifications</h3>
          <Button>Add Certification</Button>
        </div>
        
        <div className="grid grid-cols-1 gap-4">
          <div className="border rounded-md p-4">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-medium">EMT-Paramedic</h4>
                <p className="text-sm text-muted-foreground">Expires on: Dec 31, 2023</p>
              </div>
              <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Active</Badge>
            </div>
          </div>
          
          <div className="border rounded-md p-4">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-medium">Advanced Cardiac Life Support</h4>
                <p className="text-sm text-muted-foreground">Expires on: Mar 15, 2024</p>
              </div>
              <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Active</Badge>
            </div>
          </div>
          
          <div className="border rounded-md p-4">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-medium">Pediatric Advanced Life Support</h4>
                <p className="text-sm text-muted-foreground">Expires on: Jun 30, 2023</p>
              </div>
              <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">Expiring Soon</Badge>
            </div>
          </div>
        </div>
        
        <Separator />
        
        <div className="mt-6">
          <h3 className="text-lg font-medium mb-4">Training History</h3>
          <div className="space-y-4">
            <div className="bg-muted/20 p-4 rounded-md">
              <div className="flex justify-between">
                <div>
                  <h4 className="font-medium">Mass Casualty Incident Response</h4>
                  <p className="text-sm text-muted-foreground">Completed on: Jan 10, 2023</p>
                </div>
                <div className="text-right">
                  <Badge variant="outline">8 hrs</Badge>
                </div>
              </div>
            </div>
            
            <div className="bg-muted/20 p-4 rounded-md">
              <div className="flex justify-between">
                <div>
                  <h4 className="font-medium">Advanced Airway Management</h4>
                  <p className="text-sm text-muted-foreground">Completed on: Nov 5, 2022</p>
                </div>
                <div className="text-right">
                  <Badge variant="outline">4 hrs</Badge>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
