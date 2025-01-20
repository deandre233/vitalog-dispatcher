import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Search, Plus, AlertTriangle, Upload, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { MedicalHistorySearch } from "./MedicalHistorySearch";

export const MedicalTabContent = () => {
  const { toast } = useToast();
  const { patientName } = useParams();
  const [patientId, setPatientId] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState("known");
  const [isProcessing, setIsProcessing] = useState(false);
  const [documentType, setDocumentType] = useState("facesheet");

  useEffect(() => {
    const fetchPatientId = async () => {
      if (!patientName) return;
      
      const decodedName = decodeURIComponent(patientName);
      const [lastName, firstName] = decodedName.split(', ');
      
      const { data, error } = await supabase
        .from('patients')
        .select('id')
        .eq('first_name', firstName)
        .eq('last_name', lastName)
        .single();

      if (error) {
        console.error('Error fetching patient:', error);
        toast({
          title: "Error",
          description: "Could not fetch patient information",
          variant: "destructive",
        });
        return;
      }

      if (data) {
        setPatientId(data.id);
      }
    };

    fetchPatientId();
  }, [patientName, toast]);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const fileContent = e.target?.result as string;
        
        toast({
          title: `Processing ${documentType}`,
          description: "AI is analyzing the document...",
        });

        const { data, error } = await supabase.functions.invoke('analyze-medical-documents', {
          body: { fileContent, documentType }
        });

        if (error) throw error;

        const { error: updateError } = await supabase
          .from('patients')
          .update({
            medical_conditions: data.medicalConditions,
            medications: data.medications,
            allergies: data.allergies
          })
          .eq('id', patientId);

        if (updateError) throw updateError;

        toast({
          title: "Analysis complete",
          description: `Found ${data.medicalConditions.length} conditions, ${data.medications.length} medications, and ${data.allergies.length} allergies.`,
        });
      };

      reader.readAsText(file);
    } catch (error) {
      console.error('Error processing document:', error);
      toast({
        title: "Error",
        description: "Failed to process the medical document",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Medical and Surgical History</h3>
          <RadioGroup
            defaultValue={selectedStatus}
            onValueChange={setSelectedStatus}
            className="flex items-center space-x-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="known" id="known" />
              <Label htmlFor="known">Known</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="unknown" id="unknown" />
              <Label htmlFor="unknown">Unknown</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="none" id="none" />
              <Label htmlFor="none">None</Label>
            </div>
          </RadioGroup>

          {selectedStatus === "known" && patientId && (
            <MedicalHistorySearch
              patientId={patientId}
              onHistoryAdd={(history) => {
                toast({
                  title: "Success",
                  description: `Added ${history.description} to medical history`,
                });
              }}
            />
          )}

          {selectedStatus === "known" && !patientId && (
            <div className="p-4 border rounded-md bg-destructive/10 text-destructive">
              <AlertTriangle className="h-4 w-4 inline-block mr-2" />
              Loading patient information...
            </div>
          )}
        </div>
      </Card>

      <Card className="p-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Document Upload</h3>
          <div className="space-y-4">
            <Select value={documentType} onValueChange={setDocumentType}>
              <SelectTrigger>
                <SelectValue placeholder="Select document type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="facesheet">Face Sheet</SelectItem>
                <SelectItem value="discharge">Discharge Summary</SelectItem>
                <SelectItem value="history">Medical History</SelectItem>
              </SelectContent>
            </Select>
            <Input
              type="file"
              onChange={handleFileUpload}
              accept=".pdf,.doc,.docx,.txt"
            />
          </div>
        </div>
      </Card>
    </div>
  );
};

export default MedicalTabContent;
