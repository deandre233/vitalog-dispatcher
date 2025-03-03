
import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Award } from "lucide-react";

export const AchievementsTab: React.FC = () => {
  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-6">Achievements & Awards</h2>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Recognition</h3>
          <Button>Add Achievement</Button>
        </div>
        
        <div className="grid grid-cols-1 gap-6">
          <div className="border rounded-md p-6 bg-gradient-to-r from-amber-50 to-amber-100 border-amber-200">
            <div className="flex items-start">
              <div className="mr-4">
                <Award className="h-8 w-8 text-amber-600" />
              </div>
              <div>
                <h4 className="font-semibold text-lg">Employee of the Month</h4>
                <p className="text-sm text-muted-foreground">Awarded on: March 2023</p>
                <p className="mt-2">Recognized for outstanding dedication to patient care and exemplary teamwork during the downtown multi-vehicle incident response.</p>
              </div>
            </div>
          </div>
          
          <div className="border rounded-md p-6">
            <div className="flex items-start">
              <div className="mr-4">
                <Award className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <h4 className="font-semibold text-lg">Advanced Life Support Excellence</h4>
                <p className="text-sm text-muted-foreground">Awarded on: November 2022</p>
                <p className="mt-2">Recognized for exceptional care and successful resuscitation during a critical cardiac event.</p>
              </div>
            </div>
          </div>
        </div>
        
        <Separator />
        
        <div className="mt-6">
          <h3 className="text-lg font-medium mb-4">Notable Accomplishments</h3>
          <div className="space-y-4">
            <div className="bg-muted/20 p-4 rounded-md">
              <h4 className="font-medium">1,000+ Successful Transports</h4>
              <p className="text-sm mt-1">Achieved milestone in February 2023</p>
            </div>
            
            <div className="bg-muted/20 p-4 rounded-md">
              <h4 className="font-medium">Field Training Officer Certification</h4>
              <p className="text-sm mt-1">Completed advanced training program in December 2022</p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
