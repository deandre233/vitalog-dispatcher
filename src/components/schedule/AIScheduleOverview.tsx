import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Brain, Calendar, Clock, Users, AlertTriangle, ArrowUpDown, BarChart, Car } from "lucide-react";
import { toast } from "sonner";
import { useAIRecommendations } from "@/hooks/useAIRecommendations";
import { useTransportRecords } from "@/hooks/useTransportRecords";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format, addDays, subDays, isSameDay } from "date-fns";
import { analyzeDispatchEfficiency, type DispatchAnalytics } from "@/utils/aiDispatchAnalytics";
import { predictTraffic, type TrafficPrediction } from "@/utils/aiDispatchOptimization";

export function AIScheduleOverview() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const { data: aiRecommendations } = useAIRecommendations();
  const { transportRecords } = useTransportRecords();
  const [resourceUtilization, setResourceUtilization] = useState(0);
  const [trafficPredictions, setTrafficPredictions] = useState<Record<string, TrafficPrediction>>({});
  const [dispatchAnalytics, setDispatchAnalytics] = useState<Record<string, DispatchAnalytics>>({});

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

  // Fetch schedule recommendations
  const { data: scheduleRecommendations } = useQuery({
    queryKey: ['schedule_recommendations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('schedule_recommendations')
        .select('*')
        .eq('status', 'pending');

      if (error) throw error;
      return data;
    }
  });

  useEffect(() => {
    if (transportRecords) {
      // Calculate resource utilization
      const totalCapacity = 100;
      const utilization = (transportRecords.length / totalCapacity) * 100;
      setResourceUtilization(utilization);

      // Analyze each transport record
      const newTrafficPredictions: Record<string, TrafficPrediction> = {};
      const newDispatchAnalytics: Record<string, DispatchAnalytics> = {};

      transportRecords.forEach(record => {
        if (record.origin_address && record.destination_address && record.scheduled_time) {
          const origin = { lat: 0, lng: 0 }; // You would get these from geocoding
          const destination = { lat: 0, lng: 0 }; // You would get these from geocoding
          
          // Get traffic prediction
          const prediction = predictTraffic(origin, destination, new Date(record.scheduled_time));
          newTrafficPredictions[record.id] = prediction;

          // Get dispatch analytics
          const analytics = analyzeDispatchEfficiency(origin, destination);
          newDispatchAnalytics[record.id] = analytics;

          // Show warnings for high traffic
          if (prediction.congestionLevel === "high") {
            toast.warning(`High traffic predicted for transport ${record.dispatch_id}`, {
              description: `Consider adjusting departure time (${prediction.predictedDelayMinutes} min delay expected)`
            });
          }
        }
      });

      setTrafficPredictions(newTrafficPredictions);
      setDispatchAnalytics(newDispatchAnalytics);
    }
  }, [transportRecords]);

  const handleOptimizeSchedule = async () => {
    toast.promise(
      supabase.functions.invoke('optimize-route', {
        body: { date: selectedDate.toISOString() }
      }),
      {
        loading: 'Optimizing schedule...',
        success: 'Schedule optimized successfully',
        error: 'Failed to optimize schedule'
      }
    );
  };

  // Generate time slots for the timeline
  const timeSlots = Array.from({ length: 24 }, (_, i) => i);

  // Filter records for selected date
  const filteredRecords = transportRecords?.filter(record => 
    record.scheduled_time && isSameDay(new Date(record.scheduled_time), selectedDate)
  );

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
            {scheduleRecommendations?.map((recommendation) => (
              <Alert key={recommendation.id} className="bg-white/50">
                <AlertDescription>
                  Recommended time change: {format(new Date(recommendation.recommended_time), 'HH:mm')}
                  <br />
                  Reason: {recommendation.reason}
                </AlertDescription>
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

        {/* Traffic Analysis Card */}
        <Card className="p-4 bg-gradient-to-br from-green-50 to-emerald-50">
          <div className="flex items-center gap-2 mb-4">
            <Car className="h-5 w-5 text-green-600" />
            <h3 className="font-semibold">Traffic Analysis</h3>
          </div>
          <div className="space-y-2">
            {Object.entries(trafficPredictions).slice(0, 3).map(([id, prediction]) => (
              <div key={id} className="flex justify-between items-center">
                <span className="text-sm">Route {id.slice(0, 8)}</span>
                <span className={`text-sm font-medium ${
                  prediction.congestionLevel === 'high' ? 'text-red-500' : 
                  prediction.congestionLevel === 'medium' ? 'text-yellow-500' : 
                  'text-green-500'
                }`}>
                  {prediction.congestionLevel.toUpperCase()}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Schedule Timeline */}
      <Card className="p-4 overflow-x-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold flex items-center gap-2">
            <Users className="h-5 w-5 text-medical-secondary" />
            Schedule Timeline
          </h3>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setSelectedDate(subDays(selectedDate, 1))}>
              Previous Day
            </Button>
            <Button variant="outline" size="sm" onClick={() => setSelectedDate(addDays(selectedDate, 1))}>
              Next Day
            </Button>
          </div>
        </div>

        <div className="min-w-[800px]">
          {/* Timeline Header */}
          <div className="flex border-b">
            <div className="w-32 p-2 font-semibold">Transport</div>
            <div className="flex-1 flex">
              {timeSlots.map((hour) => (
                <div key={hour} className="flex-1 p-2 text-center text-sm font-medium border-l">
                  {hour}:00
                </div>
              ))}
            </div>
          </div>

          {/* Timeline Content */}
          <div className="relative">
            {filteredRecords?.map((record) => (
              <div key={record.id} className="flex border-b hover:bg-gray-50">
                <div className="w-32 p-2 font-medium">
                  {record.dispatch_id}
                </div>
                <div className="flex-1 flex relative">
                  {record.scheduled_time && (
                    <div 
                      className={`absolute h-8 rounded-md text-white text-sm flex items-center px-2 ${
                        trafficPredictions[record.id]?.congestionLevel === 'high' ? 'bg-red-500' :
                        trafficPredictions[record.id]?.congestionLevel === 'medium' ? 'bg-yellow-500' :
                        'bg-blue-500'
                      }`}
                      style={{
                        left: `${(new Date(record.scheduled_time).getHours() / 24) * 100}%`,
                        width: '120px'
                      }}
                    >
                      {record.dispatch_id}
                      {trafficPredictions[record.id]?.congestionLevel === 'high' && (
                        <AlertTriangle className="h-4 w-4 ml-1" />
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
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