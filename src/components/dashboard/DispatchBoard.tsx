import { Card } from "@/components/ui/card";
import { Brain } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { DispatchItem } from "./DispatchItem";
import { DispatchFilters } from "./DispatchFilters";
import { ScheduledTransport } from "./ScheduledTransport";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const dispatches = [
  {
    id: "PT-001",
    activationTime: "12:30",
    assignedTo: "Team A",
    patient: "Smith, Helen",
    serviceType: "BLS",
    origin: "Parkside at Budd Terrace, 508A",
    destination: "Neurology/Emory Brain Health Center",
    status: "En Route",
    priority: "medium",
    aiRecommendations: {
      route: "Current route optimal",
      crew: "Team assignment confirmed",
      billing: "Insurance verified",
    },
    eta: "15 min",
    comments: "Call for specific room directions",
    progress: 75,
  },
  {
    id: "PT-002",
    activationTime: "13:00",
    assignedTo: "Unassigned",
    patient: "Johnson, Michael",
    serviceType: "BLS",
    origin: "Parkside at Budd Terrace, 613",
    destination: "Emory University Hospital Midtown",
    status: "Pending",
    priority: "high",
    aiRecommendations: {
      route: "Alternate route suggested",
      crew: "Team B recommended",
      billing: "Verify insurance",
    },
    eta: "22 min",
    warnings: "Breathing problem: Req oxygen",
    progress: 25,
  },
  {
    id: "PT-003",
    activationTime: "08:30",
    assignedTo: "Team C",
    patient: "Brown, Angela",
    serviceType: "BLS",
    origin: "CROSSING AT EASTLAKE",
    destination: "Emory Dialysis At Candler",
    status: "En Route",
    priority: "high",
    aiRecommendations: {
      route: "Route optimized",
      crew: "Team C assigned",
      billing: "Medicare confirmed",
    },
    eta: "10 min",
    warnings: "Impaired movement",
    progress: 90,
  },
];

export function DispatchBoard() {
  const [activeView, setActiveView] = useState<"active" | "scheduled">("active");

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
          AI Insight: Current dispatch load is optimal. 2 crews available for emergency response.
        </AlertDescription>
      </Alert>

      {activeView === "active" ? (
        <div className="space-y-4">
          {dispatches.map((dispatch) => (
            <DispatchItem key={dispatch.id} {...dispatch} />
          ))}
        </div>
      ) : (
        <ScheduledTransport />
      )}
    </Card>
  );
}