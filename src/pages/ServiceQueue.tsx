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

  const getPriorityColor = (priority: ServiceRequest['priority']) => {
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
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <div className="flex-1 flex">
        <SidebarProvider>
          <AppSidebar />
          <div className="flex-1 bg-[#f4f7fc] overflow-auto">
            <DashboardHeader />
            <main className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Queue Section */}
                <div className="lg:col-span-2 space-y-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <h2 className="text-2xl font-semibold">Service Queue</h2>
                      <p className="text-gray-500">Manage transport requests and scheduling</p>
                    </div>
                    <Button 
                      onClick={handleNewRequest}
                      className="bg-medical-secondary hover:bg-medical-secondary/90 text-white"
                    >
                      New Request
                    </Button>
                  </div>

                  <Card className="p-6">
                    <Tabs defaultValue="pending" onValueChange={setSelectedTab}>
                      <TabsList className="mb-4">
                        <TabsTrigger value="pending">
                          Pending
                          <Badge variant="secondary" className="ml-2">
                            {requests?.pending?.length || 0}
                          </Badge>
                        </TabsTrigger>
                        <TabsTrigger value="inProgress">
                          In Progress
                          <Badge variant="secondary" className="ml-2">
                            {requests?.inProgress?.length || 0}
                          </Badge>
                        </TabsTrigger>
                        <TabsTrigger value="completed">
                          Completed
                          <Badge variant="secondary" className="ml-2">
                            {requests?.completed?.length || 0}
                          </Badge>
                        </TabsTrigger>
                      </TabsList>

                      <ScrollArea className="h-[600px] pr-4">
                        <TabsContent value="pending" className="space-y-4">
                          {requests?.pending?.map((request) => (
                            <Card key={request.id} className="p-4 hover:shadow-md transition-shadow">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h3 className="font-medium">{request.patientName}</h3>
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
                                <Button variant="outline" size="sm">
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
                  <Card className="p-6">
                    <AIInsightsPanel 
                      insights={aiInsights}
                    />
                  </Card>

                  <Card className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Queue Metrics</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Users className="h-5 w-5 text-blue-500 mr-2" />
                          <span>Active Requests</span>
                        </div>
                        <span className="font-semibold">{metrics.activeRequests}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Timer className="h-5 w-5 text-green-500 mr-2" />
                          <span>Avg. Response Time</span>
                        </div>
                        <span className="font-semibold">{metrics.avgResponseTime}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <ArrowUpRight className="h-5 w-5 text-purple-500 mr-2" />
                          <span>Completion Rate</span>
                        </div>
                        <span className="font-semibold">{metrics.completionRate}%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Brain className="h-5 w-5 text-indigo-500 mr-2" />
                          <span>AI Efficiency Score</span>
                        </div>
                        <span className="font-semibold">{metrics.efficiency}%</span>
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