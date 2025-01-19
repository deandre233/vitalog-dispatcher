import { MapPin, Clock, User, Building, ChevronDown, ChevronUp, ArrowRight, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { format, isToday, isTomorrow } from "date-fns";
import { supabase } from "@/integrations/supabase/client";

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

// Mock data with more realistic scenarios
const scheduledTransports: ScheduledTransportProps[] = [
  {
    id: "ST-7685",
    scheduledTime: "2024-02-20T14:30:00",
    patient: "Martin, Helen",
    serviceType: "BLS",
    origin: "Neurology/Emory Brain Health Center",
    destination: "Parkside at Budd Terrace, 508A",
    status: "Scheduled",
    warnings: ["Neurology Emory Brain Health Center 12 Executive Park Drive Northeast, Atlanta, GA 30329"],
    recurrence: "Every week on Mon"
  },
  {
    id: "ST-7602",
    scheduledTime: "2024-02-20T16:30:00",
    patient: "Schaebick, Michael",
    serviceType: "BLS",
    origin: "Emory University Hospital Midtown",
    destination: "Parkside at Budd Terrace, 613",
    status: "Assigned",
    unitAssigned: "MED-1",
    progress: 45,
    warnings: ["Podiatry/Emory Wound and Hyperbaric Center"],
    recurrence: "Every week on Mon"
  },
  {
    id: "ST-8038",
    scheduledTime: "2024-02-20T13:40:00",
    patient: "Pattaway, Floyd",
    serviceType: "BLS",
    origin: "Emory Dialysis At North Decatur",
    destination: "Parkside at Budd Terrace, 613",
    status: "Completed",
    recurrence: "Every week on Mon"
  },
  {
    id: "ST-8086",
    scheduledTime: "2024-02-20T15:28:00",
    patient: "Pratt, Edmond",
    serviceType: "BLS",
    origin: "Emory Dialysis At Northside",
    destination: "Parkside at Budd Terrace, 731",
    status: "Canceled",
    warnings: ["Limited mobility", "Requires oxygen support"],
    recurrence: "Every week on Mon"
  }
];

const getStatusColor = (status: ScheduledTransportProps["status"]) => {
  switch (status) {
    case "Scheduled":
      return "bg-green-100 text-green-700 border-green-200";
    case "Assigned":
      return "bg-blue-100 text-blue-700 border-blue-200";
    case "Completed":
      return "bg-yellow-100 text-yellow-700 border-yellow-200";
    case "Canceled":
      return "bg-red-100 text-red-700 border-red-200";
    default:
      return "bg-gray-100 text-gray-700 border-gray-200";
  }
};

const getTimeColor = (scheduledTime: string) => {
  if (isToday(new Date(scheduledTime))) return "text-red-600 font-medium";
  if (isTomorrow(new Date(scheduledTime))) return "text-orange-600";
  return "text-gray-600";
};

export function ScheduledTransport() {
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

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
    } catch (error) {
      console.error('Error canceling transport:', error);
      toast.error('Failed to cancel transport');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-6">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold text-medical-primary">
            Scheduled Transports
          </h2>
          <p className="text-gray-500">
            Showing all scheduled transports for the next 7 days
          </p>
        </div>
        <Button variant="outline" className="gap-2">
          <span>New Transport</span>
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
      
      <div className="space-y-3">
        {scheduledTransports.map((transport) => (
          <div 
            key={transport.id}
            className="border rounded-lg bg-white shadow-sm overflow-hidden"
          >
            <div 
              className={cn(
                "p-4 cursor-pointer hover:bg-gray-50 transition-colors",
                expandedRows.has(transport.id) ? "border-b" : ""
              )}
              onClick={() => toggleRow(transport.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <Link 
                        to={`/transport/${transport.id}`}
                        className="text-blue-600 hover:underline font-medium"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {transport.id}
                      </Link>
                      <span className={cn(
                        "px-2 py-1 rounded-full text-xs font-medium border",
                        getStatusColor(transport.status)
                      )}>
                        {transport.status}
                      </span>
                    </div>
                    {transport.recurrence && (
                      <span className="text-xs text-gray-500 mt-1">
                        {transport.recurrence}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col">
                    <div className={cn(
                      "flex items-center gap-2",
                      getTimeColor(transport.scheduledTime)
                    )}>
                      <Clock className="w-4 h-4" />
                      {format(new Date(transport.scheduledTime), "MMM d, yyyy h:mm a")}
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-gray-500" />
                      <Link 
                        to={`/patient/${transport.patient}`}
                        className="text-blue-600 hover:underline"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {transport.patient}
                      </Link>
                    </div>
                  </div>
                </div>
                {expandedRows.has(transport.id) ? (
                  <ChevronUp className="w-5 h-5 text-gray-500" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-500" />
                )}
              </div>
            </div>

            {expandedRows.has(transport.id) && (
              <div className="p-4 bg-gray-50 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-start gap-2">
                      <Building className="w-4 h-4 text-gray-500 mt-1" />
                      <div>
                        <span className="text-sm text-gray-600 block">Origin:</span>
                        <span className="font-medium">{transport.origin}</span>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-gray-500 mt-1" />
                      <div>
                        <span className="text-sm text-gray-600 block">Destination:</span>
                        <span className="font-medium">{transport.destination}</span>
                      </div>
                    </div>
                    {transport.warnings && transport.warnings.length > 0 && (
                      <div className="flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 text-orange-500 mt-1" />
                        <div>
                          <span className="text-sm text-gray-600 block">Warnings:</span>
                          <ul className="list-disc list-inside space-y-1">
                            {transport.warnings.map((warning, index) => (
                              <li key={index} className="text-orange-700 text-sm">
                                {warning}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-3">
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
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Progress</span>
                          <span>{transport.progress}%</span>
                        </div>
                        <Progress value={transport.progress} className="h-2" />
                      </div>
                    )}
                    
                    {transport.unitAssigned && (
                      <div className="p-3 bg-blue-50 rounded-md">
                        <span className="text-sm text-blue-700">
                          Unit Assigned: {transport.unitAssigned}
                        </span>
                      </div>
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