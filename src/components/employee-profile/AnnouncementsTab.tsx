
import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export const AnnouncementsTab: React.FC = () => {
  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-6">Company Announcements</h2>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Personal Messages</h3>
          <Badge className="bg-green-100 text-green-800">{3} New</Badge>
        </div>
        
        <div className="space-y-4">
          <Card className="p-4 border-l-4 border-l-blue-500">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-medium">Policy Update: Overtime Scheduling</h4>
                <p className="text-sm text-muted-foreground">From: HR Department • 2 days ago</p>
                <p className="mt-2">Please review the updated overtime policy which takes effect next month. New scheduling procedures will be implemented.</p>
              </div>
              <Badge variant="outline">Unread</Badge>
            </div>
            <div className="mt-2 flex justify-end">
              <Button variant="outline" size="sm">Mark as Read</Button>
              <Button variant="ghost" size="sm" className="ml-2">View Details</Button>
            </div>
          </Card>
          
          <Card className="p-4 border-l-4 border-l-green-500">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-medium">Congratulations on Your Work Anniversary!</h4>
                <p className="text-sm text-muted-foreground">From: Management Team • 1 week ago</p>
                <p className="mt-2">Thank you for your dedicated service. Your commitment to excellence has been invaluable to our team.</p>
              </div>
              <Badge variant="outline">Unread</Badge>
            </div>
            <div className="mt-2 flex justify-end">
              <Button variant="outline" size="sm">Mark as Read</Button>
              <Button variant="ghost" size="sm" className="ml-2">View Details</Button>
            </div>
          </Card>
        </div>
        
        <Separator />
        
        <div className="mt-6">
          <h3 className="text-lg font-medium mb-4">Company-Wide Announcements</h3>
          <div className="space-y-4">
            <Card className="p-4 hover:bg-muted/20 transition-colors">
              <h4 className="font-medium">Upcoming Training Session: Advanced Patient Care</h4>
              <p className="text-sm text-muted-foreground">Posted: May 10, 2023</p>
              <p className="mt-2">All medics are invited to attend the optional training session next Friday at HQ.</p>
            </Card>
            
            <Card className="p-4 hover:bg-muted/20 transition-colors">
              <h4 className="font-medium">System Update: Dispatch Software Changes</h4>
              <p className="text-sm text-muted-foreground">Posted: May 5, 2023</p>
              <p className="mt-2">Important updates to the dispatch system will be deployed this weekend.</p>
            </Card>
          </div>
        </div>
      </div>
    </Card>
  );
};
