import { Card } from "@/components/ui/card";
import { Brain } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { DispatchItem } from "./DispatchItem";
import { DispatchFilters } from "./DispatchFilters";
import { ScheduledTransport } from "./ScheduledTransport";
import { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { getTrafficInfo } from "@/utils/aiDispatchUtils";
import { analyzeDispatchEfficiency, monitorDispatchProgress, generateAIInsights } from "@/utils/aiDispatchAnalytics";
import { 
  analyzeHistoricalData, 
  predictMaintenance, 
  predictStaffingNeeds,
  type MaintenancePrediction,
  type StaffingPrediction
} from "@/utils/aiLearningUtils";

interface Patient {
  id: string;  // Added id as required
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

const mockDispatches: Dispatch[] = [
  {
    id: "7684",
    activationTime: "2024-02-20T10:30:00",
    patient: {
      id: "pat-001",
      name: "Turner, Angela",
      condition: "Breathing problem: Req oxygen"
    },
    serviceType: "BLS",
    origin: "Emory Dialysis At North Decatur",
    destination: "Emory University Hospital Midtown",
    status: "Pending",
    priority: "medium",
    assignedTo: "Unassigned",
    aiRecommendations: {
      route: "Recommended Route: I-85 S",
      crew: "Recommended Crew: Team A",
      billing: "Insurance: Medicare"
    },
    eta: "25 mins",
    comments: "Breathing problem: Req oxygen",
    elapsedTime: "will call"
  },
  {
    id: "7601",
    activationTime: "2024-02-20T09:15:00",
    patient: {
      id: "pat-002",
      name: "Smith, John",
      condition: "Impaired movement"
    },
    serviceType: "BLS",
    origin: "Emory Dialysis At Candler",
    destination: "CROSSING AT EASTLAKE",
    status: "En Route",
    priority: "medium",
    assignedTo: "MED 1",
    aiRecommendations: {
      route: "Recommended Route: Candler Rd",
      crew: "Recommended Crew: MED 1",
      billing: "Insurance: Private"
    },
    eta: "15 mins",
    comments: "Impaired movement",
    progress: 45,
    elapsedTime: "00:45:00"
  }
];

const filterDispatches = (dispatches: Dispatch[], status: "assigned" | "unassigned"): Dispatch[] => {
  return dispatches.filter(dispatch => 
    status === "assigned" 
      ? dispatch.assignedTo !== "Unassigned"
      : dispatch.assignedTo === "Unassigned"
  );
};

const simulateRealTimeUpdates = async (dispatch: Dispatch): Promise<Dispatch> => {
  const now = new Date();
  const activationTime = new Date(dispatch.activationTime);
  const elapsedMinutes = Math.floor((now.getTime() - activationTime.getTime()) / (1000 * 60));
  
  let progress = dispatch.progress || 0;
  if (dispatch.assignedTo !== "Unassigned") {
    progress = Math.min(100, progress + Math.random() * 5);
  }

  // Get analytics data
  const analytics = analyzeDispatchEfficiency(
    { lat: 33.7720, lng: -84.3960 }, // Mock origin coordinates
    { lat: 33.7490, lng: -84.3880 },  // Mock destination coordinates
    undefined,
    `${elapsedMinutes} min`
  );

  // Monitor dispatch progress
  monitorDispatchProgress(dispatch.status.toLowerCase(), `${elapsedMinutes}`, 30);

  // Generate AI insights
  const aiInsights = generateAIInsights(analytics);

  // Get traffic updates
  const trafficInfo = getTrafficInfo(
    { lat: 33.7720, lng: -84.3960 },
    { lat: 33.7490, lng: -84.3880 }
  );

  return {
    ...dispatch,
    progress,
    elapsedTime: `${elapsedMinutes} min`,
    lastUpdated: now.toISOString(),
    efficiency: analytics.efficiency,
    aiRecommendations: {
      ...dispatch.aiRecommendations,
      insights: aiInsights,
      trafficStatus: {
        congestionLevel: trafficInfo.congestionLevel,
        estimatedDelay: trafficInfo.delayMinutes,
        alternateRouteAvailable: trafficInfo.alternateRouteAvailable
      }
    }
  };
};

export function DispatchBoard() {
  const [activeView, setActiveView] = useState<"active" | "scheduled">("active");
  const [dispatches, setDispatches] = useState<Dispatch[]>(
    JSON.parse(JSON.stringify(mockDispatches))
  );

  // Add new state for AI predictions
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

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(async () => {
      const updatedDispatches = await Promise.all(
        dispatches.map(dispatch => simulateRealTimeUpdates(dispatch))
      );
      setDispatches(updatedDispatches);
    }, 5000);

    return () => clearInterval(interval);
  }, [dispatches]);

  // Effect for AI learning and predictions
  useEffect(() => {
    // Analyze historical data
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

    // Get maintenance predictions for each vehicle
    const maintenancePredictions = dispatches
      .filter(d => d.assignedTo !== "Unassigned")
      .map(d => predictMaintenance(d.assignedTo));

    // Get staffing predictions
    const staffingPrediction = predictStaffingNeeds(
      new Date(),
      { lat: 33.7490, lng: -84.3880 }
    );

    setAiPredictions({
      maintenance: maintenancePredictions,
      staffing: staffingPrediction
    });

    // Show AI insights as toasts
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

  const assignedDispatches = useMemo(() => 
    filterDispatches(dispatches, "assigned"),
    [dispatches]
  );

  // AI Insights notifications
  useEffect(() => {
    // Check for high priority dispatches
    if (unassignedDispatches.length > 0) {
      const highPriorityDispatches = unassignedDispatches.filter(d => d.priority === "high");
      if (highPriorityDispatches.length > 0) {
        toast.warning(`${highPriorityDispatches.length} high-priority dispatches need attention`, {
          description: "AI suggests immediate crew assignment for optimal response time"
        });
      }
    }

    // Check for traffic-related issues
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
    <Card className="p-6 m-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-semibold text-medical-primary">
            Dispatch Control
          </h2>
          <div className="flex gap-2">
            <Button
              variant={activeView === "active" ? "default" : "outline"}
              onClick={() => setActiveView("active")}
            >
              Active Dispatches
            </Button>
            <Button
              variant={activeView === "scheduled" ? "default" : "outline"}
              onClick={() => setActiveView("scheduled")}
            >
              Scheduled Transport
            </Button>
          </div>
        </div>
        <DispatchFilters />
      </div>

      <Alert className="mb-4">
        <Brain className="h-4 w-4" />
        <AlertDescription>
          AI Insight: {unassignedDispatches.length} dispatches waiting for assignment. 
          {assignedDispatches.length > 0 && ` ${assignedDispatches.length} active transports progressing normally.`}
          {aiPredictions.staffing.recommendedStaffCount > 0 && 
            ` Recommended staff: ${aiPredictions.staffing.recommendedStaffCount} for current time slot.`}
        </AlertDescription>
      </Alert>

      {aiPredictions.maintenance.some(p => p.maintenanceType === "urgent") && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>
            Urgent maintenance required for some vehicles. Check maintenance dashboard for details.
          </AlertDescription>
        </Alert>
      )}

      {activeView === "active" ? (
        <Tabs defaultValue="unassigned" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger 
              value="unassigned"
              className={unassignedTabStyle}
            >
              Unassigned ({unassignedDispatches.length})
            </TabsTrigger>
            <TabsTrigger value="assigned">
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

