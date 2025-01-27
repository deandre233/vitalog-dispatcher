import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/navigation/AppSidebar";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Brain, TrendingUp, AlertTriangle, Calendar } from "lucide-react";
import { AIInsightsPanel } from "@/components/dispatch/ai/AIInsightsPanel";
import { DatePicker } from "@/components/ui/date-picker";
import { useState } from "react";
import { toast } from "sonner";

export function Reports() {
  const [dateRange, setDateRange] = useState<Date>(new Date());

  const { data: dispatchData, isLoading } = useQuery({
    queryKey: ['dispatch-analytics'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('transport_records')
        .select('*')
        .gte('created_at', new Date(dateRange.setMonth(dateRange.getMonth() - 1)).toISOString())
        .order('created_at', { ascending: true });

      if (error) {
        toast.error("Failed to fetch dispatch data");
        throw error;
      }

      return data || [];
    },
  });

  const { data: aiInsights } = useQuery({
    queryKey: ['ai-insights'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ai_analysis_results')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) {
        toast.error("Failed to fetch AI insights");
        throw error;
      }

      return data?.map(insight => ({
        type: insight.analysis_type as 'optimization' | 'warning' | 'prediction',
        message: insight.prediction || '',
        confidence: insight.confidence_score,
        impact: insight.confidence_score > 0.8 ? 'high' : 
                insight.confidence_score > 0.6 ? 'medium' : 'low'
      })) as AIInsight[] || [];
    }
  });

  const processedData = dispatchData?.reduce((acc: any[], record) => {
    const date = new Date(record.created_at).toLocaleDateString();
    const existing = acc.find(item => item.date === date);
    
    if (existing) {
      existing.count += 1;
      existing.efficiency = (existing.efficiency + (record.efficiency || 0)) / 2;
    } else {
      acc.push({
        date,
        count: 1,
        efficiency: record.efficiency || 0
      });
    }
    
    return acc;
  }, []) || [];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <div className="flex-1 flex">
        <SidebarProvider>
          <AppSidebar />
          <div className="flex-1 bg-[#f4f7fc] overflow-auto">
            <DashboardHeader />
            <main className="p-6 space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold">Dispatch Analytics & Reports</h2>
                <div className="flex items-center gap-4">
                  <Calendar className="h-5 w-5 text-gray-500" />
                  <DatePicker
                    date={dateRange}
                    onDateChange={setDateRange}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div className="lg:col-span-3">
                  <Card className="p-6">
                    <Tabs defaultValue="efficiency">
                      <TabsList className="mb-4">
                        <TabsTrigger value="efficiency">Efficiency Analysis</TabsTrigger>
                        <TabsTrigger value="volume">Dispatch Volume</TabsTrigger>
                        <TabsTrigger value="patterns">Pattern Analysis</TabsTrigger>
                      </TabsList>

                      <TabsContent value="efficiency" className="h-[400px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={processedData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip />
                            <Line 
                              type="monotone" 
                              dataKey="efficiency" 
                              stroke="#2563eb" 
                              strokeWidth={2}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </TabsContent>

                      <TabsContent value="volume" className="h-[400px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={processedData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip />
                            <Line 
                              type="monotone" 
                              dataKey="count" 
                              stroke="#16a34a" 
                              strokeWidth={2}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </TabsContent>

                      <TabsContent value="patterns">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <Card className="p-4 bg-white/50">
                            <div className="flex items-center gap-2 mb-2">
                              <TrendingUp className="h-5 w-5 text-blue-500" />
                              <h3 className="font-medium">Peak Hours</h3>
                            </div>
                            <p className="text-sm text-gray-600">
                              Analysis shows highest dispatch volume between 8 AM - 11 AM
                            </p>
                          </Card>
                          
                          <Card className="p-4 bg-white/50">
                            <div className="flex items-center gap-2 mb-2">
                              <AlertTriangle className="h-5 w-5 text-yellow-500" />
                              <h3 className="font-medium">Bottlenecks</h3>
                            </div>
                            <p className="text-sm text-gray-600">
                              Resource constraints identified during peak hours
                            </p>
                          </Card>
                          
                          <Card className="p-4 bg-white/50">
                            <div className="flex items-center gap-2 mb-2">
                              <Brain className="h-5 w-5 text-purple-500" />
                              <h3 className="font-medium">AI Predictions</h3>
                            </div>
                            <p className="text-sm text-gray-600">
                              Expected 15% increase in dispatch volume next week
                            </p>
                          </Card>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </Card>
                </div>

                <div className="lg:col-span-1">
                  <AIInsightsPanel 
                    insights={aiInsights || []}
                    className="sticky top-6"
                  />
                </div>
              </div>
            </main>
          </div>
        </SidebarProvider>
      </div>
      <Footer />
    </div>
  );
}
