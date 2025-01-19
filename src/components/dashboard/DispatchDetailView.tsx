import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, MapPin, FileText, AlertCircle, Users, DollarSign, Receipt, BookOpen, ArrowRightLeft } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTransportRecord, useUpdateTransport } from "@/hooks/useTransportRecord";
import { OverviewTab } from "./dispatch/OverviewTab";
import { ScheduleTab } from "./dispatch/ScheduleTab";
import { WarningsTab } from "./dispatch/WarningsTab";
import { RecurrenceTab } from "./dispatch/RecurrenceTab";
import { DirectionsTab } from "./dispatch/DirectionsTab";
import { DocumentsTab } from "./dispatch/DocumentsTab";
import { IncidentsTab } from "./dispatch/IncidentsTab";
import { CrewTab } from "./dispatch/CrewTab";
import { BillingTab } from "./dispatch/BillingTab";
import { InvoicesTab } from "./dispatch/InvoicesTab";
import { JournalsTab } from "./dispatch/JournalsTab";
import { NotFoundView } from "./dispatch/NotFoundView";

export function DispatchDetailView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: transportRecord, isLoading } = useTransportRecord(id);
  const updateTransportMutation = useUpdateTransport(id);

  const handleWarningToggle = (warning: string) => {
    if (!transportRecord) return;

    const currentWarnings = transportRecord.warnings || [];
    const newWarnings = currentWarnings.includes(warning)
      ? currentWarnings.filter(w => w !== warning)
      : [...currentWarnings, warning];

    updateTransportMutation.mutate({ warnings: newWarnings });
  };

  const getPriorityBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      Critical: "destructive",
      Emergent: "destructive",
      Scheduled: "default",
      "Lower acuity": "secondary"
    };
    return variants[status] || "default";
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!transportRecord) {
    return <NotFoundView id={id} onBack={() => navigate(-1)} />;
  }

  return (
    <Card className="p-6">
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate(-1)}
          className="h-8 w-8"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">
              Dispatch #{id}
            </h2>
            <div className="flex items-center gap-4">
              <div className="text-sm">
                <span className="text-gray-500">Assigned to:</span>{" "}
                <span className="font-medium">{transportRecord.crew_assigned || "Unassigned"}</span>
              </div>
              <Badge variant={getPriorityBadge(transportRecord.dispatch_status || "Pending")}>
                {transportRecord.dispatch_status || "Pending"}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3 className="text-sm font-medium mb-2">Outbound Trip</h3>
            <div className="space-y-2">
              <p className="text-sm">
                <span className="text-gray-500">Origin:</span>{" "}
                {transportRecord.origin_address || transportRecord.pickup_location}
              </p>
              <p className="text-sm">
                <span className="text-gray-500">Destination:</span>{" "}
                {transportRecord.destination_address || transportRecord.dropoff_location}
              </p>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-medium mb-2">Return Trip</h3>
            {transportRecord.return_trip_id ? (
              <p className="text-sm">
                Return trip attached: #{transportRecord.return_trip_id}
              </p>
            ) : (
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => {/* TODO: Implement return trip creation */}}
              >
                <ArrowRightLeft className="h-4 w-4 mr-2" />
                Create Return Trip
              </Button>
            )}
          </div>
        </div>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="w-full justify-start">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="directions">
            <MapPin className="h-4 w-4 mr-2" />
            Directions
          </TabsTrigger>
          <TabsTrigger value="schedule">Schedule</TabsTrigger>
          <TabsTrigger value="warnings">Warnings</TabsTrigger>
          <TabsTrigger value="documents">
            <FileText className="h-4 w-4 mr-2" />
            Documents
          </TabsTrigger>
          <TabsTrigger value="incidents">
            <AlertCircle className="h-4 w-4 mr-2" />
            Incidents
          </TabsTrigger>
          <TabsTrigger value="crew">
            <Users className="h-4 w-4 mr-2" />
            Crew
          </TabsTrigger>
          <TabsTrigger value="billing">
            <DollarSign className="h-4 w-4 mr-2" />
            Billing
          </TabsTrigger>
          <TabsTrigger value="invoices">
            <Receipt className="h-4 w-4 mr-2" />
            Invoices
          </TabsTrigger>
          <TabsTrigger value="journals">
            <BookOpen className="h-4 w-4 mr-2" />
            Journals
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <OverviewTab transportRecord={transportRecord} />
        </TabsContent>

        <TabsContent value="directions">
          <DirectionsTab transportRecord={transportRecord} />
        </TabsContent>

        <TabsContent value="schedule">
          <ScheduleTab 
            transportRecord={transportRecord}
            onUpdate={(updates) => updateTransportMutation.mutate(updates)}
          />
        </TabsContent>

        <TabsContent value="warnings">
          <WarningsTab
            transportRecord={transportRecord}
            onWarningToggle={handleWarningToggle}
          />
        </TabsContent>

        <TabsContent value="documents">
          <DocumentsTab transportRecord={transportRecord} />
        </TabsContent>

        <TabsContent value="incidents">
          <IncidentsTab transportRecord={transportRecord} />
        </TabsContent>

        <TabsContent value="crew">
          <CrewTab transportRecord={transportRecord} />
        </TabsContent>

        <TabsContent value="billing">
          <BillingTab transportRecord={transportRecord} />
        </TabsContent>

        <TabsContent value="invoices">
          <InvoicesTab transportRecord={transportRecord} />
        </TabsContent>

        <TabsContent value="journals">
          <JournalsTab transportRecord={transportRecord} />
        </TabsContent>
      </Tabs>
    </Card>
  );
}