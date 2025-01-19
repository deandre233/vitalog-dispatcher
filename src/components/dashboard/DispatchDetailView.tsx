import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  ArrowLeft,
  User,
  MapPin,
  Clock,
  Ambulance,
  FileText,
  Brain,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface DetailSection {
  title: string;
  content: React.ReactNode;
}

export function DispatchDetailView() {
  const { id } = useParams();
  const navigate = useNavigate();

  // This would typically come from a data store or API
  const dispatchDetails = {
    id: "7684",
    patient: {
      name: "Turner, Angela",
      condition: "Breathing problem: Req oxygen",
      dob: "1965-03-15",
      medicalHistory: "Asthma, Hypertension",
    },
    transport: {
      origin: "Emory Dialysis At North Decatur",
      destination: "Emory University Hospital Midtown",
      assignedCrew: "Unassigned",
      status: "Pending",
      priority: "medium",
      eta: "25 mins",
    },
    aiInsights: {
      recommendedRoute: "I-85 S",
      crewSuggestion: "Team A",
      billing: "Insurance: Medicare",
      trafficStatus: "Moderate congestion expected",
    },
  };

  const sections: DetailSection[] = [
    {
      title: "Patient Information",
      content: (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-gray-500" />
            <span className="font-medium">{dispatchDetails.patient.name}</span>
          </div>
          <div className="pl-7 space-y-2">
            <p>DOB: {dispatchDetails.patient.dob}</p>
            <p>Condition: {dispatchDetails.patient.condition}</p>
            <p>Medical History: {dispatchDetails.patient.medicalHistory}</p>
          </div>
        </div>
      ),
    },
    {
      title: "Transport Details",
      content: (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-gray-500" />
            <span className="font-medium">Route Information</span>
          </div>
          <div className="pl-7 space-y-2">
            <p>From: {dispatchDetails.transport.origin}</p>
            <p>To: {dispatchDetails.transport.destination}</p>
            <p>ETA: {dispatchDetails.transport.eta}</p>
          </div>
          <div className="flex items-center gap-2">
            <Ambulance className="w-5 h-5 text-gray-500" />
            <span className="font-medium">Crew Assignment</span>
          </div>
          <div className="pl-7">
            <p>Assigned to: {dispatchDetails.transport.assignedCrew}</p>
          </div>
        </div>
      ),
    },
    {
      title: "AI Insights",
      content: (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-gray-500" />
            <span className="font-medium">AI Recommendations</span>
          </div>
          <div className="pl-7 space-y-2">
            <p>Route: {dispatchDetails.aiInsights.recommendedRoute}</p>
            <p>Crew: {dispatchDetails.aiInsights.crewSuggestion}</p>
            <p>Billing: {dispatchDetails.aiInsights.billing}</p>
            <p>Traffic: {dispatchDetails.aiInsights.trafficStatus}</p>
          </div>
        </div>
      ),
    },
  ];

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
          <TabsTrigger value="patient">Patient</TabsTrigger>
          <TabsTrigger value="transport">Transport</TabsTrigger>
          <TabsTrigger value="ai">AI Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {sections.map((section) => (
            <div key={section.title} className="border-b pb-4 last:border-0">
              <h3 className="font-medium mb-4">{section.title}</h3>
              {section.content}
            </div>
          ))}
        </TabsContent>

        <TabsContent value="patient">
          {sections[0].content}
        </TabsContent>

        <TabsContent value="transport">
          {sections[1].content}
        </TabsContent>

        <TabsContent value="ai">
          {sections[2].content}
        </TabsContent>
      </Tabs>
    </Card>
  );
}