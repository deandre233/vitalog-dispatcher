
import { useEffect, useState } from "react";
import { HRLayout } from "@/components/layout/HRLayout";
import { HRStatusCards } from "@/components/hr/dashboard/HRStatusCards";
import { HRWorkforceAnalytics } from "@/components/hr/dashboard/HRWorkforceAnalytics";
import { HRAIRecommendations } from "@/components/hr/dashboard/HRAIRecommendations";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { 
  Activity, Clock, User, FileText, BarChart3, Users, 
  AlertTriangle, Calendar, Zap, CheckCircle2, FileCheck2, 
  BarChart, FileSpreadsheet, GraduationCap
} from "lucide-react";

export default function HRHome() {
  const [isLoading, setIsLoading] = useState(true);
  const [statusData, setStatusData] = useState({
    onDuty: 0,
    onCall: 0,
    incidentsOpen: 0,
    scheduleRequests: 0,
    employeesStale: 0,
  });
  
  const [complianceData, setComplianceData] = useState({
    upToDate: 0,
    expiringWithin30Days: 0,
    expired: 0,
    completionRate: 0
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
      
      setComplianceData({
        upToDate: 28,
        expiringWithin30Days: 5,
        expired: 2,
        completionRate: 92
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
                  <TabsList className="grid grid-cols-5 w-full">
                    <TabsTrigger value="team">Team Analytics</TabsTrigger>
                    <TabsTrigger value="compliance">Compliance</TabsTrigger>
                    <TabsTrigger value="certifications">Certifications</TabsTrigger>
                    <TabsTrigger value="incidents">Incidents</TabsTrigger>
                    <TabsTrigger value="training">Training</TabsTrigger>
                  </TabsList>
                  <TabsContent value="team" className="space-y-4 mt-4">
                    <HRWorkforceAnalytics />
                  </TabsContent>
                  <TabsContent value="compliance" className="space-y-4 mt-4">
                    <Card className="bg-gradient-to-br from-white to-green-50 border border-green-100">
                      <CardHeader>
                        <CardTitle className="flex items-center">
                          <CheckCircle2 className="mr-2 h-5 w-5 text-green-600" />
                          Compliance Overview
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-4">
                            <div className="bg-white rounded-lg p-4 border border-green-100">
                              <div className="flex justify-between items-center">
                                <div>
                                  <p className="text-sm font-medium">Current Compliance Rate</p>
                                  <h3 className="text-2xl font-bold text-green-600">{complianceData.completionRate}%</h3>
                                </div>
                                <FileCheck2 className="h-10 w-10 text-green-200" />
                              </div>
                              <div className="mt-2 bg-gray-200 rounded-full h-2.5">
                                <div className="bg-green-600 h-2.5 rounded-full" style={{ width: `${complianceData.completionRate}%` }}></div>
                              </div>
                            </div>
                            
                            <div className="bg-white rounded-lg p-4 border border-amber-100">
                              <div className="flex justify-between">
                                <div>
                                  <p className="text-sm font-medium">Expiring Within 30 Days</p>
                                  <h3 className="text-2xl font-bold text-amber-500">{complianceData.expiringWithin30Days}</h3>
                                </div>
                                <AlertTriangle className="h-10 w-10 text-amber-200" />
                              </div>
                              <Button variant="outline" size="sm" className="mt-2 w-full">Review</Button>
                            </div>
                          </div>
                          
                          <div className="space-y-4">
                            <div className="bg-white rounded-lg p-4 border border-blue-100">
                              <div className="flex justify-between">
                                <div>
                                  <p className="text-sm font-medium">Up to Date</p>
                                  <h3 className="text-2xl font-bold text-blue-600">{complianceData.upToDate}</h3>
                                </div>
                                <CheckCircle2 className="h-10 w-10 text-blue-200" />
                              </div>
                              <p className="text-xs text-muted-foreground mt-2">Employees with all certifications current</p>
                            </div>
                            
                            <div className="bg-white rounded-lg p-4 border border-red-100">
                              <div className="flex justify-between">
                                <div>
                                  <p className="text-sm font-medium">Expired</p>
                                  <h3 className="text-2xl font-bold text-red-600">{complianceData.expired}</h3>
                                </div>
                                <AlertTriangle className="h-10 w-10 text-red-200" />
                              </div>
                              <Button variant="outline" size="sm" className="mt-2 w-full text-red-600 border-red-200 hover:bg-red-50">
                                Urgent Review
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  <TabsContent value="certifications" className="space-y-4 mt-4">
                    <Card className="bg-gradient-to-br from-white to-blue-50 border border-blue-100">
                      <CardHeader>
                        <CardTitle className="flex items-center">
                          <GraduationCap className="mr-2 h-5 w-5 text-blue-600" />
                          Certification Status
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="overflow-x-auto">
                            <table className="w-full">
                              <thead>
                                <tr className="border-b">
                                  <th className="text-left p-2 text-sm font-medium">Certification</th>
                                  <th className="text-center p-2 text-sm font-medium">Active</th>
                                  <th className="text-center p-2 text-sm font-medium">Expiring Soon</th>
                                  <th className="text-center p-2 text-sm font-medium">Expired</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr className="border-b bg-white">
                                  <td className="p-2 text-sm">EMT-Basic</td>
                                  <td className="p-2 text-sm text-center text-green-600">12</td>
                                  <td className="p-2 text-sm text-center text-amber-500">2</td>
                                  <td className="p-2 text-sm text-center text-red-500">0</td>
                                </tr>
                                <tr className="border-b bg-white">
                                  <td className="p-2 text-sm">Paramedic</td>
                                  <td className="p-2 text-sm text-center text-green-600">8</td>
                                  <td className="p-2 text-sm text-center text-amber-500">1</td>
                                  <td className="p-2 text-sm text-center text-red-500">0</td>
                                </tr>
                                <tr className="border-b bg-white">
                                  <td className="p-2 text-sm">ACLS</td>
                                  <td className="p-2 text-sm text-center text-green-600">15</td>
                                  <td className="p-2 text-sm text-center text-amber-500">3</td>
                                  <td className="p-2 text-sm text-center text-red-500">1</td>
                                </tr>
                                <tr className="border-b bg-white">
                                  <td className="p-2 text-sm">CPR Instructor</td>
                                  <td className="p-2 text-sm text-center text-green-600">4</td>
                                  <td className="p-2 text-sm text-center text-amber-500">0</td>
                                  <td className="p-2 text-sm text-center text-red-500">1</td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                          <div className="flex justify-between">
                            <Button variant="outline" size="sm">Certification Calendar</Button>
                            <Button variant="outline" size="sm">
                              <FileCheck2 className="mr-2 h-4 w-4" />
                              Schedule Renewal
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  <TabsContent value="incidents" className="space-y-4 mt-4">
                    <Card className="bg-gradient-to-br from-white to-red-50 border border-red-100">
                      <CardHeader>
                        <CardTitle className="flex items-center">
                          <AlertTriangle className="mr-2 h-5 w-5 text-red-600" />
                          Incident Management
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="p-3 bg-white rounded-lg border border-red-100">
                            <div className="flex justify-between items-center">
                              <div>
                                <p className="font-medium">Vehicle Incident #IN-2023-42</p>
                                <p className="text-xs text-muted-foreground">Reported by J. Smith, Jun 12, 2023</p>
                              </div>
                              <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">In Progress</Badge>
                            </div>
                            <p className="text-sm mt-2">Minor damage to rear bumper during parking maneuver.</p>
                            <div className="flex justify-end mt-2">
                              <Button variant="ghost" size="sm" className="text-xs">View Details</Button>
                            </div>
                          </div>
                          
                          <div className="p-3 bg-white rounded-lg border border-red-100">
                            <div className="flex justify-between items-center">
                              <div>
                                <p className="font-medium">Workplace Injury #IN-2023-39</p>
                                <p className="text-xs text-muted-foreground">Reported by M. Johnson, Jun 8, 2023</p>
                              </div>
                              <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Resolved</Badge>
                            </div>
                            <p className="text-sm mt-2">Minor back strain while lifting equipment. No lost time.</p>
                            <div className="flex justify-end mt-2">
                              <Button variant="ghost" size="sm" className="text-xs">View Details</Button>
                            </div>
                          </div>
                          
                          <Button variant="outline" className="w-full">
                            View All Incidents
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  <TabsContent value="training" className="space-y-4 mt-4">
                    <Card className="bg-gradient-to-br from-white to-purple-50 border border-purple-100">
                      <CardHeader>
                        <CardTitle className="flex items-center">
                          <GraduationCap className="mr-2 h-5 w-5 text-purple-600" />
                          Training Progress
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="bg-white p-3 rounded-lg border border-purple-100">
                            <div className="flex justify-between items-center">
                              <p className="font-medium">Q2 Safety Training</p>
                              <Badge className="bg-green-100 text-green-800">85% Complete</Badge>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                              <div className="bg-green-600 h-2.5 rounded-full" style={{ width: '85%' }}></div>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">4 employees still need to complete</p>
                          </div>
                          
                          <div className="bg-white p-3 rounded-lg border border-purple-100">
                            <div className="flex justify-between items-center">
                              <p className="font-medium">New Protocol Training</p>
                              <Badge className="bg-amber-100 text-amber-800">61% Complete</Badge>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                              <div className="bg-amber-500 h-2.5 rounded-full" style={{ width: '61%' }}></div>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">Due in 7 days</p>
                          </div>
                          
                          <div className="bg-white p-3 rounded-lg border border-purple-100">
                            <div className="flex justify-between items-center">
                              <p className="font-medium">Defensive Driving Course</p>
                              <Badge className="bg-blue-100 text-blue-800">Upcoming</Badge>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">Scheduled for July 15-22</p>
                            <div className="flex justify-end mt-2">
                              <Button variant="outline" size="sm" className="text-xs">Send Reminder</Button>
                            </div>
                          </div>
                          
                          <Button variant="outline" className="w-full">Training Calendar</Button>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
                
                <HRAIRecommendations />
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
                
                <Card className="bg-gradient-to-br from-white to-blue-50 border border-blue-100">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <FileSpreadsheet className="mr-2 h-5 w-5 text-blue-600" />
                      HR Documents Status
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="bg-white p-3 rounded-lg border border-blue-100">
                        <div className="flex justify-between items-center">
                          <p className="font-medium text-sm">Benefits Enrollment</p>
                          <Badge className="bg-amber-100 text-amber-800">5 Pending</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">Deadline: June 30</p>
                      </div>
                      
                      <div className="bg-white p-3 rounded-lg border border-blue-100">
                        <div className="flex justify-between items-center">
                          <p className="font-medium text-sm">Annual Reviews</p>
                          <Badge className="bg-green-100 text-green-800">Up to date</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">Next batch due July 15</p>
                      </div>
                      
                      <div className="bg-white p-3 rounded-lg border border-blue-100">
                        <div className="flex justify-between items-center">
                          <p className="font-medium text-sm">Policy Updates</p>
                          <Badge className="bg-red-100 text-red-800">Action Required</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">Safety protocols update pending</p>
                      </div>
                    </div>
                    
                    <Button variant="outline" className="w-full mt-4 text-blue-700 border-blue-200 hover:bg-blue-50">
                      Document Repository
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
