import { useState, useMemo, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { AlertTriangle, ChevronDown, ChevronUp, Truck, Ambulance, Clock, MapPin, RefreshCw, Settings, Filter, BarChart3 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { DispatchItem } from "./DispatchItem";
import { DispatchFilters } from "./DispatchFilters";
import { ScheduledTransport } from "./ScheduledTransport";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface DispatchBoardProps {
  priority?: string;
}

type CongestionLevel = "low" | "medium" | "high";

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
        congestionLevel: "low" as CongestionLevel,
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
        congestionLevel: "medium" as CongestionLevel,
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
        congestionLevel: "low" as CongestionLevel,
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
        congestionLevel: "low" as CongestionLevel,
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
        congestionLevel: "low" as CongestionLevel,
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
        congestionLevel: "low" as CongestionLevel,
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
        congestionLevel: "medium" as CongestionLevel,
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
        congestionLevel: "low" as CongestionLevel,
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
        congestionLevel: "low" as CongestionLevel,
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
        congestionLevel: "low" as CongestionLevel,
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

export function DispatchBoard({ priority = "low" }: DispatchBoardProps) {
  const [activeView, setActiveView] = useState<"active" | "scheduled">("active");
  const [dispatches, setDispatches] = useState(mockDispatches);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPriority, setCurrentPriority] = useState(priority);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [statsVisible, setStatsVisible] = useState(false);
  const [filtersVisible, setFiltersVisible] = useState(false);

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

    const congestionLevels: CongestionLevel[] = ["low", "medium", "high"];
    const randomCongestionLevel = congestionLevels[Math.floor(Math.random() * congestionLevels.length)];

    return {
      ...dispatch,
      status,
      progress,
      elapsedTime: `${elapsedMinutes} min`,
      lastUpdated: now.toISOString(),
      efficiency: Math.random() * 100,
      aiRecommendations: {
        ...dispatch.aiRecommendations,
        trafficStatus: {
          ...dispatch.aiRecommendations.trafficStatus,
          congestionLevel: randomCongestionLevel
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
        toast.warning(`${highPriorityDispatches.length} high-priority dispatches need attention`);
      }
    }
  }, [unassignedDispatches]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      toast.success("Dispatch board refreshed");
    }, 1000);
  };

  const getSystemEfficiency = (): number => {
    if (assignedDispatches.length === 0) return 0;
    return assignedDispatches.reduce((sum, dispatch) => sum + (dispatch.efficiency || 0), 0) / assignedDispatches.length;
  };

  const systemEfficiency = getSystemEfficiency();

  const stats = {
    totalActive: dispatches.length,
    unassigned: unassignedDispatches.length,
    inProgress: assignedDispatches.length,
    highPriority: dispatches.filter(d => d.priority === "high").length,
    averageResponse: Math.floor(Math.random() * 15) + 5,
    systemEfficiency: systemEfficiency.toFixed(1),
  };

  const unassignedTabStyle = unassignedDispatches.length > 0 
    ? "bg-red-900/20 text-red-400 data-[state=active]:bg-red-800/30 data-[state=active]:text-red-200" 
    : "";

  return (
    <Card className="futuristic-panel p-6 m-6 shadow-xl transition-all hover:shadow-purple-500/20 overflow-hidden">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Ambulance className="w-6 h-6 text-purple-400" />
            <span className="bg-gradient-to-r from-purple-300 to-blue-300 bg-clip-text text-transparent">
              Dispatch Control Center
            </span>
          </h2>
          <div className="flex gap-2">
            <Button
              variant={activeView === "active" ? "default" : "outline"}
              onClick={() => setActiveView("active")}
              className="glass-panel bg-purple-900/30 text-purple-200 hover:bg-purple-800/50 border-purple-600/20"
            >
              Active Dispatches
            </Button>
            <Button
              variant={activeView === "scheduled" ? "default" : "outline"}
              onClick={() => setActiveView("scheduled")}
              className="glass-panel bg-blue-900/20 text-blue-200 hover:bg-blue-800/40 border-blue-600/20"
            >
              Scheduled Transport
            </Button>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setStatsVisible(!statsVisible)}
            className="glass-panel hover:bg-white/5"
          >
            <BarChart3 className="h-4 w-4 text-blue-300" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setFiltersVisible(!filtersVisible)}
            className="glass-panel hover:bg-white/5"
          >
            <Filter className="h-4 w-4 text-purple-300" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleRefresh} 
            disabled={isRefreshing}
            className="glass-panel hover:bg-white/5"
          >
            <RefreshCw className={`h-4 w-4 text-green-300 ${isRefreshing ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>

      {statsVisible && (
        <div className="glass-panel mb-4 p-4 border border-white/10 rounded-lg bg-white/5 backdrop-blur-lg">
          <div className="grid grid-cols-6 gap-4">
            <div className="flex flex-col items-center">
              <span className="text-xs text-white/60">Total</span>
              <span className="text-xl font-bold text-white">{stats.totalActive}</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-xs text-white/60">Unassigned</span>
              <span className="text-xl font-bold text-red-400">{stats.unassigned}</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-xs text-white/60">In Progress</span>
              <span className="text-xl font-bold text-green-400">{stats.inProgress}</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-xs text-white/60">High Priority</span>
              <span className="text-xl font-bold text-yellow-400">{stats.highPriority}</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-xs text-white/60">Avg Response</span>
              <span className="text-xl font-bold text-blue-400">{stats.averageResponse}m</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-xs text-white/60">Efficiency</span>
              <span className="text-xl font-bold text-purple-400">{stats.systemEfficiency}%</span>
            </div>
          </div>
          
          <div className="mt-4">
            <div className="flex justify-between text-xs text-white/60 mb-1">
              <span>System Efficiency</span>
              <span>{stats.systemEfficiency}%</span>
            </div>
            <Progress value={parseFloat(stats.systemEfficiency)} className="h-1 bg-white/10">
              <div className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full" />
            </Progress>
          </div>
        </div>
      )}

      {filtersVisible && <DispatchFilters />}

      <Alert className="mb-4 glass-panel border-purple-500/20 bg-purple-950/30">
        <AlertTriangle className="h-4 w-4 text-purple-400" />
        <AlertDescription className="text-white flex items-center justify-between w-full">
          <span>
            {unassignedDispatches.length} dispatches waiting for assignment. 
            {assignedDispatches.length > 0 && ` ${assignedDispatches.length} active transports progressing normally.`}
          </span>
          <div className="flex gap-2">
            {unassignedDispatches.length > 0 && (
              <Badge className="bg-red-900/50 text-red-200 hover:bg-red-900/70">
                {unassignedDispatches.length} Unassigned
              </Badge>
            )}
            {assignedDispatches.length > 0 && (
              <Badge className="bg-green-900/50 text-green-200 hover:bg-green-900/70">
                {assignedDispatches.length} Active
              </Badge>
            )}
          </div>
        </AlertDescription>
      </Alert>

      {activeView === "active" ? (
        <Tabs defaultValue="unassigned" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2 bg-gray-900/50 backdrop-blur-md">
            <TabsTrigger 
              value="unassigned"
              className={`${unassignedTabStyle || "data-[state=active]:bg-purple-800/30 data-[state=active]:text-white"} transition-all duration-300`}
            >
              Unassigned ({unassignedDispatches.length})
            </TabsTrigger>
            <TabsTrigger 
              value="assigned"
              className="data-[state=active]:bg-green-800/30 data-[state=active]:text-white transition-all duration-300"
            >
              Assigned ({assignedDispatches.length})
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="unassigned" className="space-y-4 animate-fade-in">
            <div className="glass-panel p-4 border border-red-500/20 rounded-lg bg-red-950/20 backdrop-blur-lg">
              <h3 className="text-lg font-medium text-red-300 mb-2 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                Waiting for Assignment
              </h3>
              <p className="text-sm text-red-200/80">
                {unassignedDispatches.length} dispatches need crew assignment
              </p>
            </div>
            {unassignedDispatches.map((dispatch) => (
              <DispatchItem key={dispatch.id} {...dispatch} />
            ))}
          </TabsContent>
          
          <TabsContent value="assigned" className="space-y-4 animate-fade-in">
            <div className="glass-panel p-4 border border-green-500/20 rounded-lg bg-green-950/20 backdrop-blur-lg">
              <h3 className="text-lg font-medium text-green-300 mb-2 flex items-center gap-2">
                <Truck className="h-4 w-4" />
                Active Transports
              </h3>
              <p className="text-sm text-green-200/80">
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

export default DispatchBoard;
