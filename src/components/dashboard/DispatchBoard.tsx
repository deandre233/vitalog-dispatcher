import { Card } from "@/components/ui/card";
import { Brain } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { DispatchItem } from "./DispatchItem";
import { DispatchFilters } from "./DispatchFilters";
import { ScheduledTransport } from "./ScheduledTransport";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Dispatch {
  id: string;
  patientName: string;
  pickupLocation: string;
  dropoffLocation: string;
  serviceType: string;
  assignedTo: string;
  status: string;
  timeWaiting?: string;
  comments?: string;
}

const mockDispatches: Dispatch[] = [
  {
    id: "7684",
    patientName: "Turner, Angela",
    pickupLocation: "Emory Dialysis At North Decatur",
    dropoffLocation: "Emory University Hospital Midtown",
    serviceType: "BLS",
    assignedTo: "Unassigned",
    status: "Pending",
    timeWaiting: "will call",
    comments: "Breathing problem: Req oxygen"
  },
  {
    id: "7601",
    patientName: "Smith, John",
    pickupLocation: "Emory Dialysis At Candler",
    dropoffLocation: "CROSSING AT EASTLAKE",
    serviceType: "BLS",
    assignedTo: "MED 1",
    status: "En Route",
    comments: "Impaired movement"
  }
];

// Filter dispatches based on assignment status
const filterDispatches = (dispatches: Dispatch[], status: "assigned" | "unassigned") => {
  return dispatches.filter(dispatch => 
    status === "assigned" 
      ? dispatch.assignedTo !== "Unassigned"
      : dispatch.assignedTo === "Unassigned"
  );
};

export function DispatchBoard() {
  const [activeView, setActiveView] = useState<"active" | "scheduled">("active");

  // Separate dispatches into assigned and unassigned
  const unassignedDispatches = filterDispatches(mockDispatches, "unassigned");
  const assignedDispatches = filterDispatches(mockDispatches, "assigned");

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
          AI Insight: Current dispatch load is optimal. {unassignedDispatches.length} dispatches waiting for assignment.
        </AlertDescription>
      </Alert>

      {activeView === "active" ? (
        <Tabs defaultValue="unassigned" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="unassigned">
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