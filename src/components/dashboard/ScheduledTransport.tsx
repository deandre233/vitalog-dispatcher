import { MapPin, Clock, User, Building, ChevronDown, ChevronUp, ArrowRight, AlertTriangle, Brain, Calendar, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { format, isToday, isTomorrow, parseISO, isWithinInterval, addHours, differenceInMinutes } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card } from "@/components/ui/card";

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

const scheduledTransports: ScheduledTransportProps[] = [
  {
    id: "DISP-00004",
    scheduledTime: "2024-02-20T14:30:00",
    patient: "Anderson, Emily (PAT-00004)",
    serviceType: "BLS",
    origin: "Emory Saint Joseph's Hospital",
    destination: "Atlanta Rehabilitation Center",
    status: "Scheduled",
    warnings: ["Limited mobility", "Oxygen support required"],
    recurrence: "Every Tuesday"
  },
  {
    id: "DISP-00005",
    scheduledTime: "2024-02-20T16:30:00",
    patient: "Chen, David (PAT-00005)",
    serviceType: "BLS",
    origin: "Piedmont Atlanta Hospital",
    destination: "Home Care Facility",
    status: "Assigned",
    unitAssigned: "MED-2",
    progress: 25,
    warnings: ["Wheelchair required", "Dietary restrictions"],
    recurrence: "One-time transport"
  },
  {
    id: "DISP-00006",
    scheduledTime: "2024-02-20T13:40:00",
    patient: "Martinez, Sofia (PAT-00006)",
    serviceType: "ALS",
    origin: "Wellstar Kennestone Hospital",
    destination: "Emory University Hospital",
    status: "Completed",
    recurrence: "Every week on Wed"
  }
];

