
import { useEffect, useState } from "react";
import { HRLayout } from "@/components/layout/HRLayout";
import { HRStatusCards } from "@/components/hr/dashboard/HRStatusCards";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Activity, Clock, User, FileText, BarChart3, Users } from "lucide-react";

export default function HRHome() {
  const [isLoading, setIsLoading] = useState(true);
  const [statusData, setStatusData] = useState({
    onDuty: 0,
    onCall: 0,
    incidentsOpen: 0,
    scheduleRequests: 0,
    employeesStale: 0,
  });

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setStatusData({
        onDuty: 11,
        onCall: 4,
        incidentsOpen: 2,
        scheduleRequests: 7,
        employeesStale: 4,
      });
      setIsLoading(false);
      toast({
        title: "HR Dashboard Refreshed",
        description: "Personnel data has been updated",
      });
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <HRLayout>
      <div className="container mx-auto py-6 space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">HR Command Center</h1>
            <p className="text-sm text-muted-foreground mt-1">Comprehensive personnel management and insights</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Clock className="mr-2 h-4 w-4" />
              Daily Report
            </Button>
            <Button size="sm">
              <Activity className="mr-2 h-4 w-4" />
              Analytics
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-32 w-full" />
              ))}
            </div>
            <Skeleton className="h-64 w-full" />
          </div>
        ) : (
          <>
            <HRStatusCards data={statusData} />
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <Tabs defaultValue="team" className="w-full">
                  <TabsList className="grid grid-cols-4 w-full">
                    <TabsTrigger value="team">Team Analytics</TabsTrigger>
                    <TabsTrigger value="compliance">Compliance</TabsTrigger>
                    <TabsTrigger value="certifications">Certifications</TabsTrigger>
                    <TabsTrigger value="incidents">Incidents</TabsTrigger>
                  </TabsList>
                  <TabsContent value="team" className="space-y-4 mt-4">
                    <Card className="bg-gradient-to-br from-white to-blue-50 border border-blue-100">
                      <CardHeader>
                        <CardTitle className="flex items-center">
                          <BarChart3 className="mr-2 h-5 w-5 text-blue-600" />
                          Department Performance
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="h-[240px] flex items-center justify-center border border-dashed border-gray-300 rounded-md bg-white/80">
                          <p className="text-muted-foreground">Performance chart will render here</p>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  <TabsContent value="compliance" className="space-y-4 mt-4">
                    <Card>
                      <CardHeader>
                        <CardTitle>Compliance Overview</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground">Compliance data will render here</p>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  <TabsContent value="certifications" className="space-y-4 mt-4">
                    <Card>
                      <CardHeader>
                        <CardTitle>Certification Status</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground">Certification data will render here</p>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  <TabsContent value="incidents" className="space-y-4 mt-4">
                    <Card>
                      <CardHeader>
                        <CardTitle>Incident Management</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground">Incident data will render here</p>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>
              
              <div className="space-y-6">
                <Card className="bg-gradient-to-br from-white to-purple-50 border border-purple-100">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Users className="mr-2 h-5 w-5 text-purple-600" />
                      Top Performers
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[...Array(3)].map((_, i) => (
                        <div key={i} className="flex items-center p-2 hover:bg-purple-50 rounded-md transition-colors">
                          <div className="w-8 h-8 bg-purple-200 rounded-full flex items-center justify-center mr-3">
                            <User className="h-4 w-4 text-purple-700" />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-sm">Employee Name</p>
                            <p className="text-xs text-muted-foreground">Department</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-semibold text-purple-600">98%</p>
                            <p className="text-xs text-muted-foreground">Rating</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <Button variant="outline" className="w-full mt-4 text-purple-700 border-purple-200 hover:bg-purple-50">
                      View All Employees
                    </Button>
                  </CardContent>
                </Card>
                
                <Card className="bg-gradient-to-br from-white to-green-50 border border-green-100">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <FileText className="mr-2 h-5 w-5 text-green-600" />
                      Schedule Overview
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="p-2 border-l-4 border-blue-500 bg-blue-50 rounded-r-md">
                        <p className="font-medium text-sm">Team Meeting</p>
                        <p className="text-xs text-muted-foreground">Today, 2:00 PM</p>
                      </div>
                      <div className="p-2 border-l-4 border-green-500 bg-green-50 rounded-r-md">
                        <p className="font-medium text-sm">Training Session</p>
                        <p className="text-xs text-muted-foreground">Tomorrow, 10:00 AM</p>
                      </div>
                      <div className="p-2 border-l-4 border-amber-500 bg-amber-50 rounded-r-md">
                        <p className="font-medium text-sm">Performance Reviews</p>
                        <p className="text-xs text-muted-foreground">Friday, 11:00 AM</p>
                      </div>
                    </div>
                    <Button variant="outline" className="w-full mt-4 text-green-700 border-green-200 hover:bg-green-50">
                      View Full Schedule
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </>
        )}
      </div>
    </HRLayout>
  );
}
