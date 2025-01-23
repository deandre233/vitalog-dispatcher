import { Card } from "@/components/ui/card";
import { Brain, Plus } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { DispatchItem } from "./DispatchItem";
import { DispatchFilters } from "./DispatchFilters";
import { ScheduledTransport } from "./ScheduledTransport";
import { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { getTrafficInfo } from "@/utils/aiDispatchUtils";
import { analyzeDispatchEfficiency, monitorDispatchProgress, generateAIInsights } from "@/utils/aiDispatchAnalytics";
import { 
  analyzeHistoricalData, 
  predictMaintenance, 
  predictStaffingNeeds,
  type MaintenancePrediction,
  type StaffingPrediction
} from "@/utils/aiLearningUtils";
import { supabase } from "@/integrations/supabase/client";

interface Patient {
  id: string;
  name: string;
  dob?: string;
  condition?: string;
}

interface AIRecommendations {
  route: string;
  crew: string;
  billing: string;
  insights?: string[];
  trafficStatus?: {
    congestionLevel: "low" | "medium" | "high";
    estimatedDelay: number;
    alternateRouteAvailable: boolean;
  };
}

interface Dispatch {
  id: string;
  activationTime: string;
  patient: Patient;
  serviceType: string;
  origin: string;
  destination: string;
  status: string;
  priority: string;
  assignedTo: string;
  aiRecommendations: AIRecommendations;
  eta: string;
  comments?: string;
  warnings?: string;
  progress?: number;
  elapsedTime?: string;
  lastUpdated?: string;
  efficiency?: number;
}

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

export function DispatchBoard() {
  const [activeView, setActiveView] = useState<"active" | "scheduled">("active");
  const [dispatches, setDispatches] = useState<Dispatch[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [aiPredictions, setAiPredictions] = useState<{
    maintenance: MaintenancePrediction[];
    staffing: StaffingPrediction;
  }>({
    maintenance: [],
    staffing: {
      timeSlot: "",
      recommendedStaffCount: 0,
      confidence: 0,
      reason: ""
    }
  });

  useEffect(() => {
    const fetchDispatches = async () => {
      try {
        const { data: transportRecords, error } = await supabase
          .from('transport_records')
          .select(`
            *,
            patients (
              id,
              first_name,
              last_name,
              medical_conditions
            )
          `)
          .order('scheduled_time', { ascending: true });

        if (error) throw error;

        const formattedDispatches: Dispatch[] = transportRecords.map(record => ({
          id: record.dispatch_id,
          activationTime: record.scheduled_time,
          patient: {
            id: record.patients?.id || '',
            name: `${record.patients?.last_name || ''}, ${record.patients?.first_name || ''}`,
            condition: record.patients?.medical_conditions?.[0] || undefined
          },
          serviceType: record.transport_type || 'BLS',
          origin: record.pickup_location,
          destination: record.dropoff_location,
          status: record.status,
          priority: record.warnings?.includes('High priority case') ? 'high' : 'medium',
          assignedTo: record.crew_assigned || 'Unassigned',
          aiRecommendations: {
            route: `Recommended Route: ${record.origin_address} to ${record.destination_address}`,
            crew: `Recommended Crew: ${record.crew_assigned || 'TBD'}`,
            billing: "Insurance: TBD",
            insights: record.warnings || []
          },
          eta: '15 mins',
          comments: record.notes,
          warnings: record.warnings?.join(', '),
          progress: record.dispatch_status === 'Completed' ? 100 : 
                   record.dispatch_status === 'In Progress' ? 50 : 0,
          elapsedTime: 'will call'
        }));

        setDispatches(formattedDispatches);
      } catch (error) {
        console.error('Error fetching dispatches:', error);
        toast.error('Failed to load dispatch data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDispatches();
    
    // Set up real-time subscription
    const subscription = supabase
      .channel('transport_records_changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'transport_records' 
        }, 
        fetchDispatches
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const filterDispatches = (dispatches: Dispatch[], status: "assigned" | "unassigned"): Dispatch[] => {
    return dispatches.filter(dispatch => {
      const isAssigned = dispatch.assignedTo && dispatch.assignedTo !== "Unassigned";
      return status === "assigned" ? isAssigned : !isAssigned;
    });
  };

  const simulateRealTimeUpdates = async (dispatch: Dispatch): Promise<Dispatch> => {
    const now = new Date();
    const activationTime = new Date(dispatch.activationTime);
    const elapsedMinutes = Math.floor((now.getTime() - activationTime.getTime()) / (1000 * 60));
    
    let progress = Number(dispatch.progress || 0);
    if (dispatch.assignedTo !== "Unassigned") {
      progress = Math.min(100, progress + Math.random() * 5);
    }

    // Update status check to use correct capitalization
    let status = dispatch.status;
    if (progress === 100) {
      status = "Completed";
    } else if (progress > 0) {
      status = "In Progress";
    }

    const analytics = {
      efficiency: 0,
      performanceMetrics: {
        responseTime: 0,
        patientSatisfaction: 0,
        routeEfficiency: 0
      },
      suggestedActions: [] as string[],
      riskLevel: "low" as "low" | "medium" | "high"
    };

    try {
      const efficiencyResult = analyzeDispatchEfficiency(
        { lat: 33.7720, lng: -84.3960 },
        { lat: 33.7490, lng: -84.3880 },
        undefined,
        `${elapsedMinutes} min`
      );
      
      if (efficiencyResult) {
        analytics.efficiency = Number(efficiencyResult.efficiency || 0);
        analytics.suggestedActions = Array.isArray(efficiencyResult.suggestedActions) 
          ? efficiencyResult.suggestedActions.map(String)
          : [];
        analytics.riskLevel = String(efficiencyResult.riskLevel || 'low') as "low" | "medium" | "high";
      }
    } catch (error) {
      console.error('Error analyzing dispatch efficiency:', error);
    }

    try {
      monitorDispatchProgress(
        String(dispatch.status || '').toLowerCase(), 
        String(elapsedMinutes), 
        30
      );
    } catch (error) {
      console.error('Error monitoring dispatch progress:', error);
    }

    let aiInsights: string[] = [];
    try {
      const rawInsights = generateAIInsights(analytics);
      aiInsights = Array.isArray(rawInsights) 
        ? rawInsights.map(insight => 
            typeof insight === 'string' ? insight : JSON.stringify(insight)
          )
        : [];
    } catch (error) {
      console.error('Error generating AI insights:', error);
      aiInsights = ['Unable to generate insights'];
    }

    const trafficInfo = {
      congestionLevel: 'low' as "low" | "medium" | "high",
      delayMinutes: 0,
      alternateRouteAvailable: false
    };

    try {
      const traffic = getTrafficInfo(
        { lat: 33.7720, lng: -84.3960 },
        { lat: 33.7490, lng: -84.3880 }
      );
      
      if (traffic) {
        trafficInfo.congestionLevel = String(traffic.congestionLevel || 'low') as "low" | "medium" | "high";
        trafficInfo.delayMinutes = Number(traffic.delayMinutes || Math.floor(Math.random() * 15));
        trafficInfo.alternateRouteAvailable = Boolean(traffic.alternateRouteAvailable);
      }
    } catch (error) {
      console.error('Error getting traffic info:', error);
    }

    return {
      ...dispatch,
      id: String(dispatch.id),
      activationTime: String(dispatch.activationTime),
      patient: {
        ...dispatch.patient,
        id: String(dispatch.patient.id),
        name: String(dispatch.patient.name),
        condition: dispatch.patient.condition ? String(dispatch.patient.condition) : undefined
      },
      serviceType: String(dispatch.serviceType),
      origin: String(dispatch.origin),
      destination: String(dispatch.destination),
      status,
      priority: String(dispatch.priority),
      assignedTo: String(dispatch.assignedTo),
      progress: Number(progress),
      elapsedTime: String(elapsedMinutes) + ' min',
      lastUpdated: now.toISOString(),
      efficiency: Number(analytics.efficiency),
      eta: String(dispatch.eta),
      comments: dispatch.comments ? String(dispatch.comments) : undefined,
      warnings: dispatch.warnings ? String(dispatch.warnings) : undefined,
      aiRecommendations: {
        route: String(dispatch.aiRecommendations.route),
        crew: String(dispatch.aiRecommendations.crew),
        billing: String(dispatch.aiRecommendations.billing),
        insights: aiInsights,
        trafficStatus: {
          congestionLevel: trafficInfo.congestionLevel,
          estimatedDelay: Number(trafficInfo.delayMinutes),
          alternateRouteAvailable: Boolean(trafficInfo.alternateRouteAvailable)
        }
      }
    };
  };

  useEffect(() => {
    const interval = setInterval(async () => {
      const updatedDispatches = await Promise.all(
        dispatches.map(dispatch => simulateRealTimeUpdates(dispatch))
      );
      setDispatches(updatedDispatches);
    }, 5000);

    return () => clearInterval(interval);
  }, [dispatches]);

  useEffect(() => {
    const { patterns, recommendations } = analyzeHistoricalData(
      dispatches.map(d => ({
        efficiency: d.efficiency || 0,
        suggestedActions: [],
        riskLevel: "low",
        performanceMetrics: {
          responseTime: 0,
          patientSatisfaction: 0,
          routeEfficiency: 0
        }
      })),
      "day"
    );

    const maintenancePredictions = dispatches
      .filter(d => d.assignedTo !== "Unassigned")
      .map(d => predictMaintenance(d.assignedTo));

    const staffingPrediction = predictStaffingNeeds(
      new Date(),
      { lat: 33.7490, lng: -84.3880 }
    );

    setAiPredictions({
      maintenance: maintenancePredictions,
      staffing: staffingPrediction
    });

    if (recommendations.length > 0) {
      toast.info("New AI Insights Available", {
        description: recommendations[0]
      });
    }

    if (maintenancePredictions.some(p => p.maintenanceType === "urgent")) {
      toast.warning("Urgent Maintenance Required", {
        description: "Some vehicles require immediate attention"
      });
    }
  }, [dispatches]);

  const unassignedDispatches = useMemo(() => 
    filterDispatches(dispatches, "unassigned"),
    [dispatches]
  );

  const assignedDispatches = useMemo(() => {
    const assignedRegularDispatches = filterDispatches(dispatches, "assigned");
    return assignedRegularDispatches;
  }, [dispatches]);

  useEffect(() => {
    if (unassignedDispatches.length > 0) {
      const highPriorityDispatches = unassignedDispatches.filter(d => d.priority === "high");
      if (highPriorityDispatches.length > 0) {
        toast.warning(`${highPriorityDispatches.length} high-priority dispatches need attention`, {
          description: "AI suggests immediate crew assignment for optimal response time"
        });
      }
    }

    const dispatchesWithTrafficIssues = dispatches.filter(
      d => d.aiRecommendations.trafficStatus?.congestionLevel === "high"
    );
    if (dispatchesWithTrafficIssues.length > 0) {
      toast.warning(`Traffic alert for ${dispatchesWithTrafficIssues.length} dispatches`, {
        description: "AI suggests alternate routes due to heavy traffic"
      });
    }
  }, [unassignedDispatches, dispatches]);

  const unassignedTabStyle = unassignedDispatches.length > 0 
    ? "bg-red-100 text-red-700 data-[state=active]:bg-red-200" 
    : "";

  return (
    <Card className="p-6 m-6 bg-gradient-to-br from-medical-accent to-white border-medical-secondary/20 shadow-lg transition-all hover:shadow-xl">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-semibold text-medical-primary">
            Dispatch Control
          </h2>
          <div className="flex gap-2">
            <Button
              variant={activeView === "active" ? "default" : "outline"}
              onClick={() => setActiveView("active")}
              className="bg-medical-secondary text-white hover:bg-medical-secondary/90"
            >
              Active Dispatches
            </Button>
            <Button
              variant={activeView === "scheduled" ? "default" : "outline"}
              onClick={() => setActiveView("scheduled")}
              className="border-medical-secondary text-medical-secondary hover:bg-medical-secondary/10"
            >
              Scheduled Transport
            </Button>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/book-dispatch">
            <Button className="bg-medical-primary hover:bg-medical-primary/90 text-white flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Book New Dispatch
            </Button>
          </Link>
          <DispatchFilters />
        </div>
      </div>

      <Alert className="mb-4 bg-medical-highlight border-medical-secondary/20">
        <Brain className="h-4 w-4 text-medical-secondary" />
        <AlertDescription className="text-medical-primary">
          AI Insight: {unassignedDispatches.length} dispatches waiting for assignment. 
          {assignedDispatches.length > 0 && ` ${assignedDispatches.length} active transports progressing normally.`}
          {aiPredictions.staffing.recommendedStaffCount > 0 && 
            ` Recommended staff: ${aiPredictions.staffing.recommendedStaffCount} for current time slot.`}
        </AlertDescription>
      </Alert>

      {aiPredictions.maintenance.some(p => p.maintenanceType === "urgent") && (
        <Alert variant="destructive" className="mb-4 border-red-200 bg-red-50">
          <AlertDescription className="text-red-800">
            Urgent maintenance required for some vehicles. Check maintenance dashboard for details.
          </AlertDescription>
        </Alert>
      )}

      {activeView === "active" ? (
        <Tabs defaultValue="unassigned" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2 bg-medical-accent">
            <TabsTrigger 
              value="unassigned"
              className={`${unassignedDispatches.length > 0 
                ? "data-[state=active]:bg-red-100 data-[state=active]:text-red-700" 
                : "data-[state=active]:bg-medical-secondary data-[state=active]:text-white"}`}
            >
              Unassigned ({unassignedDispatches.length})
            </TabsTrigger>
            <TabsTrigger 
              value="assigned"
              className="data-[state=active]:bg-medical-secondary data-[state=active]:text-white"
            >
              Assigned ({assignedDispatches.length})
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="unassigned" className="space-y-4">
            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200 mb-4">
              <h3 className="text-lg font-medium text-yellow-800 mb-2">
                Waiting for Assignment
              </h3>
              <p className="text-sm text-yellow-600">
                {unassignedDispatches.length} dispatches need crew assignment
              </p>
            </div>
            {unassignedDispatches.map((dispatch) => (
              <DispatchItem key={dispatch.id} {...dispatch} />
            ))}
          </TabsContent>
          
          <TabsContent value="assigned" className="space-y-4">
            <div className="bg-green-50 p-4 rounded-lg border border-green-200 mb-4">
              <h3 className="text-lg font-medium text-green-800 mb-2">
                Active Transports
              </h3>
              <p className="text-sm text-green-600">
                {assignedDispatches.length} dispatches in progress
              </p>
            </div>
            {assignedDispatches.map((dispatch) => (
              <DispatchItem key={dispatch.id} {...dispatch} />
            ))}
          </TabsContent>
        </Tabs>
      ) : (
        <ScheduledTransport />
      )}
    </Card>
  );
}
