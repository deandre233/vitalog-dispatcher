
import { useState, useMemo, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { DispatchFilters } from "./DispatchFilters";
import { ScheduledTransport } from "./ScheduledTransport";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { 
  DispatchNavigation, 
  DispatchStatusAlert, 
  DispatchTabs,
  filterDispatches,
  simulateRealTimeUpdates,
  mockDispatches
} from "./dispatch-board";

interface DispatchBoardProps {
  priority?: string;
}

export function DispatchBoard({ priority = "low" }: DispatchBoardProps) {
  const [activeView, setActiveView] = useState<"active" | "scheduled">("active");
  const [dispatches, setDispatches] = useState(mockDispatches);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPriority, setCurrentPriority] = useState(priority);

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

  return (
    <Card className="p-6 m-6 bg-gradient-to-br from-medical-accent to-white border-medical-secondary/20 shadow-lg transition-all hover:shadow-xl">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-semibold text-medical-primary">
            Dispatch Control
          </h2>
          <DispatchNavigation 
            activeView={activeView} 
            setActiveView={setActiveView} 
          />
        </div>
        <DispatchFilters />
      </div>

      <DispatchStatusAlert 
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
