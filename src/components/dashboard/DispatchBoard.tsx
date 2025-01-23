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
import { 
  analyzeDispatchEfficiency, 
  monitorDispatchProgress, 
  generateAIInsights 
} from "@/utils/aiDispatchAnalytics";
import { 
  analyzeHistoricalData, 
  predictMaintenance, 
  predictStaffingNeeds,
  type MaintenancePrediction,
  type StaffingPrediction
} from "@/utils/aiLearningUtils";
import { supabase } from "@/integrations/supabase/client";

const mockDispatches = [
  {
    id: "DISP-00001",
    activationTime: new Date(Date.now() - 3600000).toISOString(),
    patient: {
      id: "PAT-001",
      name: "John Smith",
      condition: "Stable - Routine Transfer"
    },
    serviceType: "BLS",
    origin: "Memorial Hospital",
    destination: "Sunset Nursing Home",
    status: "enroute",
    priority: "medium",
    assignedTo: "Unit 101",
    aiRecommendations: {
      route: "Recommended Route: Via Main St",
      crew: "Recommended Crew: BLS Team",
      billing: "Insurance: Medicare",
      insights: ["Traffic conditions favorable", "ETA within normal range"],
      trafficStatus: {
        congestionLevel: "low" as const,
        estimatedDelay: 5,
        alternateRouteAvailable: false
      }
    },
    eta: "15 mins",
    progress: 40,
    elapsedTime: "45 min",
    lastUpdated: new Date().toISOString(),
    efficiency: 92
  },
  {
    id: "DISP-00002",
    activationTime: new Date(Date.now() - 7200000).toISOString(),
    patient: {
      id: "PAT-002",
      name: "Mary Johnson",
      condition: "Post-Op Transfer"
    },
    serviceType: "ALS",
    origin: "City Medical Center",
    destination: "Rehabilitation Center",
    status: "transporting",
    priority: "high",
    assignedTo: "Unit 102",
    aiRecommendations: {
      route: "Recommended Route: Highway 101",
      crew: "Recommended Crew: ALS Team",
      billing: "Insurance: Blue Cross",
      insights: ["Priority case", "Monitor vital signs"],
      trafficStatus: {
        congestionLevel: "medium" as const,
        estimatedDelay: 10,
        alternateRouteAvailable: true
      }
    },
    eta: "20 mins",
    progress: 60,
    elapsedTime: "1h 15min",
    lastUpdated: new Date().toISOString(),
    efficiency: 88
  },
  {
    id: "DISP-00003",
    activationTime: new Date(Date.now() - 5400000).toISOString(),
    patient: {
      id: "PAT-003",
      name: "Robert Wilson",
      condition: "Dialysis Transport"
    },
    serviceType: "WC",
    origin: "Willow Creek Apartments",
    destination: "Dialysis Center",
    status: "onscene",
    priority: "medium",
    assignedTo: "Unit 103",
    aiRecommendations: {
      route: "Recommended Route: Local streets",
      crew: "Recommended Crew: Basic Transport",
      billing: "Insurance: Medicaid",
      insights: ["Regular patient", "Wheelchair assistance required"],
      trafficStatus: {
        congestionLevel: "low" as const,
        estimatedDelay: 3,
        alternateRouteAvailable: false
      }
    },
    eta: "30 mins",
    progress: 20,
    elapsedTime: "25 min",
    lastUpdated: new Date().toISOString(),
    efficiency: 95
  },
  {
    id: "DISP-00004",
    activationTime: new Date(Date.now() - 1800000).toISOString(),
    patient: {
      id: "PAT-004",
      name: "Sarah Davis",
      condition: "Cardiac Monitoring"
    },
    serviceType: "ALS",
    origin: "Emergency Care Clinic",
    destination: "Heart Center",
    status: "transporting",
    priority: "high",
    assignedTo: "Unit 104",
    aiRecommendations: {
      route: "Recommended Route: Express Route",
      crew: "Recommended Crew: Critical Care",
      billing: "Insurance: Private",
      insights: ["Critical transfer", "Continuous monitoring required"],
      trafficStatus: {
        congestionLevel: "low" as const,
        estimatedDelay: 2,
        alternateRouteAvailable: true
      }
    },
    eta: "10 mins",
    progress: 75,
    elapsedTime: "20 min",
    lastUpdated: new Date().toISOString(),
    efficiency: 98
  },
  {
    id: "DISP-00005",
    activationTime: new Date(Date.now() - 900000).toISOString(),
    patient: {
      id: "PAT-005",
      name: "James Brown",
      condition: "Physical Therapy"
    },
    serviceType: "BLS",
    origin: "Senior Living Complex",
    destination: "Physical Therapy Center",
    status: "enroute",
    priority: "medium",
    assignedTo: "Unit 105",
    aiRecommendations: {
      route: "Recommended Route: Secondary roads",
      crew: "Recommended Crew: Basic Transport",
      billing: "Insurance: Medicare",
      insights: ["Regular schedule", "Mobility assistance needed"],
      trafficStatus: {
        congestionLevel: "low" as const,
        estimatedDelay: 5,
        alternateRouteAvailable: false
      }
    },
    eta: "25 mins",
    progress: 30,
    elapsedTime: "10 min",
    lastUpdated: new Date().toISOString(),
    efficiency: 90
  },
  {
    id: "DISP-00006",
    activationTime: new Date().toISOString(),
    patient: {
      id: "PAT-006",
      name: "Patricia Miller",
      condition: "Scheduled Check-up"
    },
    serviceType: "BLS",
    origin: "Oakwood Residence",
    destination: "Community Health Center",
    status: "dispatch",
    priority: "medium",
    assignedTo: "Unassigned",
    aiRecommendations: {
      route: "Pending Assignment",
      crew: "Recommended: BLS Team",
      billing: "Insurance: Pending",
      insights: ["Routine transport", "No special requirements"],
      trafficStatus: {
        congestionLevel: "low" as const,
        estimatedDelay: 0,
        alternateRouteAvailable: false
      }
    },
    eta: "Pending",
    progress: 0,
    elapsedTime: "5 min",
    lastUpdated: new Date().toISOString(),
    efficiency: 0
  },
  {
    id: "DISP-00007",
    activationTime: new Date().toISOString(),
    patient: {
      id: "PAT-007",
      name: "Michael Clark",
      condition: "Emergency Evaluation"
    },
    serviceType: "ALS",
    origin: "Home Address",
    destination: "Emergency Room",
    status: "dispatch",
    priority: "high",
    assignedTo: "Unassigned",
    aiRecommendations: {
      route: "Pending Assignment",
      crew: "Recommended: ALS Team",
      billing: "Insurance: Pending",
      insights: ["High priority case", "Immediate response needed"],
      trafficStatus: {
        congestionLevel: "medium" as const,
        estimatedDelay: 0,
        alternateRouteAvailable: false
      }
    },
    eta: "Pending",
    progress: 0,
    elapsedTime: "2 min",
    lastUpdated: new Date().toISOString(),
    efficiency: 0
  },
  {
    id: "DISP-00008",
    activationTime: new Date().toISOString(),
    patient: {
      id: "PAT-008",
      name: "Elizabeth Taylor",
      condition: "Scheduled Surgery"
    },
    serviceType: "BLS",
    origin: "Assisted Living Facility",
    destination: "Surgical Center",
    status: "dispatch",
    priority: "medium",
    assignedTo: "Unassigned",
    aiRecommendations: {
      route: "Pending Assignment",
      crew: "Recommended: BLS Team",
      billing: "Insurance: Pending",
      insights: ["Pre-scheduled transport", "Surgery prep required"],
      trafficStatus: {
        congestionLevel: "low" as const,
        estimatedDelay: 0,
        alternateRouteAvailable: false
      }
    },
    eta: "Pending",
    progress: 0,
    elapsedTime: "8 min",
    lastUpdated: new Date().toISOString(),
    efficiency: 0
  },
  {
    id: "DISP-00009",
    activationTime: new Date().toISOString(),
    patient: {
      id: "PAT-009",
      name: "William Anderson",
      condition: "Respiratory Distress"
    },
    serviceType: "ALS",
    origin: "Urgent Care",
    destination: "Pulmonary Center",
    status: "dispatch",
    priority: "high",
    assignedTo: "Unassigned",
    aiRecommendations: {
      route: "Pending Assignment",
      crew: "Recommended: ALS Team",
      billing: "Insurance: Pending",
      insights: ["Respiratory monitoring needed", "Oxygen support required"],
      trafficStatus: {
        congestionLevel: "low" as const,
        estimatedDelay: 0,
        alternateRouteAvailable: false
      }
    },
    eta: "Pending",
    progress: 0,
    elapsedTime: "3 min",
    lastUpdated: new Date().toISOString(),
    efficiency: 0
  },
  {
    id: "DISP-00010",
    activationTime: new Date().toISOString(),
    patient: {
      id: "PAT-010",
      name: "Jennifer White",
      condition: "Post-Procedure"
    },
    serviceType: "WC",
    origin: "Day Surgery Center",
    destination: "Home Address",
    status: "dispatch",
    priority: "medium",
    assignedTo: "Unassigned",
    aiRecommendations: {
      route: "Pending Assignment",
      crew: "Recommended: Basic Transport",
      billing: "Insurance: Pending",
      insights: ["Wheelchair transport", "Post-procedure care"],
      trafficStatus: {
        congestionLevel: "low" as const,
        estimatedDelay: 0,
        alternateRouteAvailable: false
      }
    },
    eta: "Pending",
    progress: 0,
    elapsedTime: "1 min",
    lastUpdated: new Date().toISOString(),
    efficiency: 0
  }
];