// Move assignedScheduledTransports before it's used
const assignedScheduledTransports: ScheduledTransportProps[] = [
  {
    id: "DISP-00007",
    scheduledTime: "2024-02-20T15:30:00",
    patient: "Brown, Michael (PAT-00007)",
    serviceType: "BLS",
    origin: "Atlanta Medical Center",
    destination: "Peachtree Rehabilitation",
    status: "Assigned",
    unitAssigned: "MED-3",
    progress: 50,
    warnings: ["Fall risk", "Memory care patient"],
    recurrence: "Every Thursday"
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

// Enhanced AI analysis functions
const analyzeScheduleConflicts = (transports: ScheduledTransportProps[]) => {
  const conflicts: { id: string; conflictWith: string; reason: string; severity: 'high' | 'medium' | 'low' }[] = [];
  
  transports.forEach((transport1, i) => {
    transports.slice(i + 1).forEach(transport2 => {
      const time1 = parseISO(transport1.scheduledTime);
      const time2 = parseISO(transport2.scheduledTime);
      
      // Check for overlapping time windows (assuming 2 hour transport duration)
      const interval1 = {
        start: time1,
        end: addHours(time1, 2)
      };
      
      const interval2 = {
        start: time2,
        end: addHours(time2, 2)
      };
      
      if (
        isWithinInterval(interval1.start, interval2) ||
        isWithinInterval(interval1.end, interval2)
      ) {
        const timeDiff = Math.abs(differenceInMinutes(time1, time2));
        const severity = timeDiff < 30 ? 'high' : timeDiff < 60 ? 'medium' : 'low';
        
        conflicts.push({
          id: transport1.id,
          conflictWith: transport2.id,
          reason: `Time overlap detected (${timeDiff} minutes)`,
          severity
        });
      }
      
      // Check for same unit assignments
      if (
        transport1.unitAssigned &&
        transport2.unitAssigned &&
        transport1.unitAssigned === transport2.unitAssigned
      ) {
        conflicts.push({
          id: transport1.id,
          conflictWith: transport2.id,
          reason: `Unit ${transport1.unitAssigned} double-booked`,
          severity: 'high'
        });
      }
      
      // Check for same origin/destination conflicts
      if (transport1.origin === transport2.origin && 
          Math.abs(differenceInMinutes(time1, time2)) < 30) {
        conflicts.push({
          id: transport1.id,
          conflictWith: transport2.id,
          reason: 'Multiple pickups at same location within 30 minutes',
          severity: 'medium'
        });
      }
    });
  });
  
  return conflicts;
};

const analyzeResourceUtilization = (transports: ScheduledTransportProps[]) => {
  const totalTransports = transports.length;
  const assignedTransports = transports.filter(t => t.status === "Assigned").length;
  const utilizationRate = (assignedTransports / totalTransports) * 100;
  
  const timeSlots = transports.reduce((acc, transport) => {
    const hour = new Date(transport.scheduledTime).getHours();
    acc[hour] = (acc[hour] || 0) + 1;
    return acc;
  }, {} as Record<number, number>);
  
  const peakHour = Object.entries(timeSlots).reduce((a, b) => 
    timeSlots[Number(a[0])] > timeSlots[Number(b[0])] ? a : b
  )[0];
  
  return {
    utilizationRate,
    peakHour,
    recommendation: utilizationRate < 50 
      ? "Resource utilization is low. Consider optimizing crew assignments."
      : utilizationRate > 80
      ? "High resource utilization. Consider adding more units during peak hours."
      : "Resource utilization is optimal.",
    peakLoadWarning: timeSlots[Number(peakHour)] > 3
      ? `High load detected at ${peakHour}:00. Consider redistributing schedules.`
      : null
  };
};

const analyzeTravelPatterns = (transports: ScheduledTransportProps[]) => {
  const patterns = transports.reduce((acc, transport) => {
    const route = `${transport.origin} -> ${transport.destination}`;
    acc[route] = (acc[route] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const frequentRoutes = Object.entries(patterns)
    .filter(([_, count]) => count > 1)
    .map(([route, count]) => ({
      route,
      count,
      recommendation: count > 2 ? "Consider dedicated resource allocation for this route" : null
    }));

  return frequentRoutes;
};

export function ScheduledTransport() {
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [conflicts, setConflicts] = useState<ReturnType<typeof analyzeScheduleConflicts>>([]);
  const [utilization, setUtilization] = useState<ReturnType<typeof analyzeResourceUtilization>>();
  const [patterns, setPatterns] = useState<ReturnType<typeof analyzeTravelPatterns>>([]);

  // Filter to show only scheduled (unassigned) transports
  const activeTransports = scheduledTransports.filter(
    transport => transport.status === "Scheduled"
  );

  useEffect(() => {
    // Analyze schedule conflicts
    const detectedConflicts = analyzeScheduleConflicts(activeTransports);
    setConflicts(detectedConflicts);
    
    // Analyze resource utilization
    const resourceUtilization = analyzeResourceUtilization(activeTransports);
    setUtilization(resourceUtilization);
    
    // Analyze travel patterns
    const travelPatterns = analyzeTravelPatterns(activeTransports);
    setPatterns(travelPatterns);
    
    // Show AI insights
    if (detectedConflicts.length > 0) {
      const highSeverityConflicts = detectedConflicts.filter(c => c.severity === 'high');
      if (highSeverityConflicts.length > 0) {
        toast.error(`${highSeverityConflicts.length} high-priority scheduling conflicts detected`, {
          description: "Immediate attention required for schedule optimization"
        });
      }
    }
    
    if (resourceUtilization?.peakLoadWarning) {
      toast.warning(resourceUtilization.peakLoadWarning, {
        description: "AI suggests schedule redistribution"
      });
    }
    
    if (patterns.length > 0) {
      toast.info(`${patterns.length} frequent transport routes identified`, {
        description: "AI suggests optimizing resource allocation"
      });
    }
  }, [activeTransports]);

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
          <h2 className="text-2xl font-semibold text-medical-primary flex items-center gap-2">
            <Truck className="w-6 h-6 text-medical-secondary" />
            <span>Scheduled Transports</span>
          </h2>
          <p className="text-gray-500">
            Showing {activeTransports.length} scheduled transports
          </p>
        </div>
        <Button variant="outline" className="gap-2 futuristic-card hover:bg-medical-secondary/10">
          <Calendar className="w-4 h-4" />
          <span>Schedule New</span>
        </Button>
      </div>

      {conflicts.length > 0 && (
        <Alert variant="destructive" className="mb-4 glass-panel border-red-300/50">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            {conflicts.length} scheduling conflicts detected. 
            {conflicts.filter(c => c.severity === 'high').length} require immediate attention.
          </AlertDescription>
        </Alert>
      )}

      {utilization && utilization.peakLoadWarning && (
        <Alert className="mb-4 glass-panel border-orange-300/50 bg-orange-50/50">
          <Brain className="h-4 w-4 text-orange-500" />
          <AlertDescription className="text-orange-700">
            {utilization.peakLoadWarning}
          </AlertDescription>
        </Alert>
      )}
      
      <div className="space-y-3">
        {activeTransports.map((transport) => (
          <div 
            key={transport.id}
            className={cn(
              "futuristic-panel overflow-hidden transition-all duration-300",
              conflicts.some(c => c.id === transport.id) ? "border-red-300/50 shadow-red-100" : "",
              expandedRows.has(transport.id) ? "shadow-lg" : "hover:shadow-md"
            )}
          >
            <div 
              className={cn(
                "p-4 cursor-pointer transition-colors duration-300",
                expandedRows.has(transport.id) ? "border-b border-medical-secondary/20" : "",
                "hover:bg-medical-accent/50"
              )}
              onClick={() => toggleRow(transport.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <Link 
                        to={`/transport/${transport.id}`}
                        className="text-medical-secondary hover:text-medical-primary hover:underline font-medium transition-colors"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {transport.id}
                      </Link>
                      <span className={cn(
                        "px-2 py-1 rounded-full text-xs font-medium border glass-panel",
                        getStatusColor(transport.status)
                      )}>
                        {transport.status}
                      </span>
                    </div>
                    {transport.recurrence && (
                      <span className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                        <ArrowRight className="w-3 h-3" />
                        {transport.recurrence}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col">
                    <div className={cn(
                      "flex items-center gap-2 transition-colors",
                      getTimeColor(transport.scheduledTime)
                    )}>
                      <Clock className="w-4 h-4" />
                      {format(new Date(transport.scheduledTime), "MMM d, yyyy h:mm a")}
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-medical-secondary" />
                      <Link 
                        to={`/patient/${transport.patient}`}
                        className="text-medical-secondary hover:text-medical-primary hover:underline transition-colors"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {transport.patient}
                      </Link>
                    </div>
                  </div>
                </div>
                {expandedRows.has(transport.id) ? (
                  <ChevronUp className="w-5 h-5 text-medical-secondary" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-medical-secondary" />
                )}
              </div>
            </div>

            {expandedRows.has(transport.id) && (
              <div className="p-4 bg-medical-accent/30 space-y-4 backdrop-blur-sm">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-start gap-2">
                      <Building className="w-4 h-4 text-medical-secondary mt-1" />
                      <div>
                        <span className="text-sm text-gray-600 block">Origin:</span>
                        <span className="font-medium">{transport.origin}</span>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-medical-secondary mt-1" />
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
                    {conflicts.some(c => c.id === transport.id) && (
                      <div className="flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 text-red-500 mt-1" />
                        <div>
                          <span className="text-sm text-red-600 block">Conflicts:</span>
                          <ul className="list-disc list-inside space-y-1">
                            {conflicts
                              .filter(c => c.id === transport.id)
                              .map((conflict, index) => (
                                <li key={index} className="text-red-700 text-sm">
                                  Conflict with {conflict.conflictWith}: {conflict.reason}
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
                        className="flex-1 bg-medical-secondary hover:bg-medical-secondary/90 text-white"
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
                        <Progress 
                          value={transport.progress} 
                          className="h-2 bg-medical-accent"
                        />
                      </div>
                    )}
                    
                    {transport.unitAssigned && (
                      <div className="glass-panel p-3">
                        <span className="text-sm text-medical-secondary">
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