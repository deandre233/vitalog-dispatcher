import { Card } from "@/components/ui/card";
import { Brain } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { DispatchItem } from "./DispatchItem";
import { DispatchFilters } from "./DispatchFilters";
import { ScheduledTransportForm } from "../dispatch/ScheduledTransportForm";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useState } from "react";

const dispatches = [
  {
    id: "D-001",
    activationTime: "10:30 AM",
    assignedTo: "Team A",
    patient: "John Doe",
    serviceType: "BLS",
    origin: "123 Emergency St",
    destination: "City Hospital",
    status: "En Route",
    priority: "high",
    aiRecommendations: {
      route: "Alternate route available: -5 min ETA",
      crew: "Optimal crew assignment",
      billing: "Insurance pre-verified",
    },
    eta: "15 min",
  },
  {
    id: "D-002",
    activationTime: "10:45 AM",
    assignedTo: "Team B",
    patient: "Jane Smith",
    serviceType: "ALS",
    origin: "456 Medical Ave",
    destination: "County Medical Center",
    status: "Pending",
    priority: "medium",
    aiRecommendations: {
      route: "Current route optimal",
      crew: "Consider Team C (closer to location)",
      billing: "Verify insurance details",
    },
    eta: "22 min",
  },
  {
    id: "D-003",
    activationTime: "10:15 AM",
    assignedTo: "Team C",
    patient: "Robert Brown",
    serviceType: "BLS",
    origin: "789 Care Lane",
    destination: "Memorial Hospital",
    status: "Completed",
    priority: "low",
    aiRecommendations: {
      route: "Route completed",
      crew: "Performance rating: 95%",
      billing: "Ready for billing",
    },
    eta: "0 min",
  },
];

export function DispatchBoard() {
  const [activeView, setActiveView] = useState("active");

  return (
    <Card className="p-6 m-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-medical-primary">
          Dispatch Management
        </h2>
        <DispatchFilters />
      </div>

      <div className="flex justify-center mb-6">
        <ToggleGroup
          type="single"
          value={activeView}
          onValueChange={(value) => {
            if (value) setActiveView(value);
          }}
        >
          <ToggleGroupItem value="active" aria-label="Active Dispatches">
            Active Dispatches
          </ToggleGroupItem>
          <ToggleGroupItem value="scheduled" aria-label="Scheduled Transport">
            Scheduled Transport
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      {activeView === "active" ? (
        <>
          <Alert className="mb-4">
            <Brain className="h-4 w-4" />
            <AlertDescription>
              AI Insight: Current dispatch load is optimal. 2 crews available for
              emergency response.
            </AlertDescription>
          </Alert>

          <div className="space-y-4">
            {dispatches.map((dispatch) => (
              <DispatchItem key={dispatch.id} {...dispatch} />
            ))}
          </div>
        </>
      ) : (
        <ScheduledTransportForm />
      )}
    </Card>
  );
}