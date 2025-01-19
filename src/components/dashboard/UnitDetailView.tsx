import { useParams, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, MapPin, Users, AlertCircle } from "lucide-react";
import { toast } from "sonner";

export function UnitDetailView() {
  const { unitId } = useParams();
  const navigate = useNavigate();

  // This would be replaced with actual data fetching
  const unitData = {
    unitId: unitId || "MED 1",
    status: "En Route",
    progress: 60,
    distance: "4.2 miles",
    origin: "Emory Dialysis At North Decatur",
    destination: "Emory University Hospital Midtown",
    patient: "Turner, Angela",
    condition: "Breathing problem: Req oxygen",
    scheduledTime: "12:30 PM",
    transportType: "BLS",
    crew: "Kimpson, Deandre + Parker, Patrick",
    schedule: "6 hours over",
    calls: "0 calls done"
  };

  const handleReassign = () => {
    toast.info("Reassign functionality to be implemented");
  };

  const handleUnassign = () => {
    toast.info("Unassign functionality to be implemented");
  };

  const handleFollowUp = () => {
    toast.info("Follow-up functionality to be implemented");
  };

  const handleCancel = () => {
    toast.info("Cancel functionality to be implemented");
  };

  return (
    <Card className="p-6 m-6">
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate(-1)}
          className="h-8 w-8"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold">Unit ID: {unitData.unitId}</h1>
      </div>

      <div className="grid gap-6">
        <section className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Status: {unitData.status}</h2>
            <span className="text-gray-600">{unitData.distance}</span>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Transport Progress</span>
              <span>{unitData.progress}%</span>
            </div>
            <Progress value={unitData.progress} className="h-2" />
          </div>
        </section>

        <section className="grid gap-4 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-gray-500" />
            <div>
              <p className="text-sm text-gray-600">From</p>
              <p className="font-medium">{unitData.origin}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-gray-500" />
            <div>
              <p className="text-sm text-gray-600">To</p>
              <p className="font-medium">{unitData.destination}</p>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-gray-500" />
            <h3 className="font-medium">Crew Information</h3>
          </div>
          <div className="pl-6 space-y-2">
            <p><span className="text-gray-600">Assigned Crew:</span> {unitData.crew}</p>
            <p><span className="text-gray-600">Schedule:</span> {unitData.schedule}</p>
            <p><span className="text-gray-600">Calls:</span> {unitData.calls}</p>
          </div>
        </section>

        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-gray-500" />
            <h3 className="font-medium">Transport Details</h3>
          </div>
          <div className="pl-6 space-y-2">
            <p><span className="text-gray-600">Patient:</span> {unitData.patient}</p>
            <p><span className="text-gray-600">Condition:</span> {unitData.condition}</p>
            <p><span className="text-gray-600">Scheduled Time:</span> {unitData.scheduledTime}</p>
            <p><span className="text-gray-600">Transport Type:</span> {unitData.transportType}</p>
          </div>
        </section>

        <section className="flex gap-4 pt-4 border-t">
          <Button onClick={handleReassign}>Reassign Unit</Button>
          <Button onClick={handleUnassign} variant="outline">Unassign Unit</Button>
          <Button onClick={handleFollowUp} variant="outline">Follow Up</Button>
          <Button onClick={handleCancel} variant="destructive">Cancel Transport</Button>
        </section>
      </div>
    </Card>
  );
}