export function DispatchBoard() {
  const [activeView, setActiveView] = useState<"active" | "scheduled">("active");
  const [dispatches, setDispatches] = useState(mockDispatches);
  const [isLoading, setIsLoading] = useState(false);
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

  const filterDispatches = (dispatches: typeof mockDispatches, status: "assigned" | "unassigned"): typeof mockDispatches => {
    return dispatches.filter(dispatch => {
      const isAssigned = dispatch.assignedTo && dispatch.assignedTo !== "Unassigned";
      return status === "assigned" ? isAssigned : !isAssigned;
    });
  };

  const simulateRealTimeUpdates = async (dispatch: (typeof mockDispatches)[0]): Promise<(typeof mockDispatches)[0]> => {
    const now = new Date();
    const activationTime = new Date(dispatch.activationTime);
    const elapsedMinutes = Math.floor((now.getTime() - activationTime.getTime()) / (1000 * 60));
    
    let progress = Number(dispatch.progress || 0);
    if (dispatch.assignedTo !== "Unassigned") {
      progress = Math.min(100, progress + Math.random() * 5);
    }

    let status = dispatch.status;
    if (progress === 100) {
      status = "available";
    } else if (progress > 0) {
      status = "transporting";
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
        analytics.efficiency = efficiencyResult.efficiency || 0;
        analytics.suggestedActions = efficiencyResult.suggestedActions || [];
        analytics.riskLevel = efficiencyResult.riskLevel || 'low';
      }
    } catch (error) {
      console.error('Error analyzing dispatch efficiency:', error);
    }

    try {
      monitorDispatchProgress(status, String(elapsedMinutes), 30);
    } catch (error) {
      console.error('Error monitoring dispatch progress:', error);
    }

    let aiInsights: string[] = [];
    try {
      const rawInsights = generateAIInsights(analytics);
      aiInsights = Array.isArray(rawInsights) ? rawInsights : [];
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
        trafficInfo.congestionLevel = traffic.congestionLevel || 'low';
        trafficInfo.delayMinutes = traffic.delayMinutes || Math.floor(Math.random() * 15);
        trafficInfo.alternateRouteAvailable = traffic.alternateRouteAvailable || false;
      }
    } catch (error) {
      console.error('Error getting traffic info:', error);
    }

    return {
      ...dispatch,
      status,
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

  const assignedDispatches = useMemo(() => 
    filterDispatches(dispatches, "assigned"),
    [dispatches]
  );

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
        <DispatchFilters />
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
              className={`${unassignedTabStyle || "data-[state=active]:bg-medical-secondary data-[state=active]:text-white"}`}
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