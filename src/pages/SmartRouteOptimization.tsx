
import { useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/navigation/AppSidebar";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { RouteOptimizationForm } from "@/components/route-optimization/RouteOptimizationForm";
import { RouteMapDisplay } from "@/components/route-optimization/RouteMapDisplay";
import { AIRouteInsights } from "@/components/route-optimization/AIRouteInsights";
import { RouteOptimizationProvider } from "@/components/route-optimization/RouteOptimizationContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Route, Brain, TrendingUp, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

export function SmartRouteOptimization() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <div className="flex-1 flex">
        <SidebarProvider>
          <AppSidebar />
          <div className="flex-1 bg-[#f4f7fc] overflow-auto">
            <DashboardHeader />
            <main className="p-6">
              <div className="mb-6 flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-semibold flex items-center gap-2">
                    <Route className="h-6 w-6 text-medical-primary" />
                    Smart Route Optimization
                  </h2>
                  <p className="text-gray-500">AI-powered route planning for maximum efficiency</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                  className="hidden md:flex items-center gap-1"
                >
                  {sidebarCollapsed ? (
                    <>
                      <PanelLeftOpen className="h-4 w-4" />
                      <span>Expand Panel</span>
                    </>
                  ) : (
                    <>
                      <PanelLeftClose className="h-4 w-4" />
                      <span>Collapse Panel</span>
                    </>
                  )}
                </Button>
              </div>

              <RouteOptimizationProvider>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className={`${sidebarCollapsed ? 'lg:col-span-0 lg:hidden' : 'lg:col-span-1'} space-y-6`}>
                    <RouteOptimizationForm />
                  </div>
                  
                  <div className={`${sidebarCollapsed ? 'lg:col-span-3' : 'lg:col-span-2'}`}>
                    <Tabs defaultValue="map" className="w-full">
                      <TabsList className="mb-4">
                        <TabsTrigger value="map" className="flex items-center gap-1">
                          <Route className="h-4 w-4" />
                          Route Map
                        </TabsTrigger>
                        <TabsTrigger value="ai-insights" className="flex items-center gap-1">
                          <Brain className="h-4 w-4" />
                          AI Insights
                        </TabsTrigger>
                        <TabsTrigger value="analytics" className="flex items-center gap-1">
                          <TrendingUp className="h-4 w-4" />
                          Analytics
                        </TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="map" className="mt-0">
                        <RouteMapDisplay />
                      </TabsContent>
                      
                      <TabsContent value="ai-insights" className="mt-0">
                        <AIRouteInsights />
                      </TabsContent>
                      
                      <TabsContent value="analytics" className="mt-0">
                        <div className="bg-white rounded-lg shadow p-6 min-h-[600px]">
                          <h3 className="text-xl font-medium mb-4 flex items-center gap-2">
                            <TrendingUp className="h-5 w-5 text-medical-accent" />
                            Route Performance Analytics
                          </h3>
                          <p className="text-gray-500">Advanced analytics will be available in the next update.</p>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </div>
                </div>
              </RouteOptimizationProvider>
            </main>
          </div>
        </SidebarProvider>
      </div>
      <Footer />
    </div>
  );
}
