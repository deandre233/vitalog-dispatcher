
import { useState, useMemo, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Ambulance } from "lucide-react";
import { DispatchFilters } from "./DispatchFilters";
import { ScheduledTransport } from "./ScheduledTransport";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { DispatchStats } from "./board/DispatchStats";
import { DispatchControls } from "./board/DispatchControls";
import { DispatchAlert } from "./board/DispatchAlert";
import { DispatchTabs } from "./board/DispatchTabs";
import { ViewToggle } from "./board/ViewToggle";
import { useDispatchSimulator } from "./board/useDispatchSimulator";
import { DispatchData, BoardStats } from "./board/types";
import { mockDispatches } from "./board/mockData";

interface DispatchBoardProps {
  priority?: string;
}

export function DispatchBoard({ priority = "low" }: DispatchBoardProps) {
  const [activeView, setActiveView] = useState<"active" | "scheduled">("active");
  const [currentPriority, setCurrentPriority] = useState(priority);
  const [statsVisible, setStatsVisible] = useState(false);
  const [filtersVisible, setFiltersVisible] = useState(false);

  const { dispatches, setDispatches } = useDispatchSimulator(mockDispatches);

  const filterDispatches = (status: "assigned" | "unassigned"): DispatchData[] => {
    return dispatches.filter(dispatch => {
      const isAssigned = dispatch.assignedTo && dispatch.assignedTo !== "Unassigned";
      return status === "assigned" ? isAssigned : !isAssigned;
    });
  };

  const unassignedDispatches = useMemo(() => 
    filterDispatches("unassigned"),
    [dispatches]
  );

  const assignedDispatches = useMemo(() => 
    filterDispatches("assigned"),
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

  const handleRefresh = () => {
    // Refresh logic is now handled in DispatchControls component
  };

  const getSystemEfficiency = (): number => {
    if (assignedDispatches.length === 0) return 0;
    return assignedDispatches.reduce((sum, dispatch) => sum + (dispatch.efficiency || 0), 0) / assignedDispatches.length;
  };

  const systemEfficiency = getSystemEfficiency();

  const stats: BoardStats = {
    totalActive: dispatches.length,
    unassigned: unassignedDispatches.length,
    inProgress: assignedDispatches.length,
    highPriority: dispatches.filter(d => d.priority === "high").length,
    averageResponse: Math.floor(Math.random() * 15) + 5,
    systemEfficiency: systemEfficiency.toFixed(1),
  };

  return (
    <Card className="futuristic-panel p-6 m-6 shadow-xl transition-all hover-glow overflow-hidden">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Ambulance className="w-6 h-6 text-purple-400 pulse-glow" />
            <span className="text-gradient-purple">
              Dispatch Control Center
            </span>
          </h2>
          <ViewToggle activeView={activeView} setActiveView={setActiveView} />
        </div>
        <DispatchControls 
          onRefresh={handleRefresh}
          statsVisible={statsVisible}
          setStatsVisible={setStatsVisible}
          filtersVisible={filtersVisible}
          setFiltersVisible={setFiltersVisible}
        />
      </div>

      <DispatchStats 
        statsVisible={statsVisible} 
        setStatsVisible={setStatsVisible} 
        stats={stats} 
      />

      {filtersVisible && <DispatchFilters />}

      <DispatchAlert 
        unassignedCount={unassignedDispatches.length}
        assignedCount={assignedDispatches.length}
      />

      {activeView === "active" ? (
        <DispatchTabs 
          unassignedDispatches={unassignedDispatches}
          assignedDispatches={assignedDispatches}
        />
      ) : (
        <ScheduledTransport />
      )}
    </Card>
  );
}

export default DispatchBoard;
