
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { TeamMember } from "@/types/ai";
import { AINotificationCenter } from "@/components/hr/tabs/notifications/AINotificationCenter";

export default function Messages() {
  // Mock employee ID - in a real app, this would come from auth context
  const employeeId = "emp-123";
  
  return (
    <MainLayout>
      <div className="container mx-auto py-6">
        <div className="flex flex-col space-y-6">
          <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
          <p className="text-muted-foreground">
            View your notifications and important announcements
          </p>
          
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Notification Center</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="h-[600px]">
                <AINotificationCenter employeeId={employeeId} />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
