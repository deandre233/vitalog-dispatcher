import { useParams, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, MapPin, Users, AlertCircle, Clock, Truck, AlertTriangle, Navigation } from "lucide-react";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface AIRecommendations {
  routeSuggestion: string;
  crewEfficiency: number;
  trafficStatus: {
    congestionLevel: "low" | "medium" | "high";
    estimatedDelay: number;
    alternateRouteAvailable: boolean;
  };
  warnings?: string[];
}

export function UnitDetailView() {
  const { unitId } = useParams();
  const navigate = useNavigate();

  // This would be replaced with actual data fetching
  const { data: unitData } = useQuery({
    queryKey: ['unit', unitId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('transport_records')
        .select('*')
        .eq('crew_assigned', unitId)
        .single();

      if (error) throw error;
      return {
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
        calls: "0 calls done",
        aiRecommendations: {
          routeSuggestion: "Consider alternate route via Ponce de Leon Ave due to traffic",
          crewEfficiency: 85,
          trafficStatus: {
            congestionLevel: "medium",
            estimatedDelay: 10,
            alternateRouteAvailable: true
          },
          warnings: [
            "High traffic area - consider alternate route",
            "Crew approaching shift limit"
          ]
        } as AIRecommendations
      };
    }
  });

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

  if (!unitData) {
    return (
      <Card className="p-6 m-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="h-8 w-8"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">Loading...</h1>
        </div>
      </Card>
    );
  }

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

          {unitData.aiRecommendations.trafficStatus && (
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-medium text-blue-900 mb-2">AI Traffic Insights</h3>
              <div className="space-y-2 text-sm text-blue-800">
                <p>Traffic Level: {unitData.aiRecommendations.trafficStatus.congestionLevel}</p>
                <p>Estimated Delay: {unitData.aiRecommendations.trafficStatus.estimatedDelay} minutes</p>
                {unitData.aiRecommendations.trafficStatus.alternateRouteAvailable && (
                  <p className="flex items-center gap-2">
                    <Navigation className="h-4 w-4" />
                    Alternate route available
                  </p>
                )}
              </div>
            </div>
          )}
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
            {unitData.aiRecommendations.crewEfficiency && (
              <div className="mt-2">
                <p className="text-sm text-gray-600">Crew Efficiency Score</p>
                <Progress value={unitData.aiRecommendations.crewEfficiency} className="h-2 mt-1" />
              </div>
            )}
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

        {unitData.aiRecommendations.warnings && unitData.aiRecommendations.warnings.length > 0 && (
          <section className="bg-yellow-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
              <h3 className="font-medium text-yellow-900">AI Warnings</h3>
            </div>
            <ul className="space-y-2">
              {unitData.aiRecommendations.warnings.map((warning, index) => (
                <li key={index} className="text-sm text-yellow-800 flex items-center gap-2">
                  <span>•</span> {warning}
                </li>
              ))}
            </ul>
          </section>
        )}

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