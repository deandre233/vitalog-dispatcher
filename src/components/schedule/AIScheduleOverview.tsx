import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Brain, Calendar, Clock, Users, AlertTriangle, ArrowUpDown, BarChart } from "lucide-react";
import { toast } from "sonner";
import { useAIRecommendations } from "@/hooks/useAIRecommendations";
import { useTransportRecords } from "@/hooks/useTransportRecords";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function AIScheduleOverview() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const { data: aiRecommendations } = useAIRecommendations();
  const { data: transportRecords } = useTransportRecords();
  const [resourceUtilization, setResourceUtilization] = useState(0);

  // Fetch AI analysis results
  const { data: aiAnalysis } = useQuery({
    queryKey: ['ai_analysis'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ai_analysis_results')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1);

      if (error) throw error;
      return data[0];
    }
  });

  useEffect(() => {
    // Calculate resource utilization
    if (transportRecords) {
      const totalCapacity = 100; // Example capacity
      const utilization = (transportRecords.length / totalCapacity) * 100;
      setResourceUtilization(utilization);
    }
  }, [transportRecords]);

  const handleOptimizeSchedule = () => {
    toast.success("Schedule optimization in progress");
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Calendar className="h-6 w-6 text-medical-secondary" />
          Schedule Overview
        </h1>
        <Button 
          onClick={handleOptimizeSchedule}
          className="bg-medical-secondary hover:bg-medical-secondary/90"
        >
          <Brain className="h-4 w-4 mr-2" />
          Optimize Schedule
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* AI Insights Card */}
        <Card className="p-4 bg-gradient-to-br from-medical-accent/10 to-medical-secondary/10">
          <div className="flex items-center gap-2 mb-4">
            <Brain className="h-5 w-5 text-medical-secondary" />
            <h3 className="font-semibold">AI Insights</h3>
          </div>
          <div className="space-y-2">
            {aiAnalysis?.suggestions?.map((suggestion: string, index: number) => (
              <Alert key={index} className="bg-white/50">
                <AlertDescription>{suggestion}</AlertDescription>
              </Alert>
            ))}
          </div>
        </Card>

        {/* Resource Utilization Card */}
        <Card className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50">
          <div className="flex items-center gap-2 mb-4">
            <BarChart className="h-5 w-5 text-blue-600" />
            <h3 className="font-semibold">Resource Utilization</h3>
          </div>
          <Progress value={resourceUtilization} className="mb-2" />
          <p className="text-sm text-gray-600">
            Current utilization: {Math.round(resourceUtilization)}%
          </p>
        </Card>

        {/* Schedule Metrics Card */}
        <Card className="p-4 bg-gradient-to-br from-green-50 to-emerald-50">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="h-5 w-5 text-green-600" />
            <h3 className="font-semibold">Schedule Metrics</h3>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>On-time Performance</span>
              <span className="font-medium">94%</span>
            </div>
            <div className="flex justify-between">
              <span>Average Response Time</span>
              <span className="font-medium">12 min</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Schedule Timeline */}
      <Card className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold flex items-center gap-2">
            <Users className="h-5 w-5 text-medical-secondary" />
            Crew Assignments
          </h3>
          <Button variant="outline" size="sm">
            <ArrowUpDown className="h-4 w-4 mr-2" />
            Sort
          </Button>
        </div>
        
        {/* Add timeline visualization here */}
        <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
          <p className="text-gray-500">Timeline visualization coming soon</p>
        </div>
      </Card>

      {/* Warnings and Alerts */}
      {aiAnalysis?.prediction && (
        <Alert className="bg-orange-50 border-orange-200">
          <AlertTriangle className="h-4 w-4 text-orange-500" />
          <AlertDescription className="text-orange-700">
            {aiAnalysis.prediction}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}