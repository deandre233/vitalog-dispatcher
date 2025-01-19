import { MapPin, Clock, User, Building, ChevronDown, ChevronUp, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { format, isToday, isTomorrow } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";

interface ScheduledTransportProps {
  id: string;
  scheduledTime: string;
  patient: string;
  serviceType: string;
  origin: string;
  destination: string;
  status: "Scheduled" | "Assigned" | "Completed" | "Canceled";
  warnings?: string[];
  unitAssigned?: string;
  progress?: number;
  recurrence?: string;
}

export function ScheduledTransport() {
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [transports, setTransports] = useState<ScheduledTransportProps[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTransports();
  }, []);

  const validateStatus = (status: string): ScheduledTransportProps["status"] => {
    const validStatuses: ScheduledTransportProps["status"][] = ["Scheduled", "Assigned", "Completed", "Canceled"];
    return validStatuses.includes(status as ScheduledTransportProps["status"]) 
      ? (status as ScheduledTransportProps["status"]) 
      : "Scheduled";
  };

  const fetchTransports = async () => {
    try {
      const { data, error } = await supabase
        .from('transport_records')
        .select('*')
        .order('scheduled_time', { ascending: true });

      if (error) throw error;

      const formattedTransports: ScheduledTransportProps[] = data.map(record => ({
        id: record.dispatch_id,
        scheduledTime: record.scheduled_time || new Date().toISOString(),
        patient: record.patient_id || 'Unknown Patient',
        serviceType: 'BLS',
        origin: record.pickup_location,
        destination: record.dropoff_location,
        status: validateStatus(record.dispatch_status || 'Scheduled'),
        warnings: record.warnings || [],
        unitAssigned: record.crew_assigned,
        recurrence: record.recurrence_type ? `Every ${record.recurrence_day}` : undefined
      }));

      setTransports(formattedTransports);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching transports:', error);
      toast.error('Failed to load scheduled transports');
      setLoading(false);
    }
  };

  const toggleRow = (id: string) => {
    const newExpandedRows = new Set(expandedRows);
    if (expandedRows.has(id)) {
      newExpandedRows.delete(id);
    } else {
      newExpandedRows.add(id);
    }
    setExpandedRows(newExpandedRows);
  };

  const handleAssignCrew = (id: string) => {
    toast.success("Crew assignment modal would open here");
  };

  const handleCancelTransport = async (id: string) => {
    try {
      const { error } = await supabase
        .from('transport_records')
        .update({ dispatch_status: 'Canceled' })
        .eq('dispatch_id', id);

      if (error) throw error;
      toast.success(`Transport ${id} has been canceled`);
      fetchTransports(); // Refresh the list
    } catch (error) {
      console.error('Error canceling transport:', error);
      toast.error('Failed to cancel transport');
    }
  };

  if (loading) {
    return <div className="text-center py-4">Loading scheduled transports...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-medical-primary">
          Scheduled Transports
        </h2>
        <Button variant="outline">+ New Transport</Button>
      </div>
      
      <div className="space-y-2">
        {transports.map((transport) => (
          <div 
            key={transport.id}
            className="border rounded-lg bg-white shadow-sm"
          >
            <div 
              className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50"
              onClick={() => toggleRow(transport.id)}
            >
              <div className="grid grid-cols-6 gap-4 flex-1">
                <div className="flex flex-col">
                  <Link 
                    to={`/transport/${transport.id}`}
                    className="text-blue-600 hover:underline font-medium"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {transport.id}
                  </Link>
                  <Badge 
                    variant="outline"
                    className={cn(
                      "mt-1 w-fit",
                      getStatusColor(transport.scheduledTime, transport.status)
                    )}
                  >
                    {transport.status}
                  </Badge>
                </div>
                
                <div className="flex flex-col">
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="w-4 h-4 text-gray-500" />
                    {format(new Date(transport.scheduledTime), "MMM d, yyyy h:mm a")}
                  </div>
                  {transport.recurrence && (
                    <span className="text-xs text-gray-500 mt-1">
                      Recurring: {transport.recurrence}
                    </span>
                  )}
                </div>

                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-gray-500" />
                    <Link 
                      to={`/patient/${transport.patient}`}
                      className="text-blue-600 hover:underline text-sm"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {transport.patient}
                    </Link>
                  </div>
                  <span className="text-xs text-gray-500 mt-1">
                    Service: {transport.serviceType}
                  </span>
                </div>

                <div className="flex flex-col col-span-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Building className="w-4 h-4 text-gray-500" />
                    <span className="truncate">{transport.origin}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm mt-1">
                    <MapPin className="w-4 h-4 text-gray-500" />
                    <span className="truncate">{transport.destination}</span>
                  </div>
                </div>

                <div className="flex items-center justify-end">
                  {transport.warnings && transport.warnings.length > 0 && (
                    <AlertCircle className="w-5 h-5 text-yellow-500 mr-2" />
                  )}
                  {expandedRows.has(transport.id) ? (
                    <ChevronUp className="w-5 h-5 text-gray-500" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-500" />
                  )}
                </div>
              </div>
            </div>

            {expandedRows.has(transport.id) && (
              <div className="p-4 border-t bg-gray-50">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    {transport.warnings && transport.warnings.length > 0 && (
                      <div className="bg-yellow-50 p-3 rounded-md">
                        <h4 className="text-sm font-medium text-yellow-800 mb-1">Warnings:</h4>
                        <ul className="list-disc list-inside text-sm text-yellow-700">
                          {transport.warnings.map((warning, index) => (
                            <li key={index}>{warning}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {transport.unitAssigned && (
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">Unit Assigned:</span>
                        <span className="font-medium">{transport.unitAssigned}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <Button 
                        variant="default"
                        onClick={() => handleAssignCrew(transport.id)}
                        className="flex-1"
                      >
                        Assign Crew
                      </Button>
                      <Button 
                        variant="destructive"
                        onClick={() => handleCancelTransport(transport.id)}
                        className="flex-1"
                      >
                        Cancel Transport
                      </Button>
                    </div>
                    
                    {transport.status === "Assigned" && (
                      <Button variant="outline" className="w-full">
                        Track Transport
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

const getStatusColor = (scheduledTime: string, status: ScheduledTransportProps["status"]) => {
  if (status === "Canceled") return "bg-gray-100 text-gray-700";
  if (isToday(new Date(scheduledTime))) return "bg-red-100 text-red-700";
  if (isTomorrow(new Date(scheduledTime))) return "bg-orange-100 text-orange-700";
  return "bg-green-100 text-green-700";
};