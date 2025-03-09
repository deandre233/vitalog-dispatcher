
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertTriangle, Truck } from "lucide-react";
import { DispatchItem } from "../DispatchItem";

interface DispatchTabsProps {
  unassignedDispatches: any[];
  assignedDispatches: any[];
}

export function DispatchTabs({ unassignedDispatches, assignedDispatches }: DispatchTabsProps) {
  const unassignedTabStyle = unassignedDispatches.length > 0 
    ? "bg-red-900/20 text-red-400 data-[state=active]:bg-red-800/30 data-[state=active]:text-red-200" 
    : "";

  return (
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
  );
}
