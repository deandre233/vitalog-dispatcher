import { useState } from "react";
import { AlertCircle, Plus } from "lucide-react";
import { TransportRecord } from "@/hooks/useTransportRecord";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface IncidentsTabProps {
  transportRecord: TransportRecord;
}

export function IncidentsTab({ transportRecord }: IncidentsTabProps) {
  const [description, setDescription] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { toast } = useToast();

  const handleSubmitIncident = async () => {
    if (!description.trim()) {
      toast({
        title: "Error",
        description: "Please provide an incident description",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    try {
      // Call the AI analysis function
      const { data: analysis, error: analysisError } = await supabase.functions.invoke(
        "analyze-incident",
        {
          body: JSON.stringify({
            description,
            transportId: transportRecord.id,
          }),
        }
      );

      if (analysisError) throw analysisError;

      // Store the incident and AI analysis
      const { error: insertError } = await supabase
        .from("ai_analysis_results")
        .insert({
          transport_id: transportRecord.id,
          analysis_type: "incident",
          prediction: analysis.severity,
          recommendation: analysis.recommendation,
          suggestions: analysis.actionItems,
          metadata: {
            description,
            timestamp: new Date().toISOString(),
            analysis: analysis,
          },
        });

      if (insertError) throw insertError;

      toast({
        title: "Success",
        description: "Incident report created successfully",
      });

      setDescription("");
    } catch (error) {
      console.error("Error creating incident report:", error);
      toast({
        title: "Error",
        description: "Failed to create incident report",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-gray-500" />
          <span className="font-medium">Incidents</span>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => document.getElementById("incident-description")?.focus()}
        >
          <Plus className="w-4 h-4 mr-2" />
          New Incident
        </Button>
      </div>

      <Card className="p-4">
        <div className="space-y-4">
          <Textarea
            id="incident-description"
            placeholder="Describe the incident in detail..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="min-h-[100px]"
          />
          <Button 
            onClick={handleSubmitIncident} 
            disabled={isAnalyzing || !description.trim()}
          >
            {isAnalyzing ? "Analyzing..." : "Submit Incident Report"}
          </Button>
        </div>
      </Card>

      {/* Display existing incidents */}
      <div className="space-y-4">
        {transportRecord.incidents?.map((incident: any, index: number) => (
          <Card key={index} className="p-4">
            <div className="space-y-2">
              <p className="text-sm text-gray-600">
                {new Date(incident.timestamp).toLocaleString()}
              </p>
              <p>{incident.description}</p>
              {incident.analysis && (
                <div className="mt-2 pt-2 border-t">
                  <p className="text-sm font-medium">AI Analysis:</p>
                  <p className="text-sm text-gray-600">{incident.analysis.recommendation}</p>
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}