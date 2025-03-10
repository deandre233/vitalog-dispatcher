
import { useEffect, useState } from "react";
import { HRLayout } from "@/components/layout/HRLayout";
import { HRDashboard } from "@/components/hr/HRDashboard";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Building2, FileText, Users, Clock, Award, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HRStatusCards } from "@/components/hr/dashboard/HRStatusCards";

export default function HRHome() {
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [buildVersion, setBuildVersion] = useState("2.3.5");

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Personnel Management Hub Loaded",
        description: "Latest workforce intelligence and analytics ready",
      });
    }, 1200);

    return () => clearTimeout(timer);
  }, []);

  // Simulated data that would come from an API
  const dashboardData = {
    onDuty: 11,
    onCall: 4,
    incidentsOpen: 2,
    scheduleRequests: 7,
    employeesStale: 4
  };

  return (
    <HRLayout>
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
        <header className="bg-white border-b sticky top-0 z-10">
          <div className="container mx-auto px-6 py-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-indigo-100 text-indigo-700 rounded-lg">
                    <Building2 className="h-6 w-6" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">Personnel Management Hub</h1>
                    <p className="text-sm text-gray-500">Enterprise HR Intelligence Center • Version {buildVersion}</p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Button variant="outline" size="sm" className="gap-2">
                  <FileText className="h-4 w-4" />
                  <span>Export</span>
                </Button>
                <Button variant="outline" size="sm" className="gap-2">
                  <Users className="h-4 w-4" />
                  <span>Directory</span>
                </Button>
                <Button variant="default" size="sm" className="gap-2 bg-indigo-600 hover:bg-indigo-700">
                  <Shield className="h-4 w-4" />
                  <span>Admin Panel</span>
                </Button>
              </div>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-6 py-8">
          {isLoading ? (
            <div className="space-y-6">
              <Skeleton className="h-8 w-64 mb-6" />
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-32 w-full rounded-xl" />
                ))}
              </div>
              <Skeleton className="h-10 w-full max-w-md mt-8 mb-4" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Skeleton className="h-[400px] rounded-xl" />
                <Skeleton className="h-[400px] rounded-xl" />
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                <div className="col-span-3 space-y-8">
                  <HRStatusCards data={dashboardData} />
                  
                  <Tabs defaultValue="analytics" className="w-full">
                    <TabsList className="w-full justify-start bg-white border rounded-lg p-1">
                      <TabsTrigger value="analytics" className="rounded-md data-[state=active]:bg-indigo-100 data-[state=active]:text-indigo-700">
                        <Clock className="h-4 w-4 mr-2" />
                        Analytics
                      </TabsTrigger>
                      <TabsTrigger value="personnel" className="rounded-md data-[state=active]:bg-indigo-100 data-[state=active]:text-indigo-700">
                        <Users className="h-4 w-4 mr-2" />
                        Personnel
                      </TabsTrigger>
                      <TabsTrigger value="certifications" className="rounded-md data-[state=active]:bg-indigo-100 data-[state=active]:text-indigo-700">
                        <Award className="h-4 w-4 mr-2" />
                        Certifications
                      </TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="analytics" className="mt-6">
                      <Card className="overflow-hidden border-none shadow-lg">
                        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6 text-white">
                          <h3 className="text-xl font-bold">Workforce Intelligence • AI Powered</h3>
                          <p className="opacity-80 text-sm mt-1">Advanced analytics and real-time metrics for optimal personnel management</p>
                        </div>
                        <div className="p-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Card className="border border-indigo-100 bg-indigo-50/50 p-4">
                              <div className="flex items-center gap-3">
                                <div className="p-2 rounded-full bg-indigo-100">
                                  <Clock className="h-5 w-5 text-indigo-600" />
                                </div>
                                <div>
                                  <h4 className="font-medium">Shift Optimization</h4>
                                  <p className="text-sm text-gray-500">AI recommends 3 schedule adjustments</p>
                                </div>
                              </div>
                            </Card>
                            <Card className="border border-amber-100 bg-amber-50/50 p-4">
                              <div className="flex items-center gap-3">
                                <div className="p-2 rounded-full bg-amber-100">
                                  <Users className="h-5 w-5 text-amber-600" />
                                </div>
                                <div>
                                  <h4 className="font-medium">Staff Balancing</h4>
                                  <p className="text-sm text-gray-500">Coverage gap detected for Thursday</p>
                                </div>
                              </div>
                            </Card>
                            <Card className="border border-emerald-100 bg-emerald-50/50 p-4">
                              <div className="flex items-center gap-3">
                                <div className="p-2 rounded-full bg-emerald-100">
                                  <Award className="h-5 w-5 text-emerald-600" />
                                </div>
                                <div>
                                  <h4 className="font-medium">Certification Analysis</h4>
                                  <p className="text-sm text-gray-500">2 renewals needed within 30 days</p>
                                </div>
                              </div>
                            </Card>
                            <Card className="border border-purple-100 bg-purple-50/50 p-4">
                              <div className="flex items-center gap-3">
                                <div className="p-2 rounded-full bg-purple-100">
                                  <Shield className="h-5 w-5 text-purple-600" />
                                </div>
                                <div>
                                  <h4 className="font-medium">Compliance Report</h4>
                                  <p className="text-sm text-gray-500">97% adherence to policies</p>
                                </div>
                              </div>
                            </Card>
                          </div>
                          
                          <div className="mt-6 flex justify-end">
                            <Button variant="outline" className="text-indigo-600 border-indigo-200 hover:bg-indigo-50">
                              View Full Intelligence Report
                            </Button>
                          </div>
                        </div>
                      </Card>
                    </TabsContent>
                    
                    <TabsContent value="personnel" className="mt-6">
                      <Card className="overflow-hidden border-none shadow-lg">
                        <div className="bg-gradient-to-r from-blue-500 to-cyan-600 p-6 text-white">
                          <h3 className="text-xl font-bold">Personnel Overview</h3>
                          <p className="opacity-80 text-sm mt-1">Comprehensive workforce management and team structure</p>
                        </div>
                        <div className="p-6">
                          <div className="space-y-4">
                            <div className="flex items-center justify-between pb-2 border-b">
                              <h4 className="font-medium">Current Staffing Level</h4>
                              <span className="text-emerald-600 font-medium">96% (Optimal)</span>
                            </div>
                            <div className="flex items-center justify-between pb-2 border-b">
                              <h4 className="font-medium">Open Positions</h4>
                              <span className="text-amber-600 font-medium">3 Roles</span>
                            </div>
                            <div className="flex items-center justify-between pb-2 border-b">
                              <h4 className="font-medium">New Applications</h4>
                              <span className="text-blue-600 font-medium">7 Pending Review</span>
                            </div>
                            <div className="flex items-center justify-between pb-2 border-b">
                              <h4 className="font-medium">Retention Rate</h4>
                              <span className="text-emerald-600 font-medium">94% (Last 12 months)</span>
                            </div>
                          </div>
                          
                          <div className="mt-6 flex justify-end">
                            <Button variant="outline" className="text-blue-600 border-blue-200 hover:bg-blue-50">
                              Manage Personnel Directory
                            </Button>
                          </div>
                        </div>
                      </Card>
                    </TabsContent>
                    
                    <TabsContent value="certifications" className="mt-6">
                      <Card className="overflow-hidden border-none shadow-lg">
                        <div className="bg-gradient-to-r from-amber-500 to-orange-600 p-6 text-white">
                          <h3 className="text-xl font-bold">Certification Management</h3>
                          <p className="opacity-80 text-sm mt-1">Track, manage and automatically notify about certifications</p>
                        </div>
                        <div className="p-6">
                          <div className="space-y-4">
                            <div className="p-4 bg-amber-50 border border-amber-100 rounded-lg">
                              <div className="flex items-center gap-3">
                                <div className="p-2 rounded-full bg-amber-100">
                                  <Award className="h-5 w-5 text-amber-600" />
                                </div>
                                <div>
                                  <h4 className="font-medium">Expiring Certifications</h4>
                                  <p className="text-sm text-gray-500">2 certifications expiring in 30 days</p>
                                </div>
                              </div>
                              <div className="mt-4 pl-12">
                                <div className="text-sm text-gray-600 space-y-2">
                                  <div className="flex justify-between">
                                    <span>Johnson, Michael - Advanced Life Support</span>
                                    <span className="text-amber-600">13 days</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span>Williams, Sarah - EMT Recertification</span>
                                    <span className="text-amber-600">28 days</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="mt-6 flex justify-end">
                            <Button variant="outline" className="text-amber-600 border-amber-200 hover:bg-amber-50">
                              Certification Dashboard
                            </Button>
                          </div>
                        </div>
                      </Card>
                    </TabsContent>
                  </Tabs>
                </div>
                
                <div className="col-span-2 space-y-6">
                  <Card className="overflow-hidden border-none shadow-lg">
                    <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-6 text-white">
                      <h3 className="text-xl font-bold">AI Workforce Insights</h3>
                      <p className="opacity-80 text-sm mt-1">Machine learning driven recommendations</p>
                    </div>
                    <div className="p-6">
                      <div className="space-y-4">
                        <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg">
                          <h4 className="font-medium text-blue-700 flex items-center">
                            <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                            Staffing Optimization
                          </h4>
                          <p className="mt-1 text-sm text-gray-600">
                            AI analysis suggests reassigning 2 team members from evening shift to morning shift on Tuesdays to optimize coverage based on historical incident data.
                          </p>
                        </div>
                        
                        <div className="p-4 bg-purple-50 border border-purple-100 rounded-lg">
                          <h4 className="font-medium text-purple-700 flex items-center">
                            <span className="inline-block w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                            Training Opportunity
                          </h4>
                          <p className="mt-1 text-sm text-gray-600">
                            Based on performance data, 5 employees would benefit from advanced communication training. Projected 12% efficiency improvement.
                          </p>
                        </div>
                        
                        <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-lg">
                          <h4 className="font-medium text-emerald-700 flex items-center">
                            <span className="inline-block w-2 h-2 bg-emerald-500 rounded-full mr-2"></span>
                            Wellness Alert
                          </h4>
                          <p className="mt-1 text-sm text-gray-600">
                            Team stress indicators are 23% higher than baseline. Consider scheduling wellness activities and reviewing workload distribution.
                          </p>
                        </div>
                      </div>
                      
                      <div className="mt-6">
                        <Button className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700">
                          Generate Advanced AI Analysis Report
                        </Button>
                      </div>
                    </div>
                  </Card>
                  
                  <Card className="overflow-hidden border-none shadow-lg">
                    <div className="bg-gradient-to-r from-gray-700 to-gray-900 p-6 text-white">
                      <h3 className="text-xl font-bold">Upcoming Events</h3>
                      <p className="opacity-80 text-sm mt-1">Scheduled activities and important dates</p>
                    </div>
                    <div className="p-6">
                      <div className="space-y-4">
                        <div className="border-l-4 border-indigo-500 pl-4 py-2">
                          <p className="font-medium">Quarterly Team Review</p>
                          <p className="text-sm text-gray-500">Today, 3:00 PM • Conference Room A</p>
                        </div>
                        <div className="border-l-4 border-emerald-500 pl-4 py-2">
                          <p className="font-medium">New Employee Orientation</p>
                          <p className="text-sm text-gray-500">Tomorrow, 9:00 AM • Training Center</p>
                        </div>
                        <div className="border-l-4 border-amber-500 pl-4 py-2">
                          <p className="font-medium">Leadership Workshop</p>
                          <p className="text-sm text-gray-500">Friday, 1:00 PM • Virtual Meeting</p>
                        </div>
                      </div>
                      
                      <div className="mt-6 flex justify-center">
                        <Button variant="outline" className="w-full">
                          View Full Calendar
                        </Button>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </HRLayout>
  );
}
