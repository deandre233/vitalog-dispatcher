import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Brain, Calendar, Clock, Users, AlertTriangle, ArrowUpDown, BarChart, Car, TrendingUp, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format, addDays, subDays, isSameDay } from "date-fns";
import { analyzeDispatchEfficiency } from "@/utils/aiDispatchAnalytics";
import { predictTraffic } from "@/utils/aiDispatchOptimization";

export function AIScheduleOverview() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [resourceUtilization, setResourceUtilization] = useState(0);
  const [trafficPredictions, setTrafficPredictions] = useState<Record<string, any>>({});

  // Fetch transport records
  const { data: transportRecords } = useQuery({
    queryKey: ['transport_records', selectedDate],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('transport_records')
        .select('*')
        .gte('scheduled_time', new Date(selectedDate.setHours(0,0,0,0)).toISOString())
        .lte('scheduled_time', new Date(selectedDate.setHours(23,59,59,999)).toISOString())
        .order('scheduled_time');

      if (error) throw error;
      return data;
    }
  });

  // Fetch traffic analysis
  const { data: trafficAnalysis } = useQuery({
    queryKey: ['traffic_analysis'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('traffic_analysis')
        .select('*')
        .eq('day_of_week', format(selectedDate, 'EEEE').toLowerCase());

      if (error) throw error;
      return data;
    }
  });

  // Generate time slots for the timeline
  const timeSlots = Array.from({ length: 24 }, (_, i) => i);

  // Define peak hours (e.g., 7-9 AM and 4-6 PM)
  const isPeakHour = (hour: number) => {
    return (hour >= 7 && hour <= 9) || (hour >= 16 && hour <= 18);
  };

  // Get traffic severity class
  const getTrafficSeverityClass = (hour: number) => {
    const trafficData = trafficAnalysis?.find(t => t.hour_of_day === hour);
    switch(trafficData?.traffic_level) {
      case 'high':
        return 'bg-red-100 border-red-300';
      case 'medium':
        return 'bg-yellow-100 border-yellow-300';
      case 'low':
        return 'bg-green-100 border-green-300';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  // Get traffic icon
  const getTrafficIcon = (hour: number) => {
    const trafficData = trafficAnalysis?.find(t => t.hour_of_day === hour);
    switch(trafficData?.traffic_level) {
      case 'high':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'medium':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'low':
        return <Car className="h-4 w-4 text-green-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Calendar className="h-6 w-6 text-medical-secondary" />
          Schedule Overview
        </h1>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setSelectedDate(subDays(selectedDate, 1))}
          >
            Previous Day
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setSelectedDate(addDays(selectedDate, 1))}
          >
            Next Day
          </Button>
        </div>
      </div>

      {/* Timeline Header */}
      <Card className="p-4 overflow-x-auto">
        <div className="min-w-[800px]">
          <div className="flex border-b">
            <div className="w-32 p-2 font-semibold">Time</div>
            <div className="flex-1 flex">
              {timeSlots.map((hour) => (
                <div 
                  key={hour} 
                  className={`flex-1 p-2 text-center relative ${
                    isPeakHour(hour) ? 'bg-red-50' : ''
                  }`}
                >
                  {/* Peak Hour Indicator */}
                  {isPeakHour(hour) && (
                    <div className="absolute top-0 left-0 right-0">
                      <TrendingUp className="h-4 w-4 text-red-500 mx-auto" />
                    </div>
                  )}
                  
                  <span className="text-sm font-medium">
                    {hour}:00
                  </span>
                  
                  {/* Traffic Indicator */}
                  <div className={`mt-1 p-1 rounded-md border ${getTrafficSeverityClass(hour)}`}>
                    {getTrafficIcon(hour)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Transport Records */}
          <div className="relative">
            {transportRecords?.map((record: any) => {
              const hour = new Date(record.scheduled_time).getHours();
              const trafficData = trafficAnalysis?.find(t => t.hour_of_day === hour);
              
              return (
                <div key={record.id} className="flex border-b hover:bg-gray-50">
                  <div className="w-32 p-2 font-medium">
                    {record.dispatch_id}
                  </div>
                  <div className="flex-1 flex relative">
                    <div 
                      className={`absolute h-8 rounded-md text-white text-sm flex items-center px-2 ${
                        trafficData?.traffic_level === 'high' ? 'bg-red-500' :
                        trafficData?.traffic_level === 'medium' ? 'bg-yellow-500' :
                        'bg-blue-500'
                      }`}
                      style={{
                        left: `${(hour / 24) * 100}%`,
                        width: '120px'
                      }}
                    >
                      {record.dispatch_id}
                      {trafficData?.traffic_level === 'high' && (
                        <AlertTriangle className="h-4 w-4 ml-1" />
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Card>
    </div>
  );
}