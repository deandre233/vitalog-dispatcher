import { useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/navigation/AppSidebar";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Calendar, Clock, AlertTriangle, Users, Timer, ArrowUpRight, Brain } from "lucide-react";
import { useServiceQueue } from "@/hooks/useServiceQueue";
import { AIInsightsPanel } from "@/components/dispatch/ai/AIInsightsPanel";
import { ServiceRequest } from "@/types/service-queue";

export const ServiceQueue = () => {
  const [selectedTab, setSelectedTab] = useState("pending");
  const { 
    requests, 
    isLoading, 
    aiInsights,
    metrics,
    addRequest 
  } = useServiceQueue();

  const handleNewRequest = () => {
    // Implementation for new request modal
    console.log("Opening new request modal");
  };

  const getPriorityColor = (priority: 'low' | 'medium' | 'high') => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-700';
      case 'medium':
        return 'bg-yellow-100 text-yellow-700';
      case 'low':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-100">
      <Header />
      <div className="flex-1 flex">
        <SidebarProvider>
          <AppSidebar />
          <div className="flex-1 bg-[#f4f7fc] overflow-auto rounded-tl-2xl shadow-inner">
            <DashboardHeader />
            <main className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Queue Section */}
                <div className="lg:col-span-2 space-y-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <h2 className="text-2xl font-semibold bg-gradient-to-r from-medical-primary to-medical-secondary bg-clip-text text-transparent">
                        Service Queue
                      </h2>
                      <p className="text-gray-500">Manage transport requests and scheduling</p>
                    </div>
                    <Button 
                      onClick={handleNewRequest}
                      className="bg-gradient-to-r from-medical-gradient-start to-medical-gradient-end text-white hover:shadow-md transition-all duration-300"
                    >
                      New Request
                    </Button>
                  </div>

                  <Card className="p-6 shadow-lg hover:shadow-xl transition-all duration-300 border-none">
                    <Tabs defaultValue="pending" onValueChange={setSelectedTab}>
                      <TabsList className="mb-4 bg-gray-100/80">
                        <TabsTrigger value="pending" className="data-[state=active]:bg-white data-[state=active]:text-medical-primary">
                          Pending
                          <Badge variant="secondary" className="ml-2 bg-medical-secondary/20 text-medical-primary">
                            {requests?.pending?.length || 0}
                          </Badge>
                        </TabsTrigger>
                        <TabsTrigger value="inProgress" className="data-[state=active]:bg-white data-[state=active]:text-medical-primary">
                          In Progress
                          <Badge variant="secondary" className="ml-2 bg-medical-secondary/20 text-medical-primary">
                            {requests?.inProgress?.length || 0}
                          </Badge>
                        </TabsTrigger>
                        <TabsTrigger value="completed" className="data-[state=active]:bg-white data-[state=active]:text-medical-primary">
                          Completed
                          <Badge variant="secondary" className="ml-2 bg-medical-secondary/20 text-medical-primary">
                            {requests?.completed?.length || 0}
                          </Badge>
                        </TabsTrigger>
                      </TabsList>

                      <ScrollArea className="h-[600px] pr-4">
                        <TabsContent value="pending" className="space-y-4">
                          {requests?.pending?.map((request) => (
                            <Card key={request.id} className="p-4 hover:shadow-md transition-shadow border border-gray-100 hover:border-medical-secondary/20">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h3 className="font-medium text-medical-primary">{request.patientName}</h3>
                                  <div className="flex items-center text-sm text-gray-500 mt-1">
                                    <Calendar className="h-4 w-4 mr-1" />
                                    {request.serviceDate}
                                    <Clock className="h-4 w-4 ml-3 mr-1" />
                                    {request.scheduledTime}
                                  </div>
                                  <div className="mt-2 flex gap-2">
                                    <Badge 
                                      className={getPriorityColor(request.priority)}
                                    >
                                      {request.priority} Priority
                                    </Badge>
                                    <Badge variant="outline">
                                      {request.tripType}
                                    </Badge>
                                  </div>
                                </div>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  className="border-medical-secondary/30 text-medical-primary hover:bg-medical-secondary/10"
                                >
                                  View Details
                                </Button>
                              </div>
                            </Card>
                          ))}
                        </TabsContent>
                        
                        {/* Similar content for other tabs */}
                      </ScrollArea>
                    </Tabs>
                  </Card>
                </div>

                {/* AI Insights & Metrics Section */}
                <div className="space-y-6">
                  <Card className="p-6 shadow-lg border-l-4 border-l-medical-primary bg-gradient-to-br from-white to-blue-50/30">
                    <AIInsightsPanel 
                      insights={aiInsights}
                    />
                  </Card>

                  <Card className="p-6 shadow-lg border-l-4 border-l-medical-secondary">
                    <h3 className="text-lg font-semibold mb-4 text-medical-primary">Queue Metrics</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Users className="h-5 w-5 text-blue-500 mr-2" />
                          <span className="text-gray-700">Active Requests</span>
                        </div>
                        <span className="font-semibold text-medical-primary">{metrics.activeRequests}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Timer className="h-5 w-5 text-green-500 mr-2" />
                          <span className="text-gray-700">Avg. Response Time</span>
                        </div>
                        <span className="font-semibold text-medical-primary">{metrics.avgResponseTime}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <ArrowUpRight className="h-5 w-5 text-purple-500 mr-2" />
                          <span className="text-gray-700">Completion Rate</span>
                        </div>
                        <span className="font-semibold text-medical-primary">{metrics.completionRate}%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Brain className="h-5 w-5 text-indigo-500 mr-2" />
                          <span className="text-gray-700">AI Efficiency Score</span>
                        </div>
                        <span className="font-semibold text-medical-primary">{metrics.efficiency}%</span>
                      </div>
                    </div>
                  </Card>
                  
                  <Card className="p-4 shadow-md border-l-4 border-l-[#6E59A5] bg-gradient-to-br from-white to-[#F1F0FB]">
                    <div className="flex items-center gap-2 mb-3">
                      <Brain className="h-5 w-5 text-[#6E59A5]" />
                      <h3 className="font-semibold text-[#6E59A5]">AI Recommendations</h3>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-gray-600">Based on current queue status:</p>
                      <div className="bg-white p-3 rounded-md shadow-sm border border-[#6E59A5]/10">
                        <p className="text-sm text-[#6E59A5]">Consider reassigning Crew #12 to handle the high-priority requests in the northern district.</p>
                      </div>
                      <div className="bg-white p-3 rounded-md shadow-sm border border-[#6E59A5]/10">
                        <p className="text-sm text-[#6E59A5]">Traffic congestion detected on I-85. Suggest alternative routes for dispatches #1234 and #1235.</p>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            </main>
          </div>
        </SidebarProvider>
      </div>
      <Footer />
    </div>
  );
};
