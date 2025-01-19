import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTransportRecord, useUpdateTransport } from "@/hooks/useTransportRecord";
import { OverviewTab } from "./dispatch/OverviewTab";
import { ScheduleTab } from "./dispatch/ScheduleTab";
import { WarningsTab } from "./dispatch/WarningsTab";
import { RecurrenceTab } from "./dispatch/RecurrenceTab";
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
        <h2 className="text-xl font-semibold">
          Dispatch #{id} Details
        </h2>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="schedule">Schedule</TabsTrigger>
          <TabsTrigger value="warnings">Warnings</TabsTrigger>
          <TabsTrigger value="recurrence">Recurrence</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <OverviewTab transportRecord={transportRecord} />
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

        <TabsContent value="recurrence">
          <RecurrenceTab
            transportRecord={transportRecord}
            onRecurrenceChange={(value) => updateTransportMutation.mutate({ recurrence_type: value })}
          />
        </TabsContent>
      </Tabs>
    </Card>
  );
}