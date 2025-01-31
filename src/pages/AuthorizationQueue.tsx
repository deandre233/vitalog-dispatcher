import { useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/navigation/AppSidebar";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuthorizationQueue } from "@/hooks/useAuthorizationQueue";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { AuthorizationRequest, AIRecommendation } from "@/types/authorization";
import { cn } from "@/lib/utils";

const AuthorizationQueue = () => {
  const { requests, isLoading, updateRequest, metrics, aiRecommendations } = useAuthorizationQueue();
  const [searchTerm, setSearchTerm] = useState("");

  const getPriorityColor = (priority: AuthorizationRequest["priority"]) => {
    const colors = {
      critical: "bg-red-100 text-red-700",
      high: "bg-orange-100 text-orange-700",
      medium: "bg-yellow-100 text-yellow-700",
      low: "bg-green-100 text-green-700",
    };
    return colors[priority] || colors.medium;
  };

  const getStatusColor = (status: AuthorizationRequest["status"]) => {
    const colors = {
      pending: "bg-blue-100 text-blue-700",
      approved: "bg-green-100 text-green-700",
      rejected: "bg-red-100 text-red-700",
      expired: "bg-gray-100 text-gray-700",
    };
    return colors[status] || colors.pending;
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <Header />
      <div className="flex-1 flex">
        <SidebarProvider>
          <AppSidebar />
          <div className="flex-1 bg-[#f4f7fc] dark:bg-gray-800 overflow-auto">
            <DashboardHeader />
            <main className="p-6 space-y-6">
              {/* Metrics Section */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="p-4 bg-white/50 dark:bg-gray-800/50 backdrop-blur-lg border-none shadow-lg">
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Pending Requests</h3>
                  <p className="text-2xl font-bold text-primary">{metrics.pendingCount}</p>
                </Card>
                <Card className="p-4 bg-white/50 dark:bg-gray-800/50 backdrop-blur-lg border-none shadow-lg">
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Approval Rate</h3>
                  <p className="text-2xl font-bold text-primary">{metrics.approvalRate}%</p>
                </Card>
                <Card className="p-4 bg-white/50 dark:bg-gray-800/50 backdrop-blur-lg border-none shadow-lg">
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Avg. Response Time</h3>
                  <p className="text-2xl font-bold text-primary">{metrics.averageResponseTime}</p>
                </Card>
                <Card className="p-4 bg-white/50 dark:bg-gray-800/50 backdrop-blur-lg border-none shadow-lg">
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Critical Requests</h3>
                  <p className="text-2xl font-bold text-primary">{metrics.criticalRequests}</p>
                </Card>
              </div>

              {/* AI Insights Section */}
              <Card className="p-6 bg-gradient-to-br from-purple-500/10 to-blue-500/10 backdrop-blur-lg border-none shadow-lg">
                <h2 className="text-lg font-semibold mb-4 text-primary">AI Insights & Recommendations</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {aiRecommendations.map((rec, index) => (
                    <Card key={index} className="p-4 bg-white/50 dark:bg-gray-800/50">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-medium text-primary">{rec.suggestion}</h3>
                        <Badge variant="outline" className={cn(
                          "ml-2",
                          rec.impact === "high" && "bg-red-100 text-red-700",
                          rec.impact === "medium" && "bg-yellow-100 text-yellow-700",
                          rec.impact === "low" && "bg-green-100 text-green-700"
                        )}>
                          {rec.impact} impact
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300">{rec.reasoning}</p>
                      <div className="mt-2 flex items-center">
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-primary rounded-full h-2"
                            style={{ width: `${rec.confidence * 100}%` }}
                          />
                        </div>
                        <span className="ml-2 text-sm text-gray-600">
                          {Math.round(rec.confidence * 100)}% confidence
                        </span>
                      </div>
                    </Card>
                  ))}
                </div>
              </Card>

              {/* Main Queue Section */}
              <Card className="p-6 bg-white/50 dark:bg-gray-800/50 backdrop-blur-lg border-none shadow-lg">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-lg font-semibold text-primary">Authorization Queue</h2>
                  <div className="flex gap-4">
                    <Input
                      placeholder="Search requests..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="max-w-xs"
                    />
                    <Button>New Request</Button>
                  </div>
                </div>

                <Tabs defaultValue="all" className="w-full">
                  <TabsList>
                    <TabsTrigger value="all">All Requests</TabsTrigger>
                    <TabsTrigger value="pending">Pending</TabsTrigger>
                    <TabsTrigger value="approved">Approved</TabsTrigger>
                    <TabsTrigger value="rejected">Rejected</TabsTrigger>
                  </TabsList>

                  <TabsContent value="all" className="mt-4">
                    <div className="rounded-lg border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Patient</TableHead>
                            <TableHead>Service Type</TableHead>
                            <TableHead>Priority</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Requested By</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {isLoading ? (
                            Array(5).fill(0).map((_, i) => (
                              <TableRow key={i}>
                                <TableCell><Skeleton className="h-4 w-[200px]" /></TableCell>
                                <TableCell><Skeleton className="h-4 w-[150px]" /></TableCell>
                                <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
                                <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
                                <TableCell><Skeleton className="h-4 w-[150px]" /></TableCell>
                                <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
                              </TableRow>
                            ))
                          ) : (
                            requests?.map((request) => (
                              <TableRow key={request.id}>
                                <TableCell>
                                  {request.patients?.first_name} {request.patients?.last_name}
                                </TableCell>
                                <TableCell>{request.service_type}</TableCell>
                                <TableCell>
                                  <Badge className={getPriorityColor(request.priority)}>
                                    {request.priority}
                                  </Badge>
                                </TableCell>
                                <TableCell>
                                  <Badge className={getStatusColor(request.status)}>
                                    {request.status}
                                  </Badge>
                                </TableCell>
                                <TableCell>{request.requested_by}</TableCell>
                                <TableCell>
                                  <Button variant="outline" size="sm">
                                    View Details
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  </TabsContent>
                </Tabs>
              </Card>
            </main>
          </div>
        </SidebarProvider>
      </div>
      <Footer />
    </div>
  );
};

export default AuthorizationQueue;
