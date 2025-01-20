import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Search, Plus, AlertTriangle, Upload, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { MedicalHistorySearch } from "./MedicalHistorySearch";

interface MedicalTabContentProps {
  patientId: string;
}

export const MedicalTabContent = ({ patientId }: MedicalTabContentProps) => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("known");
  const [isProcessing, setIsProcessing] = useState(false);
  const [documentType, setDocumentType] = useState("facesheet");
  const [medicationSearchTerm, setMedicationSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [selectedMedication, setSelectedMedication] = useState<any>(null);
  const [medicalHistory, setMedicalHistory] = useState<Array<{ code: string; description: string }>>([]);

  const handleSearch = async () => {
    setIsProcessing(true);
    try {
      const { data, error } = await supabase.functions.invoke('analyze-medical-search', {
        body: { searchTerm, type: 'condition' }
      });

      if (error) throw error;

      setSearchResults(data.results);
      toast({
        title: "Search Results",
        description: `Found ${data.results.length} matching conditions`,
      });

    } catch (error) {
      console.error('Error searching:', error);
      toast({
        title: "Error",
        description: "Failed to search medical conditions",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleMedicationSearch = async () => {
    setIsProcessing(true);
    try {
      const { data, error } = await supabase.functions.invoke('analyze-medical-search', {
        body: { searchTerm: medicationSearchTerm, type: 'medication' }
      });

      if (error) throw error;

      setSearchResults(data.results);
      toast({
        title: "Medication Search Results",
        description: `Found ${data.results.length} matching medications`,
      });

    } catch (error) {
      console.error('Error searching medications:', error);
      toast({
        title: "Error",
        description: "Failed to search medications",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAddCondition = async () => {
    try {
      const { data: patient, error: fetchError } = await supabase
        .from('patients')
        .select('medical_conditions')
        .eq('id', patientId)
        .single();

      if (fetchError) throw fetchError;

      const updatedConditions = [...(patient.medical_conditions || []), searchTerm];

      const { error: updateError } = await supabase
        .from('patients')
        .update({ medical_conditions: updatedConditions })
        .eq('id', patientId);

      if (updateError) throw updateError;

      toast({
        title: "Success",
        description: "Medical condition has been added to the patient's record.",
      });

      setSearchTerm("");
      setSearchResults([]);
    } catch (error) {
      console.error('Error adding condition:', error);
      toast({
        title: "Error",
        description: "Failed to add medical condition",
        variant: "destructive",
      });
    }
  };

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

  const handleHistoryAdd = async (history: { code: string; description: string }) => {
    try {
      const { error } = await supabase
        .from('medical_history')
        .insert({
          patient_id: patientId,
          type: 'condition',
          description: `${history.code} - ${history.description}`
        });

      if (error) throw error;

      setMedicalHistory([...medicalHistory, history]);
      toast({
        title: "Success",
        description: "Medical history has been added to the patient's record.",
      });
    } catch (error) {
      console.error('Error adding medical history:', error);
      toast({
        title: "Error",
        description: "Failed to add medical history",
        variant: "destructive",
      });
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

          {selectedStatus === "known" && (
            <MedicalHistorySearch
              patientId={patientId}
              onHistoryAdd={handleHistoryAdd}
            />
          )}
        </div>
      </Card>

      <Card className="p-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Current Medications</h3>
          <div className="flex gap-2">
            <Input
              placeholder="Search medications (e.g., 'Lisinopril' or 'diabetes')"
              value={medicationSearchTerm}
              onChange={(e) => setMedicationSearchTerm(e.target.value)}
              className="flex-1"
            />
            <Button 
              variant="secondary" 
              onClick={handleMedicationSearch}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Search className="h-4 w-4 mr-2" />
              )}
              Search
            </Button>
            <Button onClick={handleAddCondition}>
              <Plus className="h-4 w-4 mr-2" />
              Add
            </Button>
          </div>
          <ScrollArea className="h-[200px] border rounded-md p-4">
            {searchResults.map((med, index) => (
              <div key={index} className="py-2 border-b last:border-0">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-medium">{med.generic_name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {med.brand_names?.join(", ")} - {med.medication_class}
                    </p>
                  </div>
                  <div className="text-sm">
                    <p>Common dosages: {med.common_dosages?.join(", ")}</p>
                    <p>Frequency: {med.frequencies?.join(", ")}</p>
                  </div>
                </div>
                <div className="mt-1 flex flex-wrap gap-1">
                  {med.indications?.map((indication: string, i: number) => (
                    <Badge key={i} variant="outline" className="text-xs">
                      {indication}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </ScrollArea>
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
