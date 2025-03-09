
import { useState, useMemo } from "react";
import { TabsContent, TabsList, TabsTrigger, Tabs } from "@/components/ui/tabs";
import { DispatchItem } from "../DispatchItem";

interface DispatchTabsProps {
  unassignedDispatches: any[];
  assignedDispatches: any[];
}

export function DispatchTabs({ unassignedDispatches, assignedDispatches }: DispatchTabsProps) {
  const unassignedTabStyle = unassignedDispatches.length > 0 
    ? "bg-red-100 text-red-700 data-[state=active]:bg-red-200" 
    : "";

  return (
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
  );
}
