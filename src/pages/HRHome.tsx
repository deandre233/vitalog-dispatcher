
import { useEffect, useState } from "react";
import { HRLayout } from "@/components/layout/HRLayout";
import { HRStatusCards } from "@/components/hr/dashboard/HRStatusCards";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { 
  Calendar, Clock, Search, Bell, BarChart3, Users, 
  FileText, Award, CheckCircle2, AlertTriangle
} from "lucide-react";

export default function HRHome() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Human Resources Dashboard Updated",
        description: "Latest personnel data has been synchronized",
      });
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Dashboard data - in a real app this would come from an API call
  const dashboardData = {
    onDuty: 14,
    onCall: 5,
    incidentsOpen: 3,
    scheduleRequests: 8,
    employeesStale: 4
  };

  return (
    <HRLayout>
      <div className="container mx-auto py-6 space-y-8">
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-12 w-1/3" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-32 w-full" />
              ))}
            </div>
            <Card>
              <CardContent className="p-6">
                <Skeleton className="h-64 w-full" />
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Workforce Management</h1>
                <p className="text-muted-foreground mt-1">Comprehensive human resource oversight platform</p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="gap-1">
                  <Search className="h-4 w-4" />
                  <span className="hidden sm:inline">Search Personnel</span>
                </Button>
                <Button variant="outline" size="sm" className="gap-1 relative">
                  <Bell className="h-4 w-4" />
                  <span className="hidden sm:inline">Alerts</span>
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    3
                  </span>
                </Button>
              </div>
            </div>

            <HRStatusCards data={dashboardData} />
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Tabs defaultValue="analytics">
                  <TabsList className="w-full border-b mb-8">
                    <TabsTrigger value="analytics" className="relative">
                      <BarChart3 className="h-4 w-4 mr-2" />
                      Analytics
                    </TabsTrigger>
                    <TabsTrigger value="personnel">
                      <Users className="h-4 w-4 mr-2" />
                      Personnel
                    </TabsTrigger>
                    <TabsTrigger value="compliance">
                      <CheckCircle2 className="h-4 w-4 mr-2" />
                      Compliance
                    </TabsTrigger>
                    <TabsTrigger value="reports">
                      <FileText className="h-4 w-4 mr-2" />
                      Reports
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="analytics" className="space-y-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg font-medium">Performance Overview</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="h-80 flex items-center justify-center border border-dashed rounded-md">
                          <div className="text-center">
                            <BarChart3 className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
                            <p className="text-muted-foreground">Performance metrics visualization</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="personnel" className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle>Team Management</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground">Personnel allocation and management tools</p>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="compliance" className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle>Compliance Dashboard</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="bg-amber-50 p-4 rounded-md">
                          <div className="flex">
                            <AlertTriangle className="h-5 w-5 text-amber-500 mr-2" />
                            <h3 className="font-medium text-amber-800">4 Certifications Expiring</h3>
                          </div>
                          <p className="text-sm text-amber-700 mt-1">Staff credentials requiring renewal in the next 30 days</p>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="reports" className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle>Generated Reports</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground">Access and generate standardized or custom reports</p>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>
              
              <div className="space-y-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-medium flex items-center">
                      <Calendar className="mr-2 h-5 w-5" />
                      Schedule Overview
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="border-l-4 border-blue-500 pl-3 py-1">
                        <p className="font-medium">Department Meeting</p>
                        <p className="text-sm text-muted-foreground">Today, 3:30 PM</p>
                      </div>
                      <div className="border-l-4 border-purple-500 pl-3 py-1">
                        <p className="font-medium">Professional Development</p>
                        <p className="text-sm text-muted-foreground">Tomorrow, 10:00 AM</p>
                      </div>
                      <div className="border-l-4 border-green-500 pl-3 py-1">
                        <p className="font-medium">Onboarding Session</p>
                        <p className="text-sm text-muted-foreground">Friday, 9:15 AM</p>
                      </div>
                    </div>
                    <Button variant="outline" className="w-full mt-4">
                      View Full Calendar
                    </Button>
                  </CardContent>
                </Card>
                
                <Card className="overflow-hidden">
                  <CardHeader className="pb-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
                    <CardTitle className="text-lg font-medium flex items-center">
                      <Award className="mr-2 h-5 w-5" />
                      Top Performers
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-medium mr-3">
                            JS
                          </div>
                          <p className="font-medium">Jamie Smith</p>
                        </div>
                        <span className="text-sm font-medium text-green-600">98%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-medium mr-3">
                            AW
                          </div>
                          <p className="font-medium">Alex Wong</p>
                        </div>
                        <span className="text-sm font-medium text-green-600">95%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-medium mr-3">
                            MP
                          </div>
                          <p className="font-medium">Morgan Patel</p>
                        </div>
                        <span className="text-sm font-medium text-green-600">92%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        )}
      </div>
    </HRLayout>
  );
}
