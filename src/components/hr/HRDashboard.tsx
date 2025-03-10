
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HRStatusCards } from "@/components/hr/dashboard/HRStatusCards";
import { HRQuickActions } from "@/components/hr/dashboard/HRQuickActions";
import { HRAIInsights } from "@/components/hr/dashboard/HRAIInsights";
import { HRRecentActivity } from "@/components/hr/dashboard/HRRecentActivity";
import { Bell, Calendar, Clock, Search } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export function HRDashboard() {
  const [buildNumber, setBuildNumber] = useState(542);
  const [notifications, setNotifications] = useState(3);
  
  // You could fetch this from your API or Supabase in a real app
  const dashboardData = {
    onDuty: 11,
    onCall: 4,
    incidentsOpen: 2,
    scheduleRequests: 7,
    employeesStale: 4
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">HR Home</h1>
          <div className="flex items-center text-sm text-muted-foreground mt-1">
            <span>See what's new in build {buildNumber}</span>
            <Badge variant="outline" className="ml-2 bg-blue-50">New</Badge>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-1">
            <Search className="h-4 w-4" />
            <span className="hidden sm:inline">Search</span>
          </Button>
          <Button variant="outline" size="sm" className="gap-1 relative">
            <Bell className="h-4 w-4" />
            <span className="hidden sm:inline">Notifications</span>
            {notifications > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {notifications}
              </span>
            )}
          </Button>
        </div>
      </div>

      <HRStatusCards data={dashboardData} />
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="col-span-1 lg:col-span-3 space-y-6">
          <Tabs defaultValue="general">
            <TabsList className="grid grid-cols-2 sm:grid-cols-4 w-full">
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="timeclock">Timeclock</TabsTrigger>
              <TabsTrigger value="incidents">Incidents</TabsTrigger>
              <TabsTrigger value="compliance">Compliance</TabsTrigger>
            </TabsList>
            <TabsContent value="general" className="space-y-4 mt-4">
              <HRQuickActions />
              <HRRecentActivity />
            </TabsContent>
            <TabsContent value="timeclock" className="space-y-4 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Clock className="mr-2 h-5 w-5" />
                    Timeclock Overview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Manage employee time records and review flagged entries.</p>
                  <div className="mt-4 grid gap-4">
                    <Button variant="default">View Current Shifts</Button>
                    <Button variant="outline">Manual Clock-in Entry</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="incidents" className="space-y-4 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Incident Management</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>No open incidents require your attention.</p>
                  <Button className="mt-4" variant="outline">View All Incidents</Button>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="compliance" className="space-y-4 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Compliance Dashboard</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Monitor certification and training compliance across all employees.
                  </p>
                  <div className="mt-4">
                    <Card className="bg-amber-50">
                      <CardContent className="p-4">
                        <h3 className="font-semibold">4 Certifications Expiring Soon</h3>
                        <p className="text-sm text-muted-foreground">Review employees with expiring certifications</p>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="mr-2 h-5 w-5" />
                Upcoming Schedule
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border-l-4 border-blue-500 pl-3 py-1">
                  <p className="font-medium">Shift Change Meeting</p>
                  <p className="text-sm text-muted-foreground">Today, 3:00 PM</p>
                </div>
                <div className="border-l-4 border-purple-500 pl-3 py-1">
                  <p className="font-medium">Training Session</p>
                  <p className="text-sm text-muted-foreground">Tomorrow, 10:00 AM</p>
                </div>
                <div className="border-l-4 border-green-500 pl-3 py-1">
                  <p className="font-medium">New Hire Orientation</p>
                  <p className="text-sm text-muted-foreground">Friday, 9:00 AM</p>
                </div>
              </div>
              <Button variant="outline" className="w-full mt-4">
                View Full Schedule
              </Button>
            </CardContent>
          </Card>
          
          <HRAIInsights />
        </div>
      </div>
    </div>
  );
}
